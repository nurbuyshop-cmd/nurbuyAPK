<?php
if (!defined('NB')) { http_response_code(403); exit; }

function db_driver() { $c = cfg('db', []); return ($c['driver'] ?? 'mysql') === 'sqlite' ? 'sqlite' : 'mysql'; }

function db() {
    static $pdo = null;
    if ($pdo) return $pdo;
    $c = cfg('db', []);
    $opt = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC];
    if (db_driver() === 'sqlite') {
        $pdo = new PDO('sqlite:' . ($c['path'] ?? (dirname(__DIR__) . '/nurbuy.sqlite')), null, null, $opt);
        $pdo->exec('PRAGMA busy_timeout=8000');
    } else {
        $dsn = 'mysql:host=' . ($c['host'] ?? 'localhost') . ';dbname=' . ($c['name'] ?? '') . ';charset=utf8mb4';
        if (!empty($c['port'])) $dsn .= ';port=' . (int)$c['port'];
        $pdo = new PDO($dsn, $c['user'] ?? '', $c['pass'] ?? '', $opt);
        $pdo->exec("SET time_zone='+00:00'");
    }
    return $pdo;
}
function q($sql, $params = []) { $st = db()->prepare($sql); $st->execute(array_values($params)); return $st; }
function db_row($sql, $params = []) { $r = q($sql, $params)->fetch(); return $r === false ? null : $r; }
function db_rows($sql, $params = []) { return q($sql, $params)->fetchAll(); }
function db_val($sql, $params = []) { $r = q($sql, $params)->fetch(PDO::FETCH_NUM); return $r === false ? null : $r[0]; }
function lock_suffix() { return db_driver() === 'mysql' ? ' FOR UPDATE' : ''; }

function db_tx($fn) {
    $pdo = db();
    if ($pdo->inTransaction()) return $fn();
    $pdo->beginTransaction();
    try { $r = $fn(); $pdo->commit(); return $r; }
    catch (Throwable $e) { if ($pdo->inTransaction()) $pdo->rollBack(); throw $e; }
}

function is_unique_violation($e) {
    if (!($e instanceof PDOException)) return false;
    $m = $e->getMessage();
    $ei = $e->errorInfo ?? [];
    return (isset($ei[1]) && (int)$ei[1] === 1062) || stripos($m, 'UNIQUE constraint failed') !== false || stripos($m, 'Duplicate entry') !== false;
}
function unique_field($e, $default = null) {
    if (preg_match("/(?:for key '|failed: )(?:\\w+\\.)?(\\w+)/i", $e->getMessage(), $m)) {
        if (in_array($m[1], ['email', 'mobile'], true)) return $m[1];
    }
    return $default;
}

function kv_get($k) { return db_row('SELECT v, updated_at FROM kv WHERE k=?', [$k]); }
function kv_set($k, $v) {
    $t = now_ts();
    try { q('INSERT INTO kv (k, v, updated_at) VALUES (?,?,?)', [$k, $v, $t]); }
    catch (PDOException $e) {
        if (!is_unique_violation($e)) throw $e;
        q('UPDATE kv SET v=?, updated_at=? WHERE k=?', [$v, $t, $k]);
    }
    return $t;
}

/* ---------- wallet primitives (call inside db_tx) ---------- */
function wallet_bal($uid) { return money(db_val('SELECT wallet FROM users WHERE id=?', [$uid])); }
function wallet_credit($uid, $amt) { q('UPDATE users SET wallet=ROUND(wallet+?,2) WHERE id=?', [money($amt), $uid]); }
/** Atomic debit; returns false when funds are insufficient. */
function wallet_debit($uid, $amt) {
    $amt = money($amt);
    return q('UPDATE users SET wallet=ROUND(wallet-?,2) WHERE id=? AND wallet>=?', [$amt, $uid, $amt])->rowCount() === 1;
}
/** Debit up to the available balance (never negative); returns amount actually removed. */
function wallet_debit_clamped($uid, $amt) {
    $bal = wallet_bal($uid);
    $take = min(money($amt), $bal);
    if ($take > 0 && !wallet_debit($uid, $take)) return 0.0;
    return $take;
}
function wallet_log($uid, $t, $amt, $oid = null, $pct = null, $note = null) {
    q('INSERT INTO wallet_tx (user_id, t, amount, order_id, pct, note, created_at) VALUES (?,?,?,?,?,?,?)',
      [$uid, $t, money($amt), $oid, $pct, $note, now_ts()]);
}

/** Brings an already-installed database up to the current schema (idempotent, runs once per version). */
const SCHEMA_VERSION = '21';
function ensure_schema() {
    try {
        cfg('db', []);
        $row = kv_get('schema_ver');
        if ($row && $row['v'] === SCHEMA_VERSION) return;
        if (!kv_get('installed')) return; // fresh site: the setup wizard creates everything
        require_once __DIR__ . '/schema.php';
        foreach (schema_statements(db_driver()) as $sql) { try { q($sql); } catch (Throwable $e) { error_log('NurBuy schema: ' . $e->getMessage()); } }
        // columns added after the first release (CREATE IF NOT EXISTS does not add them to old tables)
        foreach ([['seller_products', 'specs', 'TEXT NULL'], ['seller_products', 'sub', 'VARCHAR(120) NULL'], ['seller_products', 'vr', 'TEXT NULL'],
                  ['sellers', 'cover', 'VARCHAR(80) NULL'], ['sellers', 'com_pct', 'DECIMAL(6,2) NULL'], ['sellers', 'payout', 'TEXT NULL'],
                  ['orders', 'disc', 'DECIMAL(12,2) NOT NULL DEFAULT 0'], ['orders', 'coupon', 'VARCHAR(40) NULL'], ['admins', 'perms', 'TEXT NULL'],
                  ['seller_products', 'com_pct', 'DECIMAL(6,2) NULL'], ['orders', 'delivered_at', 'INT NULL'],
                  ['seller_products', 'stock_on', 'INT NOT NULL DEFAULT 1'], ['seller_products', 'max_q', 'INT NOT NULL DEFAULT 0'], ['seller_products', 'about_bn', 'TEXT NULL'],
                  ['sellers', 'hours', 'TEXT NULL'], ['sellers', 'coverage', 'TEXT NULL'], ['sellers', 'lat', 'DECIMAL(10,7) NULL'], ['sellers', 'lng', 'DECIMAL(10,7) NULL'], ['sellers', 'photo', 'VARCHAR(80) NULL'],
                  // v11: category tree, village delivery time + rider pay, notification links, seller ad credit
                  ['seller_products', 'cat_id', 'INT NULL'], ['seller_products', 'pcode', 'VARCHAR(40) NULL'], ['seller_products', 'tags', 'TEXT NULL'], ['loc_min', 'eta', 'INT NULL'], ['loc_min', 'rider_pay', 'DECIMAL(12,2) NULL'],
                  ['rider_notif', 'url', 'VARCHAR(500) NULL'], ['rider_notif', 'img', 'VARCHAR(500) NULL'], ['rider_notif', 'kind', 'VARCHAR(20) NULL'], ['rider_notif', 'dkey', 'VARCHAR(120) NULL'],
                  ['seller_notif', 'url', 'VARCHAR(500) NULL'], ['seller_notif', 'img', 'VARCHAR(500) NULL'], ['seller_notif', 'kind', 'VARCHAR(20) NULL'], ['seller_notif', 'dkey', 'VARCHAR(120) NULL'],
                  ['sellers', 'ad_promo_used', 'DECIMAL(12,2) NOT NULL DEFAULT 0'], ['sellers', 'ad_debt', 'DECIMAL(12,2) NOT NULL DEFAULT 0'], ['sellers', 'ad_limit', 'DECIMAL(12,2) NULL'],
                  // v16: visitor activity (IP only with consent), order IP for fraud checks
                  ['an_events', 'ip', 'VARCHAR(45) NULL'], ['an_events', 'pg', 'VARCHAR(60) NULL'], ['an_events', 'cat', 'VARCHAR(80) NULL'], ['an_events', 'pn', 'VARCHAR(120) NULL'],
                  ['an_visitors', 'ip', 'VARCHAR(45) NULL'], ['an_visitors', 'pers', 'INT NOT NULL DEFAULT 0'], ['orders', 'ip', 'VARCHAR(45) NULL'],
                  // v19: the district / thana / village a delivery zone belongs to (auto-fills the customer's address)
                  ['delivery_zones', 'district', 'VARCHAR(190) NULL'], ['delivery_zones', 'thana', 'VARCHAR(190) NULL'], ['delivery_zones', 'village', 'VARCHAR(190) NULL']] as $m) {
            try { q('ALTER TABLE ' . $m[0] . ' ADD COLUMN ' . $m[1] . ' ' . $m[2]); } catch (Throwable $e) { /* already there */ }
        }
        foreach (['CREATE INDEX idx_ane_ip ON an_events (ip, created_at)', 'CREATE INDEX idx_ane_v ON an_events (vid, id)', 'CREATE INDEX idx_ane_u ON an_events (uid, id)', 'CREATE INDEX idx_ord_ip ON orders (ip)'] as $ix) {
            try { q($ix); } catch (Throwable $e) { /* already there */ }
        }
        // seller wallet: create earning rows for orders placed before the wallet existed
        if (function_exists('seller_earn_backfill')) seller_earn_backfill();
        // revenue: delivery date for orders delivered before delivered_at existed
        try { q("UPDATE orders SET delivered_at=updated_at WHERE status='Delivered' AND delivered_at IS NULL"); } catch (Throwable $e) { /* ignore */ }
        // v11: categories move from the admin state into their own table (old data stays where it was)
        if (function_exists('cat_import_legacy')) cat_import_legacy();
        try { q("DELETE FROM kv WHERE k='loc_pub_min'"); } catch (Throwable $e) { /* ignore */ }
        kv_set('schema_ver', SCHEMA_VERSION);
    } catch (Throwable $e) {
        error_log('NurBuy ensure_schema: ' . $e->getMessage());
    }
}
