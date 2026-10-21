<?php
if (!defined('NB')) { http_response_code(403); exit; }

/** Only http(s) image URLs (normally from /admin/upload) are passed to the public site. */
function brand_url($u) { $u = is_string($u) ? trim($u) : ''; return ($u !== '' && strlen($u) <= 500 && preg_match('#^https?://[^\s"\'<>]+$#i', $u)) ? $u : ''; }
function h_brand() {
    list($D) = admin_state();
    $S = (isset($D['set']) && is_array($D['set'])) ? $D['set'] : [];
    json_out(['title' => (isset($S['siteTitle']) && is_string($S['siteTitle'])) ? mb_substr(trim($S['siteTitle']), 0, 120) : '',
              'name' => (isset($S['name']) && is_string($S['name'])) ? mb_substr(trim($S['name']), 0, 80) : 'NurBuy',
              'logo' => brand_url($S['brandLogo'] ?? ''), 'favicon' => brand_url($S['favicon'] ?? ''),
              // each site can have its own tab icon; an empty one falls back to the website icon
              'favicons' => ['web' => brand_url($S['favicon'] ?? ''), 'seller' => brand_url($S['faviconSeller'] ?? ''), 'rider' => brand_url($S['faviconRider'] ?? ''), 'admin' => brand_url($S['faviconAdmin'] ?? '')],
              'v' => substr(md5((string)($S['favicon'] ?? '') . '|' . (string)($S['faviconSeller'] ?? '') . '|' . (string)($S['faviconRider'] ?? '') . '|' . (string)($S['faviconAdmin'] ?? '') . '|' . (string)($S['brandLogo'] ?? '')), 0, 10), 'homeIcon' => home_icon_setting($S)]);
}
/** Mobile bottom-bar Home icon chosen in admin: a built-in icon name or an uploaded image link. */
function home_icon_setting($S) {
    $v = isset($S['homeIcon']) && is_string($S['homeIcon']) ? trim($S['homeIcon']) : '';
    if ($v === '') return ['t' => 'lib', 'v' => 'house'];
    if (preg_match('/^lib:([a-z0-9-]{2,30})$/', $v, $m)) return ['t' => 'lib', 'v' => $m[1]];
    $u = brand_url($v);
    return $u ? ['t' => 'img', 'v' => $u] : ['t' => 'lib', 'v' => 'house'];
}
/** Website pages (About, Privacy, Return, Shipping) and the footer are kept in their own record (kv 'site_content'),
 *  saved by PUT /admin/site-content. They no longer depend on the big admin-state save, which is refused as a whole when the
 *  state is too large or two products share an ID. A value saved there wins over the same value inside the admin state. */
function site_content() {
    $row = kv_get('site_content');
    $d = $row ? json_decode((string)$row['v'], true) : [];
    return is_array($d) ? $d : [];
}
function site_settings_overlay($S) {
    $C = site_content();
    if (isset($C['pol']) && is_array($C['pol'])) {
        foreach (['polAbout', 'polPrivacy', 'polReturn', 'polShipping'] as $k) if (isset($C['pol'][$k]) && is_array($C['pol'][$k])) $S[$k] = $C['pol'][$k];
    }
    if (array_key_exists('footer', $C) && is_array($C['footer'])) $S['footer'] = $C['footer'];
    return $S;
}
/** About / Privacy / Return / Shipping texts edited in admin (plain text, one English and one Bengali version each). */
function site_policies($S) {
    $out = [];
    foreach (['about' => 'polAbout', 'privacy' => 'polPrivacy', 'return' => 'polReturn', 'shipping' => 'polShipping'] as $k => $key) {
        $v = (isset($S[$key]) && is_array($S[$key])) ? $S[$key] : [];
        $en = isset($v['en']) && is_string($v['en']) ? mb_substr(trim($v['en']), 0, 100000) : '';
        $bn = isset($v['bn']) && is_string($v['bn']) ? mb_substr(trim($v['bn']), 0, 100000) : '';
        if ($en !== '' || $bn !== '') $out[$k] = ['en' => $en, 'bn' => $bn];
    }
    return (object)$out;
}
/** A footer link: web address, mail/phone link, site path or an in-site action word (#home, #deals ...). Anything else is dropped. */
function footer_link($u) {
    $u = is_string($u) ? trim($u) : '';
    if ($u === '' || strlen($u) > 500) return '';
    return preg_match('~^(https?://[^\s"\'<>]+|mailto:[^\s"\'<>]+|tel:[^\s"\'<>]+|#[a-z]{2,12}|/(?!/)[^\s"\'<>]*)$~i', $u) ? $u : '';
}
function footer_text($v, $max = 200) {
    $o = ['en' => '', 'bn' => ''];
    if (is_array($v)) foreach (['en', 'bn'] as $k) if (isset($v[$k]) && is_string($v[$k])) $o[$k] = mb_substr(trim($v[$k]), 0, $max);
    return $o;
}
function footer_str($v, $max = 120) { return is_string($v) ? mb_substr(trim($v), 0, $max) : ''; }
/** Footer content edited in admin (Settings > Footer). Only the known fields, short texts and safe links are passed to the public site;
 *  a field that was never saved is left out so the website keeps its built-in text for it. */
function site_footer($S) {
    $F = (isset($S['footer']) && is_array($S['footer'])) ? $S['footer'] : null;
    if (!$F) return null;
    $out = [];
    foreach (['tagline', 'quickT', 'servT', 'moreT', 'contactT', 'addr', 'hours'] as $k) if (array_key_exists($k, $F)) $out[$k] = footer_text($F[$k], 200);
    if (array_key_exists('about', $F)) $out['about'] = footer_text($F['about'], 600);
    foreach (['phone', 'email'] as $k) if (array_key_exists($k, $F)) $out[$k] = footer_str($F[$k], 120);
    if (isset($F['social']) && is_array($F['social'])) {
        $o = [];
        foreach (['facebook', 'youtube', 'instagram', 'x', 'linkedin'] as $k) if (array_key_exists($k, $F['social'])) $o[$k] = footer_link($F['social'][$k]);
        if ($o) $out['social'] = $o;
    }
    foreach (['quick' => ['t', 'u'], 'serv' => ['t', 's', 'u'], 'more' => ['t', 's', 'u']] as $k => $fields) {
        if (!isset($F[$k]) || !is_array($F[$k])) continue;
        $rows = [];
        foreach (array_slice(array_values($F[$k]), 0, 12) as $it) {
            $it = is_array($it) ? $it : [];
            $r = [];
            foreach ($fields as $f) if (array_key_exists($f, $it)) $r[$f] = ($f === 'u') ? footer_link($it[$f]) : footer_text($it[$f], 200);
            $rows[] = $r ?: new stdClass();
        }
        $out[$k] = $rows;
    }
    if (isset($F['news']) && is_array($F['news'])) {
        $n = [];
        if (array_key_exists('on', $F['news'])) $n['on'] = (bool)$F['news']['on'];
        foreach (['t', 's', 'ph', 'btn'] as $f) if (array_key_exists($f, $F['news'])) $n[$f] = footer_text($F['news'][$f], 200);
        if ($n) $out['news'] = $n;
    }
    if (isset($F['app']) && is_array($F['app'])) {
        $n = [];
        foreach (['t', 's'] as $f) if (array_key_exists($f, $F['app'])) $n[$f] = footer_text($F['app'][$f], 200);
        foreach (['gp', 'as'] as $f) if (array_key_exists($f, $F['app'])) $n[$f] = footer_link($F['app'][$f]);
        if ($n) $out['app'] = $n;
    }
    return $out ?: null;
}
/** POST /newsletter {email}: the footer newsletter box. Addresses are kept in one list that the admin can download. */
function h_newsletter_subscribe() {
    throttle_check('newsletter');
    $b = body_json();
    $e = (isset($b['email']) && is_string($b['email'])) ? mb_strtolower(trim($b['email'])) : '';
    if ($e === '' || strlen($e) > 120 || !filter_var($e, FILTER_VALIDATE_EMAIL)) fail(400, 'Enter a valid email', 'email');
    throttle_fail('newsletter'); // counts every subscription from this address of the visitor: at most 10 per 15 minutes
    $row = kv_get('newsletter');
    $list = $row ? json_decode((string)$row['v'], true) : [];
    if (!is_array($list)) $list = [];
    if (!isset($list[$e])) {
        if (count($list) >= 20000) fail(503, 'Subscriptions are closed for now');
        $list[$e] = now_ts();
        kv_set('newsletter', json_encode($list, JSON_UNESCAPED_UNICODE));
    }
    json_out(['ok' => true]);
}
function h_health() { json_out(['ok' => true, 'time' => now_ts()]); }

function h_catalog() {
    header('Cache-Control: no-cache');
    $data = catalog_build();
    $js = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    // send it compressed when the browser accepts it: the catalog is large and this is what the home page waits for
    if ($js !== false && strlen($js) > 2048 && function_exists('gzencode') && stripos($_SERVER['HTTP_ACCEPT_ENCODING'] ?? '', 'gzip') !== false && !headers_sent() && !ini_get('zlib.output_compression')) {
        $z = gzencode($js, 5);
        if ($z !== false) {
            http_response_code(200);
            header('Content-Type: application/json; charset=utf-8'); header('X-Content-Type-Options: nosniff');
            header('Content-Encoding: gzip'); header('Vary: Accept-Encoding'); header('Content-Length: ' . strlen($z));
            echo $z; exit;
        }
    }
    json_out($data);
}
/** Units sold per product id in the last 30 days (cancelled and returned orders not counted). Cached for 10 minutes. */
function product_recent_sales() {
    static $m = null;
    if ($m !== null) return $m;
    $c = kv_get('psales');
    if ($c && (int)$c['updated_at'] > now_ts() - 600) { $j = json_decode((string)$c['v'], true); if (is_array($j)) return $m = $j; }
    $m = [];
    foreach (db_rows("SELECT items FROM orders WHERE created_at >= ? AND status NOT IN ('Cancelled','Returned')", [now_ts() - 30 * 86400]) as $r) {
        $it = json_decode((string)$r['items'], true);
        if (!is_array($it)) continue;
        foreach ($it as $x) {
            if (!is_array($x) || !isset($x['id']) || !is_scalar($x['id'])) continue;
            $id = (string)$x['id'];
            $m[$id] = ($m[$id] ?? 0) + max(0, (int)($x['q'] ?? 0));
        }
    }
    kv_set('psales', json_encode($m ?: new stdClass()));
    return $m;
}
/** Public catalog document (also used by Banner Studio for product layers). */
function catalog_build() {
    cat_ensure();
    list($D, $upd) = admin_state();
    $cats = (isset($D['cats']) && is_array($D['cats'])) ? $D['cats'] : [];
    $stores = [];
    if (isset($D['stores']) && is_array($D['stores'])) {
        foreach ($D['stores'] as $s) {
            if (is_array($s) && isset($s['n'])) $stores[(string)$s['n']] = $s['status'] ?? ($s['st'] ?? null);
        }
    }
    // when each product first appeared (ms): the admin stamps new products; older ones get the time the catalog first saw them
    $seenRow = kv_get('prod_seen'); $seen = $seenRow ? json_decode($seenRow['v'], true) : [];
    if (!is_array($seen)) $seen = [];
    $firstRun = !$seenRow; // products that existed before this feature count as old (0), never as new
    $seenDirty = false; $nowMs = (int)(microtime(true) * 1000);
    $products = [];
    if (isset($D['products']) && is_array($D['products'])) {
        foreach ($D['products'] as $p) {
            if (!is_array($p)) continue;
            $pid = (string)($p['id'] ?? '');
            if ($pid !== '' && !isset($seen[$pid])) { $seen[$pid] = (isset($p['ts']) && is_num($p['ts']) && $p['ts'] > 0 && $p['ts'] <= $nowMs + 120000) ? (int)$p['ts'] : ($firstRun ? 0 : $nowMs); $seenDirty = true; }
            if (strcasecmp((string)($p['status'] ?? ''), 'Active') !== 0) continue;
            $sh = isset($p['sh']) ? (string)$p['sh'] : '';
            if ($sh !== '' && array_key_exists($sh, $stores) && $stores[$sh] !== null && strcasecmp((string)$stores[$sh], 'Approved') !== 0) continue;
            $cn = ''; $cb = '';
            if (isset($p['c']) && is_scalar($p['c']) && isset($cats[$p['c']]) && is_array($cats[$p['c']])) {
                $cn = (string)($cats[$p['c']]['n'] ?? ''); $cb = (string)($cats[$p['c']]['b'] ?? '');
            }
            $v = $p['v'] ?? 'both';
            if ($v !== 'min' && $v !== 'both') continue; // only products sold on Minutes are published
            $v = 'min';
            $cf = cat_product_fields(cat_admin_product_id($p), $cn, (string)($p['sc'] ?? ''));
            if ($cf['cid']) { $cn = $cf['cat']; $cb = $cf['catBn']; }
            $products[] = [
                'cid' => $cf['cid'], 'cpath' => $cf['cpath'],
                'ts' => (int)($seen[$pid] ?? 0), 'pcode' => (isset($p['pcode']) && is_string($p['pcode'])) ? $p['pcode'] : '',
                'id' => $p['id'] ?? '', 'n' => (string)($p['n'] ?? ''), 'e' => (string)($p['e'] ?? ''),
                'img' => (string)($p['img'] ?? ''), 'cat' => $cn, 'catBn' => $cb, 'v' => $v,
                'pr' => is_num($p['pr'] ?? null) ? money($p['pr']) : 0,
                'old' => is_num($p['old'] ?? null) ? money($p['old']) : 0,
                'st' => (int)($p['st'] ?? ($p['stock'] ?? 0)),
                'sh' => $sh, 'sold' => (int)($p['sold'] ?? 0), 'bn' => (string)($p['bn'] ?? ''),
                'about' => mb_substr((string)($p['about'] ?? ($p['desc'] ?? '')), 0, 3000), 'specs' => clean_specs($p['sp'] ?? []),
                'tags' => (isset($p['tags']) && is_string($p['tags'])) ? mb_substr(preg_replace('/[,\s]+/u', ' ', $p['tags']), 0, 300) : '',
                'sub' => (string)($p['sc'] ?? ''), 'imgs' => (isset($p['imgs']) && is_array($p['imgs'])) ? array_values(array_filter($p['imgs'], 'is_string')) : [],
            ];
        }
    }
    if ($seenDirty) { try { kv_set('prod_seen', json_encode($seen)); } catch (Exception $e) {} }
    // categories: the admin's tree (any depth, admin's order); main categories first
    $outCats = [];
    foreach (cat_tree(true) as $c) $outCats[] = $c + ['v' => 'min'];
    $S = site_settings_overlay((isset($D['set']) && is_array($D['set'])) ? $D['set'] : []);
    $numOr = function ($k, $def) use ($S) { return (isset($S[$k]) && is_num($S[$k])) ? (float)$S[$k] : $def; };
    $boolOr = function ($k, $def) use ($S) { return array_key_exists($k, $S) && $S[$k] !== null ? (bool)$S[$k] : $def; };
    $settings = [
        'name' => (isset($S['name']) && is_string($S['name']) && $S['name'] !== '') ? $S['name'] : 'NurBuy',
        'walletPct' => $numOr('walletPct', 1), 'codFee' => $numOr('codFee', 10),
        'feeMin' => $numOr('feeMin', null),
        'freeAbove' => $numOr('freeAbove', null), 'minOrd' => $numOr('minOrd', null),
        'maint' => $boolOr('maint', false), 'cod' => $boolOr('cod', true), 'bkash' => $boolOr('bkash', true),
        'title' => (isset($S['siteTitle']) && is_string($S['siteTitle'])) ? mb_substr(trim($S['siteTitle']), 0, 120) : '',
        'pol' => site_policies($S),
        'footer' => site_footer($S),
        'logo' => brand_url($S['brandLogo'] ?? ''), 'favicon' => brand_url($S['favicon'] ?? ''),
        'homeIcon' => home_icon_setting($S), 'eta' => function_exists('delivery_eta_default') ? delivery_eta_default() : 59,
    ];
    $outStores = [];
    if (isset($D['stores']) && is_array($D['stores'])) {
        foreach ($D['stores'] as $st) {
            if (!is_array($st) || !isset($st['n'])) continue;
            if (strcasecmp((string)($st['status'] ?? 'Approved'), 'Approved') !== 0) continue;
            if (($st['t'] ?? '') !== 'min') continue; // only Minutes stores are published
            $outStores[] = ['id' => $st['id'] ?? '', 'n' => (string)$st['n'], 't' => 'min',
                'ow' => (string)($st['ow'] ?? ''), 'r' => is_num($st['r'] ?? null) ? (float)$st['r'] : 4.5, 'img' => (string)($st['img'] ?? '')];
        }
    }
    $ci = [];
    foreach ($outCats as $c) $ci[$c['n']] = $c['b'];
    try {
        foreach (seller_catalog_products($ci) as $sp) $products[] = $sp;
        foreach (seller_catalog_stores() as $ss) $outStores[] = $ss;
    } catch (Throwable $e) { error_log('catalog sellers: ' . $e->getMessage()); }
    try { $fc = follow_counts(); foreach ($outStores as &$os) if (!isset($os['fl'])) $os['fl'] = $fc[(string)$os['id']] ?? 0; unset($os); } catch (Throwable $e) { error_log('catalog follows: ' . $e->getMessage()); }
    $sales = [];
    try { $sales = product_recent_sales(); } catch (Throwable $e) { error_log('catalog sales: ' . $e->getMessage()); }
    foreach ($products as &$pp) $pp['s30'] = (int)($sales[(string)$pp['id']] ?? 0);
    unset($pp);
    $hero = array_key_exists('hero', $D) ? $D['hero'] : null;
    $banners = (isset($D['banners']) && is_array($D['banners'])) ? $D['banners'] : null;
    $spon = (isset($D['spon']) && is_array($D['spon'])) ? $D['spon'] : new stdClass();
    // "updated" is a content signature, so seller products/logos changing also refreshes open sites
    $bs = function_exists('bs_public') ? bs_public() : ['banners' => [], 'fonts' => []];
    $bsSig = $bs; unset($bsSig['now']);
    $ads = function_exists('ad_public_list') ? ad_public_list() : [];
    $sig = (!$products && !$outStores && !$outCats && $hero === null && $banners === null) ? $upd : (string)$upd . ':' . sprintf('%u', crc32(json_encode([$products, $outCats, $outStores, $settings, $spon, $hero, $banners, $bsSig, $ads], JSON_UNESCAPED_UNICODE | JSON_PARTIAL_OUTPUT_ON_ERROR)));
    return ['products' => $products, 'cats' => $outCats, 'settings' => $settings, 'stores' => $outStores, 'spon' => $spon, 'hero' => $hero, 'banners' => $banners, 'bs' => $bs, 'ads' => $ads, 'updated' => $sig];
}
