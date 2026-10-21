<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * NurBuy Minutes delivery rules
 *  - each village / area has its own delivery time (minutes) and rider payment
 *  - the countdown is worked out on the server from the order time, the
 *    village time and any approved rider delays (so a page refresh never resets it)
 *  - a rider may add up to 5 extra minutes, with a reason, a limited number of times
 *  - when an order is Delivered: customer bonus, rider payment and seller
 *    settlement are each credited once (repeated calls never credit twice)
 * ===================================================================== */

const DELAY_REASONS = ['traffic' => 'রাস্তায় যানজট', 'weather' => 'খারাপ আবহাওয়া', 'shop' => 'দোকানে প্যাকিং দেরি', 'address' => 'ঠিকানা খুঁজে পেতে দেরি', 'vehicle' => 'যানবাহনে সমস্যা', 'other' => 'অন্যান্য'];
const DELAY_MAX_MINS = 5;

function delivery_eta_default() { $v = state_setting('etaMin', MIN_ETA_MAX); return (is_num($v) && (int)$v >= 5 && (int)$v <= 240) ? (int)$v : MIN_ETA_MAX; }
function delay_max_count() { $v = state_setting('delayMax', 1); return (is_num($v) && (int)$v >= 0) ? min(5, (int)$v) : 1; }
function rider_pay_default() { $v = state_setting('riderPay', null); return is_num($v) && (float)$v >= 0 ? money($v) : null; }

/** Village/area delivery time and rider payment for a place (the deepest place on the path that has a value). */
function loc_delivery_info($locId) {
    $eta = null; $pay = null;
    $path = $locId ? loc_path((int)$locId) : null;
    if ($path) foreach ($path as $r) {
        if (isset($r['eta']) && $r['eta'] !== null && (int)$r['eta'] > 0) $eta = (int)$r['eta'];
        if (isset($r['rider_pay']) && $r['rider_pay'] !== null) $pay = money($r['rider_pay']);
    }
    return ['eta' => $eta ?? delivery_eta_default(), 'rider_pay' => $pay ?? rider_pay_default()];
}

/** Idempotency guard: true the first time a key is seen (inside the current transaction). */
function ledger_once($key) {
    try { q('INSERT INTO ledger_keys (k, created_at) VALUES (?,?)', [substr($key, 0, 120), now_ts()]); return true; }
    catch (PDOException $e) { if (is_unique_violation($e)) return false; throw $e; }
}

/** Countdown data for a Minutes order (null for other orders). */
function order_eta($o, $delays = null) {
    if (($o['view'] ?? '') !== 'min') return null;
    $ex = is_array($o['extra'] ?? null) ? $o['extra'] : json_decode((string)($o['extra'] ?? ''), true);
    if (!is_array($ex)) $ex = [];
    $mins = isset($ex['eta_max']) && is_num($ex['eta_max']) ? (int)$ex['eta_max'] : MIN_ETA_MAX;
    if ($delays === null) $delays = db_rows('SELECT mins, reason, note, created_at FROM order_delays WHERE order_id=? ORDER BY id', [$o['id']]);
    $add = 0; $list = [];
    foreach ($delays as $d) { $add += (int)$d['mins']; $list[] = ['mins' => (int)$d['mins'], 'reason' => $d['reason'], 'label' => DELAY_REASONS[$d['reason']] ?? $d['reason'], 'note' => $d['note'], 'at' => (int)$d['created_at'] * 1000]; }
    $start = (int)$o['created_at'];
    $out = ['start' => $start * 1000, 'mins' => $mins, 'extra' => $add, 'due' => ($start + ($mins + $add) * 60) * 1000, 'delays' => $list, 'now' => now_ts() * 1000];
    if (!empty($o['delivered_at'])) $out['done'] = (int)$o['delivered_at'] * 1000;
    return $out;
}

/** Customer wallet bonus that is still waiting for delivery (or already given). */
function order_bonus_state($o) {
    $cb = money($o['cashback'] ?? 0);
    if ($cb <= 0 || empty($o['user_id'])) return ['amount' => 0, 'state' => 'none'];
    $given = money(db_val("SELECT COALESCE(SUM(amount),0) FROM wallet_tx WHERE user_id=? AND order_id=? AND t='cb'", [$o['user_id'], $o['id']]));
    $back = money(db_val("SELECT COALESCE(SUM(amount),0) FROM wallet_tx WHERE user_id=? AND order_id=? AND t='cbr'", [$o['user_id'], $o['id']]));
    if ($given > 0 && $back >= $given) return ['amount' => $cb, 'state' => 'reversed'];
    if ($given > 0) return ['amount' => $given, 'state' => 'credited'];
    if (in_array($o['status'], ['Cancelled', 'Returned'], true)) return ['amount' => $cb, 'state' => 'cancelled'];
    return ['amount' => $cb, 'state' => 'pending'];
}

/** Runs after every order status change (admin, seller, rider). Safe to call many times. */
function order_after_status($oid, $prevStatus = null) {
    $o = db_row('SELECT * FROM orders WHERE id=?', [$oid]);
    if (!$o) return;
    seller_earn_sync($oid);
    $o = db_row('SELECT * FROM orders WHERE id=?', [$oid]);
    $st = $o['status'];
    $uid = $o['user_id'];
    if ($st === 'Delivered') {
        // 1) customer bonus: only now, and only once
        $cb = money($o['cashback']);
        if ($o['view'] === 'min' && $uid && $cb > 0 && ledger_once('cb:' . $oid)) {
            $already = money(db_val("SELECT COALESCE(SUM(amount),0) FROM wallet_tx WHERE user_id=? AND order_id=? AND t='cb'", [$uid, $oid]));
            if ($already <= 0) {
                wallet_credit($uid, $cb);
                $ex = json_decode((string)$o['extra'], true);
                wallet_log($uid, 'cb', $cb, $oid, null, 'Bonus for delivered order ' . $oid);
                notify('user', $uid, 'বোনাস যোগ হয়েছে', 'অর্ডার ' . $oid . ' ডেলিভারি হয়েছে। আপনার ওয়ালেটে ৳' . rtrim(rtrim(number_format($cb, 2, '.', ''), '0'), '.') . ' বোনাস যোগ হয়েছে।',
                       ['url' => '/wallet', 'kind' => 'wallet', 'dkey' => 'cb:' . $oid]);
            }
        }
        // 2) rider payment for this village: once per order
        $d = db_row('SELECT * FROM deliveries WHERE order_id=?', [$oid]);
        if ($d && $d['rstat'] !== 'cancelled' && !db_val('SELECT 1 FROM rider_earnings WHERE order_id=?', [$oid])) {
            $ex = json_decode((string)$o['extra'], true); if (!is_array($ex)) $ex = [];
            $pay = isset($ex['rider_pay']) && is_num($ex['rider_pay']) ? money($ex['rider_pay']) : null;
            if ($pay === null) { $info = loc_delivery_info((int)($ex['loc_id'] ?? 0)); $pay = $info['rider_pay']; }
            if ($pay !== null && $pay > 0) {
                $area = isset($ex['area']) && is_array($ex['area']) ? implode(', ', array_map(function ($x) { return (string)($x['bn'] ?? $x['n'] ?? ''); }, $ex['area'])) : null;
                try {
                    q('INSERT INTO rider_earnings (rider_id, order_id, amount, loc_id, area, created_at) VALUES (?,?,?,?,?,?)', [(int)$d['rider_id'], $oid, $pay, (int)($ex['loc_id'] ?? 0) ?: null, $area ? clean_str($area, 255) : null, now_ts()]);
                    notify('rider', (string)$d['rider_id'], 'Delivery payment added', 'Order ' . $oid . ': ৳' . rtrim(rtrim(number_format($pay, 2, '.', ''), '0'), '.') . ' added to your earnings.', ['url' => '/#/earnings', 'kind' => 'wallet', 'dkey' => 'rp:' . $oid]);
                } catch (PDOException $e) { if (!is_unique_violation($e)) throw $e; }
            }
        }
    }
    if ($st === 'Delivered' && function_exists('ad_repay')) {
        // new earnings pay any outstanding boost charges of the sellers in this order
        foreach (db_rows('SELECT DISTINCT seller_id FROM seller_earnings WHERE order_id=?', [$oid]) as $x) ad_repay((int)$x['seller_id']);
    }
    if (in_array($st, ['Cancelled', 'Returned'], true) && $uid) {
        // a bonus that was already given is taken back once (Returned after delivery)
        $b = order_bonus_state($o);
        if ($b['state'] === 'credited' && ledger_once('cbr:' . $oid)) {
            $took = wallet_debit_clamped($uid, $b['amount']);
            if ($took > 0) wallet_log($uid, 'cbr', $took, $oid, null, 'Bonus reversed (' . strtolower($st) . ')');
        }
    }
    // tell the customer
    if ($uid && $prevStatus !== $st) {
        $msg = ['Confirmed' => ['অর্ডার কনফার্ম হয়েছে', 'দোকান আপনার অর্ডার ' . $oid . ' কনফার্ম করেছে।'],
                'Packed' => ['অর্ডার প্যাক হচ্ছে', 'অর্ডার ' . $oid . ' প্যাক করা হয়েছে, শিগগিরই রাইডার নিয়ে আসবে।'],
                'Out for delivery' => ['অর্ডার পথে আছে', 'রাইডার অর্ডার ' . $oid . ' নিয়ে আপনার কাছে আসছে।'],
                'Delivered' => ['অর্ডার ডেলিভারি হয়েছে', 'অর্ডার ' . $oid . ' ডেলিভারি সম্পন্ন হয়েছে। ধন্যবাদ।'],
                'Cancelled' => ['অর্ডার বাতিল হয়েছে', 'অর্ডার ' . $oid . ' বাতিল করা হয়েছে।'],
                'Returned' => ['অর্ডার ফেরত', 'অর্ডার ' . $oid . ' ফেরত হিসেবে চিহ্নিত হয়েছে।']][$st] ?? null;
        if ($msg) notify('user', $uid, $msg[0], $msg[1], ['url' => '/orders/' . rawurlencode($oid), 'kind' => 'order', 'dkey' => 'os:' . $oid . ':' . $st]);
    }
}

/* ---------- rider: ask for extra time ---------- */
function h_rider_order_delay($id) {
    $r = require_rider(true);
    $b = body_json();
    $reason = (string)($b['reason'] ?? '');
    if (!isset(DELAY_REASONS[$reason])) fail(400, 'Choose a reason', 'reason');
    $note = clean_str($b['note'] ?? '', 160);
    if ($reason === 'other' && $note === '') fail(400, 'Please write the reason', 'note');
    $mins = isset($b['mins']) ? $b['mins'] : DELAY_MAX_MINS;
    if (!is_num($mins) || (int)$mins != (float)$mins || (int)$mins < 1 || (int)$mins > DELAY_MAX_MINS) fail(400, 'Extra time can be 1 to ' . DELAY_MAX_MINS . ' minutes', 'mins');
    $mins = (int)$mins;
    $res = db_tx(function () use ($r, $id, $reason, $note, $mins) {
        list($o, $d) = rider_load_delivery($r, $id);
        if ($o['view'] !== 'min') fail(409, 'Extra time is only for NurBuy Minutes orders', null, 'bad_state');
        if (!in_array($d['rstat'], RSTAT_ACTIVE, true)) fail(409, 'Extra time can only be asked while the delivery is active', null, 'bad_state');
        $used = (int)db_val('SELECT COUNT(*) FROM order_delays WHERE order_id=?', [$id]);
        $max = delay_max_count();
        if ($used >= $max) fail(409, $max ? 'Extra time was already used for this order' : 'Extra time is switched off', null, 'delay_limit');
        q('INSERT INTO order_delays (order_id, rider_id, mins, reason, note, created_at) VALUES (?,?,?,?,?,?)', [$id, (int)$r['id'], $mins, $reason, $note !== '' ? $note : null, now_ts()]);
        $did = (int)db()->lastInsertId();
        if ($o['user_id']) {
            $why = $reason === 'other' ? $note : DELAY_REASONS[$reason] . ($note !== '' ? ' (' . $note . ')' : '');
            notify('user', $o['user_id'], 'অর্ডার একটু দেরি হচ্ছে', 'আপনার অর্ডারটি সামান্য বিলম্বিত হচ্ছে। আরও ' . bn_digits($mins) . ' মিনিট সময় প্রয়োজন। কারণ: ' . $why . '।',
                   ['url' => '/orders/' . rawurlencode($id), 'kind' => 'order', 'dkey' => 'dl:' . $did]);
        }
        return order_eta($o);
    });
    json_out(['ok' => true, 'eta' => $res, 'left' => max(0, delay_max_count() - (int)db_val('SELECT COUNT(*) FROM order_delays WHERE order_id=?', [$id]))]);
}
function bn_digits($n) { return strtr((string)$n, ['0' => '০', '1' => '১', '2' => '২', '3' => '৩', '4' => '৪', '5' => '৫', '6' => '৬', '7' => '৭', '8' => '৮', '9' => '৯']); }

/* ---------- rider: earnings ---------- */
function rider_earn_summary($rid) {
    $rid = (int)$rid; $t0 = day_start(0); $w0 = day_start(-6); $m0 = strtotime(date('Y-m-01 00:00:00', now_ts()));
    $s = function ($from) use ($rid) { return money(db_val('SELECT COALESCE(SUM(amount),0) FROM rider_earnings WHERE rider_id=? AND created_at>=?', [$rid, $from])); };
    return ['total' => money(db_val('SELECT COALESCE(SUM(amount),0) FROM rider_earnings WHERE rider_id=?', [$rid])), 'today' => $s($t0), 'week' => $s($w0), 'month' => $s($m0),
            'count' => (int)db_val('SELECT COUNT(*) FROM rider_earnings WHERE rider_id=?', [$rid])];
}
function rider_earn_list($rid, $limit = 200) {
    return array_map(function ($r) { return ['order_id' => $r['order_id'], 'amount' => money($r['amount']), 'area' => $r['area'], 'at' => (int)$r['created_at'] * 1000]; },
        db_rows('SELECT * FROM rider_earnings WHERE rider_id=? ORDER BY id DESC LIMIT ' . (int)$limit, [(int)$rid]));
}
function h_rider_earnings() { $r = require_rider(true); json_out(['summary' => rider_earn_summary($r['id']), 'items' => rider_earn_list($r['id'])]); }
function h_admin_rider_earnings($id) { require_admin(); json_out(['summary' => rider_earn_summary($id), 'items' => rider_earn_list($id, 500)]); }
