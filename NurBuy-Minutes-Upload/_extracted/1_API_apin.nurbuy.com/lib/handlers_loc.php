<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * Delivery locations, shop opening hours and shop followers.
 *
 * NurBuy Minutes: District > Thana/Upazila > Village/Area.
 * Each village/area has its own delivery charge, delivery time (minutes) and
 * rider payment. (A legacy table loc_exp may still exist in old databases; it is
 * never read or written.)
 * Customers only ever see active places.
 * ===================================================================== */

const LOC_TABLE = 'loc_min';
const LOC_MAX = 3;       // deepest level (village / area)
const LOC_FEE_LVL = 3;   // level that carries the delivery charge, time and rider payment
const LOC_NEED = 3;      // a complete address needs this level
const LOC_FREE = 499;    // default free-delivery amount, used only until the admin sets one

/** Free-delivery minimum: the admin setting (Settings > free delivery above), else the default. */
function loc_free() {
    $v = state_setting('freeAbove', null);
    return (is_num($v) && (float)$v >= 0) ? (float)$v : (float)LOC_FREE;
}
const MIN_ETA_MAX = 59;

function loc_bust() { q('DELETE FROM kv WHERE k=?', ['loc_pub_min']); }

/** One time: the old Post Office level is gone. Villages move up under their thana; post offices are removed. */
function loc_flatten3() {
    if (kv_get('loc_flat3')) return;
    $t = LOC_TABLE;
    db_tx(function () use ($t) {
        $po = db_rows("SELECT id, parent_id FROM $t WHERE lvl=3");
        foreach ($po as $r) {
            q("UPDATE $t SET parent_id=?, lvl=3 WHERE parent_id=? AND lvl=4", [(int)$r['parent_id'], (int)$r['id']]);
        }
        // anything still at level 4 had no live post office above it
        q("DELETE FROM $t WHERE lvl=4");
        foreach ($po as $r) q("DELETE FROM $t WHERE id=? AND lvl=3 AND NOT EXISTS (SELECT 1 FROM $t c WHERE c.parent_id=?)", [(int)$r['id'], (int)$r['id']]);
    });
    kv_set('loc_flat3', '1');
    loc_bust();
}

/* ---- shop delivery coverage: the places (district / thana / village) a shop delivers to; none chosen = everywhere ---- */
function coverage_parse($raw) {
    $j = json_decode((string)$raw, true);
    if (!is_array($j)) return [];
    $o = []; foreach ($j as $x) if (is_int($x) || (is_string($x) && ctype_digit($x))) $o[] = (int)$x;
    return array_values(array_unique($o));
}
/** Does a shop that delivers to $cov reach the customer who chose the place with id $locId? */
function coverage_reaches($cov, $locId) {
    if (!$cov) return true;
    $path = loc_path((int)$locId);
    if (!$path) return false;
    foreach ($path as $r) if (in_array((int)$r['id'], $cov, true)) return true;
    return false;
}
/** Readable list for the admin: [{id, lvl, name, bn, path}] */
function coverage_out($cov) {
    $out = [];
    foreach ($cov as $id) {
        $path = loc_path($id);
        if (!$path) continue;
        $last = end($path);
        $out[] = ['id' => (int)$last['id'], 'lvl' => (int)$last['lvl'], 'name' => $last['name'], 'bn' => $last['bn'] ?: $last['name'],
                  'path' => array_map(function ($r) { return $r['name']; }, array_slice($path, 0, -1))];
    }
    return $out;
}
function h_admin_seller_coverage($id) {
    require_admin();
    $r = db_row('SELECT * FROM sellers WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Seller not found');
    $b = body_json();
    $ids = $b['ids'] ?? null;
    if (!is_array($ids)) fail(400, 'ids must be a list', 'ids');
    if (count($ids) > 400) fail(400, 'Too many places chosen. Choose a bigger place (a whole thana or district) instead.', 'ids');
    $clean = [];
    foreach ($ids as $x) {
        if (!is_num($x) || (int)$x <= 0) fail(400, 'Invalid place', 'ids');
        $p = loc_path((int)$x);
        if (!$p || (int)$p[0]['lvl'] !== 1) fail(404, 'A chosen place no longer exists. Reload the page and try again.', 'ids');
        $clean[(int)$x] = true;
    }
    // a place inside an already chosen bigger place is redundant
    $keep = [];
    foreach (array_keys($clean) as $x) {
        $p = loc_path($x); $dup = false;
        foreach (array_slice($p, 0, -1) as $anc) if (isset($clean[(int)$anc['id']])) $dup = true;
        if (!$dup) $keep[] = $x;
    }
    q('UPDATE sellers SET coverage=? WHERE id=?', [$keep ? json_encode($keep) : null, (int)$id]);
    json_out(['coverage' => coverage_out($keep)]);
}

/** First use: districts and thanas from the bundled Bangladesh list, all switched off. */
function loc_seed() {
    loc_flatten3();
    $t = LOC_TABLE;
    if (kv_get('loc_seeded_min') || (int)db_val("SELECT COUNT(*) FROM $t") > 0) return;
    $j = json_decode((string)@file_get_contents(__DIR__ . '/../assets/geo-bd.json'), true);
    if (!is_array($j) || empty($j['d'])) return;
    $on = 0;
    db_tx(function () use ($j, $t, $on) {
        $now = now_ts(); $pdo = db(); $dd = [];
        $ds = $j['d']; usort($ds, function ($a, $b) { return strcmp($a[1], $b[1]); });
        foreach ($ds as $i => $x) { q("INSERT INTO $t (parent_id, lvl, name, bn, active, fee, sort, created_at) VALUES (0,1,?,?,?,NULL,?,?)", [$x[1], $x[2], $on, $i, $now]); $dd[$x[0]] = (int)$pdo->lastInsertId(); }
        foreach ($j['u'] as $dc => $list) {
            if (!isset($dd[$dc])) continue;
            $ph = []; $par = [];
            foreach ($list as $i => $x) { $ph[] = '(?,2,?,?,?,NULL,?,?)'; array_push($par, $dd[$dc], $x[1], $x[2], $on, $i, $now); }
            if ($ph) q("INSERT INTO $t (parent_id, lvl, name, bn, active, fee, sort, created_at) VALUES " . implode(',', $ph), $par);
        }
    });
    kv_set('loc_seeded_min', '1');
}
function loc_seed_safe() { try { loc_seed(); } catch (Throwable $e) { error_log('loc_seed: ' . $e->getMessage()); } }

/** Default delivery charge when a place has none: the admin setting, else 30. */
function loc_default_fee() {
    $v = state_setting('feeMin', null);
    return (is_num($v) && (float)$v >= 0) ? money($v) : 30.0;
}

/** Active places for the website. Branches that cannot reach a complete address are left out. */
function loc_public() {
    $t = LOC_TABLE;
    $c = kv_get('loc_pub_min');
    if ($c) { $j = json_decode((string)$c['v'], true); if (is_array($j)) { $j['def'] = loc_default_fee(); $j['eta'] = delivery_eta_default(); $j['free'] = loc_free(); return $j; } }
    $rows = db_rows("SELECT * FROM $t WHERE active=1 ORDER BY lvl, sort, name");
    $kids = []; $by = [];
    foreach ($rows as $r) { $by[(int)$r['id']] = $r; $kids[(int)$r['parent_id']][] = (int)$r['id']; }
    $need = LOC_NEED;
    // keep a node when it is complete at its level or has a kept child
    $keep = [];
    $walk = function ($id) use (&$walk, &$keep, $kids, $by, $need) {
        $r = $by[$id]; $ok = (int)$r['lvl'] >= $need;
        foreach ($kids[$id] ?? [] as $k) if ($walk($k)) $ok = true;
        if ($ok) $keep[$id] = true;
        return $ok;
    };
    foreach ($kids[0] ?? [] as $id) if ((int)$by[$id]['lvl'] === 1) $walk($id);
    // village rows: [id, name, bn, delivery charge, delivery minutes]
    $row = function ($r) { $o = [(int)$r['id'], $r['name'], $r['bn'] ?: $r['name']]; if ((int)$r['lvl'] === LOC_FEE_LVL) { $o[] = $r['fee'] === null ? null : money($r['fee']); $o[] = isset($r['eta']) && $r['eta'] !== null ? (int)$r['eta'] : null; } return $o; };
    $out = ['d' => [], 'c' => new stdClass()];
    $ch = [];
    foreach ($rows as $r) {
        $id = (int)$r['id']; if (!isset($keep[$id])) continue;
        if ((int)$r['lvl'] === 1) $out['d'][] = $row($r);
        else { $p = (int)$r['parent_id']; if (!isset($keep[$p])) continue; $ch[(string)$p][] = $row($r); }
    }
    if ($ch) $out['c'] = $ch;
    $out['lv'] = LOC_MAX; $out['need'] = $need;
    $out['ver'] = (string)now_ts();
    kv_set('loc_pub_min', json_encode($out, JSON_UNESCAPED_UNICODE));
    $out['def'] = loc_default_fee();
    $out['eta'] = delivery_eta_default();
    $out['free'] = loc_free();
    return $out;
}
function h_geo() {
    loc_seed_safe();
    $g = ['min' => loc_public()];
    $et = '"l' . $g['min']['ver'] . '.' . $g['min']['def'] . '.' . $g['min']['eta'] . '.' . $g['min']['free'] . '"';
    header('Cache-Control: no-cache'); header('ETag: ' . $et);
    if (trim((string)($_SERVER['HTTP_IF_NONE_MATCH'] ?? '')) === $et) { http_response_code(304); exit; }
    json_out($g);
}

/** Path (top first) of a place; null when missing. */
function loc_path($id) {
    $t = LOC_TABLE; $path = [];
    for ($i = 0; $id && $i < 6; $i++) { $r = db_row("SELECT * FROM $t WHERE id=?", [(int)$id]); if (!$r) return null; array_unshift($path, $r); $id = (int)$r['parent_id']; }
    return $path;
}
/** Order checkout: validates the chosen place for this service and returns [names, fee base]. */
function loc_resolve($id) {
    $path = loc_path((int)$id);
    if (!$path || (int)$path[0]['lvl'] !== 1) fail(400, 'Choose your delivery area again', 'loc', 'loc_invalid');
    foreach ($path as $r) if (!(int)$r['active']) fail(409, 'NurBuy does not deliver to this area right now', 'loc', 'loc_inactive');
    $last = end($path);
    if ((int)$last['lvl'] < LOC_NEED) fail(400, 'Choose your full delivery area', 'loc', 'loc_incomplete');
    // a deeper level that exists must be chosen (the village is required)
    $base = null;
    foreach ($path as $r) if ((int)$r['lvl'] === LOC_FEE_LVL && $r['fee'] !== null) $base = money($r['fee']);
    if ($base === null) $base = loc_default_fee();
    $names = array_map(function ($r) { return ['id' => (int)$r['id'], 'n' => $r['name'], 'bn' => $r['bn'] ?: $r['name']]; }, $path);
    return [$names, $base];
}
/** Delivery charge for an order (same rule the website shows). */
function loc_fee($base, $sub, $shops) {
    if ($sub >= loc_free()) return 0.0;
    return money($base * max(1, $shops));
}

/* ---------- admin: location manager ---------- */
function loc_row_out($r, $counts = []) {
    return ['id' => (int)$r['id'], 'parent_id' => (int)$r['parent_id'], 'lvl' => (int)$r['lvl'], 'name' => $r['name'], 'bn' => $r['bn'] ?? '',
            'active' => (int)$r['active'] === 1, 'fee' => $r['fee'] === null ? null : money($r['fee']),
            'eta' => isset($r['eta']) && $r['eta'] !== null ? (int)$r['eta'] : null, 'rider_pay' => isset($r['rider_pay']) && $r['rider_pay'] !== null ? money($r['rider_pay']) : null,
            'children' => $counts[(int)$r['id']][0] ?? 0, 'active_children' => $counts[(int)$r['id']][1] ?? 0];
}
function h_admin_loc() {
    require_admin();
    $t = LOC_TABLE;
    loc_seed_safe();
    $meta = ['sys' => 'min', 'max' => LOC_MAX, 'fee_lvl' => LOC_FEE_LVL, 'need' => LOC_NEED, 'def' => loc_default_fee(), 'free' => loc_free(),
             'eta_def' => delivery_eta_default(), 'pay_def' => rider_pay_default()];
    $qs = trim((string)($_GET['q'] ?? ''));
    if ($qs !== '') {
        $l = '%' . $qs . '%';
        $rows = db_rows("SELECT * FROM $t WHERE name LIKE ? OR bn LIKE ? ORDER BY lvl, name LIMIT 80", [$l, $l]);
        json_out(['items' => array_map(function ($r) { $o = loc_row_out($r); $p = loc_path((int)$r['parent_id']) ?: []; $o['path'] = array_map(function ($x) { return $x['name']; }, $p); return $o; }, $rows), 'path' => [], 'search' => true, 'meta' => $meta]);
    }
    $pid = max(0, (int)($_GET['parent'] ?? 0));
    $rows = db_rows("SELECT * FROM $t WHERE parent_id=? ORDER BY sort, name", [$pid]);
    $counts = [];
    if ($rows) {
        $ids = array_map(function ($r) { return (int)$r['id']; }, $rows);
        foreach (db_rows("SELECT parent_id, COUNT(*) n, SUM(active) a FROM $t WHERE parent_id IN (" . implode(',', $ids) . ') GROUP BY parent_id') as $c) $counts[(int)$c['parent_id']] = [(int)$c['n'], (int)$c['a']];
    }
    $tot = []; foreach (db_rows("SELECT lvl, COUNT(*) n, COALESCE(SUM(active),0) a FROM $t GROUP BY lvl") as $x) $tot[(int)$x['lvl']] = ['total' => (int)$x['n'], 'active' => (int)$x['a']];
    $path = $pid ? (loc_path($pid) ?: []) : [];
    json_out(['items' => array_map(function ($r) use ($counts) { return loc_row_out($r, $counts); }, $rows), 'path' => array_map('loc_row_out', $path), 'levels' => $tot ?: new stdClass(), 'meta' => $meta]);
}
function loc_eta_in($v) {
    if ($v === null || $v === '') return null;
    if (!is_num($v) || (int)$v != (float)$v || (int)$v < 5 || (int)$v > 240) fail(400, 'Delivery time must be 5 to 240 minutes', 'eta');
    return (int)$v;
}
function loc_pay_in($v) {
    if ($v === null || $v === '') return null;
    if (!is_num($v) || (float)$v < 0 || (float)$v > 10000) fail(400, 'Enter a valid rider payment', 'rider_pay');
    return money($v);
}
function loc_fee_in($b) {
    if (!array_key_exists('fee', $b) || $b['fee'] === null || $b['fee'] === '') return [true, null];
    if (!is_num($b['fee']) || (float)$b['fee'] < 0 || (float)$b['fee'] > 100000) fail(400, 'Enter a valid delivery charge', 'fee');
    return [true, money($b['fee'])];
}
function h_admin_loc_create() {
    require_admin();
    $t = LOC_TABLE;
    loc_seed_safe();
    $b = body_json();
    $pid = (int)($b['parent_id'] ?? 0);
    $name = clean_str($b['name'] ?? '', 120); $bn = clean_str($b['bn'] ?? '', 120);
    if ($name === '' && $bn === '') fail(400, 'Write a name', 'name');
    $lvl = 1;
    if ($pid) { $p = db_row("SELECT * FROM $t WHERE id=?", [$pid]); if (!$p) fail(404, 'Parent place not found'); $lvl = (int)$p['lvl'] + 1; if ($lvl > LOC_MAX) fail(400, 'This level cannot have places inside it'); }
    $name = $name !== '' ? $name : $bn;
    if (db_val("SELECT 1 FROM $t WHERE parent_id=? AND (LOWER(name)=LOWER(?) OR bn=?) LIMIT 1", [$pid, $name, $bn !== '' ? $bn : '-'])) fail(409, 'This name already exists here', 'name');
    $fee = null; $eta = null; $pay = null;
    if ($lvl === LOC_FEE_LVL) { list(, $fee) = loc_fee_in($b); $eta = loc_eta_in($b['eta'] ?? null); $pay = loc_pay_in($b['rider_pay'] ?? null); }
    $on = array_key_exists('active', $b) ? ($b['active'] ? 1 : 0) : 1;
    $sort = (int)db_val("SELECT COALESCE(MAX(sort),0)+1 FROM $t WHERE parent_id=?", [$pid]);
    q("INSERT INTO $t (parent_id, lvl, name, bn, active, fee, sort, created_at) VALUES (?,?,?,?,?,?,?,?)", [$pid, $lvl, $name, $bn ?: null, $on, $fee, $sort, now_ts()]);
    $id = (int)db()->lastInsertId();
    if ($eta !== null || $pay !== null) q('UPDATE loc_min SET eta=?, rider_pay=? WHERE id=?', [$eta, $pay, $id]);
    loc_bust();
    json_out(['item' => loc_row_out(db_row("SELECT * FROM $t WHERE id=?", [$id]))], 201);
}
function h_admin_loc_update($id) {
    require_admin();
    $t = LOC_TABLE;
    $r = db_row("SELECT * FROM $t WHERE id=?", [(int)$id]);
    if (!$r) fail(404, 'Place not found');
    $b = body_json(); $set = []; $par = [];
    if (array_key_exists('name', $b)) {
        $n = clean_str($b['name'], 120); if ($n === '') fail(400, 'Write a name', 'name');
        if (db_val("SELECT 1 FROM $t WHERE parent_id=? AND id<>? AND LOWER(name)=LOWER(?) LIMIT 1", [(int)$r['parent_id'], (int)$id, $n])) fail(409, 'This name already exists here', 'name');
        $set[] = 'name=?'; $par[] = $n;
    }
    if (array_key_exists('bn', $b)) { $set[] = 'bn=?'; $par[] = clean_str($b['bn'], 120) ?: null; }
    if (array_key_exists('active', $b)) { $set[] = 'active=?'; $par[] = $b['active'] ? 1 : 0; }
    if (array_key_exists('fee', $b)) {
        if ((int)$r['lvl'] !== LOC_FEE_LVL) fail(400, 'Delivery charge is set on a village / area', 'fee');
        list(, $fee) = loc_fee_in($b); $set[] = 'fee=?'; $par[] = $fee;
    }
    foreach (['eta' => 'loc_eta_in', 'rider_pay' => 'loc_pay_in'] as $k => $fn) if (array_key_exists($k, $b)) {
        if ((int)$r['lvl'] !== LOC_FEE_LVL) fail(400, 'Delivery time and rider payment are set on a village / area', $k);
        $set[] = "$k=?"; $par[] = $fn($b[$k]);
    }
    if ($set) { $par[] = (int)$id; q("UPDATE $t SET " . implode(',', $set) . ' WHERE id=?', $par); }
    foreach (['children_eta' => ['eta', 'loc_eta_in'], 'children_rider_pay' => ['rider_pay', 'loc_pay_in']] as $k => $x) if (array_key_exists($k, $b)) {
        if ((int)$r['lvl'] + 1 !== LOC_FEE_LVL) fail(400, 'Only the villages inside a thana can be set together', $k);
        q("UPDATE loc_min SET {$x[0]}=? WHERE parent_id=?", [$x[1]($b[$k]), (int)$id]);
    }
    if (array_key_exists('children_active', $b)) q("UPDATE $t SET active=? WHERE parent_id=?", [$b['children_active'] ? 1 : 0, (int)$id]);
    if (array_key_exists('children_fee', $b)) {
        if ((int)$r['lvl'] + 1 !== LOC_FEE_LVL) fail(400, 'Places inside this one have no delivery charge', 'fee');
        list(, $fee) = loc_fee_in(['fee' => $b['children_fee']]);
        q("UPDATE $t SET fee=? WHERE parent_id=?", [$fee, (int)$id]);
    }
    loc_bust();
    json_out(['item' => loc_row_out(db_row("SELECT * FROM $t WHERE id=?", [(int)$id]))]);
}
function h_admin_loc_delete($id) {
    require_admin();
    $t = LOC_TABLE;
    $r = db_row("SELECT * FROM $t WHERE id=?", [(int)$id]);
    if (!$r) fail(404, 'Place not found');
    if (db_val("SELECT 1 FROM $t WHERE parent_id=? LIMIT 1", [(int)$id])) fail(409, 'Remove or move the places inside it first', null, 'has_children');
    q("DELETE FROM $t WHERE id=?", [(int)$id]);
    loc_bust();
    json_out(['ok' => true]);
}

/* =====================================================================
 * Shop opening hours (Asia/Dhaka). Stored on sellers.hours as
 * {"d":[[open,close]|null x7]} in minutes from midnight, index 0 = Sunday.
 * close <= open means the shop stays open past midnight.
 * ===================================================================== */
function hours_parse($json) {
    $d = is_array($json) ? $json : json_decode((string)$json, true);
    if (!is_array($d) || !isset($d['d']) || !is_array($d['d']) || count($d['d']) !== 7) return null;
    return $d;
}
function hours_validate($raw) {
    if ($raw === null || $raw === '' || $raw === false) return null;
    if (!is_array($raw) || !isset($raw['d']) || !is_array($raw['d']) || count($raw['d']) !== 7) fail(400, 'Set opening hours for all 7 days', 'hours');
    $out = []; $any = false;
    foreach (array_values($raw['d']) as $x) {
        if ($x === null || $x === false) { $out[] = null; continue; }
        if (!is_array($x) || count($x) !== 2 || !is_num($x[0]) || !is_num($x[1])) fail(400, 'Invalid opening time', 'hours');
        $o = (int)$x[0]; $c = (int)$x[1];
        if ($o < 0 || $o > 1439 || $c < 1 || $c > 1440 || $o === $c) fail(400, 'Opening and closing time must be different', 'hours');
        $out[] = [$o, $c]; $any = true;
    }
    if (!$any) fail(400, 'Keep the shop open on at least one day', 'hours');
    return ['d' => $out];
}
/** [day index 0=Sunday, minutes] for Dhaka time now. */
function dhaka_now($ts = null) {
    $t = ($ts ?? now_ts()) + 6 * 3600;
    return [(int)gmdate('w', $t), (int)gmdate('G', $t) * 60 + (int)gmdate('i', $t)];
}
function hours_open($h, $ts = null) {
    $h = hours_parse($h);
    if (!$h) return true; // no hours set: always open
    list($dw, $m) = dhaka_now($ts);
    $td = $h['d'][$dw];
    if ($td && $m >= $td[0] && ($td[1] > $td[0] ? $m < $td[1] : true)) return true;
    $yd = $h['d'][($dw + 6) % 7];
    if ($yd && $yd[1] <= $yd[0] && $m < $yd[1]) return true;
    return false;
}
function seller_is_food($s) { return (bool)preg_match('/food|restaurant|restuarant|cafe|kitchen|খাবার|রেস্টুরেন্ট|রেস্তোরাঁ|হোটেল/iu', (string)($s['category'] ?? '')); }

/* ---------- shop followers ---------- */
function follow_store_ok($store) {
    if (!is_string($store) || !preg_match('/^[A-Za-z0-9_-]{1,40}$/', $store)) fail(400, 'Invalid shop', 'store');
    if (preg_match('/^SL(\d+)$/', $store, $m)) { if (!db_val("SELECT 1 FROM sellers WHERE id=? AND status='approved'", [(int)$m[1]])) fail(404, 'Shop not found'); return; }
    list($D) = admin_state();
    foreach (($D['stores'] ?? []) as $st) if (is_array($st) && (string)($st['id'] ?? '') === $store) return;
    fail(404, 'Shop not found');
}
function follow_counts($ids = null) {
    $out = [];
    if ($ids === null) { foreach (db_rows('SELECT store, COUNT(*) c FROM shop_follows GROUP BY store') as $r) $out[$r['store']] = (int)$r['c']; return $out; }
    $ids = array_values(array_unique(array_filter($ids, function ($x) { return is_string($x) && preg_match('/^[A-Za-z0-9_-]{1,40}$/', $x); })));
    if (!$ids) return $out;
    $ids = array_slice($ids, 0, 200);
    foreach (db_rows('SELECT store, COUNT(*) c FROM shop_follows WHERE store IN (' . implode(',', array_fill(0, count($ids), '?')) . ') GROUP BY store', $ids) as $r) $out[$r['store']] = (int)$r['c'];
    foreach ($ids as $i) if (!isset($out[$i])) $out[$i] = 0;
    return $out;
}
function h_follow_counts() {
    header('Cache-Control: no-cache');
    $ids = array_filter(array_map('trim', explode(',', (string)($_GET['ids'] ?? ''))));
    json_out(['counts' => follow_counts($ids) ?: new stdClass()]);
}
function h_follows_mine() {
    $u = require_user();
    json_out(['stores' => array_map(function ($r) { return $r['store']; }, db_rows('SELECT store FROM shop_follows WHERE user_id=? ORDER BY created_at DESC LIMIT 500', [$u['id']]))]);
}
function h_follow_set($store) {
    $u = require_user();
    follow_store_ok($store);
    $b = body_json();
    $on = !array_key_exists('on', $b) || !empty($b['on']);
    if ($on) {
        try { q('INSERT INTO shop_follows (store, user_id, created_at) VALUES (?,?,?)', [$store, $u['id'], now_ts()]); }
        catch (PDOException $e) { if (!is_unique_violation($e)) throw $e; }
    } else q('DELETE FROM shop_follows WHERE store=? AND user_id=?', [$store, $u['id']]);
    json_out(['store' => $store, 'on' => $on, 'count' => (int)db_val('SELECT COUNT(*) FROM shop_follows WHERE store=?', [$store])]);
}
