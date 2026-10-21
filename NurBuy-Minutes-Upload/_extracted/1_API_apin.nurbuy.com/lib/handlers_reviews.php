<?php
/* Product reviews: anyone can read them; only a customer whose order with this product was Delivered can write one
 * (one review per customer and product, writing again changes it). */

/** Does this user have a Delivered order that contains the product? Returns that order id or ''. */
function review_order_for($uid, $pid) {
    foreach (db_rows("SELECT id, items FROM orders WHERE user_id=? AND status='Delivered' ORDER BY created_at DESC LIMIT 200", [$uid]) as $r) {
        $its = json_decode((string)$r['items'], true);
        if (!is_array($its)) continue;
        foreach ($its as $i) if (is_array($i) && isset($i['id']) && (string)$i['id'] === (string)$pid) return (string)$r['id'];
    }
    return '';
}
function review_name($n) {
    $n = trim((string)$n); if ($n === '') return 'Customer';
    $w = preg_split('/\s+/u', $n); $f = mb_substr($w[0], 0, 20);
    return count($w) > 1 ? $f . ' ' . mb_substr($w[count($w) - 1], 0, 1) . '.' : $f;
}
/** Profile photo address (http/https only) of each reviewer, so it follows the customer's current photo. */
function review_avatars($ids) {
    $out = []; $ids = array_values(array_unique(array_filter(array_map('strval', $ids))));
    if (!$ids) return $out;
    $ph = implode(',', array_fill(0, count($ids), '?'));
    foreach (db_rows("SELECT id, profile FROM users WHERE id IN ($ph)", $ids) as $u) {
        $raw = (string)($u['profile'] ?? '');
        if ($raw === '' || strpos($raw, '"avatar"') === false) continue;
        $p = json_decode($raw, true);
        $a = is_array($p) && is_string($p['avatar'] ?? null) ? $p['avatar'] : '';
        if (preg_match('#^https?://#i', $a)) $out[$u['id']] = $a;
    }
    return $out;
}
/** GET /reviews/{pid} -> {avg, count, dist:{1..5}, list:[{n,s,t,d}], mine:{s,t}|null, can:bool} */
function h_reviews_get($pid) {
    $u = optional_user();
    $dist = [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0];
    foreach (db_rows('SELECT stars, COUNT(*) c FROM product_reviews WHERE pid=? GROUP BY stars', [$pid]) as $r) { $k = (int)$r['stars']; if (isset($dist[$k])) $dist[$k] = (int)$r['c']; }
    $cnt = array_sum($dist);
    $avg = $cnt ? round(($dist[1] + 2 * $dist[2] + 3 * $dist[3] + 4 * $dist[4] + 5 * $dist[5]) / $cnt, 1) : 0;
    $list = [];
    $rows = db_rows('SELECT user_id, stars, body, uname, created_at FROM product_reviews WHERE pid=? ORDER BY created_at DESC, id DESC LIMIT 100', [$pid]);
    $img = review_avatars(array_map(function ($r) { return $r['user_id']; }, $rows));
    foreach ($rows as $r)
        $list[] = ['n' => (string)$r['uname'], 's' => (int)$r['stars'], 't' => (string)$r['body'], 'd' => (int)$r['created_at'], 'img' => $img[$r['user_id']] ?? ''];
    $mine = null; $can = false;
    if ($u) {
        $m = db_row('SELECT stars, body FROM product_reviews WHERE pid=? AND user_id=?', [$pid, $u['id']]);
        if ($m) $mine = ['s' => (int)$m['stars'], 't' => (string)$m['body']];
        $can = review_order_for($u['id'], $pid) !== '';
    }
    json_out(['avg' => $avg, 'count' => $cnt, 'dist' => $dist, 'list' => $list, 'mine' => $mine, 'can' => $can]);
}
/** POST /reviews/{pid} {s: 1..5, t: text} */
function h_review_post($pid) {
    $u = require_user();
    $b = body_json();
    $s = isset($b['s']) && is_num($b['s']) ? (int)$b['s'] : 0;
    if ($s < 1 || $s > 5) fail(400, 'Choose 1 to 5 stars', 's');
    $t = clean_str($b['t'] ?? '', 1000);
    $oid = review_order_for($u['id'], $pid);
    if ($oid === '') fail(403, 'Only customers who received this product can review it', 'pid');
    $now = now_ts();
    $nm = review_name($u['name'] ?? '');
    if (db_row('SELECT id FROM product_reviews WHERE pid=? AND user_id=?', [$pid, $u['id']]))
        q('UPDATE product_reviews SET stars=?, body=?, uname=?, order_id=?, updated_at=? WHERE pid=? AND user_id=?', [$s, $t, $nm, $oid, $now, $pid, $u['id']]);
    else {
        try { q('INSERT INTO product_reviews (pid, user_id, order_id, stars, body, uname, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)', [$pid, $u['id'], $oid, $s, $t, $nm, $now, $now]); }
        catch (PDOException $e) { if (!is_unique_violation($e)) throw $e; }
    }
    h_reviews_get($pid);
}

/** GET /reviews/summary -> {r: {pid: [avg, count]}} for every product that has at least one review (product cards use it). */
function h_reviews_summary() {
    $out = [];
    foreach (db_rows('SELECT pid, COUNT(*) c, AVG(stars) a FROM product_reviews GROUP BY pid ORDER BY c DESC LIMIT 5000') as $r)
        $out[(string)$r['pid']] = [round((float)$r['a'], 1), (int)$r['c']];
    header('Cache-Control: public, max-age=20');
    json_out(['r' => $out ?: new stdClass()]);
}
