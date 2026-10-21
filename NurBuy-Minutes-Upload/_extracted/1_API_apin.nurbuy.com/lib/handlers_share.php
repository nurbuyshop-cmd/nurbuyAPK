<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * Website addresses (SEO-friendly, shareable) and social previews.
 *   product   /p/{name-slug}-{id}        e.g. /p/fresh-rui-fish-sp42
 *   category  /c/{slug}/{sub-slug}/...   (any depth)
 *   shop      /shop/{name-slug}-{id}     e.g. /shop/rahman-mart-sl7
 *   order     /orders/{order id}
 * GET /share/meta?path=...  -> title, description and image for <meta> tags.
 *   The customer website's index.php puts these in the page itself, so
 *   WhatsApp / Messenger / Facebook show the product photo without running JS.
 * GET /og/{product id}      -> the product's main photo sized for link previews
 *   (JPEG, at most 1200 px, under ~300 KB). The address carries ?v=<photo>, so a
 *   new photo gives a new preview instead of the cached old one.
 * ===================================================================== */

function slug_or($s, $fallback) { $x = slugify($s); return $x !== '' ? $x : $fallback; }
function share_product_find($id) {
    $id = trim((string)$id);
    if (preg_match('/^sp(\d+)$/i', $id, $m)) {
        $p = db_row("SELECT p.*, s.shop_name, s.status sst, s.id sid FROM seller_products p JOIN sellers s ON s.id=p.seller_id WHERE p.id=?", [(int)$m[1]]);
        if (!$p || $p['status'] !== 'active' || (int)$p['hidden'] || $p['sst'] !== 'approved' || !in_array($p['v'] ?? 'both', ['min', 'both'], true)) return null;
        $imgs = seller_images($p);
        $f = cat_product_fields((int)($p['cat_id'] ?? 0), $p['cat'], $p['sub']);
        return ['id' => 'SP' . $p['id'], 'name' => $p['name'], 'bn' => (string)($p['bn'] ?? ''), 'about' => (string)($p['about_bn'] ?: $p['about']), 'price' => money($p['price']),
                'old' => money($p['old']), 'img_file' => $imgs ? $imgs[0] : null, 'img' => $imgs ? seller_img_url($imgs[0]) : '', 'shop' => $p['shop_name'],
                'cat' => $f, 'ver' => (int)$p['updated_at']];
    }
    list($D, $upd) = admin_state();
    foreach (($D['products'] ?? []) as $p) {
        if (!is_array($p) || strcasecmp((string)($p['id'] ?? ''), $id) !== 0) continue;
        if (strcasecmp((string)($p['status'] ?? ''), 'Active') !== 0 || !in_array($p['v'] ?? 'both', ['min', 'both'], true)) return null;
        $cid = cat_admin_product_id($p);
        return ['id' => (string)$p['id'], 'name' => (string)($p['n'] ?? ''), 'bn' => (string)($p['bn'] ?? ''), 'about' => (string)($p['about'] ?? ''), 'price' => is_num($p['pr'] ?? null) ? money($p['pr']) : 0,
                'old' => is_num($p['old'] ?? null) ? money($p['old']) : 0, 'img_file' => null, 'img' => brand_url($p['img'] ?? ''), 'shop' => (string)($p['sh'] ?? ''),
                'cat' => cat_product_fields($cid), 'ver' => $upd];
    }
    return null;
}
function share_product_path_for($p) { return '/p/' . slug_or($p['name'], 'product') . '-' . strtolower($p['id']); }
function share_product_path($id) { $p = share_product_find($id); return $p ? share_product_path_for($p) : null; }
function share_category_path($cid) { $f = cat_product_fields((int)$cid); return $f['cslug'] !== '' ? '/c/' . $f['cslug'] : null; }

/** Public site address for preview links (config 'site_urls.user'). */
function share_abs($path) { return site_url('user') . $path; }
function share_img_url($p) {
    if (!$p['img']) return '';
    // a local seller photo is served through the resized preview endpoint (cache-busted by the file name)
    if ($p['img_file']) return api_base() . '/og/' . strtolower($p['id']) . '?v=' . substr(md5($p['img_file']), 0, 10);
    return $p['img'] . (strpos($p['img'], '?') === false ? '?' : '&') . 'v=' . $p['ver'];
}
function api_base() {
    $base = trim((string)cfg('base_url', ''));
    if ($base === '') {
        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
        $dirn = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/index.php')), '/');
        $base = ($https ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . $dirn;
    }
    return rtrim($base, '/');
}
function share_site_name() { $n = state_setting('name', 'NurBuy'); return is_string($n) && $n !== '' ? $n : 'NurBuy'; }
function share_default_desc() { return 'NurBuy Minutes: আপনার এলাকার দোকান থেকে মিনিটের মধ্যে ডেলিভারি। ' . preg_replace('#^https?://#', '', site_url('user')); }
function share_text_short($s, $n = 160) { $s = trim(preg_replace('/\s+/u', ' ', strip_tags((string)$s))); return mb_strlen($s) > $n ? rtrim(mb_substr($s, 0, $n - 1)) . '…' : $s; }

function share_meta_for($path) {
    $site = share_site_name();
    $logo = brand_url(state_setting('brandLogo', '')) ?: '';
    $def = ['title' => $site . ' Minutes', 'desc' => share_default_desc(), 'image' => $logo, 'url' => share_abs('/'), 'type' => 'website', 'site' => $site, 'found' => false];
    $path = '/' . trim((string)$path, '/');
    if (preg_match('#^/p/(?:[a-z0-9-]*-)?((?:sp|p)\d+)$#i', $path, $m)) {
        $p = share_product_find($m[1]);
        if (!$p) return $def + ['status' => 404];
        $name = $p['bn'] !== '' ? $p['bn'] . ' | ' . $p['name'] : $p['name'];
        $price = '৳' . rtrim(rtrim(number_format($p['price'], 2, '.', ''), '0'), '.');
        $about = share_text_short($p['about'], 120);
        $desc = $price . ($p['old'] > $p['price'] ? ' (আগে ৳' . rtrim(rtrim(number_format($p['old'], 2, '.', ''), '0'), '.') . ')' : '') . ' · ' . ($p['shop'] ?: $site) . ($about !== '' ? ' · ' . $about : '') . ' — ' . $site . ' Minutes, ' . preg_replace('#^https?://#', '', site_url('user'));
        return ['title' => $name . ' | ' . $site, 'desc' => share_text_short($desc, 280), 'image' => share_img_url($p) ?: $def['image'], 'url' => share_abs(share_product_path_for($p)),
                'type' => 'product', 'site' => $site, 'found' => true, 'price' => $p['price'], 'id' => $p['id'], 'canonical' => share_product_path_for($p)];
    }
    if (preg_match('#^/c/([a-z0-9/-]+)$#', $path, $m)) {
        $slug = basename($m[1]);
        $r = db_row('SELECT * FROM categories WHERE slug=? AND active=1', [$slug]);
        if (!$r) return $def + ['status' => 404];
        $f = cat_product_fields((int)$r['id']);
        $nm = ($r['bn'] ?? '') !== '' ? $r['bn'] : $r['name'];
        return ['title' => $nm . ' | ' . $site . ' Minutes', 'desc' => implode(' › ', $f['cnames'] ?? [$r['name']]) . ' — ' . share_default_desc(), 'image' => brand_url($r['img'] ?? '') ?: $def['image'],
                'url' => share_abs('/c/' . $f['cslug']), 'type' => 'website', 'site' => $site, 'found' => true, 'canonical' => '/c/' . $f['cslug']];
    }
    if (preg_match('#^/shop/(?:[a-z0-9-]*-)?sl(\d+)$#i', $path, $m)) {
        $s = db_row("SELECT * FROM sellers WHERE id=? AND status='approved'", [(int)$m[1]]);
        if (!$s) return $def + ['status' => 404];
        $c = '/shop/' . slug_or($s['shop_name'], 'shop') . '-sl' . $s['id'];
        return ['title' => $s['shop_name'] . ' | ' . $site . ' Minutes', 'desc' => share_text_short(($s['about'] ?: $s['shop_name']) . ' — ' . share_default_desc(), 280),
                'image' => seller_img_url($s['cover'] ?? null) ?: (seller_img_url($s['logo']) ?: $def['image']), 'url' => share_abs($c), 'type' => 'website', 'site' => $site, 'found' => true, 'canonical' => $c];
    }
    return $def + ['url' => share_abs($path === '/' ? '/' : $path)];
}
function h_share_meta() {
    header('Cache-Control: public, max-age=60');
    json_out(share_meta_for((string)($_GET['path'] ?? '/')));
}

/** Product photo for link previews: 1200 px max JPEG, cached on disk. */
function h_og_image($id) {
    $p = share_product_find($id);
    if (!$p || !$p['img']) { http_response_code(404); exit; }
    if (!$p['img_file']) { header('Location: ' . $p['img'], true, 302); exit; }
    $src = seller_public_dir() . '/' . $p['img_file'];
    if (!is_file($src)) { http_response_code(404); exit; }
    $dir = seller_public_dir() . '/og';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $out = $dir . '/' . preg_replace('/\.[a-z]+$/', '', $p['img_file']) . '.jpg';
    if (!is_file($out) && function_exists('imagecreatetruecolor')) {
        $info = @getimagesize($src);
        $im = null;
        if ($info && $info[2] === IMAGETYPE_JPEG) $im = @imagecreatefromjpeg($src);
        elseif ($info && $info[2] === IMAGETYPE_PNG) $im = @imagecreatefrompng($src);
        elseif ($info && defined('IMAGETYPE_WEBP') && $info[2] === IMAGETYPE_WEBP && function_exists('imagecreatefromwebp')) $im = @imagecreatefromwebp($src);
        if ($im) {
            $w = imagesx($im); $h = imagesy($im); $k = min(1, 1200 / max($w, $h));
            $nw = max(1, (int)round($w * $k)); $nh = max(1, (int)round($h * $k));
            $dst = imagecreatetruecolor($nw, $nh);
            imagefill($dst, 0, 0, imagecolorallocate($dst, 255, 255, 255)); // transparent PNG -> white background
            imagecopyresampled($dst, $im, 0, 0, 0, 0, $nw, $nh, $w, $h);
            for ($qy = 85; $qy >= 50; $qy -= 10) { imagejpeg($dst, $out, $qy); clearstatcache(true, $out); if (filesize($out) < 280 * 1024) break; }
            imagedestroy($im); imagedestroy($dst);
        }
    }
    $file = is_file($out) ? $out : $src;
    $mime = is_file($out) ? 'image/jpeg' : ((new finfo(FILEINFO_MIME_TYPE))->file($src) ?: 'image/jpeg');
    header('Content-Type: ' . $mime);
    header('Cache-Control: public, max-age=604800');
    header('Content-Length: ' . filesize($file));
    readfile($file);
    exit;
}

/** Website brand files (favicon, touch icon, app manifest) with a version that changes when admin changes them. */
function h_site_manifest() {
    $site = share_site_name();
    $fav = brand_url(state_setting('favicon', '')); $logo = brand_url(state_setting('brandLogo', ''));
    $icon = $fav ?: $logo;
    $v = substr(md5($icon . '|' . $site), 0, 10);
    header('Content-Type: application/manifest+json; charset=utf-8');
    header('Cache-Control: no-cache');
    $icons = [];
    if ($icon) foreach ([192, 512] as $sz) $icons[] = ['src' => $icon . (strpos($icon, '?') === false ? '?' : '&') . 'v=' . $v, 'sizes' => $sz . 'x' . $sz, 'type' => 'image/png', 'purpose' => 'any'];
    echo json_encode(['name' => $site . ' Minutes', 'short_name' => $site, 'start_url' => '/', 'scope' => '/', 'display' => 'standalone',
                      'background_color' => '#ffffff', 'theme_color' => '#1d2fe0', 'lang' => 'bn', 'icons' => $icons], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
