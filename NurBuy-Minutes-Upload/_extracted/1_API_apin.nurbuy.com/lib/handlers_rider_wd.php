<?php
/* =====================================================================
 * Rider withdrawals. Same money model and request shape as the seller
 * wallet (handlers_wallet.php):
 *   earned    = SUM(rider_earnings.amount)
 *   reserved  = SUM(amount) of withdrawals 'pending' or 'processing'
 *   withdrawn = SUM(amount) of withdrawals 'completed'
 *   available = earned - reserved - withdrawn
 * A request reserves its amount at once; cancel gives it back; complete
 * moves it from reserved to withdrawn.
 * ===================================================================== */

function rider_wd_summary($rid) {
    $rid = (int)$rid;
    $earned = money(db_val('SELECT COALESCE(SUM(amount),0) FROM rider_earnings WHERE rider_id=?', [$rid]));
    $w = db_row("SELECT COALESCE(SUM(CASE WHEN status IN ('pending','processing') THEN amount ELSE 0 END),0) wp, COALESCE(SUM(CASE WHEN status='completed' THEN amount ELSE 0 END),0) wd FROM rider_withdrawals WHERE rider_id=?", [$rid]);
    $wp = money($w['wp']); $wd = money($w['wd']);
    return ['total' => $earned, 'available' => max(0.0, money($earned - $wp - $wd)), 'wd_pending' => $wp, 'withdrawn' => $wd, 'min' => wallet_wd_min()];
}
function rider_wd_no($id) { return 'RW-' . str_pad((string)(int)$id, 6, '0', STR_PAD_LEFT); }
function rider_wd_out($r, $full = true) {
    $d = wd_details($r);
    if (!$full) {
        if (isset($d['number'])) $d['number'] = wd_mask($d['number']);
        if (isset($d['acc_no'])) $d['acc_no'] = wd_mask($d['acc_no']);
    }
    return ['id' => (int)$r['id'], 'no' => rider_wd_no($r['id']), 'rider_id' => (int)$r['rider_id'], 'amount' => money($r['amount']),
            'method' => $r['method'], 'details' => $d, 'status' => $r['status'], 'reason' => $r['reason'], 'admin_note' => $r['admin_note'], 'pay_ref' => $r['pay_ref'],
            'admin_name' => $r['admin_name'], 'paid_at' => $r['paid_at'] === null ? null : (int)$r['paid_at'] * 1000,
            'created_at' => (int)$r['created_at'] * 1000, 'updated_at' => (int)$r['updated_at'] * 1000];
}
function rider_wd_last($rid) {
    $out = [];
    foreach (db_rows('SELECT method, details FROM rider_withdrawals WHERE rider_id=? ORDER BY id DESC LIMIT 20', [(int)$rid]) as $r) {
        if (!isset($out[$r['method']])) { $d = json_decode((string)$r['details'], true); if (is_array($d)) $out[$r['method']] = $d; }
        if (!isset($out['last'])) $out['last'] = $r['method'];
    }
    return $out;
}

function h_rider_wallet() {
    $r = require_rider(true);
    $rid = (int)$r['id'];
    $wd = []; foreach (db_rows('SELECT * FROM rider_withdrawals WHERE rider_id=? ORDER BY id DESC LIMIT 200', [$rid]) as $x) $wd[] = rider_wd_out($x);
    json_out(['summary' => rider_wd_summary($rid), 'withdrawals' => $wd, 'payout' => rider_wd_last($rid) ?: new stdClass()]);
}
function h_rider_withdraw_create() {
    $r = require_rider(true);
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
    $rid = (int)$r['id'];
    $id = db_tx(function () use ($rid, $amt, $method, $det) {
        db_row('SELECT id FROM riders WHERE id=?' . lock_suffix(), [$rid]); // serialises withdrawals of one rider
        $sum = rider_wd_summary($rid);
        if ($amt > $sum['available']) fail(400, 'Amount is more than your available balance', 'amount', 'insufficient_balance');
        $t = now_ts();
        q('INSERT INTO rider_withdrawals (rider_id, amount, method, details, status, created_at, updated_at) VALUES (?,?,?,?,?,?,?)',
          [$rid, $amt, $method, json_encode($det, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), 'pending', $t, $t]);
        return (int)db()->lastInsertId();
    });
    rider_notify($rid, 'Withdraw request submitted', rider_wd_no($id) . ': ' . $amt . ' taka is reserved until NurBuy pays it.');
    json_out(['withdrawal' => rider_wd_out(db_row('SELECT * FROM rider_withdrawals WHERE id=?', [$id])), 'summary' => rider_wd_summary($rid)], 201);
}
function h_rider_withdraw_get($id) {
    $r = require_rider(true);
    $x = db_row('SELECT * FROM rider_withdrawals WHERE id=? AND rider_id=?', [(int)$id, (int)$r['id']]);
    if (!$x) fail(404, 'Withdrawal not found');
    json_out(['withdrawal' => rider_wd_out($x), 'rider' => ['id' => (int)$r['id'], 'name' => $r['name'], 'mobile' => $r['mobile'], 'address' => $r['address'] ?? '']]);
}

/* ---------- admin ---------- */
function rider_wd_admin_row($x, $riders) {
    $o = rider_wd_out($x);
    $rd = $riders[(int)$x['rider_id']] ?? null;
    $o['rider'] = $rd ? ['id' => (int)$rd['id'], 'name' => $rd['name'], 'mobile' => $rd['mobile']] : ['id' => (int)$x['rider_id'], 'name' => '', 'mobile' => ''];
    return $o;
}
function rider_wd_riders($ids) {
    $m = []; $ids = array_values(array_unique(array_map('intval', $ids)));
    if (!$ids) return $m;
    foreach (db_rows('SELECT id, name, mobile FROM riders WHERE id IN (' . implode(',', $ids) . ')') as $r) $m[(int)$r['id']] = $r;
    return $m;
}
function h_admin_rider_withdrawals() {
    require_admin();
    $f = (string)($_GET['status'] ?? '');
    $rows = in_array($f, ['pending', 'processing', 'completed', 'cancelled'], true)
        ? db_rows('SELECT * FROM rider_withdrawals WHERE status=? ORDER BY id DESC LIMIT 2000', [$f])
        : db_rows('SELECT * FROM rider_withdrawals ORDER BY id DESC LIMIT 2000');
    $rs = rider_wd_riders(array_map(function ($x) { return $x['rider_id']; }, $rows));
    $out = []; foreach ($rows as $x) $out[] = rider_wd_admin_row($x, $rs);
    $s = db_row("SELECT COALESCE(SUM(CASE WHEN status='pending' THEN amount ELSE 0 END),0) pend, COALESCE(SUM(CASE WHEN status='processing' THEN amount ELSE 0 END),0) proc, COALESCE(SUM(CASE WHEN status='completed' THEN amount ELSE 0 END),0) paid, SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) npend FROM rider_withdrawals");
    json_out(['withdrawals' => $out, 'summary' => ['pending' => money($s['pend']), 'processing' => money($s['proc']), 'paid' => money($s['paid']), 'pending_count' => (int)$s['npend']]]);
}
function admin_rider_wd_detail($id) {
    $x = db_row('SELECT * FROM rider_withdrawals WHERE id=?', [(int)$id]);
    if (!$x) fail(404, 'Withdrawal not found');
    $rs = rider_wd_riders([$x['rider_id']]);
    $hist = []; foreach (db_rows('SELECT * FROM rider_withdrawals WHERE rider_id=? AND id<>? ORDER BY id DESC LIMIT 100', [(int)$x['rider_id'], (int)$x['id']]) as $h) $hist[] = rider_wd_out($h);
    return ['withdrawal' => rider_wd_admin_row($x, $rs), 'wallet' => rider_wd_summary($x['rider_id']), 'history' => $hist];
}
function h_admin_rider_withdrawal_get($id) { require_admin(); json_out(admin_rider_wd_detail($id)); }
function h_admin_rider_withdrawal_action($id) {
    $a = require_admin();
    $b = body_json();
    $act = (string)($b['action'] ?? '');
    if (!in_array($act, ['processing', 'complete', 'cancel'], true)) fail(400, 'Invalid action', 'action');
    $reason = clean_str($b['reason'] ?? '', 250);
    $ref = clean_str($b['ref'] ?? '', 120);
    $note = clean_str($b['note'] ?? '', 250);
    if ($act === 'cancel' && $reason === '') fail(400, 'Please write a reason', 'reason');
    $res = db_tx(function () use ($id, $act, $reason, $ref, $note, $a) {
        $r = db_row('SELECT * FROM rider_withdrawals WHERE id=?' . lock_suffix(), [(int)$id]);
        if (!$r) fail(404, 'Withdrawal not found');
        $rid = (int)$r['rider_id'];
        db_row('SELECT id FROM riders WHERE id=?' . lock_suffix(), [$rid]);
        if (!in_array($r['status'], WD_OPEN, true)) fail(409, 'This request is already ' . $r['status'], null, 'wd_closed');
        $no = rider_wd_no($r['id']); $t = now_ts();
        if ($act === 'processing') {
            if ($r['status'] !== 'pending') fail(409, 'Already processing', null, 'bad_state');
            q("UPDATE rider_withdrawals SET status='processing', admin_note=?, updated_at=? WHERE id=?", [$note !== '' ? $note : $r['admin_note'], $t, $r['id']]);
            return [$rid, 'Withdraw ' . $no . ' is being processed', 'NurBuy is sending ' . money($r['amount']) . ' taka to your account.'];
        }
        if ($act === 'complete') {
            q("UPDATE rider_withdrawals SET status='completed', pay_ref=?, admin_note=?, admin_name=?, paid_at=?, updated_at=? WHERE id=?",
              [$ref !== '' ? $ref : null, $note !== '' ? $note : $r['admin_note'], $a['name'] ?: $a['email'], $t, $t, $r['id']]);
            return [$rid, 'Withdraw ' . $no . ' paid', money($r['amount']) . ' taka was sent to your account.'];
        }
        q("UPDATE rider_withdrawals SET status='cancelled', reason=?, admin_note=?, admin_name=?, updated_at=? WHERE id=?", [$reason, $note !== '' ? $note : $r['admin_note'], $a['name'] ?: $a['email'], $t, $r['id']]);
        return [$rid, 'Withdraw ' . $no . ' cancelled', money($r['amount']) . ' taka is back in your available balance. Reason: ' . $reason];
    });
    rider_notify($res[0], $res[1], $res[2]);
    json_out(admin_rider_wd_detail($id));
}
