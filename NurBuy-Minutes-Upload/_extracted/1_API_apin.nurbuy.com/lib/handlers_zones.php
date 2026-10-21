<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * NurBuy Minutes delivery zones
 *
 * The admin draws service zones (polygons) on a map. Every zone carries its own
 * delivery charge, delivery time, rider payment, minimum order, free-delivery
 * threshold and an optional per-kilometre charge measured from each shop.
 *
 * Zones mode switches on as soon as at least one ACTIVE zone exists:
 *   - a Minutes order must carry a map pin
 *   - the pin must fall inside an active zone, otherwise the order is refused
 *   - the zone decides the delivery charge, time and rider payment
 * With no active zone the older village/area rules (handlers_loc.php) apply unchanged.
 *
 * Everything is decided on the server. The browser only mirrors it to give instant feedback.
 * ===================================================================== */

const ZONE_MAX_POINTS = 300;
const ZONE_MAX_ZONES = 300;
const ZONE_EDGE_TOLERANCE_M = 8.0;   // a pin this close to the boundary line counts as inside
const ZONE_MIN_AREA_KM2 = 0.0001;    // 100 square metres
const ZONE_COLORS = ['#4a52c8', '#16a34a', '#ea580c', '#0d9488', '#7c3aed', '#db2777', '#ca8a04', '#0284c7'];

/* ---------- geometry ---------- */

/** Local metric projection around a reference latitude: [x metres east, y metres north]. */
function zone_xy($lat, $lng, $lat0, $lng0) {
    return [($lng - $lng0) * 111320.0 * cos(deg2rad($lat0)), ($lat - $lat0) * 110574.0];
}

/** Great-circle distance in kilometres. */
function zone_km($lat1, $lng1, $lat2, $lng2) {
    $r = 6371.0088;
    $dLat = deg2rad($lat2 - $lat1); $dLng = deg2rad($lng2 - $lng1);
    $a = sin($dLat / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;
    return 2 * $r * asin(min(1.0, sqrt($a)));
}

/** Orientation of the turn a -> b -> c: 1 counter-clockwise, -1 clockwise, 0 collinear. */
function zone_orient($a, $b, $c) {
    $v = ($b[1] - $a[1]) * ($c[0] - $b[0]) - ($b[0] - $a[0]) * ($c[1] - $b[1]);
    return $v > 1e-12 ? 1 : ($v < -1e-12 ? -1 : 0);
}

/** True when segments p1p2 and p3p4 properly cross each other. */
function zone_segments_cross($p1, $p2, $p3, $p4) {
    $o1 = zone_orient($p1, $p2, $p3); $o2 = zone_orient($p1, $p2, $p4);
    $o3 = zone_orient($p3, $p4, $p1); $o4 = zone_orient($p3, $p4, $p2);
    return $o1 !== 0 && $o2 !== 0 && $o3 !== 0 && $o4 !== 0 && $o1 !== $o2 && $o3 !== $o4;
}

/** Polygon area in square kilometres (shoelace on the local projection). */
function zone_area_km2($poly) {
    $lat0 = 0; $lng0 = 0; $n = count($poly);
    foreach ($poly as $p) { $lat0 += $p[0]; $lng0 += $p[1]; }
    $lat0 /= $n; $lng0 /= $n;
    $s = 0.0; $prev = zone_xy($poly[$n - 1][0], $poly[$n - 1][1], $lat0, $lng0);
    foreach ($poly as $p) { $c = zone_xy($p[0], $p[1], $lat0, $lng0); $s += $prev[0] * $c[1] - $c[0] * $prev[1]; $prev = $c; }
    return abs($s) / 2.0 / 1e6;
}

/** Is the pin inside the polygon (or within a few metres of its edge)? */
function zone_contains($poly, $lat, $lng) {
    $n = count($poly);
    if ($n < 3) return false;
    $pts = []; foreach ($poly as $p) $pts[] = zone_xy($p[0], $p[1], $lat, $lng);   // pin becomes the origin
    $inside = false;
    for ($i = 0, $j = $n - 1; $i < $n; $j = $i++) {
        $a = $pts[$i]; $b = $pts[$j];
        // distance from the origin to segment ab
        $dx = $b[0] - $a[0]; $dy = $b[1] - $a[1]; $l2 = $dx * $dx + $dy * $dy;
        $t = $l2 > 0 ? max(0.0, min(1.0, -($a[0] * $dx + $a[1] * $dy) / $l2)) : 0.0;
        $qx = $a[0] + $t * $dx; $qy = $a[1] + $t * $dy;
        if ($qx * $qx + $qy * $qy <= ZONE_EDGE_TOLERANCE_M * ZONE_EDGE_TOLERANCE_M) return true;
        // ray casting along +x
        if (($a[1] > 0) !== ($b[1] > 0)) {
            $xAt = $a[0] + ($b[1] === $a[1] ? 0 : (0 - $a[1]) * ($b[0] - $a[0]) / ($b[1] - $a[1]));
            if ($xAt > 0) $inside = !$inside;
        }
    }
    return $inside;
}

/** Validates and normalises the polygon the admin draws. Returns [[lat,lng], ...] (open ring). */
function zone_poly_clean($raw) {
    if (!is_array($raw)) fail(400, 'Draw the zone on the map', 'poly', 'poly_required');
    $pts = [];
    foreach ($raw as $p) {
        if (is_array($p) && isset($p['lat'], $p['lng'])) $p = [$p['lat'], $p['lng']];
        if (!is_array($p) || count($p) < 2 || !is_num($p[0]) || !is_num($p[1])) fail(400, 'The zone outline has an invalid point', 'poly', 'poly_invalid');
        $lat = round((float)$p[0], 6); $lng = round((float)$p[1], 6);
        if (!geo_in_service($lat, $lng)) fail(400, 'Every corner must be inside Bangladesh or the UAE', 'poly', 'poly_outside');
        if ($pts && $pts[count($pts) - 1][0] === $lat && $pts[count($pts) - 1][1] === $lng) continue;
        $pts[] = [$lat, $lng];
    }
    if (count($pts) > 1 && $pts[0][0] === $pts[count($pts) - 1][0] && $pts[0][1] === $pts[count($pts) - 1][1]) array_pop($pts);
    if (count($pts) < 3) fail(400, 'A zone needs at least 3 corners', 'poly', 'poly_few');
    if (count($pts) > ZONE_MAX_POINTS) fail(400, 'A zone can have at most ' . ZONE_MAX_POINTS . ' corners', 'poly', 'poly_many');
    // no crossing edges
    $n = count($pts);
    $lat0 = $pts[0][0]; $lng0 = $pts[0][1];
    $xy = []; foreach ($pts as $p) $xy[] = zone_xy($p[0], $p[1], $lat0, $lng0);
    for ($i = 0; $i < $n; $i++) {
        $a1 = $xy[$i]; $a2 = $xy[($i + 1) % $n];
        for ($j = $i + 2; $j < $n; $j++) {
            if ($i === 0 && $j === $n - 1) continue; // first and last edges share a corner
            if (zone_segments_cross($a1, $a2, $xy[$j], $xy[($j + 1) % $n])) fail(400, 'The outline crosses itself. Move the corners so the lines do not cross.', 'poly', 'poly_crossing');
        }
    }
    if (zone_area_km2($pts) < ZONE_MIN_AREA_KM2) fail(400, 'This zone is too small', 'poly', 'poly_small');
    return $pts;
}

/* ---------- loading ---------- */

function zone_row_out($r, $withPoly = true) {
    $o = ['id' => (int)$r['id'], 'name' => $r['name'], 'bn' => $r['bn'] ?? '', 'active' => (int)$r['active'] === 1,
          'area_km2' => round((float)$r['area_km2'], 3),
          'fee' => $r['fee'] === null ? null : money($r['fee']),
          'eta' => $r['eta'] === null ? null : (int)$r['eta'],
          'rider_pay' => $r['rider_pay'] === null ? null : money($r['rider_pay']),
          'min_order' => $r['min_order'] === null ? null : money($r['min_order']),
          'free_over' => $r['free_over'] === null ? null : money($r['free_over']),
          'per_km' => $r['per_km'] === null ? null : money($r['per_km']),
          'km_free' => $r['km_free'] === null ? null : round((float)$r['km_free'], 2),
          'color' => $r['color'] ?: ZONE_COLORS[((int)$r['id']) % count(ZONE_COLORS)],
          'sort' => (int)$r['sort']];
    if ($withPoly) { $p = json_decode((string)$r['poly'], true); $o['poly'] = is_array($p) ? $p : []; }
    return $o;
}

/** Active zones with decoded outlines (one query per request). */
function zones_active() {
    static $c = null;
    if ($c !== null) return $c;
    $c = [];
    try {
        foreach (db_rows('SELECT * FROM delivery_zones WHERE active=1 ORDER BY sort, id') as $r) { $z = zone_row_out($r); if (count($z['poly']) >= 3) $c[] = $z; }
    } catch (Throwable $e) { $c = []; }   // table not created yet
    return $c;
}
function zones_mode() { return count(zones_active()) > 0; }
function zones_cache_reset() { /* zones_active() caches per request; admin writes end the request, nothing to do */ }

/** The zone that serves a pin. With overlapping zones the smallest (most specific) one wins. */
function zone_find($lat, $lng) {
    $best = null;
    foreach (zones_active() as $z) {
        if (!zone_contains($z['poly'], (float)$lat, (float)$lng)) continue;
        if ($best === null || $z['area_km2'] < $best['area_km2'] || ($z['area_km2'] === $best['area_km2'] && $z['id'] < $best['id'])) $best = $z;
    }
    return $best;
}

/* ---------- pricing ---------- */

/** Seller shop pins for the items in an order or cart: [[lat,lng], ...] (one per shop that has a pin). */
function zone_shop_points($items) {
    $ids = [];
    foreach ($items as $it) if (isset($it['id']) && preg_match('/^SP(\d+)$/', (string)$it['id'], $m)) $ids[(int)$m[1]] = true;
    if (!$ids) return [];
    $pts = []; $seen = [];
    foreach (db_rows('SELECT DISTINCT s.id, s.lat, s.lng FROM seller_products p JOIN sellers s ON s.id=p.seller_id WHERE p.id IN (' . implode(',', array_keys($ids)) . ')') as $r) {
        if ($r['lat'] === null || $r['lng'] === null || isset($seen[$r['id']])) continue;
        $seen[$r['id']] = true; $pts[] = [(float)$r['lat'], (float)$r['lng']];
    }
    return $pts;
}

/** Number of different shops in a cart (same rule as order_check_items). */
function zone_count_shops($items) {
    $shops = [];
    foreach ($items as $it) {
        $id = isset($it['id']) ? (string)$it['id'] : '';
        if (preg_match('/^SP(\d+)$/', $id, $m)) {
            $sid = db_val('SELECT seller_id FROM seller_products WHERE id=?', [(int)$m[1]]);
            $shops['s' . ($sid ?: 'x' . $m[1])] = true;
        } else $shops['n' . mb_strtolower(trim((string)($it['shop'] ?? '')))] = true;
    }
    return max(1, count($shops));
}

/**
 * Delivery charge for a zone.
 *   base          = the zone's own charge, else the village/area/default charge passed in
 *   free delivery = subtotal at or above the zone's threshold (else the site-wide one)
 *   distance      = per-km charge for the distance beyond the free kilometres, per shop
 */
function zone_quote($z, $baseFallback, $sub, $nShops, $pin, $shopPts) {
    $base = $z['fee'] !== null ? (float)$z['fee'] : (float)$baseFallback;
    $freeAt = $z['free_over'] !== null ? (float)$z['free_over'] : loc_free();
    $dist = 0.0; $km = [];
    if ($pin && $shopPts) foreach ($shopPts as $sp) $km[] = round(zone_km($sp[0], $sp[1], (float)$pin['lat'], (float)$pin['lng']), 2);
    if ($z['per_km'] !== null && (float)$z['per_km'] > 0 && $km) {
        $incl = $z['km_free'] !== null ? (float)$z['km_free'] : 0.0;
        foreach ($km as $d) $dist += max(0.0, $d - $incl) * (float)$z['per_km'];
        $dist = round($dist);
    }
    $free = $sub >= $freeAt;
    $fee = $free ? 0.0 : money($base * max(1, $nShops) + $dist);
    return ['fee' => $fee, 'free' => $free, 'base' => money($base), 'distance_charge' => money($dist), 'km' => $km, 'free_over' => money($freeAt)];
}

/** ETA minutes and rider payment: the zone's own value, else the village/default value passed in. */
function zone_eta($z, $fallback) { return ($z['eta'] !== null && (int)$z['eta'] > 0) ? (int)$z['eta'] : $fallback; }
function zone_rider_pay($z, $fallback) { return $z['rider_pay'] !== null ? money($z['rider_pay']) : $fallback; }

/** Shape the customer's browser needs to show the zone (no internal ids besides the zone id). */
function zone_public($z, $withPoly = false) {
    $o = ['id' => $z['id'], 'name' => $z['name'], 'bn' => $z['bn'] ?: $z['name'], 'color' => $z['color'], 'fee' => $z['fee'], 'eta' => $z['eta'],
          'min_order' => $z['min_order'], 'free_over' => $z['free_over'], 'per_km' => $z['per_km'], 'km_free' => $z['km_free']];
    if ($withPoly) $o['poly'] = $z['poly'];
    return $o;
}

/* ---------- public API ---------- */

/** GET /public/zones : the active zones (outlines too, so the picker can draw them). */
function h_public_zones() {
    $zs = zones_active();
    header('Cache-Control: private, max-age=60');
    json_out(['active' => count($zs) > 0, 'default_fee' => loc_default_fee(), 'default_eta' => delivery_eta_default(), 'free_over' => loc_free(),
              'zones' => array_map(function ($z) { return zone_public($z, true); }, $zs)]);
}

/** POST /public/zones/check {lat,lng,sub?,items?[{id,shop}]} : is this pin served, and at what price? */
function h_public_zone_check() {
    $b = body_json();
    if (!isset($b['lat'], $b['lng']) || !is_num($b['lat']) || !is_num($b['lng'])) fail(400, 'lat and lng are required');
    $lat = round((float)$b['lat'], 7); $lng = round((float)$b['lng'], 7);
    if (!zones_mode()) json_out(['zones_mode' => false, 'inside' => geo_in_service($lat, $lng)]);
    $z = geo_in_service($lat, $lng) ? zone_find($lat, $lng) : null;
    if (!$z) json_out(['zones_mode' => true, 'inside' => false, 'zone' => null]);
    $items = (isset($b['items']) && is_array($b['items'])) ? array_slice(array_values(array_filter($b['items'], 'is_array')), 0, 100) : [];
    $sub = (isset($b['sub']) && is_num($b['sub'])) ? max(0.0, money($b['sub'])) : 0.0;
    $nShops = $items ? zone_count_shops($items) : 1;
    $q = zone_quote($z, loc_default_fee(), $sub, $nShops, ['lat' => $lat, 'lng' => $lng], zone_shop_points($items));
    json_out(['zones_mode' => true, 'inside' => true, 'zone' => zone_public($z), 'fee' => $q['fee'], 'free' => $q['free'], 'distance_charge' => $q['distance_charge'], 'km' => $q['km'],
              'eta' => zone_eta($z, delivery_eta_default()), 'min_order' => $z['min_order'], 'min_ok' => $z['min_order'] === null || $sub >= (float)$z['min_order'], 'free_over' => $q['free_over']]);
}

/* ---------- admin API ---------- */

function zone_money_in($b, $k, $lo, $hi, $msg) {
    if (!array_key_exists($k, $b) || $b[$k] === null || $b[$k] === '') return null;
    if (!is_num($b[$k]) || (float)$b[$k] < $lo || (float)$b[$k] > $hi) fail(400, $msg, $k);
    return money($b[$k]);
}

/** Reads and validates the editable fields. $partial = only the keys that were sent (update). */
function zone_fields_in($b, $partial) {
    $set = [];
    if (!$partial || array_key_exists('name', $b)) {
        $n = clean_str($b['name'] ?? '', 120);
        if ($n === '') fail(400, 'Write a zone name', 'name');
        $set['name'] = $n;
    }
    if (!$partial || array_key_exists('bn', $b)) $set['bn'] = clean_str($b['bn'] ?? '', 120) ?: null;
    if (!$partial || array_key_exists('active', $b)) $set['active'] = !empty($b['active']) || !array_key_exists('active', $b) ? 1 : 0;
    if (!$partial || array_key_exists('fee', $b)) $set['fee'] = zone_money_in($b, 'fee', 0, 100000, 'Enter a valid delivery charge');
    if (!$partial || array_key_exists('eta', $b)) $set['eta'] = loc_eta_in($b['eta'] ?? null);
    if (!$partial || array_key_exists('rider_pay', $b)) $set['rider_pay'] = loc_pay_in($b['rider_pay'] ?? null);
    if (!$partial || array_key_exists('min_order', $b)) { $v = zone_money_in($b, 'min_order', 0, 1000000, 'Enter a valid minimum order'); $set['min_order'] = ($v === null || $v <= 0) ? null : $v; }
    if (!$partial || array_key_exists('free_over', $b)) { $v = zone_money_in($b, 'free_over', 1, 1000000, 'Free delivery amount must be at least 1'); $set['free_over'] = $v; }
    if (!$partial || array_key_exists('per_km', $b)) { $v = zone_money_in($b, 'per_km', 0, 10000, 'Enter a valid per-km charge'); $set['per_km'] = ($v === null || $v <= 0) ? null : $v; }
    if (!$partial || array_key_exists('km_free', $b)) { $v = zone_money_in($b, 'km_free', 0, 100, 'Free kilometres must be 0 to 100'); $set['km_free'] = $v; }
    if (!$partial || array_key_exists('color', $b)) {
        $c = isset($b['color']) && is_string($b['color']) ? trim($b['color']) : '';
        if ($c !== '' && !preg_match('/^#[0-9a-fA-F]{6}$/', $c)) fail(400, 'Colour must look like #4a52c8', 'color');
        $set['color'] = $c !== '' ? strtolower($c) : null;
    }
    return $set;
}

function h_admin_zones() {
    require_admin();
    $rows = db_rows('SELECT * FROM delivery_zones ORDER BY sort, id');
    json_out(['zones' => array_map('zone_row_out', $rows), 'meta' => ['def' => loc_default_fee(), 'free' => loc_free(), 'eta_def' => delivery_eta_default(),
              'pay_def' => rider_pay_default(), 'max_points' => ZONE_MAX_POINTS, 'colors' => ZONE_COLORS, 'centers' => [['id' => 'dhaka', 'lat' => 23.8103, 'lng' => 90.4125], ['id' => 'kishoreganj', 'lat' => 24.4449, 'lng' => 90.7766]]]]);
}

function h_admin_zone_create() {
    require_admin();
    $b = body_json();
    if ((int)db_val('SELECT COUNT(*) FROM delivery_zones') >= ZONE_MAX_ZONES) fail(400, 'Too many zones');
    $f = zone_fields_in($b, false);
    $poly = zone_poly_clean($b['poly'] ?? null);
    if (db_val('SELECT 1 FROM delivery_zones WHERE LOWER(name)=LOWER(?) LIMIT 1', [$f['name']])) fail(409, 'A zone with this name already exists', 'name');
    $now = now_ts();
    $sort = (int)db_val('SELECT COALESCE(MAX(sort),0)+1 FROM delivery_zones');
    q('INSERT INTO delivery_zones (name,bn,active,poly,area_km2,fee,eta,rider_pay,min_order,free_over,per_km,km_free,color,sort,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [$f['name'], $f['bn'], $f['active'], json_encode($poly), round(zone_area_km2($poly), 4), $f['fee'], $f['eta'], $f['rider_pay'], $f['min_order'], $f['free_over'], $f['per_km'], $f['km_free'], $f['color'], $sort, $now, $now]);
    $id = (int)db()->lastInsertId();
    json_out(['zone' => zone_row_out(db_row('SELECT * FROM delivery_zones WHERE id=?', [$id]))], 201);
}

function h_admin_zone_update($id) {
    require_admin();
    $r = db_row('SELECT * FROM delivery_zones WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Zone not found');
    $b = body_json();
    $f = zone_fields_in($b, true);
    if (isset($f['name']) && db_val('SELECT 1 FROM delivery_zones WHERE id<>? AND LOWER(name)=LOWER(?) LIMIT 1', [(int)$id, $f['name']])) fail(409, 'A zone with this name already exists', 'name');
    if (array_key_exists('poly', $b)) { $poly = zone_poly_clean($b['poly']); $f['poly'] = json_encode($poly); $f['area_km2'] = round(zone_area_km2($poly), 4); }
    if ($f) {
        $f['updated_at'] = now_ts();
        $set = []; $par = [];
        foreach ($f as $k => $v) { $set[] = "$k=?"; $par[] = $v; }
        $par[] = (int)$id;
        q('UPDATE delivery_zones SET ' . implode(',', $set) . ' WHERE id=?', $par);
    }
    json_out(['zone' => zone_row_out(db_row('SELECT * FROM delivery_zones WHERE id=?', [(int)$id]))]);
}

function h_admin_zone_delete($id) {
    require_admin();
    if (!db_row('SELECT id FROM delivery_zones WHERE id=?', [(int)$id])) fail(404, 'Zone not found');
    q('DELETE FROM delivery_zones WHERE id=?', [(int)$id]);
    json_out(['ok' => true]);
}

/** POST /admin/zones/test {lat,lng} : which zone would serve this pin right now? */
function h_admin_zone_test() {
    require_admin();
    $b = body_json();
    if (!isset($b['lat'], $b['lng']) || !is_num($b['lat']) || !is_num($b['lng'])) fail(400, 'lat and lng are required');
    $z = zone_find((float)$b['lat'], (float)$b['lng']);
    json_out(['zones_mode' => zones_mode(), 'zone' => $z ? zone_public($z) : null]);
}
