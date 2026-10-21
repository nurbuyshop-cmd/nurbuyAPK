<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* ---------- errors ---------- */
class ApiError extends Exception {
    public $status; public $field; public $errCode; public $extra = null;
    public function __construct($status, $msg, $field = null, $code = null) {
        parent::__construct($msg);
        $this->status = $status; $this->field = $field; $this->errCode = $code;
    }
}
function fail($status, $msg, $field = null, $code = null) { throw new ApiError($status, $msg, $field, $code); }

/* ---------- config ---------- */
function cfg($key = null, $default = null) {
    static $c = null;
    if ($c === null) {
        $path = getenv('NURBUY_CONFIG');
        if (!$path && !empty($_SERVER['NURBUY_CONFIG'])) $path = $_SERVER['NURBUY_CONFIG'];
        if (!$path) $path = dirname(__DIR__) . '/config.php';
        if (!is_file($path)) throw new RuntimeException('config file not found');
        $c = require $path;
        if (!is_array($c)) throw new RuntimeException('config file must return an array');
    }
    if ($key === null) return $c;
    return array_key_exists($key, $c) ? $c[$key] : $default;
}

/* ---------- output ---------- */
function json_out($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}
function json_error($status, $msg, $field = null, $code = null, $extra = null) {
    $o = ['error' => $msg];
    if (is_array($extra)) $o += $extra;
    if ($field !== null) $o['field'] = $field;
    if ($code !== null) $o['code'] = $code;
    json_out($o, $status);
}

/* ---------- CORS ---------- */
function send_cors() {
    $allowed = cfg('allowed_origins', ['*']);
    if (!is_array($allowed)) $allowed = [$allowed];
    $allowed[] = 'https://rider.nurbuy.com';
    $allowed[] = 'https://seller.nurbuy.com'; // rider + seller panels (fixed subdomains)
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $val = null;
    if (in_array('*', $allowed, true)) $val = ($origin !== '') ? $origin : '*';
    elseif ($origin !== '' && in_array($origin, $allowed, true)) $val = $origin;
    if ($val !== null) {
        header('Access-Control-Allow-Origin: ' . $val);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Chat-Guest');
        header('Access-Control-Max-Age: 86400');
    }
}

/* ---------- request body ---------- */
function raw_body() {
    static $raw = null;
    if ($raw === null) {
        $len = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
        if ($len > 2 * 1024 * 1024) fail(413, 'Request body too large');
        $raw = (string)file_get_contents('php://input', false, null, 0, 2 * 1024 * 1024 + 1);
        if (strlen($raw) > 2 * 1024 * 1024) fail(413, 'Request body too large');
    }
    return $raw;
}
/** Decode JSON body. $assoc=false returns objects (preserves {} vs []). */
function body_json($assoc = true) {
    $raw = trim(raw_body());
    if ($raw === '') return $assoc ? [] : new stdClass();
    $d = json_decode($raw, $assoc, 64);
    if (json_last_error() !== JSON_ERROR_NONE || !(is_array($d) || is_object($d))) fail(400, 'Invalid JSON body');
    return $d;
}

/* ---------- validation helpers ---------- */
function clean_str($v, $max = 200) {
    if (!is_string($v) && !is_numeric($v)) return '';
    $v = trim((string)$v);
    if (function_exists('mb_substr')) return mb_substr($v, 0, $max, 'UTF-8');
    return substr($v, 0, $max);
}
function is_num($v) {
    if (is_int($v) || is_float($v)) return is_finite((float)$v);
    return is_string($v) && is_numeric($v) && is_finite((float)$v);
}
function money($v) { return round((float)$v, 2); }
function normalize_mobile($m) {
    $m = preg_replace('/[\s\-\(\)\.]+/', '', (string)$m);
    if (strpos($m, '+88') === 0) $m = substr($m, 3);
    elseif (strpos($m, '88') === 0 && strlen($m) === 13) $m = substr($m, 2);
    return $m;
}
function valid_mobile($m) { return (bool)preg_match('/^01[0-9]{9}$/', $m); }
function valid_email($e) { return strlen($e) <= 190 && filter_var($e, FILTER_VALIDATE_EMAIL) !== false; }
function now_ts() { return time(); }

function new_user_id() { return 'u_' . base_convert((string)time(), 10, 36) . bin2hex(random_bytes(4)); }
function rand_digits($n) { $s = ''; for ($i = 0; $i < $n; $i++) $s .= (string)random_int(0, 9); return $s; }

/* ---------- output shapes ---------- */
function user_out($u) {
    return [
        'id' => $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'mobile' => $u['mobile'],
        'mvf' => (int)$u['mvf'], 'auto' => (int)$u['auto'], 'hasPw' => !empty($u['pw_hash']),
        'created_at' => (int)$u['created_at'],
    ];
}
function json_or_obj($s) {
    if ($s === null || $s === '') return new stdClass();
    $d = json_decode($s, false);
    return ($d === null) ? new stdClass() : $d;
}
function order_out($o) {
    $extra = json_or_obj($o['extra']);
    if (is_object($extra)) unset($extra->refunded, $extra->rider_pay, $extra->stock_restored);
    $items = json_decode((string)$o['items'], false);
    if (!is_array($items)) $items = [];
    return [
        'id' => $o['id'], 'view' => $o['view'], 'status' => $o['status'],
        'sub' => money($o['sub']), 'fee' => money($o['fee']), 'cod' => money($o['cod']), 'total' => money($o['total']),
        'pay' => $o['pay'], 'shop' => $o['shop'], 'veh' => $o['veh'],
        'name' => $o['name'], 'mobile' => $o['mobile'], 'email' => $o['email'], 'address' => $o['address'],
        'items' => $items, 'extra' => $extra,
        'cashback' => money($o['cashback']), 'paid' => money($o['paid_wallet']),
        'disc' => money($o['disc'] ?? 0), 'coupon' => $o['coupon'] ?? null,
        'created_at' => (int)$o['created_at'] * 1000, 'updated_at' => (int)$o['updated_at'] * 1000,
        'eta' => function_exists('order_eta') ? order_eta($o) : null,
        'bonus' => function_exists('order_bonus_state') ? order_bonus_state($o) : null,
    ];
}

/* ---------- admin state ---------- */
function admin_state() {
    $row = kv_get('admin_state');
    if (!$row) return [[], 0];
    $d = json_decode($row['v'], true);
    return [is_array($d) ? $d : [], (int)$row['updated_at']];
}
function state_setting($name, $default) {
    list($D) = admin_state();
    $s = (isset($D['set']) && is_array($D['set'])) ? $D['set'] : [];
    return (array_key_exists($name, $s) && $s[$name] !== null && $s[$name] !== '') ? $s[$name] : $default;
}
