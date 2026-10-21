<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * Seller product boost (Sponsored Products on NurBuy Minutes).
 *
 *  seller asks (pending) -> admin approves (active) / rejects
 *  active campaigns are shown in the Sponsored section (max 4 at a time)
 *  charges: per valid impression (adImp per 1000, default ৳10) and per
 *           valid click (adClick, default ৳1). Duplicate, bot and burst
 *           events are not counted.
 *  billing: every seller has a one-time promotional credit (adPromo, ৳10).
 *           Charges are paid in this order: promotional credit -> wallet
 *           balance -> outstanding (debt). Debt may grow only up to the
 *           seller's credit limit; at the limit, campaigns pause. Debt is
 *           taken from the wallet automatically when new earnings arrive.
 *  Every movement is one row in ad_ledger (promo / wallet / debt parts
 *  kept apart), so the same charge can never be taken twice.
 * ===================================================================== */

function ad_set($k, $def) { $v = state_setting($k, $def); return is_num($v) ? (float)$v : $def; }
function ad_rates() {
    return ['imp1000' => max(0.0, ad_set('adImp', 10)), 'click' => max(0.0, ad_set('adClick', 1)), 'promo' => max(0.0, ad_set('adPromo', 10)),
            'limit' => max(0.0, ad_set('adLimit', 0)), 'policy' => state_setting('adPolicy', 'pause') === 'credit' ? 'credit' : 'pause',
            'slots' => max(1, min(4, (int)ad_set('adSlots', 4))), 'max_days' => 30, 'on' => (bool)state_setting('adOn', true)];
}
/** Credit the seller may run on after promo credit and wallet are used up. */
function ad_limit_for($s, $R = null) {
    $R = $R ?? ad_rates();
    if ($R['policy'] === 'pause') return 0.0;
    return ($s['ad_limit'] ?? null) !== null && $s['ad_limit'] !== '' ? money($s['ad_limit']) : $R['limit'];
}
function ad_promo_left($s, $R = null) {
    $R = $R ?? ad_rates();
    // one promotional credit per seller; a second shop with the same NID does not get it again
    if (!empty($s['nid'])) {
        $other = db_val("SELECT COALESCE(SUM(ad_promo_used),0) FROM sellers WHERE nid=? AND id<>?", [$s['nid'], (int)$s['id']]);
        if ((float)$other > 0) return 0.0;
    }
    return money(max(0, $R['promo'] - (float)$s['ad_promo_used']));
}
function ad_wallet_paid($sid) { return money(db_val('SELECT COALESCE(SUM(wallet),0) FROM ad_ledger WHERE seller_id=?', [(int)$sid])); }
function ad_cost($c) { return round((float)$c['imp_cost'] + (float)$c['click_cost'], 4); }

/** Moves unpaid campaign cost into the ledger: promo first, then wallet, then debt. */
function ad_settle($sid, $force = false) {
    $sid = (int)$sid;
    return db_tx(function () use ($sid, $force) {
        $s = db_row('SELECT * FROM sellers WHERE id=?' . lock_suffix(), [$sid]);
        if (!$s) return null;
        $R = ad_rates(); $t = now_ts(); $paidAny = false;
        foreach (db_rows('SELECT * FROM ad_campaigns WHERE seller_id=? ORDER BY id' . lock_suffix(), [$sid]) as $c) {
            $due = floor((ad_cost($c) - (float)$c['settled']) * 100 + 1e-6) / 100;
            if ($due < 0.01 || (!$force && $due < 1.0 && $c['status'] === 'active')) continue;
            $promo = min($due, ad_promo_left($s, $R));
            $rest = money($due - $promo);
            $avail = max(0.0, seller_wallet_summary($sid)['available']);
            $wal = min($rest, $avail);
            $debt = money($rest - $wal);
            q('INSERT INTO ad_ledger (seller_id, campaign_id, kind, amount, promo, wallet, debt, imp, clicks, note, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
              [$sid, (int)$c['id'], 'charge', money($due), money($promo), money($wal), $debt, (int)$c['imp'], (int)$c['clicks'], 'Boost #' . $c['id'] . ' charges', $t]);
            q('UPDATE ad_campaigns SET settled=ROUND(settled+?,2), updated_at=? WHERE id=?', [money($due), $t, (int)$c['id']]);
            if ($promo > 0) { q('UPDATE sellers SET ad_promo_used=ROUND(ad_promo_used+?,2) WHERE id=?', [money($promo), $sid]); $s['ad_promo_used'] = (float)$s['ad_promo_used'] + $promo; }
            if ($debt > 0) { q('UPDATE sellers SET ad_debt=ROUND(ad_debt+?,2) WHERE id=?', [$debt, $sid]); $s['ad_debt'] = (float)$s['ad_debt'] + $debt; }
            if ($wal > 0) seller_wtx_log($sid, 'ad', $wal, -1, 'AD' . $c['id'], 'Product boost #' . $c['id'] . ' (impressions & clicks)');
            $paidAny = true;
        }
        ad_check_limit($s, $R);
        return $paidAny;
    });
}
/** Pauses the seller's running campaigns when nothing is left to pay with. */
function ad_check_limit($s, $R = null) {
    $R = $R ?? ad_rates();
    $can = ad_can_spend($s, $R);
    $act = db_rows("SELECT id FROM ad_campaigns WHERE seller_id=? AND status='active'", [(int)$s['id']]);
    if (!$can && $act) {
        q("UPDATE ad_campaigns SET status='paused', pause_reason='balance', updated_at=? WHERE seller_id=? AND status='active'", [now_ts(), (int)$s['id']]);
        seller_notify($s['id'], 'Boost paused', 'Your promotional credit and wallet balance are used up' . ((float)$s['ad_debt'] > 0 ? ' (outstanding ৳' . money($s['ad_debt']) . ')' : '') . '. Boosts start again when your wallet has money.',
                      ['url' => '/#/boost', 'kind' => 'boost', 'dkey' => 'adpause:' . (int)$s['id'] . ':' . floor(now_ts() / 3600)]);
    }
}
function ad_can_spend($s, $R = null) {
    $R = $R ?? ad_rates();
    $unpaid = 0.0;
    foreach (db_rows("SELECT imp_cost, click_cost, settled FROM ad_campaigns WHERE seller_id=? AND status IN ('active','paused')", [(int)$s['id']]) as $c) $unpaid += max(0, ad_cost($c) - (float)$c['settled']);
    $room = ad_promo_left($s, $R) + max(0.0, seller_wallet_summary((int)$s['id'])['available']) + max(0.0, ad_limit_for($s, $R) - (float)$s['ad_debt']);
    return $room - $unpaid >= 0.01;
}
/** Pays outstanding boost charges from the wallet (called when the seller earns). */
function ad_repay($sid) {
    $sid = (int)$sid;
    try {
        db_tx(function () use ($sid) {
            $s = db_row('SELECT * FROM sellers WHERE id=?' . lock_suffix(), [$sid]);
            if (!$s || (float)$s['ad_debt'] < 0.01) return;
            $avail = max(0.0, seller_wallet_summary($sid)['available']);
            $pay = money(min((float)$s['ad_debt'], $avail));
            if ($pay < 0.01) return;
            q('INSERT INTO ad_ledger (seller_id, campaign_id, kind, amount, promo, wallet, debt, imp, clicks, note, created_at) VALUES (?,?,?,?,?,?,?,0,0,?,?)',
              [$sid, null, 'repay', $pay, 0, $pay, money(-$pay), 'Outstanding boost charges paid from wallet', now_ts()]);
            q('UPDATE sellers SET ad_debt=ROUND(ad_debt-?,2) WHERE id=?', [$pay, $sid]);
            seller_wtx_log($sid, 'ad', $pay, -1, 'ADDEBT', 'Outstanding boost charges');
            // campaigns paused for balance start again when there is room
            $s = db_row('SELECT * FROM sellers WHERE id=?', [$sid]);
            if (ad_can_spend($s)) q("UPDATE ad_campaigns SET status='active', pause_reason=NULL, updated_at=? WHERE seller_id=? AND status='paused' AND pause_reason='balance' AND (end_at IS NULL OR end_at>?)", [now_ts(), $sid, now_ts()]);
        });
    } catch (Throwable $e) { error_log('ad_repay: ' . $e->getMessage()); }
}
/** Ends campaigns whose time is over (lazy, on reads). */
function ad_expire() {
    $t = now_ts();
    $rows = db_rows("SELECT id, seller_id FROM ad_campaigns WHERE status IN ('active','paused') AND end_at IS NOT NULL AND end_at<=?", [$t]);
    if (!$rows) return;
    q("UPDATE ad_campaigns SET status='ended', updated_at=? WHERE status IN ('active','paused') AND end_at IS NOT NULL AND end_at<=?", [$t, $t]);
    foreach (array_unique(array_column($rows, 'seller_id')) as $sid) { try { ad_settle((int)$sid, true); } catch (Throwable $e) { error_log('ad_expire settle: ' . $e->getMessage()); } }
}

/* ---------- output ---------- */
function ad_out($c, $names = null) {
    $imp = (int)$c['imp']; $cl = (int)$c['clicks'];
    $o = ['id' => (int)$c['id'], 'seller_id' => (int)$c['seller_id'], 'product_id' => (int)$c['product_id'], 'status' => $c['status'], 'days' => (int)$c['days'],
          'daily_cap' => $c['daily_cap'] === null ? null : money($c['daily_cap']), 'start_at' => $c['start_at'] ? (int)$c['start_at'] * 1000 : null, 'end_at' => $c['end_at'] ? (int)$c['end_at'] * 1000 : null,
          'imp' => $imp, 'clicks' => $cl, 'ctr' => $imp ? round($cl * 100 / $imp, 2) : 0, 'imp_cost' => round((float)$c['imp_cost'], 2), 'click_cost' => round((float)$c['click_cost'], 2),
          'cost' => round(ad_cost($c), 2), 'settled' => money($c['settled']), 'unpaid' => round(max(0, ad_cost($c) - (float)$c['settled']), 2),
          'pause_reason' => $c['pause_reason'], 'reject_reason' => $c['reject_reason'], 'note' => $c['note'], 'created_at' => (int)$c['created_at'] * 1000, 'reviewed_at' => $c['reviewed_at'] ? (int)$c['reviewed_at'] * 1000 : null];
    $p = db_row('SELECT id, name, bn, imgs, price, status, hidden FROM seller_products WHERE id=?', [(int)$c['product_id']]);
    if ($p) { $im = seller_images($p); $o['product'] = ['id' => (int)$p['id'], 'name' => $p['name'], 'bn' => $p['bn'], 'img' => $im ? seller_img_url($im[0]) : '', 'price' => money($p['price']), 'live' => $p['status'] === 'active' && !(int)$p['hidden']]; }
    $lg = db_row("SELECT COALESCE(SUM(promo),0) promo, COALESCE(SUM(wallet),0) wallet, COALESCE(SUM(debt),0) debt FROM ad_ledger WHERE campaign_id=? AND kind='charge'", [(int)$c['id']]);
    $o['paid'] = ['promo' => money($lg['promo']), 'wallet' => money($lg['wallet']), 'debt' => money($lg['debt'])];
    return $o;
}
function ad_seller_account($s) {
    $R = ad_rates();
    $s = db_row('SELECT * FROM sellers WHERE id=?', [(int)$s['id']]);
    $sum = db_row("SELECT COALESCE(SUM(promo),0) promo, COALESCE(SUM(wallet),0) wallet, COALESCE(SUM(amount),0) amt FROM ad_ledger WHERE seller_id=? AND kind='charge'", [(int)$s['id']]);
    return ['promo_total' => $R['promo'], 'promo_used' => money($s['ad_promo_used']), 'promo_left' => ad_promo_left($s, $R), 'debt' => money($s['ad_debt']),
            'limit' => ad_limit_for($s, $R), 'policy' => $R['policy'], 'wallet_available' => seller_wallet_summary((int)$s['id'])['available'],
            'charged' => money($sum['amt']), 'paid_wallet' => ad_wallet_paid((int)$s['id']), 'can_run' => ad_can_spend($s, $R),
            'rates' => ['imp1000' => $R['imp1000'], 'click' => $R['click']], 'slots' => $R['slots'], 'max_days' => $R['max_days'], 'on' => $R['on']];
}

/* ---------- seller ---------- */
function h_seller_ads() {
    $s = require_seller(true);
    ad_expire();
    ad_settle((int)$s['id'], true);
    ad_repay((int)$s['id']);
    $list = array_map('ad_out', db_rows('SELECT * FROM ad_campaigns WHERE seller_id=? ORDER BY id DESC LIMIT 200', [(int)$s['id']]));
    $led = array_map(function ($r) { return ['id' => (int)$r['id'], 'campaign_id' => $r['campaign_id'] === null ? null : (int)$r['campaign_id'], 'kind' => $r['kind'], 'amount' => money($r['amount']),
            'promo' => money($r['promo']), 'wallet' => money($r['wallet']), 'debt' => money($r['debt']), 'imp' => (int)$r['imp'], 'clicks' => (int)$r['clicks'], 'note' => $r['note'], 'at' => (int)$r['created_at'] * 1000]; },
        db_rows('SELECT * FROM ad_ledger WHERE seller_id=? ORDER BY id DESC LIMIT 300', [(int)$s['id']]));
    json_out(['campaigns' => $list, 'account' => ad_seller_account($s), 'ledger' => $led]);
}
function h_seller_ad_get($id) {
    $s = require_seller(true);
    $c = db_row('SELECT * FROM ad_campaigns WHERE id=? AND seller_id=?', [(int)$id, (int)$s['id']]);
    if (!$c) fail(404, 'Boost not found');
    json_out(['campaign' => ad_out($c), 'account' => ad_seller_account($s)]);
}
function h_seller_ad_create() {
    $s = require_seller(true);
    $R = ad_rates();
    if (!$R['on']) fail(409, 'Product boost is switched off right now', null, 'ads_off');
    $b = body_json();
    $pid = (int)($b['product_id'] ?? 0);
    $p = db_row('SELECT * FROM seller_products WHERE id=? AND seller_id=?', [$pid, (int)$s['id']]);
    if (!$p) fail(404, 'Product not found', 'product_id');
    if ($p['status'] !== 'active' || (int)$p['hidden']) fail(409, 'Only a live (approved and visible) product can be boosted', 'product_id', 'not_live');
    if (db_val("SELECT 1 FROM ad_campaigns WHERE product_id=? AND status IN ('pending','active','paused')", [$pid])) fail(409, 'This product already has a boost running or waiting for review', 'product_id', 'exists');
    $days = $b['days'] ?? 7;
    if (!is_num($days) || (int)$days != (float)$days || (int)$days < 1 || (int)$days > $R['max_days']) fail(400, 'Choose 1 to ' . $R['max_days'] . ' days', 'days');
    $cap = $b['daily_cap'] ?? null;
    if ($cap !== null && $cap !== '') { if (!is_num($cap) || (float)$cap < 1 || (float)$cap > 100000) fail(400, 'Daily limit must be at least ৳1', 'daily_cap'); $cap = money($cap); } else $cap = null;
    $note = clean_str($b['note'] ?? '', 255);
    $sx = db_row('SELECT * FROM sellers WHERE id=?', [(int)$s['id']]);
    if (!ad_can_spend($sx, $R)) fail(409, 'Add money to your wallet (or clear the outstanding boost charges) to start a boost', null, 'no_balance');
    $t = now_ts();
    q('INSERT INTO ad_campaigns (seller_id, product_id, status, days, daily_cap, note, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)', [(int)$s['id'], $pid, 'pending', (int)$days, $cap, $note !== '' ? $note : null, $t, $t]);
    $id = (int)db()->lastInsertId();
    json_out(['campaign' => ad_out(db_row('SELECT * FROM ad_campaigns WHERE id=?', [$id]))], 201);
}
function h_seller_ad_action($id) {
    $s = require_seller(true);
    $b = body_json();
    $act = (string)($b['action'] ?? '');
    $c = db_row('SELECT * FROM ad_campaigns WHERE id=? AND seller_id=?', [(int)$id, (int)$s['id']]);
    if (!$c) fail(404, 'Boost not found');
    $t = now_ts();
    if ($act === 'pause') { if ($c['status'] !== 'active') fail(409, 'Only a running boost can be paused'); q("UPDATE ad_campaigns SET status='paused', pause_reason='seller', updated_at=? WHERE id=?", [$t, (int)$id]); }
    elseif ($act === 'resume') {
        if ($c['status'] !== 'paused') fail(409, 'This boost is not paused');
        if ($c['pause_reason'] === 'admin') fail(409, 'NurBuy paused this boost. Please contact support.', null, 'admin_paused');
        $sx = db_row('SELECT * FROM sellers WHERE id=?', [(int)$s['id']]);
        if (!ad_can_spend($sx)) fail(409, 'Add money to your wallet to resume the boost', null, 'no_balance');
        q("UPDATE ad_campaigns SET status='active', pause_reason=NULL, updated_at=? WHERE id=?", [$t, (int)$id]);
    } elseif ($act === 'cancel') {
        if (!in_array($c['status'], ['pending', 'active', 'paused'], true)) fail(409, 'This boost is already closed');
        q("UPDATE ad_campaigns SET status=?, updated_at=?, end_at=COALESCE(end_at, ?) WHERE id=?", [$c['status'] === 'pending' ? 'cancelled' : 'ended', $t, $t, (int)$id]);
        ad_settle((int)$s['id'], true);
    } else fail(400, 'Invalid action', 'action');
    json_out(['campaign' => ad_out(db_row('SELECT * FROM ad_campaigns WHERE id=?', [(int)$id]))]);
}

/* ---------- admin ---------- */
function h_admin_ads() {
    require_admin();
    ad_expire();
    $st = (string)($_GET['status'] ?? '');
    $rows = in_array($st, ['pending', 'active', 'paused', 'rejected', 'ended', 'cancelled'], true)
        ? db_rows('SELECT * FROM ad_campaigns WHERE status=? ORDER BY id DESC LIMIT 500', [$st]) : db_rows('SELECT * FROM ad_campaigns ORDER BY id DESC LIMIT 500');
    $shops = []; foreach (db_rows('SELECT id, shop_name, ad_debt, ad_promo_used, ad_limit FROM sellers') as $r) $shops[(int)$r['id']] = $r;
    $out = [];
    foreach ($rows as $c) { $o = ad_out($c); $sh = $shops[(int)$c['seller_id']] ?? null; $o['shop'] = $sh['shop_name'] ?? '-'; $o['seller_debt'] = $sh ? money($sh['ad_debt']) : 0; $out[] = $o; }
    $cnt = []; foreach (db_rows('SELECT status, COUNT(*) n FROM ad_campaigns GROUP BY status') as $r) $cnt[$r['status']] = (int)$r['n'];
    $tot = db_row('SELECT COALESCE(SUM(imp),0) i, COALESCE(SUM(clicks),0) c, COALESCE(SUM(imp_cost+click_cost),0) cost FROM ad_campaigns');
    $led = db_row("SELECT COALESCE(SUM(promo),0) promo, COALESCE(SUM(wallet),0) wallet FROM ad_ledger");
    json_out(['campaigns' => $out, 'counts' => $cnt ?: new stdClass(), 'rates' => ad_rates(),
              'totals' => ['imp' => (int)$tot['i'], 'clicks' => (int)$tot['c'], 'cost' => round((float)$tot['cost'], 2), 'promo' => money($led['promo']), 'wallet' => money($led['wallet']),
                           'debt' => money(db_val('SELECT COALESCE(SUM(ad_debt),0) FROM sellers'))]]);
}
function h_admin_ad_action($id) {
    require_admin();
    $b = body_json();
    $act = (string)($b['action'] ?? '');
    $reason = clean_str($b['reason'] ?? '', 250);
    $c = db_row('SELECT * FROM ad_campaigns WHERE id=?', [(int)$id]);
    if (!$c) fail(404, 'Boost not found');
    $t = now_ts(); $sid = (int)$c['seller_id'];
    $pn = (string)db_val('SELECT name FROM seller_products WHERE id=?', [(int)$c['product_id']]);
    if ($act === 'approve') {
        if ($c['status'] !== 'pending') fail(409, 'Only a waiting request can be approved');
        $p = db_row('SELECT status, hidden FROM seller_products WHERE id=?', [(int)$c['product_id']]);
        if (!$p || $p['status'] !== 'active' || (int)$p['hidden']) fail(409, 'The product is not live any more', null, 'not_live');
        q("UPDATE ad_campaigns SET status='active', start_at=?, end_at=?, reviewed_at=?, reject_reason=NULL, pause_reason=NULL, updated_at=? WHERE id=?", [$t, $t + (int)$c['days'] * 86400, $t, $t, (int)$id]);
        seller_notify($sid, 'Boost approved', $pn . ' is now shown in Sponsored Products for ' . (int)$c['days'] . ' days.', ['url' => '/#/boost/' . (int)$id, 'kind' => 'boost', 'dkey' => 'adok:' . (int)$id]);
        $sx = db_row('SELECT * FROM sellers WHERE id=?', [$sid]);
        if (!ad_can_spend($sx)) q("UPDATE ad_campaigns SET status='paused', pause_reason='balance' WHERE id=?", [(int)$id]);
    } elseif ($act === 'reject') {
        if ($c['status'] !== 'pending') fail(409, 'Only a waiting request can be rejected');
        if ($reason === '') fail(400, 'Please write a reason', 'reason');
        q("UPDATE ad_campaigns SET status='rejected', reject_reason=?, reviewed_at=?, updated_at=? WHERE id=?", [$reason, $t, $t, (int)$id]);
        seller_notify($sid, 'Boost request rejected', $pn . ': ' . $reason, ['url' => '/#/boost/' . (int)$id, 'kind' => 'boost', 'dkey' => 'adno:' . (int)$id]);
    } elseif ($act === 'pause') {
        if ($c['status'] !== 'active') fail(409, 'Only a running boost can be paused');
        q("UPDATE ad_campaigns SET status='paused', pause_reason='admin', note=?, updated_at=? WHERE id=?", [$reason !== '' ? $reason : $c['note'], $t, (int)$id]);
        seller_notify($sid, 'Boost paused by NurBuy', $pn . ($reason !== '' ? ': ' . $reason : ''), ['url' => '/#/boost/' . (int)$id, 'kind' => 'boost', 'dkey' => 'adap:' . (int)$id . ':' . $t]);
    } elseif ($act === 'resume') {
        if ($c['status'] !== 'paused') fail(409, 'This boost is not paused');
        q("UPDATE ad_campaigns SET status='active', pause_reason=NULL, updated_at=? WHERE id=?", [$t, (int)$id]);
    } elseif ($act === 'end') {
        if (!in_array($c['status'], ['active', 'paused'], true)) fail(409, 'This boost is not running');
        q("UPDATE ad_campaigns SET status='ended', end_at=?, updated_at=? WHERE id=?", [$t, $t, (int)$id]);
        ad_settle($sid, true);
    } else fail(400, 'Invalid action', 'action');
    json_out(['campaign' => ad_out(db_row('SELECT * FROM ad_campaigns WHERE id=?', [(int)$id]))]);
}
function h_admin_ad_limit() {
    require_admin();
    $b = body_json();
    $sid = (int)($b['seller_id'] ?? 0);
    if (!db_val('SELECT 1 FROM sellers WHERE id=?', [$sid])) fail(404, 'Seller not found');
    $v = $b['limit'] ?? null;
    if ($v !== null && $v !== '' && (!is_num($v) || (float)$v < 0 || (float)$v > 1000000)) fail(400, 'Enter a valid limit', 'limit');
    q('UPDATE sellers SET ad_limit=? WHERE id=?', [$v === null || $v === '' ? null : money($v), $sid]);
    json_out(['ok' => true]);
}

/* ---------- website: which boosted products to show, and counting views / clicks ---------- */
function ad_public_list() {
    try {
        $R = ad_rates();
        if (!$R['on']) return [];
        ad_expire();
        $t = now_ts(); $day = day_start(0); $out = [];
        $rows = db_rows("SELECT c.*, p.status pst, p.hidden, s.status sst FROM ad_campaigns c JOIN seller_products p ON p.id=c.product_id JOIN sellers s ON s.id=c.seller_id
                         WHERE c.status='active' AND (c.end_at IS NULL OR c.end_at>?) ORDER BY c.id", [$t]);
        $ok = [];
        foreach ($rows as $c) {
            if ($c['pst'] !== 'active' || (int)$c['hidden'] || $c['sst'] !== 'approved') continue;
            if ($c['daily_cap'] !== null && ad_spent_today((int)$c['id'], $day) >= (float)$c['daily_cap']) continue;
            $ok[] = ['c' => (int)$c['id'], 'p' => 'SP' . (int)$c['product_id']];
        }
        if (count($ok) > $R['slots']) { $off = (int)floor($t / 3600) % count($ok); $ok = array_slice(array_merge(array_slice($ok, $off), array_slice($ok, 0, $off)), 0, $R['slots']); }
        return $ok;
    } catch (Throwable $e) { error_log('ad_public_list: ' . $e->getMessage()); return []; }
}
function ad_spent_today($cid, $day) {
    $R = ad_rates();
    $i = (int)db_val("SELECT COUNT(*) FROM ad_events WHERE campaign_id=? AND kind='i' AND created_at>=?", [$cid, $day]);
    $c = (int)db_val("SELECT COUNT(*) FROM ad_events WHERE campaign_id=? AND kind='c' AND created_at>=?", [$cid, $day]);
    return $i * $R['imp1000'] / 1000 + $c * $R['click'];
}
function ad_is_bot($ua) {
    if ($ua === '' || strlen($ua) < 20) return true;
    return (bool)preg_match('/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|headless|lighthouse|phantom|python|curl|wget|java\/|go-http|httpclient|axios|node-fetch|okhttp|scrapy|monitor/i', $ua);
}
/** POST /ads/ev {c: campaign, k: 'i'|'c', v: visitor id}. Always answers ok; only valid events are charged. */
function h_ad_event() {
    $b = body_json();
    $cid = (int)($b['c'] ?? 0); $k = (string)($b['k'] ?? ''); $v = (string)($b['v'] ?? '');
    $res = ['ok' => true, 'counted' => false];
    if (!$cid || !in_array($k, ['i', 'c'], true) || !preg_match('/^[A-Za-z0-9_-]{12,64}$/', $v)) json_out($res);
    $ua = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
    if (ad_is_bot($ua)) json_out($res + ['why' => 'bot']);
    $ip = hash('sha256', client_ip() . '|nb-ads');
    $t = now_ts();
    // burst guard: one address cannot send more than 40 events a minute
    if ((int)db_val('SELECT COUNT(*) FROM ad_events WHERE ip=? AND created_at>?', [$ip, $t - 60]) >= 40) json_out($res + ['why' => 'rate']);
    $vkey = hash('sha256', $v . '|' . $ua . '|' . client_ip());
    $R = ad_rates();
    $counted = db_tx(function () use ($cid, $k, $vkey, $ip, $t, $R) {
        $c = db_row("SELECT * FROM ad_campaigns WHERE id=?" . lock_suffix(), [$cid]);
        if (!$c || $c['status'] !== 'active' || ($c['end_at'] && (int)$c['end_at'] <= $t)) return 'inactive';
        if ($c['daily_cap'] !== null && ad_spent_today($cid, day_start(0)) >= (float)$c['daily_cap']) return 'cap';
        if ($k === 'c') {
            // a click counts only after this visitor really saw the ad, once a day, and at most 3 clicks a day from one network
            if (!db_val("SELECT 1 FROM ad_events WHERE campaign_id=? AND kind='i' AND vkey=? AND created_at>?", [$cid, $vkey, $t - 86400])) return 'noimp';
            if ((int)db_val("SELECT COUNT(*) FROM ad_events WHERE campaign_id=? AND kind='c' AND ip=? AND created_at>?", [$cid, $ip, $t - 86400]) >= 3) return 'ipcap';
            $bucket = (int)floor($t / 86400);
        } else $bucket = (int)floor($t / 1800); // one view per visitor per 30 minutes
        try { q('INSERT INTO ad_events (campaign_id, kind, vkey, bucket, ip, created_at) VALUES (?,?,?,?,?,?)', [$cid, $k, $vkey, $bucket, $ip, $t]); }
        catch (PDOException $e) { if (is_unique_violation($e)) return 'dup'; throw $e; }
        if ($k === 'i') q('UPDATE ad_campaigns SET imp=imp+1, imp_cost=imp_cost+?, updated_at=? WHERE id=?', [$R['imp1000'] / 1000, $t, $cid]);
        else q('UPDATE ad_campaigns SET clicks=clicks+1, click_cost=click_cost+?, updated_at=? WHERE id=?', [$R['click'], $t, $cid]);
        return (int)$c['seller_id'];
    });
    if (is_int($counted)) {
        $c = db_row('SELECT * FROM ad_campaigns WHERE id=?', [$cid]);
        if (ad_cost($c) - (float)$c['settled'] >= 1.0) ad_settle($counted);
        json_out(['ok' => true, 'counted' => true]);
    }
    json_out($res + ['why' => $counted]);
}
