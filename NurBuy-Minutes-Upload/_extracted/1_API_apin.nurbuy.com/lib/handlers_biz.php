<?php
/* NurBuy business data: product commission, revenue, order/visitor analytics, Minutes service areas. */
if (!defined('NB')) { http_response_code(403); exit; }

/* ================= commission ================= */

/** Commission % for one order line: product rate set by admin, else the seller's rate, else the store default. */
function seller_line_pct($s, $pid) {
    if ($pid) {
        $v = db_val('SELECT com_pct FROM seller_products WHERE id=?', [(int)$pid]);
        if ($v !== null && $v !== '') return max(0.0, min(100.0, (float)$v));
    }
    return seller_com_pct($s);
}
function com_pct_in($v) {
    if ($v === null || $v === '') return null;
    if (!is_num($v) || (float)$v < 0 || (float)$v > 100) fail(400, 'Commission must be 0 to 100', 'com_pct');
    return round((float)$v, 2);
}

/* ================= date ranges ================= */

function biz_day($ts) { return strtotime(date('Y-m-d', $ts) . ' 00:00:00'); }
/** Named periods in the store's time zone: [from, to) unix seconds. Weeks start on Saturday. */
function biz_periods() {
    $n = now_ts(); $d0 = biz_day($n); $d1 = strtotime('+1 day', $d0);
    $sinceSat = ((int)date('w', $d0) + 1) % 7;
    $m0 = strtotime(date('Y-m-01 00:00:00', $n));
    $lm0 = strtotime(date('Y-m-01 00:00:00', $m0 - 1));
    return ['today' => [$d0, $d1], 'yesterday' => [strtotime('-1 day', $d0), $d0], 'last7' => [strtotime('-6 days', $d0), $d1],
            'week' => [strtotime("-$sinceSat days", $d0), $d1], 'last30' => [strtotime('-29 days', $d0), $d1], 'month' => [$m0, $d1],
            'lastmonth' => [$lm0, $m0], 'year' => [strtotime(date('Y-01-01 00:00:00', $n)), $d1]];
}
/** ?from=YYYY-MM-DD&to=YYYY-MM-DD (both days included). Default: last 30 days. */
function biz_range() {
    $f = (string)($_GET['from'] ?? ''); $t = (string)($_GET['to'] ?? '');
    $ok = function ($s) { return preg_match('/^\d{4}-\d{2}-\d{2}$/', $s) && strtotime($s . ' 00:00:00') !== false; };
    if (!$ok($f) || !$ok($t)) return biz_periods()['last30'];
    $a = strtotime($f . ' 00:00:00'); $b = strtotime('+1 day', strtotime($t . ' 00:00:00'));
    if ($b <= $a) fail(400, 'The end date must be after the start date', 'to');
    if ($b - $a > 3700 * 86400) fail(400, 'Choose a range of 10 years or less', 'from');
    return [$a, $b];
}
// SQL note: COALESCE() has no column type in SQLite, so date bounds are written ?+0 there to compare as numbers.
function biz_page() { $p = max(1, (int)($_GET['page'] ?? 1)); return [$p, 50, ($p - 1) * 50]; }

/* ================= revenue ================= */

/** Revenue that was earned in [a, b): commission when the order was delivered, delivery and COD charges on delivery. */
function biz_rev($a, $b) {
    $c = db_row("SELECT COALESCE(SUM(commission),0) c, COUNT(*) n FROM seller_earnings WHERE status='available' AND cleared_at>=? AND cleared_at<?", [$a, $b]);
    $d = db_row("SELECT COALESCE(SUM(fee),0) f, COALESCE(SUM(cod),0) cod, COUNT(*) n FROM orders WHERE status='Delivered' AND delivered_at>=? AND delivered_at<?", [$a, $b]);
    $com = money($c['c']); $fee = money($d['f']); $cod = money($d['cod']);
    return ['commission' => $com, 'delivery' => $fee, 'cod' => $cod, 'total' => money($com + $fee + $cod), 'com_lines' => (int)$c['n'], 'orders' => (int)$d['n']];
}
function h_admin_biz_revenue() {
    require_admin();
    list($a, $b) = biz_range();
    $per = [];
    foreach (biz_periods() as $k => $p) $per[$k] = biz_rev($p[0], $p[1]);
    $all = biz_rev(0, PHP_INT_MAX);
    $pc = db_row("SELECT COALESCE(SUM(commission),0) c FROM seller_earnings WHERE status='pending'");
    $pd = db_row("SELECT COALESCE(SUM(fee),0) f, COALESCE(SUM(cod),0) cod FROM orders WHERE status NOT IN ('Delivered','Cancelled','Returned')");
    $days = [];
    if ($b - $a <= 400 * 86400) {
        for ($t = $a; $t < $b; $t = strtotime('+1 day', $t)) $days[date('Y-m-d', $t)] = ['d' => date('Y-m-d', $t), 'commission' => 0.0, 'delivery' => 0.0, 'cod' => 0.0];
        foreach (db_rows("SELECT cleared_at t, commission FROM seller_earnings WHERE status='available' AND cleared_at>=? AND cleared_at<?", [$a, $b]) as $r) {
            $k = date('Y-m-d', (int)$r['t']); if (isset($days[$k])) $days[$k]['commission'] = money($days[$k]['commission'] + $r['commission']);
        }
        foreach (db_rows("SELECT delivered_at t, fee, cod FROM orders WHERE status='Delivered' AND delivered_at>=? AND delivered_at<?", [$a, $b]) as $r) {
            $k = date('Y-m-d', (int)$r['t']);
            if (isset($days[$k])) { $days[$k]['delivery'] = money($days[$k]['delivery'] + $r['fee']); $days[$k]['cod'] = money($days[$k]['cod'] + $r['cod']); }
        }
    }
    json_out(['periods' => $per, 'all' => $all, 'range' => biz_rev($a, $b) + ['from' => date('Y-m-d', $a), 'to' => date('Y-m-d', $b - 1)],
              'pending' => ['commission' => money($pc['c']), 'delivery' => money($pd['f']), 'cod' => money($pd['cod'])], 'daily' => array_values($days)]);
}

function biz_com_status($r) { return $r['status'] === 'available' ? 'earned' : ($r['status'] === 'pending' ? 'pending' : 'cancelled'); }
function biz_com_row($r) {
    return ['tx' => 'NBC-' . str_pad((string)$r['id'], 6, '0', STR_PAD_LEFT), 'id' => (int)$r['id'], 'order_id' => $r['order_id'], 'shop' => $r['shop_name'] ?? '', 'seller_id' => (int)$r['seller_id'],
            'product' => $r['pname'], 'product_id' => $r['product_id'] === null ? null : (int)$r['product_id'], 'variant' => $r['variant'], 'qty' => (int)$r['qty'], 'unit' => money($r['unit']),
            'sale' => money($r['sale']), 'disc' => money($r['disc']), 'com_pct' => (float)$r['com_pct'], 'commission' => money($r['commission']), 'net' => money($r['net']),
            'status' => biz_com_status($r), 'order_status' => $r['ostatus'] ?? null, 'order_at' => (int)$r['order_at'], 'earned_at' => $r['cleared_at'] === null ? null : (int)$r['cleared_at']];
}
/** Commission list. Date = day it was earned (delivered) or, until then, the order day. */
function h_admin_biz_commissions() {
    require_admin();
    list($a, $b) = biz_range(); list($pg, $lim, $off) = biz_page();
    $w = ['COALESCE(e.cleared_at, e.order_at)>=?+0', 'COALESCE(e.cleared_at, e.order_at)<?+0']; $p = [$a, $b];
    $st = (string)($_GET['status'] ?? 'all');
    if ($st === 'earned') $w[] = "e.status='available'"; elseif ($st === 'pending') $w[] = "e.status='pending'"; elseif ($st === 'cancelled') $w[] = "e.status='cancelled'";
    $qs = trim((string)($_GET['q'] ?? ''));
    if ($qs !== '') { $w[] = '(e.order_id LIKE ? OR e.pname LIKE ? OR s.shop_name LIKE ?)'; $l = '%' . $qs . '%'; array_push($p, $l, $l, $l); }
    $sql = ' FROM seller_earnings e LEFT JOIN sellers s ON s.id=e.seller_id LEFT JOIN orders o ON o.id=e.order_id WHERE ' . implode(' AND ', $w);
    $tot = db_row("SELECT COUNT(*) n, COALESCE(SUM(e.sale-e.disc),0) sales, COALESCE(SUM(CASE WHEN e.status='available' THEN e.commission ELSE 0 END),0) earned,
                   COALESCE(SUM(CASE WHEN e.status='pending' THEN e.commission ELSE 0 END),0) pend" . $sql, $p);
    $rows = db_rows('SELECT e.*, s.shop_name, o.status ostatus' . $sql . " ORDER BY COALESCE(e.cleared_at, e.order_at) DESC, e.id DESC LIMIT $lim OFFSET $off", $p);
    json_out(['items' => array_map('biz_com_row', $rows), 'total' => (int)$tot['n'], 'page' => $pg, 'per' => $lim,
              'sum' => ['sales' => money($tot['sales']), 'earned' => money($tot['earned']), 'pending' => money($tot['pend'])]]);
}

function biz_shop_of_order($o) {
    if (!empty($o['shop'])) return $o['shop'];
    $it = json_decode((string)$o['items'], true);
    return (is_array($it) && isset($it[0]['shop'])) ? (string)$it[0]['shop'] : '';
}
function biz_del_status($o) { return $o['status'] === 'Delivered' ? 'earned' : (in_array($o['status'], ['Cancelled', 'Returned'], true) ? 'cancelled' : 'pending'); }
function biz_del_row($o) {
    return ['tx' => 'NBD-' . $o['id'], 'order_id' => $o['id'], 'shop' => biz_shop_of_order($o), 'customer' => $o['name'], 'mobile' => $o['mobile'], 'view' => $o['view'],
            'fee' => money($o['fee']), 'cod' => money($o['cod']), 'pay' => $o['pay'], 'order_status' => $o['status'], 'status' => biz_del_status($o),
            'order_at' => (int)$o['created_at'], 'delivered_at' => $o['delivered_at'] === null ? null : (int)$o['delivered_at'],
            'rider' => $o['rn'] ?? null, 'rider_mobile' => $o['rm'] ?? null];
}
/** Delivery charge list. Date = delivery day or, until delivered, the order day. */
function h_admin_biz_delivery() {
    require_admin();
    list($a, $b) = biz_range(); list($pg, $lim, $off) = biz_page();
    $w = ['(o.fee>0 OR o.cod>0)', 'COALESCE(o.delivered_at, o.created_at)>=?+0', 'COALESCE(o.delivered_at, o.created_at)<?+0']; $p = [$a, $b];
    $st = (string)($_GET['status'] ?? 'all');
    if ($st === 'earned') $w[] = "o.status='Delivered'"; elseif ($st === 'pending') $w[] = "o.status NOT IN ('Delivered','Cancelled','Returned')"; elseif ($st === 'cancelled') $w[] = "o.status IN ('Cancelled','Returned')";
    $qs = trim((string)($_GET['q'] ?? ''));
    if ($qs !== '') { $w[] = '(o.id LIKE ? OR o.name LIKE ? OR o.mobile LIKE ? OR o.shop LIKE ?)'; $l = '%' . $qs . '%'; array_push($p, $l, $l, $l, $l); }
    $sql = ' FROM orders o LEFT JOIN deliveries d ON d.order_id=o.id LEFT JOIN riders r ON r.id=d.rider_id WHERE ' . implode(' AND ', $w);
    $tot = db_row("SELECT COUNT(*) n, COALESCE(SUM(CASE WHEN o.status='Delivered' THEN o.fee ELSE 0 END),0) fe, COALESCE(SUM(CASE WHEN o.status='Delivered' THEN o.cod ELSE 0 END),0) ce,
                   COALESCE(SUM(CASE WHEN o.status NOT IN ('Delivered','Cancelled','Returned') THEN o.fee+o.cod ELSE 0 END),0) pend" . $sql, $p);
    $rows = db_rows('SELECT o.*, r.name rn, r.mobile rm' . $sql . " ORDER BY COALESCE(o.delivered_at, o.created_at) DESC LIMIT $lim OFFSET $off", $p);
    json_out(['items' => array_map('biz_del_row', $rows), 'total' => (int)$tot['n'], 'page' => $pg, 'per' => $lim,
              'sum' => ['delivery' => money($tot['fe']), 'cod' => money($tot['ce']), 'pending' => money($tot['pend'])]]);
}

/** Shop -> product: orders, units, sales, commission rate(s), what NurBuy earned (cancelled lines left out). */
function h_admin_biz_shops() {
    require_admin();
    list($a, $b) = biz_range();
    $rows = db_rows("SELECT e.seller_id, s.shop_name, e.product_id, e.pname, COUNT(DISTINCT e.order_id) orders, SUM(e.qty) qty, SUM(e.sale-e.disc) sales,
                     MIN(e.com_pct) pmin, MAX(e.com_pct) pmax, SUM(CASE WHEN e.status='available' THEN e.commission ELSE 0 END) earned,
                     SUM(CASE WHEN e.status='pending' THEN e.commission ELSE 0 END) pend
                     FROM seller_earnings e LEFT JOIN sellers s ON s.id=e.seller_id
                     WHERE e.status<>'cancelled' AND COALESCE(e.cleared_at, e.order_at)>=?+0 AND COALESCE(e.cleared_at, e.order_at)<?+0
                     GROUP BY e.seller_id, s.shop_name, e.product_id, e.pname ORDER BY s.shop_name, earned DESC", [$a, $b]);
    $shops = [];
    foreach ($rows as $r) {
        $k = (int)$r['seller_id'];
        if (!isset($shops[$k])) $shops[$k] = ['seller_id' => $k, 'shop' => $r['shop_name'] ?? '', 'orders' => 0, 'qty' => 0, 'sales' => 0.0, 'earned' => 0.0, 'pending' => 0.0, 'products' => [], 'oids' => []];
        $shops[$k]['products'][] = ['product_id' => $r['product_id'] === null ? null : (int)$r['product_id'], 'product' => $r['pname'], 'orders' => (int)$r['orders'], 'qty' => (int)$r['qty'],
                                    'sales' => money($r['sales']), 'pct_min' => (float)$r['pmin'], 'pct_max' => (float)$r['pmax'], 'earned' => money($r['earned']), 'pending' => money($r['pend'])];
        $shops[$k]['qty'] += (int)$r['qty']; $shops[$k]['sales'] = money($shops[$k]['sales'] + $r['sales']);
        $shops[$k]['earned'] = money($shops[$k]['earned'] + $r['earned']); $shops[$k]['pending'] = money($shops[$k]['pending'] + $r['pend']);
    }
    foreach (db_rows("SELECT seller_id, COUNT(DISTINCT order_id) n FROM seller_earnings WHERE status<>'cancelled' AND COALESCE(cleared_at, order_at)>=?+0 AND COALESCE(cleared_at, order_at)<?+0 GROUP BY seller_id", [$a, $b]) as $r)
        if (isset($shops[(int)$r['seller_id']])) $shops[(int)$r['seller_id']]['orders'] = (int)$r['n'];
    $out = array_values(array_map(function ($s) { unset($s['oids']); return $s; }, $shops));
    usort($out, function ($x, $y) { return $y['earned'] <=> $x['earned'] ?: $y['sales'] <=> $x['sales']; });
    json_out(['shops' => $out, 'from' => date('Y-m-d', $a), 'to' => date('Y-m-d', $b - 1)]);
}

/** All revenue transactions (commission lines and delivery charges) in one list. */
function h_admin_biz_tx() {
    require_admin();
    list($a, $b) = biz_range(); list($pg, $lim, $off) = biz_page();
    $type = (string)($_GET['type'] ?? 'all');
    $items = [];
    if ($type !== 'delivery') foreach (db_rows("SELECT e.*, s.shop_name, o.status ostatus, o.name cname, o.pay FROM seller_earnings e LEFT JOIN sellers s ON s.id=e.seller_id LEFT JOIN orders o ON o.id=e.order_id
                                                WHERE COALESCE(e.cleared_at, e.order_at)>=?+0 AND COALESCE(e.cleared_at, e.order_at)<?+0", [$a, $b]) as $r) {
        $x = biz_com_row($r); $items[] = ['type' => 'commission', 'tx' => $x['tx'], 'order_id' => $x['order_id'], 'shop' => $x['shop'], 'product' => $x['product'], 'customer' => $r['cname'],
                                          'amount' => $x['commission'], 'base' => money($x['sale'] - $x['disc']), 'pct' => $x['com_pct'], 'pay' => $r['pay'], 'status' => $x['status'], 't' => $x['earned_at'] ?? $x['order_at']];
    }
    if ($type !== 'commission') foreach (db_rows("SELECT * FROM orders WHERE (fee>0 OR cod>0) AND COALESCE(delivered_at, created_at)>=?+0 AND COALESCE(delivered_at, created_at)<?+0", [$a, $b]) as $o) {
        $items[] = ['type' => 'delivery', 'tx' => 'NBD-' . $o['id'], 'order_id' => $o['id'], 'shop' => biz_shop_of_order($o), 'product' => null, 'customer' => $o['name'],
                    'amount' => money($o['fee'] + $o['cod']), 'base' => money($o['fee']), 'pct' => null, 'pay' => $o['pay'], 'status' => biz_del_status($o), 't' => (int)($o['delivered_at'] ?? $o['created_at'])];
    }
    $qs = mb_strtolower(trim((string)($_GET['q'] ?? '')));
    if ($qs !== '') $items = array_values(array_filter($items, function ($x) use ($qs) { return mb_strpos(mb_strtolower($x['tx'] . ' ' . $x['order_id'] . ' ' . $x['shop'] . ' ' . $x['product'] . ' ' . $x['customer']), $qs) !== false; }));
    usort($items, function ($x, $y) { return $y['t'] <=> $x['t'] ?: strcmp($y['tx'], $x['tx']); });
    json_out(['items' => array_slice($items, $off, $lim), 'total' => count($items), 'page' => $pg, 'per' => $lim]);
}
/** One transaction with everything an invoice needs. */
function h_admin_biz_tx_get($tx) {
    require_admin();
    if (preg_match('/^NBC-0*(\d+)$/', $tx, $m)) {
        $r = db_row('SELECT e.*, s.shop_name, s.owner_name, s.mobile smobile, s.address saddr FROM seller_earnings e LEFT JOIN sellers s ON s.id=e.seller_id WHERE e.id=?', [(int)$m[1]]);
        if (!$r) fail(404, 'Transaction not found');
        $o = db_row('SELECT * FROM orders WHERE id=?', [$r['order_id']]);
        json_out(['type' => 'commission', 'tx' => biz_com_row($r + ['ostatus' => $o['status'] ?? null]), 'invoice' => 'INV-C-' . str_pad((string)$r['id'], 6, '0', STR_PAD_LEFT),
                  'seller' => ['shop' => $r['shop_name'], 'owner' => $r['owner_name'], 'mobile' => $r['smobile'], 'address' => $r['saddr']],
                  'order' => $o ? ['id' => $o['id'], 'status' => $o['status'], 'pay' => $o['pay'], 'customer' => $o['name'], 'mobile' => $o['mobile'], 'address' => $o['address'], 'created_at' => (int)$o['created_at'], 'delivered_at' => $o['delivered_at'] === null ? null : (int)$o['delivered_at']] : null]);
    }
    if (preg_match('/^NBD-(.{1,40})$/', $tx, $m)) {
        $o = db_row('SELECT o.*, r.name rn, r.mobile rm FROM orders o LEFT JOIN deliveries d ON d.order_id=o.id LEFT JOIN riders r ON r.id=d.rider_id WHERE o.id=?', [$m[1]]);
        if (!$o) fail(404, 'Transaction not found');
        json_out(['type' => 'delivery', 'tx' => biz_del_row($o), 'invoice' => 'INV-D-' . $o['id'],
                  'order' => ['id' => $o['id'], 'status' => $o['status'], 'pay' => $o['pay'], 'customer' => $o['name'], 'mobile' => $o['mobile'], 'address' => $o['address'],
                              'sub' => money($o['sub']), 'disc' => money($o['disc']), 'total' => money($o['total']), 'created_at' => (int)$o['created_at'], 'delivered_at' => $o['delivered_at'] === null ? null : (int)$o['delivered_at']]]);
    }
    fail(404, 'Transaction not found');
}

/* ================= analytics ================= */

function biz_visitors($a, $b) { return (int)db_val("SELECT COUNT(DISTINCT vid) FROM an_events WHERE ev='visit' AND created_at>=? AND created_at<?", [$a, $b]); }
function biz_buyers($a, $b) { return (int)db_val('SELECT COUNT(DISTINCT mobile) FROM orders WHERE created_at>=? AND created_at<?', [$a, $b]); }
function biz_funnel($a, $b) {
    $ev = [];
    foreach (db_rows('SELECT ev, COUNT(DISTINCT vid) n FROM an_events WHERE created_at>=? AND created_at<? GROUP BY ev', [$a, $b]) as $r) $ev[$r['ev']] = (int)$r['n'];
    $vis = $ev['visit'] ?? 0; $buy = biz_buyers($a, $b);
    $new = (int)db_val("SELECT COUNT(*) FROM an_visitors WHERE first_at>=? AND first_at<?", [$a, $b]);
    return ['visitors' => $vis, 'new' => min($vis, $new), 'returning' => max(0, $vis - $new), 'viewed' => $ev['view'] ?? 0, 'carted' => $ev['cart'] ?? 0, 'checkout' => $ev['checkout'] ?? 0,
            'signups' => (int)db_val('SELECT COUNT(*) FROM users WHERE created_at>=? AND created_at<?', [$a, $b]),
            'ordered' => $buy, 'orders' => (int)db_val('SELECT COUNT(*) FROM orders WHERE created_at>=? AND created_at<?', [$a, $b]),
            'purchased' => (int)db_val("SELECT COUNT(DISTINCT mobile) FROM orders WHERE status='Delivered' AND created_at>=? AND created_at<?", [$a, $b]),
            'cancelled' => (int)db_val("SELECT COUNT(*) FROM orders WHERE status IN ('Cancelled','Returned') AND created_at>=? AND created_at<?", [$a, $b]),
            'conversion' => $vis > 0 ? round($buy * 100 / $vis, 2) : 0.0];
}
function biz_orders($a, $b) {
    $r = db_row("SELECT COUNT(*) n, COALESCE(SUM(CASE WHEN status NOT IN ('Cancelled','Returned') THEN sub-disc ELSE 0 END),0) sales FROM orders WHERE created_at>=? AND created_at<?", [$a, $b]);
    return ['orders' => (int)$r['n'], 'sales' => money($r['sales'])];
}
/** Everything the dashboard and the analytics page show, for named periods and the chosen range. */
function h_admin_biz_stats() {
    require_admin();
    list($a, $b) = biz_range();
    $P = biz_periods(); $per = [];
    foreach ($P as $k => $p) $per[$k] = biz_orders($p[0], $p[1]) + ['visitors' => biz_visitors($p[0], $p[1]), 'buyers' => biz_buyers($p[0], $p[1])];
    $byStatus = []; foreach (db_rows('SELECT status, COUNT(*) n FROM orders GROUP BY status') as $r) $byStatus[$r['status']] = (int)$r['n'];
    $rangeStatus = []; foreach (db_rows('SELECT status, COUNT(*) n FROM orders WHERE created_at>=? AND created_at<? GROUP BY status', [$a, $b]) as $r) $rangeStatus[$r['status']] = (int)$r['n'];
    $sp = []; foreach (db_rows('SELECT status, COUNT(*) n FROM seller_products GROUP BY status') as $r) $sp[$r['status']] = (int)$r['n'];
    $spEdits = (int)db_val("SELECT COUNT(*) FROM seller_products WHERE status='active' AND chg IS NOT NULL");
    list($D) = admin_state(); $own = (isset($D['products']) && is_array($D['products'])) ? $D['products'] : [];
    $ownActive = count(array_filter($own, function ($p) { return is_array($p) && strcasecmp((string)($p['status'] ?? ''), 'Active') === 0; }));
    $sl = []; foreach (db_rows('SELECT status, COUNT(*) n FROM sellers GROUP BY status') as $r) $sl[$r['status']] = (int)$r['n'];
    $t = now_ts();
    $days = [];
    if ($b - $a <= 400 * 86400) {
        for ($d = $a; $d < $b; $d = strtotime('+1 day', $d)) $days[date('Y-m-d', $d)] = ['d' => date('Y-m-d', $d), 'orders' => 0, 'sales' => 0.0, 'visitors' => 0];
        foreach (db_rows('SELECT created_at, status, sub, disc FROM orders WHERE created_at>=? AND created_at<?', [$a, $b]) as $r) {
            $k = date('Y-m-d', (int)$r['created_at']); if (!isset($days[$k])) continue;
            $days[$k]['orders']++;
            if (!in_array($r['status'], ['Cancelled', 'Returned'], true)) $days[$k]['sales'] = money($days[$k]['sales'] + $r['sub'] - $r['disc']);
        }
        $seen = [];
        foreach (db_rows("SELECT vid, created_at FROM an_events WHERE ev='visit' AND created_at>=? AND created_at<?", [$a, $b]) as $r) {
            $k = date('Y-m-d', (int)$r['created_at']); if (!isset($days[$k]) || isset($seen[$k . $r['vid']])) continue;
            $seen[$k . $r['vid']] = 1; $days[$k]['visitors']++;
        }
    }
    json_out([
        'daily' => array_values($days),
        'periods' => $per, 'all' => biz_orders(0, PHP_INT_MAX), 'status' => $byStatus,
        'range' => biz_orders($a, $b) + ['status' => $rangeStatus, 'from' => date('Y-m-d', $a), 'to' => date('Y-m-d', $b - 1)],
        'funnel' => biz_funnel($a, $b), 'today' => biz_funnel($P['today'][0], $P['today'][1]),
        'live' => (int)db_val('SELECT COUNT(*) FROM an_visitors WHERE last_at>=?', [$t - 300]),
        'customers' => ['total' => (int)db_val('SELECT COUNT(*) FROM users'), 'new' => (int)db_val('SELECT COUNT(*) FROM users WHERE created_at>=? AND created_at<?', [$a, $b]),
                        'active' => biz_buyers($a, $b)],
        'sellers' => ['total' => array_sum($sl), 'active' => $sl['approved'] ?? 0, 'pending' => $sl['pending'] ?? 0],
        'products' => ['total' => array_sum($sp) + count($own), 'pending' => ($sp['pending'] ?? 0), 'edits' => $spEdits, 'approved' => ($sp['active'] ?? 0) + $ownActive, 'rejected' => $sp['rejected'] ?? 0,
                       'own' => count($own), 'seller' => array_sum($sp)],
    ]);
}
