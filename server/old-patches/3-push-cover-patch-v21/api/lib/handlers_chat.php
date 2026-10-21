<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * Live chat (polling): customer/guest endpoints (/chat/*) and admin
 * endpoints (/admin/chat/*). Text is stored raw; clients escape.
 * ===================================================================== */

const CHAT_MAX_TEXT = 4000;
const CHAT_MAX_CONVS = 50;
const CHAT_MSGS_PER_MIN = 30;
const CHAT_UPLOADS_PER_DAY = 200;
const CHAT_MAX_UPLOAD_MB = 10;
const CHAT_KINDS = ['t', 'img', 'aud', 'ord', 'prd'];
const CHAT_IMG_EXTS = ['jpg', 'png', 'webp', 'gif'];
const CHAT_AUD_EXTS = ['webm', 'ogg', 'mp4', 'm4a', 'mp3', 'wav'];

/* ---------- identity ---------- */
/** Owner key: logged-in user id, else a validated X-Chat-Guest id. */
function chat_owner() {
    $u = optional_user();
    if ($u) return ['cid' => (string)$u['id'], 'user' => $u];
    $g = (string)($_SERVER['HTTP_X_CHAT_GUEST'] ?? '');
    if ($g === '') fail(400, 'Chat guest id required', 'guest', 'guest');
    if (!preg_match('/^g_[a-z0-9]{12,40}$/', $g)) fail(400, 'Invalid chat guest id', 'guest', 'guest');
    return ['cid' => $g, 'user' => null];
}

/* ---------- storage helpers ---------- */
function chat_dir() {
    $dir = seller_public_dir() . '/chat';
    if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) fail(500, 'Upload folder is not available');
    if (!is_file($dir . '/.htaccess')) {
        @file_put_contents($dir . '/.htaccess', "# Chat uploads: media only, never executed.\nOptions -Indexes -ExecCGI\n"
            . "<IfModule mod_php.c>\n    php_flag engine off\n</IfModule>\n<IfModule mod_php7.c>\n    php_flag engine off\n</IfModule>\n<IfModule mod_php8.c>\n    php_flag engine off\n</IfModule>\n"
            . "RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .php8 .phar .pl .py .cgi\nRemoveType .php .phtml .php3 .php4 .php5 .php7 .php8 .phar\n"
            . "<IfModule mod_rewrite.c>\n    RewriteEngine Off\n</IfModule>\n"
            . "<FilesMatch \".*\">\n    <IfModule mod_authz_core.c>\n        Require all denied\n    </IfModule>\n    <IfModule !mod_authz_core.c>\n        Order allow,deny\n        Deny from all\n    </IfModule>\n</FilesMatch>\n"
            . "<FilesMatch \"\\.(jpe?g|png|gif|webp|webm|ogg|mp4|m4a|mp3|wav)$\">\n    <IfModule mod_authz_core.c>\n        Require all granted\n    </IfModule>\n    <IfModule !mod_authz_core.c>\n        Order deny,allow\n        Allow from all\n    </IfModule>\n</FilesMatch>\n"
            . "<IfModule mod_headers.c>\n    Header set X-Content-Type-Options \"nosniff\"\n</IfModule>\n");
    }
    return $dir;
}
function chat_file_re() { return '/^c[0-9a-f]{10}_[0-9a-f]{16}\.(jpg|png|webp|gif|webm|ogg|mp4|m4a|mp3|wav)$/'; }
function chat_url($name) {
    return ($name && preg_match(chat_file_re(), (string)$name)) ? seller_public_base() . 'chat/' . $name : null;
}
function chat_owner_tag($cid) { return 'c' . substr(sha1('chat|' . $cid), 0, 10); }

/** Normalises a client-supplied url (bare name or our absolute URL) to a stored file name of the right kind. */
function chat_clean_url($v, $kind) {
    if (!is_string($v) || $v === '') fail(400, 'File is required for this message', 'url');
    $path = (string)parse_url($v, PHP_URL_PATH);
    $name = basename($path === '' ? $v : $path);
    if (!preg_match(chat_file_re(), $name, $m)) fail(400, 'Invalid file reference', 'url');
    $isImg = in_array($m[1], CHAT_IMG_EXTS, true);
    if (($kind === 'img') !== $isImg) fail(400, 'File type does not match message kind', 'url');
    if (!is_file(chat_dir() . '/' . $name)) fail(400, 'File not found', 'url');
    return $name;
}

/** Detects a media type from magic bytes. Returns [ext, group('img'|'aud')] or null. */
function chat_sniff($path) {
    $fh = @fopen($path, 'rb');
    if (!$fh) return null;
    $h = (string)fread($fh, 16);
    fclose($fh);
    if (strlen($h) < 12) return null;
    if (substr($h, 0, 3) === "\xFF\xD8\xFF") return ['jpg', 'img'];
    if (substr($h, 0, 8) === "\x89PNG\r\n\x1a\n") return ['png', 'img'];
    if (substr($h, 0, 6) === 'GIF87a' || substr($h, 0, 6) === 'GIF89a') return ['gif', 'img'];
    if (substr($h, 0, 4) === 'RIFF' && substr($h, 8, 4) === 'WEBP') return ['webp', 'img'];
    if (substr($h, 0, 4) === 'RIFF' && substr($h, 8, 4) === 'WAVE') return ['wav', 'aud'];
    if (substr($h, 0, 4) === "\x1A\x45\xDF\xA3") return ['webm', 'aud'];
    if (substr($h, 0, 4) === 'OggS') return ['ogg', 'aud'];
    if (substr($h, 4, 4) === 'ftyp') return [substr($h, 8, 4) === 'M4A ' ? 'm4a' : 'mp4', 'aud'];
    if (substr($h, 0, 3) === 'ID3' || (ord($h[0]) === 0xFF && (ord($h[1]) & 0xE0) === 0xE0)) return ['mp3', 'aud'];
    return null;
}

function chat_json_field($v, $maxLen) {
    if ($v === null || $v === '' || $v === []) return null;
    if (is_string($v)) { $d = json_decode($v, true); if (!is_array($d)) return null; $v = $d; }
    if (!is_array($v)) fail(400, 'Invalid JSON field', 'meta');
    $s = json_encode($v, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($s === false || strlen($s) > $maxLen) fail(400, 'Field too large', 'meta');
    return $s;
}
function chat_product_field($v) {
    if ($v === null || $v === '' || $v === []) return null;
    if (!is_array($v)) fail(400, 'Invalid product', 'product');
    $o = [
        'n' => clean_str($v['n'] ?? '', 200), 'img' => clean_str($v['img'] ?? '', 500),
        'id' => clean_str($v['id'] ?? '', 40),
        'price' => is_num($v['price'] ?? null) ? $v['price'] + 0 : clean_str($v['price'] ?? '', 40),
    ];
    return json_encode($o, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

/* ---------- output shapes ---------- */
function chat_conv_out($c, $admin = false) {
    $o = [
        'id' => $c['id'], 'name' => (string)$c['name'], 'mode' => $c['mode'], 'status' => $c['status'],
        'assignee' => $c['assignee'], 'view' => (string)$c['view'],
        'order' => $c['order_id'], 'product' => ($c['product'] !== null && $c['product'] !== '') ? json_decode($c['product'], false) : null,
        'unread_user' => (int)$c['unread_user'], 'last_at' => (int)$c['last_at'] * 1000, 'created_at' => (int)$c['created_at'] * 1000,
    ];
    if ($admin) {
        $o['cid'] = $c['cid']; $o['phone'] = (string)$c['phone']; $o['email'] = (string)$c['email'];
        $o['reg'] = (int)$c['reg']; $o['unread_admin'] = (int)$c['unread_admin'];
    }
    return $o;
}
function chat_msg_out($m) {
    return [
        'id' => (int)$m['id'], 'conv' => $m['conv_id'], 'from' => $m['from_'], 'kind' => $m['kind'],
        'text' => (string)$m['body'], 'url' => chat_url($m['url']), 'dur' => $m['dur'] === null ? null : (int)$m['dur'],
        'meta' => ($m['meta'] !== null && $m['meta'] !== '') ? json_decode($m['meta'], false) : null,
        'an' => $m['an'], 'ts' => (int)$m['created_at'] * 1000,
    ];
}
function chat_get_msg($id) { return chat_msg_out(db_row('SELECT * FROM chat_msgs WHERE id=?', [$id])); }
function chat_own_conv($cid, $id) {
    $c = is_string($id) ? db_row('SELECT * FROM chat_convs WHERE id=? AND cid=?', [$id, $cid]) : null;
    if (!$c) fail(404, 'Conversation not found');
    return $c;
}
function chat_insert_msg($convId, $from, $kind, $body, $url, $dur, $meta, $an) {
    $t = now_ts();
    q('INSERT INTO chat_msgs (conv_id, from_, kind, body, url, dur, meta, an, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
      [$convId, $from, $kind, $body, $url, $dur, $meta, $an, $t]);
    $id = (int)db()->lastInsertId();
    return [$id, $t];
}

/* ---------- customer: send ---------- */
function h_chat_send() {
    $o = chat_owner(); $cid = $o['cid']; $user = $o['user'];
    $b = body_json();
    $kind = (string)($b['kind'] ?? 't');
    if (!in_array($kind, CHAT_KINDS, true)) fail(400, 'Invalid message kind', 'kind');
    $from = (string)($b['from'] ?? 'c');
    if (!in_array($from, ['c', 'b', 's'], true)) fail(400, 'Invalid sender', 'from');
    $text = isset($b['text']) && (is_string($b['text']) || is_numeric($b['text'])) ? trim((string)$b['text']) : '';
    if (mb_strlen($text, 'UTF-8') > CHAT_MAX_TEXT) fail(400, 'Message too long (max ' . CHAT_MAX_TEXT . ' characters)', 'text');
    $url = null; $dur = null;
    if ($kind === 't' && $text === '') fail(400, 'Message text is required', 'text');
    if ($kind === 'img' || $kind === 'aud') {
        $url = chat_clean_url($b['url'] ?? null, $kind);
        if ($kind === 'aud') {
            $d = $b['dur'] ?? 0;
            if (!is_num($d) || $d < 0 || $d > 7200) fail(400, 'Invalid audio duration', 'dur');
            $dur = (int)round((float)$d);
        }
    }
    $meta = chat_json_field($b['meta'] ?? null, 4000);
    $name = clean_str($b['name'] ?? '', 80);
    $phone = clean_str($b['phone'] ?? '', 30);
    $email = clean_str($b['email'] ?? '', 190); if ($email !== '' && !valid_email($email)) $email = '';
    $mode = isset($b['mode']) ? (string)$b['mode'] : '';
    if ($mode !== '' && !in_array($mode, ['bot', 'human'], true)) fail(400, 'Invalid mode', 'mode');
    $view = isset($b['view']) ? (string)$b['view'] : '';
    if (!in_array($view, ['', 'min'], true)) fail(400, 'Invalid view', 'view');
    $order = clean_str($b['order'] ?? '', 40);
    $product = chat_product_field($b['product'] ?? null);
    if ($user) {
        if ($name === '') $name = clean_str($user['name'], 80);
        if ($phone === '') $phone = clean_str($user['mobile'], 30);
        if ($email === '' && !empty($user['email'])) $email = clean_str($user['email'], 190);
    }

    $conv = null;
    if (!empty($b['conv']) && is_string($b['conv'])) $conv = db_row('SELECT * FROM chat_convs WHERE id=? AND cid=?', [$b['conv'], $cid]);
    if ($conv && $conv['status'] === 'resolved') fail(409, 'This conversation is resolved', null, 'resolved');

    // rate limit: everything this owner's client posted in the last minute
    $n = (int)db_val("SELECT COUNT(*) FROM chat_msgs m JOIN chat_convs c ON c.id=m.conv_id WHERE c.cid=? AND m.from_<>'a' AND m.created_at>?", [$cid, now_ts() - 60]);
    if ($n >= CHAT_MSGS_PER_MIN) { header('Retry-After: 30'); fail(429, 'You are sending messages too fast. Please wait a moment.', null, 'rate'); }

    $convId = db_tx(function () use ($conv, $cid, $user, $kind, $from, $text, $url, $dur, $meta, $name, $phone, $email, $mode, $view, $order, $product) {
        $t = now_ts();
        if (!$conv) {
            if ((int)db_val('SELECT COUNT(*) FROM chat_convs WHERE cid=?', [$cid]) >= CHAT_MAX_CONVS) fail(429, 'Too many conversations', null, 'limit');
            $id = 'c' . bin2hex(random_bytes(8));
            q('INSERT INTO chat_convs (id, cid, name, phone, email, reg, mode, status, `view`, order_id, product, unread_admin, unread_user, last_msg_id, last_at, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,0,0,0,?,?)',
              [$id, $cid, $name, $phone, $email, $user ? 1 : 0, $mode === 'human' ? 'human' : 'bot', 'open', $view, $order !== '' ? $order : null, $product, $t, $t]);
        } else {
            $id = $conv['id'];
            $set = []; $par = [];
            foreach (['name' => $name, 'phone' => $phone, 'email' => $email, 'view' => $view] as $k => $v) {
                if ($v !== '') { $set[] = ($k === 'view' ? '`view`' : $k) . '=?'; $par[] = $v; }
            }
            if ($order !== '') { $set[] = 'order_id=?'; $par[] = $order; }
            if ($product !== null) { $set[] = 'product=?'; $par[] = $product; }
            if ($mode === 'human' && $conv['mode'] !== 'human') $set[] = "mode='human'"; // never downgraded by the client
            if ($set) { $par[] = $id; q('UPDATE chat_convs SET ' . implode(',', $set) . ' WHERE id=?', $par); }
        }
        list($mid, $mt) = chat_insert_msg($id, $from, $kind, $text, $url, $dur, $meta, null);
        q('UPDATE chat_convs SET last_msg_id=?, last_at=?' . ($from === 'c' ? ', unread_admin=unread_admin+1' : '') . ' WHERE id=?', [$mid, $mt, $id]);
        return [$id, $mid];
    });
    $c = db_row('SELECT * FROM chat_convs WHERE id=?', [$convId[0]]);
    json_out(['conv' => chat_conv_out($c), 'msg' => chat_get_msg($convId[1])]);
}

/* ---------- customer: sync / read ---------- */
function h_chat_sync() {
    $o = chat_owner(); $cid = $o['cid'];
    $after = isset($_GET['after']) && ctype_digit((string)$_GET['after']) ? (int)$_GET['after'] : 0;
    $only = isset($_GET['conv']) && $_GET['conv'] !== '' ? (string)$_GET['conv'] : null;
    if ($only !== null) chat_own_conv($cid, $only);
    $convs = db_rows('SELECT * FROM chat_convs WHERE cid=? ORDER BY last_at DESC, last_msg_id DESC LIMIT ' . CHAT_MAX_CONVS, [$cid]);
    $sql = 'SELECT m.* FROM chat_msgs m JOIN chat_convs c ON c.id=m.conv_id WHERE c.cid=? AND m.id>?';
    $par = [$cid, $after];
    if ($only !== null) { $sql .= ' AND m.conv_id=?'; $par[] = $only; }
    $rows = db_rows($sql . ' ORDER BY m.id ASC LIMIT 500', $par);
    $last = $after;
    $msgs = [];
    foreach ($rows as $r) { $msgs[] = chat_msg_out($r); $last = max($last, (int)$r['id']); }
    $out = [];
    foreach ($convs as $c) $out[] = chat_conv_out($c);
    json_out(['convs' => $out, 'msgs' => $msgs, 'last' => $last]);
}
function h_chat_read() {
    $o = chat_owner();
    $b = body_json();
    $c = chat_own_conv($o['cid'], $b['conv'] ?? null);
    q('UPDATE chat_convs SET unread_user=0 WHERE id=?', [$c['id']]);
    json_out(['ok' => true]);
}

/* ---------- uploads ---------- */
function chat_handle_upload($ownerTag, $perDayLimit) {
    $kind = (string)($_POST['kind'] ?? '');
    if ($kind !== 'img' && $kind !== 'aud') fail(400, 'Invalid upload type', 'kind');
    $dir = chat_dir();
    if ($perDayLimit) {
        $cut = now_ts() - 86400; $n = 0;
        foreach (glob($dir . '/' . $ownerTag . '_*') ?: [] as $f) { if (@filemtime($f) > $cut) $n++; }
        if ($n >= $perDayLimit) fail(429, 'Daily upload limit reached', null, 'limit');
    }
    $max = CHAT_MAX_UPLOAD_MB;
    if (empty($_FILES['file']) || !is_array($_FILES['file'])) fail(400, 'No file uploaded (field "file")', 'file');
    $f = $_FILES['file'];
    if (is_array($f['error'])) fail(400, 'Single file only', 'file');
    if ($f['error'] === UPLOAD_ERR_INI_SIZE || $f['error'] === UPLOAD_ERR_FORM_SIZE) fail(413, "File too large (max {$max}MB)", 'file');
    if ($f['error'] !== UPLOAD_ERR_OK) fail(400, 'Upload failed', 'file');
    if ($f['size'] > $max * 1024 * 1024) fail(413, "File too large (max {$max}MB)", 'file');
    if (!is_uploaded_file($f['tmp_name'])) fail(400, 'Invalid upload', 'file');
    $sn = chat_sniff($f['tmp_name']);
    if (!$sn || $sn[1] !== $kind) fail(415, $kind === 'img' ? 'Only JPEG, PNG, WebP or GIF images are allowed' : 'Only WebM, OGG, MP4/M4A, MP3 or WAV audio is allowed', 'file');
    if ($kind === 'img' && function_exists('getimagesize') && @getimagesize($f['tmp_name']) === false) fail(415, 'File is not a valid image', 'file');
    $name = $ownerTag . '_' . bin2hex(random_bytes(8)) . '.' . $sn[0];
    if (!@move_uploaded_file($f['tmp_name'], $dir . '/' . $name)) fail(500, 'Could not save file (is uploads/chat writable?)');
    @chmod($dir . '/' . $name, 0644);
    json_out(['url' => chat_url($name), 'kind' => $kind]);
}
function h_chat_upload() {
    $o = chat_owner();
    chat_handle_upload(chat_owner_tag($o['cid']), CHAT_UPLOADS_PER_DAY);
}
function h_admin_chat_upload() {
    require_admin();
    chat_handle_upload(chat_owner_tag('admin'), 0);
}

/* ---------- admin ---------- */
function chat_like($s) { return '%' . str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $s) . '%'; }
function chat_admin_conv($id) {
    $c = db_row('SELECT * FROM chat_convs WHERE id=?', [(string)$id]);
    if (!$c) fail(404, 'Conversation not found');
    return $c;
}
function chat_unread_total() { return (int)db_val("SELECT COALESCE(SUM(unread_admin),0) FROM chat_convs WHERE status='open'"); }

function h_admin_chat_convs() {
    require_admin();
    $status = (string)($_GET['status'] ?? 'open');
    if (!in_array($status, ['open', 'resolved', 'all'], true)) fail(400, 'Invalid status', 'status');
    $w = []; $p = [];
    if ($status !== 'all') { $w[] = 'c.status=?'; $p[] = $status; }
    if (!empty($_GET['unread'])) $w[] = 'c.unread_admin>0';
    $view = (string)($_GET['view'] ?? '');
    if ($view !== '') {
        if ($view !== 'min') fail(400, 'Invalid view', 'view');
        $w[] = 'c.`view`=?'; $p[] = $view;
    }
    $qs = clean_str($_GET['q'] ?? '', 80);
    if ($qs !== '') {
        $l = chat_like($qs);
        $w[] = "(c.name LIKE ? ESCAPE '!' OR c.phone LIKE ? ESCAPE '!' OR c.email LIKE ? ESCAPE '!' OR c.id LIKE ? ESCAPE '!' OR c.order_id LIKE ? ESCAPE '!' OR EXISTS (SELECT 1 FROM chat_msgs x WHERE x.conv_id=c.id AND x.body LIKE ? ESCAPE '!'))";
        array_push($p, $l, $l, $l, $l, $l, $l);
    }
    $rows = db_rows('SELECT c.*, m.from_ AS lf, m.kind AS lk, m.body AS lb, m.created_at AS lt FROM chat_convs c LEFT JOIN chat_msgs m ON m.id=c.last_msg_id'
        . ($w ? ' WHERE ' . implode(' AND ', $w) : '') . ' ORDER BY c.last_at DESC, c.last_msg_id DESC LIMIT 300', $p);
    $out = [];
    foreach ($rows as $r) {
        $o = chat_conv_out($r, true);
        $o['last'] = $r['lf'] === null ? null : ['from' => $r['lf'], 'kind' => $r['lk'], 'text' => mb_substr((string)$r['lb'], 0, 200, 'UTF-8'), 'ts' => (int)$r['lt'] * 1000];
        $out[] = $o;
    }
    json_out(['convs' => $out, 'unread_total' => chat_unread_total()]);
}
function h_admin_chat_conv($id) {
    require_admin();
    $c = chat_admin_conv($id);
    $after = isset($_GET['after']) && ctype_digit((string)$_GET['after']) ? (int)$_GET['after'] : 0;
    if ($after === 0 && (int)$c['unread_admin'] > 0) { q('UPDATE chat_convs SET unread_admin=0 WHERE id=?', [$c['id']]); $c['unread_admin'] = 0; }
    $msgs = [];
    foreach (db_rows('SELECT * FROM chat_msgs WHERE conv_id=? AND id>? ORDER BY id ASC LIMIT 1000', [$c['id'], $after]) as $r) $msgs[] = chat_msg_out($r);
    json_out(['conv' => chat_conv_out($c, true), 'msgs' => $msgs]);
}
function h_admin_chat_send($id) {
    $a = require_admin();
    $c = chat_admin_conv($id);
    $b = body_json();
    $kind = (string)($b['kind'] ?? 't');
    if (!in_array($kind, ['t', 'img', 'aud'], true)) fail(400, 'Invalid message kind', 'kind');
    $text = isset($b['text']) && (is_string($b['text']) || is_numeric($b['text'])) ? trim((string)$b['text']) : '';
    if (mb_strlen($text, 'UTF-8') > CHAT_MAX_TEXT) fail(400, 'Message too long (max ' . CHAT_MAX_TEXT . ' characters)', 'text');
    $url = null; $dur = null;
    if ($kind === 't' && $text === '') fail(400, 'Message text is required', 'text');
    if ($kind !== 't') {
        $url = chat_clean_url($b['url'] ?? null, $kind);
        if ($kind === 'aud') {
            $d = $b['dur'] ?? 0;
            if (!is_num($d) || $d < 0 || $d > 7200) fail(400, 'Invalid audio duration', 'dur');
            $dur = (int)round((float)$d);
        }
    }
    if ($c['status'] === 'resolved') fail(409, 'This conversation is resolved', null, 'resolved');
    $an = clean_str($a['name'], 80);
    $mid = db_tx(function () use ($c, $kind, $text, $url, $dur, $an) {
        list($mid, $mt) = chat_insert_msg($c['id'], 'a', $kind, $text, $url, $dur, null, $an);
        q("UPDATE chat_convs SET mode='human', assignee=?, unread_user=unread_user+1, last_msg_id=?, last_at=? WHERE id=?", [$an, $mid, $mt, $c['id']]);
        return $mid;
    });
    // a signed-in customer hears about the reply (notification centre, browser and phone push)
    if ((int)$c['reg'] === 1 && strpos((string)$c['cid'], 'g_') !== 0) {
        $prev = $kind === 'img' ? 'ছবি' : ($kind === 'aud' ? 'ভয়েস মেসেজ' : mb_substr($text, 0, 140, 'UTF-8'));
        notify('user', (string)$c['cid'], 'NurBuy সাপোর্ট থেকে নতুন বার্তা', $prev, ['url' => '/chat', 'kind' => 'chat', 'dkey' => 'chat:' . $mid]);
    }
    json_out(['msg' => chat_get_msg($mid), 'conv' => chat_conv_out(db_row('SELECT * FROM chat_convs WHERE id=?', [$c['id']]), true)]);
}
function h_admin_chat_status($id) {
    $a = require_admin();
    $c = chat_admin_conv($id);
    $b = body_json();
    $st = (string)($b['status'] ?? '');
    if (!in_array($st, ['resolved', 'open'], true)) fail(400, 'Invalid status', 'status');
    if ($c['status'] !== $st) {
        $an = clean_str($a['name'], 80);
        db_tx(function () use ($c, $st, $an) {
            q('UPDATE chat_convs SET status=? WHERE id=?', [$st, $c['id']]);
            list($mid, $mt) = chat_insert_msg($c['id'], 's', 't', $st === 'resolved' ? 'Conversation resolved' : 'Conversation reopened',
                null, null, json_encode(['sys' => $st], JSON_UNESCAPED_SLASHES), $an);
            q('UPDATE chat_convs SET last_msg_id=?, last_at=? WHERE id=?', [$mid, $mt, $c['id']]);
        });
    }
    json_out(['conv' => chat_conv_out(db_row('SELECT * FROM chat_convs WHERE id=?', [$c['id']]), true)]);
}
function h_admin_chat_unread() {
    require_admin();
    json_out(['unread_total' => chat_unread_total()]);
}
