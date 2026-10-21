<?php
/* NurBuy fraud prevention: rider reports, admin review, account / IP restrictions, appeals, audit trail, rate limits. */
if (!defined('NB')) { http_response_code(403); exit; }

const FR_REASONS = ['fake_order', 'repeated_failed', 'wrong_contact', 'other'];
const FR_DEFAULTS = [
    'care_phone' => '', 'care_hours' => '', 'block_title' => 'Access restricted', 'block_message' => 'Your access to ordering on NurBuy has been restricted after a review of recent activity.',
    'block_message_bn' => '', 'appeal_enabled' => 1, 'appeal_note' => 'If you believe this is a mistake, send a review request with your name and the mobile number you used. Our team replies after checking your orders.',
    'consent_required' => 1, 'personalization' => 1, 'collect_ip' => 1,
    'keep_events_days' => 180, 'keep_ip_days' => 90, 'keep_order_ip_days' => 365,
];

/* ================= settings ================= */

function fr_cfg() {
    static $c = null;
    if ($c !== null) return $c;
    $row = kv_get('fraud_cfg'); $v = $row ? json_decode((string)$row['v'], true) : null;
    $c = FR_DEFAULTS;
    if (is_array($v)) foreach (FR_DEFAULTS as $k => $d) if (array_key_exists($k, $v)) $c[$k] = $v[$k];
    return $c;
}
function fr_cfg_clean($b) {
    $c = fr_cfg(); $o = $c;
    $txt = ['care_phone' => 30, 'care_hours' => 80, 'block_title' => 80, 'block_message' => 600, 'block_message_bn' => 600, 'appeal_note' => 600];
    foreach ($txt as $k => $max) if (array_key_exists($k, $b)) $o[$k] = clean_str($b[$k], $max);
    if ($o['block_title'] === '') $o['block_title'] = FR_DEFAULTS['block_title'];
    if ($o['block_message'] === '') $o['block_message'] = FR_DEFAULTS['block_message'];
    if (!preg_match('/^[0-9+\-\s()]{0,30}$/', $o['care_phone'])) fail(400, 'Enter a valid phone number', 'care_phone');
    foreach (['appeal_enabled', 'consent_required', 'personalization', 'collect_ip'] as $k) if (array_key_exists($k, $b)) $o[$k] = ($b[$k] === true || $b[$k] === 1 || $b[$k] === '1' || $b[$k] === 'true') ? 1 : 0;
    foreach (['keep_events_days' => [7, 1095], 'keep_ip_days' => [1, 1095], 'keep_order_ip_days' => [1, 1825]] as $k => $r) {
        if (!array_key_exists($k, $b)) continue;
        if (!is_num($b[$k]) || (int)$b[$k] < $r[0] || (int)$b[$k] > $r[1]) fail(400, 'Choose ' . $r[0] . ' to ' . $r[1] . ' days', $k);
        $o[$k] = (int)$b[$k];
    }
    return $o;
}
function h_admin_fraud_settings_get() { require_admin(); json_out(['settings' => fr_cfg(), 'defaults' => FR_DEFAULTS, 'ip_header' => (string)cfg('ip_header', '')]); }
function h_admin_fraud_settings_put() {
    require_admin();
    $o = fr_cfg_clean(body_json());
    kv_set('fraud_cfg', json_encode($o, JSON_UNESCAPED_UNICODE));
    audit('settings', 'fraud_cfg', 'Fraud and privacy settings changed');
    json_out(['ok' => true, 'settings' => $o]);
}
/** Public texts for the access-restricted page, the cookie notice and the privacy page. */
function h_access_info() {
    $c = fr_cfg();
    header('Cache-Control: public, max-age=60');
    json_out(['phone' => $c['care_phone'], 'hours' => $c['care_hours'], 'title' => $c['block_title'], 'message' => $c['block_message'], 'message_bn' => $c['block_message_bn'],
              'appeal' => (int)$c['appeal_enabled'], 'appeal_note' => $c['appeal_note'], 'consent_required' => (int)$c['consent_required'], 'personalization' => (int)$c['personalization']]);
}

/* ================= audit + rate limit ================= */

/** One audit row. $role/$actor default to the signed-in admin. */
function audit($action, $target, $detail, $role = 'admin', $actor = null) {
    try {
        if ($actor === null && $role === 'admin') { $s = current_session(); $a = $s && $s['role'] === 'admin' ? db_row('SELECT name, email FROM admins WHERE id=?', [$s['user_id']]) : null; $actor = $a ? ($a['name'] ?: $a['email']) : null; }
        q('INSERT INTO audit_log (actor_role, actor, action, target, detail, ip, created_at) VALUES (?,?,?,?,?,?,?)',
          [$role, $actor === null ? null : clean_str($actor, 80), clean_str($action, 40), $target === null ? null : clean_str((string)$target, 80), clean_str($detail, 1000), client_ip(), now_ts()]);
    } catch (Throwable $e) { error_log('audit: ' . $e->getMessage()); }
}
/** Counts a hit for $key and refuses with 429 once more than $max happened inside $window seconds. */
function rl_hit($key, $max, $window) {
    $t = now_ts();
    $n = (int)db_val('SELECT COUNT(*) FROM rate_hits WHERE k=? AND ts>?', [$key, $t - $window]);
    if ($n >= $max) { header('Retry-After: ' . $window); fail(429, 'Too many requests. Please try again later.', null, 'rate_limited'); }
    q('INSERT INTO rate_hits (k, ts) VALUES (?,?)', [$key, $t]);
    if (random_int(1, 40) === 1) q('DELETE FROM rate_hits WHERE ts<?', [$t - 86400]);
}
function fr_len($s) { return function_exists('mb_strlen') ? mb_strlen($s) : strlen($s); }
function ip_ok($ip) { return is_string($ip) && filter_var($ip, FILTER_VALIDATE_IP) !== false; }

/* ================= restrictions ================= */

function block_ref($id) { return 'BL-' . str_pad((string)(int)$id, 5, '0', STR_PAD_LEFT); }
function block_active_row($kind, $target) {
    $b = db_row('SELECT * FROM blocks WHERE kind=? AND target=? AND active=1 ORDER BY id DESC LIMIT 1', [$kind, $target]);
    if ($b && $b['expires_at'] !== null && (int)$b['expires_at'] <= now_ts()) { block_lift_row($b, 'system', 'Expired'); return null; }
    return $b;
}
function block_public($b) {
    $c = fr_cfg();
    return ['ref' => $b ? block_ref($b['id']) : null, 'kind' => $b ? $b['kind'] : 'user', 'expires' => $b && $b['expires_at'] !== null ? (int)$b['expires_at'] : null,
            'title' => $c['block_title'], 'message' => $c['block_message'], 'message_bn' => $c['block_message_bn'], 'phone' => $c['care_phone'], 'hours' => $c['care_hours'],
            'appeal' => (int)$c['appeal_enabled'], 'appeal_note' => $c['appeal_note']];
}
function fail_blocked($b) {
    $e = new ApiError(403, 'Access restricted', null, 'blocked');
    $e->extra = ['block' => block_public($b)];
    throw $e;
}
/** Refuses a restricted customer account (temporary restrictions that ran out are lifted here). */
function block_user_check($u) {
    if (!(int)$u['blocked']) return;
    $b = block_active_row('user', $u['id']);
    if (!$b && !db_val("SELECT 1 FROM blocks WHERE kind='user' AND target=?", [$u['id']])) fail_blocked(null); // restricted before the log existed: stays restricted
    if (!$b) return;
    fail_blocked($b);
}
/** Refuses a restricted IP for customer actions (ordering, sign-up, customer login). Staff and rider logins are never affected. */
function block_ip_check() {
    $b = block_active_row('ip', client_ip());
    if ($b) fail_blocked($b);
}
function block_lift_row($b, $by, $note) {
    db_tx(function () use ($b, $by, $note) {
        q('UPDATE blocks SET active=0, lifted_by=?, lifted_at=?, lift_note=? WHERE id=? AND active=1', [clean_str($by, 80), now_ts(), $note === '' ? null : clean_str($note, 300), (int)$b['id']]);
        if ($b['kind'] === 'user' && !db_val("SELECT 1 FROM blocks WHERE kind='user' AND target=? AND active=1", [$b['target']])) q('UPDATE users SET blocked=0 WHERE id=?', [$b['target']]);
    });
    audit($by === 'system' ? 'block_expired' : 'unblock', $b['kind'] . ':' . $b['target'], block_ref($b['id']) . ($note !== '' ? ' - ' . $note : ''), $by === 'system' ? 'system' : 'admin', $by === 'system' ? 'system' : null);
}
/** Distinct signed-in customers seen on an IP in the last 90 days (orders and activity). */
function ip_users($ip) {
    $since = now_ts() - 90 * 86400; $ids = [];
    foreach (db_rows('SELECT DISTINCT user_id u FROM orders WHERE ip=? AND user_id IS NOT NULL AND created_at>?', [$ip, $since]) as $r) $ids[$r['u']] = 1;
    foreach (db_rows('SELECT DISTINCT uid u FROM an_events WHERE ip=? AND uid IS NOT NULL AND created_at>?', [$ip, $since]) as $r) $ids[$r['u']] = 1;
    return array_keys($ids);
}
function block_expiry($b) {
    if (!array_key_exists('days', $b) || $b['days'] === null || $b['days'] === '' || (int)$b['days'] === 0) return null;
    if (!is_num($b['days']) || (int)$b['days'] < 1 || (int)$b['days'] > 3650) fail(400, 'Choose 1 to 3650 days, or permanent', 'days');
    return now_ts() + (int)$b['days'] * 86400;
}
/** Creates an account or IP restriction. Returns the block id. */
function block_apply($kind, $target, $reason, $expires, $reportId = null) {
    if ($reason === '') fail(400, 'A reason is required', 'reason');
    return db_tx(function () use ($kind, $target, $reason, $expires, $reportId) {
        if (block_active_row($kind, $target)) fail(409, 'This ' . ($kind === 'ip' ? 'IP address' : 'customer') . ' is already restricted', 'target', 'already_blocked');
        $s = current_session(); $a = $s ? db_row('SELECT name, email FROM admins WHERE id=?', [$s['user_id']]) : null;
        q('INSERT INTO blocks (kind, target, reason, report_id, active, expires_at, created_by, created_at) VALUES (?,?,?,?,1,?,?,?)',
          [$kind, $target, clean_str($reason, 300), $reportId, $expires, $a ? clean_str($a['name'] ?: $a['email'], 80) : null, now_ts()]);
        $id = (int)db_val('SELECT MAX(id) FROM blocks WHERE kind=? AND target=?', [$kind, $target]);
        if ($kind === 'user') { q('UPDATE users SET blocked=1 WHERE id=?', [$target]); }
        audit('block_' . $kind, $kind . ':' . $target, block_ref($id) . ' - ' . $reason . ($expires ? ' (until ' . date('Y-m-d', $expires) . ')' : ' (permanent)'));
        return $id;
    });
}

/* ================= rider: report a customer ================= */

function fr_priv_dir() { return rider_priv_dir(); }
function h_rider_report_upload() {
    upload_guard();
    $r = require_rider(true);
    rl_hit('frup:' . (int)$r['id'], 30, 3600);
    $up = upload_take('file', [], UPLOAD_MAX_MB, ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp']);
    $name = 'f' . (int)$r['id'] . '_' . bin2hex(random_bytes(8)) . '.' . $up['ext'];
    upload_store($up, fr_priv_dir() . '/' . $name, 1600);
    @chmod(fr_priv_dir() . '/' . $name, 0640);
    json_out(['name' => $name]);
}
function h_rider_report_create($oid) {
    $r = require_rider(true);
    $b = body_json();
    $reason = (string)($b['reason'] ?? '');
    if (!in_array($reason, FR_REASONS, true)) fail(400, 'Choose a reason', 'reason');
    $note = clean_str($b['note'] ?? '', 500);
    if ($reason === 'other' && fr_len($note) < 5) fail(400, 'Please describe what happened', 'note');
    $ev = [];
    if (isset($b['evidence'])) {
        if (!is_array($b['evidence']) || count($b['evidence']) > 3) fail(400, 'Attach up to 3 photos', 'evidence');
        foreach ($b['evidence'] as $n) {
            if (!is_string($n) || !preg_match('/^f' . (int)$r['id'] . '_[0-9a-f]{16}\.(jpg|png|webp)$/', $n) || !is_file(fr_priv_dir() . '/' . $n)) fail(400, 'A photo is not valid. Upload it again.', 'evidence');
            $ev[] = $n;
        }
    }
    rl_hit('frep:' . (int)$r['id'], 10, 3600);
    $id = db_tx(function () use ($r, $oid, $reason, $note, $ev) {
        list($o, $d) = rider_load_delivery($r, $oid);
        if (db_val("SELECT 1 FROM fraud_reports WHERE order_id=? AND rider_id=? AND status='pending'", [$oid, (int)$r['id']])) fail(409, 'You already reported this order. The team is reviewing it.', null, 'duplicate');
        q('INSERT INTO fraud_reports (order_id, rider_id, user_id, mobile, reason, note, evidence, status, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
          [$oid, (int)$r['id'], $o['user_id'], $o['mobile'], $reason, $note === '' ? null : $note, $ev ? json_encode($ev) : null, 'pending', now_ts()]);
        return (int)db_val('SELECT MAX(id) FROM fraud_reports WHERE order_id=? AND rider_id=?', [$oid, (int)$r['id']]);
    });
    audit('report_new', 'order:' . $oid, 'Rider #' . (int)$r['id'] . ' reported: ' . $reason, 'rider', 'rider #' . (int)$r['id']);
    json_out(['ok' => true, 'id' => $id], 201);
}
function h_rider_reports() {
    $r = require_rider(false);
    $out = [];
    foreach (db_rows('SELECT id, order_id, reason, status, created_at FROM fraud_reports WHERE rider_id=? ORDER BY id DESC LIMIT 50', [(int)$r['id']]) as $x)
        $out[] = ['id' => (int)$x['id'], 'order' => $x['order_id'], 'reason' => $x['reason'], 'status' => $x['status'], 'at' => (int)$x['created_at'] * 1000];
    json_out(['reports' => $out]);
}

/* ================= admin: reports ================= */

function fr_report_row($x) {
    return ['id' => (int)$x['id'], 'order' => $x['order_id'], 'rider' => (int)$x['rider_id'], 'user_id' => $x['user_id'], 'mobile' => $x['mobile'], 'reason' => $x['reason'], 'note' => $x['note'] ?? '',
            'evidence' => $x['evidence'] ? (json_decode($x['evidence'], true) ?: []) : [], 'status' => $x['status'], 'decision_note' => $x['decision_note'] ?? '', 'decided_by' => $x['decided_by'],
            'decided_at' => $x['decided_at'] ? (int)$x['decided_at'] : null, 'at' => (int)$x['created_at']];
}
function h_admin_fraud_summary() {
    require_admin();
    json_out(['pending' => (int)db_val("SELECT COUNT(*) FROM fraud_reports WHERE status='pending'"), 'appeals' => (int)db_val("SELECT COUNT(*) FROM block_appeals WHERE status='open'"),
              'blocks' => (int)db_val("SELECT COUNT(*) FROM blocks WHERE active=1 AND (expires_at IS NULL OR expires_at>?)", [now_ts()]),
              'reports' => (int)db_val('SELECT COUNT(*) FROM fraud_reports')]);
}
function h_admin_fraud_reports() {
    require_admin();
    $w = ['1=1']; $p = [];
    $st = (string)($_GET['status'] ?? '');
    if (in_array($st, ['pending', 'approved', 'rejected'], true)) { $w[] = 'f.status=?'; $p[] = $st; }
    $rs = (string)($_GET['reason'] ?? '');
    if (in_array($rs, FR_REASONS, true)) { $w[] = 'f.reason=?'; $p[] = $rs; }
    list($a, $b) = biz_range_opt();
    if ($a !== null) { $w[] = 'f.created_at>=? AND f.created_at<?'; $p[] = $a; $p[] = $b; }
    $qs = trim((string)($_GET['q'] ?? ''));
    if ($qs !== '') { $l = '%' . str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $qs) . '%'; $w[] = "(f.order_id LIKE ? ESCAPE '!' OR f.mobile LIKE ? ESCAPE '!' OR u.name LIKE ? ESCAPE '!')"; array_push($p, $l, $l, $l); }
    $from = ' FROM fraud_reports f LEFT JOIN users u ON u.id=f.user_id LEFT JOIN riders r ON r.id=f.rider_id WHERE ' . implode(' AND ', $w);
    list($pg, $per, $off) = biz_page();
    $tot = (int)db_val('SELECT COUNT(*)' . $from, $p);
    $rows = db_rows('SELECT f.*, u.name uname, r.name rname' . $from . ' ORDER BY f.id DESC LIMIT ' . $per . ' OFFSET ' . $off, $p);
    $out = [];
    foreach ($rows as $x) $out[] = fr_report_row($x) + ['customer' => $x['uname'] ?? '', 'rider_name' => $x['rname'] ?? ''];
    json_out(['reports' => $out, 'total' => $tot, 'page' => $pg, 'per' => $per]);
}
/** Optional ?from&to (days): null when not sent. */
function biz_range_opt() {
    if (empty($_GET['from']) || empty($_GET['to'])) return [null, null];
    return biz_range();
}
function fr_orders_of($uid, $mobile) {
    $rows = $uid ? db_rows('SELECT id, status, total, pay, created_at, ip, address FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 30', [$uid])
                 : db_rows('SELECT id, status, total, pay, created_at, ip, address FROM orders WHERE mobile=? ORDER BY created_at DESC LIMIT 30', [$mobile]);
    $o = [];
    foreach ($rows as $x) $o[] = ['id' => $x['id'], 'status' => $x['status'], 'total' => money($x['total']), 'pay' => $x['pay'], 'at' => (int)$x['created_at'], 'ip' => $x['ip'] ?? '', 'address' => clean_str($x['address'], 120)];
    return $o;
}
function h_admin_fraud_report_get($id) {
    require_admin();
    $x = db_row('SELECT * FROM fraud_reports WHERE id=?', [(int)$id]);
    if (!$x) fail(404, 'Report not found');
    $o = db_row('SELECT * FROM orders WHERE id=?', [$x['order_id']]);
    $u = $x['user_id'] ? db_row('SELECT id, name, email, mobile, blocked, created_at FROM users WHERE id=?', [$x['user_id']]) : null;
    $rd = db_row('SELECT id, name, mobile FROM riders WHERE id=?', [(int)$x['rider_id']]);
    $prev = ['pending' => 0, 'approved' => 0, 'rejected' => 0];
    foreach (db_rows($x['user_id'] ? 'SELECT status, COUNT(*) n FROM fraud_reports WHERE user_id=? AND id<>? GROUP BY status' : 'SELECT status, COUNT(*) n FROM fraud_reports WHERE mobile=? AND id<>? GROUP BY status', [$x['user_id'] ?: $x['mobile'], (int)$id]) as $r) $prev[$r['status']] = (int)$r['n'];
    $ip = $o['ip'] ?? '';
    $ub = $u ? block_active_row('user', $u['id']) : null;
    $ib = $ip !== '' ? block_active_row('ip', $ip) : null;
    $items = $o ? (json_decode($o['items'], true) ?: []) : [];
    json_out(['report' => fr_report_row($x), 'rider' => $rd ? ['id' => (int)$rd['id'], 'name' => $rd['name'], 'mobile' => $rd['mobile']] : null,
              'order' => $o ? ['id' => $o['id'], 'status' => $o['status'], 'total' => money($o['total']), 'pay' => $o['pay'], 'name' => $o['name'], 'mobile' => $o['mobile'], 'address' => $o['address'], 'ip' => $ip, 'at' => (int)$o['created_at'],
                               'items' => array_map(function ($i) { return ['n' => $i['n'] ?? '', 'q' => (int)($i['q'] ?? 1)]; }, array_slice($items, 0, 20))] : null,
              'customer' => $u ? ['id' => $u['id'], 'name' => $u['name'], 'email' => $u['email'] ?? '', 'mobile' => $u['mobile'], 'blocked' => (bool)(int)$u['blocked'], 'joined' => (int)$u['created_at']] : null,
              'history' => fr_orders_of($x['user_id'], $x['mobile']), 'previous' => $prev,
              'user_block' => $ub ? fr_block_row($ub) : null, 'ip_block' => $ib ? fr_block_row($ib) : null,
              'shared_ip_users' => $ip !== '' ? count(ip_users($ip)) : 0]);
}
function h_admin_fraud_file() {
    require_admin();
    $n = (string)($_GET['name'] ?? '');
    if (!preg_match('/^f\d+_[0-9a-f]{16}\.(jpg|png|webp)$/', $n)) fail(400, 'Invalid file');
    $f = fr_priv_dir() . '/' . $n;
    if (!is_file($f)) fail(404, 'File not found');
    $mime = ['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp'][pathinfo($n, PATHINFO_EXTENSION)];
    header('Content-Type: ' . $mime); header('X-Content-Type-Options: nosniff'); header('Cache-Control: private, max-age=300'); header('Content-Length: ' . filesize($f));
    readfile($f); exit;
}
/** Approve or reject a report. Nothing is blocked unless the admin asks for it in the same decision. */
function h_admin_fraud_report_decide($id) {
    require_admin();
    $b = body_json();
    $dec = (string)($b['decision'] ?? '');
    if (!in_array($dec, ['approve', 'reject'], true)) fail(400, 'Choose approve or reject', 'decision');
    $note = clean_str($b['note'] ?? '', 500);
    if ($note === '') fail(400, 'Write a short note for the record', 'note');
    $act = (string)($b['action'] ?? 'none');
    if (!in_array($act, ['none', 'block_user', 'block_ip'], true)) fail(400, 'Invalid action', 'action');
    if ($dec === 'reject' && $act !== 'none') fail(400, 'A rejected report cannot restrict anyone', 'action');
    $x = db_row('SELECT * FROM fraud_reports WHERE id=?', [(int)$id]);
    if (!$x) fail(404, 'Report not found');
    if ($x['status'] !== 'pending') fail(409, 'This report was already decided', null, 'decided');
    $o = db_row('SELECT ip FROM orders WHERE id=?', [$x['order_id']]);
    $exp = block_expiry($b);
    $reason = clean_str($b['block_reason'] ?? '', 300);
    if ($reason === '') $reason = 'Fraud report #' . (int)$id . ' (' . $x['reason'] . ')';
    $ref = null;
    if ($act === 'block_user') {
        if (!$x['user_id']) fail(400, 'This order has no customer account to restrict', 'action');
        $ref = block_apply('user', $x['user_id'], $reason, $exp, (int)$id);
    } elseif ($act === 'block_ip') {
        $ip = trim((string)($b['ip'] ?? ($o['ip'] ?? '')));
        if (!ip_ok($ip)) fail(400, 'No valid IP address is recorded for this order', 'ip');
        if (count(ip_users($ip)) > 1 && empty($b['confirm_shared'])) fail(409, 'Several customers used this IP address. Confirm to restrict it anyway.', 'ip', 'shared_ip');
        $ref = block_apply('ip', $ip, $reason, $exp, (int)$id);
    }
    q('UPDATE fraud_reports SET status=?, decision_note=?, decided_by=?, decided_at=? WHERE id=?', [$dec === 'approve' ? 'approved' : 'rejected', $note, fr_admin_name(), now_ts(), (int)$id]);
    audit('report_' . $dec, 'report:' . (int)$id, 'Order ' . $x['order_id'] . ' - ' . $note . ($ref ? ' - ' . block_ref($ref) : ''));
    json_out(['ok' => true, 'block' => $ref ? block_ref($ref) : null]);
}
function fr_admin_name() { $s = current_session(); $a = $s ? db_row('SELECT name, email FROM admins WHERE id=?', [$s['user_id']]) : null; return $a ? clean_str($a['name'] ?: $a['email'], 80) : 'admin'; }

/* ================= admin: restrictions ================= */

function fr_block_row($x) {
    $live = (int)$x['active'] === 1 && ($x['expires_at'] === null || (int)$x['expires_at'] > now_ts());
    $name = '';
    if ($x['kind'] === 'user') { $u = db_row('SELECT name, mobile FROM users WHERE id=?', [$x['target']]); $name = $u ? $u['name'] . ' · ' . $u['mobile'] : ''; }
    return ['id' => (int)$x['id'], 'ref' => block_ref($x['id']), 'kind' => $x['kind'], 'target' => $x['target'], 'label' => $name, 'reason' => $x['reason'], 'report' => $x['report_id'] ? (int)$x['report_id'] : null,
            'live' => $live, 'expires' => $x['expires_at'] === null ? null : (int)$x['expires_at'], 'by' => $x['created_by'], 'at' => (int)$x['created_at'],
            'lifted_by' => $x['lifted_by'], 'lifted_at' => $x['lifted_at'] ? (int)$x['lifted_at'] : null, 'lift_note' => $x['lift_note'] ?? ''];
}
function h_admin_fraud_blocks() {
    require_admin();
    $w = ['1=1']; $p = [];
    $k = (string)($_GET['kind'] ?? '');
    if (in_array($k, ['user', 'ip'], true)) { $w[] = 'b.kind=?'; $p[] = $k; }
    $st = (string)($_GET['state'] ?? 'live');
    if ($st === 'live') { $w[] = 'b.active=1 AND (b.expires_at IS NULL OR b.expires_at>?)'; $p[] = now_ts(); }
    elseif ($st === 'ended') { $w[] = '(b.active=0 OR (b.expires_at IS NOT NULL AND b.expires_at<=?))'; $p[] = now_ts(); }
    $qs = trim((string)($_GET['q'] ?? ''));
    if ($qs !== '') { $l = '%' . str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $qs) . '%'; $w[] = "(b.target LIKE ? ESCAPE '!' OR b.reason LIKE ? ESCAPE '!' OR u.name LIKE ? ESCAPE '!' OR u.mobile LIKE ? ESCAPE '!')"; array_push($p, $l, $l, $l, $l); }
    $from = " FROM blocks b LEFT JOIN users u ON (b.kind='user' AND u.id=b.target) WHERE " . implode(' AND ', $w);
    list($pg, $per, $off) = biz_page();
    $tot = (int)db_val('SELECT COUNT(*)' . $from, $p);
    $out = [];
    foreach (db_rows('SELECT b.*' . $from . ' ORDER BY b.id DESC LIMIT ' . $per . ' OFFSET ' . $off, $p) as $x) $out[] = fr_block_row($x);
    json_out(['blocks' => $out, 'total' => $tot, 'page' => $pg, 'per' => $per]);
}
function h_admin_fraud_block_create() {
    require_admin();
    $b = body_json();
    $kind = (string)($b['kind'] ?? '');
    if (!in_array($kind, ['user', 'ip'], true)) fail(400, 'Choose customer or IP address', 'kind');
    $target = trim((string)($b['target'] ?? ''));
    $reason = clean_str($b['reason'] ?? '', 300);
    if (fr_len($reason) < 5) fail(400, 'Write the reason for this restriction', 'reason');
    $exp = block_expiry($b);
    if ($kind === 'user') {
        if (!db_val('SELECT 1 FROM users WHERE id=?', [$target])) fail(404, 'Customer not found', 'target');
    } else {
        if (!ip_ok($target)) fail(400, 'Enter a valid IP address', 'target');
        if (count(ip_users($target)) > 1 && empty($b['confirm_shared'])) fail(409, 'Several customers used this IP address. Confirm to restrict it anyway.', 'target', 'shared_ip');
    }
    $id = block_apply($kind, $target, $reason, $exp);
    json_out(['ok' => true, 'ref' => block_ref($id)], 201);
}
function h_admin_fraud_block_lift($id) {
    require_admin();
    $b = body_json();
    $x = db_row('SELECT * FROM blocks WHERE id=?', [(int)$id]);
    if (!$x) fail(404, 'Restriction not found');
    if (!(int)$x['active']) fail(409, 'This restriction already ended', null, 'ended');
    block_lift_row($x, fr_admin_name(), clean_str($b['note'] ?? '', 300));
    json_out(['ok' => true]);
}
function h_admin_fraud_audit() {
    require_admin();
    $w = ['1=1']; $p = [];
    $a = trim((string)($_GET['action'] ?? ''));
    if ($a !== '' && preg_match('/^[a-z_]{1,40}$/', $a)) { $w[] = 'action=?'; $p[] = $a; }
    $qs = trim((string)($_GET['q'] ?? ''));
    if ($qs !== '') { $l = '%' . str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $qs) . '%'; $w[] = "(target LIKE ? ESCAPE '!' OR detail LIKE ? ESCAPE '!' OR actor LIKE ? ESCAPE '!')"; array_push($p, $l, $l, $l); }
    list($f, $t) = biz_range_opt();
    if ($f !== null) { $w[] = 'created_at>=? AND created_at<?'; $p[] = $f; $p[] = $t; }
    list($pg, $per, $off) = biz_page();
    $tot = (int)db_val('SELECT COUNT(*) FROM audit_log WHERE ' . implode(' AND ', $w), $p);
    $out = [];
    foreach (db_rows('SELECT * FROM audit_log WHERE ' . implode(' AND ', $w) . ' ORDER BY id DESC LIMIT ' . $per . ' OFFSET ' . $off, $p) as $x)
        $out[] = ['id' => (int)$x['id'], 'role' => $x['actor_role'], 'actor' => $x['actor'] ?? '', 'action' => $x['action'], 'target' => $x['target'] ?? '', 'detail' => $x['detail'] ?? '', 'ip' => $x['ip'] ?? '', 'at' => (int)$x['created_at']];
    json_out(['log' => $out, 'total' => $tot, 'page' => $pg, 'per' => $per]);
}

/* ================= appeals ================= */

function h_appeal_create() {
    $c = fr_cfg();
    if (!(int)$c['appeal_enabled']) fail(403, 'Review requests are not open right now. Please call Customer Care.', null, 'appeal_off');
    $b = body_json();
    $name = clean_str($b['name'] ?? '', 100);
    $mobile = normalize_mobile($b['mobile'] ?? '');
    $msg = clean_str($b['message'] ?? '', 1000);
    if ($name === '') fail(400, 'Enter your name', 'name');
    if (!valid_mobile($mobile)) fail(400, 'Enter a valid mobile number (01XXXXXXXXX)', 'mobile');
    if (fr_len($msg) < 10) fail(400, 'Please explain in a few words why the restriction should be reviewed', 'message');
    $ip = client_ip();
    rl_hit('apip:' . $ip, 5, 3600);
    rl_hit('apmo:' . $mobile, 3, 86400);
    $u = db_row('SELECT id, blocked FROM users WHERE mobile=?', [$mobile]);
    $bl = $u && (int)$u['blocked'] ? block_active_row('user', $u['id']) : null;
    if (!$bl) $bl = block_active_row('ip', $ip);
    if (!$bl) fail(404, 'We could not find an active restriction for this number or connection.', null, 'not_restricted');
    $open = db_row("SELECT ref FROM block_appeals WHERE block_id=? AND mobile=? AND status='open'", [(int)$bl['id'], $mobile]);
    if ($open) json_out(['ok' => true, 'ref' => $open['ref'], 'existing' => true]);
    $ref = 'AP' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
    q('INSERT INTO block_appeals (ref, block_id, user_id, name, mobile, message, ip, status, created_at) VALUES (?,?,?,?,?,?,?,?,?)', [$ref, (int)$bl['id'], $u ? $u['id'] : null, $name, $mobile, $msg, $ip, 'open', now_ts()]);
    audit('appeal_new', $ref, block_ref($bl['id']) . ' by ' . $mobile, 'customer', $name);
    json_out(['ok' => true, 'ref' => $ref], 201);
}
function h_appeal_status() {
    $ref = strtoupper(trim((string)($_GET['ref'] ?? ''))); $mobile = normalize_mobile($_GET['mobile'] ?? '');
    rl_hit('apst:' . client_ip(), 30, 3600);
    $x = preg_match('/^AP[0-9A-F]{6}$/', $ref) ? db_row('SELECT * FROM block_appeals WHERE ref=? AND mobile=?', [$ref, $mobile]) : null;
    if (!$x) fail(404, 'No request found with this reference and mobile number');
    json_out(['ref' => $x['ref'], 'status' => $x['status'], 'reply' => $x['status'] === 'open' ? '' : ($x['admin_note'] ?? ''), 'at' => (int)$x['created_at'], 'decided_at' => $x['decided_at'] ? (int)$x['decided_at'] : null]);
}
function h_admin_fraud_appeals() {
    require_admin();
    $w = ['1=1']; $p = [];
    $st = (string)($_GET['status'] ?? '');
    if (in_array($st, ['open', 'approved', 'rejected'], true)) { $w[] = 'a.status=?'; $p[] = $st; }
    $qs = trim((string)($_GET['q'] ?? ''));
    if ($qs !== '') { $l = '%' . str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $qs) . '%'; $w[] = "(a.ref LIKE ? ESCAPE '!' OR a.mobile LIKE ? ESCAPE '!' OR a.name LIKE ? ESCAPE '!')"; array_push($p, $l, $l, $l); }
    list($pg, $per, $off) = biz_page();
    $tot = (int)db_val('SELECT COUNT(*) FROM block_appeals a WHERE ' . implode(' AND ', $w), $p);
    $out = [];
    foreach (db_rows('SELECT a.*, b.kind bkind, b.target btarget, b.reason breason, b.active bactive FROM block_appeals a LEFT JOIN blocks b ON b.id=a.block_id WHERE ' . implode(' AND ', $w) . ' ORDER BY a.id DESC LIMIT ' . $per . ' OFFSET ' . $off, $p) as $x)
        $out[] = ['id' => (int)$x['id'], 'ref' => $x['ref'], 'block_id' => $x['block_id'] ? (int)$x['block_id'] : null, 'block' => $x['block_id'] ? block_ref($x['block_id']) : '', 'kind' => $x['bkind'] ?? '', 'target' => $x['btarget'] ?? '', 'block_reason' => $x['breason'] ?? '',
                  'block_live' => (int)($x['bactive'] ?? 0) === 1, 'name' => $x['name'], 'mobile' => $x['mobile'], 'message' => $x['message'], 'ip' => $x['ip'] ?? '', 'status' => $x['status'], 'note' => $x['admin_note'] ?? '',
                  'decided_by' => $x['decided_by'], 'decided_at' => $x['decided_at'] ? (int)$x['decided_at'] : null, 'at' => (int)$x['created_at']];
    json_out(['appeals' => $out, 'total' => $tot, 'page' => $pg, 'per' => $per]);
}
function h_admin_fraud_appeal_decide($id) {
    require_admin();
    $b = body_json();
    $dec = (string)($b['decision'] ?? '');
    if (!in_array($dec, ['approve', 'reject'], true)) fail(400, 'Choose approve or reject', 'decision');
    $note = clean_str($b['note'] ?? '', 500);
    if ($note === '') fail(400, 'Write a reply for the customer', 'note');
    $x = db_row('SELECT * FROM block_appeals WHERE id=?', [(int)$id]);
    if (!$x) fail(404, 'Request not found');
    if ($x['status'] !== 'open') fail(409, 'This request was already decided', null, 'decided');
    q('UPDATE block_appeals SET status=?, admin_note=?, decided_by=?, decided_at=? WHERE id=?', [$dec === 'approve' ? 'approved' : 'rejected', $note, fr_admin_name(), now_ts(), (int)$id]);
    if ($dec === 'approve' && !empty($b['unblock']) && $x['block_id']) {
        $bl = db_row('SELECT * FROM blocks WHERE id=? AND active=1', [(int)$x['block_id']]);
        if ($bl) block_lift_row($bl, fr_admin_name(), 'Appeal ' . $x['ref'] . ' approved');
    }
    audit('appeal_' . $dec, $x['ref'], $note . (!empty($b['unblock']) && $dec === 'approve' ? ' (restriction lifted)' : ''));
    json_out(['ok' => true]);
}
