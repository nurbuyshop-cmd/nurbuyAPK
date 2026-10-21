<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * Seller wallet: earnings ledger, withdrawals (seller + admin side),
 * seller coupons (seller CRUD, public check, order hook).
 *
 * Money model (all amounts DECIMAL(12,2), never stored as a running balance):
 *   earned      = SUM(net) of seller_earnings with status 'available'  (order Delivered)
 *   pending     = SUM(net) of seller_earnings with status 'pending'    (order in progress)
 *   wd_pending  = SUM(amount) of withdrawals 'pending' or 'processing' (reserved)
 *   withdrawn   = SUM(amount) of withdrawals 'completed'
 *   available   = earned - wd_pending - withdrawn
 * A withdrawal request therefore reserves its amount immediately; cancelling it
 * returns the amount; completing it moves it from reserved to withdrawn.
 * seller_wtx is the human-readable statement (with the balance after each entry).
 * ===================================================================== */

const WD_STATUSES = ['pending', 'processing', 'completed', 'cancelled'];
const WD_OPEN = ['pending', 'processing'];
const BKASH_TYPES = ['personal', 'agent', 'merchant'];

/* ---------- settings ---------- */
function wallet_com_default() { static $c = null; if ($c !== null) return $c; $v = state_setting('sellerCom', 0); return $c = (is_num($v) ? max(0.0, min(100.0, (float)$v)) : 0.0); }
function wallet_wd_min() { $v = state_setting('wdMin', 100); return is_num($v) ? max(0.0, money($v)) : 100.0; }
function seller_com_pct($s) { return ($s && $s['com_pct'] !== null && $s['com_pct'] !== '') ? max(0.0, min(100.0, (float)$s['com_pct'])) : wallet_com_default(); }

/* ---------- balance ---------- */
function seller_wallet_summary($sid) {
    $sid = (int)$sid;
    $e = db_row("SELECT COALESCE(SUM(CASE WHEN status='available' THEN net ELSE 0 END),0) earned, COALESCE(SUM(CASE WHEN status='pending' THEN net ELSE 0 END),0) pend,
                 COALESCE(SUM(CASE WHEN status='available' THEN sale ELSE 0 END),0) sales, COALESCE(SUM(CASE WHEN status='available' THEN commission ELSE 0 END),0) com
                 FROM seller_earnings WHERE seller_id=?", [$sid]);
    $w = db_row("SELECT COALESCE(SUM(CASE WHEN status IN ('pending','processing') THEN amount ELSE 0 END),0) wp, COALESCE(SUM(CASE WHEN status='completed' THEN amount ELSE 0 END),0) wd FROM seller_withdrawals WHERE seller_id=?", [$sid]);
    $earned = money($e['earned']); $wp = money($w['wp']); $wd = money($w['wd']);
    // product boost charges paid from the wallet (see handlers_ads.php)
    $ad = function_exists('ad_wallet_paid') ? ad_wallet_paid($sid) : 0.0;
    return ['total' => $earned, 'available' => money($earned - $wp - $wd - $ad), 'pending' => money($e['pend']), 'wd_pending' => $wp, 'withdrawn' => $wd,
            'sales' => money($e['sales']), 'commission' => money($e['com']), 'ads' => $ad];
}
function seller_wtx_log($sid, $kind, $amount, $effect, $ref = null, $note = null) {
    $bal = seller_wallet_summary($sid)['available'];
    q('INSERT INTO seller_wtx (seller_id, kind, amount, effect, bal_after, ref, note, created_at) VALUES (?,?,?,?,?,?,?,?)',
      [(int)$sid, $kind, money($amount), (int)$effect, $bal, $ref, $note !== null ? clean_str($note, 255) : null, now_ts()]);
}

/* ---------- earnings sync (idempotent; call after any order status change) ---------- */
function seller_all_lookup() {
    $m = [];
    foreach (db_rows('SELECT * FROM sellers') as $r) $m[mb_strtolower(trim($r['shop_name']))] = $r;
    return $m;
}
function seller_earn_sync($oid, $lookup = null) {
    try {
        $o = db_row('SELECT * FROM orders WHERE id=?', [$oid]);
        if (!$o) return;
        // when the order was delivered: the day its delivery and COD charges count as NurBuy revenue
        if ($o['status'] === 'Delivered' && empty($o['delivered_at'])) q('UPDATE orders SET delivered_at=? WHERE id=?', [now_ts(), $oid]);
        elseif (!in_array($o['status'], ['Delivered', 'Returned'], true) && !empty($o['delivered_at'])) q('UPDATE orders SET delivered_at=NULL WHERE id=?', [$oid]);
        $items = json_decode((string)$o['items'], true);
        if (!is_array($items)) return;
        if ($lookup === null) $lookup = seller_all_lookup();
        if (!$lookup) return;
        $rej = [];
        foreach (db_rows("SELECT seller_id FROM seller_orders WHERE order_id=? AND sstat='rejected'", [$oid]) as $x) $rej[(int)$x['seller_id']] = true;
        $closed = in_array($o['status'], ['Cancelled', 'Returned'], true);
        $done = $o['status'] === 'Delivered';
        $t = now_ts();
        foreach ($items as $line => $i) {
            if (!is_array($i)) continue;
            $s = $lookup[mb_strtolower(trim((string)($i['shop'] ?? '')))] ?? null;
            if (!$s) continue;
            $sid = (int)$s['id'];
            $want = ($closed || isset($rej[$sid])) ? 'cancelled' : ($done ? 'available' : 'pending');
            $row = db_row('SELECT * FROM seller_earnings WHERE order_id=? AND line=?', [$oid, (int)$line]);
            if (!$row) {
                $q = max(1, (int)($i['q'] ?? 1)); $unit = money($i['unit'] ?? 0);
                $sale = money($unit * $q); $disc = min($sale, max(0.0, money($i['disc'] ?? 0)));
                $pid = (isset($i['id']) && preg_match('/^SP(\d+)$/', (string)$i['id'], $mm)) ? (int)$mm[1] : null;
                // rate is fixed on the order line: a later change by admin only affects new orders
                $pct = seller_line_pct($s, $pid); $com = money(($sale - $disc) * $pct / 100); $net = money($sale - $disc - $com);
                try {
                    q('INSERT INTO seller_earnings (seller_id, order_id, line, product_id, pname, variant, qty, unit, sale, disc, com_pct, commission, net, status, order_at, cleared_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [$sid, $oid, (int)$line, $pid, clean_str($i['n'] ?? '', 255) ?: '-', isset($i['variant']) ? clean_str($i['variant'], 255) : null, $q, $unit, $sale, $disc, $pct, $com, $net,
                       $want, (int)$o['created_at'], $want === 'available' ? $t : null, $t, $t]);
                } catch (PDOException $e) { if (!is_unique_violation($e)) throw $e; continue; }
                if ($want === 'available') seller_wtx_log($sid, 'earn', $net, 1, $oid, $i['n'] ?? '');
                continue;
            }
            if ($row['status'] === $want) continue;
            $prev = $row['status'];
            q('UPDATE seller_earnings SET status=?, cleared_at=?, updated_at=? WHERE id=?', [$want, $want === 'available' ? $t : null, $t, $row['id']]);
            if ($want === 'available') seller_wtx_log($row['seller_id'], 'earn', $row['net'], 1, $oid, $row['pname']);
            elseif ($prev === 'available') seller_wtx_log($row['seller_id'], 'earn_rev', $row['net'], -1, $oid, $row['pname']);
        }
    } catch (Throwable $e) { error_log('seller_earn_sync: ' . $e->getMessage()); }
}
function seller_earn_backfill() {
    try {
        $lookup = seller_all_lookup();
        if (!$lookup) return;
        foreach (db_rows('SELECT id, items FROM orders ORDER BY created_at, id') as $o) {
            $hit = false;
            $items = json_decode((string)$o['items'], true);
            if (is_array($items)) foreach ($items as $i) if (is_array($i) && isset($lookup[mb_strtolower(trim((string)($i['shop'] ?? '')))])) { $hit = true; break; }
            if ($hit) seller_earn_sync($o['id'], $lookup);
        }
    } catch (Throwable $e) { error_log('seller_earn_backfill: ' . $e->getMessage()); }
}

/* ---------- output shapes ---------- */
function earning_out($r) {
    return ['id' => (int)$r['id'], 'order_id' => $r['order_id'], 'line' => (int)$r['line'], 'product_id' => $r['product_id'] === null ? null : (int)$r['product_id'],
            'pname' => $r['pname'], 'variant' => $r['variant'], 'qty' => (int)$r['qty'], 'unit' => money($r['unit']), 'sale' => money($r['sale']), 'disc' => money($r['disc']),
            'com_pct' => (float)$r['com_pct'], 'commission' => money($r['commission']), 'net' => money($r['net']), 'status' => $r['status'],
            'order_at' => (int)$r['order_at'] * 1000, 'cleared_at' => $r['cleared_at'] === null ? null : (int)$r['cleared_at'] * 1000];
}
function wd_details($r) { $d = json_decode((string)$r['details'], true); return is_array($d) ? $d : []; }
function wd_mask($v) { $v = (string)$v; $l = strlen($v); return $l <= 4 ? $v : str_repeat('*', max(0, $l - 4)) . substr($v, -4); }
function wd_out($r, $full = true) {
    $d = wd_details($r);
    if (!$full) {
        if (isset($d['number'])) $d['number'] = wd_mask($d['number']);
        if (isset($d['acc_no'])) $d['acc_no'] = wd_mask($d['acc_no']);
    }
    return ['id' => (int)$r['id'], 'no' => 'WD-' . str_pad((string)$r['id'], 6, '0', STR_PAD_LEFT), 'seller_id' => (int)$r['seller_id'], 'amount' => money($r['amount']),
            'method' => $r['method'], 'details' => $d, 'status' => $r['status'], 'reason' => $r['reason'], 'admin_note' => $r['admin_note'], 'pay_ref' => $r['pay_ref'],
            'admin_name' => $r['admin_name'], 'paid_at' => $r['paid_at'] === null ? null : (int)$r['paid_at'] * 1000,
            'created_at' => (int)$r['created_at'] * 1000, 'updated_at' => (int)$r['updated_at'] * 1000];
}
function wtx_out($r) {
    return ['id' => (int)$r['id'], 'kind' => $r['kind'], 'amount' => money($r['amount']), 'effect' => (int)$r['effect'], 'bal' => money($r['bal_after']),
            'ref' => $r['ref'], 'note' => $r['note'], 'at' => (int)$r['created_at'] * 1000];
}
function seller_by_product($sid) {
    $out = [];
    foreach (db_rows("SELECT product_id, pname, SUM(qty) q, SUM(sale) sale, SUM(disc) disc, SUM(commission) com, SUM(net) net, SUM(CASE WHEN status='available' THEN net ELSE 0 END) earned
                      FROM seller_earnings WHERE seller_id=? AND status<>'cancelled' GROUP BY product_id, pname ORDER BY SUM(net) DESC LIMIT 200", [(int)$sid]) as $r)
        $out[] = ['product_id' => $r['product_id'] === null ? null : (int)$r['product_id'], 'pname' => $r['pname'], 'qty' => (int)$r['q'], 'sale' => money($r['sale']),
                  'disc' => money($r['disc']), 'commission' => money($r['com']), 'net' => money($r['net']), 'earned' => money($r['earned'])];
    return $out;
}

/* =====================================================================
 * Seller side
 * ===================================================================== */
function h_seller_wallet() {
    $s = require_seller(true);
    $sid = (int)$s['id'];
    $earn = []; foreach (db_rows('SELECT * FROM seller_earnings WHERE seller_id=? ORDER BY order_at DESC, id DESC LIMIT 1000', [$sid]) as $r) $earn[] = earning_out($r);
    $wd = []; foreach (db_rows('SELECT * FROM seller_withdrawals WHERE seller_id=? ORDER BY id DESC LIMIT 300', [$sid]) as $r) $wd[] = wd_out($r);
    $tx = []; foreach (db_rows('SELECT * FROM seller_wtx WHERE seller_id=? ORDER BY id DESC LIMIT 500', [$sid]) as $r) $tx[] = wtx_out($r);
    $po = json_decode((string)($s['payout'] ?? ''), true);
    json_out(['summary' => seller_wallet_summary($sid) + ['min' => wallet_wd_min(), 'com_pct' => seller_com_pct($s)],
              'earnings' => $earn, 'by_product' => seller_by_product($sid), 'withdrawals' => $wd, 'tx' => $tx,
              'payout' => is_array($po) ? $po : new stdClass()]);
}
function wd_validate_details($method, $d) {
    if (!is_array($d)) fail(400, 'Payment details are required', 'details');
    if ($method === 'bkash') {
        $num = normalize_mobile($d['number'] ?? '');
        if (!valid_mobile($num)) fail(400, 'Enter a valid bKash number (01XXXXXXXXX)', 'number');
        $type = (string)($d['acc_type'] ?? 'personal');
        if (!in_array($type, BKASH_TYPES, true)) fail(400, 'Choose the bKash account type', 'acc_type');
        $name = clean_str($d['acc_name'] ?? '', 100);
        return ['number' => $num, 'acc_type' => $type, 'acc_name' => $name];
    }
    $out = [];
    foreach ([['holder', 100, 'Enter the account holder name'], ['bank', 100, 'Enter the bank name'], ['branch', 100, 'Enter the branch name']] as $f) {
        $v = clean_str($d[$f[0]] ?? '', $f[1]);
        if (mb_strlen($v) < 2) fail(400, $f[2], $f[0]);
        $out[$f[0]] = $v;
    }
    $acc = preg_replace('/[\s\-]+/', '', clean_str($d['acc_no'] ?? '', 40));
    if (!preg_match('/^[0-9A-Za-z]{6,30}$/', $acc)) fail(400, 'Enter a valid account number', 'acc_no');
    $out['acc_no'] = $acc;
    $rt = preg_replace('/\s+/', '', clean_str($d['routing'] ?? '', 20));
    if ($rt !== '' && !preg_match('/^[0-9]{5,12}$/', $rt)) fail(400, 'Routing number must be 5 to 12 digits', 'routing');
    $out['routing'] = $rt;
    $at = (string)($d['acc_type'] ?? '');
    $out['acc_type'] = in_array($at, ['savings', 'current'], true) ? $at : '';
    $out['note'] = clean_str($d['note'] ?? '', 200);
    return $out;
}
function h_seller_withdraw_create() {
    $s = require_seller(true);
    $b = body_json();
    if (!isset($b['amount']) || !is_num($b['amount'])) fail(400, 'Enter the amount', 'amount');
    $amt = money($b['amount']);
    if ($amt <= 0) fail(400, 'Enter the amount', 'amount');
    if ((float)$b['amount'] != $amt) fail(400, 'Amount can have at most 2 decimal places', 'amount');
    $method = (string)($b['method'] ?? '');
    if (!in_array($method, ['bkash', 'bank'], true)) fail(400, 'Choose a payment method', 'method');
    $det = wd_validate_details($method, $b['details'] ?? null);
    $min = wallet_wd_min();
    if ($amt < $min) fail(400, 'Minimum withdraw amount is ' . $min, 'amount', 'below_min');
    $sid = (int)$s['id'];
    $id = db_tx(function () use ($sid, $amt, $method, $det) {
        db_row('SELECT id FROM sellers WHERE id=?' . lock_suffix(), [$sid]); // serialises withdrawals of one seller
        $sum = seller_wallet_summary($sid);
        if ($amt > $sum['available']) fail(400, 'Amount is more than your available balance', 'amount', 'insufficient_balance');
        $t = now_ts();
        q('INSERT INTO seller_withdrawals (seller_id, amount, method, details, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?)',
          [$sid, $amt, $method, json_encode($det, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), 'pending', $t, $t]);
        $id = (int)db()->lastInsertId();
        $po = json_decode((string)db_val('SELECT payout FROM sellers WHERE id=?', [$sid]), true); if (!is_array($po)) $po = [];
        $po[$method] = $det; $po['last'] = $method;
        q('UPDATE sellers SET payout=? WHERE id=?', [json_encode($po, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $sid]);
        seller_wtx_log($sid, 'wd_req', $amt, -1, 'WD-' . str_pad((string)$id, 6, '0', STR_PAD_LEFT), $method);
        return $id;
    });
    seller_notify($sid, 'Withdraw request submitted', 'WD-' . str_pad((string)$id, 6, '0', STR_PAD_LEFT) . ': ' . $amt . ' taka is reserved until NurBuy pays it.');
    json_out(['withdrawal' => wd_out(db_row('SELECT * FROM seller_withdrawals WHERE id=?', [$id])), 'summary' => seller_wallet_summary($sid) + ['min' => wallet_wd_min()]], 201);
}
function h_seller_withdraw_get($id) {
    $s = require_seller(true);
    $r = db_row('SELECT * FROM seller_withdrawals WHERE id=? AND seller_id=?', [(int)$id, (int)$s['id']]);
    if (!$r) fail(404, 'Withdrawal not found');
    json_out(['withdrawal' => wd_out($r), 'seller' => ['id' => (int)$s['id'], 'shop_name' => $s['shop_name'], 'owner_name' => $s['owner_name'], 'mobile' => $s['mobile'], 'address' => $s['address']]]);
}

/* =====================================================================
 * Admin side
 * ===================================================================== */
function wd_admin_row($r, $sellers) {
    $o = wd_out($r);
    $s = $sellers[(int)$r['seller_id']] ?? null;
    $o['shop_name'] = $s ? $s['shop_name'] : ''; $o['owner_name'] = $s ? $s['owner_name'] : ''; $o['mobile'] = $s ? $s['mobile'] : '';
    return $o;
}
function h_admin_withdrawals() {
    require_admin();
    $f = (string)($_GET['status'] ?? 'all');
    $sellers = []; foreach (db_rows('SELECT id, shop_name, owner_name, mobile FROM sellers') as $x) $sellers[(int)$x['id']] = $x;
    $rows = ($f !== 'all' && in_array($f, WD_STATUSES, true))
        ? db_rows('SELECT * FROM seller_withdrawals WHERE status=? ORDER BY id DESC LIMIT 2000', [$f])
        : db_rows('SELECT * FROM seller_withdrawals ORDER BY id DESC LIMIT 2000');
    $bal = [];
    $out = [];
    foreach ($rows as $r) {
        $o = wd_admin_row($r, $sellers);
        $sid = (int)$r['seller_id'];
        if (!isset($bal[$sid])) $bal[$sid] = seller_wallet_summary($sid)['available'];
        $o['balance'] = $bal[$sid];
        $out[] = $o;
    }
    $today = strtotime('today'); $month = strtotime(date('Y-m-01 00:00:00'));
    $agg = db_row("SELECT COALESCE(SUM(CASE WHEN status IN ('pending','processing') THEN amount ELSE 0 END),0) pend, COALESCE(SUM(CASE WHEN status='completed' THEN amount ELSE 0 END),0) done,
        COALESCE(SUM(CASE WHEN status='cancelled' THEN amount ELSE 0 END),0) canc,
        COALESCE(SUM(CASE WHEN status='completed' AND paid_at>=? THEN amount ELSE 0 END),0) today_paid, COALESCE(SUM(CASE WHEN status='completed' AND paid_at>=? THEN amount ELSE 0 END),0) month_paid,
        COALESCE(SUM(CASE WHEN created_at>=? THEN amount ELSE 0 END),0) today_req, COALESCE(SUM(CASE WHEN created_at>=? THEN amount ELSE 0 END),0) month_req,
        SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) n_pending, SUM(CASE WHEN status='processing' THEN 1 ELSE 0 END) n_processing,
        SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) n_completed, SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) n_cancelled, COUNT(*) n_all
        FROM seller_withdrawals", [$today, $month, $today, $month]);
    $wallet = 0.0;
    foreach (array_keys($sellers) as $sid) $wallet += seller_wallet_summary($sid)['available'];
    json_out(['withdrawals' => $out, 'summary' => [
        'wallet_total' => money($wallet), 'pending' => money($agg['pend']), 'completed' => money($agg['done']), 'cancelled' => money($agg['canc']),
        'today_paid' => money($agg['today_paid']), 'month_paid' => money($agg['month_paid']), 'today_req' => money($agg['today_req']), 'month_req' => money($agg['month_req']),
        'counts' => ['pending' => (int)$agg['n_pending'], 'processing' => (int)$agg['n_processing'], 'completed' => (int)$agg['n_completed'], 'cancelled' => (int)$agg['n_cancelled'], 'all' => (int)$agg['n_all']],
    ]]);
}
function admin_wd_detail($id) {
    $r = db_row('SELECT * FROM seller_withdrawals WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Withdrawal not found');
    $s = db_row('SELECT * FROM sellers WHERE id=?', [(int)$r['seller_id']]);
    $sellers = $s ? [(int)$s['id'] => $s] : [];
    $o = wd_admin_row($r, $sellers);
    $hist = []; foreach (db_rows('SELECT * FROM seller_withdrawals WHERE seller_id=? AND id<>? ORDER BY id DESC LIMIT 100', [(int)$r['seller_id'], (int)$r['id']]) as $x) $hist[] = wd_out($x);
    $earn = []; foreach (db_rows('SELECT * FROM seller_earnings WHERE seller_id=? ORDER BY order_at DESC, id DESC LIMIT 100', [(int)$r['seller_id']]) as $x) $earn[] = earning_out($x);
    $tx = []; foreach (db_rows('SELECT * FROM seller_wtx WHERE seller_id=? ORDER BY id DESC LIMIT 100', [(int)$r['seller_id']]) as $x) $tx[] = wtx_out($x);
    return ['withdrawal' => $o, 'wallet' => seller_wallet_summary((int)$r['seller_id']) + ['com_pct' => seller_com_pct($s)],
            'seller' => $s ? ['id' => (int)$s['id'], 'shop_name' => $s['shop_name'], 'owner_name' => $s['owner_name'], 'mobile' => $s['mobile'], 'email' => $s['email'], 'status' => $s['status'], 'address' => $s['address']] : null,
            'history' => $hist, 'earnings' => $earn, 'tx' => $tx];
}
function h_admin_withdrawal_get($id) { require_admin(); json_out(admin_wd_detail($id)); }
function h_admin_withdrawal_action($id) {
    $a = require_admin();
    $b = body_json();
    $act = (string)($b['action'] ?? '');
    if (!in_array($act, ['processing', 'complete', 'cancel'], true)) fail(400, 'Invalid action', 'action');
    $reason = clean_str($b['reason'] ?? '', 250);
    $ref = clean_str($b['ref'] ?? '', 120);
    $note = clean_str($b['note'] ?? '', 250);
    if ($act === 'cancel' && $reason === '') fail(400, 'Please write a reason', 'reason');
    $res = db_tx(function () use ($id, $act, $reason, $ref, $note, $a) {
        $r = db_row('SELECT * FROM seller_withdrawals WHERE id=?' . lock_suffix(), [(int)$id]);
        if (!$r) fail(404, 'Withdrawal not found');
        $sid = (int)$r['seller_id'];
        db_row('SELECT id FROM sellers WHERE id=?' . lock_suffix(), [$sid]);
        if (!in_array($r['status'], WD_OPEN, true)) fail(409, 'This request is already ' . $r['status'], null, 'wd_closed');
        $no = 'WD-' . str_pad((string)$r['id'], 6, '0', STR_PAD_LEFT); $t = now_ts();
        if ($act === 'processing') {
            if ($r['status'] !== 'pending') fail(409, 'Already processing', null, 'bad_state');
            q("UPDATE seller_withdrawals SET status='processing', admin_note=?, updated_at=? WHERE id=?", [$note !== '' ? $note : $r['admin_note'], $t, $r['id']]);
            return [$sid, 'Withdraw ' . $no . ' is being processed', 'NurBuy is sending ' . money($r['amount']) . ' taka to your account.'];
        }
        if ($act === 'complete') {
            q("UPDATE seller_withdrawals SET status='completed', pay_ref=?, admin_note=?, admin_name=?, paid_at=?, updated_at=? WHERE id=?",
              [$ref !== '' ? $ref : null, $note !== '' ? $note : $r['admin_note'], $a['name'] ?: $a['email'], $t, $t, $r['id']]);
            seller_wtx_log($sid, 'wd_done', $r['amount'], 0, $no, $ref !== '' ? 'Ref ' . $ref : null);
            return [$sid, 'Withdraw ' . $no . ' paid', money($r['amount']) . ' taka was sent. Your invoice is ready in Wallet.'];
        }
        q("UPDATE seller_withdrawals SET status='cancelled', reason=?, admin_note=?, admin_name=?, updated_at=? WHERE id=?", [$reason, $note !== '' ? $note : $r['admin_note'], $a['name'] ?: $a['email'], $t, $r['id']]);
        seller_wtx_log($sid, 'wd_cancel', $r['amount'], 1, $no, $reason);
        return [$sid, 'Withdraw ' . $no . ' cancelled', money($r['amount']) . ' taka is back in your available balance. Reason: ' . $reason];
    });
    seller_notify($res[0], $res[1], $res[2]);
    json_out(admin_wd_detail($id));
}
function h_admin_seller_commission($id) {
    require_admin();
    $b = body_json();
    if (!db_val('SELECT 1 FROM sellers WHERE id=?', [(int)$id])) fail(404, 'Seller not found');
    $v = $b['com_pct'] ?? null;
    if ($v === null || $v === '') q('UPDATE sellers SET com_pct=NULL WHERE id=?', [(int)$id]);
    else {
        if (!is_num($v) || (float)$v < 0 || (float)$v > 100) fail(400, 'Commission must be 0 to 100', 'com_pct');
        q('UPDATE sellers SET com_pct=? WHERE id=?', [round((float)$v, 2), (int)$id]);
    }
    $s = db_row('SELECT * FROM sellers WHERE id=?', [(int)$id]);
    json_out(['ok' => true, 'com_pct' => $s['com_pct'] === null ? null : (float)$s['com_pct'], 'effective' => seller_com_pct($s), 'wallet' => seller_wallet_summary((int)$id)]);
}

/* =====================================================================
 * Seller coupons
 * ===================================================================== */
function coupon_tz_ts($date, $end) {
    if (!is_string($date) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) return false;
    $ts = strtotime($date . ($end ? ' 23:59:59' : ' 00:00:00'));
    return $ts === false ? false : $ts;
}
function coupon_out($c, $pname = null) {
    return ['id' => (int)$c['id'], 'product_id' => (int)$c['product_id'], 'pname' => $pname, 'code' => $c['code'], 'type' => $c['type'], 'value' => money($c['value']),
            'min_buy' => money($c['min_buy']), 'starts' => $c['starts_at'] === null ? '' : date('Y-m-d', (int)$c['starts_at']), 'ends' => $c['ends_at'] === null ? '' : date('Y-m-d', (int)$c['ends_at']),
            'max_uses' => (int)$c['max_uses'], 'per_user' => (int)$c['per_user'], 'used' => (int)$c['used'], 'status' => $c['status'],
            'state' => coupon_state($c), 'created_at' => (int)$c['created_at'] * 1000];
}
function coupon_state($c) {
    $t = now_ts();
    if ($c['status'] !== 'active') return 'inactive';
    if ($c['starts_at'] !== null && $t < (int)$c['starts_at']) return 'scheduled';
    if ($c['ends_at'] !== null && $t > (int)$c['ends_at']) return 'expired';
    if ((int)$c['max_uses'] > 0 && (int)$c['used'] >= (int)$c['max_uses']) return 'used_up';
    return 'live';
}
function coupon_code_taken($code, $exceptId = 0) {
    if (db_val('SELECT 1 FROM seller_coupons WHERE code=? AND id<>?', [$code, (int)$exceptId])) return true;
    list($D) = admin_state();
    if (isset($D['coupons']) && is_array($D['coupons'])) foreach ($D['coupons'] as $c) if (is_array($c) && strtoupper((string)($c['c'] ?? '')) === $code) return true;
    return false;
}
function coupon_validate($b, $sid, $cur = null) {
    $o = [];
    $code = strtoupper(preg_replace('/\s+/', '', clean_str($b['code'] ?? ($cur['code'] ?? ''), 40)));
    if (!preg_match('/^[A-Z0-9_-]{3,20}$/', $code)) fail(400, 'Code must be 3 to 20 letters or numbers', 'code');
    if (coupon_code_taken($code, $cur ? (int)$cur['id'] : 0)) fail(409, 'This coupon code is already used. Choose another.', 'code', 'code_taken');
    $o['code'] = $code;
    $pid = (int)($b['product_id'] ?? ($cur['product_id'] ?? 0));
    $p = db_row('SELECT id, seller_id, price, vr FROM seller_products WHERE id=?', [$pid]);
    if (!$p || (int)$p['seller_id'] !== (int)$sid) fail(400, 'Choose one of your own products', 'product_id', 'not_your_product');
    $o['product_id'] = $pid;
    $type = (string)($b['type'] ?? ($cur['type'] ?? ''));
    if (!in_array($type, ['pct', 'fixed'], true)) fail(400, 'Choose the discount type', 'type');
    $o['type'] = $type;
    $v = $b['value'] ?? ($cur['value'] ?? null);
    if (!is_num($v) || (float)$v <= 0) fail(400, 'Enter the discount amount', 'value');
    $v = money($v);
    if ($type === 'pct' && $v > 90) fail(400, 'Percentage discount must be 1 to 90', 'value');
    if ($type === 'fixed' && $v > 1000000) fail(400, 'Discount is too large', 'value');
    $o['value'] = $v;
    $mb = $b['min_buy'] ?? ($cur['min_buy'] ?? 0);
    if ($mb === '' || $mb === null) $mb = 0;
    if (!is_num($mb) || (float)$mb < 0) fail(400, 'Minimum purchase must be 0 or more', 'min_buy');
    $o['min_buy'] = money($mb);
    $st = array_key_exists('starts', $b) ? $b['starts'] : ($cur ? ($cur['starts_at'] === null ? '' : date('Y-m-d', (int)$cur['starts_at'])) : '');
    $en = array_key_exists('ends', $b) ? $b['ends'] : ($cur ? ($cur['ends_at'] === null ? '' : date('Y-m-d', (int)$cur['ends_at'])) : '');
    $o['starts_at'] = null; $o['ends_at'] = null;
    if ($st !== '' && $st !== null) { $x = coupon_tz_ts($st, false); if ($x === false) fail(400, 'Enter a valid start date', 'starts'); $o['starts_at'] = $x; }
    if ($en !== '' && $en !== null) { $x = coupon_tz_ts($en, true); if ($x === false) fail(400, 'Enter a valid expiry date', 'ends'); $o['ends_at'] = $x; }
    if ($o['starts_at'] !== null && $o['ends_at'] !== null && $o['ends_at'] < $o['starts_at']) fail(400, 'Expiry date must be after the start date', 'ends');
    if (!$cur && $o['ends_at'] !== null && $o['ends_at'] < now_ts()) fail(400, 'Expiry date is already over', 'ends');
    foreach (['max_uses', 'per_user'] as $k) {
        $x = $b[$k] ?? ($cur[$k] ?? 0); if ($x === '' || $x === null) $x = 0;
        if (!is_num($x) || (float)$x < 0 || (float)$x != floor((float)$x) || (float)$x > 1000000) fail(400, 'Enter a whole number (0 = no limit)', $k);
        $o[$k] = (int)$x;
    }
    $stt = (string)($b['status'] ?? ($cur['status'] ?? 'active'));
    if (!in_array($stt, ['active', 'inactive'], true)) fail(400, 'Invalid status', 'status');
    $o['status'] = $stt;
    return $o;
}
function seller_coupon_list($sid) {
    $names = []; foreach (db_rows('SELECT id, name FROM seller_products WHERE seller_id=?', [(int)$sid]) as $p) $names[(int)$p['id']] = $p['name'];
    $out = []; foreach (db_rows('SELECT * FROM seller_coupons WHERE seller_id=? ORDER BY id DESC', [(int)$sid]) as $c) $out[] = coupon_out($c, $names[(int)$c['product_id']] ?? '');
    return $out;
}
function h_seller_coupons() { $s = require_seller(true); json_out(['coupons' => seller_coupon_list((int)$s['id'])]); }
function h_seller_coupon_create() {
    $s = require_seller(true);
    $o = coupon_validate(body_json(), (int)$s['id']);
    if ((int)db_val('SELECT COUNT(*) FROM seller_coupons WHERE seller_id=?', [(int)$s['id']]) >= 300) fail(429, 'You have too many coupons. Delete old ones first.');
    $t = now_ts();
    try {
        q('INSERT INTO seller_coupons (seller_id, product_id, code, type, value, min_buy, starts_at, ends_at, max_uses, per_user, used, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,0,?,?,?)',
          [(int)$s['id'], $o['product_id'], $o['code'], $o['type'], $o['value'], $o['min_buy'], $o['starts_at'], $o['ends_at'], $o['max_uses'], $o['per_user'], $o['status'], $t, $t]);
    } catch (PDOException $e) { if (is_unique_violation($e)) fail(409, 'This coupon code is already used. Choose another.', 'code', 'code_taken'); throw $e; }
    json_out(['coupons' => seller_coupon_list((int)$s['id'])], 201);
}
function seller_own_coupon($id, $sid) {
    $c = db_row('SELECT * FROM seller_coupons WHERE id=? AND seller_id=?', [(int)$id, (int)$sid]);
    if (!$c) fail(404, 'Coupon not found');
    return $c;
}
function h_seller_coupon_update($id) {
    $s = require_seller(true);
    $c = seller_own_coupon($id, (int)$s['id']);
    $o = coupon_validate(body_json(), (int)$s['id'], $c);
    try {
        q('UPDATE seller_coupons SET product_id=?, code=?, type=?, value=?, min_buy=?, starts_at=?, ends_at=?, max_uses=?, per_user=?, status=?, updated_at=? WHERE id=?',
          [$o['product_id'], $o['code'], $o['type'], $o['value'], $o['min_buy'], $o['starts_at'], $o['ends_at'], $o['max_uses'], $o['per_user'], $o['status'], now_ts(), (int)$c['id']]);
    } catch (PDOException $e) { if (is_unique_violation($e)) fail(409, 'This coupon code is already used. Choose another.', 'code', 'code_taken'); throw $e; }
    json_out(['coupons' => seller_coupon_list((int)$s['id'])]);
}
function h_seller_coupon_delete($id) {
    $s = require_seller(true);
    $c = seller_own_coupon($id, (int)$s['id']);
    q('DELETE FROM seller_coupons WHERE id=?', [(int)$c['id']]);
    json_out(['coupons' => seller_coupon_list((int)$s['id'])]);
}

/* ---------- coupon evaluation (public check + order create) ---------- */
/**
 * Returns ['coupon'=>row, 'lines'=>[idx=>disc], 'discount'=>x, 'base'=>x] or throws a 400/409 with a coupon_* code.
 * $items: order items (n, unit, q, id 'SP<pid>', shop, vid). $uid may be null (check only).
 */
function coupon_eval($code, $items, $uid, $lock = false) {
    $code = strtoupper(preg_replace('/\s+/', '', (string)$code));
    if ($code === '' || !preg_match('/^[A-Z0-9_-]{1,40}$/', $code)) fail(400, 'Coupon code is not valid', 'coupon', 'coupon_invalid');
    $c = db_row('SELECT * FROM seller_coupons WHERE code=?' . ($lock ? lock_suffix() : ''), [$code]);
    if (!$c || $c['status'] !== 'active') fail(400, 'Coupon code is not valid', 'coupon', 'coupon_invalid');
    $s = db_row('SELECT id, shop_name, status FROM sellers WHERE id=?', [(int)$c['seller_id']]);
    $p = db_row('SELECT id, seller_id, status, hidden, name FROM seller_products WHERE id=?', [(int)$c['product_id']]);
    if (!$s || $s['status'] !== 'approved' || !$p || (int)$p['seller_id'] !== (int)$s['id'] || $p['status'] !== 'active' || (int)$p['hidden']) fail(400, 'Coupon code is not valid', 'coupon', 'coupon_invalid');
    $t = now_ts();
    if ($c['starts_at'] !== null && $t < (int)$c['starts_at']) fail(400, 'This coupon is not active yet', 'coupon', 'coupon_not_started');
    if ($c['ends_at'] !== null && $t > (int)$c['ends_at']) fail(400, 'This coupon has expired', 'coupon', 'coupon_expired');
    if ((int)$c['max_uses'] > 0 && (int)$c['used'] >= (int)$c['max_uses']) fail(400, 'This coupon has reached its usage limit', 'coupon', 'coupon_used_up');
    $lines = []; $base = 0.0; $wrongShop = false;
    foreach ($items as $k => $i) {
        if (!is_array($i) || !isset($i['id']) || !preg_match('/^SP(\d+)$/', (string)$i['id'], $mm) || (int)$mm[1] !== (int)$p['id']) continue;
        if (mb_strtolower(trim((string)($i['shop'] ?? ''))) !== mb_strtolower(trim($s['shop_name']))) { $wrongShop = true; continue; }
        $sub = money(max(0.0, (float)($i['unit'] ?? 0)) * max(1, (int)($i['q'] ?? 1)));
        $lines[$k] = $sub; $base += $sub;
    }
    if (!$lines) {
        if ($wrongShop) fail(400, 'This coupon is only for this seller\'s product', 'coupon', 'coupon_wrong_seller');
        fail(400, 'This coupon is for a different product', 'coupon', 'coupon_wrong_product');
    }
    $base = money($base);
    if ((float)$c['min_buy'] > 0 && $base < (float)$c['min_buy']) fail(400, 'Buy at least ' . money($c['min_buy']) . ' taka of this product to use the coupon', 'coupon', 'coupon_min');
    if ($uid !== null && (int)$c['per_user'] > 0) {
        $n = (int)db_val('SELECT COUNT(*) FROM coupon_uses WHERE coupon_id=? AND user_id=? AND released=0', [(int)$c['id'], (string)$uid]);
        if ($n >= (int)$c['per_user']) fail(400, 'You have already used this coupon', 'coupon', 'coupon_user_limit');
    }
    $disc = $c['type'] === 'pct' ? money($base * (float)$c['value'] / 100) : min(money($c['value']), $base);
    // split the discount over the matching lines (last line takes the rounding remainder)
    $out = []; $left = $disc; $keys = array_keys($lines);
    foreach ($keys as $n => $k) {
        $d = $n === count($keys) - 1 ? $left : money($disc * $lines[$k] / $base);
        $d = min($d, $lines[$k]); $out[$k] = money($d); $left = money($left - $d);
    }
    return ['coupon' => $c, 'lines' => $out, 'discount' => $disc, 'base' => $base, 'pname' => $p['name'], 'shop' => $s['shop_name']];
}
function h_coupon_check() {
    $b = body_json();
    $items = $b['items'] ?? [];
    if (!is_array($items) || count($items) > 50) fail(400, 'Invalid items', 'items');
    $u = optional_user();
    $r = coupon_eval($b['code'] ?? '', array_values($items), $u ? $u['id'] : null);
    $c = $r['coupon'];
    json_out(['ok' => true, 'code' => $c['code'], 'type' => $c['type'], 'value' => money($c['value']), 'min_buy' => money($c['min_buy']),
              'discount' => $r['discount'], 'product' => 'SP' . (int)$c['product_id'], 'pname' => $r['pname'], 'shop' => $r['shop'], 'lines' => (object)$r['lines']]);
}
/** Called inside the order transaction once the order id and user are known. Mutates $items (adds 'disc'). Returns discount. */
function coupon_apply_to_order($code, &$items, $uid, $oid) {
    $r = coupon_eval($code, $items, $uid, true);
    foreach ($r['lines'] as $k => $d) $items[$k]['disc'] = $d;
    q('UPDATE seller_coupons SET used=used+1, updated_at=? WHERE id=?', [now_ts(), (int)$r['coupon']['id']]);
    q('INSERT INTO coupon_uses (coupon_id, user_id, order_id, amount, released, created_at) VALUES (?,?,?,?,0,?)', [(int)$r['coupon']['id'], (string)$uid, $oid, $r['discount'], now_ts()]);
    return [$r['discount'], $r['coupon']['code']];
}
/** Order cancelled / returned: give the use back so the limit is not eaten by cancelled orders. */
function coupon_release_order($oid) {
    foreach (db_rows('SELECT * FROM coupon_uses WHERE order_id=? AND released=0', [$oid]) as $u) {
        q('UPDATE coupon_uses SET released=1 WHERE id=?', [(int)$u['id']]);
        q('UPDATE seller_coupons SET used=CASE WHEN used>0 THEN used-1 ELSE 0 END WHERE id=?', [(int)$u['coupon_id']]);
    }
}
/** Live coupons per seller product for the public catalog: pid => [..]. */
function coupon_catalog_map() {
    $m = []; $t = now_ts();
    foreach (db_rows("SELECT * FROM seller_coupons WHERE status='active'") as $c) {
        if (coupon_state($c) !== 'live') continue;
        $m[(int)$c['product_id']][] = ['c' => $c['code'], 't' => $c['type'], 'v' => money($c['value']), 'min' => money($c['min_buy']),
                                       'end' => $c['ends_at'] === null ? null : date('Y-m-d', (int)$c['ends_at'])];
    }
    return $m;
}

/* =====================================================================
 * Cover photo
 * ===================================================================== */
function h_seller_cover_delete() {
    $s = require_seller(true);
    $old = $s['cover'] ?? null;
    q('UPDATE sellers SET cover=NULL WHERE id=?', [(int)$s['id']]);
    if ($old && preg_match('/^s' . (int)$s['id'] . '_[0-9a-f]{16}\.(jpg|png|webp)$/', $old)) @unlink(seller_public_dir() . '/' . $old);
    json_out(['seller' => seller_out(db_row('SELECT * FROM sellers WHERE id=?', [(int)$s['id']]))]);
}
