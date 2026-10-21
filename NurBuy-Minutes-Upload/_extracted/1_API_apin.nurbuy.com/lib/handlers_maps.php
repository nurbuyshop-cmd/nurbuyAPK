<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * Google Maps: browser key delivery, delivery pin details, live location
 *
 * The browser key lives ONLY on the server: GOOGLE_MAPS_API_KEY in the
 * environment, or in the file ".env" next to config.php. The websites ask
 * GET /public/maps for it, so the key is never written into any HTML/JS
 * file. (A Maps JavaScript key is always visible to the browser while the
 * map loads; the HTTP-referrer restriction in Google Cloud is what keeps
 * other sites from using it.)
 * ===================================================================== */

const MAPS_COUNTRIES = ['bd', 'ae'];
const LIVE_FRESH_SECS = 180; // a live point older than this is shown as "last seen"

/** Reads KEY=value pairs from <api>/.env (no export, no interpolation). */
function maps_env_file() {
    static $v = null;
    if ($v !== null) return $v;
    $v = [];
    $f = dirname(__DIR__) . '/.env';
    if (is_file($f) && is_readable($f)) {
        foreach (preg_split('/\r?\n/', (string)file_get_contents($f)) as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#') continue;
            $p = strpos($line, '=');
            if ($p === false) continue;
            $k = trim(substr($line, 0, $p));
            $val = trim(substr($line, $p + 1));
            if (strlen($val) >= 2 && ($val[0] === '"' || $val[0] === "'") && substr($val, -1) === $val[0]) $val = substr($val, 1, -1);
            $v[$k] = $val;
        }
    }
    return $v;
}
function maps_setting($name, $default = '') {
    $e = getenv($name);
    if ($e !== false && $e !== '') return $e;
    $f = maps_env_file();
    return isset($f[$name]) && $f[$name] !== '' ? $f[$name] : $default;
}

function h_public_maps() {
    $key = trim((string)maps_setting('GOOGLE_MAPS_API_KEY', (string)cfg('google_maps_key', '')));
    if (!preg_match('/^[A-Za-z0-9_\-]{20,120}$/', $key)) $key = '';
    $mapId = trim((string)maps_setting('GOOGLE_MAPS_MAP_ID', ''));
    if (!preg_match('/^[A-Za-z0-9_\-]{1,64}$/', $mapId)) $mapId = '';
    header('Cache-Control: private, max-age=300');
    json_out([
        'key' => $key,
        'map_id' => $mapId,
        'countries' => MAPS_COUNTRIES,
        // default centres, used when the customer has not allowed location yet
        'centers' => [
            ['id' => 'dhaka', 'en' => 'Dhaka', 'bn' => 'ঢাকা', 'lat' => 23.8103, 'lng' => 90.4125, 'zoom' => 13],
            ['id' => 'kishoreganj', 'en' => 'Kishoreganj', 'bn' => 'কিশোরগঞ্জ', 'lat' => 24.4449, 'lng' => 90.7766, 'zoom' => 13],
        ],
    ]);
}

/** Bangladesh and the UAE (with a little margin). */
function geo_in_service($lat, $lng) {
    $bd = $lat >= 20.3 && $lat <= 26.8 && $lng >= 87.9 && $lng <= 92.8;
    $ae = $lat >= 22.4 && $lat <= 26.3 && $lng >= 51.0 && $lng <= 56.6;
    return $bd || $ae;
}

/** Cleans the pin details the customer's browser sends with an order. Returns null when unusable. */
function geo_clean($g) {
    if (!is_array($g) || !isset($g['lat'], $g['lng']) || !is_num($g['lat']) || !is_num($g['lng'])) return null;
    $lat = round((float)$g['lat'], 7); $lng = round((float)$g['lng'], 7);
    if (!geo_in_service($lat, $lng)) return null;
    $out = ['lat' => $lat, 'lng' => $lng];
    foreach (['full' => 400, 'area' => 120, 'city' => 120, 'post' => 120, 'postcode' => 20, 'landmark' => 200, 'district' => 120, 'country' => 4, 'place_id' => 200] as $k => $max) {
        if (isset($g[$k]) && is_string($g[$k]) && trim($g[$k]) !== '') $out[$k] = clean_str($g[$k], $max);
    }
    if (isset($g['acc']) && is_num($g['acc'])) $out['acc'] = (int)min(100000, max(0, (float)$g['acc']));
    return $out;
}

/** "lat,lng" text the rider app already knows how to navigate to. */
function geo_loc_text($g) { return $g['lat'] . ',' . $g['lng']; }

/* ---------- live location (customer shares, rider/admin watch) ---------- */

function order_is_active($o) {
    return !in_array((string)$o['status'], ['Delivered', 'Cancelled', 'Failed', 'Refunded', 'Returned'], true);
}

function live_load_order($id) {
    $id = trim((string)$id);
    $o = db_row('SELECT * FROM orders WHERE id=?', [$id]);
    if (!$o) fail(404, 'Order not found');
    $u = optional_user();
    $ok = false;
    if ($u && $o['user_id'] !== null && (string)$o['user_id'] === (string)$u['id']) $ok = true;
    if (!$ok) {
        // guest orders: same rule as order tracking (order id + the mobile on the order)
        $b = body_json();
        $mobile = normalize_mobile($b['mobile'] ?? ($_GET['mobile'] ?? ''));
        if ($mobile !== '' && $o['user_id'] === null && $mobile === $o['mobile']) $ok = true;
    }
    if (!$ok) fail(404, 'Order not found');
    return $o;
}

/** POST /orders/{id}/live  {lat,lng,acc}  or  {off:true} to stop sharing. */
function h_order_live_post($id) {
    $o = live_load_order($id);
    $b = body_json();
    if (!empty($b['off'])) { q('DELETE FROM order_live WHERE order_id=?', [$o['id']]); json_out(['ok' => true, 'live' => null]); }
    if (!order_is_active($o)) fail(400, 'This order is no longer active', null, 'order_closed');
    if (!isset($b['lat'], $b['lng']) || !is_num($b['lat']) || !is_num($b['lng'])) fail(400, 'lat and lng are required');
    $lat = round((float)$b['lat'], 7); $lng = round((float)$b['lng'], 7);
    if (!geo_in_service($lat, $lng)) fail(400, 'This location is outside the delivery countries', 'lat');
    $acc = (isset($b['acc']) && is_num($b['acc'])) ? (int)min(100000, max(0, (float)$b['acc'])) : null;
    $t = now_ts();
    db_tx(function () use ($o, $lat, $lng, $acc, $t) {
        if (db_row('SELECT order_id FROM order_live WHERE order_id=?' . lock_suffix(), [$o['id']])) q('UPDATE order_live SET lat=?, lng=?, acc=?, updated_at=? WHERE order_id=?', [$lat, $lng, $acc, $t, $o['id']]);
        else q('INSERT INTO order_live (order_id, lat, lng, acc, started_at, updated_at) VALUES (?,?,?,?,?,?)', [$o['id'], $lat, $lng, $acc, $t, $t]);
    });
    json_out(['ok' => true, 'live' => order_live_out($o['id'])]);
}

/** The customer's own view of their live share (so the app can restore the toggle). */
function h_order_live_get($id) {
    $o = live_load_order($id);
    json_out(['live' => order_live_out($o['id'])]);
}

/** Shared by rider/admin payloads. Null when the customer is not sharing. */
function order_live_out($oid) {
    $r = db_row('SELECT * FROM order_live WHERE order_id=?', [$oid]);
    if (!$r) return null;
    $age = max(0, now_ts() - (int)$r['updated_at']);
    $url = 'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' . rawurlencode((float)$r['lat'] . ',' . (float)$r['lng']);
    return ['lat' => (float)$r['lat'], 'lng' => (float)$r['lng'], 'acc' => $r['acc'] === null ? null : (int)$r['acc'],
            'at' => (int)$r['updated_at'] * 1000, 'age' => $age, 'fresh' => $age <= LIVE_FRESH_SECS, 'nav' => $url];
}

/** GET /admin/orders/{id}/live */
function h_admin_order_live($id) {
    require_admin();
    $o = db_row('SELECT id, extra FROM orders WHERE id=?', [(string)$id]);
    if (!$o) fail(404, 'Order not found');
    $ex = json_decode((string)$o['extra'], true);
    json_out(['live' => order_live_out($o['id']), 'geo' => (is_array($ex) && isset($ex['geo']) && is_array($ex['geo'])) ? $ex['geo'] : null]);
}
