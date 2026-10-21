<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * Notifications for customers, sellers and riders + Web Push delivery.
 *
 *  notify(role, owner, title, body, [url, img, kind, dkey])
 *    - stores the notification in user_notif / seller_notif / rider_notif
 *    - a repeated dkey for the same person is ignored (no duplicates)
 *    - queues one Web Push message per saved browser of that person
 *  Push messages are encrypted (RFC 8291, aes128gcm) and signed with VAPID
 *  (RFC 8292) using only PHP's OpenSSL. The queue is sent after the response
 *  has been returned, so a slow push service never delays the API.
 * ===================================================================== */

const NOTIF_TABLES = ['user' => ['user_notif', 'user_id'], 'seller' => ['seller_notif', 'seller_id'], 'rider' => ['rider_notif', 'rider_id']];

/** Website addresses used to build notification links (config 'site_urls' can override). */
function site_url($role) {
    $def = ['user' => 'https://minutes.nurbuy.com', 'seller' => 'https://seller.nurbuy.com', 'rider' => 'https://rider.nurbuy.com', 'admin' => ''];
    $c = cfg('site_urls', []);
    $u = is_array($c) && !empty($c[$role]) ? (string)$c[$role] : $def[$role];
    return rtrim($u, '/');
}
/** Links are stored relative ("/orders/NBM-1") or absolute http(s) URLs. */
function notif_url_ok($u) {
    if ($u === null || $u === '') return null;
    $u = trim((string)$u);
    if (strlen($u) > 500) return null;
    if (preg_match('#^/[^\s"<>\\\\]*$#', $u) && strpos($u, '//') !== 0) return $u;
    if (preg_match('#^https?://[^\s"<>]+$#i', $u)) return $u;
    return null;
}

function notify($role, $owner, $title, $body = '', $o = []) {
    if (!isset(NOTIF_TABLES[$role]) || $owner === null || $owner === '') return false;
    list($t, $col) = NOTIF_TABLES[$role];
    $title = clean_str($title, 190); $body = clean_str($body, 500);
    $url = notif_url_ok($o['url'] ?? null); $img = isset($o['img']) ? (brand_url($o['img']) ?: null) : null;
    $kind = isset($o['kind']) ? clean_str($o['kind'], 20) : null; $dkey = isset($o['dkey']) ? clean_str($o['dkey'], 120) : null;
    if ($dkey !== null && $dkey !== '' && db_val("SELECT 1 FROM $t WHERE $col=? AND dkey=?", [$owner, $dkey])) return false;
    try {
        q("INSERT INTO $t ($col, title, body, url, img, kind, dkey, is_read, created_at) VALUES (?,?,?,?,?,?,?,0,?)",
          [$owner, $title, $body, $url, $img, $kind, $dkey ?: null, now_ts()]);
    } catch (PDOException $e) { if (is_unique_violation($e)) return false; throw $e; }
    $nid = (int)db()->lastInsertId();
    push_enqueue($role, (string)$owner, ['title' => $title, 'body' => $body, 'url' => $url ?: '/', 'img' => $img, 'tag' => $kind ?: 'nb', 'id' => $role . $nid], $dkey ?: ($role . $nid));
    return $nid;
}
function notif_out($r) {
    return ['id' => (int)$r['id'], 'title' => $r['title'], 'body' => $r['body'], 'url' => $r['url'] ?? null, 'img' => $r['img'] ?? null,
            'kind' => $r['kind'] ?? null, 'read' => (int)$r['is_read'] === 1, 'at' => (int)$r['created_at'] * 1000];
}

/* ---------- customer notification centre ---------- */
function h_me_notifications() {
    $u = require_user();
    $rows = db_rows('SELECT * FROM user_notif WHERE user_id=? ORDER BY id DESC LIMIT 100', [$u['id']]);
    json_out(['notifications' => array_map('notif_out', $rows), 'unread' => (int)db_val('SELECT COUNT(*) FROM user_notif WHERE user_id=? AND is_read=0', [$u['id']])]);
}
function h_me_notifications_read() {
    $u = require_user();
    $b = body_json();
    if (isset($b['ids']) && is_array($b['ids']) && $b['ids']) {
        $ids = array_slice(array_values(array_filter(array_map('intval', $b['ids']))), 0, 200);
        if ($ids) q('UPDATE user_notif SET is_read=1 WHERE user_id=? AND id IN (' . implode(',', array_fill(0, count($ids), '?')) . ')', array_merge([$u['id']], $ids));
    } else q('UPDATE user_notif SET is_read=1 WHERE user_id=?', [$u['id']]);
    json_out(['ok' => true]);
}

/* =====================================================================
 * Web Push: subscriptions
 * ===================================================================== */
function push_role_owner() {
    $s = current_session();
    if (!$s) fail(401, 'Authentication required');
    $map = ['user' => 'user', 'seller' => 'seller', 'rider' => 'rider'];
    if (!isset($map[$s['role']])) fail(403, 'Push notifications are for customers, sellers and riders');
    return [$map[$s['role']], (string)$s['user_id']];
}
function b64u_enc($s) { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); }
function b64u_dec($s) { $s = strtr((string)$s, '-_', '+/'); $r = base64_decode($s . str_repeat('=', (4 - strlen($s) % 4) % 4), true); return $r === false ? '' : $r; }

function h_push_key() { header('Cache-Control: no-cache'); json_out(['key' => b64u_enc(vapid_keys()['pub']), 'ok' => push_supported()]); }
function h_push_subscribe() {
    list($role, $owner) = push_role_owner();
    $b = body_json();
    $ep = isset($b['endpoint']) && is_string($b['endpoint']) ? trim($b['endpoint']) : '';
    $p = $b['keys']['p256dh'] ?? ''; $a = $b['keys']['auth'] ?? '';
    if ($ep === '' || strlen($ep) > 1000 || !preg_match('#^https://[^\s"<>]+$#', $ep)) fail(400, 'Invalid push endpoint', 'endpoint');
    if (!is_string($p) || strlen(b64u_dec($p)) !== 65 || !is_string($a) || strlen(b64u_dec($a)) < 16) fail(400, 'Invalid push keys', 'keys');
    $h = hash('sha256', $ep);
    $ua = clean_str($_SERVER['HTTP_USER_AGENT'] ?? '', 200);
    $t = now_ts();
    $row = db_row('SELECT id FROM push_subs WHERE ep_hash=?', [$h]);
    // one browser = one subscription; if another account signs in on it, the browser moves to that account
    if ($row) q('UPDATE push_subs SET role=?, owner_id=?, endpoint=?, p256dh=?, auth=?, ua=?, fails=0 WHERE id=?', [$role, $owner, $ep, $p, $a, $ua, (int)$row['id']]);
    else {
        try { q('INSERT INTO push_subs (role, owner_id, ep_hash, endpoint, p256dh, auth, ua, fails, created_at) VALUES (?,?,?,?,?,?,?,0,?)', [$role, $owner, $h, $ep, $p, $a, $ua, $t]); }
        catch (PDOException $e) { if (!is_unique_violation($e)) throw $e; }
        // keep the newest 10 browsers per person
        $ids = array_column(db_rows('SELECT id FROM push_subs WHERE role=? AND owner_id=? ORDER BY id DESC', [$role, $owner]), 'id');
        if (count($ids) > 10) q('DELETE FROM push_subs WHERE id IN (' . implode(',', array_map('intval', array_slice($ids, 10))) . ')');
    }
    json_out(['ok' => true, 'subscriptions' => (int)db_val('SELECT COUNT(*) FROM push_subs WHERE role=? AND owner_id=?', [$role, $owner])]);
}
function h_push_unsubscribe() {
    $b = body_json();
    $ep = isset($b['endpoint']) && is_string($b['endpoint']) ? trim($b['endpoint']) : '';
    if ($ep !== '') q('DELETE FROM push_subs WHERE ep_hash=?', [hash('sha256', $ep)]);
    json_out(['ok' => true]);
}

/* ---------- queue ---------- */
function push_supported() { return function_exists('openssl_pkey_derive') && function_exists('curl_init') && defined('OPENSSL_KEYTYPE_EC'); }
function push_enqueue($role, $owner, $payload, $dkey) {
    try {
        $subs = db_rows('SELECT id FROM push_subs WHERE role=? AND owner_id=?', [$role, (string)$owner]);
        if (!$subs) return;
        $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        foreach ($subs as $s) {
            try { q('INSERT INTO push_queue (sub_id, payload, dkey, tries, created_at) VALUES (?,?,?,0,?)', [(int)$s['id'], $json, clean_str($dkey, 160), now_ts()]); }
            catch (PDOException $e) { if (!is_unique_violation($e)) throw $e; } // same message to the same browser: once
        }
        push_schedule_flush();
    } catch (Throwable $e) { error_log('push_enqueue: ' . $e->getMessage()); }
}
function push_schedule_flush() {
    static $on = false;
    if ($on) return;
    $on = true;
    register_shutdown_function(function () {
        if (function_exists('fastcgi_finish_request')) @fastcgi_finish_request();
        push_flush(60);
    });
}
/** Sends queued messages. Failed ones are retried (up to 5 times) on later requests. */
function push_flush($limit = 30) {
    if (!push_supported() || cfg('push_disabled', false)) return 0;
    $sent = 0;
    try {
        $rows = db_rows('SELECT q.id, q.payload, q.tries, s.id sid, s.endpoint, s.p256dh, s.auth FROM push_queue q JOIN push_subs s ON s.id=q.sub_id WHERE q.sent_at IS NULL AND q.tries < 5 ORDER BY q.id LIMIT ' . (int)$limit);
        foreach ($rows as $r) {
            // claim the row so two requests never send it twice
            if (q('UPDATE push_queue SET tries=tries+1 WHERE id=? AND tries=? AND sent_at IS NULL', [(int)$r['id'], (int)$r['tries']])->rowCount() !== 1) continue;
            $code = webpush_send($r['endpoint'], $r['p256dh'], $r['auth'], $r['payload']);
            if ($code >= 200 && $code < 300) { q('UPDATE push_queue SET sent_at=? WHERE id=?', [now_ts(), (int)$r['id']]); q('UPDATE push_subs SET last_ok=?, fails=0 WHERE id=?', [now_ts(), (int)$r['sid']]); $sent++; }
            elseif ($code === 404 || $code === 410) { q('DELETE FROM push_subs WHERE id=?', [(int)$r['sid']]); q('DELETE FROM push_queue WHERE sub_id=?', [(int)$r['sid']]); }
            else q('UPDATE push_subs SET fails=fails+1 WHERE id=?', [(int)$r['sid']]);
        }
        // tidy: sent / given-up messages older than 3 days
        if (mt_rand(1, 20) === 1) q('DELETE FROM push_queue WHERE (sent_at IS NOT NULL OR tries >= 5) AND created_at < ?', [now_ts() - 3 * 86400]);
    } catch (Throwable $e) { error_log('push_flush: ' . $e->getMessage()); }
    return $sent;
}

/* =====================================================================
 * Web Push crypto
 * ===================================================================== */
const P256_SPKI_PREFIX = '3059301306072a8648ce3d020106082a8648ce3d030107034200';

/** VAPID key pair, created once and kept in the database. ['pem' => private PEM, 'pub' => 65-byte point]. */
function vapid_keys() {
    static $k = null;
    if ($k) return $k;
    $row = kv_get('vapid');
    if ($row) { $j = json_decode((string)$row['v'], true); if (is_array($j) && !empty($j['pem']) && !empty($j['pub'])) return $k = ['pem' => $j['pem'], 'pub' => b64u_dec($j['pub'])]; }
    if (!push_supported()) return $k = ['pem' => '', 'pub' => ''];
    list($pem, $pub) = ec_new_key();
    kv_set('vapid', json_encode(['pem' => $pem, 'pub' => b64u_enc($pub)]));
    // another request may have created keys at the same moment: use whichever was stored
    $j = json_decode((string)kv_get('vapid')['v'], true);
    return $k = ['pem' => $j['pem'], 'pub' => b64u_dec($j['pub'])];
}
function ec_new_key() {
    $cfg = ['private_key_type' => OPENSSL_KEYTYPE_EC, 'curve_name' => 'prime256v1'];
    $res = openssl_pkey_new($cfg);
    if (!$res) throw new RuntimeException('EC key generation failed');
    openssl_pkey_export($res, $pem, null, $cfg);
    $d = openssl_pkey_get_details($res);
    $pub = "\x04" . str_pad($d['ec']['x'], 32, "\0", STR_PAD_LEFT) . str_pad($d['ec']['y'], 32, "\0", STR_PAD_LEFT);
    return [$pem, $pub, $res];
}
function ec_pub_pem($raw) {
    return "-----BEGIN PUBLIC KEY-----\n" . chunk_split(base64_encode(hex2bin(P256_SPKI_PREFIX) . $raw), 64, "\n") . "-----END PUBLIC KEY-----\n";
}
function hkdf_sha256($salt, $ikm, $info, $len) { $prk = hash_hmac('sha256', $ikm, $salt, true); return substr(hash_hmac('sha256', $info . "\x01", $prk, true), 0, $len); }
/** DER ECDSA signature -> 64-byte r||s (JOSE ES256). */
function der_to_jose($der) {
    $o = 2; if (ord($der[1]) & 0x80) $o += ord($der[1]) & 0x7f;
    $rl = ord($der[$o + 1]); $r = substr($der, $o + 2, $rl); $o += 2 + $rl;
    $sl = ord($der[$o + 1]); $s = substr($der, $o + 2, $sl);
    $fix = function ($x) { $x = ltrim($x, "\0"); return str_pad($x, 32, "\0", STR_PAD_LEFT); };
    return $fix($r) . $fix($s);
}
function vapid_header($endpoint) {
    $k = vapid_keys();
    $p = parse_url($endpoint);
    $aud = $p['scheme'] . '://' . $p['host'] . (isset($p['port']) ? ':' . $p['port'] : '');
    $sub = (string)cfg('push_contact', 'mailto:support@nurbuy.com');
    $h = b64u_enc(json_encode(['typ' => 'JWT', 'alg' => 'ES256']));
    $c = b64u_enc(json_encode(['aud' => $aud, 'exp' => now_ts() + 12 * 3600, 'sub' => $sub], JSON_UNESCAPED_SLASHES));
    $sig = '';
    if (!openssl_sign($h . '.' . $c, $sig, $k['pem'], OPENSSL_ALGO_SHA256)) throw new RuntimeException('VAPID sign failed');
    return 'vapid t=' . $h . '.' . $c . '.' . b64u_enc(der_to_jose($sig)) . ', k=' . b64u_enc($k['pub']);
}
/** RFC 8291 message encryption. Returns the request body. */
function webpush_encrypt($payload, $p256dh, $auth, $fixed = null) {
    $ua = b64u_dec($p256dh); $secret = b64u_dec($auth);
    if (strlen($ua) !== 65 || strlen($secret) < 16) throw new RuntimeException('bad subscription keys');
    if ($fixed) { list($asPem, $asPub, $salt) = $fixed; $asKey = openssl_pkey_get_private($asPem); }
    else { list($asPem, $asPub, $asKey) = ec_new_key(); $salt = random_bytes(16); }
    $peer = openssl_pkey_get_public(ec_pub_pem($ua));
    if (!$peer) throw new RuntimeException('bad client key');
    $ecdh = openssl_pkey_derive($peer, $asKey, 32);
    if ($ecdh === false || strlen($ecdh) !== 32) throw new RuntimeException('ECDH failed');
    $ikm = hkdf_sha256($secret, $ecdh, "WebPush: info\0" . $ua . $asPub, 32);
    $cek = hkdf_sha256($salt, $ikm, "Content-Encoding: aes128gcm\0", 16);
    $nonce = hkdf_sha256($salt, $ikm, "Content-Encoding: nonce\0", 12);
    $tag = '';
    $ct = openssl_encrypt($payload . "\x02", 'aes-128-gcm', $cek, OPENSSL_RAW_DATA, $nonce, $tag, '', 16);
    if ($ct === false) throw new RuntimeException('encrypt failed');
    return $salt . pack('N', 4096) . chr(65) . $asPub . $ct . $tag;
}
/** Returns the HTTP status from the push service (0 = network error). */
function webpush_send($endpoint, $p256dh, $auth, $payload) {
    try {
        $body = webpush_encrypt($payload, $p256dh, $auth);
        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => $body, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8, CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_HTTPHEADER => ['Content-Type: application/octet-stream', 'Content-Encoding: aes128gcm', 'TTL: 86400', 'Urgency: high',
                                   'Authorization: ' . vapid_header($endpoint)]]);
        curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
        return $code;
    } catch (Throwable $e) { error_log('webpush_send: ' . $e->getMessage()); return 0; }
}

/* =====================================================================
 * Admin: send a notification to customers / sellers / riders
 * ===================================================================== */
function h_admin_notify() {
    $a = require_admin();
    $b = body_json();
    $target = (string)($b['target'] ?? '');
    $T = ['customers' => 'user', 'customer' => 'user', 'sellers' => 'seller', 'seller' => 'seller', 'riders' => 'rider', 'rider' => 'rider'];
    if (!isset($T[$target])) fail(400, 'Choose who gets the notification', 'target');
    $role = $T[$target];
    $title = clean_str($b['title'] ?? '', 120); $msg = clean_str($b['message'] ?? '', 500);
    if ($title === '') fail(400, 'Write a title', 'title');
    if ($msg === '') fail(400, 'Write a message', 'message');
    $img = isset($b['image']) && $b['image'] !== '' ? brand_url($b['image']) : '';
    if (isset($b['image']) && $b['image'] !== '' && $img === '') fail(400, 'Image must be an http(s) link', 'image');
    // link priority: product, category, then the written link
    $url = null;
    if (!empty($b['product'])) { $url = share_product_path((string)$b['product']); if (!$url) fail(400, 'Product not found', 'product'); }
    elseif (!empty($b['category'])) { $url = share_category_path((int)$b['category']); if (!$url) fail(400, 'Category not found', 'category'); }
    elseif (isset($b['url']) && $b['url'] !== '') { $url = notif_url_ok($b['url']); if (!$url) fail(400, 'Link must start with / or http(s)://', 'url'); }
    if ($url !== null && $role !== 'user' && strpos($url, '/') === 0 && (!empty($b['product']) || !empty($b['category']))) $url = site_url('user') . $url;
    $ids = [];
    if (in_array($target, ['customer', 'seller', 'rider'], true)) {
        $raw = $b['ids'] ?? [];
        if (!is_array($raw) || !$raw) fail(400, 'Choose at least one person', 'ids');
        $raw = array_slice(array_values(array_unique(array_map('strval', $raw))), 0, 500);
        $tbl = ['user' => ['users', 'id'], 'seller' => ['sellers', 'id'], 'rider' => ['riders', 'id']][$role];
        foreach ($raw as $id) if (db_val("SELECT 1 FROM {$tbl[0]} WHERE {$tbl[1]}=?", [$id])) $ids[] = $id;
        if (!$ids) fail(400, 'None of the chosen people were found', 'ids');
    } else {
        $sql = ['user' => 'SELECT id FROM users WHERE blocked=0', 'seller' => "SELECT id FROM sellers WHERE status='approved'", 'rider' => "SELECT id FROM riders WHERE status='approved'"][$role];
        $ids = array_map('strval', array_column(db_rows($sql), 'id'));
    }
    $t = now_ts();
    q('INSERT INTO admin_broadcasts (target, ids, title, body, img, url, sent, admin_name, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
      [$target, $ids && in_array($target, ['customer', 'seller', 'rider'], true) ? json_encode($ids) : null, $title, $msg, $img ?: null, $url, count($ids), clean_str($a['name'] ?? '', 120), $t]);
    $bid = (int)db()->lastInsertId();
    $n = 0;
    db_tx(function () use ($ids, $role, $title, $msg, $url, $img, $bid, &$n) {
        foreach ($ids as $id) if (notify($role, $id, $title, $msg, ['url' => $url, 'img' => $img ?: null, 'kind' => 'admin', 'dkey' => 'bc' . $bid])) $n++;
    });
    json_out(['ok' => true, 'sent' => $n, 'id' => $bid]);
}
function h_admin_notify_list() {
    require_admin();
    $out = [];
    foreach (db_rows('SELECT * FROM admin_broadcasts ORDER BY id DESC LIMIT 100') as $r)
        $out[] = ['id' => (int)$r['id'], 'target' => $r['target'], 'ids' => json_decode((string)$r['ids'], true) ?: [], 'title' => $r['title'], 'body' => $r['body'],
                  'img' => $r['img'], 'url' => $r['url'], 'sent' => (int)$r['sent'], 'by' => $r['admin_name'], 'at' => (int)$r['created_at'] * 1000];
    $subs = [];
    foreach (db_rows('SELECT role, COUNT(DISTINCT owner_id) n FROM push_subs GROUP BY role') as $r) $subs[$r['role']] = (int)$r['n'];
    json_out(['items' => $out, 'push' => ['ok' => push_supported(), 'customers' => $subs['user'] ?? 0, 'sellers' => $subs['seller'] ?? 0, 'riders' => $subs['rider'] ?? 0]]);
}
/** People picker for "send to a specific customer / seller / rider". */
function h_admin_notify_people() {
    require_admin();
    $role = (string)($_GET['role'] ?? '');
    $qq = trim((string)($_GET['q'] ?? ''));
    $l = '%' . $qq . '%';
    if ($role === 'customer') $rows = db_rows('SELECT id, name, mobile FROM users WHERE name LIKE ? OR mobile LIKE ? OR id=? ORDER BY created_at DESC LIMIT 30', [$l, $l, $qq]);
    elseif ($role === 'seller') $rows = db_rows("SELECT id, shop_name name, mobile FROM sellers WHERE status='approved' AND (shop_name LIKE ? OR mobile LIKE ? OR owner_name LIKE ?) ORDER BY id DESC LIMIT 30", [$l, $l, $l]);
    elseif ($role === 'rider') $rows = db_rows("SELECT id, name, mobile FROM riders WHERE status='approved' AND (name LIKE ? OR mobile LIKE ?) ORDER BY id DESC LIMIT 30", [$l, $l]);
    else fail(400, 'Invalid role', 'role');
    json_out(['people' => array_map(function ($r) { return ['id' => (string)$r['id'], 'name' => $r['name'], 'mobile' => $r['mobile']]; }, $rows)]);
}
