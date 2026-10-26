<?php
/* =====================================================================
 * NurBuy customer app: server additions that survive API updates.
 *
 * Lives in its own folder (app-ext/), which the API upload package never contains,
 * and is started by one line at the top of config.php (also never in the package):
 *
 *   if (defined('NB') && is_file(__DIR__ . '/app-ext/app-ext.php')) require_once __DIR__ . '/app-ext/app-ext.php';
 *
 * What it adds (each part switches itself off when a future API already has it):
 *   POST /me/device, DELETE /me/device   the customer app registers / removes its phone push token
 *   POST /me/cover                       profile cover photo upload (multipart, field "file")
 *   POST /seller/device, DELETE /seller/device   the seller app registers / removes its phone push token
 *   POST /rider/device, DELETE /rider/device     the rider app registers / removes its phone push token (v3)
 *   phone push (Firebase Cloud Messaging) for every customer notification (user_notif rows),
 *   a notification when support replies in chat, every seller notification (seller_notif rows:
 *   new orders, approvals, boosts, withdrawals...) and every rider notification (rider_notif rows:
 *   new assignments, approvals, payments, withdrawals...).
 * Nothing in the API files is changed. If something here fails, the API carries on as normal.
 * ===================================================================== */
if (!defined('NB')) { http_response_code(403); exit; }
if (defined('NB_APPEXT')) return;
define('NB_APPEXT', 1);

/** Runs only for the API's own index.php, after it has loaded all of lib/ (the first cfg() call). */
function appext_boot() {
    $idx = realpath(dirname(__DIR__) . '/index.php');
    $cur = realpath((string)($_SERVER['SCRIPT_FILENAME'] ?? ''));
    if (!$idx || $idx !== $cur) return;
    foreach (['q', 'db_val', 'db_rows', 'kv_get', 'now_ts', 'json_out', 'json_error', 'require_user', 'body_json', 'notify'] as $f)
        if (!function_exists($f)) return; // a very different API: stay out of the way

    // phone push sending, after the response has gone out (skipped when the API has its own)
    if (!function_exists('fcm_enqueue')) register_shutdown_function('appext_after');

    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    if ($method === 'POST') {
        $ov = strtoupper($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? ($_GET['_method'] ?? ''));
        if (in_array($ov, ['PUT', 'PATCH', 'DELETE'], true)) $method = $ov;
    }
    $path = appext_path();
    $h = null;
    if ($path === '/me/device' && !function_exists('h_me_device_add')) $h = $method === 'POST' ? 'appext_device_add' : ($method === 'DELETE' ? 'appext_device_del' : null);
    elseif ($path === '/me/cover' && $method === 'POST' && !function_exists('h_me_cover')) $h = 'appext_me_cover';
    elseif ($path === '/seller/device' && function_exists('require_seller') && !function_exists('h_seller_device_add')) $h = $method === 'POST' ? 'appext_seller_device_add' : ($method === 'DELETE' ? 'appext_seller_device_del' : null);
    elseif ($path === '/rider/device' && function_exists('require_rider') && !function_exists('h_rider_device_add')) $h = $method === 'POST' ? 'appext_rider_device_add' : ($method === 'DELETE' ? 'appext_rider_device_del' : null);
    if (!$h) return;

    // answered here, the same way index.php answers (same errors and JSON)
    try {
        if (function_exists('send_cors')) send_cors();
        $h();
    } catch (Throwable $e) {
        if (class_exists('ApiError') && $e instanceof ApiError) json_error($e->status, $e->getMessage(), $e->field, $e->errCode, $e->extra);
        error_log('NurBuy app-ext: ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
        json_error(500, 'Server error');
    }
    exit;
}

/** The request path, worked out like index.php does. */
function appext_path() {
    if (isset($_GET['r']) && is_string($_GET['r'])) $path = $_GET['r'];
    else {
        $path = (string)parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $dir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/index.php')), '/');
        if ($dir !== '' && strpos($path, $dir . '/') === 0) $path = substr($path, strlen($dir));
        elseif ($dir !== '' && $path === $dir) $path = '/';
        if (strpos($path, '/index.php') === 0) $path = substr($path, strlen('/index.php'));
    }
    return '/' . trim(rawurldecode($path), '/');
}

/** The phone token table (made once; an existing one is kept). */
function appext_tables() {
    $row = kv_get('appext_schema');
    if ($row && $row['v'] === '1') return;
    if (db_driver() === 'sqlite') {
        q('CREATE TABLE IF NOT EXISTS device_tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id VARCHAR(40) NOT NULL, token TEXT NOT NULL, token_hash VARCHAR(64) NOT NULL, platform VARCHAR(10) NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)');
        q('CREATE UNIQUE INDEX IF NOT EXISTS ux_dt_token ON device_tokens (token_hash)');
        q('CREATE INDEX IF NOT EXISTS idx_dt_user ON device_tokens (user_id)');
    } else {
        q('CREATE TABLE IF NOT EXISTS device_tokens (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(40) NOT NULL, token TEXT NOT NULL, token_hash VARCHAR(64) NOT NULL, platform VARCHAR(10) NOT NULL, created_at INT NOT NULL, updated_at INT NOT NULL, UNIQUE KEY ux_dt_token (token_hash), KEY idx_dt_user (user_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
    }
    kv_set('appext_schema', '1');
}

/* ---------- POST /me/device {token, platform} ---------- */
function appext_device_add() {
    $u = require_user();
    appext_device_save((string)$u['id']);
}

/** Saves this phone's token for an owner key (customer id, "seller:<id>" for the seller app, "rider:<id>" for the rider app). */
function appext_device_save($owner) {
    appext_tables();
    $b = body_json();
    $tok = isset($b['token']) && is_string($b['token']) ? trim($b['token']) : '';
    $pf = isset($b['platform']) && in_array($b['platform'], ['android', 'ios'], true) ? $b['platform'] : 'android';
    if ($tok === '' || strlen($tok) > 4096 || !preg_match('/^[A-Za-z0-9_:\-\.]+$/', $tok)) fail(400, 'Invalid device token', 'token');
    $h = hash('sha256', $tok); $t = now_ts();
    // one phone = one token; if another account signs in on it, the phone moves to that account
    if (db_val('SELECT 1 FROM device_tokens WHERE token_hash=?', [$h])) q('UPDATE device_tokens SET user_id=?, platform=?, updated_at=? WHERE token_hash=?', [$owner, $pf, $t, $h]);
    else {
        try { q('INSERT INTO device_tokens (user_id, token, token_hash, platform, created_at, updated_at) VALUES (?,?,?,?,?,?)', [$owner, $tok, $h, $pf, $t, $t]); }
        catch (PDOException $e) { if (!is_unique_violation($e)) throw $e; }
        // keep the newest 10 phones per account
        $ids = array_column(db_rows('SELECT id FROM device_tokens WHERE user_id=? ORDER BY updated_at DESC, id DESC', [$owner]), 'id');
        if (count($ids) > 10) q('DELETE FROM device_tokens WHERE id IN (' . implode(',', array_map('intval', array_slice($ids, 10))) . ')');
    }
    json_out(['ok' => true]);
}

/* ---------- DELETE /me/device {token} ---------- */
function appext_device_del() {
    $u = require_user();
    appext_device_forget((string)$u['id']);
}

function appext_device_forget($owner) {
    $b = body_json();
    $tok = isset($b['token']) && is_string($b['token']) ? trim($b['token']) : '';
    if ($tok !== '') { appext_tables(); q('DELETE FROM device_tokens WHERE token_hash=? AND user_id=?', [hash('sha256', $tok), $owner]); }
    json_out(['ok' => true]);
}

/* ---------- POST / DELETE /seller/device {token, platform} (seller app; any seller status) ---------- */
function appext_seller_device_add() {
    $s = require_seller(false);
    appext_device_save('seller:' . (int)$s['id']);
}
function appext_seller_device_del() {
    $s = require_seller(false);
    appext_device_forget('seller:' . (int)$s['id']);
}

/* ---------- POST / DELETE /rider/device {token, platform} (rider app; any rider status) ---------- */
function appext_rider_device_add() {
    $r = require_rider(false);
    appext_device_save('rider:' . (int)$r['id']);
}
function appext_rider_device_del() {
    $r = require_rider(false);
    appext_device_forget('rider:' . (int)$r['id']);
}

/* ---------- POST /me/cover (multipart "file") ---------- */
// The host's security filter refuses any request carrying "data:image" text, so the cover is sent as a real file.
function appext_me_cover() {
    foreach (['upload_guard', 'upload_take', 'upload_store', 'seller_public_base'] as $f) if (!function_exists($f)) fail(500, 'Upload is not available');
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

/* =====================================================================
 * Phone push. After each API request (the customer already has the answer):
 *  1. new support replies in chat become customer notifications (once each, dkey "chat:<id>")
 *  2. new customer notifications go to that customer's phones through FCM
 * Progress is kept in kv ("appext_chat", "appext_notif"), so every message is sent once,
 * even when two requests run at the same moment.
 * ===================================================================== */
const APPEXT_BATCH = 100;
const APPEXT_MAX_AGE = 3600; // older than an hour (e.g. after a long pause): not sent any more

function appext_after() {
    try {
        // writes create notifications; reads only check now and then to pick up leftovers
        $m = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        if ($m === 'GET' && mt_rand(1, 4) !== 1) return;
        if (function_exists('fastcgi_finish_request')) @fastcgi_finish_request();
        @ignore_user_abort(true);
    } catch (Throwable $e) { return; }
    try { appext_chat_replies(); } catch (Throwable $e) { error_log('NurBuy app-ext chat: ' . $e->getMessage()); }
    try { if (appext_fcm_account() && function_exists('curl_init')) appext_send_new(); } catch (Throwable $e) { error_log('NurBuy app-ext push: ' . $e->getMessage()); }
    try { if (appext_fcm_account() && function_exists('curl_init')) appext_send_new_role('appext_snotif', 'seller_notif', 'seller_id', 'seller'); } catch (Throwable $e) { error_log('NurBuy app-ext seller push: ' . $e->getMessage()); }
    try { if (appext_fcm_account() && function_exists('curl_init')) appext_send_new_role('appext_rnotif', 'rider_notif', 'rider_id', 'rider'); } catch (Throwable $e) { error_log('NurBuy app-ext rider push: ' . $e->getMessage()); }
}

/**
 * New seller / rider notifications go to that person's phones (tokens saved as "seller:<id>" / "rider:<id>").
 * $key is the kv cursor ("appext_snotif" for sellers, "appext_rnotif" for riders).
 */
function appext_send_new_role($key, $table, $col, $role) {
    $r = appext_claim($key, $table);
    if (!$r) return;
    $rows = db_rows("SELECT id, $col AS nb_owner, title, body, url, img, kind, created_at FROM $table WHERE id BETWEEN ? AND ? ORDER BY id", $r);
    $owners = [];
    foreach ($rows as $n) if ((int)$n['created_at'] >= now_ts() - APPEXT_MAX_AGE) $owners[$role . ':' . (int)$n['nb_owner']] = true;
    if (!$owners) return;
    try {
        $ids = array_keys($owners);
        $toks = db_rows('SELECT id, user_id, token FROM device_tokens WHERE user_id IN (' . implode(',', array_fill(0, count($ids), '?')) . ')', $ids);
    } catch (Throwable $e) { return; } // no phone has registered yet
    $by = [];
    foreach ($toks as $t) $by[(string)$t['user_id']][] = $t;
    foreach ($rows as $n) {
        if ((int)$n['created_at'] < now_ts() - APPEXT_MAX_AGE) continue;
        foreach ($by[$role . ':' . (int)$n['nb_owner']] ?? [] as $t)
            appext_fcm_send((int)$t['id'], $t['token'], ['title' => $n['title'], 'body' => $n['body'] ?? '', 'url' => $n['url'] ?: '/', 'img' => $n['img'], 'tag' => $n['kind'] ?: 'nb', 'id' => $role . $n['id']]);
    }
}

/** Takes the next range of ids from a cursor; [from, to] or null when nothing is new or another request took it. */
function appext_claim($key, $table) {
    $top = (int)db_val("SELECT MAX(id) FROM $table");
    $row = kv_get($key);
    if (!$row) { kv_set($key, (string)$top); return null; } // first run: start from now, never send old ones
    $cur = (int)$row['v'];
    if ($top <= $cur) return null;
    $to = min($top, $cur + APPEXT_BATCH);
    if (q('UPDATE kv SET v=?, updated_at=? WHERE k=? AND v=?', [(string)$to, now_ts(), $key, $row['v']])->rowCount() !== 1) return null;
    return [$cur + 1, $to];
}

function appext_chat_replies() {
    $r = appext_claim('appext_chat', 'chat_msgs');
    if (!$r) return;
    $rows = db_rows("SELECT m.id, m.kind, m.body, m.created_at, c.cid, c.reg FROM chat_msgs m JOIN chat_convs c ON c.id=m.conv_id WHERE m.id BETWEEN ? AND ? AND m.from_='a' ORDER BY m.id", $r);
    foreach ($rows as $m) {
        // signed-in customers only (guests have no account to notify)
        if ((int)$m['reg'] !== 1 || strpos((string)$m['cid'], 'g_') === 0 || (int)$m['created_at'] < now_ts() - APPEXT_MAX_AGE) continue;
        $prev = $m['kind'] === 'img' ? 'ছবি' : ($m['kind'] === 'aud' ? 'ভয়েস মেসেজ' : mb_substr((string)$m['body'], 0, 140, 'UTF-8'));
        notify('user', (string)$m['cid'], 'NurBuy সাপোর্ট থেকে নতুন বার্তা', $prev, ['url' => '/chat', 'kind' => 'chat', 'dkey' => 'chat:' . $m['id']]);
    }
}

function appext_send_new() {
    $r = appext_claim('appext_notif', 'user_notif');
    if (!$r) return;
    $rows = db_rows('SELECT id, user_id, title, body, url, img, kind, created_at FROM user_notif WHERE id BETWEEN ? AND ? ORDER BY id', $r);
    $users = [];
    foreach ($rows as $n) if ((int)$n['created_at'] >= now_ts() - APPEXT_MAX_AGE) $users[(string)$n['user_id']] = true;
    if (!$users) return;
    try {
        $ids = array_keys($users);
        $toks = db_rows('SELECT id, user_id, token FROM device_tokens WHERE user_id IN (' . implode(',', array_fill(0, count($ids), '?')) . ')', $ids);
    } catch (Throwable $e) { return; } // no phone has registered yet
    $by = [];
    foreach ($toks as $t) $by[(string)$t['user_id']][] = $t;
    foreach ($rows as $n) {
        if ((int)$n['created_at'] < now_ts() - APPEXT_MAX_AGE) continue;
        foreach ($by[(string)$n['user_id']] ?? [] as $t)
            appext_fcm_send((int)$t['id'], $t['token'], ['title' => $n['title'], 'body' => $n['body'] ?? '', 'url' => $n['url'] ?: '/', 'img' => $n['img'], 'tag' => $n['kind'] ?: 'nb', 'id' => 'user' . $n['id']]);
    }
}

/** Service account from config.php 'fcm_service_account' (file path or array); null when phone push is not set up. */
function appext_fcm_account() {
    static $a = false;
    if ($a !== false) return $a;
    $c = cfg('fcm_service_account', null);
    if (is_string($c) && $c !== '' && is_file($c)) $c = json_decode((string)@file_get_contents($c), true);
    $a = (is_array($c) && !empty($c['project_id']) && !empty($c['client_email']) && !empty($c['private_key'])) ? $c : null;
    return $a;
}

function appext_b64u($s) { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); }

/** OAuth access token for FCM (signed JWT grant), kept in kv for 50 minutes. */
function appext_fcm_token() {
    $acc = appext_fcm_account();
    if (!$acc) return null;
    $row = kv_get('fcm_token');
    if ($row) { $j = json_decode((string)$row['v'], true); if (is_array($j) && !empty($j['t']) && (int)($j['exp'] ?? 0) > now_ts() + 60) return $j['t']; }
    $now = now_ts();
    $h = appext_b64u(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $c = appext_b64u(json_encode(['iss' => $acc['client_email'], 'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
                                  'aud' => 'https://oauth2.googleapis.com/token', 'iat' => $now, 'exp' => $now + 3600], JSON_UNESCAPED_SLASHES));
    $sig = '';
    if (!openssl_sign($h . '.' . $c, $sig, $acc['private_key'], OPENSSL_ALGO_SHA256)) { error_log('app-ext fcm: sign failed'); return null; }
    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8, CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_POSTFIELDS => http_build_query(['grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer', 'assertion' => $h . '.' . $c . '.' . appext_b64u($sig)])]);
    $res = json_decode((string)curl_exec($ch), true);
    curl_close($ch);
    if (!is_array($res) || empty($res['access_token'])) { error_log('app-ext fcm: no access token'); return null; }
    kv_set('fcm_token', json_encode(['t' => $res['access_token'], 'exp' => $now + min(3000, (int)($res['expires_in'] ?? 3600))]));
    return $res['access_token'];
}

/** One FCM message. A token Google no longer knows is deleted. */
function appext_fcm_send($rowId, $token, $p) {
    try {
        $acc = appext_fcm_account(); $at = appext_fcm_token();
        if (!$acc || !$at) return;
        $n = ['title' => (string)($p['title'] ?? ''), 'body' => (string)($p['body'] ?? '')];
        if (!empty($p['img'])) $n['image'] = (string)$p['img'];
        $msg = ['message' => ['token' => $token, 'notification' => $n,
            // the app opens this link when the notification is tapped (relative paths like /orders/NBM-1)
            'data' => ['url' => (string)($p['url'] ?? '/'), 'id' => (string)($p['id'] ?? ''), 'kind' => (string)($p['tag'] ?? '')],
            'android' => ['priority' => 'high', 'notification' => ['channel_id' => 'default', 'tag' => (string)($p['id'] ?? 'nb')]]]];
        $ch = curl_init('https://fcm.googleapis.com/v1/projects/' . rawurlencode($acc['project_id']) . '/messages:send');
        curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8, CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . $at],
            CURLOPT_POSTFIELDS => json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
        $res = (string)curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
        if ($code === 404 || ($code === 400 && strpos($res, 'INVALID_ARGUMENT') !== false && strpos($res, 'token') !== false) || strpos($res, 'UNREGISTERED') !== false)
            q('DELETE FROM device_tokens WHERE id=?', [$rowId]);
        elseif ($code === 401) q("DELETE FROM kv WHERE k='fcm_token'"); // expired access token: fetch a new one next time
        elseif ($code < 200 || $code >= 300) error_log('app-ext fcm: HTTP ' . $code . ' ' . substr($res, 0, 300));
    } catch (Throwable $e) { error_log('app-ext fcm: ' . $e->getMessage()); }
}

try { appext_boot(); } catch (Throwable $e) { error_log('NurBuy app-ext: ' . $e->getMessage()); }
