<?php
/* NurBuy visitor tracking (consent aware), the admin "User Data" views, retention clean-up and the recent-products API. */
if (!defined('NB')) { http_response_code(403); exit; }

const UD_EVENTS = ['visit', 'view', 'cart', 'checkout', 'ping', 'page', 'click'];
const UD_PAGES = ['home', 'shop', 'product', 'category', 'cart', 'checkout', 'orders', 'account', 'search', 'policy', 'other'];

/** Records one visitor event. IP, signed-in link and page detail are kept only when the browser says the visitor agreed (c=1). */
function h_track() {
    $raw = raw_body();
    $b = json_decode(strlen($raw) <= 900 ? $raw : '', true);
    $ok = function ($x) { return is_string($x) && preg_match('/^[A-Za-z0-9]{8,40}$/', $x); };
    if (!is_array($b) || !$ok($b['v'] ?? null) || !$ok($b['s'] ?? null)) { http_response_code(204); exit; }
    $ev = (string)($b['e'] ?? '');
    if (!in_array($ev, UD_EVENTS, true)) { http_response_code(204); exit; }
    $cfg = fr_cfg();
    $v = $b['v']; $t = now_ts();
    $cons = !empty($b['c']) && (int)$cfg['personalization'] === 1;
    $pid = isset($b['p']) && is_scalar($b['p']) ? clean_str((string)$b['p'], 40) : null;
    $w = in_array($b['w'] ?? '', ['min'], true) ? $b['w'] : null;
    $pg = isset($b['pg']) && in_array($b['pg'], UD_PAGES, true) ? $b['pg'] : null;
    $cat = isset($b['cat']) && is_string($b['cat']) ? clean_str(strip_tags($b['cat']), 80) : null;
    $pn = isset($b['pn']) && is_string($b['pn']) ? clean_str(strip_tags($b['pn']), 120) : null;
    $ip = null; $uid = null;
    if ($cons) {
        if ((int)$cfg['collect_ip'] === 1) $ip = client_ip();
        $s = current_session();
        if ($s && $s['role'] === 'user' && db_val('SELECT 1 FROM users WHERE id=?', [$s['user_id']])) $uid = (string)$s['user_id'];
    }
    try {
        if ($ip !== null && (int)db_val('SELECT COUNT(*) FROM an_events WHERE ip=? AND created_at>?', [$ip, $t - 60]) >= 120) { http_response_code(204); exit; }
        if (db_driver() === 'mysql') q('INSERT INTO an_visitors (vid, first_at, last_at, uid, ip, pers) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE last_at=VALUES(last_at), pers=VALUES(pers), ip=COALESCE(VALUES(ip), ip), uid=COALESCE(VALUES(uid), uid)', [$v, $t, $t, $uid, $ip, $cons ? 1 : 0]);
        else q('INSERT INTO an_visitors (vid, first_at, last_at, uid, ip, pers) VALUES (?,?,?,?,?,?) ON CONFLICT(vid) DO UPDATE SET last_at=excluded.last_at, pers=excluded.pers, ip=COALESCE(excluded.ip, ip), uid=COALESCE(excluded.uid, uid)', [$v, $t, $t, $uid, $ip, $cons ? 1 : 0]);
        if (!$cons) q('UPDATE an_visitors SET ip=NULL, uid=NULL WHERE vid=? AND pers=0', [$v]);
        if ($ev !== 'ping') {
            $dup = in_array($ev, ['visit', 'checkout'], true) && db_val('SELECT 1 FROM an_events WHERE sid=? AND ev=? AND created_at>=? LIMIT 1', [$b['s'], $ev, $t - 43200]);
            if (!$dup) q('INSERT INTO an_events (vid, sid, ev, pid, uid, vw, created_at, ip, pg, cat, pn) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [$v, $b['s'], $ev, $pid, $uid, $w, $t, $ip, $pg, $cat, $pn]);
        }
        if (random_int(1, 500) === 1) ud_purge();
    } catch (Throwable $e) { error_log('track: ' . $e->getMessage()); }
    http_response_code(204); exit;
}

/** Retention: old events are deleted, old IP addresses are blanked. Returns the row counts for the admin. */
function ud_purge() {
    $c = fr_cfg(); $t = now_ts();
    $a = db_exec('DELETE FROM an_events WHERE created_at<?', [$t - (int)$c['keep_events_days'] * 86400]);
    $b = db_exec('UPDATE an_events SET ip=NULL WHERE ip IS NOT NULL AND created_at<?', [$t - (int)$c['keep_ip_days'] * 86400]);
    $d = db_exec('DELETE FROM an_visitors WHERE last_at<?', [$t - (int)$c['keep_events_days'] * 86400]);
    db_exec('UPDATE an_visitors SET ip=NULL WHERE ip IS NOT NULL AND last_at<?', [$t - (int)$c['keep_ip_days'] * 86400]);
    $e = db_exec('UPDATE orders SET ip=NULL WHERE ip IS NOT NULL AND created_at<?', [$t - (int)$c['keep_order_ip_days'] * 86400]);
    db_exec('DELETE FROM rate_hits WHERE ts<?', [$t - 86400]);
    return ['events' => $a, 'ips' => $b, 'visitors' => $d, 'order_ips' => $e];
}
function db_exec($sql, $p) { return q($sql, $p)->rowCount(); }

/** The visitor (or signed-in customer) asks to erase their stored activity. */
function h_privacy_forget() {
    $b = body_json();
    $s = current_session();
    rl_hit('forget:' . client_ip(), 10, 3600);
    $n = 0;
    if (isset($b['v']) && is_string($b['v']) && preg_match('/^[A-Za-z0-9]{8,40}$/', $b['v'])) {
        $n += db_exec('DELETE FROM an_events WHERE vid=?', [$b['v']]);
        db_exec('DELETE FROM an_visitors WHERE vid=?', [$b['v']]);
    }
    if ($s && $s['role'] === 'user') {
        $n += db_exec('DELETE FROM an_events WHERE uid=?', [$s['user_id']]);
        db_exec('UPDATE an_visitors SET uid=NULL WHERE uid=?', [$s['user_id']]);
    }
    json_out(['ok' => true, 'removed' => $n]);
}

/** The last products this visitor (or signed-in customer) opened, for returning-visit suggestions on any device. */
function h_reco_recent() {
    $v = (string)($_GET['v'] ?? ''); $s = current_session();
    $uid = $s && $s['role'] === 'user' ? (string)$s['user_id'] : null;
    if (!$uid && !preg_match('/^[A-Za-z0-9]{8,40}$/', $v)) json_out(['recent' => []]);
    rl_hit('reco:' . client_ip(), 120, 3600);
    $rows = $uid ? db_rows("SELECT e.pid, e.pn, e.cat, e.created_at FROM an_events e JOIN an_visitors a ON a.vid=e.vid WHERE e.ev='view' AND e.pid IS NOT NULL AND (e.uid=? OR a.uid=?) AND a.pers=1 ORDER BY e.id DESC LIMIT 12", [$uid, $uid])
                 : db_rows("SELECT e.pid, e.pn, e.cat, e.created_at FROM an_events e JOIN an_visitors a ON a.vid=e.vid WHERE e.vid=? AND e.ev='view' AND e.pid IS NOT NULL AND a.pers=1 ORDER BY e.id DESC LIMIT 12", [$v]);
    $out = []; $seen = [];
    foreach ($rows as $r) { if (isset($seen[$r['pid']])) continue; $seen[$r['pid']] = 1; $out[] = ['id' => $r['pid'], 'cat' => $r['cat'] ?? '', 'at' => (int)$r['created_at'] * 1000]; if (count($out) === 2) break; }
    json_out(['recent' => $out]);
}

/* ================= admin: User Data ================= */

function ud_like($s) { return '%' . str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $s) . '%'; }
/** Last two different products a visitor opened. */
function ud_last2($where, $par) {
    $out = []; $seen = [];
    foreach (db_rows("SELECT pid, pn, cat, created_at FROM an_events WHERE ev='view' AND pid IS NOT NULL AND $where ORDER BY id DESC LIMIT 12", $par) as $r) {
        if (isset($seen[$r['pid']])) continue; $seen[$r['pid']] = 1;
        $out[] = ['id' => $r['pid'], 'name' => $r['pn'] ?? '', 'cat' => $r['cat'] ?? '', 'at' => (int)$r['created_at']];
        if (count($out) === 2) break;
    }
    return $out;
}
function h_admin_udata_summary() {
    require_admin();
    list($a, $b) = biz_range();
    $vis = (int)db_val("SELECT COUNT(DISTINCT vid) FROM an_events WHERE ev IN ('visit','page') AND created_at>=? AND created_at<?", [$a, $b]);
    $new = (int)db_val('SELECT COUNT(*) FROM an_visitors WHERE first_at>=? AND first_at<?', [$a, $b]);
    $top = function ($col, $ev) use ($a, $b) {
        $o = [];
        foreach (db_rows("SELECT $col k, COUNT(*) n FROM an_events WHERE ev IN ($ev) AND $col IS NOT NULL AND $col<>'' AND created_at>=? AND created_at<? GROUP BY $col ORDER BY n DESC LIMIT 10", [$a, $b]) as $r) $o[] = ['k' => $r['k'], 'n' => (int)$r['n']];
        return $o;
    };
    $days = [];
    for ($d = $a; $d < $b && count($days) < 400; $d = strtotime('+1 day', $d)) $days[date('Y-m-d', $d)] = ['d' => date('Y-m-d', $d), 'visitors' => 0, 'pages' => 0, 'views' => 0];
    foreach (db_rows("SELECT created_at t, vid, ev FROM an_events WHERE created_at>=? AND created_at<? AND ev IN ('visit','page','view')", [$a, $b]) as $r) {
        $k = date('Y-m-d', (int)$r['t']); if (!isset($days[$k])) continue;
        if ($r['ev'] === 'visit') $days[$k]['visitors']++; elseif ($r['ev'] === 'page') $days[$k]['pages']++; else $days[$k]['views']++;
    }
    json_out([
        'range' => ['from' => date('Y-m-d', $a), 'to' => date('Y-m-d', $b - 1)],
        'visitors' => $vis, 'new' => min($vis, $new), 'returning' => max(0, $vis - $new),
        'sessions' => (int)db_val("SELECT COUNT(DISTINCT sid) FROM an_events WHERE created_at>=? AND created_at<?", [$a, $b]),
        'page_views' => (int)db_val("SELECT COUNT(*) FROM an_events WHERE ev='page' AND created_at>=? AND created_at<?", [$a, $b]),
        'product_views' => (int)db_val("SELECT COUNT(*) FROM an_events WHERE ev='view' AND created_at>=? AND created_at<?", [$a, $b]),
        'unique_ips' => (int)db_val('SELECT COUNT(DISTINCT ip) FROM an_events WHERE ip IS NOT NULL AND created_at>=? AND created_at<?', [$a, $b]),
        'users_total' => (int)db_val('SELECT COUNT(*) FROM users'), 'users_new' => (int)db_val('SELECT COUNT(*) FROM users WHERE created_at>=? AND created_at<?', [$a, $b]),
        'consented' => (int)db_val('SELECT COUNT(*) FROM an_visitors WHERE pers=1 AND last_at>=? AND last_at<?', [$a, $b]),
        'orders' => (int)db_val('SELECT COUNT(*) FROM orders WHERE created_at>=? AND created_at<?', [$a, $b]),
        'orders_linked' => (int)db_val('SELECT COUNT(*) FROM orders WHERE user_id IS NOT NULL AND created_at>=? AND created_at<?', [$a, $b]),
        'restricted' => (int)db_val('SELECT COUNT(*) FROM blocks WHERE active=1 AND (expires_at IS NULL OR expires_at>?)', [now_ts()]),
        'top_products' => $top('pn', "'view'"), 'top_categories' => $top('cat', "'view','click'"), 'top_pages' => $top('pg', "'page'"),
        'daily' => array_values($days),
        'keep' => ['events' => (int)fr_cfg()['keep_events_days'], 'ip' => (int)fr_cfg()['keep_ip_days']],
    ]);
}
function h_admin_udata_visitors() {
    require_admin();
    list($a, $b) = biz_range();
    $w = ['v.last_at>=? AND v.last_at<?']; $p = [$a, $b];
    $kind = (string)($_GET['kind'] ?? '');
    if ($kind === 'registered') $w[] = 'v.uid IS NOT NULL';
    elseif ($kind === 'anonymous') $w[] = 'v.uid IS NULL';
    elseif ($kind === 'returning') { $w[] = 'v.first_at<?'; $p[] = $a; }
    elseif ($kind === 'new') { $w[] = 'v.first_at>=?'; $p[] = $a; }
    elseif ($kind === 'consent') $w[] = 'v.pers=1';
    $qs = trim((string)($_GET['q'] ?? ''));
    if ($qs !== '') { $l = ud_like($qs); $w[] = "(v.vid LIKE ? ESCAPE '!' OR v.ip LIKE ? ESCAPE '!' OR u.name LIKE ? ESCAPE '!' OR u.mobile LIKE ? ESCAPE '!')"; array_push($p, $l, $l, $l, $l); }
    $from = ' FROM an_visitors v LEFT JOIN users u ON u.id=v.uid WHERE ' . implode(' AND ', $w);
    list($pg, $per, $off) = biz_page();
    $tot = (int)db_val('SELECT COUNT(*)' . $from, $p);
    $out = [];
    foreach (db_rows('SELECT v.*, u.name uname, u.mobile umobile' . $from . ' ORDER BY v.last_at DESC LIMIT ' . $per . ' OFFSET ' . $off, $p) as $r) {
        $vid = $r['vid'];
        $c = db_row("SELECT COUNT(DISTINCT sid) s, SUM(CASE WHEN ev='page' THEN 1 ELSE 0 END) pg, SUM(CASE WHEN ev='view' THEN 1 ELSE 0 END) pv FROM an_events WHERE vid=?", [$vid]);
        $out[] = ['vid' => $vid, 'first' => (int)$r['first_at'], 'last' => (int)$r['last_at'], 'ip' => $r['ip'] ?? '', 'consent' => (int)$r['pers'] === 1, 'uid' => $r['uid'], 'user' => $r['uname'] ? $r['uname'] . ' · ' . $r['umobile'] : '',
                  'sessions' => (int)($c['s'] ?? 0), 'pages' => (int)($c['pg'] ?? 0), 'views' => (int)($c['pv'] ?? 0), 'returning' => (int)$r['first_at'] < $a,
                  'last2' => (int)$r['pers'] === 1 ? ud_last2('vid=?', [$vid]) : null];
    }
    json_out(['visitors' => $out, 'total' => $tot, 'page' => $pg, 'per' => $per]);
}
function h_admin_udata_visitor($vid) {
    require_admin();
    $v = db_row('SELECT v.*, u.name uname, u.mobile umobile FROM an_visitors v LEFT JOIN users u ON u.id=v.uid WHERE v.vid=?', [$vid]);
    if (!$v) fail(404, 'Visitor not found');
    $ev = [];
    foreach (db_rows('SELECT ev, pid, pn, cat, pg, ip, sid, created_at FROM an_events WHERE vid=? ORDER BY id DESC LIMIT 200', [$vid]) as $r)
        $ev[] = ['ev' => $r['ev'], 'pid' => $r['pid'], 'name' => $r['pn'] ?? '', 'cat' => $r['cat'] ?? '', 'page' => $r['pg'] ?? '', 'ip' => $r['ip'] ?? '', 'sid' => $r['sid'], 'at' => (int)$r['created_at']];
    $orders = $v['uid'] ? fr_orders_of($v['uid'], null) : [];
    json_out(['visitor' => ['vid' => $v['vid'], 'first' => (int)$v['first_at'], 'last' => (int)$v['last_at'], 'ip' => $v['ip'] ?? '', 'consent' => (int)$v['pers'] === 1, 'uid' => $v['uid'], 'user' => $v['uname'] ? $v['uname'] . ' · ' . $v['umobile'] : ''],
              'events' => $ev, 'last2' => (int)$v['pers'] === 1 ? ud_last2('vid=?', [$vid]) : [], 'orders' => $orders]);
}
function h_admin_udata_users() {
    require_admin();
    $w = ['1=1']; $p = [];
    $qs = trim((string)($_GET['q'] ?? ''));
    if ($qs !== '') { $l = ud_like($qs); $w[] = "(u.name LIKE ? ESCAPE '!' OR u.mobile LIKE ? ESCAPE '!' OR u.email LIKE ? ESCAPE '!' OR u.id LIKE ? ESCAPE '!')"; array_push($p, $l, $l, $l, $l); }
    if (($_GET['state'] ?? '') === 'restricted') $w[] = 'u.blocked=1';
    list($f, $t) = biz_range_opt();
    if ($f !== null) { $w[] = 'u.created_at>=? AND u.created_at<?'; $p[] = $f; $p[] = $t; }
    list($pg, $per, $off) = biz_page();
    $tot = (int)db_val('SELECT COUNT(*) FROM users u WHERE ' . implode(' AND ', $w), $p);
    $out = [];
    foreach (db_rows('SELECT u.id, u.name, u.mobile, u.email, u.blocked, u.created_at FROM users u WHERE ' . implode(' AND ', $w) . ' ORDER BY u.created_at DESC, u.id DESC LIMIT ' . $per . ' OFFSET ' . $off, $p) as $r) {
        $o = db_row('SELECT COUNT(*) n, MAX(created_at) last FROM orders WHERE user_id=?', [$r['id']]);
        $out[] = ['id' => $r['id'], 'name' => $r['name'], 'mobile' => $r['mobile'], 'email' => $r['email'] ?? '', 'restricted' => (bool)(int)$r['blocked'], 'joined' => (int)$r['created_at'],
                  'orders' => (int)$o['n'], 'last_order' => $o['last'] ? (int)$o['last'] : null, 'reports' => (int)db_val('SELECT COUNT(*) FROM fraud_reports WHERE user_id=?', [$r['id']])];
    }
    json_out(['users' => $out, 'total' => $tot, 'page' => $pg, 'per' => $per]);
}
function h_admin_udata_user($id) {
    require_admin();
    $u = db_row('SELECT id, name, mobile, email, blocked, created_at, wallet FROM users WHERE id=?', [$id]);
    if (!$u) fail(404, 'Customer not found');
    $ips = [];
    foreach (db_rows('SELECT ip, MAX(created_at) t, COUNT(*) n FROM an_events WHERE uid=? AND ip IS NOT NULL GROUP BY ip ORDER BY t DESC LIMIT 10', [$id]) as $r) $ips[] = ['ip' => $r['ip'], 'last' => (int)$r['t'], 'n' => (int)$r['n']];
    $vis = [];
    foreach (db_rows('SELECT vid, first_at, last_at FROM an_visitors WHERE uid=? ORDER BY last_at DESC LIMIT 10', [$id]) as $r) $vis[] = ['vid' => $r['vid'], 'first' => (int)$r['first_at'], 'last' => (int)$r['last_at']];
    $rep = [];
    foreach (db_rows('SELECT id, order_id, reason, status, created_at FROM fraud_reports WHERE user_id=? ORDER BY id DESC LIMIT 20', [$id]) as $r) $rep[] = ['id' => (int)$r['id'], 'order' => $r['order_id'], 'reason' => $r['reason'], 'status' => $r['status'], 'at' => (int)$r['created_at']];
    $blk = [];
    foreach (db_rows("SELECT * FROM blocks WHERE kind='user' AND target=? ORDER BY id DESC LIMIT 10", [$id]) as $r) $blk[] = fr_block_row($r);
    $addr = [];
    foreach (db_rows('SELECT DISTINCT address FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 5', [$id]) as $r) $addr[] = clean_str($r['address'], 200);
    json_out(['user' => ['id' => $u['id'], 'name' => $u['name'], 'mobile' => $u['mobile'], 'email' => $u['email'] ?? '', 'restricted' => (bool)(int)$u['blocked'], 'joined' => (int)$u['created_at']],
              'orders' => fr_orders_of($id, null), 'addresses' => $addr, 'ips' => $ips, 'visitors' => $vis, 'last2' => ud_last2('uid=?', [$id]), 'reports' => $rep, 'blocks' => $blk]);
}
function h_admin_udata_delete_visitor($vid) {
    require_admin();
    $n = db_exec('DELETE FROM an_events WHERE vid=?', [$vid]);
    db_exec('DELETE FROM an_visitors WHERE vid=?', [$vid]);
    audit('erase_visitor', 'visitor:' . $vid, $n . ' events removed');
    json_out(['ok' => true, 'removed' => $n]);
}
function h_admin_udata_erase_user($id) {
    require_admin();
    if (!db_val('SELECT 1 FROM users WHERE id=?', [$id])) fail(404, 'Customer not found');
    $n = db_exec('DELETE FROM an_events WHERE uid=?', [$id]);
    db_exec('UPDATE an_visitors SET uid=NULL WHERE uid=?', [$id]);
    audit('erase_activity', 'user:' . $id, $n . ' events removed');
    json_out(['ok' => true, 'removed' => $n]);
}
function h_admin_udata_purge() {
    require_admin();
    $r = ud_purge();
    audit('retention_run', 'tracking', json_encode($r));
    json_out(['ok' => true, 'removed' => $r]);
}

/** GET /admin/customers/{id}/activity: everything the site knows about one customer in one place (profile, orders,
 *  products opened, time on the site and per place). Browsing data exists only for visits where the customer agreed to tracking. */
function h_admin_customer_activity($id) {
    require_admin();
    $u = db_row('SELECT id, name, mobile, email, blocked, created_at, wallet, profile FROM users WHERE id=?', [$id]);
    if (!$u) fail(404, 'Customer not found');
    $p = json_decode((string)($u['profile'] ?? ''), true);
    $av = is_array($p) && is_string($p['avatar'] ?? null) && preg_match('#^https?://#i', $p['avatar']) ? $p['avatar'] : '';
    $cap = 600; // a gap longer than 10 minutes between two events is not counted as time spent
    $evs = db_rows('SELECT sid, ev, pid, pn, cat, pg, ip, created_at FROM an_events WHERE uid=? ORDER BY created_at ASC, id ASC LIMIT 4000', [$id]);
    $bySid = [];
    foreach ($evs as $e) $bySid[$e['sid']][] = $e;
    $prod = []; $place = []; $cats = []; $sess = []; $total = 0; $pv = 0; $pages = 0;
    foreach ($bySid as $sid => $list) {
        $n = count($list); $secs = 0; $np = 0; $seenP = [];
        for ($i = 0; $i < $n; $i++) {
            $e = $list[$i];
            $d = $i + 1 < $n ? min($cap, max(0, (int)$list[$i + 1]['created_at'] - (int)$e['created_at'])) : 15;
            $secs += $d;
            $pgk = $e['pg'] ?: ($e['ev'] === 'view' ? 'product' : ($e['ev'] === 'cart' ? 'cart' : ($e['ev'] === 'checkout' ? 'checkout' : 'other')));
            if ($e['ev'] !== 'click') { $place[$pgk]['n'] = ($place[$pgk]['n'] ?? 0) + 1; $place[$pgk]['s'] = ($place[$pgk]['s'] ?? 0) + $d; $pages++; }
            if ($e['ev'] === 'view' && $e['pid'] !== null && $e['pid'] !== '') {
                $k = (string)$e['pid']; $pv++;
                if (!isset($prod[$k])) $prod[$k] = ['id' => $k, 'name' => (string)($e['pn'] ?? ''), 'cat' => (string)($e['cat'] ?? ''), 'views' => 0, 'secs' => 0, 'last' => 0];
                $prod[$k]['views']++; $prod[$k]['secs'] += $d; $prod[$k]['last'] = max($prod[$k]['last'], (int)$e['created_at']);
                if ($e['pn']) $prod[$k]['name'] = (string)$e['pn'];
                $seenP[$k] = 1;
            }
            if ($e['cat']) { $c = (string)$e['cat']; $cats[$c]['n'] = ($cats[$c]['n'] ?? 0) + 1; $cats[$c]['s'] = ($cats[$c]['s'] ?? 0) + $d; }
        }
        $total += $secs;
        $sess[] = ['sid' => $sid, 'start' => (int)$list[0]['created_at'], 'end' => (int)$list[$n - 1]['created_at'], 'secs' => $secs, 'events' => $n, 'products' => count($seenP), 'ip' => (string)($list[0]['ip'] ?? '')];
    }
    usort($sess, function ($a, $b) { return $b['start'] <=> $a['start']; });
    uasort($prod, function ($a, $b) { return [$b['views'], $b['secs']] <=> [$a['views'], $a['secs']]; });
    $pl = []; foreach ($place as $k => $v) $pl[] = ['page' => $k, 'n' => $v['n'], 'secs' => $v['s']];
    usort($pl, function ($a, $b) { return $b['secs'] <=> $a['secs']; });
    $cl = []; foreach ($cats as $k => $v) $cl[] = ['cat' => $k, 'n' => $v['n'], 'secs' => $v['s']];
    usort($cl, function ($a, $b) { return $b['secs'] <=> $a['secs']; });
    $tl = [];
    foreach (array_slice(array_reverse($evs), 0, 80) as $e) $tl[] = ['ev' => $e['ev'], 'name' => (string)($e['pn'] ?? ''), 'page' => (string)($e['pg'] ?? ''), 'cat' => (string)($e['cat'] ?? ''), 'at' => (int)$e['created_at']];
    $ord = db_row("SELECT COUNT(*) n, COALESCE(SUM(CASE WHEN status<>'Cancelled' THEN total ELSE 0 END),0) t FROM orders WHERE user_id=?", [$id]);
    $addr = [];
    foreach (db_rows('SELECT DISTINCT address FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 5', [$id]) as $r) $addr[] = clean_str($r['address'], 200);
    $first = $evs ? (int)$evs[0]['created_at'] : null; $last = $evs ? (int)$evs[count($evs) - 1]['created_at'] : null;
    json_out(['user' => ['id' => $u['id'], 'name' => $u['name'], 'mobile' => $u['mobile'], 'email' => $u['email'] ?? '', 'blocked' => (bool)(int)$u['blocked'],
                         'joined' => (int)$u['created_at'], 'wallet' => money($u['wallet']), 'avatar' => $av, 'orders' => (int)$ord['n'], 'spent' => money($ord['t'])],
              'stats' => ['sessions' => count($sess), 'secs' => $total, 'avg' => count($sess) ? (int)round($total / count($sess)) : 0, 'pages' => $pages, 'product_views' => $pv, 'products' => count($prod), 'first' => $first, 'last' => $last],
              'products' => array_slice(array_values($prod), 0, 50), 'places' => $pl, 'cats' => array_slice($cl, 0, 20), 'sessions' => array_slice($sess, 0, 30),
              'timeline' => $tl, 'orders_list' => fr_orders_of($id, null), 'addresses' => $addr]);
}
