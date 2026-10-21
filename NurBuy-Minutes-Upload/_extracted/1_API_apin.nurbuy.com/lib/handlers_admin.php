<?php
if (!defined('NB')) { http_response_code(403); exit; }

function h_admin_login() {
    $b = body_json();
    $email = strtolower(trim((string)($b['email'] ?? '')));
    $pw = (string)($b['password'] ?? '');
    throttle_check('a');
    $a = $email !== '' ? db_row('SELECT * FROM admins WHERE email=?', [$email]) : null;
    if (!$a || $pw === '' || !password_verify($pw, $a['pw_hash'])) {
        throttle_fail('a');
        fail(401, 'Invalid email or password');
    }
    throttle_clear('a');
    json_out(['token' => create_session($a['id'], 'admin'),
              'admin' => ['id' => (int)$a['id'], 'email' => $a['email'], 'name' => $a['name'], 'role' => $a['role'],
                          'perms' => function_exists('bs_admin_perms') ? bs_admin_perms($a) : []]]);
}

function h_admin_state_get() {
    require_admin();
    $row = kv_get('admin_state');
    $state = $row ? json_decode($row['v'], false) : null;
    json_out(['state' => $state, 'updated' => $row ? (int)$row['updated_at'] : 0]);
}

function h_admin_state_put() {
    require_admin();
    $b = body_json(false);
    if (!isset($b->state) || !is_object($b->state)) fail(400, 'state must be an object', 'state');
    $json = json_encode($b->state, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) fail(400, 'state could not be encoded', 'state');
    if (strlen($json) > 2 * 1024 * 1024) fail(413, 'State too large (max 2MB)', 'state');
    // Product IDs must stay unique (among admin products and against seller products)
    if (isset($b->state->products) && is_array($b->state->products)) {
        $seenC = [];
        foreach ($b->state->products as $pp) {
            if (!is_object($pp) || !isset($pp->pcode) || !is_string($pp->pcode) || trim($pp->pcode) === '') continue;
            $k = strtoupper(trim($pp->pcode));
            if (isset($seenC[$k])) fail(409, 'Product ID ' . $k . ' is used by more than one product', 'pcode');
            $seenC[$k] = 1;
            if (db_row('SELECT id FROM seller_products WHERE UPPER(pcode)=?', [$k])) fail(409, 'Product ID ' . $k . ' is already used by a seller product', 'pcode');
        }
    }
    $t = kv_set('admin_state', $json);
    json_out(['ok' => true, 'updated' => $t]);
}

/** GET /admin/site-content: the saved website pages and footer (what the public site really shows). */
function h_admin_site_get() {
    require_admin();
    $C = site_content();
    json_out(['pol' => (object)(isset($C['pol']) && is_array($C['pol']) ? $C['pol'] : []),
              'footer' => array_key_exists('footer', $C) && is_array($C['footer']) ? $C['footer'] : null]);
}
/** PUT /admin/site-content {pol?: {polAbout: {en, bn}, ...}, footer?: {...}}: saves only what is sent, on its own, so it works
 *  even when the big admin-state save is refused. Texts are cleaned again by the public site before they are shown. */
function h_admin_site_put() {
    require_admin();
    $b = body_json();
    // The admin sends the whole body base64-encoded ({enc:'b64', data}) so that no HTML tags travel in the request:
    // some hosting firewalls (ModSecurity) answer 403 to a body containing <img>, style= and the like. Plain JSON still works.
    if (isset($b['enc']) && $b['enc'] === 'b64') {
        $raw = isset($b['data']) && is_string($b['data']) ? base64_decode($b['data'], true) : false;
        $b = $raw === false ? null : json_decode($raw, true);
        if (!is_array($b)) fail(400, 'content could not be decoded');
    }
    $C = site_content();
    if (isset($b['pol'])) {
        if (!is_array($b['pol'])) fail(400, 'pol must be an object', 'pol');
        $pol = isset($C['pol']) && is_array($C['pol']) ? $C['pol'] : [];
        foreach (['polAbout', 'polPrivacy', 'polReturn', 'polShipping'] as $k) {
            if (!array_key_exists($k, $b['pol'])) continue;
            $v = $b['pol'][$k];
            if (!is_array($v)) fail(400, $k . ' must be an object', $k);
            $o = [];
            foreach (['en', 'bn'] as $lg) {
                $t = isset($v[$lg]) && is_string($v[$lg]) ? trim($v[$lg]) : '';
                if (mb_strlen($t) > 100000) fail(413, 'This page is too long (max 100000 characters)', $k);
                $o[$lg] = $t;
            }
            $pol[$k] = $o;
        }
        $C['pol'] = $pol;
    }
    if (array_key_exists('footer', $b)) {
        if ($b['footer'] !== null && !is_array($b['footer'])) fail(400, 'footer must be an object', 'footer');
        if ($b['footer'] === null) unset($C['footer']); else $C['footer'] = $b['footer'];
    }
    $json = json_encode($C, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) fail(400, 'content could not be encoded');
    if (strlen($json) > 1024 * 1024) fail(413, 'Too large (max 1MB)');
    $t = kv_set('site_content', $json);
    json_out(['ok' => true, 'updated' => $t]);
}

/** GET /admin/newsletter: footer newsletter subscribers, newest first. */
function h_admin_newsletter() {
    require_admin();
    $row = kv_get('newsletter');
    $list = $row ? json_decode((string)$row['v'], true) : [];
    if (!is_array($list)) $list = [];
    arsort($list);
    $items = [];
    foreach ($list as $e => $ts) $items[] = ['email' => (string)$e, 'ts' => (int)$ts];
    json_out(['count' => count($items), 'items' => $items]);
}

function h_admin_orders() {
    require_admin();
    $payMap = ['cod' => 'COD', 'online' => 'bKash', 'wallet' => 'Wallet'];
    $out = [];
    $dl = [];
    foreach (db_rows('SELECT d.order_id, d.rider_id, d.rstat, d.fail_reason, r.name rn, r.mobile rm FROM deliveries d JOIN riders r ON r.id=d.rider_id') as $x) $dl[$x['order_id']] = $x;
    $slk = seller_shop_lookup(); $sln = [];
    foreach (db_rows('SELECT id, shop_name FROM sellers') as $x) $sln[(int)$x['id']] = $x['shop_name'];
    $sls = [];
    foreach (db_rows('SELECT order_id, seller_id, sstat, note FROM seller_orders') as $x) $sls[$x['order_id'] . '|' . $x['seller_id']] = $x;
    $lvm = [];
    foreach (db_rows('SELECT order_id, lat, lng, updated_at FROM order_live') as $x) $lvm[$x['order_id']] = ['lat' => (float)$x['lat'], 'lng' => (float)$x['lng'], 'at' => (int)$x['updated_at'] * 1000];
    foreach (db_rows('SELECT * FROM orders ORDER BY created_at DESC, id DESC LIMIT 2000') as $o) {
        $it = [];
        $items = json_decode((string)$o['items'], true);
        if (is_array($items)) foreach ($items as $i) {
            $it[] = ['n' => $i['n'] ?? '', 'e' => $i['e'] ?? '', 'q' => (int)($i['q'] ?? 1), 'pr' => money($i['unit'] ?? 0), 'va' => (string)($i['variant'] ?? ''), 'shop' => (string)($i['shop'] ?? '')];
        }
        $ex = json_decode((string)$o['extra'], true); if (!is_array($ex)) $ex = [];
        $out[] = [
            'id' => $o['id'], 'cu' => $o['name'], 'm' => $o['mobile'], 'v' => $o['view'], 'it' => $it,
            'tot' => money($o['total']), 'st' => $o['status'], 'dt' => date('Y-m-d', (int)$o['created_at']),
            'pay' => $payMap[$o['pay']] ?? $o['pay'], 'ad' => $o['address'], 'sh' => $o['shop'], 'veh' => $o['veh'],
            'uid' => $o['user_id'], 'created_at' => (int)$o['created_at'],
            'cb' => money($o['cashback']), 'paidw' => money($o['paid_wallet']), 'disc' => money($o['disc'] ?? 0), 'cpn' => $o['coupon'] ?? null, 'sub' => money($o['sub']),
            'rid' => isset($dl[$o['id']]) ? (int)$dl[$o['id']]['rider_id'] : null, 'rn' => $dl[$o['id']]['rn'] ?? null, 'rm' => $dl[$o['id']]['rm'] ?? null,
            'rs' => $dl[$o['id']]['rstat'] ?? null, 'rf' => $dl[$o['id']]['fail_reason'] ?? null,
            'sl' => seller_admin_order_info($o, $slk, $sln, $sls),
            'fee' => money($o['fee']), 'area' => isset($ex['area']) && is_array($ex['area']) ? array_values(array_map(function ($x) { return (string)($x['n'] ?? ''); }, $ex['area'])) : [],
            'multi' => (int)($ex['multi'] ?? 0),
            'eta' => order_eta($o), 'bonus' => order_bonus_state($o), 'rpay' => isset($ex['rider_pay']) && is_num($ex['rider_pay']) ? money($ex['rider_pay']) : null,
            'geo' => (isset($ex['geo']) && is_array($ex['geo'])) ? $ex['geo'] : null, 'lv' => $lvm[$o['id']] ?? null,
        ];
    }
    json_out(['orders' => $out]);
}

function h_admin_order_patch($id) {
    require_admin();
    $b = body_json();
    $hasStatus = array_key_exists('status', $b);
    $hasVeh = array_key_exists('veh', $b);
    if (!$hasStatus && !$hasVeh) fail(400, 'Nothing to update');
    $valid = ['Pending', 'Confirmed', 'Packed', 'Out for delivery', 'Delivered', 'Cancelled', 'Returned'];
    if ($hasStatus && (!is_string($b['status']) || !in_array($b['status'], $valid, true))) fail(400, 'Invalid status', 'status');
    if ($hasVeh && $b['veh'] !== null && (!is_string($b['veh']) || !in_array($b['veh'], ['cycle', 'bike', 'car'], true))) fail(400, 'Invalid vehicle', 'veh');
    db_tx(function () use ($id, $b, $hasStatus, $hasVeh) {
        $o = db_row('SELECT * FROM orders WHERE id=?' . lock_suffix(), [$id]);
        if (!$o) fail(404, 'Order not found');
        $set = ['updated_at=?']; $par = [now_ts()];
        if ($hasStatus) { $set[] = 'status=?'; $par[] = $b['status']; }
        if ($hasVeh) { $set[] = 'veh=?'; $par[] = $b['veh']; }
        $extra = json_decode((string)$o['extra'], true);
        if (!is_array($extra)) $extra = [];
        if ($hasStatus && in_array($b['status'], ['Cancelled', 'Returned'], true) && empty($extra['refunded']) && $o['user_id']) {
            $paidW = money($o['paid_wallet']);
            if ($paidW > 0) {
                wallet_credit($o['user_id'], $paidW);
                wallet_log($o['user_id'], 'adj', $paidW, $o['id'], null, 'Refund ' . $o['id']);
                $extra['refunded'] = true;
                $set[] = 'extra=?'; $par[] = json_encode($extra, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
        }
        $par[] = $id;
        q('UPDATE orders SET ' . implode(',', $set) . ' WHERE id=?', $par);
        if ($hasStatus && in_array($b['status'], ['Cancelled', 'Returned'], true)) { rider_order_closed_hook($id); seller_order_closed_hook($id); coupon_release_order($id); }
        if ($hasStatus) order_after_status($id, $o['status']);
    });
    json_out(['ok' => true]);
}

function h_admin_customers() {
    require_admin();
    $cnt = []; $addr = [];
    foreach (db_rows('SELECT user_id, COUNT(*) c FROM orders WHERE user_id IS NOT NULL GROUP BY user_id') as $r) $cnt[$r['user_id']] = (int)$r['c'];
    foreach (db_rows('SELECT o.user_id, o.address FROM orders o WHERE o.user_id IS NOT NULL AND o.created_at=(SELECT MAX(created_at) FROM orders WHERE user_id=o.user_id) ORDER BY o.id') as $r) $addr[$r['user_id']] = $r['address'];
    $out = [];
    foreach (db_rows('SELECT * FROM users ORDER BY created_at DESC, id DESC LIMIT 5000') as $u) {
        $out[] = [
            'id' => $u['id'], 'n' => $u['name'], 'm' => $u['mobile'], 'e' => $u['email'] ?? '',
            'd' => isset($addr[$u['id']]) ? clean_str($addr[$u['id']], 120) : '',
            'o' => $cnt[$u['id']] ?? 0, 'blocked' => (bool)(int)$u['blocked'],
            'j' => date('Y-m-d', (int)$u['created_at']), 'wallet' => money($u['wallet']), 'mvf' => (int)$u['mvf'],
            'av' => admin_profile_has_avatar($u['profile'] ?? null) ? 1 : 0,
        ];
    }
    json_out(['customers' => $out]);
}

/** True when the customer saved a profile photo (stored as a small data URL inside users.profile). */
function admin_profile_has_avatar($raw) {
    if (!is_string($raw) || $raw === '' || strpos($raw, '"avatar"') === false) return false;
    $p = json_decode($raw, true);
    return is_array($p) && is_string($p['avatar'] ?? null) && (strncmp($p['avatar'], 'data:image/', 11) === 0 || preg_match('#^https?://#i', $p['avatar']));
}

/** The customer's profile photo (data URL) for the admin list; fetched one at a time so the list stays light. */
function h_admin_customer_avatar($id) {
    require_admin();
    $raw = db_val('SELECT profile FROM users WHERE id=?', [$id]);
    $p = is_string($raw) && $raw !== '' ? json_decode($raw, true) : null;
    $a = is_array($p) && is_string($p['avatar'] ?? null) && (preg_match('#^https?://#i', $p['avatar']) || (strncmp($p['avatar'], 'data:image/', 11) === 0 && strlen($p['avatar']) < 400000)) ? $p['avatar'] : '';
    json_out(['avatar' => $a]);
}

function h_admin_customer_patch($id) {
    require_admin();
    $b = body_json();
    if (!db_val('SELECT 1 FROM users WHERE id=?', [$id])) fail(404, 'Customer not found');
    if (array_key_exists('blocked', $b)) {
        $bl = ($b['blocked'] === true || $b['blocked'] === 1 || $b['blocked'] === '1' || $b['blocked'] === 'true') ? 1 : 0;
        if ($bl) {
            $reason = clean_str($b['reason'] ?? '', 300);
            block_apply('user', $id, $reason !== '' ? $reason : 'Restricted by admin', block_expiry($b));
        } else {
            $cur = db_row("SELECT * FROM blocks WHERE kind='user' AND target=? AND active=1 ORDER BY id DESC", [$id]);
            if ($cur) block_lift_row($cur, fr_admin_name(), clean_str($b['note'] ?? '', 300));
            else q('UPDATE users SET blocked=0 WHERE id=?', [$id]);
        }
    }
    json_out(['ok' => true]);
}

function h_admin_wallet() {
    require_admin();
    $b = body_json();
    $uid = (string)($b['user_id'] ?? '');
    if (!isset($b['amount']) || !is_num($b['amount'])) fail(400, 'Amount is required', 'amount');
    $amt = money($b['amount']);
    if ($amt == 0 || abs($amt) > 10000000) fail(400, 'Invalid amount', 'amount');
    $note = clean_str($b['note'] ?? '', 255);
    $bal = db_tx(function () use ($uid, $amt, $note) {
        if (!db_val('SELECT 1 FROM users WHERE id=?' . lock_suffix(), [$uid])) fail(404, 'Customer not found', 'user_id');
        if ($amt > 0) wallet_credit($uid, $amt);
        elseif (!wallet_debit($uid, -$amt)) fail(400, 'Insufficient wallet balance', 'amount', 'insufficient_wallet');
        wallet_log($uid, 'adj', $amt, null, null, $note !== '' ? $note : null);
        return wallet_bal($uid);
    });
    json_out(['ok' => true, 'bal' => $bal]);
}

function h_admin_upload() {
    require_admin();
    $up = upload_take('file', ['image/vnd.microsoft.icon' => 'ico', 'image/x-icon' => 'ico']);
    $dir = dirname(__DIR__) . '/uploads';
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) fail(500, 'Upload folder is not available');
    $name = bin2hex(random_bytes(12)) . '.' . $up['ext'];
    if ($up['ext'] === 'ico' || $up['ext'] === 'gif' || $up['ext'] === 'avif') { if (!@move_uploaded_file($up['tmp'], $dir . '/' . $name)) fail(500, 'Could not save file (is uploads/ writable?)'); @chmod($dir . '/' . $name, 0644); }
    else upload_store($up, $dir . '/' . $name, (int)($_POST['max'] ?? 0) >= 400 && (int)$_POST['max'] <= 3000 ? (int)$_POST['max'] : 2400);
    $base = trim((string)cfg('base_url', ''));
    if ($base === '') {
        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
        $dirn = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/index.php')), '/');
        $base = ($https ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . $dirn;
    }
    json_out(['url' => rtrim($base, '/') . '/uploads/' . $name]);
}

function h_admin_password() {
    $a = function_exists("require_bs") ? require_bs() : require_admin(); // banner staff may change their own password
    $b = body_json();
    $cur = (string)($b['current'] ?? '');
    $pw = (string)($b['password'] ?? '');
    if (!password_verify($cur, $a['pw_hash'])) fail(400, 'Current password is incorrect', 'current');
    if (strlen($pw) < 6) fail(400, 'Password must be at least 6 characters', 'password');
    if (strlen($pw) > 200) fail(400, 'Password too long', 'password');
    q('UPDATE admins SET pw_hash=? WHERE id=?', [password_hash($pw, PASSWORD_DEFAULT), $a['id']]);
    q("DELETE FROM sessions WHERE role='admin' AND user_id=? AND token<>?", [(string)$a['id'], (string)bearer_token()]);
    json_out(['ok' => true]);
}
