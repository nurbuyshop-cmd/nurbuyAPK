<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * One image-upload check for every panel (admin, seller, rider, chat).
 *  - at most UPLOAD_MAX_MB (10 MB)
 *  - the real file content decides the type (finfo + image decoder),
 *    never the file name; archives such as ZIP are refused
 *  - large photos are resized and re-saved without hidden metadata
 * ===================================================================== */

const UPLOAD_MAX_MB = 10;
const UPLOAD_IMG_TYPES = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif', 'image/avif' => 'avif'];

function upload_ini_bytes($v) { $v = trim($v); if ($v === '') return PHP_INT_MAX; $n = (float)$v; $u = strtolower(substr($v, -1)); return (int)($u === 'g' ? $n * 1073741824 : ($u === 'm' ? $n * 1048576 : ($u === 'k' ? $n * 1024 : $n))) ?: PHP_INT_MAX; }
/** Call first in an upload handler: an over-size request arrives with no fields at all. */
function upload_guard($maxMb = UPLOAD_MAX_MB) {
    $len = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    if (empty($_FILES) && empty($_POST) && $len > 0 && $len > upload_ini_bytes((string)ini_get('post_max_size'))) fail(413, upload_too_large_msg($maxMb), 'file', 'too_large');
}
function upload_too_large_msg($mb) { return 'The file is larger than ' . $mb . ' MB. Choose a smaller image (max ' . $mb . ' MB).'; }

/**
 * Validates $_FILES[$field]. Returns ['tmp' => path, 'ext' => ..., 'mime' => ..., 'w' => .., 'h' => ..].
 * $extra: more allowed MIME types => extension (e.g. PDF for documents, ICO for favicons).
 */
function upload_take($field = 'file', $extra = [], $maxMb = UPLOAD_MAX_MB, $types = null) {
    if (empty($_FILES[$field]) || !is_array($_FILES[$field])) {
        // a body larger than the server's post_max_size arrives empty: say so clearly
        $len = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
        if ($len > 0 && $len > upload_ini_bytes((string)ini_get('post_max_size'))) fail(413, upload_too_large_msg($maxMb), 'file', 'too_large');
        fail(400, 'No file uploaded (field "' . $field . '")', 'file');
    }
    $f = $_FILES[$field];
    if (is_array($f['error'])) fail(400, 'Single file only', 'file');
    if ($f['error'] === UPLOAD_ERR_INI_SIZE || $f['error'] === UPLOAD_ERR_FORM_SIZE) fail(413, upload_too_large_msg($maxMb), 'file', 'too_large');
    if ($f['error'] === UPLOAD_ERR_NO_FILE) fail(400, 'No file uploaded', 'file');
    if ($f['error'] !== UPLOAD_ERR_OK) fail(400, 'Upload failed. Please try again.', 'file');
    if ((int)$f['size'] <= 0) fail(400, 'The file is empty', 'file');
    if ((int)$f['size'] > $maxMb * 1024 * 1024) fail(413, upload_too_large_msg($maxMb), 'file', 'too_large');
    if (!is_uploaded_file($f['tmp_name'])) fail(400, 'Invalid upload', 'file');
    $tmp = $f['tmp_name'];
    $head = (string)@file_get_contents($tmp, false, null, 0, 8);
    if (strncmp($head, "PK\x03\x04", 4) === 0 || strncmp($head, "PK\x05\x06", 4) === 0 || strncmp($head, "Rar!", 4) === 0 || strncmp($head, "7z\xBC\xAF", 4) === 0)
        fail(415, 'Archives (ZIP, RAR, 7z) are not images. Choose a JPG, PNG or WebP image.', 'file', 'bad_type');
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($tmp);
    $types = $types ?? UPLOAD_IMG_TYPES;
    $all = $types + $extra;
    if (!isset($all[$mime])) {
        $names = strtoupper(implode(', ', array_unique(array_values($all))));
        fail(415, 'This file type is not allowed. Use ' . $names . '.', 'file', 'bad_type');
    }
    $w = null; $h = null;
    if (isset($types[$mime])) {
        $info = function_exists('getimagesize') ? @getimagesize($tmp) : null;
        if ($mime !== 'image/avif' || $info) {
            if (!$info || empty($info[0]) || empty($info[1])) fail(415, 'The file is not a valid image', 'file', 'bad_image');
            if (isset($info['mime']) && $info['mime'] !== $mime && !($mime === 'image/webp' && $info['mime'] === 'image/webp')) fail(415, 'The file is not a valid image', 'file', 'bad_image');
            $w = (int)$info[0]; $h = (int)$info[1];
            if ($w > 12000 || $h > 12000 || $w * $h > 60000000) fail(415, 'The image is too large in pixels (max 12000 x 12000)', 'file', 'bad_image');
        }
    }
    return ['tmp' => $tmp, 'ext' => $all[$mime], 'mime' => $mime, 'w' => $w, 'h' => $h, 'size' => (int)$f['size']];
}

/** Saves an accepted upload to $dest. Photos larger than $maxDim px (or bigger than ~1.5 MB) are resized / re-saved. */
function upload_store($u, $dest, $maxDim = 1800) {
    $done = false;
    if (in_array($u['mime'], ['image/jpeg', 'image/png', 'image/webp'], true) && $u['w'] && function_exists('imagecreatetruecolor')) {
        $big = max($u['w'], $u['h']) > $maxDim || $u['size'] > 1536 * 1024 || $u['mime'] === 'image/jpeg';
        if ($big) $done = upload_reencode($u, $dest, $maxDim);
    }
    if (!$done) {
        $ok = is_uploaded_file($u['tmp']) ? @move_uploaded_file($u['tmp'], $dest) : @copy($u['tmp'], $dest);
        if (!$ok) fail(500, 'Could not save file (is the uploads folder writable?)');
    }
    @chmod($dest, 0644);
    return $dest;
}
function upload_reencode($u, $dest, $maxDim) {
    try {
        $src = null;
        if ($u['mime'] === 'image/jpeg' && function_exists('imagecreatefromjpeg')) $src = @imagecreatefromjpeg($u['tmp']);
        elseif ($u['mime'] === 'image/png' && function_exists('imagecreatefrompng')) $src = @imagecreatefrompng($u['tmp']);
        elseif ($u['mime'] === 'image/webp' && function_exists('imagecreatefromwebp')) $src = @imagecreatefromwebp($u['tmp']);
        if (!$src) return false;
        // phone photos: apply the camera rotation before the metadata is dropped
        if ($u['mime'] === 'image/jpeg' && function_exists('exif_read_data')) {
            $ex = @exif_read_data($u['tmp']);
            $o = is_array($ex) ? (int)($ex['Orientation'] ?? 1) : 1;
            $rot = [3 => 180, 6 => -90, 8 => 90][$o] ?? 0;
            if ($rot) { $r = @imagerotate($src, $rot, 0); if ($r) { imagedestroy($src); $src = $r; } }
        }
        $w = imagesx($src); $h = imagesy($src);
        $k = min(1, $maxDim / max($w, $h));
        $nw = max(1, (int)round($w * $k)); $nh = max(1, (int)round($h * $k));
        $dst = imagecreatetruecolor($nw, $nh);
        if ($u['mime'] !== 'image/jpeg') { imagealphablending($dst, false); imagesavealpha($dst, true); $tr = imagecolorallocatealpha($dst, 0, 0, 0, 127); imagefilledrectangle($dst, 0, 0, $nw, $nh, $tr); }
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
        $ok = false;
        if ($u['mime'] === 'image/jpeg') { imageinterlace($dst, true); $ok = imagejpeg($dst, $dest, 84); }
        elseif ($u['mime'] === 'image/png') $ok = imagepng($dst, $dest, 7);
        elseif ($u['mime'] === 'image/webp' && function_exists('imagewebp')) $ok = imagewebp($dst, $dest, 84);
        imagedestroy($src); imagedestroy($dst);
        if ($ok && is_file($dest) && filesize($dest) > 0) { if (is_uploaded_file($u['tmp'])) @unlink($u['tmp']); return true; }
        @unlink($dest);
    } catch (Throwable $e) { error_log('upload_reencode: ' . $e->getMessage()); }
    return false;
}

/** GET /thumb/{width}/{file}: a small cached copy of an uploaded photo.
 *  Phones ran out of graphics memory (garbled, stacked cards) when every product card loaded a 1800px original; lists now use these.
 *  Only files that already sit in uploads/ and a few fixed widths are served; anything that cannot be resized falls back to the original. */
function h_thumb($w, $name) {
    $w = (int)$w;
    if (!in_array($w, [160, 320, 480, 640, 960], true)) fail(400, 'Invalid size');
    if (!preg_match('/^[A-Za-z0-9_-]{1,80}\.(jpe?g|png|webp)$/i', (string)$name, $m)) fail(404, 'Not found');
    $dir = dirname(__DIR__) . '/uploads';
    $src = $dir . '/' . $name;
    if (!is_file($src)) fail(404, 'Not found');
    $ext = strtolower($m[1]); if ($ext === 'jpeg') $ext = 'jpg';
    $mimes = ['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp'];
    $dst = $dir . '/.thumbs/' . $w . '/' . $name;
    $out = $src;
    if (is_file($dst) && filemtime($dst) >= filemtime($src)) { $out = $dst; }
    else {
        $info = function_exists('getimagesize') ? @getimagesize($src) : null;
        if ($info && $info[0] > $w && function_exists('imagecreatetruecolor') && ($info[0] * $info[1]) <= 40000000) {
            $im = null;
            if ($ext === 'jpg' && function_exists('imagecreatefromjpeg')) $im = @imagecreatefromjpeg($src);
            elseif ($ext === 'png' && function_exists('imagecreatefrompng')) $im = @imagecreatefrompng($src);
            elseif ($ext === 'webp' && function_exists('imagecreatefromwebp')) $im = @imagecreatefromwebp($src);
            if ($im) {
                $nh = max(1, (int)round($info[1] * $w / $info[0]));
                $t = imagecreatetruecolor($w, $nh);
                if ($ext !== 'jpg') { imagealphablending($t, false); imagesavealpha($t, true); imagefill($t, 0, 0, imagecolorallocatealpha($t, 0, 0, 0, 127)); }
                imagecopyresampled($t, $im, 0, 0, 0, 0, $w, $nh, $info[0], $info[1]);
                $td = dirname($dst);
                if (!is_dir($td)) @mkdir($td, 0755, true);
                $tmp = $dst . '.' . getmypid() . '.tmp';
                $ok = false;
                if ($ext === 'jpg') { imageinterlace($t, true); $ok = @imagejpeg($t, $tmp, 80); }
                elseif ($ext === 'png') $ok = @imagepng($t, $tmp, 6);
                elseif (function_exists('imagewebp')) $ok = @imagewebp($t, $tmp, 80);
                if ($ok && filesize($tmp) > 0 && @rename($tmp, $dst)) { @chmod($dst, 0644); $out = $dst; } else @unlink($tmp);
            }
        }
    }
    header('Content-Type: ' . $mimes[$ext]); header('X-Content-Type-Options: nosniff');
    header('Cache-Control: public, max-age=31536000, immutable'); header('Content-Length: ' . filesize($out));
    readfile($out); exit;
}
