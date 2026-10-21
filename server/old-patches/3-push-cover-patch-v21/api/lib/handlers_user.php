<?php
if (!defined('NB')) { http_response_code(403); exit; }

function h_signup() {
    block_ip_check();
    $b = body_json();
    $name = clean_str($b['name'] ?? '', 100);
    $mobile = normalize_mobile($b['mobile'] ?? '');
    $email = strtolower(clean_str($b['email'] ?? '', 190));
    $pw = (string)($b['password'] ?? '');
    if ($name === '') fail(400, 'Name is required', 'name');
    if (!valid_mobile($mobile)) fail(400, 'Enter a valid mobile number (01XXXXXXXXX)', 'mobile');
    if ($email !== '' && !valid_email($email)) fail(400, 'Enter a valid email address', 'email');
    if (strlen($pw) < 6) fail(400, 'Password must be at least 6 characters', 'password');
    if (strlen($pw) > 200) fail(400, 'Password too long', 'password');
    if (db_val('SELECT 1 FROM users WHERE mobile=?', [$mobile])) fail(409, 'This mobile number is already registered', 'mobile');
    if ($email !== '' && db_val('SELECT 1 FROM users WHERE email=?', [$email])) fail(409, 'This email is already registered', 'email');
    $id = new_user_id();
    try {
        q('INSERT INTO users (id,name,email,mobile,pw_hash,auto,mvf,wallet,profile,blocked,created_at) VALUES (?,?,?,?,?,0,0,0,?,0,?)',
          [$id, $name, $email === '' ? null : $email, $mobile, password_hash($pw, PASSWORD_DEFAULT), '{}', now_ts()]);
    } catch (PDOException $e) {
        if (is_unique_violation($e)) fail(409, 'Already registered', unique_field($e, 'mobile'));
        throw $e;
    }
    $u = db_row('SELECT * FROM users WHERE id=?', [$id]);
    json_out(['token' => create_session($id, 'user'), 'user' => user_out($u)], 201);
}

function h_login() {
    $b = body_json();
    $id = trim((string)($b['id'] ?? ''));
    $pw = (string)($b['password'] ?? '');
    if ($id === '' || $pw === '') fail(400, 'Email/mobile and password are required');
    block_ip_check();
    throttle_check('u');
    $u = (strpos($id, '@') !== false)
        ? db_row('SELECT * FROM users WHERE email=?', [strtolower($id)])
        : db_row('SELECT * FROM users WHERE mobile=?', [normalize_mobile($id)]);
    $hash = $u && !empty($u['pw_hash']) ? $u['pw_hash'] : '$2y$10$abcdefghijklmnopqrstuuJ2cE1xv6o0m6x3Fq1m3m3m3m3m3m3m3';
    $ok = password_verify($pw, $hash) && $u && !empty($u['pw_hash']);
    if (!$ok) { throttle_fail('u'); fail(401, 'Invalid email/mobile or password'); }
    block_user_check($u);
    block_ip_check();
    throttle_clear('u');
    json_out(['token' => create_session($u['id'], 'user'), 'user' => user_out($u)]);
}

function h_logout() {
    $tok = bearer_token();
    if ($tok) q('DELETE FROM sessions WHERE token=?', [$tok]);
    json_out(['ok' => true]);
}

function h_me() {
    $u = require_user();
    json_out(['user' => user_out($u), 'profile' => json_or_obj($u['profile']), 'wallet' => ['bal' => money($u['wallet'])]]);
}

function h_me_update() {
    $u = require_user();
    $b = body_json();
    $set = []; $par = [];
    if (array_key_exists('name', $b)) {
        $n = clean_str($b['name'], 100);
        if ($n === '') fail(400, 'Name is required', 'name');
        $set[] = 'name=?'; $par[] = $n;
    }
    if (array_key_exists('email', $b)) {
        $e = strtolower(clean_str($b['email'] ?? '', 190));
        if ($e !== '') {
            if (!valid_email($e)) fail(400, 'Enter a valid email address', 'email');
            if (db_val('SELECT 1 FROM users WHERE email=? AND id<>?', [$e, $u['id']])) fail(409, 'This email is already registered', 'email');
        }
        $set[] = 'email=?'; $par[] = $e === '' ? null : $e;
    }
    if (array_key_exists('mobile', $b)) {
        $m = normalize_mobile($b['mobile'] ?? '');
        if (!valid_mobile($m)) fail(400, 'Enter a valid mobile number (01XXXXXXXXX)', 'mobile');
        if (db_val('SELECT 1 FROM users WHERE mobile=? AND id<>?', [$m, $u['id']])) fail(409, 'This mobile number is already registered', 'mobile');
        if ($m !== $u['mobile']) { $set[] = 'mobile=?'; $par[] = $m; $set[] = 'mvf=0'; }
    }
    if ($set) {
        $par[] = $u['id'];
        try { q('UPDATE users SET ' . implode(',', $set) . ' WHERE id=?', $par); }
        catch (PDOException $e) {
            if (is_unique_violation($e)) fail(409, 'Already registered', unique_field($e, 'mobile'));
            throw $e;
        }
    }
    json_out(['user' => user_out(db_row('SELECT * FROM users WHERE id=?', [$u['id']]))]);
}

function h_me_profile() {
    $u = require_user();
    $len = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($len > 1024 * 1024 || strlen(raw_body()) > 1024 * 1024) fail(413, 'Profile too large (max 1MB)', 'profile');
    $b = body_json(false);
    if (!isset($b->profile) || !is_object($b->profile)) fail(400, 'profile must be an object', 'profile');
    $json = json_encode($b->profile, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false || strlen($json) > 1024 * 1024) fail(413, 'Profile too large (max 1MB)', 'profile');
    q('UPDATE users SET profile=? WHERE id=?', [$json, $u['id']]);
    json_out(['ok' => true]);
}

/** POST /me/avatar (multipart, field "file"): the customer's profile photo is stored as a small image file and its address is
 *  written into the profile. (A photo pasted into the profile JSON was refused by some hosts, so it vanished on reload.) */
function h_me_avatar() {
    upload_guard();
    $u = require_user();
    $up = upload_take('file', [], UPLOAD_MAX_MB, ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp']);
    $dir = dirname(__DIR__) . '/uploads';
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) fail(500, 'Upload folder is not available');
    $uid = preg_replace('/[^A-Za-z0-9]/', '', (string)$u['id']);
    $name = 'av_' . $uid . '_' . bin2hex(random_bytes(6)) . '.' . $up['ext'];
    upload_store($up, $dir . '/' . $name, 512);
    $prof = json_decode((string)$u['profile'], true); if (!is_array($prof)) $prof = [];
    $old = isset($prof['avatar']) && is_string($prof['avatar']) ? basename(parse_url($prof['avatar'], PHP_URL_PATH) ?: '') : '';
    $url = seller_public_base() . $name;
    $prof['avatar'] = $url;
    q('UPDATE users SET profile=? WHERE id=?', [json_encode($prof, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $u['id']]);
    if ($old !== '' && strpos($old, 'av_' . $uid . '_') === 0 && $old !== $name) @unlink($dir . '/' . $old);
    json_out(['url' => $url]);
}

/** POST /me/cover (multipart, field "file"): the customer's cover photo, stored as an image file like the profile photo.
 *  (The host's security filter refuses any request that carries "data:image" text, so a cover inside the profile JSON never saved.) */
function h_me_cover() {
    upload_guard();
    $u = require_user();
    $up = upload_take('file', [], UPLOAD_MAX_MB, ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp']);
    $dir = dirname(__DIR__) . '/uploads';
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) fail(500, 'Upload folder is not available');
    $uid = preg_replace('/[^A-Za-z0-9]/', '', (string)$u['id']);
    $name = 'cv_' . $uid . '_' . bin2hex(random_bytes(6)) . '.' . $up['ext'];
    upload_store($up, $dir . '/' . $name, 1600);
    $prof = json_decode((string)$u['profile'], true); if (!is_array($prof)) $prof = [];
    $old = isset($prof['cover']) && is_string($prof['cover']) ? basename(parse_url($prof['cover'], PHP_URL_PATH) ?: '') : '';
    $url = seller_public_base() . $name;
    $prof['cover'] = $url;
    q('UPDATE users SET profile=? WHERE id=?', [json_encode($prof, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $u['id']]);
    if ($old !== '' && strpos($old, 'cv_' . $uid . '_') === 0 && $old !== $name) @unlink($dir . '/' . $old);
    json_out(['url' => $url]);
}

function h_me_password() {
    $u = require_user();
    $b = body_json();
    $pw = (string)($b['password'] ?? '');
    if (strlen($pw) < 6) fail(400, 'Password must be at least 6 characters', 'password');
    if (strlen($pw) > 200) fail(400, 'Password too long', 'password');
    if (!empty($u['pw_hash'])) {
        $cur = (string)($b['current'] ?? '');
        if ($cur === '') fail(400, 'Current password is required', 'current');
        if (!password_verify($cur, $u['pw_hash'])) fail(400, 'Current password is incorrect', 'current');
    }
    q('UPDATE users SET pw_hash=?, auto=0 WHERE id=?', [password_hash($pw, PASSWORD_DEFAULT), $u['id']]);
    json_out(['ok' => true]);
}

function h_verify_mobile() {
    $u = require_user();
    $b = body_json();
    $code = (string)($b['code'] ?? '');
    $otp = (string)cfg('demo_otp', '');
    if ($otp === '') fail(503, 'Mobile verification is not enabled yet', 'code');
    if ($code === '' || !hash_equals($otp, $code)) fail(400, 'Incorrect verification code', 'code');
    q('UPDATE users SET mvf=1 WHERE id=?', [$u['id']]);
    json_out(['ok' => true]);
}

function h_wallet() {
    $u = require_user();
    $digits = '';
    $h = hash('sha256', $u['id']);
    for ($i = 0; $i < 12; $i++) $digits .= (string)(hexdec(substr($h, $i * 2, 2)) % 10);
    $card = '3030 ' . implode(' ', str_split($digits, 4));
    $tx = [];
    foreach (db_rows('SELECT * FROM wallet_tx WHERE user_id=? ORDER BY id DESC LIMIT 200', [$u['id']]) as $r) {
        $tx[] = ['t' => $r['t'], 'a' => money($r['amount']), 'oid' => $r['order_id'],
                 'pct' => $r['pct'] === null ? null : (float)$r['pct'], 'd' => (int)$r['created_at'] * 1000];
    }
    json_out(['bal' => money($u['wallet']), 'pct' => (float)state_setting('walletPct', 1), 'card' => $card, 'tx' => $tx]);
}
