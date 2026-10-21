<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * Rider panel: rider-side endpoints (/rider/*) and admin-side rider
 * management (/admin/riders*, /admin/orders/{id}/assign|unassign).
 * ===================================================================== */

const RSTAT_ORDER = ['assigned', 'accepted', 'going', 'picked', 'ontheway', 'arrived', 'delivered'];
const RSTAT_ACTIVE = ['accepted', 'going', 'picked', 'ontheway', 'arrived'];
const RIDER_VEHICLES = ['cycle', 'bike', 'car'];
const RIDER_FAIL_REASONS = ['customer_unreachable', 'customer_not_home', 'wrong_address', 'customer_refused', 'vehicle_problem', 'other'];
const RIDER_DOC_KINDS = ['photo', 'nid_front', 'nid_back', 'license'];

/* ---------- helpers ---------- */
function rider_docs($r) {
    $d = json_decode((string)($r['docs'] ?? ''), true);
    return is_array($d) ? $d : [];
}
function rider_chg($r) {
    $d = json_decode((string)($r['chg'] ?? ''), true);
    return is_array($d) && $d ? $d : null;
}
function rider_out($r) {
    $docs = rider_docs($r);
    return [
        'id' => (int)$r['id'], 'code' => rider_code($r['id']), 'name' => $r['name'], 'mobile' => $r['mobile'], 'email' => $r['email'],
        'address' => $r['address'], 'nid' => $r['nid'],
        'vehicle_type' => $r['vehicle_type'], 'vehicle_no' => $r['vehicle_no'], 'license_no' => $r['license_no'],
        'emerg_name' => $r['emerg_name'], 'emerg_mobile' => $r['emerg_mobile'],
        'status' => $r['status'], 'reject_reason' => $r['reject_reason'], 'online' => (int)$r['online'],
        'has_photo' => !empty($r['photo']),
        'docs' => ['nid_front' => !empty($docs['nid_front']), 'nid_back' => !empty($docs['nid_back']), 'license' => !empty($docs['license'])],
        'chg' => rider_chg($r),
        'created_at' => (int)$r['created_at'], 'approved_at' => $r['approved_at'] === null ? null : (int)$r['approved_at'],
    ];
}
/** Online and the rider app checked in recently (it polls every 15 seconds while open). */
function rider_online_now($r) { return $r['status'] === 'approved' && (int)$r['online'] === 1 && $r['last_seen'] !== null && (int)$r['last_seen'] >= now_ts() - 180; }
function rider_code($id) { return 'NBR-' . str_pad((string)(int)$id, 4, '0', STR_PAD_LEFT); }
function rider_notify($rid, $title, $body = '', $o = []) { return notify('rider', (string)(int)$rid, $title, $body, $o); }
/** Logged-in rider. $approved=true additionally demands an approved account. */
function require_rider($approved = false) {
    $s = current_session();
    if (!$s || $s['role'] !== 'rider') fail(401, 'Authentication required');
    $r = db_row('SELECT * FROM riders WHERE id=?', [(int)$s['user_id']]);
    if (!$r) fail(401, 'Authentication required');
    if ($r['status'] === 'suspended' && $approved) fail(403, 'Your account is suspended', null, 'suspended');
    if ($approved && $r['status'] !== 'approved') fail(403, 'Your account is not approved yet', null, 'not_approved');
    q('UPDATE riders SET last_seen=? WHERE id=?', [now_ts(), $r['id']]);
    return $r;
}
function rider_priv_dir() {
    $dir = dirname(__DIR__) . '/priv';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $ht = $dir . '/.htaccess';
    if (!is_file($ht)) @file_put_contents($ht, "Require all denied\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n");
    if (!is_file($dir . '/index.html')) @file_put_contents($dir . '/index.html', '');
    if (!is_dir($dir) || !is_writable($dir)) fail(500, 'Private upload folder is not writable');
    return $dir;
}
function rider_validate_profile($b, &$out, $partial = false) {
    $out = [];
    $has = function ($k) use ($b) { return array_key_exists($k, $b); };
    if (!$partial || $has('name')) { $v = clean_str($b['name'] ?? '', 100); if (mb_strlen($v) < 2) fail(400, 'Enter your full name', 'name'); $out['name'] = $v; }
    if (!$partial || $has('mobile')) { $v = normalize_mobile($b['mobile'] ?? ''); if (!valid_mobile($v)) fail(400, 'Enter a valid mobile number (01XXXXXXXXX)', 'mobile'); $out['mobile'] = $v; }
    if (!$partial || $has('email')) { $v = strtolower(clean_str($b['email'] ?? '', 190)); if ($v !== '' && !valid_email($v)) fail(400, 'Enter a valid email address', 'email'); $out['email'] = $v === '' ? null : $v; }
    if (!$partial || $has('address')) { $v = clean_str($b['address'] ?? '', 500); if ($v === '') fail(400, 'Address is required', 'address'); $out['address'] = $v; }
    if (!$partial || $has('nid')) { $v = preg_replace('/\s+/', '', clean_str($b['nid'] ?? '', 40)); if (!preg_match('/^[0-9A-Za-z\-]{6,30}$/', $v)) fail(400, 'Enter a valid NID / ID number', 'nid'); $out['nid'] = $v; }
    if (!$partial || $has('vehicle_type')) { $v = (string)($b['vehicle_type'] ?? ''); if (!in_array($v, RIDER_VEHICLES, true)) fail(400, 'Choose a vehicle type', 'vehicle_type'); $out['vehicle_type'] = $v; }
    $vt = $out['vehicle_type'] ?? (string)($b['vehicle_type'] ?? '');
    if (!$partial || $has('vehicle_no')) { $v = clean_str($b['vehicle_no'] ?? '', 40); if ($vt !== 'cycle' && $v === '') fail(400, 'Vehicle number is required', 'vehicle_no'); $out['vehicle_no'] = $v === '' ? null : $v; }
    if (!$partial || $has('license_no')) { $v = clean_str($b['license_no'] ?? '', 60); if ($vt !== 'cycle' && $v === '') fail(400, 'Driving license number is required', 'license_no'); $out['license_no'] = $v === '' ? null : $v; }
    if (!$partial || $has('emerg_name')) { $v = clean_str($b['emerg_name'] ?? '', 100); if ($v === '') fail(400, 'Emergency contact name is required', 'emerg_name'); $out['emerg_name'] = $v; }
    if (!$partial || $has('emerg_mobile')) { $v = normalize_mobile($b['emerg_mobile'] ?? ''); if (!valid_mobile($v)) fail(400, 'Enter a valid emergency contact number', 'emerg_mobile'); $out['emerg_mobile'] = $v; }
}
function rider_dup_check($mobile, $email, $exceptId = 0) {
    if ($mobile !== null && db_val('SELECT 1 FROM riders WHERE mobile=? AND id<>?', [$mobile, $exceptId])) fail(409, 'This mobile number is already registered as a rider', 'mobile');
    if ($email !== null && $email !== '' && db_val('SELECT 1 FROM riders WHERE email=? AND id<>?', [$email, $exceptId])) fail(409, 'This email is already registered as a rider', 'email');
}

/* ---------- auth ---------- */
function h_rider_signup() {
    $b = body_json();
    rider_validate_profile($b, $p);
    $pw = (string)($b['password'] ?? '');
    if (strlen($pw) < 8) fail(400, 'Password must be at least 8 characters', 'password');
    if (strlen($pw) > 200) fail(400, 'Password too long', 'password');
    rider_dup_check($p['mobile'], $p['email']);
    try {
        q('INSERT INTO riders (name,mobile,email,pw_hash,address,nid,vehicle_type,vehicle_no,license_no,emerg_name,emerg_mobile,status,online,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0,?)',
          [$p['name'], $p['mobile'], $p['email'], password_hash($pw, PASSWORD_DEFAULT), $p['address'], $p['nid'], $p['vehicle_type'], $p['vehicle_no'], $p['license_no'], $p['emerg_name'], $p['emerg_mobile'], 'pending', now_ts()]);
    } catch (PDOException $e) {
        if (is_unique_violation($e)) fail(409, 'This mobile number or email is already registered as a rider', 'mobile');
        throw $e;
    }
    $r = db_row('SELECT * FROM riders WHERE mobile=?', [$p['mobile']]);
    json_out(['token' => create_session($r['id'], 'rider'), 'rider' => rider_out($r)], 201);
}

function h_rider_login() {
    $b = body_json();
    $id = trim((string)($b['id'] ?? ''));
    $pw = (string)($b['password'] ?? '');
    throttle_check('rl');
    $r = null;
    if ($id !== '') {
        if (strpos($id, '@') !== false) $r = db_row('SELECT * FROM riders WHERE email=?', [strtolower($id)]);
        else $r = db_row('SELECT * FROM riders WHERE mobile=?', [normalize_mobile($id)]);
    }
    if (!$r || $pw === '' || !password_verify($pw, $r['pw_hash'])) { throttle_fail('rl'); fail(401, 'Invalid mobile/email or password'); }
    throttle_clear('rl');
    json_out(['token' => create_session($r['id'], 'rider'), 'rider' => rider_out($r)]);
}

function h_rider_me() {
    $r = require_rider(false);
    json_out(['rider' => rider_out($r)]);
}

function h_rider_me_update() {
    $r = require_rider(false);
    if ($r['status'] === 'suspended') fail(403, 'Your account is suspended', null, 'suspended');
    $b = body_json();
    $direct = ['address', 'emerg_name', 'emerg_mobile'];
    $guarded = ['mobile', 'email', 'vehicle_type', 'vehicle_no', 'license_no'];
    if ($r['status'] === 'approved') {
        $in = []; foreach (array_merge($direct, $guarded) as $k) if (array_key_exists($k, $b)) $in[$k] = $b[$k];
        if (!$in) fail(400, 'Nothing to update');
        // vehicle rules need the effective vehicle type
        if (array_key_exists('vehicle_no', $in) || array_key_exists('license_no', $in)) $in['vehicle_type'] = $in['vehicle_type'] ?? $r['vehicle_type'];
        rider_validate_profile($in, $p, true);
        $set = []; $par = []; $chg = rider_chg($r) ?: [];
        foreach ($p as $k => $v) {
            if (in_array($k, $direct, true)) { $set[] = "$k=?"; $par[] = $v; }
            else {
                $cur = $r[$k];
                if ((string)$v === (string)$cur) { unset($chg[$k]); continue; }
                $chg[$k] = $v;
            }
        }
        if (isset($chg['mobile']) || isset($chg['email'])) rider_dup_check($chg['mobile'] ?? null, $chg['email'] ?? null, (int)$r['id']);
        $set[] = 'chg=?'; $par[] = $chg ? json_encode($chg, JSON_UNESCAPED_UNICODE) : null;
        $par[] = $r['id'];
        q('UPDATE riders SET ' . implode(',', $set) . ' WHERE id=?', $par);
    } else { // pending / rejected: free edit of the application
        $in = []; foreach (array_merge($direct, $guarded, ['name', 'nid']) as $k) if (array_key_exists($k, $b)) $in[$k] = $b[$k];
        if (!$in) fail(400, 'Nothing to update');
        $in['vehicle_type'] = $in['vehicle_type'] ?? $r['vehicle_type'];
        rider_validate_profile($in, $p, true);
        if (isset($p['mobile']) || isset($p['email'])) rider_dup_check($p['mobile'] ?? null, $p['email'] ?? null, (int)$r['id']);
        $set = []; $par = [];
        foreach ($p as $k => $v) { $set[] = "$k=?"; $par[] = $v; }
        $par[] = $r['id'];
        q('UPDATE riders SET ' . implode(',', $set) . ' WHERE id=?', $par);
    }
    json_out(['rider' => rider_out(db_row('SELECT * FROM riders WHERE id=?', [$r['id']]))]);
}

function h_rider_reapply() {
    $r = require_rider(false);
    if ($r['status'] !== 'rejected') fail(400, 'Only a rejected application can be re-submitted');
    q("UPDATE riders SET status='pending', reject_reason=NULL WHERE id=?", [$r['id']]);
    json_out(['rider' => rider_out(db_row('SELECT * FROM riders WHERE id=?', [$r['id']]))]);
}

function h_rider_password() {
    $r = require_rider(false);
    $b = body_json();
    $pw = (string)($b['password'] ?? '');
    if (strlen($pw) < 8) fail(400, 'Password must be at least 8 characters', 'password');
    if (strlen($pw) > 200) fail(400, 'Password too long', 'password');
    if (!password_verify((string)($b['current'] ?? ''), $r['pw_hash'])) fail(400, 'Current password is incorrect', 'current');
    q('UPDATE riders SET pw_hash=? WHERE id=?', [password_hash($pw, PASSWORD_DEFAULT), $r['id']]);
    json_out(['ok' => true]);
}

/* ---------- private documents ---------- */
function h_rider_upload() {
    upload_guard();
    $r = require_rider(false);
    if ($r['status'] === 'suspended') fail(403, 'Your account is suspended', null, 'suspended');
    $kind = (string)($_POST['kind'] ?? '');
    if (!in_array($kind, RIDER_DOC_KINDS, true)) fail(400, 'Invalid document type', 'kind');
    $up = upload_take('file', $kind !== 'photo' ? ['application/pdf' => 'pdf'] : [], UPLOAD_MAX_MB, ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp']);
    $exts = [$up['mime'] => $up['ext']]; $mime = $up['mime'];
    $dir = rider_priv_dir();
    $name = 'r' . (int)$r['id'] . '_' . $kind . '_' . bin2hex(random_bytes(8)) . '.' . $exts[$mime];
    if ($mime === 'application/pdf') { if (!@move_uploaded_file($up['tmp'], $dir . '/' . $name)) fail(500, 'Could not save file'); }
    else upload_store($up, $dir . '/' . $name, 1800);
    @chmod($dir . '/' . $name, 0640);
    $old = null;
    if ($kind === 'photo') {
        $old = $r['photo'];
        q('UPDATE riders SET photo=? WHERE id=?', [$name, $r['id']]);
    } else {
        $docs = rider_docs($r); $old = $docs[$kind] ?? null; $docs[$kind] = $name;
        q('UPDATE riders SET docs=? WHERE id=?', [json_encode($docs), $r['id']]);
    }
    if ($old && preg_match('/^r\d+_[a-z_]+_[0-9a-f]{16}\.(jpg|png|webp|pdf)$/', $old)) @unlink($dir . '/' . $old);
    json_out(['rider' => rider_out(db_row('SELECT * FROM riders WHERE id=?', [$r['id']]))]);
}
function rider_send_file($r, $kind) {
    if (!in_array($kind, RIDER_DOC_KINDS, true)) fail(400, 'Invalid document type', 'kind');
    $name = $kind === 'photo' ? ($r['photo'] ?? null) : (rider_docs($r)[$kind] ?? null);
    if (!$name || !preg_match('/^r\d+_[a-z_]+_[0-9a-f]{16}\.(jpg|png|webp|pdf)$/', $name)) fail(404, 'File not found');
    $path = rider_priv_dir() . '/' . $name;
    if (!is_file($path)) fail(404, 'File not found');
    $types = ['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'pdf' => 'application/pdf'];
    header('Content-Type: ' . $types[pathinfo($name, PATHINFO_EXTENSION)]);
    header('Content-Length: ' . filesize($path));
    header('Cache-Control: private, no-store');
    header('X-Content-Type-Options: nosniff');
    readfile($path);
    exit;
}
function h_rider_file() {
    $r = require_rider(false);
    rider_send_file($r, (string)($_GET['kind'] ?? 'photo'));
}

/* ---------- online / dashboard ---------- */
function h_rider_online() {
    $r = require_rider(true);
    $b = body_json();
    if (!array_key_exists('online', $b)) fail(400, 'online is required', 'online');
    $on = !empty($b['online']) ? 1 : 0;
    q('UPDATE riders SET online=? WHERE id=?', [$on, $r['id']]);
    json_out(['online' => $on]);
}

function day_start($offsetDays = 0) { return strtotime(date('Y-m-d', now_ts()) . ' 00:00:00 ' . ($offsetDays >= 0 ? '+' : '') . $offsetDays . ' day'); }


/* ---------- COD cash collected by riders ---------- */
function rider_cash($riderId, $from, $to = null) {
    $par = [(int)$riderId, $from]; $w = '';
    if ($to) { $w = ' AND d.updated_at<?'; $par[] = $to; }
    $rows = db_rows("SELECT o.id, o.total AS cod, o.name, d.updated_at FROM deliveries d JOIN orders o ON o.id=d.order_id WHERE d.rider_id=? AND d.rstat='delivered' AND o.pay='cod' AND d.updated_at>=?$w ORDER BY d.updated_at DESC LIMIT 2000", $par);
    $days = []; $orders = []; $total = 0.0;
    foreach ($rows as $x) {
        $k = date('Y-m-d', (int)$x['updated_at']); $a = money($x['cod']);
        if (!isset($days[$k])) $days[$k] = ['date' => $k, 'total' => 0.0, 'count' => 0];
        $days[$k]['total'] += $a; $days[$k]['count']++; $total += $a;
        $orders[] = ['id' => $x['id'], 'cod' => $a, 'cu' => $x['name'], 'at' => (int)$x['updated_at'] * 1000];
    }
    foreach ($days as &$d) $d['total'] = money($d['total']); unset($d);
    return ['total' => money($total), 'count' => count($rows), 'days' => array_values($days), 'orders' => $orders];
}
function rider_cash_range() {
    $range = (string)($_GET['range'] ?? 'today'); $from = day_start(0); $to = null;
    if ($range === 'yesterday') { $from = day_start(-1); $to = day_start(0); }
    elseif ($range === 'week') $from = day_start(-6);
    elseif ($range === 'month') $from = strtotime(date('Y-m-01', now_ts()) . ' 00:00:00');
    elseif ($range === 'custom') {
        $f = (string)($_GET['from'] ?? ''); $t = (string)($_GET['to'] ?? '');
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $f)) $from = strtotime($f . ' 00:00:00');
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $t)) $to = strtotime($t . ' 00:00:00 +1 day');
    }
    return [$from, $to];
}
function h_rider_cash() {
    $r = require_rider(true);
    list($from, $to) = rider_cash_range();
    json_out(rider_cash((int)$r['id'], $from, $to));
}
function h_admin_rider_cash($id) {
    require_admin();
    if (!db_row('SELECT id FROM riders WHERE id=?', [(int)$id])) fail(404, 'Rider not found');
    list($from, $to) = rider_cash_range();
    json_out(rider_cash((int)$id, $from, $to));
}

function rider_order_out($o, $d, $full = true) {
    $items = json_decode((string)$o['items'], true);
    list($its, $pickups) = order_pickups(is_array($items) ? $items : [], $o['shop'] ?? null);
    $extra = json_decode((string)$o['extra'], true);
    if (!is_array($extra)) $extra = [];
    $note = '';
    foreach (['note', 'notes', 'instructions', 'instruction'] as $k) if (!empty($extra[$k]) && is_string($extra[$k])) { $note = clean_str($extra[$k], 500); break; }
    $loc = isset($extra['loc']) && is_string($extra['loc']) ? trim($extra['loc']) : '';
    $coord = null;
    if (preg_match('/^\s*(-?\d{1,2}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)\s*$/', $loc, $m)) $coord = [(float)$m[1], (float)$m[2]];
    $dest = $coord ? ($coord[0] . ',' . $coord[1]) : (string)$o['address'];
    $created = (int)$o['created_at'];
    $out = [
        'id' => $o['id'], 'view' => $o['view'], 'status' => $o['status'], 'rstat' => $d['rstat'],
        'fail_reason' => $d['fail_reason'],
        'customer' => ['name' => $o['name'], 'mobile' => $o['mobile']],
        'pickup' => $pickups ? $pickups[0] : ['name' => $o['shop']],
        'pickups' => $pickups,
        'multi' => count($pickups) > 1,
        'area' => isset($extra['area']) && is_array($extra['area']) ? array_map(function ($x) { return ['n' => (string)($x['n'] ?? ''), 'bn' => (string)($x['bn'] ?? '')]; }, $extra['area']) : [],
        'delivery' => ['address' => $o['address'], 'lat' => $coord ? $coord[0] : null, 'lng' => $coord ? $coord[1] : null, 'geo' => (isset($extra['geo']) && is_array($extra['geo'])) ? $extra['geo'] : null, 'zone' => (isset($extra['zone']) && is_array($extra['zone'])) ? $extra['zone'] : null],
        'live' => order_live_out($o['id']),
        'items' => $its,
        'sub' => money($o['sub']), 'fee' => money($o['fee']), 'total' => money($o['total']),
        'pay' => $o['pay'], 'collect' => $o['pay'] === 'cod' ? money($o['total']) : 0,
        'ordered_at' => $created * 1000,
        'deadline' => ($eta = order_eta($o)) ? $eta['due'] : null,
        'eta' => $eta, 'delay_left' => $eta ? max(0, delay_max_count() - count($eta['delays'])) : 0,
        'rider_pay' => isset($extra['rider_pay']) && is_num($extra['rider_pay']) ? money($extra['rider_pay']) : null,
        'note' => $note,
        'assigned_at' => (int)$d['assigned_at'] * 1000, 'updated_at' => (int)$d['updated_at'] * 1000,
        'nav_delivery' => 'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' . rawurlencode($dest),
        'nav_pickup' => $pickups && $pickups[0]['nav'] ? $pickups[0]['nav'] : ($o['shop'] ? 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode((string)$o['shop']) : null),
    ];
    return $out;
}

/** Order lines with real product photos, and one pickup stop per shop (logo, owner photo, address, map location, what to collect). */
function order_pickups($items, $orderShop = null) {
    static $state = null;
    if ($state === null) { $state = []; list($D) = admin_state(); foreach (($D['products'] ?? []) as $p) if (is_array($p) && isset($p['id']) && is_scalar($p['id'])) $state[(string)$p['id']] = $p; }
    $lookup = seller_shop_lookup();
    $its = []; $stops = []; $sellers = [];
    foreach ($items as $i) {
        if (!is_array($i)) continue;
        $img = ''; $pid = isset($i['id']) ? (string)$i['id'] : '';
        if (preg_match('/^SP(\d+)$/', $pid, $m)) {
            $p = db_row('SELECT imgs, vr FROM seller_products WHERE id=?', [(int)$m[1]]);
            if ($p) {
                $vr = seller_vr_parse($p['vr'] ?? null);
                if ($vr && !empty($i['vid'])) foreach ($vr['v'] as $v) if ((string)$v['id'] === (string)$i['vid'] && !empty($v['img'])) $img = seller_img_url(seller_vr_img_name($v['img'])) ?: '';
                if ($img === '') { $im = seller_images($p); $img = $im ? (seller_img_url($im[0]) ?: '') : ''; }
            }
        } elseif ($pid !== '' && isset($state[$pid])) $img = (string)($state[$pid]['img'] ?? '');
        $q = (int)($i['q'] ?? 1); $u = money($i['unit'] ?? 0);
        $shop = trim((string)($i['shop'] ?? '')) ?: trim((string)$orderShop);
        $line = ['n' => $i['n'] ?? '', 'bn' => $i['bn'] ?? ($i['n'] ?? ''), 'e' => $i['e'] ?? '', 'q' => $q, 'unit' => $u, 'total' => money($u * $q),
                 'variant' => (string)($i['variant'] ?? ''), 'img' => preg_match('#^https?://#', $img) ? $img : '', 'shop' => $shop];
        $its[] = $line;
        $key = mb_strtolower($shop);
        if (!isset($stops[$key])) {
            $sid = $lookup[$key] ?? null; $s = null;
            if ($sid) { if (!isset($sellers[$sid])) $sellers[$sid] = db_row('SELECT * FROM sellers WHERE id=?', [$sid]); $s = $sellers[$sid]; }
            $lat = $s && $s['lat'] !== null ? (float)$s['lat'] : null; $lng = $s && $s['lng'] !== null ? (float)$s['lng'] : null;
            $stops[$key] = ['name' => $s ? $s['shop_name'] : $shop, 'logo' => $s ? (seller_img_url($s['logo']) ?: '') : '', 'photo' => $s ? (seller_img_url($s['photo'] ?? null) ?: '') : '',
                'owner' => $s ? $s['owner_name'] : '', 'mobile' => $s ? $s['mobile'] : '', 'address' => $s ? (string)($s['address'] ?? '') : '', 'lat' => $lat, 'lng' => $lng,
                'nav' => $s ? seller_nav_url($s) : null, 'map' => ($lat !== null ? 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode($lat . ',' . $lng) : null), 'items' => []];
            if (!$stops[$key]['nav'] && $shop !== '') $stops[$key]['nav'] = 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode($shop . ($s && $s['address'] ? ', ' . $s['address'] : ''));
        }
        $stops[$key]['items'][] = $line;
    }
    return [$its, array_values($stops)];
}

function h_rider_dashboard() {
    $r = require_rider(true);
    $id = (int)$r['id']; $t0 = day_start(0);
    $c = function ($sql, $par) { return (int)db_val($sql, $par); };
    $act = "'accepted','going','picked','ontheway','arrived'";
    $first = db_row("SELECT o.*, d.rstat, d.fail_reason, d.assigned_at, d.updated_at AS d_upd FROM deliveries d JOIN orders o ON o.id=d.order_id WHERE d.rider_id=? AND d.rstat IN ($act) ORDER BY d.updated_at DESC LIMIT 1", [$id]);
    $activeOrder = null;
    if ($first) { $d = ['rstat' => $first['rstat'], 'fail_reason' => $first['fail_reason'], 'assigned_at' => $first['assigned_at'], 'updated_at' => $first['d_upd']]; $activeOrder = rider_order_out($first, $d); }
    $cashT = (float)db_val("SELECT COALESCE(SUM(o.total),0) FROM deliveries d JOIN orders o ON o.id=d.order_id WHERE d.rider_id=? AND d.rstat='delivered' AND o.pay='cod' AND d.updated_at>=?", [$id, $t0]);
    json_out([
        'cash_today' => money($cashT),
        'earn' => rider_earn_summary($id),
        'rider' => rider_out($r),
        'today' => $c("SELECT COUNT(*) FROM deliveries WHERE rider_id=? AND assigned_at>=? AND rstat<>'rejected'", [$id, $t0]),
        'pending' => $c("SELECT COUNT(*) FROM deliveries WHERE rider_id=? AND rstat='assigned'", [$id]),
        'active' => $c("SELECT COUNT(*) FROM deliveries WHERE rider_id=? AND rstat IN ($act)", [$id]),
        'completed_today' => $c("SELECT COUNT(*) FROM deliveries WHERE rider_id=? AND rstat='delivered' AND updated_at>=?", [$id, $t0]),
        'cancelled_today' => $c("SELECT COUNT(*) FROM deliveries WHERE rider_id=? AND rstat IN ('failed','cancelled') AND updated_at>=?", [$id, $t0]),
        'completed_total' => $c("SELECT COUNT(*) FROM deliveries WHERE rider_id=? AND rstat='delivered'", [$id]),
        'unread' => $c('SELECT COUNT(*) FROM rider_notif WHERE rider_id=? AND is_read=0', [$id]),
        'active_order' => $activeOrder,
    ]);
}

/* ---------- orders ---------- */
function rider_load_delivery($rider, $oid) {
    $d = db_row('SELECT * FROM deliveries WHERE order_id=? AND rider_id=?' . lock_suffix(), [$oid, (int)$rider['id']]);
    if (!$d) fail(404, 'Order not found');
    $o = db_row('SELECT * FROM orders WHERE id=?', [$oid]);
    if (!$o) fail(404, 'Order not found');
    return [$o, $d];
}

function h_rider_orders() {
    $r = require_rider(true);
    $id = (int)$r['id'];
    $tab = (string)($_GET['tab'] ?? 'active');
    $where = ''; $par = [$id];
    if ($tab === 'pending') $where = "AND d.rstat='assigned'";
    elseif ($tab === 'active') $where = "AND d.rstat IN ('accepted','going','picked','ontheway','arrived')";
    elseif ($tab === 'history') {
        $where = "AND d.rstat IN ('delivered','failed','cancelled')";
        $range = (string)($_GET['range'] ?? '');
        $from = null; $to = null;
        if ($range === 'today') { $from = day_start(0); }
        elseif ($range === 'yesterday') { $from = day_start(-1); $to = day_start(0); }
        elseif ($range === 'week') { $from = day_start(-6); }
        elseif ($range === 'month') { $from = strtotime(date('Y-m-01', now_ts()) . ' 00:00:00'); }
        elseif ($range === 'custom') {
            $f = (string)($_GET['from'] ?? ''); $t = (string)($_GET['to'] ?? '');
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $f)) $from = strtotime($f . ' 00:00:00');
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $t)) $to = strtotime($t . ' 00:00:00 +1 day');
        }
        if ($from) { $where .= ' AND d.updated_at>=?'; $par[] = $from; }
        if ($to) { $where .= ' AND d.updated_at<?'; $par[] = $to; }
        $st = (string)($_GET['st'] ?? '');
        $map = ['completed' => 'delivered', 'failed' => 'failed', 'cancelled' => 'cancelled'];
        if (isset($map[$st])) { $where .= ' AND d.rstat=?'; $par[] = $map[$st]; }
    } else fail(400, 'Invalid tab', 'tab');
    $rows = db_rows("SELECT o.*, d.rstat, d.fail_reason, d.assigned_at, d.updated_at AS d_upd FROM deliveries d JOIN orders o ON o.id=d.order_id WHERE d.rider_id=? $where ORDER BY d.updated_at DESC LIMIT 200", $par);
    $out = [];
    foreach ($rows as $o) $out[] = rider_order_out($o, ['rstat' => $o['rstat'], 'fail_reason' => $o['fail_reason'], 'assigned_at' => $o['assigned_at'], 'updated_at' => $o['d_upd']]);
    json_out(['orders' => $out]);
}

function h_rider_order_get($id) {
    $r = require_rider(true);
    list($o, $d) = rider_load_delivery($r, $id);
    json_out(['order' => rider_order_out($o, $d)]);
}

function rider_set_order_status($oid, $status) {
    $prev = db_val('SELECT status FROM orders WHERE id=?', [$oid]);
    q('UPDATE orders SET status=?, updated_at=? WHERE id=?', [$status, now_ts(), $oid]);
    order_after_status($oid, $prev);
}

function h_rider_order_accept($id) {
    $r = require_rider(true);
    db_tx(function () use ($r, $id) {
        list($o, $d) = rider_load_delivery($r, $id);
        if ($d['rstat'] !== 'assigned') fail(409, 'This order cannot be accepted now', null, 'bad_state');
        q('UPDATE deliveries SET rstat=?, updated_at=? WHERE order_id=?', ['accepted', now_ts(), $id]);
        if ($o['status'] === 'Pending') rider_set_order_status($id, 'Confirmed');
    });
    json_out(['ok' => true, 'rstat' => 'accepted']);
}

function h_rider_order_reject($id) {
    $r = require_rider(true);
    db_tx(function () use ($r, $id) {
        list($o, $d) = rider_load_delivery($r, $id);
        if ($d['rstat'] !== 'assigned') fail(409, 'Only a newly assigned order can be rejected', null, 'bad_state');
        q('UPDATE deliveries SET rstat=?, updated_at=? WHERE order_id=?', ['rejected', now_ts(), $id]);
    });
    json_out(['ok' => true, 'rstat' => 'rejected']);
}

function h_rider_order_status($id) {
    $r = require_rider(true);
    $b = body_json();
    $to = (string)($b['to'] ?? '');
    if (!in_array($to, ['going', 'picked', 'ontheway', 'arrived'], true)) fail(400, 'Invalid status', 'to');
    db_tx(function () use ($r, $id, $to) {
        list($o, $d) = rider_load_delivery($r, $id);
        $ci = array_search($d['rstat'], RSTAT_ORDER, true);
        if ($ci === false || !in_array($d['rstat'], RSTAT_ACTIVE, true)) fail(409, 'This order cannot be updated now', null, 'bad_state');
        if (array_search($to, RSTAT_ORDER, true) <= $ci) fail(409, 'Status can only move forward', null, 'bad_state');
        q('UPDATE deliveries SET rstat=?, updated_at=? WHERE order_id=?', [$to, now_ts(), $id]);
        if (in_array($to, ['picked', 'ontheway', 'arrived'], true) && $o['status'] !== 'Out for delivery') rider_set_order_status($id, 'Out for delivery');
    });
    json_out(['ok' => true, 'rstat' => $to]);
}

function h_rider_order_deliver($id) {
    $r = require_rider(true);
    $b = body_json();
    $code = preg_replace('/\D/', '', (string)($b['otp'] ?? ''));
    if ($code === '') fail(400, 'Enter the delivery code', 'otp');
    throttle_check('od' . $id);
    $res = db_tx(function () use ($r, $id, $code) {
        list($o, $d) = rider_load_delivery($r, $id);
        if (!in_array($d['rstat'], ['picked', 'ontheway', 'arrived'], true)) fail(409, 'Pick up the order before completing the delivery', null, 'bad_state');
        if (!hash_equals((string)$d['otp'], $code)) return false;
        q('UPDATE deliveries SET rstat=?, updated_at=? WHERE order_id=?', ['delivered', now_ts(), $id]);
        rider_set_order_status($id, 'Delivered');
        return true;
    });
    if (!$res) { throttle_fail('od' . $id); fail(400, 'Wrong delivery code', 'otp', 'bad_otp'); }
    throttle_clear('od' . $id);
    json_out(['ok' => true, 'rstat' => 'delivered']);
}

function h_rider_order_fail($id) {
    $r = require_rider(true);
    $b = body_json();
    $reason = (string)($b['reason'] ?? '');
    if (!in_array($reason, RIDER_FAIL_REASONS, true)) fail(400, 'Choose a reason', 'reason');
    $note = clean_str($b['note'] ?? '', 120);
    if ($reason === 'other' && $note === '') fail(400, 'Please write the reason', 'note');
    db_tx(function () use ($r, $id, $reason, $note) {
        list($o, $d) = rider_load_delivery($r, $id);
        if (!in_array($d['rstat'], RSTAT_ACTIVE, true)) fail(409, 'This order cannot be marked failed now', null, 'bad_state');
        q('UPDATE deliveries SET rstat=?, fail_reason=?, updated_at=? WHERE order_id=?', ['failed', $note !== '' ? $reason . ': ' . $note : $reason, now_ts(), $id]);
    });
    json_out(['ok' => true, 'rstat' => 'failed']);
}

/* ---------- notifications ---------- */
function h_rider_notifications() {
    $r = require_rider(false);
    $rows = db_rows('SELECT * FROM rider_notif WHERE rider_id=? ORDER BY id DESC LIMIT 60', [(int)$r['id']]);
    $out = [];
    foreach ($rows as $n) $out[] = ['id' => (int)$n['id'], 'title' => $n['title'], 'body' => $n['body'], 'read' => (int)$n['is_read'], 'at' => (int)$n['created_at'] * 1000, 'url' => $n['url'] ?? null, 'kind' => $n['kind'] ?? null];
    json_out(['notifications' => $out, 'unread' => (int)db_val('SELECT COUNT(*) FROM rider_notif WHERE rider_id=? AND is_read=0', [(int)$r['id']])]);
}
function h_rider_notifications_read() {
    $r = require_rider(false);
    q('UPDATE rider_notif SET is_read=1 WHERE rider_id=?', [(int)$r['id']]);
    json_out(['ok' => true]);
}

/* =====================================================================
 * Admin side
 * ===================================================================== */
function h_admin_riders() {
    require_admin();
    $status = (string)($_GET['status'] ?? 'all');
    $qs = strtolower(trim((string)($_GET['q'] ?? '')));
    $rows = db_rows('SELECT * FROM riders ORDER BY created_at DESC, id DESC LIMIT 2000');
    $counts = ['pending' => 0, 'approved' => 0, 'rejected' => 0, 'suspended' => 0];
    $act = []; $done = [];
    foreach (db_rows("SELECT rider_id, rstat, COUNT(*) c FROM deliveries GROUP BY rider_id, rstat") as $x) {
        if (in_array($x['rstat'], RSTAT_ACTIVE, true) || $x['rstat'] === 'assigned') $act[$x['rider_id']] = ($act[$x['rider_id']] ?? 0) + (int)$x['c'];
        if ($x['rstat'] === 'delivered') $done[$x['rider_id']] = (int)$x['c'];
    }
    $cash = []; $t0 = day_start(0);
    foreach (db_rows("SELECT d.rider_id, SUM(o.total) c FROM deliveries d JOIN orders o ON o.id=d.order_id WHERE d.rstat='delivered' AND o.pay='cod' AND d.updated_at>=? GROUP BY d.rider_id", [$t0]) as $x) $cash[$x['rider_id']] = money($x['c']);
    $out = [];
    foreach ($rows as $r) {
        if (isset($counts[$r['status']])) $counts[$r['status']]++;
        if ($status !== 'all' && $r['status'] !== $status) continue;
        if ($qs !== '' && strpos(strtolower($r['name'] . ' ' . $r['mobile'] . ' ' . $r['email']), $qs) === false) continue;
        $o = rider_out($r);
        $o['active_orders'] = $act[$r['id']] ?? 0;
        $o['delivered'] = $done[$r['id']] ?? 0;
        $o['cash_today'] = $cash[$r['id']] ?? 0;
        $o['last_seen'] = $r['last_seen'] === null ? null : (int)$r['last_seen'] * 1000;
        $o['online_now'] = rider_online_now($r);
        $out[] = $o;
    }
    json_out(['riders' => $out, 'counts' => $counts]);
}

function h_admin_rider_get($id) {
    require_admin();
    $r = db_row('SELECT * FROM riders WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Rider not found');
    $o = rider_out($r);
    $o['last_seen'] = $r['last_seen'] === null ? null : (int)$r['last_seen'] * 1000;
    $recent = [];
    foreach (db_rows('SELECT d.order_id, d.rstat, d.fail_reason, d.updated_at, o.name, o.total FROM deliveries d JOIN orders o ON o.id=d.order_id WHERE d.rider_id=? ORDER BY d.updated_at DESC LIMIT 20', [(int)$id]) as $x)
        $recent[] = ['id' => $x['order_id'], 'rstat' => $x['rstat'], 'fail_reason' => $x['fail_reason'], 'cu' => $x['name'], 'tot' => money($x['total']), 'at' => (int)$x['updated_at'] * 1000];
    $o['recent'] = $recent;
    $cd = rider_cash((int)$id, day_start(-13));
    $o['cash'] = ['today' => rider_cash((int)$id, day_start(0))['total'], 'week' => rider_cash((int)$id, day_start(-6))['total'], 'month' => rider_cash((int)$id, strtotime(date('Y-m-01', now_ts()) . ' 00:00:00'))['total'], 'days' => $cd['days']];
    $msgs = [];
    foreach (db_rows('SELECT title, body, is_read, created_at FROM rider_notif WHERE rider_id=? ORDER BY id DESC LIMIT 15', [(int)$r['id']]) as $x)
        $msgs[] = ['title' => $x['title'], 'body' => $x['body'], 'read' => (int)$x['is_read'], 'at' => (int)$x['created_at'] * 1000];
    $o['messages'] = $msgs;
    $o['earn'] = rider_earn_summary((int)$id);
    json_out(['rider' => $o]);
}

function h_admin_rider_file($id) {
    require_admin();
    $r = db_row('SELECT * FROM riders WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Rider not found');
    rider_send_file($r, (string)($_GET['kind'] ?? 'photo'));
}

function h_admin_rider_patch($id) {
    require_admin();
    $b = body_json();
    $action = (string)($b['action'] ?? '');
    $r = db_row('SELECT * FROM riders WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Rider not found');
    $rid = (int)$r['id'];
    switch ($action) {
        case 'approve':
            if (!in_array($r['status'], ['pending', 'rejected'], true)) fail(409, 'Only pending or rejected applications can be approved');
            q("UPDATE riders SET status='approved', reject_reason=NULL, approved_at=? WHERE id=?", [now_ts(), $rid]);
            rider_notify($rid, 'Application approved', 'Your rider account is now active. You can go online and receive deliveries.');
            break;
        case 'reject':
            $why = clean_str($b['reason'] ?? '', 255);
            if ($why === '') fail(400, 'A reason is required', 'reason');
            if (!in_array($r['status'], ['pending', 'approved'], true) && $r['status'] !== 'rejected') fail(409, 'Cannot reject this account');
            q("UPDATE riders SET status='rejected', reject_reason=?, online=0 WHERE id=?", [$why, $rid]);
            rider_notify($rid, 'Application rejected', $why);
            break;
        case 'suspend':
            if ($r['status'] !== 'approved') fail(409, 'Only approved riders can be suspended');
            q("UPDATE riders SET status='suspended', online=0, reject_reason=? WHERE id=?", [clean_str($b['reason'] ?? '', 255) ?: null, $rid]);
            rider_notify($rid, 'Account suspended', clean_str($b['reason'] ?? '', 255));
            break;
        case 'activate':
            if ($r['status'] !== 'suspended') fail(409, 'Only suspended riders can be re-activated');
            q("UPDATE riders SET status='approved', reject_reason=NULL WHERE id=?", [$rid]);
            rider_notify($rid, 'Account re-activated', 'Your rider account is active again.');
            break;
        case 'chg_approve':
            $chg = rider_chg($r);
            if (!$chg) fail(409, 'No pending change request');
            rider_dup_check($chg['mobile'] ?? null, $chg['email'] ?? null, $rid);
            $set = []; $par = [];
            foreach (['mobile', 'email', 'vehicle_type', 'vehicle_no', 'license_no'] as $k) if (array_key_exists($k, $chg)) { $set[] = "$k=?"; $par[] = $chg[$k]; }
            $set[] = 'chg=NULL'; $par[] = $rid;
            q('UPDATE riders SET ' . implode(',', $set) . ' WHERE id=?', $par);
            rider_notify($rid, 'Profile change approved', 'Your requested changes were approved.');
            break;
        case 'chg_reject':
            if (!rider_chg($r)) fail(409, 'No pending change request');
            q('UPDATE riders SET chg=NULL WHERE id=?', [$rid]);
            rider_notify($rid, 'Profile change rejected', clean_str($b['reason'] ?? '', 255));
            break;
        default: fail(400, 'Invalid action', 'action');
    }
    json_out(['rider' => rider_out(db_row('SELECT * FROM riders WHERE id=?', [$rid]))]);
}

function h_admin_rider_message($id) {
    require_admin();
    $b = body_json();
    $r = db_row('SELECT id FROM riders WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Rider not found');
    $body = clean_str($b['body'] ?? '', 500);
    if ($body === '') fail(400, 'Write a message', 'body');
    rider_notify($r['id'], clean_str($b['title'] ?? '', 190) ?: 'NurBuy-এর বার্তা', $body);
    json_out(['ok' => true]);
}

function h_admin_order_assign($id) {
    require_admin();
    $b = body_json();
    $rid = (int)($b['rider_id'] ?? 0);
    db_tx(function () use ($id, $rid) {
        $o = db_row('SELECT * FROM orders WHERE id=?' . lock_suffix(), [$id]);
        if (!$o) fail(404, 'Order not found');
        if (in_array($o['status'], ['Delivered', 'Cancelled', 'Returned'], true)) fail(409, 'This order is already closed', null, 'order_closed');
        $r = db_row('SELECT * FROM riders WHERE id=?', [$rid]);
        if (!$r) fail(404, 'Rider not found', 'rider_id');
        if ($r['status'] !== 'approved') fail(409, 'Rider is not approved', 'rider_id', 'rider_not_approved');
        $d = db_row('SELECT * FROM deliveries WHERE order_id=?' . lock_suffix(), [$id]);
        $t = now_ts();
        if ($d && (int)$d['rider_id'] === $rid && !in_array($d['rstat'], ['rejected', 'failed', 'cancelled'], true)) fail(409, 'Already assigned to this rider', null, 'same_rider');
        if ($d && $d['rstat'] === 'delivered') fail(409, 'Already delivered', null, 'order_closed');
        $otp = ($d && !empty($d['otp'])) ? $d['otp'] : str_pad((string)random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        if ($d) {
            if ((int)$d['rider_id'] !== $rid && !in_array($d['rstat'], ['rejected', 'failed', 'cancelled'], true))
                rider_notify($d['rider_id'], 'Order reassigned', 'Order ' . $id . ' was taken off you by admin.');
            q('UPDATE deliveries SET rider_id=?, rstat=?, otp=?, fail_reason=NULL, assigned_at=?, updated_at=? WHERE order_id=?', [$rid, 'assigned', $otp, $t, $t, $id]);
        } else {
            q('INSERT INTO deliveries (order_id, rider_id, rstat, otp, assigned_at, updated_at) VALUES (?,?,?,?,?,?)', [$id, $rid, 'assigned', $otp, $t, $t]);
        }
        rider_notify($rid, 'New delivery assigned', 'Order ' . $id . ' - ' . $o['name'] . ($o['shop'] ? ' (pickup: ' . $o['shop'] . ')' : ''), ['url' => '/#/order/' . rawurlencode($id), 'kind' => 'order', 'dkey' => 'as:' . $id . ':' . $t]);
    });
    json_out(['ok' => true]);
}

function h_admin_order_unassign($id) {
    require_admin();
    db_tx(function () use ($id) {
        $d = db_row('SELECT * FROM deliveries WHERE order_id=?' . lock_suffix(), [$id]);
        if (!$d) fail(404, 'Order has no rider');
        if ($d['rstat'] === 'delivered') fail(409, 'Already delivered', null, 'order_closed');
        if (!in_array($d['rstat'], ['rejected', 'failed', 'cancelled'], true)) rider_notify($d['rider_id'], 'Order unassigned', 'Order ' . $id . ' was taken off you by admin.');
        q('DELETE FROM deliveries WHERE order_id=?', [$id]);
    });
    json_out(['ok' => true]);
}

/** Called when admin cancels/returns an order that has an active delivery. */
function rider_order_closed_hook($oid) {
    $d = db_row('SELECT * FROM deliveries WHERE order_id=?', [$oid]);
    if (!$d || in_array($d['rstat'], ['delivered', 'failed', 'cancelled', 'rejected'], true)) return;
    q('UPDATE deliveries SET rstat=?, updated_at=? WHERE order_id=?', ['cancelled', now_ts(), $oid]);
    rider_notify($d['rider_id'], 'Order cancelled', 'Order ' . $oid . ' was cancelled.');
}

/** Delivery info attached to customer-facing orders (code shown only to the order's owner). */
function delivery_info_map($orderIds) {
    $out = [];
    if (!$orderIds) return $out;
    $ph = implode(',', array_fill(0, count($orderIds), '?'));
    foreach (db_rows("SELECT d.order_id, d.rstat, d.otp, r.name FROM deliveries d JOIN riders r ON r.id=d.rider_id WHERE d.order_id IN ($ph)", array_values($orderIds)) as $x) {
        if (in_array($x['rstat'], ['rejected', 'cancelled'], true)) continue;
        $active = in_array($x['rstat'], ['assigned', 'accepted', 'going', 'picked', 'ontheway', 'arrived'], true);
        $out[$x['order_id']] = ['rstat' => $x['rstat'], 'otp' => $active ? $x['otp'] : null, 'rider' => $x['name']];
    }
    return $out;
}
