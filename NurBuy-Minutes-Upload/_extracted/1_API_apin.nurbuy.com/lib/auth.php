<?php
if (!defined('NB')) { http_response_code(403); exit; }

const SESSION_TTL = 2592000; // 30 days

function bearer_token() {
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    if ($h === '' && function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) { if (strtolower($k) === 'authorization') { $h = $v; break; } }
    }
    if ($h === '' && function_exists('apache_request_headers')) {
        foreach (apache_request_headers() as $k => $v) { if (strtolower($k) === 'authorization') { $h = $v; break; } }
    }
    if (preg_match('/^\s*Bearer\s+([A-Za-z0-9]{32,128})\s*$/i', $h, $m)) return $m[1];
    return null;
}
function create_session($uid, $role) {
    $tok = bin2hex(random_bytes(24));
    $t = now_ts();
    q('INSERT INTO sessions (token, user_id, role, created_at, expires_at) VALUES (?,?,?,?,?)', [$tok, (string)$uid, $role, $t, $t + SESSION_TTL]);
    if (random_int(1, 50) === 1) q('DELETE FROM sessions WHERE expires_at<?', [$t]);
    return $tok;
}
function current_session() {
    static $s = false;
    if ($s !== false) return $s;
    $tok = bearer_token();
    $s = null;
    if ($tok) $s = db_row('SELECT * FROM sessions WHERE token=? AND expires_at>?', [$tok, now_ts()]);
    return $s;
}
/** Valid logged-in customer or null (invalid/absent token => null). Blocked => 403. */
function optional_user() {
    $s = current_session();
    if (!$s || $s['role'] !== 'user') return null;
    $u = db_row('SELECT * FROM users WHERE id=?', [$s['user_id']]);
    if (!$u) return null;
    block_user_check($u);
    return $u;
}
function require_user() {
    $s = current_session();
    if (!$s) fail(401, 'Authentication required');
    $u = optional_user();
    if (!$u) fail(401, 'Authentication required');
    return $u;
}
function require_admin() {
    $s = current_session();
    if (!$s) fail(401, 'Authentication required');
    if ($s['role'] !== 'admin') fail(403, 'Admin access required');
    $a = db_row('SELECT * FROM admins WHERE id=?', [$s['user_id']]);
    if (!$a) fail(401, 'Authentication required');
    // Banner Studio staff accounts only reach the /admin/bs/* endpoints (require_bs)
    if ($a['role'] !== 'admin') fail(403, 'Admin access required', null, 'staff_only');
    return $a;
}

/* ---------- login throttle ---------- */
const THROTTLE_MAX = 10;
const THROTTLE_WINDOW = 900;
/** The caller's IP. Behind a proxy or CDN set config 'ip_header' (e.g. HTTP_CF_CONNECTING_IP): without it the proxy's own address would be seen. */
function client_ip() {
    $h = cfg('ip_header', '');
    if (is_string($h) && $h !== '' && !empty($_SERVER[$h])) {
        $ip = trim(explode(',', (string)$_SERVER[$h])[0]);
        if (filter_var($ip, FILTER_VALIDATE_IP) !== false) return substr($ip, 0, 45);
    }
    return substr((string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'), 0, 45);
}
function throttle_check($scope) {
    $key = $scope . ':' . client_ip();
    $n = (int)db_val('SELECT COUNT(*) FROM login_fails WHERE ip=? AND ts>?', [$key, now_ts() - THROTTLE_WINDOW]);
    if ($n >= THROTTLE_MAX) {
        header('Retry-After: ' . THROTTLE_WINDOW);
        fail(429, 'Too many failed attempts. Try again later.');
    }
}
function throttle_fail($scope) {
    q('INSERT INTO login_fails (ip, ts) VALUES (?,?)', [$scope . ':' . client_ip(), now_ts()]);
    if (random_int(1, 20) === 1) q('DELETE FROM login_fails WHERE ts<?', [now_ts() - THROTTLE_WINDOW]);
}
function throttle_clear($scope) { q('DELETE FROM login_fails WHERE ip=?', [$scope . ':' . client_ip()]); }
