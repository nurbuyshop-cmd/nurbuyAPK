<?php
/* Banner Studio: banners, versions, media library, custom templates, team permissions, public feed. */
if (!defined('NB')) { http_response_code(403); exit; }

const BS_PERMS = ['create', 'edit', 'delete', 'publish', 'templates', 'assets'];
const BS_PLACES = ['home', 'home_min', 'strip_min', 'top_min', 'sponsored', 'category', 'product', 'store', 'promo'];
const BS_KINDS = ['image', 'logo', 'product', 'icon', 'background', 'decor', 'gif', 'video', 'font'];
const BS_MAX_DATA = 1500000;

/* ---------------- access ---------------- */
function bs_admin_perms($a) {
    if (($a['role'] ?? '') === 'admin') return BS_PERMS;
    $p = json_decode((string)($a['perms'] ?? ''), true);
    return is_array($p) ? array_values(array_intersect(BS_PERMS, $p)) : [];
}
/** Any signed-in admin (owner or banner staff). $perm = null means "can open the studio". */
function require_bs($perm = null) {
    $s = current_session();
    if (!$s) fail(401, 'Authentication required');
    if ($s['role'] !== 'admin') fail(403, 'Admin access required');
    $a = db_row('SELECT * FROM admins WHERE id=?', [$s['user_id']]);
    if (!$a) fail(401, 'Authentication required');
    if (!in_array($a['role'], ['admin', 'banner'], true)) fail(403, 'Admin access required');
    $p = bs_admin_perms($a);
    if ($perm !== null && !in_array($perm, $p, true)) fail(403, 'You do not have permission for this', null, 'no_permission');
    if ($perm === null && $a['role'] !== 'admin' && !$p) fail(403, 'You do not have Banner Studio access', null, 'no_permission');
    $a['_perms'] = $p;
    return $a;
}
function h_bs_me() {
    $a = require_bs();
    json_out(['id' => (int)$a['id'], 'name' => $a['name'], 'email' => $a['email'], 'role' => $a['role'], 'perms' => $a['_perms']]);
}

/* ---------------- banner data ---------------- */
function bs_ts($v) {
    if ($v === null || $v === '' || $v === 0) return null;
    if (is_num($v)) { $t = (int)$v; if ($t > 100000000000) $t = (int)floor($t / 1000); return $t > 0 ? $t : null; }
    if (is_string($v)) { $t = strtotime($v); return $t === false ? false : $t; }
    return false;
}
function bs_places($v) {
    if (!is_array($v)) return [];
    $out = [];
    foreach ($v as $p) if (is_string($p) && in_array($p, BS_PLACES, true) && !in_array($p, $out, true)) $out[] = $p;
    return $out;
}
/** Validates the design document (shape only; the renderer escapes every value it prints). */
function bs_data($d) {
    if (!is_array($d)) fail(400, 'Banner design is missing', 'data');
    $j = json_encode($d, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($j === false) fail(400, 'Banner design is not valid', 'data');
    if (strlen($j) > BS_MAX_DATA) fail(413, 'Banner design is too large. Remove some layers or images.', 'data');
    if (stripos($j, 'data:') !== false && preg_match('#"data:(?!image/svg)#i', $j) && strlen($j) > 400000) fail(400, 'Upload images to the media library instead of pasting them', 'data');
    if (preg_match('#javascript\s*:#i', $j)) fail(400, 'Links cannot use javascript:', 'data');
    if (!isset($d['designs']) || !is_array($d['designs']) || !$d['designs']) fail(400, 'Banner needs at least one design', 'data');
    $n = 0;
    foreach ($d['designs'] as $dev => $ds) {
        if (!in_array($dev, ['desktop', 'tablet', 'mobile'], true)) fail(400, 'Unknown device ' . $dev, 'data');
        if ($ds === null) continue;
        if (!is_array($ds) || !isset($ds['w'], $ds['h']) || !is_num($ds['w']) || !is_num($ds['h'])) fail(400, 'Each design needs a width and height', 'data');
        if ($ds['w'] < 50 || $ds['h'] < 30 || $ds['w'] > 4000 || $ds['h'] > 4000) fail(400, 'Banner size must be 50 to 4000 px', 'data');
        if (isset($ds['layers']) && !is_array($ds['layers'])) fail(400, 'Layers must be a list', 'data');
        $n += isset($ds['layers']) ? count($ds['layers']) : 0;
    }
    if ($n > 600) fail(400, 'Too many layers', 'data');
    return $j;
}
function bs_row_out($r, $full = false) {
    $o = ['id' => (int)$r['id'], 'name' => $r['name'], 'status' => $r['status'], 'places' => json_decode((string)$r['places'], true) ?: [],
          'start' => $r['start_at'] === null ? null : (int)$r['start_at'] * 1000, 'end' => $r['end_at'] === null ? null : (int)$r['end_at'] * 1000,
          'version' => (int)$r['version'], 'changed' => $r['pub'] !== null && $r['pub'] !== $r['data'], 'live_ever' => $r['pub'] !== null,
          'created_at' => (int)$r['created_at'] * 1000, 'updated_at' => (int)$r['updated_at'] * 1000,
          'created_by' => $r['created_by'], 'updated_by' => $r['updated_by'], 'published_at' => $r['published_at'] === null ? null : (int)$r['published_at'] * 1000,
          'data' => json_decode((string)$r['data'], true)];
    $now = now_ts();
    $o['state'] = $r['status'] !== 'published' ? $r['status'] : (($r['start_at'] !== null && $now < (int)$r['start_at']) ? 'scheduled' : (($r['end_at'] !== null && $now > (int)$r['end_at']) ? 'ended' : 'live'));
    if ($full) {
        $o['autosave'] = $r['autosave'] !== null ? json_decode((string)$r['autosave'], true) : null;
        $o['autosave_at'] = $r['autosave_at'] === null ? null : (int)$r['autosave_at'] * 1000;
        $o['versions'] = [];
        foreach (db_rows('SELECT id, version, note, created_at, created_by FROM bs_versions WHERE banner_id=? ORDER BY id DESC LIMIT 50', [(int)$r['id']]) as $v)
            $o['versions'][] = ['id' => (int)$v['id'], 'version' => (int)$v['version'], 'note' => $v['note'], 'at' => (int)$v['created_at'] * 1000, 'by' => $v['created_by']];
    }
    return $o;
}
function bs_get_row($id, $lock = false) {
    $r = db_row('SELECT * FROM bs_banners WHERE id=?' . ($lock ? lock_suffix() : ''), [(int)$id]);
    if (!$r) fail(404, 'Banner not found');
    return $r;
}
function bs_who($a) { return mb_substr((string)($a['name'] ?: $a['email']), 0, 120); }
function bs_sched($b, &$start, &$end) {
    if (array_key_exists('start', $b)) { $start = bs_ts($b['start']); if ($start === false) fail(400, 'Start date is not valid', 'start'); }
    if (array_key_exists('end', $b)) { $end = bs_ts($b['end']); if ($end === false) fail(400, 'End date is not valid', 'end'); }
    if ($start !== null && $end !== null && $end <= $start) fail(400, 'End time must be after the start time', 'end');
}

function h_bs_list() {
    require_bs();
    $out = [];
    foreach (db_rows('SELECT * FROM bs_banners ORDER BY updated_at DESC, id DESC LIMIT 500') as $r) $out[] = bs_row_out($r);
    json_out(['banners' => $out, 'now' => now_ts() * 1000]);
}
function h_bs_get($id) { require_bs(); json_out(['banner' => bs_row_out(bs_get_row($id), true)]); }
function h_bs_create() {
    $a = require_bs('create');
    $b = body_json();
    $name = clean_str($b['name'] ?? '', 120);
    if ($name === '') fail(400, 'Give the banner a name', 'name');
    $j = bs_data($b['data'] ?? null);
    $start = null; $end = null; bs_sched($b, $start, $end);
    $t = now_ts();
    q('INSERT INTO bs_banners (name, status, places, data, pub, autosave, autosave_at, start_at, end_at, version, created_at, updated_at, created_by, updated_by, published_at) VALUES (?,?,?,?,NULL,NULL,NULL,?,?,0,?,?,?,?,NULL)',
      [$name, 'draft', json_encode(bs_places($b['places'] ?? [])), $j, $start, $end, $t, $t, bs_who($a), bs_who($a)]);
    $id = (int)db()->lastInsertId();
    json_out(['banner' => bs_row_out(bs_get_row($id), true)], 201);
}
/** Save the working copy (draft). If 'publish' is true and allowed, the live copy is updated too. */
function h_bs_update($id) {
    $a = require_bs('edit');
    $b = body_json();
    $r = bs_get_row($id);
    $name = array_key_exists('name', $b) ? clean_str($b['name'], 120) : $r['name'];
    if ($name === '') fail(400, 'Give the banner a name', 'name');
    $j = array_key_exists('data', $b) ? bs_data($b['data']) : $r['data'];
    $places = array_key_exists('places', $b) ? json_encode(bs_places($b['places'])) : $r['places'];
    $start = $r['start_at'] === null ? null : (int)$r['start_at']; $end = $r['end_at'] === null ? null : (int)$r['end_at'];
    bs_sched($b, $start, $end);
    if (isset($b['updated_at']) && is_num($b['updated_at']) && (int)floor($b['updated_at'] / 1000) < (int)$r['updated_at'] && empty($b['force']))
        fail(409, 'Someone else saved this banner after you opened it. Reload to see their changes.', null, 'stale');
    q('UPDATE bs_banners SET name=?, places=?, data=?, start_at=?, end_at=?, autosave=NULL, autosave_at=NULL, updated_at=?, updated_by=? WHERE id=?',
      [$name, $places, $j, $start, $end, now_ts(), bs_who($a), (int)$id]);
    if (!empty($b['publish'])) {
        if (!in_array('publish', $a['_perms'], true)) fail(403, 'Saved as draft. You do not have permission to publish.', null, 'no_permission');
        bs_publish_row((int)$id, $a, clean_str($b['note'] ?? '', 200));
    }
    json_out(['banner' => bs_row_out(bs_get_row($id), true)]);
}
function h_bs_autosave($id) {
    $a = require_bs('edit');
    $b = body_json();
    bs_get_row($id);
    $j = bs_data($b['data'] ?? null);
    q('UPDATE bs_banners SET autosave=?, autosave_at=? WHERE id=?', [$j, now_ts(), (int)$id]);
    json_out(['ok' => true, 'at' => now_ts() * 1000]);
}
function bs_publish_row($id, $a, $note = '') {
    db_tx(function () use ($id, $a, $note) {
        $r = bs_get_row($id, true);
        $v = (int)$r['version'] + 1; $t = now_ts();
        q("UPDATE bs_banners SET status='published', pub=data, version=?, published_at=?, updated_at=?, updated_by=? WHERE id=?", [$v, $t, $t, bs_who($a), (int)$id]);
        q('INSERT INTO bs_versions (banner_id, version, name, places, data, note, created_at, created_by) VALUES (?,?,?,?,?,?,?,?)',
          [(int)$id, $v, $r['name'], $r['places'], $r['data'], $note !== '' ? $note : null, $t, bs_who($a)]);
        // keep the 30 newest versions
        $old = db_rows('SELECT id FROM bs_versions WHERE banner_id=? ORDER BY id DESC LIMIT 1000 OFFSET 30', [(int)$id]);
        foreach ($old as $o) q('DELETE FROM bs_versions WHERE id=?', [(int)$o['id']]);
    });
}
function h_bs_publish($id) {
    $a = require_bs('publish');
    $b = body_json();
    $r = bs_get_row($id);
    $places = json_decode((string)$r['places'], true) ?: [];
    if (!$places) fail(400, 'Choose where the banner will show before publishing', 'places', 'no_place');
    bs_publish_row((int)$id, $a, clean_str($b['note'] ?? '', 200));
    json_out(['banner' => bs_row_out(bs_get_row($id), true)]);
}
function h_bs_status($id) {
    $a = require_bs('publish');
    $b = body_json();
    $st = (string)($b['status'] ?? '');
    if (!in_array($st, ['published', 'inactive'], true)) fail(400, 'Invalid status', 'status');
    $r = bs_get_row($id);
    if ($st === 'published' && $r['pub'] === null) fail(409, 'Publish this banner first', null, 'never_published');
    q('UPDATE bs_banners SET status=?, updated_at=?, updated_by=? WHERE id=?', [$st, now_ts(), bs_who($a), (int)$id]);
    json_out(['banner' => bs_row_out(bs_get_row($id))]);
}
function h_bs_duplicate($id) {
    $a = require_bs('create');
    $r = bs_get_row($id);
    $b = body_json();
    $name = clean_str($b['name'] ?? '', 120);
    if ($name === '') $name = mb_substr($r['name'] . ' (copy)', 0, 120);
    $t = now_ts();
    q('INSERT INTO bs_banners (name, status, places, data, pub, autosave, autosave_at, start_at, end_at, version, created_at, updated_at, created_by, updated_by, published_at) VALUES (?,?,?,?,NULL,NULL,NULL,?,?,0,?,?,?,?,NULL)',
      [$name, 'draft', $r['places'], $r['data'], $r['start_at'], $r['end_at'], $t, $t, bs_who($a), bs_who($a)]);
    json_out(['banner' => bs_row_out(bs_get_row((int)db()->lastInsertId()), true)], 201);
}
function h_bs_delete($id) {
    require_bs('delete');
    bs_get_row($id);
    q('DELETE FROM bs_versions WHERE banner_id=?', [(int)$id]);
    q('DELETE FROM bs_banners WHERE id=?', [(int)$id]);
    json_out(['ok' => true]);
}
function h_bs_version_get($id, $vid) {
    require_bs();
    $v = db_row('SELECT * FROM bs_versions WHERE id=? AND banner_id=?', [(int)$vid, (int)$id]);
    if (!$v) fail(404, 'Version not found');
    json_out(['version' => ['id' => (int)$v['id'], 'version' => (int)$v['version'], 'name' => $v['name'], 'places' => json_decode((string)$v['places'], true) ?: [],
        'data' => json_decode((string)$v['data'], true), 'note' => $v['note'], 'at' => (int)$v['created_at'] * 1000, 'by' => $v['created_by']]]);
}
/** Copy an old version back into the working copy (not live until published). */
function h_bs_version_restore($id, $vid) {
    $a = require_bs('edit');
    $v = db_row('SELECT * FROM bs_versions WHERE id=? AND banner_id=?', [(int)$vid, (int)$id]);
    if (!$v) fail(404, 'Version not found');
    q('UPDATE bs_banners SET data=?, places=?, autosave=NULL, autosave_at=NULL, updated_at=?, updated_by=? WHERE id=?', [$v['data'], $v['places'], now_ts(), bs_who($a), (int)$id]);
    json_out(['banner' => bs_row_out(bs_get_row($id), true)]);
}

/* ---------------- media library ---------------- */
function bs_dir() {
    $dir = dirname(__DIR__) . '/uploads/bs';
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) fail(500, 'Upload folder is not available');
    if (!is_file($dir . '/.htaccess')) {
        @file_put_contents($dir . '/.htaccess', "# Banner Studio media: never executed.\nOptions -Indexes -ExecCGI\n<IfModule mod_php.c>\nphp_flag engine off\n</IfModule>\n<FilesMatch \"\\.(php|phtml|phar|pl|py|cgi|sh|html?|svg|js)$\">\nRequire all denied\n</FilesMatch>\n<IfModule mod_headers.c>\nHeader set X-Content-Type-Options nosniff\nHeader set Access-Control-Allow-Origin \"*\"\nHeader set Cache-Control \"public, max-age=2592000\"\n</IfModule>\n");
    }
    return $dir;
}
function bs_base_url() {
    $base = trim((string)cfg('base_url', ''));
    if ($base === '') {
        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
        $dirn = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/index.php')), '/');
        $base = ($https ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . $dirn;
    }
    return rtrim($base, '/');
}
/** Sniffs the real type from the file bytes; returns [ext, mime, kindGroup] or null. */
function bs_sniff($path, $name) {
    $h = (string)@file_get_contents($path, false, null, 0, 64);
    if (strncmp($h, 'wOF2', 4) === 0) return ['woff2', 'font/woff2', 'font'];
    if (strncmp($h, 'wOFF', 4) === 0) return ['woff', 'font/woff', 'font'];
    if (strncmp($h, "\x00\x01\x00\x00", 4) === 0 || strncmp($h, 'true', 4) === 0) return ['ttf', 'font/ttf', 'font'];
    if (strncmp($h, 'OTTO', 4) === 0) return ['otf', 'font/otf', 'font'];
    $fi = new finfo(FILEINFO_MIME_TYPE);
    $mime = (string)$fi->file($path);
    $img = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
    if (isset($img[$mime])) {
        if (function_exists('getimagesize') && @getimagesize($path) === false) return null;
        return [$img[$mime], $mime, $mime === 'image/gif' ? 'gif' : 'image'];
    }
    if ($mime === 'video/mp4' || ($mime === 'application/octet-stream' && substr($h, 4, 4) === 'ftyp')) return ['mp4', 'video/mp4', 'video'];
    if ($mime === 'video/webm' || strncmp($h, "\x1A\x45\xDF\xA3", 4) === 0) return ['webm', 'video/webm', 'video'];
    return null;
}
function bs_font_url($file) { return bs_base_url() . '/bs/f/' . preg_replace('/\..*$/', '', $file); }
function bs_asset_out($r) {
    $u = $r['kind'] === 'font' ? bs_font_url($r['file']) : bs_base_url() . '/uploads/bs/' . $r['file'];
    return ['id' => (int)$r['id'], 'kind' => $r['kind'], 'name' => $r['name'], 'url' => $u, 'mime' => $r['mime'], 'size' => (int)$r['size'],
            'w' => $r['w'] === null ? null : (int)$r['w'], 'h' => $r['h'] === null ? null : (int)$r['h'], 'family' => $r['family'], 'tags' => $r['tags'] ?? '',
            'created_at' => (int)$r['created_at'] * 1000, 'by' => $r['created_by']];
}
function h_bs_assets() {
    require_bs();
    $k = (string)($_GET['kind'] ?? '');
    $qs = clean_str($_GET['q'] ?? '', 60);
    $sql = 'SELECT * FROM bs_assets'; $w = []; $p = [];
    if ($k !== '' && in_array($k, BS_KINDS, true)) { $w[] = 'kind=?'; $p[] = $k; }
    if ($qs !== '') { $w[] = '(name LIKE ? OR tags LIKE ?)'; $p[] = '%' . $qs . '%'; $p[] = '%' . $qs . '%'; }
    if ($w) $sql .= ' WHERE ' . implode(' AND ', $w);
    $out = [];
    foreach (db_rows($sql . ' ORDER BY id DESC LIMIT 500', $p) as $r) $out[] = bs_asset_out($r);
    json_out(['assets' => $out]);
}
function h_bs_asset_upload() {
    $a = require_bs('assets');
    if (empty($_FILES['file']) || !is_array($_FILES['file'])) fail(400, 'No file uploaded (field "file")', 'file');
    $f = $_FILES['file'];
    if (is_array($f['error'])) fail(400, 'Single file only', 'file');
    if ($f['error'] === UPLOAD_ERR_INI_SIZE || $f['error'] === UPLOAD_ERR_FORM_SIZE) fail(413, 'File is too large for the server', 'file');
    if ($f['error'] !== UPLOAD_ERR_OK) fail(400, 'Upload failed', 'file');
    if (!is_uploaded_file($f['tmp_name'])) fail(400, 'Invalid upload', 'file');
    $sn = bs_sniff($f['tmp_name'], (string)$f['name']);
    if (!$sn) fail(415, 'Use JPG, PNG, WEBP, GIF, MP4, WEBM or a font file (WOFF2, WOFF, TTF, OTF)', 'file');
    $lim = ['image' => 10, 'gif' => 6, 'video' => 15, 'font' => 4];
    if ($f['size'] > $lim[$sn[2]] * 1048576) fail(413, 'File is too large (max ' . $lim[$sn[2]] . 'MB for this type)', 'file');
    $kind = (string)($_POST['kind'] ?? '');
    if ($sn[2] === 'font') $kind = 'font';
    elseif ($sn[2] === 'video') $kind = 'video';
    elseif ($sn[2] === 'gif' && !in_array($kind, ['background', 'decor', 'icon'], true)) $kind = 'gif';
    elseif (!in_array($kind, ['image', 'logo', 'product', 'icon', 'background', 'decor'], true)) $kind = 'image';
    $name = clean_str($_POST['name'] ?? '', 120);
    if ($name === '') $name = clean_str(preg_replace('/\.[A-Za-z0-9]{2,5}$/', '', (string)$f['name']), 120) ?: 'Asset';
    $family = null;
    if ($kind === 'font') {
        $family = trim(preg_replace('/[^A-Za-z0-9 \-]/', '', (string)($_POST['family'] ?? $name)));
        if ($family === '' || mb_strlen($family) > 60) fail(400, 'Give the font a name (letters, numbers and spaces)', 'family');
    }
    $dir = bs_dir();
    $file = bin2hex(random_bytes(12)) . '.' . $sn[0];
    if (!@move_uploaded_file($f['tmp_name'], $dir . '/' . $file)) fail(500, 'Could not save the file (is uploads/ writable?)');
    @chmod($dir . '/' . $file, 0644);
    $w = null; $hh = null;
    if (in_array($sn[2], ['image', 'gif'], true) && ($gi = @getimagesize($dir . '/' . $file))) { $w = (int)$gi[0]; $hh = (int)$gi[1]; }
    q('INSERT INTO bs_assets (kind, name, file, mime, size, w, h, family, tags, created_at, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [$kind, $name, $file, $sn[1], (int)$f['size'], $w, $hh, $family, clean_str($_POST['tags'] ?? '', 200), now_ts(), bs_who($a)]);
    json_out(['asset' => bs_asset_out(db_row('SELECT * FROM bs_assets WHERE id=?', [(int)db()->lastInsertId()]))], 201);
}
function h_bs_asset_update($id) {
    require_bs('assets');
    $b = body_json();
    $r = db_row('SELECT * FROM bs_assets WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Asset not found');
    $name = array_key_exists('name', $b) ? clean_str($b['name'], 120) : $r['name'];
    if ($name === '') fail(400, 'Name is required', 'name');
    $kind = $r['kind'];
    if (isset($b['kind']) && in_array($b['kind'], ['image', 'logo', 'product', 'icon', 'background', 'decor'], true) && in_array($r['kind'], ['image', 'logo', 'product', 'icon', 'background', 'decor'], true)) $kind = $b['kind'];
    $tags = array_key_exists('tags', $b) ? clean_str($b['tags'], 200) : $r['tags'];
    q('UPDATE bs_assets SET name=?, kind=?, tags=? WHERE id=?', [$name, $kind, $tags, (int)$id]);
    json_out(['asset' => bs_asset_out(db_row('SELECT * FROM bs_assets WHERE id=?', [(int)$id]))]);
}
function h_bs_asset_delete($id) {
    require_bs('assets');
    $r = db_row('SELECT * FROM bs_assets WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Asset not found');
    q('DELETE FROM bs_assets WHERE id=?', [(int)$id]);
    if (preg_match('/^[a-f0-9]{24}\.[a-z0-9]{2,5}$/', $r['file'])) @unlink(bs_dir() . '/' . $r['file']);
    json_out(['ok' => true]);
}
/** Font files go through PHP so they always carry CORS + cache headers (the website loads them from another subdomain). */
function h_bs_font($file) {
    // URLs carry no file extension so every web server (and php -S) routes them here
    if ($file === 'kalpurush') { $p = dirname(__DIR__) . '/assets/fonts/kalpurush.woff2'; $mime = 'font/woff2'; }
    else {
        if (!preg_match('/^[a-f0-9]{24}$/', $file)) fail(404, 'Not found');
        $r = db_row("SELECT * FROM bs_assets WHERE kind='font' AND file LIKE ?", [$file . '.%']);
        if (!$r) fail(404, 'Not found');
        $p = bs_dir() . '/' . $r['file']; $mime = $r['mime'];
    }
    if (!is_file($p)) fail(404, 'Not found');
    header('Content-Type: ' . $mime);
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: public, max-age=31536000, immutable');
    header('X-Content-Type-Options: nosniff');
    header('Content-Length: ' . filesize($p));
    readfile($p);
    exit;
}

/* ---------------- custom templates ---------------- */
function h_bs_templates() {
    require_bs();
    $out = [];
    foreach (db_rows('SELECT * FROM bs_templates ORDER BY id DESC LIMIT 300') as $r)
        $out[] = ['id' => (int)$r['id'], 'name' => $r['name'], 'cat' => $r['cat'], 'data' => json_decode((string)$r['data'], true), 'created_at' => (int)$r['created_at'] * 1000, 'by' => $r['created_by']];
    json_out(['templates' => $out]);
}
function h_bs_template_create() {
    $a = require_bs('templates');
    $b = body_json();
    $name = clean_str($b['name'] ?? '', 120);
    if ($name === '') fail(400, 'Give the template a name', 'name');
    $j = bs_data($b['data'] ?? null);
    q('INSERT INTO bs_templates (name, cat, data, created_at, created_by) VALUES (?,?,?,?,?)', [$name, clean_str($b['cat'] ?? 'Custom', 40) ?: 'Custom', $j, now_ts(), bs_who($a)]);
    json_out(['ok' => true, 'id' => (int)db()->lastInsertId()], 201);
}
function h_bs_template_delete($id) {
    require_bs('templates');
    q('DELETE FROM bs_templates WHERE id=?', [(int)$id]);
    json_out(['ok' => true]);
}

/* ---------------- team (owner only) ---------------- */
function bs_owner() { $a = require_bs(); if ($a['role'] !== 'admin') fail(403, 'Only the main admin can manage the team', null, 'owner_only'); return $a; }
function bs_team_out($r) { return ['id' => (int)$r['id'], 'name' => $r['name'], 'email' => $r['email'], 'role' => $r['role'], 'perms' => bs_admin_perms($r)]; }
function bs_perm_list($v) { return is_array($v) ? array_values(array_intersect(BS_PERMS, $v)) : []; }
function h_bs_team() {
    bs_owner();
    $out = [];
    foreach (db_rows("SELECT * FROM admins ORDER BY id") as $r) $out[] = bs_team_out($r);
    json_out(['team' => $out, 'perms' => BS_PERMS]);
}
function h_bs_team_create() {
    bs_owner();
    $b = body_json();
    $name = clean_str($b['name'] ?? '', 100);
    $email = strtolower(clean_str($b['email'] ?? '', 190));
    $pw = (string)($b['password'] ?? '');
    if ($name === '') fail(400, 'Name is required', 'name');
    if (!valid_email($email)) fail(400, 'Enter a valid email', 'email');
    if (strlen($pw) < 8) fail(400, 'Password must be at least 8 characters', 'password');
    if (db_val('SELECT 1 FROM admins WHERE email=?', [$email])) fail(409, 'This email already has an admin account', 'email');
    q("INSERT INTO admins (email, name, pw_hash, role, perms) VALUES (?,?,?,'banner',?)", [$email, $name, password_hash($pw, PASSWORD_DEFAULT), json_encode(bs_perm_list($b['perms'] ?? []))]);
    json_out(['member' => bs_team_out(db_row('SELECT * FROM admins WHERE id=?', [(int)db()->lastInsertId()]))], 201);
}
function h_bs_team_update($id) {
    bs_owner();
    $b = body_json();
    $r = db_row('SELECT * FROM admins WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Team member not found');
    if ($r['role'] !== 'banner') fail(400, 'The main admin always has every permission', null, 'owner');
    $name = array_key_exists('name', $b) ? clean_str($b['name'], 100) : $r['name'];
    if ($name === '') fail(400, 'Name is required', 'name');
    $perms = array_key_exists('perms', $b) ? json_encode(bs_perm_list($b['perms'])) : $r['perms'];
    q('UPDATE admins SET name=?, perms=? WHERE id=?', [$name, $perms, (int)$id]);
    if (!empty($b['password'])) {
        if (strlen((string)$b['password']) < 8) fail(400, 'Password must be at least 8 characters', 'password');
        q('UPDATE admins SET pw_hash=? WHERE id=?', [password_hash((string)$b['password'], PASSWORD_DEFAULT), (int)$id]);
        q("DELETE FROM sessions WHERE user_id=? AND role='admin'", [(string)$id]);
    }
    json_out(['member' => bs_team_out(db_row('SELECT * FROM admins WHERE id=?', [(int)$id]))]);
}
function h_bs_team_delete($id) {
    bs_owner();
    $r = db_row('SELECT * FROM admins WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Team member not found');
    if ($r['role'] !== 'banner') fail(400, 'The main admin cannot be removed', null, 'owner');
    q('DELETE FROM admins WHERE id=?', [(int)$id]);
    q("DELETE FROM sessions WHERE user_id=? AND role='admin'", [(string)$id]);
    json_out(['ok' => true]);
}

/* ---------------- products for dynamic layers ---------------- */
function h_bs_products() {
    require_bs();
    $c = catalog_build();
    $out = [];
    foreach ($c['products'] as $p) {
        $old = (float)($p['old'] ?? 0); $pr = (float)($p['pr'] ?? 0);
        $out[] = ['id' => (string)$p['id'], 'n' => $p['n'], 'bn' => $p['bn'] ?? '', 'pr' => $pr, 'old' => $old > $pr ? $old : $pr,
                  'img' => $p['img'] ?? '', 'v' => $p['v'] ?? 'both', 'sh' => $p['sh'] ?? '', 'r' => isset($p['r']) ? (float)$p['r'] : null, 'cat' => $p['cat'] ?? ''];
    }
    json_out(['products' => $out]);
}

/* ---------------- public feed ---------------- */
/** Live banners for the website: published, active and inside their schedule. */
function bs_public() {
    $now = now_ts(); $out = []; $fonts = [];
    try {
        $rows = db_rows("SELECT id, places, pub, start_at, end_at FROM bs_banners WHERE status='published' AND pub IS NOT NULL AND (end_at IS NULL OR end_at>?) ORDER BY published_at DESC, id DESC LIMIT 60", [$now]);
    } catch (Throwable $e) { return ['banners' => [], 'fonts' => []]; }
    foreach ($rows as $r) {
        $d = json_decode((string)$r['pub'], true);
        if (!is_array($d)) continue;
        $out[] = ['id' => (int)$r['id'], 'pl' => json_decode((string)$r['places'], true) ?: [], 's' => $r['start_at'] === null ? null : (int)$r['start_at'] * 1000,
                  'e' => $r['end_at'] === null ? null : (int)$r['end_at'] * 1000, 'd' => $d];
    }
    if ($out) foreach (db_rows("SELECT family, file FROM bs_assets WHERE kind='font' ORDER BY id") as $f) $fonts[] = ['f' => $f['family'], 'u' => bs_font_url($f['file'])];
    $fonts[] = ['f' => 'Kalpurush', 'u' => bs_base_url() . '/bs/f/kalpurush'];
    return ['banners' => array_values(array_filter($out, function ($b) use ($now) { return $b['s'] === null || $b['s'] <= ($now + 7 * 86400) * 1000; })), 'fonts' => $fonts, 'now' => $now * 1000];
}
function h_bs_public() { header('Cache-Control: no-cache'); json_out(bs_public()); }
