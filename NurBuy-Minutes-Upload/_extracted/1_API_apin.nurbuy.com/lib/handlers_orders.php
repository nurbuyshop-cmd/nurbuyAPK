<?php
if (!defined('NB')) { http_response_code(403); exit; }

function h_order_create() {
    $b = body_json();
    $pay = $b['pay'] ?? 'cod';
    if (!in_array($pay, ['cod', 'online', 'wallet'], true)) fail(400, 'Invalid payment method', 'pay');

    $rawItems = $b['items'] ?? null;
    if (!is_array($rawItems) || count($rawItems) < 1 || count($rawItems) > 50) fail(400, 'Between 1 and 50 items are required', 'items');
    $items = []; $sub = 0.0;
    foreach ($rawItems as $it) {
        if (!is_array($it)) fail(400, 'Invalid item', 'items');
        $n = clean_str($it['n'] ?? '', 200);
        if ($n === '') fail(400, 'Item name is required', 'items');
        if (!isset($it['unit']) || !is_num($it['unit'])) fail(400, 'Item price is invalid', 'items');
        if (!isset($it['q']) || !is_num($it['q']) || (float)$it['q'] != floor((float)$it['q']) || (int)$it['q'] < 1 || (int)$it['q'] > 99) fail(400, 'Item quantity must be 1 to 99', 'items');
        $unit = max(0.0, money($it['unit']));
        $q = (int)$it['q'];
        $row = ['n' => $n, 'unit' => $unit, 'q' => $q];
        foreach (['id', 'bn', 'e', 'shop', 'variant', 'vid'] as $k) {
            if (isset($it[$k]) && (is_string($it[$k]) || is_numeric($it[$k]))) $row[$k] = clean_str($it[$k], 2000);
        }
        $items[] = $row;
        $sub += $unit * $q;
    }
    $sub = money($sub);
    $locId = (isset($b['loc_id']) && is_num($b['loc_id']) && (int)$b['loc_id'] > 0) ? (int)$b['loc_id'] : 0;
    // NurBuy Minutes serves only the areas the admin switched on: the customer must pick one
    // (when delivery zones are drawn, the map pin decides the area instead: see below)
    $zoneMode = zones_mode();
    if (!$locId && !$zoneMode) { loc_seed_safe(); $lp = loc_public(); if (!empty($lp['d'])) fail(400, 'Choose your delivery area (district, thana and village)', 'loc_id', 'loc_required'); }
    $name = clean_str($b['name'] ?? '', 100);
    $mobile = normalize_mobile($b['mobile'] ?? '');
    $address = clean_str($b['address'] ?? '', 500);
    $email = strtolower(clean_str($b['email'] ?? '', 190));
    if (!valid_mobile($mobile)) fail(400, 'Enter a valid mobile number (01XXXXXXXXX)', 'mobile');
    if ($address === '') fail(400, 'Address is required', 'address');
    if ($email !== '' && !valid_email($email)) fail(400, 'Enter a valid email address', 'email');
    $extra = $b['extra'] ?? [];
    if (!is_array($extra)) fail(400, 'extra must be an object', 'extra');
    if (strlen(json_encode($extra, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) > 200000) fail(400, 'extra too large', 'extra');
    unset($extra['area'], $extra['multi'], $extra['eta_max'], $extra['rider_pay'], $extra['loc_id'], $extra['zone'], $extra['refunded'], $extra['stock_restored']);
    // map pin chosen by the customer: keep only clean fields, and give the rider the plain "lat,lng" text
    if (isset($extra['geo'])) {
        $g = geo_clean($extra['geo']);
        if ($g) { $extra['geo'] = $g; $extra['loc'] = geo_loc_text($g); } else unset($extra['geo']);
    }
    // delivery zones: a Minutes order needs a pin, and the pin must be inside an active zone
    $zone = null;
    if ($zoneMode) {
        if (empty($extra['geo'])) fail(400, 'Pin your delivery location on the map', 'geo', 'pin_required');
        $zone = zone_find($extra['geo']['lat'], $extra['geo']['lng']);
        if (!$zone) fail(409, 'We do not deliver to this location yet', 'geo', 'outside_zone');
        if ($zone['min_order'] !== null && $sub < (float)$zone['min_order']) fail(409, 'The minimum order for ' . $zone['name'] . ' is ' . money($zone['min_order']), 'items', 'min_order');
    }
    $shop = isset($b['shop']) && is_string($b['shop']) && trim($b['shop']) !== '' ? clean_str($b['shop'], 190) : (isset($items[0]['shop']) ? clean_str($items[0]['shop'], 190) : null);

    $user = optional_user();
    if (!$user) fail(401, 'Login required to place an order', null, 'login_required');
    block_ip_check();
    rl_hit('ord:' . $user['id'], 20, 3600);
    $codFee = $pay === 'cod' ? max(0.0, money(state_setting('codFee', 10))) : 0.0;
    $coupon = (isset($b['coupon']) && is_string($b['coupon']) && trim($b['coupon']) !== '') ? $b['coupon'] : null;
    $pct = (float)state_setting('walletPct', 1);
    if ($pct < 0) $pct = 0.0;

    $res = db_tx(function () use ($pay, $items, $sub, $codFee, $name, $mobile, $address, $email, $extra, $shop, $user, $pct, $coupon, $locId, $zone) {
        // prices, variants, stock, order limits and opening hours are checked against the database
        list($items, $nShops, $shop0) = order_check_items($items);
        if ($shop0 !== null) $shop = $shop0;
        seller_check_variant_items($items);
        // delivery charge comes from the chosen delivery area (village/area)
        $base = loc_default_fee();
        if ($locId) {
            list($area, $base) = loc_resolve($locId); $extra['area'] = $area;
            foreach (order_item_sellers() as $sx) {
                if (!$sx) continue;
                $cv = coverage_parse($sx['coverage'] ?? null);
                if ($cv && !coverage_reaches($cv, $locId)) fail(409, $sx['shop_name'] . ' does not deliver to your area. Please remove its products or choose another area.', 'items', 'shop_no_delivery');
            }
        }
        // a delivery zone (when the pin is inside one) sets the charge: its own charge, free-delivery amount and per-km distance charge
        $fee = $zone ? zone_quote($zone, $base, $sub, $nShops, $extra['geo'], zone_shop_points($items))['fee'] : loc_fee($base, $sub, $nShops);
        // the zone's (or village's) own delivery time and rider payment are fixed on the order when it is placed
        $di = loc_delivery_info($locId);
        if ($zone) {
            $di['eta'] = zone_eta($zone, $di['eta']); $di['rider_pay'] = zone_rider_pay($zone, $di['rider_pay']);
            $extra['zone'] = ['id' => $zone['id'], 'n' => $zone['name'], 'bn' => $zone['bn'] ?: $zone['name']];
            if (!$locId) $extra['area'] = [['id' => 0, 'n' => $zone['name'], 'bn' => $zone['bn'] ?: $zone['name']]];
        }
        $extra['eta_max'] = $di['eta']; if ($locId) $extra['loc_id'] = $locId;
        if ($di['rider_pay'] !== null) $extra['rider_pay'] = $di['rider_pay'];
        if ($nShops > 1) $extra['multi'] = $nShops;
        $extraJson = json_encode(empty($extra) ? new stdClass() : $extra, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $total = money($sub + $fee + $codFee);
        $uid = $user['id'];
        // unique order id
        for ($i = 0; ; $i++) {
            $oid = 'NBM-' . rand_digits(6);
            if (!db_val('SELECT 1 FROM orders WHERE id=?', [$oid])) break;
            if ($i > 20) fail(500, 'Could not allocate order id');
        }
        $disc = 0.0; $cpCode = null;
        if ($coupon !== null) {
            list($disc, $cpCode) = coupon_apply_to_order($coupon, $items, $uid, $oid);
            $total = money($sub - $disc + $fee + $codFee);
        }
        $paid = 0.0;
        if ($pay === 'wallet') {
            $paid = money($sub - $disc + $fee);
            if (!wallet_debit($uid, $paid)) fail(400, 'Insufficient wallet balance', null, 'insufficient_wallet');
            wallet_log($uid, 'pay', $paid, $oid);
            $total = $paid;
        }
        // bonus is only promised here; it reaches the wallet when the order is delivered (order_after_status)
        $cb = money(($sub - $disc) * $pct / 100);
        $t = now_ts();
        q('INSERT INTO orders (id,user_id,`view`,status,sub,fee,cod,total,pay,shop,veh,name,mobile,email,address,items,extra,cashback,paid_wallet,created_at,updated_at,disc,coupon,ip) VALUES (?,?,?,?,?,?,?,?,?,?,NULL,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [$oid, $uid, 'min', 'Pending', $sub, $fee, $codFee, $total, $pay, $shop,
           $name !== '' ? $name : $user['name'], $mobile, $email !== '' ? $email : null, $address,
           json_encode($items, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $extraJson, $cb, $paid, $t, $t, $disc, $cpCode, client_ip()]);
        seller_on_order_created($oid, $items);
        seller_earn_sync($oid);
        $order = db_row('SELECT * FROM orders WHERE id=?', [$oid]);
        $out = [
            'order' => order_out($order),
            'wallet' => ['bal' => wallet_bal($uid)],
            'cashback' => $cb, 'paid' => $paid,
        ];
        return $out;
    });
    json_out($res, 201);
}

/** Checks each line against the live catalog. Returns [items with server prices/shops, number of shops, first shop]. */
/** The seller rows of the items just checked (used to test shop delivery coverage against the chosen area). */
function order_item_sellers($set = null) { static $x = []; if ($set !== null) $x = $set; return $x; }
function order_check_items($items) {
    list($D) = admin_state();
    $state = [];
    if (isset($D['products']) && is_array($D['products'])) foreach ($D['products'] as $p) if (is_array($p) && isset($p['id']) && is_scalar($p['id'])) $state[(string)$p['id']] = $p;
    $sellers = []; $qty = []; $shops = []; $first = null;
    $bad = function ($msg, $code, $n) { fail(409, $msg . ': ' . $n, 'items', $code); };
    foreach ($items as $k => $it) {
        $id = isset($it['id']) ? (string)$it['id'] : '';
        $label = $it['n'];
        if (preg_match('/^SP(\d+)$/', $id, $m)) {
            $p = db_row('SELECT * FROM seller_products WHERE id=?' . lock_suffix(), [(int)$m[1]]);
            if (!$p || $p['status'] !== 'active' || (int)$p['hidden']) $bad('This product is no longer available', 'item_unavailable', $label);
            $sid = (int)$p['seller_id'];
            if (!isset($sellers[$sid])) $sellers[$sid] = db_row('SELECT * FROM sellers WHERE id=?', [$sid]);
            $s = $sellers[$sid];
            if (!$s || $s['status'] !== 'approved') $bad('This shop is not available', 'item_unavailable', $label);
            if ($p['v'] !== 'both' && $p['v'] !== 'min') $bad('This product is not sold here', 'item_unavailable', $label);
            if (!hours_open($s['hours'] ?? null)) fail(409, (seller_is_food($s) ? 'Restaurant is closed now' : 'Shop is closed now') . ': ' . $s['shop_name'], 'items', 'shop_closed');
            $vr = seller_vr_parse($p['vr'] ?? null);
            if ($vr) {
                $vid = isset($it['vid']) ? (string)$it['vid'] : '';
                $hit = null; foreach ($vr['v'] as $v) if ((string)$v['id'] === $vid && (int)($v['on'] ?? 1) === 1) $hit = $v;
                if ($vid === '' || !$hit) $bad('Choose an available option', 'variant_out_of_stock', $label);
                $price = money($hit['price']); $items[$k]['variant'] = clean_str($hit['name'], 150);
            } else { $price = money($p['price']); unset($items[$k]['vid'], $items[$k]['variant']); }
            if (abs($price - (float)$it['unit']) > 0.009) fail(409, 'The price of ' . $label . ' has changed to ' . $price . '. Please check your cart.', 'items', 'price_changed');
            $items[$k]['shop'] = $s['shop_name'];
            $pk = 'SP' . $p['id'];
            $qty[$pk] = ($qty[$pk] ?? 0) + (int)$it['q'];
            if ((int)$p['max_q'] > 0 && $qty[$pk] > (int)$p['max_q']) fail(409, 'You can order at most ' . (int)$p['max_q'] . ' of ' . $label, 'items', 'max_qty');
            if (!$vr && seller_stock_on($p) && $qty[$pk] > (int)$p['stock']) fail(409, ((int)$p['stock'] > 0 ? 'Only ' . (int)$p['stock'] . ' left of ' : 'Out of stock: ') . $label, 'items', 'out_of_stock');
            $sk = 's' . $sid;
        } elseif ($id !== '' && isset($state[$id])) {
            $p = $state[$id];
            if (strcasecmp((string)($p['status'] ?? ''), 'Active') !== 0) $bad('This product is no longer available', 'item_unavailable', $label);
            $price = is_num($p['pr'] ?? null) ? money($p['pr']) : 0.0;
            if (abs($price - (float)$it['unit']) > 0.009) fail(409, 'The price of ' . $label . ' has changed to ' . $price . '. Please check your cart.', 'items', 'price_changed');
            $sk = 'n' . mb_strtolower(trim((string)($it['shop'] ?? ($p['sh'] ?? ''))));
        } else $sk = 'n' . mb_strtolower(trim((string)($it['shop'] ?? '')));
        $shops[$sk] = true;
        if ($first === null && !empty($items[$k]['shop'])) $first = (string)$items[$k]['shop'];
    }
    order_item_sellers($sellers);
    return [$items, max(1, count($shops)), $first];
}

function h_orders_mine() {
    $u = require_user();
    $o = [];
    foreach (db_rows('SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC, id DESC LIMIT 100', [$u['id']]) as $r) $o[] = order_out($r);
    $dm = delivery_info_map(array_column($o, 'id'));
    foreach ($o as &$x) if (isset($dm[$x['id']])) $x['delivery'] = $dm[$x['id']];
    unset($x);
    json_out(['orders' => $o]);
}
