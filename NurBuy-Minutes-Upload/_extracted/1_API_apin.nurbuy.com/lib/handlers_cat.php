<?php
if (!defined('NB')) { http_response_code(403); exit; }

/* =====================================================================
 * Category tree (unlimited depth).
 *
 * Table `categories`: id, parent_id (0 = main category), name, bn, slug (unique,
 * used in website URLs), img, icon, sort (display order inside its parent), active.
 * Older sites kept categories inside the admin state (D.cats, two levels). On first
 * use they are copied into the table once; the old copy is left untouched.
 * Products point at the deepest chosen category with seller_products.cat_id; the
 * cat / sub text columns are kept in step for older screens and reports.
 * ===================================================================== */

/** Lower-case ASCII slug. Bengali-only names give '' (the caller adds a fallback). */
function slugify($s) {
    $s = (string)$s;
    if (function_exists('iconv')) { $t = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s); if ($t !== false) $s = $t; }
    $s = strtolower($s);
    $s = preg_replace('/&/', ' and ', $s);
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);
    return trim(substr(trim($s, '-'), 0, 80), '-');
}
function cat_unique_slug($base, $exceptId = 0) {
    $base = $base !== '' ? $base : 'category';
    for ($n = 1; $n < 500; $n++) {
        $try = $n === 1 ? $base : $base . '-' . $n;
        if (!db_val('SELECT 1 FROM categories WHERE slug=? AND id<>?', [$try, (int)$exceptId])) return $try;
    }
    return $base . '-' . bin2hex(random_bytes(3));
}

/** All rows, cached for this request (call cat_flush() after a change). */
function cat_rows($fresh = false) {
    static $rows = null;
    if ($fresh) { $rows = null; return []; }
    if ($rows === null) {
        cat_ensure();
        $rows = [];
        foreach (db_rows('SELECT * FROM categories ORDER BY parent_id, sort, id') as $r) $rows[(int)$r['id']] = $r;
    }
    return $rows;
}
function cat_flush() { cat_rows(true); }

/** Root-first list of rows from the main category down to $id; null when missing or looping. */
function cat_path($id) {
    $rows = cat_rows(); $path = []; $seen = [];
    $id = (int)$id;
    while ($id && isset($rows[$id]) && !isset($seen[$id])) { $seen[$id] = 1; array_unshift($path, $rows[$id]); $id = (int)$rows[$id]['parent_id']; }
    if (!$path || $id !== 0) return null;
    return $path;
}
function cat_path_active($path) { foreach ($path as $r) if (!(int)$r['active']) return false; return true; }
function cat_descendants($id) {
    $kids = [];
    foreach (cat_rows() as $r) $kids[(int)$r['parent_id']][] = (int)$r['id'];
    $out = []; $stack = [(int)$id];
    while ($stack) { $x = array_pop($stack); foreach ($kids[$x] ?? [] as $k) { if (isset($out[$k])) continue; $out[$k] = 1; $stack[] = $k; } }
    return array_keys($out);
}

/** Nested tree. $public: active branches only and the short keys the website uses. */
function cat_tree($public = true, $counts = null) {
    $rows = cat_rows(); $kids = [];
    foreach ($rows as $r) $kids[(int)$r['parent_id']][] = $r;
    $build = function ($pid, $depth) use (&$build, $kids, $public, $counts) {
        $out = [];
        if ($depth > 30) return $out;
        foreach ($kids[$pid] ?? [] as $r) {
            if ($public && !(int)$r['active']) continue;
            $id = (int)$r['id'];
            $o = ['id' => $id, 'n' => $r['name'], 'b' => ($r['bn'] ?? '') !== '' ? $r['bn'] : $r['name'], 'slug' => $r['slug'],
                  'img' => (string)($r['img'] ?? ''), 'icon' => (string)($r['icon'] ?? '')];
            if (!$public) { $o['bn'] = (string)($r['bn'] ?? ''); $o['on'] = (int)$r['active'] === 1; $o['sort'] = (int)$r['sort']; $o['parent_id'] = (int)$r['parent_id']; if ($counts !== null) $o['count'] = $counts[$id] ?? 0; }
            $o['subs'] = $build($id, $depth + 1);
            $out[] = $o;
        }
        return $out;
    };
    return $build(0, 0);
}

/** Copies the categories kept in the admin state into the table (once). */
function cat_ensure() {
    static $done = false;
    if ($done) return;
    $done = true;
    try { cat_import_legacy(); } catch (Throwable $e) { error_log('cat import: ' . $e->getMessage()); }
}
function cat_import_legacy() {
    if (kv_get('cat_imported')) return;
    if ((int)db_val('SELECT COUNT(*) FROM categories') > 0) { kv_set('cat_imported', '1'); return; }
    list($D) = admin_state();
    $cats = (isset($D['cats']) && is_array($D['cats'])) ? $D['cats'] : [];
    if (!$cats) return; // nothing to copy yet (a later admin state may still bring old categories)
    db_tx(function () use ($cats) {
        $t = now_ts(); $map = [];
        $ins = function ($pid, $c, $sort) use (&$ins, $t) {
            if (is_string($c)) $c = ['n' => $c];
            if (!is_array($c)) return 0;
            $n = clean_str($c['n'] ?? '', 120); $b = clean_str($c['b'] ?? '', 120);
            if ($n === '' && $b === '') return 0;
            if ($n === '') $n = $b;
            $slug = cat_unique_slug(slugify($n) ?: 'category');
            $on = (array_key_exists('on', $c) && $c['on'] === false) ? 0 : 1;
            q('INSERT INTO categories (parent_id, name, bn, slug, img, icon, sort, active, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
              [$pid, $n, ($b !== '' && $b !== $n) ? $b : ($b !== '' ? $b : null), $slug, brand_url($c['img'] ?? '') ?: null, null, $sort, $on, $t, $t]);
            $id = (int)db()->lastInsertId();
            foreach (array_values(isset($c['subs']) && is_array($c['subs']) ? $c['subs'] : []) as $i => $x) $ins($id, $x, $i);
            return $id;
        };
        foreach (array_values($cats) as $i => $c) { $id = $ins(0, $c, $i); if ($id) $map[(string)$i] = $id; }
        kv_set('cat_idx_map', json_encode($map));
        // existing seller products: link them to the matching category (main + sub-category by name)
        cat_rows(true);
        $roots = []; $subs = [];
        foreach (db_rows('SELECT id, parent_id, name FROM categories') as $r) {
            if ((int)$r['parent_id'] === 0) $roots[mb_strtolower($r['name'])] = (int)$r['id'];
            else $subs[(int)$r['parent_id'] . '|' . mb_strtolower($r['name'])] = (int)$r['id'];
        }
        foreach (db_rows('SELECT id, cat, sub FROM seller_products WHERE cat_id IS NULL') as $p) {
            $rid = $roots[mb_strtolower(trim((string)$p['cat']))] ?? 0;
            if (!$rid) continue;
            $sid = ($p['sub'] ?? '') !== '' ? ($subs[$rid . '|' . mb_strtolower(trim((string)$p['sub']))] ?? 0) : 0;
            q('UPDATE seller_products SET cat_id=? WHERE id=?', [$sid ?: $rid, (int)$p['id']]);
        }
        kv_set('cat_imported', '1');
    });
    cat_rows(true);
}
/** Main-category id for an admin-panel product (new products keep `cid`, older ones a list index). */
function cat_admin_product_id($p) {
    if (isset($p['cid']) && is_num($p['cid']) && (int)$p['cid'] > 0) return (int)$p['cid'];
    static $map = null;
    if ($map === null) { $m = kv_get('cat_idx_map'); $map = $m ? (json_decode((string)$m['v'], true) ?: []) : []; }
    if (isset($p['c']) && is_scalar($p['c']) && isset($map[(string)$p['c']])) return (int)$map[(string)$p['c']];
    return 0;
}

/** Fields the website gets for a product placed in category $id: names, path ids and slugs. */
function cat_product_fields($id, $fallbackCat = '', $fallbackSub = '') {
    $path = $id ? cat_path($id) : null;
    if (!$path) return ['cat' => (string)$fallbackCat, 'catBn' => '', 'sub' => (string)$fallbackSub, 'cid' => 0, 'cpath' => [], 'cslug' => ''];
    $bn = function ($r) { return ($r['bn'] ?? '') !== '' ? $r['bn'] : $r['name']; };
    return ['cat' => $path[0]['name'], 'catBn' => $bn($path[0]), 'sub' => isset($path[1]) ? $path[1]['name'] : '',
            'cid' => (int)end($path)['id'], 'cpath' => array_map(function ($r) { return (int)$r['id']; }, $path),
            'cnames' => array_map(function ($r) { return $r['name']; }, $path), 'cslug' => implode('/', array_map(function ($r) { return $r['slug']; }, $path))];
}
/** Seller product form: resolve the chosen category (any level). Returns [cat name, sub name|null, id]. */
function cat_resolve_choice($catId, $catName = '', $subName = '') {
    if ($catId !== null && $catId !== '' && $catId !== 0 && $catId !== '0') {
        if (!is_num($catId)) fail(400, 'Choose a valid category', 'cat');
        $path = cat_path((int)$catId);
        if (!$path) fail(400, 'Choose a valid category', 'cat');
        if (!cat_path_active($path)) fail(400, 'This category is switched off. Choose another one.', 'cat');
        return [$path[0]['name'], isset($path[1]) ? $path[1]['name'] : null, (int)end($path)['id']];
    }
    // older form: main category name (+ optional sub-category name)
    $catName = trim((string)$catName); $subName = trim((string)$subName);
    if ($catName === '') fail(400, 'Choose a category', 'cat');
    $rows = cat_rows();
    if (!$rows) return [$catName, $subName !== '' ? $subName : null, null];
    $root = null;
    foreach ($rows as $r) if ((int)$r['parent_id'] === 0 && $r['name'] === $catName && (int)$r['active']) $root = $r;
    if (!$root) fail(400, 'Choose a valid category', 'cat');
    if ($subName === '') return [$root['name'], null, (int)$root['id']];
    foreach ($rows as $r) if ((int)$r['parent_id'] === (int)$root['id'] && $r['name'] === $subName && (int)$r['active']) return [$root['name'], $r['name'], (int)$r['id']];
    fail(400, 'Choose a valid sub-category', 'sub');
}
/** Keeps cat / sub text of linked seller products equal to their category path. */
function cat_sync_products($ids = null) {
    $where = 'cat_id IS NOT NULL'; $par = [];
    if ($ids !== null) { $ids = array_values(array_unique(array_map('intval', $ids))); if (!$ids) return; $where = 'cat_id IN (' . implode(',', array_fill(0, count($ids), '?')) . ')'; $par = $ids; }
    foreach (db_rows("SELECT id, cat_id, cat, sub FROM seller_products WHERE $where", $par) as $p) {
        $path = cat_path((int)$p['cat_id']);
        if (!$path) continue;
        $c = $path[0]['name']; $s = isset($path[1]) ? $path[1]['name'] : null;
        if ($c !== $p['cat'] || $s !== ($p['sub'] ?? null)) q('UPDATE seller_products SET cat=?, sub=? WHERE id=?', [$c, $s, (int)$p['id']]);
    }
}
/** Products per category, counting a product in every category above it too. */
function cat_counts() {
    $direct = [];
    foreach (db_rows("SELECT cat_id, COUNT(*) n FROM seller_products WHERE cat_id IS NOT NULL AND status<>'deleted' GROUP BY cat_id") as $r) $direct[(int)$r['cat_id']] = (int)$r['n'];
    list($D) = admin_state();
    foreach (($D['products'] ?? []) as $p) if (is_array($p)) { $c = cat_admin_product_id($p); if ($c) $direct[$c] = ($direct[$c] ?? 0) + 1; }
    $out = [];
    foreach ($direct as $id => $n) { $path = cat_path($id); if ($path) foreach ($path as $r) $out[(int)$r['id']] = ($out[(int)$r['id']] ?? 0) + $n; }
    return $out;
}

/* ---------- public ---------- */
function h_categories() { header('Cache-Control: no-cache'); json_out(['cats' => cat_tree(true)]); }

/* ---------- admin ---------- */
function h_admin_categories() { require_admin(); json_out(['cats' => cat_tree(false, cat_counts())]); }
function cat_input($b, &$out, $cur = null) {
    if ($cur === null || array_key_exists('name', $b)) {
        $n = clean_str($b['name'] ?? '', 120);
        if ($n === '') fail(400, 'Write the category name', 'name');
        $out['name'] = $n;
    }
    if (array_key_exists('bn', $b)) { $v = clean_str($b['bn'], 120); $out['bn'] = $v === '' ? null : $v; }
    foreach (['img', 'icon'] as $k) if (array_key_exists($k, $b)) {
        $v = is_string($b[$k]) ? trim($b[$k]) : '';
        if ($v !== '' && !brand_url($v)) fail(400, 'Use an image link that starts with http:// or https://', $k);
        $out[$k] = $v === '' ? null : $v;
    }
    if (array_key_exists('active', $b)) $out['active'] = ($b['active'] === true || $b['active'] === 1 || $b['active'] === '1') ? 1 : 0;
    if (array_key_exists('slug', $b) && is_string($b['slug']) && trim($b['slug']) !== '') {
        $s = slugify($b['slug']); if ($s === '') fail(400, 'Use English letters or numbers in the link name', 'slug');
        $out['slug'] = $s;
    }
}
function h_admin_category_create() {
    require_admin();
    cat_ensure();
    $b = body_json();
    cat_input($b, $in);
    $pid = (int)($b['parent_id'] ?? 0);
    if ($pid && !cat_path($pid)) fail(404, 'Parent category not found', 'parent_id');
    if (db_val('SELECT 1 FROM categories WHERE parent_id=? AND LOWER(name)=LOWER(?)', [$pid, $in['name']])) fail(409, 'A category with this name already exists here', 'name');
    $slug = cat_unique_slug($in['slug'] ?? (slugify($in['name']) ?: (slugify($in['bn'] ?? '') ?: 'category')));
    $sort = (int)db_val('SELECT COALESCE(MAX(sort),-1)+1 FROM categories WHERE parent_id=?', [$pid]);
    $t = now_ts();
    q('INSERT INTO categories (parent_id, name, bn, slug, img, icon, sort, active, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [$pid, $in['name'], $in['bn'] ?? null, $slug, $in['img'] ?? null, $in['icon'] ?? null, $sort, $in['active'] ?? 1, $t, $t]);
    $id = (int)db()->lastInsertId();
    cat_flush();
    json_out(['cat' => cat_row_out(db_row('SELECT * FROM categories WHERE id=?', [$id])), 'cats' => cat_tree(false, cat_counts())], 201);
}
function cat_row_out($r) {
    return ['id' => (int)$r['id'], 'parent_id' => (int)$r['parent_id'], 'name' => $r['name'], 'bn' => (string)($r['bn'] ?? ''), 'slug' => $r['slug'],
            'img' => (string)($r['img'] ?? ''), 'icon' => (string)($r['icon'] ?? ''), 'sort' => (int)$r['sort'], 'active' => (int)$r['active'] === 1];
}
function h_admin_category_update($id) {
    require_admin();
    cat_ensure();
    $r = db_row('SELECT * FROM categories WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Category not found');
    $b = body_json();
    cat_input($b, $in, $r);
    $set = []; $par = [];
    if (array_key_exists('parent_id', $b)) {
        $pid = (int)$b['parent_id'];
        if ($pid === (int)$id || in_array($pid, cat_descendants((int)$id), true)) fail(400, 'A category cannot be moved inside itself', 'parent_id');
        if ($pid && !cat_path($pid)) fail(404, 'Parent category not found', 'parent_id');
        if ($pid !== (int)$r['parent_id']) { $set[] = 'parent_id=?'; $par[] = $pid; $set[] = 'sort=?'; $par[] = (int)db_val('SELECT COALESCE(MAX(sort),-1)+1 FROM categories WHERE parent_id=?', [$pid]); }
        $r['parent_id'] = $pid;
    }
    if (isset($in['name']) && db_val('SELECT 1 FROM categories WHERE parent_id=? AND id<>? AND LOWER(name)=LOWER(?)', [(int)$r['parent_id'], (int)$id, $in['name']])) fail(409, 'A category with this name already exists here', 'name');
    if (isset($in['slug'])) $in['slug'] = cat_unique_slug($in['slug'], (int)$id);
    foreach (['name', 'bn', 'img', 'icon', 'active', 'slug'] as $k) if (array_key_exists($k, $in)) { $set[] = "$k=?"; $par[] = $in[$k]; }
    if ($set) { $set[] = 'updated_at=?'; $par[] = now_ts(); $par[] = (int)$id; q('UPDATE categories SET ' . implode(',', $set) . ' WHERE id=?', $par); }
    cat_flush();
    if (isset($in['name']) || array_key_exists('parent_id', $b)) cat_sync_products(array_merge([(int)$id], cat_descendants((int)$id)));
    json_out(['cat' => cat_row_out(db_row('SELECT * FROM categories WHERE id=?', [(int)$id])), 'cats' => cat_tree(false, cat_counts())]);
}
function h_admin_category_delete($id) {
    require_admin();
    cat_ensure();
    $r = db_row('SELECT * FROM categories WHERE id=?', [(int)$id]);
    if (!$r) fail(404, 'Category not found');
    if (db_val('SELECT 1 FROM categories WHERE parent_id=? LIMIT 1', [(int)$id])) fail(409, 'Delete or move its sub-categories first', null, 'has_children');
    $n = (int)db_val("SELECT COUNT(*) FROM seller_products WHERE cat_id=?", [(int)$id]);
    $c = cat_counts();
    if ($n > 0 || ($c[(int)$id] ?? 0) > 0) fail(409, 'Products use this category. Move them to another category first, or switch the category off.', null, 'has_products');
    q('DELETE FROM categories WHERE id=?', [(int)$id]);
    cat_flush();
    json_out(['ok' => true, 'cats' => cat_tree(false, cat_counts())]);
}
function h_admin_category_reorder() {
    require_admin();
    cat_ensure();
    $b = body_json();
    $pid = (int)($b['parent_id'] ?? 0);
    $ids = $b['ids'] ?? null;
    if (!is_array($ids) || !$ids) fail(400, 'ids are required', 'ids');
    $have = array_map('intval', array_column(db_rows('SELECT id FROM categories WHERE parent_id=?', [$pid]), 'id'));
    $ids = array_values(array_unique(array_map('intval', $ids)));
    sort($have); $chk = $ids; sort($chk);
    if ($have !== $chk) fail(400, 'Send every category of this level once', 'ids');
    db_tx(function () use ($ids) { $t = now_ts(); foreach ($ids as $i => $x) q('UPDATE categories SET sort=?, updated_at=? WHERE id=?', [$i, $t, $x]); });
    cat_flush();
    json_out(['ok' => true, 'cats' => cat_tree(false, cat_counts())]);
}
