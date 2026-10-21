<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * Seller panel: seller-side endpoints (/seller/*) and admin-side seller
 * management (/admin/sellers*, /admin/seller-products*).
 * ===================================================================== */

const SELLER_DOC_KINDS = ['nid_front', 'nid_back', 'license'];
const SELLER_SSTAT_DONE = ['confirmed', 'packed'];

/* ---------- helpers ---------- */
function seller_docs($s) { $d = json_decode((string)($s['docs'] ?? ''), true); return is_array($d) ? $d : []; }
function seller_chg($s) { $d = json_decode((string)($s['chg'] ?? ''), true); return is_array($d) && $d ? $d : null; }
function seller_public_base() {
    $base = trim((string)cfg('base_url', ''));
    if ($base === '') {
        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
        $dirn = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/index.php')), '/');
        $base = ($https ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . $dirn;
    }
    return rtrim($base, '/') . '/uploads/';
}
function seller_img_url($name) { return ($name && preg_match('/^s\d+_[0-9a-f]{16}\.(jpg|png|webp)$/', $name)) ? seller_public_base() . $name : null; }
function seller_out($s) {
    $docs = seller_docs($s);
    return [
        'id' => (int)$s['id'], 'shop_name' => $s['shop_name'], 'owner_name' => $s['owner_name'], 'mobile' => $s['mobile'], 'email' => $s['email'],
        'address' => $s['address'], 'nid' => $s['nid'], 'trade_no' => $s['trade_no'], 'sell_view' => $s['sell_view'], 'category' => $s['category'], 'about' => $s['about'],
        'logo' => seller_img_url($s['logo']), 'cover' => seller_img_url($s['cover'] ?? null), 'status' => $s['status'], 'reject_reason' => $s['reject_reason'],
        'docs' => ['nid_front' => !empty($docs['nid_front']), 'nid_back' => !empty($docs['nid_back']), 'license' => !empty($docs['license'])],
        'chg' => seller_chg($s), 'created_at' => (int)$s['created_at'], 'approved_at' => $s['approved_at'] === null ? null : (int)$s['approved_at'],
        'photo' => seller_img_url($s['photo'] ?? null), 'hours' => hours_parse($s['hours'] ?? null), 'open_now' => hours_open($s['hours'] ?? null),
        'lat' => isset($s['lat']) && $s['lat'] !== null ? (float)$s['lat'] : null, 'lng' => isset($s['lng']) && $s['lng'] !== null ? (float)$s['lng'] : null,
    ];
}
/** Opening hours and map location: the seller changes these directly (no review). */
function h_seller_shop_update() {
    $s = require_seller(false);
    if ($s['status'] === 'suspended') fail(403, 'Your account is suspended', null, 'suspended');
    $b = body_json(); $set = []; $par = [];
    if (array_key_exists('hours', $b)) { $h = hours_validate($b['hours']); $set[] = 'hours=?'; $par[] = $h ? json_encode($h) : null; }
    if (array_key_exists('lat', $b) || array_key_exists('lng', $b)) {
        $la = $b['lat'] ?? null; $ln = $b['lng'] ?? null;
        if ($la === null && $ln === null) { $set[] = 'lat=NULL'; $set[] = 'lng=NULL'; }
        else {
            // Bangladesh or the UAE (the delivery countries)
            if (!is_num($la) || !is_num($ln) || !geo_in_service((float)$la, (float)$ln)) fail(400, 'Pick your shop location inside Bangladesh or the UAE on the map', 'lat');
            $set[] = 'lat=?'; $par[] = round((float)$la, 7); $set[] = 'lng=?'; $par[] = round((float)$ln, 7);
        }
    }
    if (array_key_exists('address', $b)) { $ad = clean_str($b['address'], 500); if ($ad === '') fail(400, 'Shop address cannot be empty', 'address'); $set[] = 'address=?'; $par[] = $ad; }
    if (!$set) fail(400, 'Nothing to update');
    $par[] = (int)$s['id'];
    q('UPDATE sellers SET ' . implode(',', $set) . ' WHERE id=?', $par);
    json_out(['seller' => seller_out(db_row('SELECT * FROM sellers WHERE id=?', [(int)$s['id']]))]);
}
function seller_nav_url($s) {
    if (isset($s['lat'], $s['lng']) && $s['lat'] !== null && $s['lng'] !== null) return 'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' . rawurlencode((float)$s['lat'] . ',' . (float)$s['lng']);
    return null;
}
function seller_notify($sid, $title, $body = '', $o = []) { return notify('seller', (string)(int)$sid, $title, $body, $o); }
function require_seller($approved = false) {
    $s = current_session();
    if (!$s || $s['role'] !== 'seller') fail(401, 'Authentication required');
    $r = db_row('SELECT * FROM sellers WHERE id=?', [(int)$s['user_id']]);
    if (!$r) fail(401, 'Authentication required');
    if ($approved && $r['status'] === 'suspended') fail(403, 'Your account is suspended', null, 'suspended');
    if ($approved && $r['status'] !== 'approved') fail(403, 'Your account is not approved yet', null, 'not_approved');
    q('UPDATE sellers SET last_seen=? WHERE id=?', [now_ts(), $r['id']]);
    return $r;
}
function seller_validate_profile($b, &$out, $partial = false) {
    $out = [];
    $has = function ($k) use ($b) { return array_key_exists($k, $b); };
    if (!$partial || $has('shop_name')) { $v = clean_str($b['shop_name'] ?? '', 80); if (mb_strlen($v) < 2) fail(400, 'Enter your shop name', 'shop_name'); if (preg_match('/["\\\\\\/<>]/u', $v)) fail(400, 'Shop name cannot contain quotes, slashes or < >', 'shop_name'); $out['shop_name'] = $v; }
    if (!$partial || $has('owner_name')) { $v = clean_str($b['owner_name'] ?? '', 100); if (mb_strlen($v) < 2) fail(400, 'Enter the owner name', 'owner_name'); $out['owner_name'] = $v; }
    if (!$partial || $has('mobile')) { $v = normalize_mobile($b['mobile'] ?? ''); if (!valid_mobile($v)) fail(400, 'Enter a valid mobile number (01XXXXXXXXX)', 'mobile'); $out['mobile'] = $v; }
    if (!$partial || $has('email')) { $v = strtolower(clean_str($b['email'] ?? '', 190)); if ($v !== '' && !valid_email($v)) fail(400, 'Enter a valid email address', 'email'); $out['email'] = $v === '' ? null : $v; }
    if (!$partial || $has('address')) { $v = clean_str($b['address'] ?? '', 500); if ($v === '') fail(400, 'Shop address is required', 'address'); $out['address'] = $v; }
    if (!$partial || $has('nid')) { $v = preg_replace('/\s+/', '', clean_str($b['nid'] ?? '', 40)); if (!preg_match('/^[0-9A-Za-z\-]{6,30}$/', $v)) fail(400, 'Enter a valid NID / ID number', 'nid'); $out['nid'] = $v; }
    if (!$partial || $has('trade_no')) { $v = clean_str($b['trade_no'] ?? '', 80); $out['trade_no'] = $v === '' ? null : $v; }
    // every shop sells on NurBuy Minutes
    if (!$partial || $has('sell_view')) $out['sell_view'] = 'min';
    if (!$partial || $has('category')) { $v = clean_str($b['category'] ?? '', 120); $out['category'] = $v === '' ? null : $v; }
    if (!$partial || $has('about')) { $v = clean_str($b['about'] ?? '', 1000); $out['about'] = $v === '' ? null : $v; }
}
function seller_shop_taken($name, $exceptId = 0) {
    foreach (db_rows('SELECT id, shop_name FROM sellers') as $x) if ((int)$x['id'] !== (int)$exceptId && mb_strtolower(trim($x['shop_name'])) === mb_strtolower(trim($name))) return true;
    list($D) = admin_state();
    if (isset($D['stores']) && is_array($D['stores'])) foreach ($D['stores'] as $st) if (is_array($st) && isset($st['n']) && mb_strtolower(trim((string)$st['n'])) === mb_strtolower($name)) return true;
    return false;
}
function seller_dup_check($mobile, $email, $exceptId = 0) {
    if ($mobile !== null && db_val('SELECT 1 FROM sellers WHERE mobile=? AND id<>?', [$mobile, $exceptId])) fail(409, 'This mobile number is already registered as a seller', 'mobile');
    if ($email !== null && $email !== '' && db_val('SELECT 1 FROM sellers WHERE email=? AND id<>?', [$email, $exceptId])) fail(409, 'This email is already registered as a seller', 'email');
}

/* ---------- auth ---------- */
function h_seller_signup() {
    $b = body_json();
    seller_validate_profile($b, $p);
    $pw = (string)($b['password'] ?? '');
    if (strlen($pw) < 8) fail(400, 'Password must be at least 8 characters', 'password');
    if (strlen($pw) > 200) fail(400, 'Password too long', 'password');
    seller_dup_check($p['mobile'], $p['email']);
    if (seller_shop_taken($p['shop_name'])) fail(409, 'This shop name is already taken', 'shop_name');
    try {
        q('INSERT INTO sellers (shop_name,owner_name,mobile,email,pw_hash,address,nid,trade_no,sell_view,category,about,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [$p['shop_name'], $p['owner_name'], $p['mobile'], $p['email'], password_hash($pw, PASSWORD_DEFAULT), $p['address'], $p['nid'], $p['trade_no'], $p['sell_view'], $p['category'], $p['about'], 'pending', now_ts()]);
    } catch (PDOException $e) {
        if (is_unique_violation($e)) fail(409, 'This shop name, mobile number or email is already registered', 'mobile');
        throw $e;
    }
    $s = db_row('SELECT * FROM sellers WHERE mobile=?', [$p['mobile']]);
    json_out(['token' => create_session($s['id'], 'seller'), 'seller' => seller_out($s)], 201);
}
function h_seller_login() {
    $b = body_json();
    $id = trim((string)($b['id'] ?? ''));
    $pw = (string)($b['password'] ?? '');
    throttle_check('sl');
    $s = null;
    if ($id !== '') {
        if (strpos($id, '@') !== false) $s = db_row('SELECT * FROM sellers WHERE email=?', [strtolower($id)]);
        else $s = db_row('SELECT * FROM sellers WHERE mobile=?', [normalize_mobile($id)]);
    }
    if (!$s || $pw === '' || !password_verify($pw, $s['pw_hash'])) { throttle_fail('sl'); fail(401, 'Invalid mobile/email or password'); }
    throttle_clear('sl');
    json_out(['token' => create_session($s['id'], 'seller'), 'seller' => seller_out($s)]);
}
function h_seller_me() { $s = require_seller(false); json_out(['seller' => seller_out($s)]); }
function h_seller_me_update() {
    $s = require_seller(false);
    if ($s['status'] === 'suspended') fail(403, 'Your account is suspended', null, 'suspended');
    $b = body_json();
    $direct = ['owner_name', 'address', 'about', 'category'];
    $guarded = ['mobile', 'email'];
    if ($s['status'] === 'approved') {
        $in = []; foreach (array_merge($direct, $guarded) as $k) if (array_key_exists($k, $b)) $in[$k] = $b[$k];
        if (!$in) fail(400, 'Nothing to update');
        seller_validate_profile($in, $p, true);
        $set = []; $par = []; $chg = seller_chg($s) ?: [];
        foreach ($p as $k => $v) {
            if (in_array($k, $guarded, true)) {
                if ((string)$v === (string)($s[$k] ?? '')) { unset($chg[$k]); continue; }
                if ($k === 'mobile' || $k === 'email') seller_dup_check($k === 'mobile' ? $v : null, $k === 'email' ? $v : null, (int)$s['id']);
                $chg[$k] = $v;
            } else { $set[] = "$k=?"; $par[] = $v; }
        }
        $set[] = 'chg=?'; $par[] = $chg ? json_encode($chg, JSON_UNESCAPED_UNICODE) : null;
        $par[] = $s['id'];
        q('UPDATE sellers SET ' . implode(',', $set) . ' WHERE id=?', $par);
    } else {
        seller_validate_profile($b, $p, true);
        if (isset($p['shop_name']) && seller_shop_taken($p['shop_name'], (int)$s['id'])) fail(409, 'This shop name is already taken', 'shop_name');
        seller_dup_check($p['mobile'] ?? null, $p['email'] ?? null, (int)$s['id']);
        $set = []; $par = [];
        foreach ($p as $k => $v) { $set[] = "$k=?"; $par[] = $v; }
        if (!$set) fail(400, 'Nothing to update');
        $par[] = $s['id'];
        try { q('UPDATE sellers SET ' . implode(',', $set) . ' WHERE id=?', $par); }
        catch (PDOException $e) { if (is_unique_violation($e)) fail(409, 'Already registered', 'mobile'); throw $e; }
    }
    json_out(['seller' => seller_out(db_row('SELECT * FROM sellers WHERE id=?', [$s['id']]))]);
}
function h_seller_reapply() {
    $s = require_seller(false);
    if ($s['status'] !== 'rejected') fail(409, 'Only a rejected application can be re-submitted');
    q("UPDATE sellers SET status='pending', reject_reason=NULL WHERE id=?", [$s['id']]);
    json_out(['seller' => seller_out(db_row('SELECT * FROM sellers WHERE id=?', [$s['id']]))]);
}
function h_seller_password() {
    $s = require_seller(false);
    $b = body_json();
    if (!password_verify((string)($b['current'] ?? ''), $s['pw_hash'])) fail(400, 'Current password is incorrect', 'current');
    $pw = (string)($b['password'] ?? '');
    if (strlen($pw) < 8) fail(400, 'Password must be at least 8 characters', 'password');
    if (strlen($pw) > 200) fail(400, 'Password too long', 'password');
    q('UPDATE sellers SET pw_hash=? WHERE id=?', [password_hash($pw, PASSWORD_DEFAULT), $s['id']]);
    q("DELETE FROM sessions WHERE role='seller' AND user_id=? AND token<>?", [(string)$s['id'], (string)bearer_token()]);
    json_out(['ok' => true]);
}

/* ---------- uploads ---------- */
function seller_read_upload($pdfOk, $maxMb = UPLOAD_MAX_MB) {
    $u = upload_take('file', $pdfOk ? ['application/pdf' => 'pdf'] : [], $maxMb, ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp']);
    return [$u['tmp'], $u['ext'], $u];
}
function seller_public_dir() {
    $dir = dirname(__DIR__) . '/uploads';
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) fail(500, 'Upload folder is not available');
    return $dir;
}
function h_seller_upload() {
    upload_guard();
    $s = require_seller(false);
    if ($s['status'] === 'suspended') fail(403, 'Your account is suspended', null, 'suspended');
    $kind = (string)($_POST['kind'] ?? '');
    $sid = (int)$s['id'];
    if (in_array($kind, SELLER_DOC_KINDS, true)) {
        list($tmp, $ext) = seller_read_upload(true);
        $dir = rider_priv_dir();
        $name = 's' . $sid . '_' . $kind . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
        if (!@move_uploaded_file($tmp, $dir . '/' . $name)) fail(500, 'Could not save file');
        @chmod($dir . '/' . $name, 0640);
        $docs = seller_docs($s); $old = $docs[$kind] ?? null; $docs[$kind] = $name;
        q('UPDATE sellers SET docs=? WHERE id=?', [json_encode($docs), $sid]);
        if ($old && preg_match('/^s\d+_[a-z_]+_[0-9a-f]{16}\.(jpg|png|webp|pdf)$/', $old)) @unlink($dir . '/' . $old);
        json_out(['seller' => seller_out(db_row('SELECT * FROM sellers WHERE id=?', [$sid]))]);
    }
    if ($kind === 'logo' || $kind === 'product' || $kind === 'cover' || $kind === 'photo') {
        if (($kind === 'product' || $kind === 'cover') && $s['status'] !== 'approved') fail(403, 'Your account is not approved yet', null, 'not_approved');
        $dir = seller_public_dir();
        if (count(glob($dir . '/s' . $sid . '_*') ?: []) >= 600) fail(429, 'Too many uploaded images. Delete unused products first.');
        list($tmp, $ext, $up) = seller_read_upload(false);
        $name = 's' . $sid . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
        upload_store($up, $dir . '/' . $name, $kind === 'cover' ? 2400 : 1800);
        if ($kind === 'logo' || $kind === 'cover' || $kind === 'photo') {
            $old = $s[$kind] ?? null;
            q('UPDATE sellers SET ' . $kind . '=? WHERE id=?', [$name, $sid]);
            if ($old && preg_match('/^s' . $sid . '_[0-9a-f]{16}\.(jpg|png|webp)$/', $old)) @unlink($dir . '/' . $old);
            json_out(['seller' => seller_out(db_row('SELECT * FROM sellers WHERE id=?', [$sid]))]);
        }
        json_out(['name' => $name, 'url' => seller_public_base() . $name]);
    }
    fail(400, 'Invalid upload type', 'kind');
}
function seller_send_file($s, $kind) {
    if (!in_array($kind, SELLER_DOC_KINDS, true)) fail(400, 'Invalid document type', 'kind');
    $name = seller_docs($s)[$kind] ?? null;
    if (!$name || !preg_match('/^s\d+_[a-z_]+_[0-9a-f]{16}\.(jpg|png|webp|pdf)$/', $name)) fail(404, 'File not found');
    $path = rider_priv_dir() . '/' . $name;
    if (!is_file($path)) fail(404, 'File not found');
    $types = ['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'pdf' => 'application/pdf'];
    header('Content-Type: ' . $types[pathinfo($name, PATHINFO_EXTENSION)]);
    header('Content-Length: ' . filesize($path));
    header('Cache-Control: private, no-store');
    header('X-Content-Type-Options: nosniff');
    readfile($path);
    exit;
}
function h_seller_file() { $s = require_seller(false); seller_send_file($s, (string)($_GET['kind'] ?? 'nid_front')); }

/* ---------- products ---------- */
function seller_cats() { return cat_tree(true); }
/** Sub-categories of an admin category as [['n'=>..,'b'=>..], ...]. */
function cat_subs($c) {
    $o = [];
    if (isset($c['subs']) && is_array($c['subs'])) foreach ($c['subs'] as $x) {
        if (is_string($x)) $x = ['n' => $x, 'b' => $x];
        if (!is_array($x)) continue;
        $n = trim((string)($x['n'] ?? '')); if ($n === '') continue;
        $o[] = ['n' => mb_substr($n, 0, 120), 'b' => mb_substr(trim((string)($x['b'] ?? '')) ?: $n, 0, 120)];
    }
    return $o;
}
/** Specifications JSON/array -> clean [[key, value], ...] (max 20 rows). */
function clean_specs($v) {
    if (is_string($v)) { $d = json_decode($v, true); $v = is_array($d) ? $d : []; }
    $o = [];
    if (is_array($v)) foreach ($v as $r) {
        if (is_array($r) && array_key_exists('k', $r)) $r = [$r['k'], $r['v'] ?? ''];
        if (!is_array($r) || count($r) < 2) continue;
        $k = clean_str($r[0], 60); $x = clean_str($r[1], 200);
        if ($k === '' || $x === '') continue;
        $o[] = [$k, $x];
        if (count($o) >= 20) break;
    }
    return $o;
}
function h_seller_meta() {
    $s = require_seller(false);
    list($D) = admin_state();
    $S = (isset($D['set']) && is_array($D['set'])) ? $D['set'] : [];
    json_out(['cats' => seller_cats(), 'attrs' => seller_effective_attrs(), 'site' => (isset($S['name']) && is_string($S['name']) && $S['name'] !== '') ? $S['name'] : 'NurBuy', 'sell_view' => $s['sell_view']]);
}
function seller_images($p) { $d = json_decode((string)($p['imgs'] ?? ''), true); return is_array($d) ? array_values(array_filter($d, 'is_string')) : []; }

/* ---------- attribute catalog + product variants ---------- */
const DEFAULT_ATTRS = [
    ['id' => 'size', 'n' => 'Size', 'bn' => 'সাইজ', 't' => 'chip', 'opts' => [
        ['n' => 'XS', 'bn' => 'XS'], ['n' => 'S', 'bn' => 'S'], ['n' => 'M', 'bn' => 'M'], ['n' => 'L', 'bn' => 'L'], ['n' => 'XL', 'bn' => 'XL'], ['n' => 'XXL', 'bn' => 'XXL'],
        ['n' => 'Free Size', 'bn' => 'ফ্রি সাইজ'], ['n' => '38', 'bn' => '৩৮'], ['n' => '39', 'bn' => '৩৯'], ['n' => '40', 'bn' => '৪০'], ['n' => '41', 'bn' => '৪১'], ['n' => '42', 'bn' => '৪২'], ['n' => '43', 'bn' => '৪৩'], ['n' => '44', 'bn' => '৪৪']],
     'cats' => ['Fashion', 'Shoes', 'Food', 'Electronics', 'Cosmetics']],
    ['id' => 'color', 'n' => 'Color', 'bn' => 'রঙ', 't' => 'color', 'opts' => [
        ['n' => 'Black', 'bn' => 'কালো', 'hex' => '#222222'], ['n' => 'White', 'bn' => 'সাদা', 'hex' => '#FFFFFF'], ['n' => 'Red', 'bn' => 'লাল', 'hex' => '#D32F2F'],
        ['n' => 'Blue', 'bn' => 'নীল', 'hex' => '#1976D2'], ['n' => 'Navy', 'bn' => 'নেভি', 'hex' => '#1A237E'], ['n' => 'Green', 'bn' => 'সবুজ', 'hex' => '#388E3C'],
        ['n' => 'Yellow', 'bn' => 'হলুদ', 'hex' => '#FBC02D'], ['n' => 'Orange', 'bn' => 'কমলা', 'hex' => '#F57C00'], ['n' => 'Pink', 'bn' => 'গোলাপি', 'hex' => '#EC407A'],
        ['n' => 'Purple', 'bn' => 'বেগুনি', 'hex' => '#7B1FA2'], ['n' => 'Brown', 'bn' => 'বাদামি', 'hex' => '#6D4C41'], ['n' => 'Grey', 'bn' => 'ধূসর', 'hex' => '#9E9E9E']],
     'cats' => ['Fashion', 'Shoes', 'Electronics', 'Cosmetics']],
    ['id' => 'weight', 'n' => 'Weight', 'bn' => 'ওজন', 't' => 'chip', 'opts' => [
        ['n' => '250 g', 'bn' => '২৫০ গ্রাম'], ['n' => '500 g', 'bn' => '৫০০ গ্রাম'], ['n' => '1 kg', 'bn' => '১ কেজি'], ['n' => '2 kg', 'bn' => '২ কেজি'], ['n' => '5 kg', 'bn' => '৫ কেজি'], ['n' => '10 kg', 'bn' => '১০ কেজি']],
     'cats' => ['Grocery', 'Food']],
    ['id' => 'pack', 'n' => 'Pack Size', 'bn' => 'প্যাক সাইজ', 't' => 'chip', 'opts' => [
        ['n' => 'Single', 'bn' => 'একক'], ['n' => 'Pack of 2', 'bn' => '২টির প্যাক'], ['n' => 'Pack of 6', 'bn' => '৬টির প্যাক'], ['n' => 'Pack of 12', 'bn' => '১২টির প্যাক'], ['n' => 'Carton', 'bn' => 'কার্টন']],
     'cats' => ['Grocery']],
    ['id' => 'volume', 'n' => 'Volume', 'bn' => 'পরিমাণ', 't' => 'chip', 'opts' => [
        ['n' => '100 ml', 'bn' => '১০০ মিলি'], ['n' => '250 ml', 'bn' => '২৫০ মিলি'], ['n' => '500 ml', 'bn' => '৫০০ মিলি'], ['n' => '1 L', 'bn' => '১ লিটার'], ['n' => '2 L', 'bn' => '২ লিটার'], ['n' => '5 L', 'bn' => '৫ লিটার']],
     'cats' => ['Grocery', 'Cosmetics']],
    ['id' => 'material', 'n' => 'Material', 'bn' => 'উপাদান', 't' => 'chip', 'opts' => [
        ['n' => 'Cotton', 'bn' => 'সুতি'], ['n' => 'Polyester', 'bn' => 'পলিয়েস্টার'], ['n' => 'Leather', 'bn' => 'চামড়া'], ['n' => 'Denim', 'bn' => 'ডেনিম'], ['n' => 'Silk', 'bn' => 'সিল্ক'],
        ['n' => 'Wool', 'bn' => 'উল'], ['n' => 'Plastic', 'bn' => 'প্লাস্টিক'], ['n' => 'Metal', 'bn' => 'ধাতু'], ['n' => 'Wood', 'bn' => 'কাঠ']],
     'cats' => ['Fashion', 'Shoes']],
    ['id' => 'model', 'n' => 'Model', 'bn' => 'মডেল', 't' => 'chip', 'opts' => [], 'cats' => ['Electronics']],
    ['id' => 'ram', 'n' => 'RAM', 'bn' => 'র‍্যাম', 't' => 'chip', 'opts' => [
        ['n' => '2 GB', 'bn' => '২ জিবি'], ['n' => '4 GB', 'bn' => '৪ জিবি'], ['n' => '6 GB', 'bn' => '৬ জিবি'], ['n' => '8 GB', 'bn' => '৮ জিবি'], ['n' => '12 GB', 'bn' => '১২ জিবি'], ['n' => '16 GB', 'bn' => '১৬ জিবি']],
     'cats' => ['Electronics']],
    ['id' => 'storage', 'n' => 'Storage', 'bn' => 'স্টোরেজ', 't' => 'chip', 'opts' => [
        ['n' => '32 GB', 'bn' => '৩২ জিবি'], ['n' => '64 GB', 'bn' => '৬৪ জিবি'], ['n' => '128 GB', 'bn' => '১২৮ জিবি'], ['n' => '256 GB', 'bn' => '২৫৬ জিবি'], ['n' => '512 GB', 'bn' => '৫১২ জিবি'], ['n' => '1 TB', 'bn' => '১ টিবি']],
     'cats' => ['Electronics']],
    ['id' => 'flavor', 'n' => 'Flavor', 'bn' => 'স্বাদ', 't' => 'chip', 'opts' => [
        ['n' => 'Original', 'bn' => 'অরিজিনাল'], ['n' => 'Chocolate', 'bn' => 'চকলেট'], ['n' => 'Vanilla', 'bn' => 'ভ্যানিলা'], ['n' => 'Strawberry', 'bn' => 'স্ট্রবেরি'],
        ['n' => 'Mango', 'bn' => 'আম'], ['n' => 'Lemon', 'bn' => 'লেবু'], ['n' => 'Mint', 'bn' => 'পুদিনা'], ['n' => 'Spicy', 'bn' => 'ঝাল']],
     'cats' => ['Grocery', 'Food']],
    ['id' => 'fragrance', 'n' => 'Fragrance', 'bn' => 'ঘ্রাণ', 't' => 'chip', 'opts' => [
        ['n' => 'Rose', 'bn' => 'গোলাপ'], ['n' => 'Jasmine', 'bn' => 'বেলি'], ['n' => 'Lavender', 'bn' => 'ল্যাভেন্ডার'], ['n' => 'Sandalwood', 'bn' => 'চন্দন'], ['n' => 'Musk', 'bn' => 'মাস্ক'], ['n' => 'Citrus', 'bn' => 'সাইট্রাস'], ['n' => 'Unscented', 'bn' => 'গন্ধহীন']],
     'cats' => ['Cosmetics']],
    ['id' => 'style', 'n' => 'Style', 'bn' => 'স্টাইল', 't' => 'chip', 'opts' => [
        ['n' => 'Casual', 'bn' => 'ক্যাজুয়াল'], ['n' => 'Formal', 'bn' => 'ফরমাল'], ['n' => 'Party', 'bn' => 'পার্টি'], ['n' => 'Sports', 'bn' => 'স্পোর্টস'], ['n' => 'Traditional', 'bn' => 'ঐতিহ্যবাহী']],
     'cats' => ['Fashion']],
    ['id' => 'qty', 'n' => 'Quantity', 'bn' => 'পরিমাণ (সংখ্যা)', 't' => 'chip', 'opts' => [
        ['n' => '1 pc', 'bn' => '১ পিস'], ['n' => '2 pcs', 'bn' => '২ পিস'], ['n' => '6 pcs', 'bn' => '৬ পিস'], ['n' => '12 pcs', 'bn' => '১২ পিস'], ['n' => 'Dozen', 'bn' => 'ডজন']],
     'cats' => ['Grocery', 'Food']],
];
/** Effective attribute catalog: admin_state.attrs when it holds at least one valid entry, otherwise DEFAULT_ATTRS. */
function seller_effective_attrs() {
    list($D) = admin_state();
    $out = [];
    if (isset($D['attrs']) && is_array($D['attrs'])) foreach ($D['attrs'] as $a) {
        if (!is_array($a)) continue;
        $n = clean_str($a['n'] ?? '', 60); $id = clean_str($a['id'] ?? '', 40);
        if ($n === '') continue;
        if ($id === '') $id = mb_strtolower(preg_replace('/\s+/', '_', $n));
        $t = (($a['t'] ?? '') === 'color') ? 'color' : 'chip';
        $opts = [];
        if (isset($a['opts']) && is_array($a['opts'])) foreach ($a['opts'] as $o) {
            if (is_string($o)) $o = ['n' => $o];
            if (!is_array($o)) continue;
            $on = clean_str($o['n'] ?? '', 60); if ($on === '') continue;
            $x = ['n' => $on, 'bn' => clean_str($o['bn'] ?? '', 60) ?: $on];
            if ($t === 'color') { $h = (string)($o['hex'] ?? ''); $x['hex'] = preg_match('/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/', $h) ? $h : '#cccccc'; }
            $opts[] = $x;
            if (count($opts) >= 200) break;
        }
        $cats = [];
        if (isset($a['cats']) && is_array($a['cats'])) foreach ($a['cats'] as $c) if (is_string($c) && trim($c) !== '') $cats[] = trim($c);
        $out[] = ['id' => $id, 'n' => $n, 'bn' => clean_str($a['bn'] ?? '', 60) ?: $n, 't' => $t, 'opts' => $opts, 'cats' => $cats];
        if (count($out) >= 100) break;
    }
    return $out ?: DEFAULT_ATTRS;
}

function seller_vr_parse($json) {
    if (is_array($json)) $d = $json; else { $d = json_decode((string)$json, true); }
    return (is_array($d) && !empty($d['v']) && is_array($d['v'])) ? $d : null;
}
function seller_vr_img_name($v) {
    if (!is_string($v) || $v === '') return '';
    if (preg_match('#([^/]+)$#', $v, $m)) { $v = $m[1]; $v = preg_replace('/[?#].*$/', '', $v); }
    return $v;
}
/** Validates + normalizes a variants object from the seller; returns the clean structure. */
function seller_vr_validate($raw, $s, $stockOn = true) {
    $bad = function ($m) { fail(400, $m, 'vr'); };
    if (!is_array($raw)) $bad('Invalid variants');
    $vs = $raw['v'] ?? null;
    if (!is_array($vs) || count($vs) < 1) $bad('Add at least one variant');
    if (count($vs) > 100) $bad('At most 100 variants');
    $attrs = []; $names = []; $hasColor = false;
    $ra = $raw['a'] ?? [];
    if (!is_array($ra) || count($ra) > 10) $bad('Invalid variant attributes');
    foreach ($ra as $a) {
        if (!is_array($a)) $bad('Invalid variant attribute');
        $n = clean_str($a['n'] ?? '', 60); if ($n === '') $bad('Variant attribute name is required');
        if (isset($names[mb_strtolower($n)])) $bad('Duplicate variant attribute: ' . $n);
        $names[mb_strtolower($n)] = $n;
        $t = (($a['t'] ?? '') === 'color') ? 'color' : 'chip';
        if ($t === 'color') $hasColor = true;
        $attrs[] = ['n' => $n, 't' => $t];
    }
    $hex = [];
    if (isset($raw['hex'])) {
        if (!is_array($raw['hex'])) $bad('Invalid colour swatches');
        foreach ($raw['hex'] as $k => $h) {
            if (!is_string($h) || !preg_match('/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/', $h)) $bad('Invalid colour code');
            if ($hasColor) $hex[clean_str((string)$k, 60)] = $h;
        }
    }
    $ids = []; $out = [];
    foreach ($vs as $v) {
        if (!is_array($v)) $bad('Invalid variant');
        $id = $v['id'] ?? null;
        if (!is_string($id) || !preg_match('/^[A-Za-z0-9_-]{1,20}$/', $id)) $bad('Each variant needs a valid id');
        if (isset($ids[$id])) $bad('Duplicate variant id: ' . $id);
        $ids[$id] = true;
        $name = clean_str($v['name'] ?? '', 150); if ($name === '') $bad('Each variant needs a name');
        if (!isset($v['price']) || !is_num($v['price']) || (float)$v['price'] <= 0 || (float)$v['price'] > 10000000) $bad('Enter a valid variant price');
        $price = money($v['price']);
        $old = (isset($v['old']) && $v['old'] !== '' && $v['old'] !== null) ? $v['old'] : 0;
        if (!is_num($old) || (float)$old < 0 || (float)$old > 10000000) $bad('Enter a valid variant old price');
        $old = money($old);
        if ($old > 0 && $old < $price) $bad('Variant old price must be higher than its selling price');
        $stock = $v['stock'] ?? 0;
        if (!$stockOn && ($stock === '' || $stock === null)) $stock = 0;
        if (!is_num($stock) || (float)$stock != floor((float)$stock) || (int)$stock < 0 || (int)$stock > 1000000) $bad('Enter a valid variant stock');
        $low = $v['low'] ?? 0;
        if (!is_num($low) || (float)$low != floor((float)$low) || (int)$low < 0 || (int)$low > 1000000) $bad('Enter a valid low-stock level');
        $o = [];
        if (isset($v['o'])) {
            if (!is_array($v['o'])) $bad('Invalid variant options');
            foreach ($v['o'] as $k => $val) {
                if (!isset($names[mb_strtolower((string)$k)])) $bad('Variant option uses an unknown attribute: ' . $k);
                $x = clean_str($val, 60); if ($x === '') $bad('Variant option value is empty');
                $o[$names[mb_strtolower((string)$k)]] = $x;
            }
        }
        $img = seller_vr_img_name($v['img'] ?? '');
        if ($img !== '') {
            if (!preg_match('/^s' . (int)$s['id'] . '_[0-9a-f]{16}\.(jpg|png|webp)$/', $img)) $bad('Invalid variant photo');
            if (!is_file(seller_public_dir() . '/' . $img)) $bad('A variant photo was not uploaded properly. Upload it again.');
        }
        $on = $v['on'] ?? 1;
        $out[] = ['id' => $id, 'name' => $name, 'o' => $o, 'sku' => clean_str($v['sku'] ?? '', 60), 'price' => $price, 'old' => $old, 'stock' => (int)$stock, 'low' => (int)$low,
                  'img' => $img, 'bar' => clean_str($v['bar'] ?? '', 60), 'wt' => clean_str($v['wt'] ?? '', 40), 'on' => ($on === false || $on === 0 || $on === '0' || $on === null) ? 0 : 1];
    }
    return ['a' => $attrs, 'hex' => $hex, 'v' => $out];
}
/** Derived product-level [price, old, stock]: cheapest active variant, its old price, stock summed over active variants. */
function seller_vr_derive($vr) {
    $best = null; $stock = 0;
    foreach ($vr['v'] as $v) { if ((int)($v['on'] ?? 1)) { $stock += (int)$v['stock']; if ($best === null || money($v['price']) < money($best['price'])) $best = $v; } }
    if ($best === null) foreach ($vr['v'] as $v) if ($best === null || money($v['price']) < money($best['price'])) $best = $v;
    return [money($best['price']), money($best['old'] ?? 0), $stock];
}
function seller_vr_encode($vr) {
    if (!$vr) return null;
    if (empty($vr['hex'])) $vr['hex'] = new stdClass();
    foreach ($vr['v'] as $i => $v) if (empty($v['o'])) $vr['v'][$i]['o'] = new stdClass();
    return json_encode($vr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
/** JSON-ready variants for output; $public keeps only active variants and omits sku/barcode/low. */
function seller_vr_out($vr, $public = false) {
    if (!$vr) return null;
    $vs = [];
    foreach ($vr['v'] as $v) {
        if ($public && !(int)($v['on'] ?? 1)) continue;
        $x = ['id' => (string)$v['id'], 'name' => (string)$v['name'], 'o' => empty($v['o']) ? new stdClass() : $v['o']];
        if (!$public) $x['sku'] = (string)($v['sku'] ?? '');
        $x['price'] = money($v['price']); $x['old'] = money($v['old'] ?? 0); $x['stock'] = (int)$v['stock'];
        if (!$public) $x['low'] = (int)($v['low'] ?? 0);
        $x['img'] = ($v['img'] ?? '') !== '' ? (seller_img_url(seller_vr_img_name($v['img'])) ?: '') : '';
        if (!$public) $x['bar'] = (string)($v['bar'] ?? '');
        $x['wt'] = (string)($v['wt'] ?? ''); $x['on'] = (int)($v['on'] ?? 1);
        $vs[] = $x;
    }
    return ['a' => $vr['a'] ?? [], 'hex' => empty($vr['hex']) ? new stdClass() : $vr['hex'], 'v' => $vs];
}
function seller_vr_files($vr) {
    $o = [];
    if ($vr) foreach ($vr['v'] as $v) { $n = seller_vr_img_name($v['img'] ?? ''); if ($n !== '') $o[] = $n; }
    return $o;
}
/** Comparison key for the review flow: everything except live stock / on-off state. */
function seller_vr_reviewkey($vr) {
    if (!$vr) return '';
    foreach ($vr['v'] as $i => $v) { unset($vr['v'][$i]['stock'], $vr['v'][$i]['on']); }
    return json_encode($vr, JSON_UNESCAPED_UNICODE);
}
/** Writes new variants to a product row and refreshes the derived price/old/stock columns. */
function seller_vr_save($pid, $vr) {
    list($pr, $ol, $st) = seller_vr_derive($vr);
    q('UPDATE seller_products SET vr=?, price=?, old=?, stock=?, updated_at=? WHERE id=?', [seller_vr_encode($vr), $pr, $ol, $st, now_ts(), (int)$pid]);
}
/** Changes one variant's stock by $delta (clamped at 0) and refreshes product stock. Returns false when the variant does not exist. */
function seller_vr_adjust($pid, $vid, $delta) {
    $row = db_row('SELECT vr FROM seller_products WHERE id=?' . lock_suffix(), [(int)$pid]);
    $vr = $row ? seller_vr_parse($row['vr']) : null;
    if (!$vr) return false;
    $hit = false;
    foreach ($vr['v'] as $i => $v) if ((string)$v['id'] === (string)$vid) { $vr['v'][$i]['stock'] = max(0, (int)$v['stock'] + (int)$delta); $hit = true; }
    if (!$hit) return false;
    list($pr, $ol, $st) = seller_vr_derive($vr);
    q('UPDATE seller_products SET vr=?, price=?, old=?, stock=? WHERE id=?', [seller_vr_encode($vr), $pr, $ol, $st, (int)$pid]);
    return true;
}
/** Order create: reject items whose selected variant is inactive / missing / short on stock (409). */
function seller_check_variant_items($items) {
    $need = [];
    foreach ($items as $i) {
        if (!isset($i['vid']) || $i['vid'] === '' || !isset($i['id']) || !preg_match('/^SP(\d+)$/', (string)$i['id'], $mm)) continue;
        $row = db_row('SELECT vr, stock_on FROM seller_products WHERE id=?' . lock_suffix(), [(int)$mm[1]]);
        $vr = $row ? seller_vr_parse($row['vr']) : null;
        if (!$vr) continue;
        $k = $mm[1] . '|' . $i['vid'];
        $need[$k] = ($need[$k] ?? 0) + (int)$i['q'];
        $ok = false; $track = seller_stock_on($row);
        foreach ($vr['v'] as $v) if ((string)$v['id'] === (string)$i['vid'] && (int)$v['on'] === 1 && (!$track || (int)$v['stock'] >= $need[$k])) $ok = true;
        if (!$ok) fail(409, 'Selected variant is out of stock', 'items', 'variant_out_of_stock');
    }
}
/* ---- product tags: up to 10 short search words per product, stored comma separated ---- */
function tags_clean($v) {
    if (is_string($v)) $v = preg_split('/[,\n\x{060C}]+/u', $v);
    if (!is_array($v)) return [];
    $out = []; $seen = [];
    foreach ($v as $t) {
        if (!is_string($t) && !is_numeric($t)) continue;
        $t = trim(preg_replace('/\s+/u', ' ', (string)$t), " \t#");
        if ($t === '') continue;
        if (mb_strlen($t) > 30) fail(400, 'Each tag can be at most 30 characters', 'tags');
        $k = mb_strtolower($t);
        if (isset($seen[$k])) continue;
        $seen[$k] = 1; $out[] = $t;
    }
    if (count($out) > 10) fail(400, 'You can add at most 10 tags', 'tags');
    return $out;
}
function tags_parse($raw) { return $raw === null || $raw === '' ? [] : array_values(array_filter(array_map('trim', explode(',', (string)$raw)), 'strlen')); }
function seller_product_core($p) {
    return ['name' => $p['name'], 'bn' => $p['bn'], 'price' => money($p['price']), 'old' => money($p['old']), 'cat' => $p['cat'], 'sub' => (string)($p['sub'] ?? ''), 'cat_id' => isset($p['cat_id']) && $p['cat_id'] !== null ? (int)$p['cat_id'] : null, 'v' => $p['v'], 'about' => $p['about'], 'specs' => clean_specs($p['specs'] ?? ''), 'imgs' => seller_images($p), 'vr' => seller_vr_parse($p['vr'] ?? null),
            'about_bn' => $p['about_bn'] ?? null, 'stock_on' => (int)($p['stock_on'] ?? 1), 'max_q' => (int)($p['max_q'] ?? 0), 'tags' => tags_parse($p['tags'] ?? null)];
}
function seller_stock_on($p) { return !isset($p['stock_on']) || (int)$p['stock_on'] !== 0; }
function seller_product_out($p, $withChg = true) {
    $imgs = seller_images($p);
    $o = [
        'id' => (int)$p['id'], 'name' => $p['name'], 'bn' => $p['bn'], 'price' => money($p['price']), 'old' => money($p['old']), 'stock' => (int)$p['stock'],
        'cat' => $p['cat'], 'sub' => (string)($p['sub'] ?? ''), 'cat_id' => isset($p['cat_id']) && $p['cat_id'] !== null ? (int)$p['cat_id'] : null,
        'cat_path' => isset($p['cat_id']) && $p['cat_id'] ? (cat_product_fields((int)$p['cat_id'])['cnames'] ?? []) : [],
        'v' => $p['v'], 'about' => $p['about'], 'specs' => clean_specs($p['specs'] ?? ''), 'imgs' => $imgs, 'img_urls' => array_map('seller_img_url', $imgs),
        'status' => $p['status'], 'hidden' => (int)$p['hidden'], 'reject_reason' => $p['reject_reason'], 'sold' => (int)$p['sold'],
        'created_at' => (int)$p['created_at'], 'updated_at' => (int)$p['updated_at'],
        'vr' => seller_vr_out(seller_vr_parse($p['vr'] ?? null)),
        'about_bn' => $p['about_bn'] ?? null, 'stock_on' => (int)($p['stock_on'] ?? 1), 'max_q' => (int)($p['max_q'] ?? 0), 'pcode' => (string)($p['pcode'] ?? ''), 'tags' => tags_parse($p['tags'] ?? null),
    ];
    if ($withChg) {
        $c = json_decode((string)($p['chg'] ?? ''), true);
        if (is_array($c) && $c) {
            if (isset($c['imgs']) && is_array($c['imgs'])) $c['img_urls'] = array_map('seller_img_url', $c['imgs']);
            if (array_key_exists('vr', $c)) $c['vr'] = seller_vr_out(seller_vr_parse($c['vr']));
            $o['chg'] = $c;
        } else $o['chg'] = null;
    }
    return $o;
}
/* ---- product ID (pcode): one unique code per product, shared by admin and seller products ---- */
function pcode_clean($v) {
    $v = is_string($v) ? trim($v) : '';
    if ($v === '') return '';
    if (!preg_match('/^[A-Za-z0-9][A-Za-z0-9._-]{2,29}$/', $v)) fail(400, 'Product ID must be 3 to 30 letters, numbers, dot, dash or underscore', 'pcode');
    return strtoupper($v);
}
/** true when another product (seller or admin) already uses this code. $selfSeller = seller_products id to ignore, $selfAdmin = admin product id to ignore */
function pcode_taken($code, $selfSeller = null, $selfAdmin = null) {
    if ($code === '') return false;
    $r = db_row('SELECT id FROM seller_products WHERE UPPER(pcode)=? AND id<>?', [strtoupper($code), (int)($selfSeller ?? 0)]);
    if ($r) return true;
    $row = kv_get('admin_state'); $st = $row ? json_decode($row['v'], true) : null;
    if (is_array($st) && isset($st['products']) && is_array($st['products'])) {
        foreach ($st['products'] as $p) {
            if (!is_array($p) || !isset($p['pcode']) || !is_string($p['pcode'])) continue;
            if (strtoupper($p['pcode']) === strtoupper($code) && ($selfAdmin === null || (string)($p['id'] ?? '') !== (string)$selfAdmin)) return true;
        }
    }
    return false;
}
function pcode_new() {
    for ($i = 0; $i < 30; $i++) {
        $c = 'NB-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 7));
        if (!pcode_taken($c)) return $c;
    }
    return 'NB-' . strtoupper(bin2hex(random_bytes(6)));
}
function pcode_dup_fail() { fail(409, 'This Product ID is already used by another product. Please choose a different one.', 'pcode'); }
function h_admin_pcode_check() {
    require_admin();
    $c = pcode_clean($_GET['code'] ?? '');
    json_out(['code' => $c, 'taken' => $c !== '' && pcode_taken($c, null, isset($_GET['id']) ? (string)$_GET['id'] : null), 'new' => pcode_new()]);
}
function h_seller_pcode_new() { require_seller(true); json_out(['code' => pcode_new()]); }
function seller_product_validate($b, $s, &$out, $partial) {
    $out = [];
    $has = function ($k) use ($b) { return array_key_exists($k, $b); };
    // stock is optional: stock_on=0 means the seller does not track a quantity (always available)
    $stockOn = !($has('stock_on') && ($b['stock_on'] === false || $b['stock_on'] === 0 || $b['stock_on'] === '0'));
    if (!$partial || $has('stock_on')) $out['stock_on'] = $stockOn ? 1 : 0;
    if (!$partial || $has('max_q')) {
        $m = $b['max_q'] ?? 0;
        if ($m === '' || $m === null) $m = 0;
        if (!is_num($m) || (float)$m != floor((float)$m) || (int)$m < 0 || (int)$m > 99) fail(400, 'Maximum order limit must be 1 to 99, or empty for no limit', 'max_q');
        $out['max_q'] = (int)$m;
    }
    if (!$partial || $has('about_bn')) { $v = clean_str($b['about_bn'] ?? '', 3000); $out['about_bn'] = $v === '' ? null : $v; }
    if (!$partial || $has('pcode')) $out['pcode'] = pcode_clean($b['pcode'] ?? '');
    if (!$partial || $has('tags')) $out['tags'] = tags_clean($b['tags'] ?? []);
    $vr = null;
    if (array_key_exists('vr', $b) && $b['vr'] !== null && $b['vr'] !== [] && $b['vr'] !== '') {
        $vr = seller_vr_validate($b['vr'], $s, $stockOn);
        list($dp, $do, $ds) = seller_vr_derive($vr);
        $out['price'] = $dp; $out['old'] = $do; $out['stock'] = $ds;
    }
    if (!$partial || $has('vr')) $out['vr'] = $vr;
    if (!$partial || $has('name')) { $v = clean_str($b['name'] ?? '', 150); if (mb_strlen($v) < 2) fail(400, 'Enter the product name', 'name'); $out['name'] = $v; }
    if (!$partial || $has('bn')) { $v = clean_str($b['bn'] ?? '', 150); $out['bn'] = $v === '' ? null : $v; }
    if (!$vr && (!$partial || $has('price'))) {
        if (!isset($b['price']) || !is_num($b['price']) || (float)$b['price'] <= 0 || (float)$b['price'] > 10000000) fail(400, 'Enter a valid price', 'price');
        $out['price'] = money($b['price']);
    }
    if (!$vr && (!$partial || $has('old'))) {
        $v = (isset($b['old']) && $b['old'] !== '' && $b['old'] !== null) ? $b['old'] : 0;
        if (!is_num($v) || (float)$v < 0 || (float)$v > 10000000) fail(400, 'Enter a valid old price', 'old');
        $out['old'] = money($v);
    }
    $pr = $out['price'] ?? null; $ol = $out['old'] ?? null;
    if ($pr !== null && $ol !== null && $ol > 0 && $ol < $pr) fail(400, 'Old price must be higher than the selling price', 'old');
    // category: the main category is required; any deeper sub-category is optional (cat_id = the deepest one chosen)
    if (!$partial || $has('cat') || $has('cat_id') || $has('sub')) {
        list($cn, $sn, $cid) = cat_resolve_choice($b['cat_id'] ?? null, clean_str($b['cat'] ?? '', 120), clean_str($b['sub'] ?? '', 120));
        $out['cat'] = $cn; $out['sub'] = $sn; $out['cat_id'] = $cid;
    }
    // every product is sold on NurBuy Minutes
    if (!$partial || $has('v')) $out['v'] = 'min';
    if (!$partial || $has('about')) { $v = clean_str($b['about'] ?? '', 3000); $out['about'] = $v === '' ? null : $v; }
    if (!$partial || $has('specs')) { $out['specs'] = clean_specs($b['specs'] ?? []); }
    if (!$partial || $has('imgs')) {
        $im = $b['imgs'] ?? null;
        if (!is_array($im) || count($im) < 1) fail(400, 'Add at least one product photo', 'imgs');
        if (count($im) > 5) fail(400, 'At most 5 photos', 'imgs');
        $names = [];
        foreach ($im as $n) {
            if (!is_string($n) || !preg_match('/^s' . (int)$s['id'] . '_[0-9a-f]{16}\.(jpg|png|webp)$/', $n)) fail(400, 'Invalid photo', 'imgs');
            if (!is_file(seller_public_dir() . '/' . $n)) fail(400, 'A photo was not uploaded properly. Upload it again.', 'imgs');
            $names[] = $n;
        }
        $out['imgs'] = array_values(array_unique($names));
    }
    if (!$vr && !$stockOn && (!$partial || $has('stock') || $has('stock_on'))) $out['stock'] = 0;
    elseif (!$vr && ($has('stock') || !$partial)) {
        if (!isset($b['stock']) || !is_num($b['stock']) || (float)$b['stock'] != floor((float)$b['stock']) || (int)$b['stock'] < 0 || (int)$b['stock'] > 1000000) fail(400, 'Enter a valid stock quantity', 'stock');
        $out['stock'] = (int)$b['stock'];
    }
}
function seller_own_product($id, $sid, $lock = false) {
    $p = db_row('SELECT * FROM seller_products WHERE id=? AND seller_id=?' . ($lock ? lock_suffix() : ''), [(int)$id, $sid]);
    if (!$p) fail(404, 'Product not found');
    return $p;
}
function seller_unlink_imgs($names, $keep = []) {
    $dir = seller_public_dir();
    foreach ($names as $n) if (is_string($n) && !in_array($n, $keep, true) && preg_match('/^s\d+_[0-9a-f]{16}\.(jpg|png|webp)$/', $n)) @unlink($dir . '/' . $n);
}
function h_seller_products() {
    $s = require_seller(true);
    $st = (string)($_GET['status'] ?? 'all');
    $qs = mb_strtolower(trim((string)($_GET['q'] ?? '')));
    $rows = db_rows('SELECT * FROM seller_products WHERE seller_id=? ORDER BY id DESC LIMIT 1000', [(int)$s['id']]);
    $counts = ['active' => 0, 'pending' => 0, 'rejected' => 0, 'hidden' => 0, 'low' => 0, 'out' => 0, 'all' => 0];
    $out = [];
    foreach ($rows as $p) {
        $counts['all']++;
        if ($p['status'] === 'active') { if ((int)$p['hidden']) $counts['hidden']++; else $counts['active']++; }
        else $counts[$p['status']] = ($counts[$p['status']] ?? 0) + 1;
        if ($p['status'] === 'active' && seller_stock_on($p)) { if ((int)$p['stock'] === 0) $counts['out']++; elseif ((int)$p['stock'] <= 5) $counts['low']++; }
        $match = true;
        if ($st === 'active') $match = $p['status'] === 'active' && !(int)$p['hidden'];
        elseif ($st === 'hidden') $match = $p['status'] === 'active' && (int)$p['hidden'];
        elseif ($st === 'low') $match = $p['status'] === 'active' && seller_stock_on($p) && (int)$p['stock'] <= 5;
        elseif (in_array($st, ['pending', 'rejected'], true)) $match = $p['status'] === $st;
        if ($match && $qs !== '' && mb_strpos(mb_strtolower($p['name'] . ' ' . ($p['bn'] ?? '')), $qs) === false) $match = false;
        if ($match) $out[] = seller_product_out($p);
    }
    json_out(['products' => $out, 'counts' => $counts]);
}
function h_seller_product_get($id) { $s = require_seller(true); json_out(['product' => seller_product_out(seller_own_product($id, (int)$s['id']))]); }
function h_seller_product_create() {
    $s = require_seller(true);
    $b = body_json();
    seller_product_validate($b, $s, $p, false);
    if ((int)db_val('SELECT COUNT(*) FROM seller_products WHERE seller_id=?', [(int)$s['id']]) >= 1000) fail(409, 'Product limit reached');
    $t = now_ts();
    $pc = $p['pcode'] ?? '';
    if ($pc !== '' && pcode_taken($pc)) pcode_dup_fail();
    if ($pc === '') $pc = pcode_new();
    q("INSERT INTO seller_products (seller_id,name,bn,price,old,stock,cat,sub,cat_id,v,about,specs,imgs,vr,status,hidden,sold,created_at,updated_at,stock_on,max_q,about_bn,pcode,tags) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,'pending',0,0,?,?,?,?,?,?,?)",
      [(int)$s['id'], $p['name'], $p['bn'], $p['price'], $p['old'], $p['stock'], $p['cat'], $p['sub'], $p['cat_id'], $p['v'], $p['about'], json_encode($p['specs'], JSON_UNESCAPED_UNICODE), json_encode($p['imgs']), seller_vr_encode($p['vr']), $t, $t, $p['stock_on'], $p['max_q'], $p['about_bn'], $pc, implode(',', $p['tags'] ?? [])]);
    $id = db_val('SELECT MAX(id) FROM seller_products WHERE seller_id=?', [(int)$s['id']]);
    json_out(['product' => seller_product_out(db_row('SELECT * FROM seller_products WHERE id=?', [$id]))], 201);
}
function h_seller_product_update($id) {
    $s = require_seller(true);
    $b = body_json();
    $res = db_tx(function () use ($id, $s, $b) {
        $cur = seller_own_product($id, (int)$s['id'], true);
        $in = []; foreach (['name', 'bn', 'price', 'old', 'cat', 'sub', 'cat_id', 'v', 'about', 'about_bn', 'specs', 'imgs', 'stock', 'stock_on', 'max_q', 'vr', 'pcode', 'tags'] as $k) if (array_key_exists($k, $b)) $in[$k] = $b[$k];
        // choosing a new main category (by name) without an id starts the category choice again
        if ((array_key_exists('cat', $in) || array_key_exists('sub', $in)) && !array_key_exists('cat_id', $in)) $in['cat_id'] = null;
        if (!$in) fail(400, 'Nothing to update');
        // validate against the merged (current + incoming) values so cross-field rules hold
        $core = seller_product_core($cur);
        $merged = array_merge($core, ['stock' => (int)$cur['stock']], $in);
        seller_product_validate($merged, $s, $p, false);
        $pc = $p['pcode'] ?? '';
        if ($pc === '') $pc = (string)($cur['pcode'] ?? '');
        if ($pc !== '' && strtoupper($pc) !== strtoupper((string)($cur['pcode'] ?? '')) && pcode_taken($pc, (int)$cur['id'])) pcode_dup_fail();
        if ($pc === '') $pc = pcode_new();
        $t = now_ts();
        // An approved product stays live: the seller's edit is published at once (no second review).
        // A pending or rejected product goes (back) to review as before.
        $st = $cur['status'] === 'active' ? 'active' : 'pending';
        q("UPDATE seller_products SET name=?,bn=?,price=?,old=?,stock=?,cat=?,sub=?,cat_id=?,v=?,about=?,about_bn=?,specs=?,imgs=?,vr=?,stock_on=?,max_q=?,pcode=?,tags=?,status=?,reject_reason=NULL,chg=NULL,updated_at=? WHERE id=?",
          [$p['name'], $p['bn'], $p['price'], $p['old'], $p['stock'], $p['cat'], $p['sub'], $p['cat_id'], $p['v'], $p['about'], $p['about_bn'], json_encode($p['specs'], JSON_UNESCAPED_UNICODE), json_encode($p['imgs']), seller_vr_encode($p['vr']), $p['stock_on'], $p['max_q'], $pc, implode(',', $p['tags'] ?? []), $st, $t, $cur['id']]);
        $old = array_merge(seller_images($cur), seller_vr_files($core['vr']));
        $oc = json_decode((string)($cur['chg'] ?? ''), true);
        if (is_array($oc)) { if (isset($oc['imgs']) && is_array($oc['imgs'])) $old = array_merge($old, $oc['imgs']); if (array_key_exists('vr', $oc)) $old = array_merge($old, seller_vr_files(seller_vr_parse($oc['vr']))); }
        seller_unlink_imgs($old, array_merge($p['imgs'], seller_vr_files($p['vr'])));
        return seller_product_out(db_row('SELECT * FROM seller_products WHERE id=?', [$cur['id']]));
    });
    json_out(['product' => $res]);
}
function h_seller_product_stock($id) {
    $s = require_seller(true);
    $b = body_json();
    if (!isset($b['stock']) || !is_num($b['stock']) || (float)$b['stock'] != floor((float)$b['stock']) || (int)$b['stock'] < 0 || (int)$b['stock'] > 1000000) fail(400, 'Enter a valid stock quantity', 'stock');
    $p = seller_own_product($id, (int)$s['id']);
    if (seller_vr_parse($p['vr'] ?? null)) fail(409, 'This product has variants. Update stock per variant.', 'stock', 'has_variants');
    q('UPDATE seller_products SET stock=?, stock_on=1, updated_at=? WHERE id=?', [(int)$b['stock'], now_ts(), $p['id']]);
    json_out(['product' => seller_product_out(db_row('SELECT * FROM seller_products WHERE id=?', [$p['id']]))]);
}
function h_seller_product_variants_stock($id) {
    $s = require_seller(true);
    $b = body_json();
    $list = $b['v'] ?? null;
    if (!is_array($list) || count($list) < 1 || count($list) > 100) fail(400, 'Send between 1 and 100 variants', 'v');
    $res = db_tx(function () use ($id, $s, $list) {
        $p = seller_own_product($id, (int)$s['id'], true);
        $vr = seller_vr_parse($p['vr'] ?? null);
        if (!$vr) fail(409, 'This product has no variants', 'v', 'no_variants');
        $idx = []; foreach ($vr['v'] as $i => $v) $idx[(string)$v['id']] = $i;
        foreach ($list as $e) {
            if (!is_array($e) || !isset($e['id']) || !is_string($e['id']) || !isset($idx[$e['id']])) fail(400, 'Unknown variant', 'v');
            if (!array_key_exists('stock', $e) && !array_key_exists('on', $e)) fail(400, 'Nothing to update for variant ' . $e['id'], 'v');
            $i = $idx[$e['id']];
            if (array_key_exists('stock', $e)) {
                if (!is_num($e['stock']) || (float)$e['stock'] != floor((float)$e['stock']) || (int)$e['stock'] < 0 || (int)$e['stock'] > 1000000) fail(400, 'Enter a valid stock quantity', 'stock');
                $vr['v'][$i]['stock'] = (int)$e['stock'];
            }
            if (array_key_exists('on', $e)) $vr['v'][$i]['on'] = ($e['on'] === false || $e['on'] === 0 || $e['on'] === '0' || $e['on'] === null) ? 0 : 1;
        }
        seller_vr_save($p['id'], $vr);
        return seller_product_out(db_row('SELECT * FROM seller_products WHERE id=?', [$p['id']]));
    });
    json_out(['product' => $res]);
}
function h_seller_product_visibility($id) {
    $s = require_seller(true);
    $b = body_json();
    $p = seller_own_product($id, (int)$s['id']);
    q('UPDATE seller_products SET hidden=?, updated_at=? WHERE id=?', [!empty($b['hidden']) ? 1 : 0, now_ts(), $p['id']]);
    json_out(['product' => seller_product_out(db_row('SELECT * FROM seller_products WHERE id=?', [$p['id']]))]);
}
function h_seller_product_delete($id) {
    $s = require_seller(true);
    $p = seller_own_product($id, (int)$s['id']);
    $names = array_merge(seller_images($p), seller_vr_files(seller_vr_parse($p['vr'] ?? null)));
    $c = json_decode((string)($p['chg'] ?? ''), true);
    if (is_array($c) && isset($c['imgs']) && is_array($c['imgs'])) $names = array_merge($names, $c['imgs']);
    if (is_array($c) && array_key_exists('vr', $c)) $names = array_merge($names, seller_vr_files(seller_vr_parse($c['vr'])));
    q('DELETE FROM seller_products WHERE id=?', [$p['id']]);
    seller_unlink_imgs($names);
    json_out(['ok' => true]);
}

/* ---------- orders ---------- */
function seller_shop_lookup() {
    $m = [];
    foreach (db_rows("SELECT id, shop_name FROM sellers WHERE status='approved'") as $r) $m[mb_strtolower(trim($r['shop_name']))] = (int)$r['id'];
    return $m;
}
function seller_order_items($o, $shopName) {
    $items = json_decode((string)$o['items'], true);
    $mine = []; $other = false;
    if (is_array($items)) foreach ($items as $i) {
        if (!is_array($i)) continue;
        if (mb_strtolower(trim((string)($i['shop'] ?? ''))) === mb_strtolower(trim($shopName))) $mine[] = $i; else $other = true;
    }
    return [$mine, $other];
}
function seller_order_state($o, $sstat) {
    if (in_array($o['status'], ['Cancelled', 'Returned'], true)) return 'cancelled';
    if ($o['status'] === 'Delivered') return 'delivered';
    if ($o['status'] === 'Out for delivery') return 'shipped';
    return $sstat ?: 'new';
}
function seller_find_orders($s, $limit = 500) {
    $rows = db_rows('SELECT * FROM orders WHERE instr(items, ?) > 0 ORDER BY created_at DESC, id DESC LIMIT ' . (int)$limit, [$s['shop_name']]);
    $ss = [];
    foreach (db_rows('SELECT order_id, sstat, note FROM seller_orders WHERE seller_id=?', [(int)$s['id']]) as $x) $ss[$x['order_id']] = $x;
    $out = [];
    foreach ($rows as $o) {
        list($mine, $other) = seller_order_items($o, $s['shop_name']);
        if (!$mine) continue;
        $sub = 0.0; $its = [];
        foreach ($mine as $i) { $q = (int)($i['q'] ?? 1); $u = money($i['unit'] ?? 0); $sub += $q * $u; $its[] = ['n' => (string)($i['n'] ?? ''), 'bn' => (string)($i['bn'] ?? ''), 'q' => $q, 'unit' => $u, 'id' => (string)($i['id'] ?? ''), 'vid' => (string)($i['vid'] ?? ''), 'variant' => (string)($i['variant'] ?? '')]; }
        $x = $ss[$o['id']] ?? null;
        $name = trim((string)$o['name']); $parts = preg_split('/\s+/', $name);
        $out[] = ['id' => $o['id'], 'view' => $o['view'], 'ostatus' => $o['status'], 'st' => seller_order_state($o, $x['sstat'] ?? null), 'note' => $x['note'] ?? null,
                  'items' => $its, 'sub' => money($sub), 'other' => $other, 'cu' => $parts[0] ?? '', 'pay' => $o['pay'], 'created_at' => (int)$o['created_at'], 'updated_at' => (int)$o['updated_at']];
    }
    return $out;
}
function h_seller_orders() {
    $s = require_seller(true);
    $f = (string)($_GET['status'] ?? 'all'); $qs = mb_strtolower(trim((string)($_GET['q'] ?? '')));
    $all = seller_find_orders($s);
    $counts = ['new' => 0, 'confirmed' => 0, 'packed' => 0, 'shipped' => 0, 'delivered' => 0, 'cancelled' => 0, 'rejected' => 0, 'all' => count($all)];
    $out = [];
    foreach ($all as $o) {
        $counts[$o['st']] = ($counts[$o['st']] ?? 0) + 1;
        if ($f !== 'all' && $o['st'] !== $f) continue;
        if ($qs !== '' && mb_strpos(mb_strtolower($o['id']), $qs) === false) continue;
        $out[] = $o;
    }
    json_out(['orders' => $out, 'counts' => $counts]);
}
function seller_get_order($s, $id) {
    $o = db_row('SELECT * FROM orders WHERE id=?', [$id]);
    if (!$o) fail(404, 'Order not found');
    list($mine) = seller_order_items($o, $s['shop_name']);
    if (!$mine) fail(404, 'Order not found');
    return $o;
}
function h_seller_order_get($id) {
    $s = require_seller(true);
    seller_get_order($s, $id);
    foreach (seller_find_orders($s) as $o) if ($o['id'] === $id) json_out(['order' => $o]);
    fail(404, 'Order not found');
}
function seller_involved_ids($o) {
    $m = seller_shop_lookup(); $ids = [];
    $items = json_decode((string)$o['items'], true);
    if (is_array($items)) foreach ($items as $i) if (is_array($i)) { $k = mb_strtolower(trim((string)($i['shop'] ?? ''))); if (isset($m[$k])) $ids[$m[$k]] = true; }
    return array_keys($ids);
}
function h_seller_order_action($id) {
    $s = require_seller(true);
    $b = body_json();
    $act = (string)($b['action'] ?? '');
    if (!in_array($act, ['confirm', 'pack', 'reject'], true)) fail(400, 'Invalid action', 'action');
    $reason = clean_str($b['reason'] ?? '', 200);
    if ($act === 'reject' && $reason === '') fail(400, 'Please write a reason', 'reason');
    db_tx(function () use ($id, $s, $act, $reason) {
        $o = db_row('SELECT * FROM orders WHERE id=?' . lock_suffix(), [$id]);
        if (!$o) fail(404, 'Order not found');
        list($mine) = seller_order_items($o, $s['shop_name']);
        if (!$mine) fail(404, 'Order not found');
        if (!in_array($o['status'], ['Pending', 'Confirmed', 'Packed'], true)) fail(409, 'This order can no longer be changed', null, 'order_closed');
        $x = db_row('SELECT * FROM seller_orders WHERE order_id=? AND seller_id=?' . lock_suffix(), [$id, (int)$s['id']]);
        $cur = $x['sstat'] ?? 'new';
        $to = $act === 'confirm' ? 'confirmed' : ($act === 'pack' ? 'packed' : 'rejected');
        if ($act === 'confirm' && $cur !== 'new') fail(409, 'Already ' . $cur, null, 'bad_state');
        if ($act === 'pack' && !in_array($cur, ['new', 'confirmed'], true)) fail(409, 'Already ' . $cur, null, 'bad_state');
        if ($act === 'reject' && !in_array($cur, ['new', 'confirmed'], true)) fail(409, 'Already ' . $cur, null, 'bad_state');
        $t = now_ts();
        if ($x) q('UPDATE seller_orders SET sstat=?, note=?, updated_at=? WHERE order_id=? AND seller_id=?', [$to, $act === 'reject' ? $reason : null, $t, $id, (int)$s['id']]);
        else q('INSERT INTO seller_orders (order_id, seller_id, sstat, note, updated_at) VALUES (?,?,?,?,?)', [$id, (int)$s['id'], $to, $act === 'reject' ? $reason : null, $t]);
        // roll the order status forward once every seller involved agrees
        $ids = seller_involved_ids($o); $states = [];
        foreach ($ids as $sid) $states[$sid] = (string)db_val('SELECT sstat FROM seller_orders WHERE order_id=? AND seller_id=?', [$id, $sid]);
        if ($ids && $act !== 'reject') {
            $all = function ($set) use ($states) { foreach ($states as $v) if (!in_array($v, $set, true)) return false; return true; };
            if ($all(['packed']) && in_array($o['status'], ['Pending', 'Confirmed'], true)) q("UPDATE orders SET status='Packed', updated_at=? WHERE id=?", [$t, $id]);
            elseif ($all(['confirmed', 'packed']) && $o['status'] === 'Pending') q("UPDATE orders SET status='Confirmed', updated_at=? WHERE id=?", [$t, $id]);
        }
        $now = (string)db_val('SELECT status FROM orders WHERE id=?', [$id]);
        if ($act === 'reject' || $now !== $o['status']) order_after_status($id, $o['status']);
    });
    foreach (seller_find_orders($s) as $o) if ($o['id'] === $id) json_out(['order' => $o]);
    json_out(['ok' => true]);
}

/* ---------- dashboard / notifications ---------- */
function h_seller_dashboard() {
    $s = require_seller(true);
    $orders = seller_find_orders($s);
    $today = strtotime('today');
    $d = ['new' => 0, 'confirmed' => 0, 'packed' => 0, 'today' => 0, 'delivered' => 0, 'sales_today' => 0.0, 'sales_total' => 0.0, 'cancelled' => 0];
    foreach ($orders as $o) {
        if ($o['created_at'] >= $today) $d['today']++;
        if ($o['st'] === 'new') $d['new']++;
        if ($o['st'] === 'confirmed') $d['confirmed']++;
        if ($o['st'] === 'packed') $d['packed']++;
        if ($o['st'] === 'cancelled') $d['cancelled']++;
        if ($o['st'] === 'delivered') { $d['delivered']++; $d['sales_total'] += $o['sub']; if ($o['updated_at'] >= $today) $d['sales_today'] += $o['sub']; }
    }
    $d['sales_today'] = money($d['sales_today']); $d['sales_total'] = money($d['sales_total']);
    $pc = ['active' => 0, 'pending' => 0, 'rejected' => 0, 'low' => 0, 'out' => 0];
    foreach (db_rows('SELECT status, hidden, stock, chg FROM seller_products WHERE seller_id=?', [(int)$s['id']]) as $p) {
        if ($p['status'] === 'active') { $pc['active']++; if ((int)$p['stock'] === 0) $pc['out']++; elseif ((int)$p['stock'] <= 5) $pc['low']++; if ($p['chg']) $pc['pending']++; }
        elseif (isset($pc[$p['status']])) $pc[$p['status']]++;
    }
    $recent = array_slice($orders, 0, 5);
    $unread = (int)db_val('SELECT COUNT(*) FROM seller_notif WHERE seller_id=? AND is_read=0', [(int)$s['id']]);
    json_out(['stats' => $d, 'products' => $pc, 'recent' => $recent, 'unread' => $unread, 'wallet' => seller_wallet_summary((int)$s['id'])]);
}
function h_seller_notifications() {
    $s = require_seller(false);
    $out = [];
    foreach (db_rows('SELECT * FROM seller_notif WHERE seller_id=? ORDER BY id DESC LIMIT 60', [(int)$s['id']]) as $n)
        $out[] = ['id' => (int)$n['id'], 'title' => $n['title'], 'body' => $n['body'], 'read' => (int)$n['is_read'], 'at' => (int)$n['created_at'] * 1000, 'url' => $n['url'] ?? null, 'kind' => $n['kind'] ?? null];
    json_out(['notifications' => $out, 'unread' => (int)db_val('SELECT COUNT(*) FROM seller_notif WHERE seller_id=? AND is_read=0', [(int)$s['id']])]);
}
function h_seller_notifications_read() {
    $s = require_seller(false);
    q('UPDATE seller_notif SET is_read=1 WHERE seller_id=?', [(int)$s['id']]);
    json_out(['ok' => true]);
}

/* ---------- hooks from customer orders / admin ---------- */
function seller_on_order_created($orderId, $items) {
    try {
        $m = seller_shop_lookup(); $notify = [];
        foreach ($items as $i) {
            $k = mb_strtolower(trim((string)($i['shop'] ?? '')));
            if (!isset($m[$k])) continue;
            $sid = $m[$k]; $notify[$sid] = true;
            $q = (int)$i['q']; $pid = null;
            if (isset($i['id']) && preg_match('/^SP(\d+)$/', (string)$i['id'], $mm)) $pid = (int)$mm[1];
            if ($pid !== null) $p = db_row('SELECT id, vr, stock_on FROM seller_products WHERE id=? AND seller_id=?', [$pid, $sid]);
            else $p = db_row('SELECT id, vr, stock_on FROM seller_products WHERE seller_id=? AND name=? ORDER BY id DESC', [$sid, (string)($i['n'] ?? '')]);
            if ($p && !seller_stock_on($p)) q('UPDATE seller_products SET sold=sold+? WHERE id=?', [$q, $p['id']]);
            elseif ($p && seller_vr_parse($p['vr'])) {
                // variable product: stock lives on the variant; product stock is re-derived
                q('UPDATE seller_products SET sold=sold+? WHERE id=?', [$q, $p['id']]);
                if (isset($i['vid']) && $i['vid'] !== '') seller_vr_adjust($p['id'], $i['vid'], -$q);
            } elseif ($p) q('UPDATE seller_products SET stock=CASE WHEN stock>? THEN stock-? ELSE 0 END, sold=sold+? WHERE id=?', [$q, $q, $q, $p['id']]);
        }
        foreach (array_keys($notify) as $sid) seller_notify($sid, 'New order ' . $orderId, 'You have a new order. Open it to confirm and pack.', ['url' => '/#/order/' . rawurlencode($orderId), 'kind' => 'order', 'dkey' => 'new:' . $orderId]);
    } catch (Throwable $e) { error_log('seller_on_order_created: ' . $e->getMessage()); }
}
function seller_order_closed_hook($orderId) {
    try {
        $o = db_row('SELECT * FROM orders WHERE id=?', [$orderId]);
        if (!$o) return;
        $extra = json_decode((string)$o['extra'], true); if (!is_array($extra)) $extra = [];
        $m = seller_shop_lookup(); $notify = [];
        $items = json_decode((string)$o['items'], true);
        if (!is_array($items)) return;
        $restore = empty($extra['stock_restored']);
        foreach ($items as $i) {
            $k = mb_strtolower(trim((string)($i['shop'] ?? '')));
            if (!isset($m[$k])) continue;
            $sid = $m[$k]; $notify[$sid] = true;
            if (!$restore) continue;
            $q = (int)($i['q'] ?? 1); $pid = null;
            if (isset($i['id']) && preg_match('/^SP(\d+)$/', (string)$i['id'], $mm)) $pid = (int)$mm[1];
            if ($pid !== null) $p = db_row('SELECT id, vr, stock_on FROM seller_products WHERE id=? AND seller_id=?', [$pid, $sid]);
            else $p = db_row('SELECT id, vr, stock_on FROM seller_products WHERE seller_id=? AND name=? ORDER BY id DESC', [$sid, (string)($i['n'] ?? '')]);
            if ($p && !seller_stock_on($p)) q('UPDATE seller_products SET sold=CASE WHEN sold>? THEN sold-? ELSE 0 END WHERE id=?', [$q, $q, $p['id']]);
            elseif ($p && seller_vr_parse($p['vr'])) {
                q('UPDATE seller_products SET sold=CASE WHEN sold>? THEN sold-? ELSE 0 END WHERE id=?', [$q, $q, $p['id']]);
                if (isset($i['vid']) && $i['vid'] !== '') seller_vr_adjust($p['id'], $i['vid'], $q);
            } elseif ($p) q('UPDATE seller_products SET stock=stock+?, sold=CASE WHEN sold>? THEN sold-? ELSE 0 END WHERE id=?', [$q, $q, $q, $p['id']]);
        }
        if ($restore) { $extra['stock_restored'] = true; q('UPDATE orders SET extra=? WHERE id=?', [json_encode($extra, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $orderId]); }
        foreach (array_keys($notify) as $sid) seller_notify($sid, 'Order ' . $orderId . ' was cancelled', 'This order is no longer active.', ['url' => '/#/order/' . rawurlencode($orderId), 'kind' => 'order', 'dkey' => 'cx:' . $orderId]);
    } catch (Throwable $e) { error_log('seller_order_closed_hook: ' . $e->getMessage()); }
}
/** For admin: which sellers are involved in an order and what each said. */
function seller_admin_order_info($o, $lookup, $names, $ss) {
    $items = json_decode((string)$o['items'], true); $ids = [];
    if (is_array($items)) foreach ($items as $i) if (is_array($i)) { $k = mb_strtolower(trim((string)($i['shop'] ?? ''))); if (isset($lookup[$k])) $ids[$lookup[$k]] = true; }
    $out = [];
    static $geo = null;
    if ($geo === null) { $geo = []; foreach (db_rows('SELECT id, lat, lng, address, logo FROM sellers') as $g) $geo[(int)$g['id']] = $g; }
    foreach (array_keys($ids) as $sid) {
        $x = $ss[$o['id'] . '|' . $sid] ?? null; $g = $geo[(int)$sid] ?? [];
        $out[] = ['id' => $sid, 'n' => $names[$sid] ?? '', 'st' => $x['sstat'] ?? 'new', 'note' => $x['note'] ?? null,
                  'ad' => (string)($g['address'] ?? ''), 'logo' => seller_img_url($g['logo'] ?? null) ?: '',
                  'map' => (isset($g['lat']) && $g['lat'] !== null) ? 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode((float)$g['lat'] . ',' . (float)$g['lng']) : null];
    }
    return $out;
}

/* =====================================================================
 * Catalog merge (called by h_catalog)
 * ===================================================================== */
function seller_catalog_products($catsIdx) {
    $out = [];
    $sellers = [];
    foreach (db_rows("SELECT id, shop_name, sell_view, hours, category FROM sellers WHERE status='approved'") as $r) $sellers[(int)$r['id']] = $r;
    if (!$sellers) return $out;
    $cpm = [];
    try { $cpm = coupon_catalog_map(); } catch (Throwable $e) { error_log('coupon map: ' . $e->getMessage()); }
    foreach (db_rows("SELECT * FROM seller_products WHERE status='active' AND hidden=0 ORDER BY id") as $p) {
        $s = $sellers[(int)$p['seller_id']] ?? null; if (!$s) continue;
        $imgs = seller_images($p);
        $cb = $catsIdx[$p['cat']] ?? '';
        $vr = seller_vr_parse($p['vr'] ?? null);
        $pr = money($p['price']); $ol = money($p['old']); $stk = (int)$p['stock'];
        if ($vr) list($pr, $ol, $stk) = seller_vr_derive($vr);
        $track = seller_stock_on($p);
        $vo = seller_vr_out($vr, true);
        if (!$track) { $stk = 999; if ($vo) foreach ($vo['v'] as $vi => $vv) $vo['v'][$vi]['stock'] = 999; }
        if (!in_array($p['v'] ?? 'both', ['min', 'both'], true)) continue; // only Minutes products are published
        $cf = cat_product_fields((int)($p['cat_id'] ?? 0), (string)$p['cat'], (string)($p['sub'] ?? ''));
        if ($cf['cid']) { $p['cat'] = $cf['cat']; $p['sub'] = $cf['sub']; $cb = $cf['catBn']; }
        if (empty($p['pcode'])) { try { $p['pcode'] = pcode_new(); q('UPDATE seller_products SET pcode=? WHERE id=? AND (pcode IS NULL OR pcode=\'\')', [$p['pcode'], (int)$p['id']]); } catch (Throwable $e) { $p['pcode'] = ''; } }
        $out[] = ['id' => 'SP' . $p['id'], 'pcode' => (string)$p['pcode'], 'n' => $p['name'], 'e' => '', 'img' => $imgs ? (seller_img_url($imgs[0]) ?: '') : '', 'imgs' => array_values(array_filter(array_map('seller_img_url', $imgs))),
                  'cid' => $cf['cid'], 'cpath' => $cf['cpath'], 'upd' => (int)$p['updated_at'], 'ts' => (int)$p['created_at'] * 1000,
                  'cat' => (string)$p['cat'], 'catBn' => $cb, 'v' => 'min', 'pr' => $pr, 'old' => $ol, 'st' => $stk,
                  'sh' => $s['shop_name'], 'sold' => (int)$p['sold'], 'bn' => (string)($p['bn'] ?? ''), 'about' => (string)($p['about'] ?? ''),
                  'specs' => clean_specs($p['specs'] ?? ''), 'sub' => (string)($p['sub'] ?? ''), 'pid' => (int)$p['id'], 'vr' => $vo, 'cpn' => $cpm[(int)$p['id']] ?? [],
                  'tags' => implode(' ', tags_parse($p['tags'] ?? null)), 'aboutBn' => (string)($p['about_bn'] ?? ''), 'so' => $track ? 1 : 0, 'mx' => (int)($p['max_q'] ?? 0), 'sid' => 'SL' . $s['id']];
    }
    return $out;
}
function seller_catalog_stores() {
    $out = [];
    $fl = [];
    try { $fl = follow_counts(); } catch (Throwable $e) { error_log('follow counts: ' . $e->getMessage()); }
    foreach (db_rows("SELECT * FROM sellers WHERE status='approved' ORDER BY id") as $s) {
        if (!in_array($s['sell_view'], ['min', 'both'], true)) continue; // only shops selling on Minutes are published
        $types = ['min'];
        $h = hours_parse($s['hours'] ?? null);
        foreach ($types as $t) $out[] = ['id' => 'SL' . $s['id'], 'n' => $s['shop_name'], 't' => $t, 'ow' => $s['owner_name'], 'img' => seller_img_url($s['logo']) ?: '', 'cover' => seller_img_url($s['cover'] ?? null) ?: '', 'about' => mb_substr((string)($s['about'] ?? ''), 0, 500),
            'hours' => $h, 'food' => seller_is_food($s) ? 1 : 0, 'fl' => $fl['SL' . $s['id']] ?? 0, 'cat' => (string)($s['category'] ?? ''), 'since' => (int)($s['approved_at'] ?: $s['created_at']), 'cov' => coverage_parse($s['coverage'] ?? null)];
    }
    return $out;
}


/* =====================================================================
 * Admin side
 * ===================================================================== */
function h_admin_sellers() {
    require_admin();
    $counts = ['pending' => 0, 'approved' => 0, 'rejected' => 0, 'suspended' => 0];
    $pc = []; $pp = [];
    foreach (db_rows('SELECT seller_id, status, chg FROM seller_products') as $x) {
        $pc[$x['seller_id']] = ($pc[$x['seller_id']] ?? 0) + 1;
        if ($x['status'] === 'pending' || ($x['status'] === 'active' && $x['chg'])) $pp[$x['seller_id']] = ($pp[$x['seller_id']] ?? 0) + 1;
    }
    $out = [];
    foreach (db_rows('SELECT * FROM sellers ORDER BY created_at DESC, id DESC LIMIT 2000') as $r) {
        if (isset($counts[$r['status']])) $counts[$r['status']]++;
        $o = seller_out($r);
        $o['products'] = $pc[$r['id']] ?? 0; $o['to_review'] = $pp[$r['id']] ?? 0;
        $out[] = $o;
    }
    $review = (int)db_val("SELECT COUNT(*) FROM seller_products WHERE status='pending' OR (status='active' AND chg IS NOT NULL)");
    json_out(['sellers' => $out, 'counts' => $counts, 'review' => $review]);
}
function h_admin_seller_get($id) {
    require_admin();
    $r = db_row('SELECT * FROM sellers WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Seller not found');
    $o = seller_out($r);
    $o['last_seen'] = $r['last_seen'] === null ? null : (int)$r['last_seen'] * 1000;
    $pc = ['active' => 0, 'pending' => 0, 'rejected' => 0, 'hidden' => 0];
    foreach (db_rows('SELECT status, hidden FROM seller_products WHERE seller_id=?', [(int)$r['id']]) as $p) { if ($p['status'] === 'active' && (int)$p['hidden']) $pc['hidden']++; else $pc[$p['status']] = ($pc[$p['status']] ?? 0) + 1; }
    $o['product_counts'] = $pc;
    $ords = seller_find_orders($r, 200);
    $sales = 0.0; $dn = 0;
    foreach ($ords as $x) if ($x['st'] === 'delivered') { $sales += $x['sub']; $dn++; }
    $o['orders'] = ['total' => count($ords), 'delivered' => $dn, 'sales' => money($sales)];
    $o['wallet'] = seller_wallet_summary((int)$r['id']);
    $o['coverage'] = coverage_out(coverage_parse($r['coverage'] ?? null));
    $o['com_pct'] = $r['com_pct'] === null ? null : (float)$r['com_pct'];
    $o['com_eff'] = seller_com_pct($r);
    $msgs = [];
    foreach (db_rows('SELECT title, body, is_read, created_at FROM seller_notif WHERE seller_id=? ORDER BY id DESC LIMIT 15', [(int)$r['id']]) as $x)
        $msgs[] = ['title' => $x['title'], 'body' => $x['body'], 'read' => (int)$x['is_read'], 'at' => (int)$x['created_at'] * 1000];
    $o['messages'] = $msgs;
    json_out(['seller' => $o]);
}
function h_admin_seller_file($id) {
    require_admin();
    $r = db_row('SELECT * FROM sellers WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Seller not found');
    seller_send_file($r, (string)($_GET['kind'] ?? 'nid_front'));
}
function h_admin_seller_patch($id) {
    require_admin();
    $b = body_json();
    $action = (string)($b['action'] ?? '');
    $r = db_row('SELECT * FROM sellers WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Seller not found');
    $reason = clean_str($b['reason'] ?? '', 250);
    $sid = (int)$r['id'];
    if ($action === 'approve') {
        if (!in_array($r['status'], ['pending', 'rejected'], true)) fail(409, 'Only pending or rejected applications can be approved');
        $d = seller_docs($r);
        if (empty($d['nid_front']) || empty($d['nid_back'])) fail(409, 'NID photos are missing. Ask the seller to upload them first.', null, 'docs_missing');
        q("UPDATE sellers SET status='approved', reject_reason=NULL, approved_at=? WHERE id=?", [now_ts(), $sid]);
        seller_notify($sid, 'Your seller account is approved', 'You can now add products from the dashboard.');
    } elseif ($action === 'reject') {
        if ($reason === '') fail(400, 'Please write a reason', 'reason');
        if (!in_array($r['status'], ['pending', 'approved'], true)) fail(409, 'Cannot reject in this state');
        q("UPDATE sellers SET status='rejected', reject_reason=? WHERE id=?", [$reason, $sid]);
        seller_notify($sid, 'Application rejected', $reason);
    } elseif ($action === 'suspend') {
        if ($r['status'] !== 'approved') fail(409, 'Only approved sellers can be suspended');
        q("UPDATE sellers SET status='suspended', reject_reason=? WHERE id=?", [$reason !== '' ? $reason : null, $sid]);
        seller_notify($sid, 'Your account is suspended', $reason !== '' ? $reason : 'Contact NurBuy support for details.');
    } elseif ($action === 'activate') {
        if ($r['status'] !== 'suspended') fail(409, 'Only suspended sellers can be re-activated');
        q("UPDATE sellers SET status='approved', reject_reason=NULL WHERE id=?", [$sid]);
        seller_notify($sid, 'Your account is active again', '');
    } elseif ($action === 'chg_approve' || $action === 'chg_reject') {
        $chg = seller_chg($r);
        if (!$chg) fail(409, 'No pending change request');
        if ($action === 'chg_approve') {
            $set = []; $par = [];
            foreach ($chg as $k => $v) {
                if (!in_array($k, ['mobile', 'email'], true)) continue;
                seller_dup_check($k === 'mobile' ? $v : null, $k === 'email' ? $v : null, $sid);
                $set[] = "$k=?"; $par[] = $v;
            }
            $set[] = 'chg=NULL'; $par[] = $sid;
            q('UPDATE sellers SET ' . implode(',', $set) . ' WHERE id=?', $par);
            seller_notify($sid, 'Profile change approved', '');
        } else {
            q('UPDATE sellers SET chg=NULL WHERE id=?', [$sid]);
            seller_notify($sid, 'Profile change rejected', $reason);
        }
    } else fail(400, 'Invalid action', 'action');
    h_admin_seller_get($sid);
}
function h_admin_seller_message($id) {
    require_admin();
    $b = body_json();
    $r = db_row('SELECT id FROM sellers WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Seller not found');
    $body = clean_str($b['body'] ?? '', 500);
    if ($body === '') fail(400, 'Write a message', 'body');
    seller_notify($r['id'], clean_str($b['title'] ?? '', 190) ?: 'NurBuy-এর বার্তা', $body);
    json_out(['ok' => true]);
}
/* ---- product review ---- */
function seller_admin_product_out($p, $shop) {
    $o = seller_product_out($p);
    $o['seller_id'] = (int)$p['seller_id']; $o['shop'] = $shop;
    // NurBuy commission: the product's own rate, else the seller's / store default (com_eff is what new orders use)
    static $sc = [];
    if (!array_key_exists($o['seller_id'], $sc)) { $sr = db_row('SELECT * FROM sellers WHERE id=?', [$o['seller_id']]); $sc[$o['seller_id']] = seller_com_pct($sr ?: null); }
    $o['com_pct'] = ($p['com_pct'] ?? null) === null || $p['com_pct'] === '' ? null : (float)$p['com_pct'];
    $o['com_def'] = (float)$sc[$o['seller_id']];
    $o['com_eff'] = $o['com_pct'] ?? $o['com_def'];
    return $o;
}
function h_admin_seller_products() {
    require_admin();
    $f = (string)($_GET['status'] ?? 'review');
    $names = [];
    foreach (db_rows('SELECT id, shop_name FROM sellers') as $x) $names[(int)$x['id']] = $x['shop_name'];
    $counts = ['review' => 0, 'active' => 0, 'rejected' => 0, 'all' => 0];
    $out = [];
    foreach (db_rows('SELECT * FROM seller_products ORDER BY updated_at DESC, id DESC LIMIT 3000') as $p) {
        $rev = $p['status'] === 'pending' || ($p['status'] === 'active' && $p['chg']);
        $counts['all']++; if ($rev) $counts['review']++; if ($p['status'] === 'active') $counts['active']++; if ($p['status'] === 'rejected') $counts['rejected']++;
        $m = $f === 'all' || ($f === 'review' && $rev) || ($f === 'active' && $p['status'] === 'active') || ($f === 'rejected' && $p['status'] === 'rejected');
        if ($m) $out[] = seller_admin_product_out($p, $names[(int)$p['seller_id']] ?? '');
    }
    json_out(['products' => $out, 'counts' => $counts]);
}
function h_admin_seller_product_get($id) {
    require_admin();
    $p = db_row('SELECT * FROM seller_products WHERE id=?', [(int)$id]);
    if (!$p) fail(404, 'Product not found');
    json_out(['product' => seller_admin_product_out($p, (string)db_val('SELECT shop_name FROM sellers WHERE id=?', [(int)$p['seller_id']]))]);
}
function h_admin_seller_product_patch($id) {
    require_admin();
    $b = body_json();
    $action = (string)($b['action'] ?? '');
    $reason = clean_str($b['reason'] ?? '', 250);
    $p = db_row('SELECT * FROM seller_products WHERE id=?', [(int)$id]);
    if (!$p) fail(404, 'Product not found');
    $t = now_ts(); $sid = (int)$p['seller_id'];
    if ($action === 'approve') {
        if (!in_array($p['status'], ['pending', 'rejected'], true)) fail(409, 'Only pending or rejected products can be approved');
        $cp = array_key_exists('com_pct', $b) ? com_pct_in($b['com_pct']) : ($p['com_pct'] ?? null);
        q("UPDATE seller_products SET status='active', reject_reason=NULL, com_pct=?, updated_at=? WHERE id=?", [$cp, $t, $p['id']]);
        seller_notify($sid, 'Product approved', $p['name'] . ' is now live on the store.' . ($cp !== null ? ' NurBuy commission: ' . rtrim(rtrim(number_format((float)$cp, 2, '.', ''), '0'), '.') . '%.' : ''));
    } elseif ($action === 'commission') {
        // change the rate any time; orders already placed keep the rate they were placed with
        if (!array_key_exists('com_pct', $b)) fail(400, 'Commission is required', 'com_pct');
        $cp = com_pct_in($b['com_pct']);
        q('UPDATE seller_products SET com_pct=?, updated_at=? WHERE id=?', [$cp, $t, $p['id']]);
        seller_notify($sid, 'Commission updated', $p['name'] . ': NurBuy commission is now ' . ($cp !== null ? rtrim(rtrim(number_format((float)$cp, 2, '.', ''), '0'), '.') . '%' : 'the shop rate') . ' for new orders.');
    } elseif ($action === 'reject') {
        if ($reason === '') fail(400, 'Please write a reason', 'reason');
        if (!in_array($p['status'], ['pending', 'active'], true)) fail(409, 'Cannot reject in this state');
        q("UPDATE seller_products SET status='rejected', reject_reason=?, updated_at=? WHERE id=?", [$reason, $t, $p['id']]);
        seller_notify($sid, 'Product rejected', $p['name'] . ': ' . $reason);
    } elseif ($action === 'chg_approve' || $action === 'chg_reject') {
        $c = json_decode((string)($p['chg'] ?? ''), true);
        if ($p['status'] !== 'active' || !is_array($c) || !$c) fail(409, 'No pending edit');
        if ($action === 'chg_approve') {
            $set = ['chg=NULL', 'updated_at=?']; $par = [$t];
            $oldImgs = seller_images($p); $newImgs = null;
            foreach (['name', 'bn', 'price', 'old', 'cat', 'sub', 'cat_id', 'v', 'about'] as $k) if (array_key_exists($k, $c)) { $set[] = "$k=?"; $par[] = $c[$k]; }
            if (array_key_exists('specs', $c)) { $set[] = 'specs=?'; $par[] = json_encode(clean_specs($c['specs']), JSON_UNESCAPED_UNICODE); }
            if (isset($c['imgs']) && is_array($c['imgs'])) { $set[] = 'imgs=?'; $par[] = json_encode($c['imgs']); $newImgs = $c['imgs']; }
            $liveVr = seller_vr_parse($p['vr'] ?? null); $finalVr = $liveVr;
            if (array_key_exists('vr', $c)) {
                $finalVr = seller_vr_parse($c['vr']);
                if ($finalVr && $liveVr) { // existing variants keep their live stock / on-off state
                    $lv = []; foreach ($liveVr['v'] as $x) $lv[$x['id']] = $x;
                    foreach ($finalVr['v'] as $i => $x) if (isset($lv[$x['id']])) { $finalVr['v'][$i]['stock'] = $lv[$x['id']]['stock']; $finalVr['v'][$i]['on'] = $lv[$x['id']]['on']; }
                }
                $set[] = 'vr=?'; $par[] = seller_vr_encode($finalVr);
                if ($finalVr) { list($dp, $do, $ds) = seller_vr_derive($finalVr); $set[] = 'price=?'; $par[] = $dp; $set[] = 'old=?'; $par[] = $do; $set[] = 'stock=?'; $par[] = $ds; }
            }
            $par[] = $p['id'];
            q('UPDATE seller_products SET ' . implode(',', $set) . ' WHERE id=?', $par);
            if ($newImgs !== null || array_key_exists('vr', $c)) seller_unlink_imgs(array_merge($oldImgs, seller_vr_files($liveVr)), array_merge($newImgs ?? $oldImgs, seller_vr_files($finalVr)));
            seller_notify($sid, 'Product edit approved', $p['name']);
        } else {
            q('UPDATE seller_products SET chg=NULL, updated_at=? WHERE id=?', [$t, $p['id']]);
            if (isset($c['imgs']) && is_array($c['imgs'])) seller_unlink_imgs($c['imgs'], array_merge(seller_images($p), seller_vr_files(seller_vr_parse($p['vr'] ?? null))));
            if (array_key_exists('vr', $c)) seller_unlink_imgs(seller_vr_files(seller_vr_parse($c['vr'])), array_merge(seller_images($p), seller_vr_files(seller_vr_parse($p['vr'] ?? null))));
            seller_notify($sid, 'Product edit rejected', $p['name'] . ($reason !== '' ? ': ' . $reason : ''));
        }
    } else fail(400, 'Invalid action', 'action');
    h_admin_seller_product_get($p['id']);
}


/** Admin renamed a category: move seller products (stored by category name) to the new name. */
function h_admin_category_rename() {
    require_admin();
    $b = body_json();
    $from = clean_str($b['from'] ?? '', 120); $to = clean_str($b['to'] ?? '', 120);
    if ($from === '' || $to === '') fail(400, 'Both names are required');
    if ($from === $to) json_out(['moved' => 0]);
    $n = (int)db_val('SELECT COUNT(*) FROM seller_products WHERE cat=?', [$from]);
    q('UPDATE seller_products SET cat=? WHERE cat=?', [$to, $from]);
    // the category tree follows (older admin screens rename by name)
    q('UPDATE categories SET name=?, updated_at=? WHERE parent_id=0 AND name=?', [$to, now_ts(), $from]);
    cat_flush();
    // pending edits may carry the old name too
    foreach (db_rows("SELECT id, chg FROM seller_products WHERE chg IS NOT NULL AND chg<>''") as $r) {
        $c = json_decode((string)$r['chg'], true);
        if (is_array($c) && ($c['cat'] ?? null) === $from) { $c['cat'] = $to; q('UPDATE seller_products SET chg=? WHERE id=?', [json_encode($c, JSON_UNESCAPED_UNICODE), $r['id']]); }
    }
    json_out(['moved' => $n]);
}
