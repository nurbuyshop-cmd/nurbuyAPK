<?php
/* NurBuy Minutes (minutes.nurbuy.com) front page.
 * Every page address of the site (/p/<product>, /c/<category>, /shop/<shop>, /orders/<id>, /wallet ...) opens index.html.
 * For product, category and shop links the page title and link-preview tags (Facebook, WhatsApp, Messenger)
 * are filled in here on the server, from the API's /share/meta, so a shared link shows the right photo and name.
 * Also serves /manifest.webmanifest and /favicon.ico from the admin's settings.
 * The API address is read from config.js (window.NB_API). Nothing is written except small cache files in the temp folder.
 */
$root = __DIR__;
$uri = (string)($_SERVER['REQUEST_URI'] ?? '/');
$path = rawurldecode((string)(parse_url($uri, PHP_URL_PATH) ?: '/'));
// php -S (local testing): real files are served as they are
if (PHP_SAPI === 'cli-server' && $path !== '/' && is_file($root . $path) && basename($path) !== 'index.php') return false;

function nbm_api_base($root) {
    $c = @file_get_contents($root . '/config.js');
    if ($c === false || !preg_match('/NB_API\s*=\s*[\'"]([^\'"]+)[\'"]/', $c, $m)) return '';
    $b = rtrim($m[1], '/');
    if ($b !== '' && $b[0] === '/') {
        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
        $b = ($https ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'localhost') . $b;
    }
    if (preg_match('/NB_API_PRETTY\s*=\s*false/', $c)) $b .= '/index.php';
    return $b;
}
/** GET an API path as JSON; cached for $ttl seconds so the page stays fast. */
function nbm_get($base, $p, $ttl = 120) {
    if ($base === '') return null;
    $f = rtrim(sys_get_temp_dir(), '/') . '/nbm_' . md5($base . '|' . $p) . '.json';
    if (is_file($f) && filemtime($f) > time() - $ttl) { $j = json_decode((string)@file_get_contents($f), true); if (is_array($j)) return $j; }
    $ctx = stream_context_create(['http' => ['timeout' => 2.5, 'ignore_errors' => true, 'header' => "Accept: application/json\r\nUser-Agent: NurBuyMinutesPage\r\n"],
                                  'ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
    $t = @file_get_contents($base . $p, false, $ctx);
    $j = $t !== false ? json_decode($t, true) : null;
    if (is_array($j)) { @file_put_contents($f, json_encode($j), LOCK_EX); return $j; }
    if (is_file($f)) { $j = json_decode((string)@file_get_contents($f), true); if (is_array($j)) return $j; } // old copy is better than nothing
    return null;
}
function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function nbm_ver($u) { return $u === '' ? '' : $u . (strpos($u, '?') === false ? '?' : '&') . 'v=' . substr(md5($u), 0, 8); }

$base = nbm_api_base($root);

if ($path === '/manifest.webmanifest') {
    $m = nbm_get($base, '/site/manifest', 300);
    if (!$m) $m = ['name' => 'NurBuy Minutes', 'short_name' => 'NurBuy', 'display' => 'standalone', 'background_color' => '#ffffff', 'theme_color' => '#1d2fe0', 'icons' => []];
    $m['start_url'] = '/'; $m['scope'] = '/';
    header('Content-Type: application/manifest+json; charset=utf-8'); header('Cache-Control: no-cache');
    echo json_encode($m, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
if ($path === '/favicon.ico') {
    $b = nbm_get($base, '/brand', 300);
    $fav = is_array($b) ? (string)($b['favicon'] ?? '') : '';
    if ($fav !== '' && preg_match('#^https?://#i', $fav)) { header('Cache-Control: public, max-age=3600'); header('Location: ' . nbm_ver($fav), true, 302); exit; }
    http_response_code(404); exit;
}
// anything that looks like a missing file (e.g. /old.png) is a real 404, not the page
if (preg_match('#\.(png|jpe?g|gif|webp|svg|ico|css|js|map|txt|json|xml|woff2?|ttf)$#i', $path)) { http_response_code(404); header('Content-Type: text/plain'); echo 'Not found'; exit; }

$html = @file_get_contents($root . '/index.html');
if ($html === false) { http_response_code(500); echo 'index.html is missing'; exit; }

$meta = null; $code = 200;
if (preg_match('#^/(p|c|shop)/#', $path) || $path === '/') {
    $meta = nbm_get($base, '/share/meta?path=' . rawurlencode($path), 120);
    if (is_array($meta) && (int)($meta['status'] ?? 200) === 404) $code = 404;
}
$brand = nbm_get($base, '/brand', 300);
$site = is_array($meta) && !empty($meta['site']) ? $meta['site'] : (is_array($brand) && !empty($brand['name']) ? $brand['name'] : 'NurBuy');
$title = is_array($meta) && !empty($meta['title']) ? $meta['title'] : $site . ' Minutes';
$desc = is_array($meta) && !empty($meta['desc']) ? $meta['desc'] : 'NurBuy Minutes – বাজার, খাবার, ঔষধ ও প্রয়োজনীয় সবকিছু কয়েক মিনিটে আপনার দরজায়।';
$img = is_array($meta) ? (string)($meta['image'] ?? '') : '';
$scheme = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')) ? 'https' : 'http';
$self = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'minutes.nurbuy.com');
$url = $self . (is_array($meta) && !empty($meta['canonical']) ? $meta['canonical'] : ($path === '/' ? '/' : $path));
$type = is_array($meta) && ($meta['type'] ?? '') === 'product' ? 'product' : 'website';

$tags = '<title>' . h($title) . "</title>\n"
    . '<meta name="description" content="' . h($desc) . "\">\n"
    . '<link rel="canonical" href="' . h($url) . "\">\n"
    . '<meta property="og:site_name" content="' . h($site) . " Minutes\">\n"
    . '<meta property="og:type" content="' . $type . "\">\n"
    . '<meta property="og:title" content="' . h($title) . "\">\n"
    . '<meta property="og:description" content="' . h($desc) . "\">\n"
    . '<meta property="og:url" content="' . h($url) . "\">\n"
    . '<meta property="og:locale" content="bn_BD">' . "\n"
    . ($img !== '' ? '<meta property="og:image" content="' . h($img) . "\">\n<meta property=\"og:image:alt\" content=\"" . h($title) . "\">\n<meta name=\"twitter:image\" content=\"" . h($img) . "\">\n" : '')
    . '<meta name="twitter:card" content="' . ($img !== '' ? 'summary_large_image' : 'summary') . "\">\n"
    . '<meta name="twitter:title" content="' . h($title) . "\">\n"
    . '<meta name="twitter:description" content="' . h($desc) . "\">\n";
if ($type === 'product' && isset($meta['price'])) $tags .= '<meta property="product:price:amount" content="' . h($meta['price']) . "\">\n<meta property=\"product:price:currency\" content=\"BDT\">\n";
$fav = is_array($brand) ? (string)($brand['favicon'] ?? '') : '';
if ($fav !== '' && preg_match('#^https?://#i', $fav)) {
    $fv = nbm_ver($fav);
    $tags .= '<link rel="icon" href="' . h($fv) . "\">\n<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"" . h($fv) . "\">\n";
}

// replace the page's own title / description with the ones for this address
$html = preg_replace('#<title>.*?</title>\s*#s', '', $html, 1);
$html = preg_replace('#<meta name="description"[^>]*>\s*#', '', $html, 1);
$k = stripos($html, '<meta charset="utf-8">');
if ($k !== false) { $k += strlen('<meta charset="utf-8">'); $html = substr($html, 0, $k) . "\n" . $tags . substr($html, $k); }

http_response_code($code);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache');
header('X-Content-Type-Options: nosniff');
echo $html;
