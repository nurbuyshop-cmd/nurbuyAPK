<?php
if (!defined('NB')) { http_response_code(403); exit; }

/** Returns CREATE TABLE / INDEX statements for the given driver ('mysql'|'sqlite'). Idempotent. */
function schema_statements($driver) {
    if ($driver === 'sqlite') {
        $a = [
"CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NULL UNIQUE, mobile TEXT NOT NULL UNIQUE, pw_hash TEXT NULL, auto INTEGER NOT NULL DEFAULT 0, mvf INTEGER NOT NULL DEFAULT 0, wallet DECIMAL(12,2) NOT NULL DEFAULT 0, profile TEXT NULL, blocked INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL)",
"CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL, role TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL)",
"CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions (user_id)",
"CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, pw_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', perms TEXT NULL)",
"CREATE TABLE IF NOT EXISTS wallet_tx (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, t TEXT NOT NULL, amount DECIMAL(12,2) NOT NULL, order_id TEXT NULL, pct DECIMAL(6,2) NULL, note TEXT NULL, created_at INTEGER NOT NULL)",
"CREATE INDEX IF NOT EXISTS idx_wtx_user ON wallet_tx (user_id, id)",
"CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id TEXT NULL, `view` TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Pending', sub DECIMAL(12,2) NOT NULL DEFAULT 0, fee DECIMAL(12,2) NOT NULL DEFAULT 0, cod DECIMAL(12,2) NOT NULL DEFAULT 0, total DECIMAL(12,2) NOT NULL DEFAULT 0, pay TEXT NOT NULL, shop TEXT NULL, veh TEXT NULL, name TEXT NOT NULL, mobile TEXT NOT NULL, email TEXT NULL, address TEXT NOT NULL, items TEXT NOT NULL, extra TEXT NULL, trk TEXT NULL, cashback DECIMAL(12,2) NOT NULL DEFAULT 0, paid_wallet DECIMAL(12,2) NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, disc DECIMAL(12,2) NOT NULL DEFAULT 0, coupon TEXT NULL, delivered_at INTEGER NULL, ip TEXT NULL)",
"CREATE INDEX IF NOT EXISTS idx_orders_user ON orders (user_id, created_at)",
"CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at)",
"CREATE INDEX IF NOT EXISTS idx_orders_trk ON orders (trk)",
"CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NULL, updated_at INTEGER NOT NULL DEFAULT 0)",
"CREATE TABLE IF NOT EXISTS login_fails (ip TEXT NOT NULL, ts INTEGER NOT NULL)",
"CREATE INDEX IF NOT EXISTS idx_lf ON login_fails (ip, ts)",
"CREATE TABLE IF NOT EXISTS riders (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, mobile TEXT NOT NULL UNIQUE, email TEXT NULL UNIQUE, pw_hash TEXT NOT NULL, address TEXT NULL, nid TEXT NULL, vehicle_type TEXT NULL, vehicle_no TEXT NULL, license_no TEXT NULL, emerg_name TEXT NULL, emerg_mobile TEXT NULL, photo TEXT NULL, docs TEXT NULL, status TEXT NOT NULL DEFAULT 'pending', reject_reason TEXT NULL, online INTEGER NOT NULL DEFAULT 0, chg TEXT NULL, created_at INTEGER NOT NULL, approved_at INTEGER NULL, last_seen INTEGER NULL)",
"CREATE TABLE IF NOT EXISTS deliveries (order_id TEXT PRIMARY KEY, rider_id INTEGER NOT NULL, rstat TEXT NOT NULL, otp TEXT NOT NULL, fail_reason TEXT NULL, assigned_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)",
"CREATE INDEX IF NOT EXISTS idx_dl_rider ON deliveries (rider_id, rstat)",
"CREATE TABLE IF NOT EXISTS rider_notif (id INTEGER PRIMARY KEY AUTOINCREMENT, rider_id INTEGER NOT NULL, title TEXT NOT NULL, body TEXT NULL, is_read INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, url TEXT NULL, img TEXT NULL, kind TEXT NULL, dkey TEXT NULL)",
"CREATE INDEX IF NOT EXISTS idx_rn_rider ON rider_notif (rider_id, id)",
"CREATE TABLE IF NOT EXISTS sellers (id INTEGER PRIMARY KEY AUTOINCREMENT, shop_name TEXT NOT NULL UNIQUE, owner_name TEXT NOT NULL, mobile TEXT NOT NULL UNIQUE, email TEXT NULL UNIQUE, pw_hash TEXT NOT NULL, address TEXT NULL, nid TEXT NULL, trade_no TEXT NULL, sell_view TEXT NOT NULL DEFAULT 'both', category TEXT NULL, about TEXT NULL, logo TEXT NULL, docs TEXT NULL, status TEXT NOT NULL DEFAULT 'pending', reject_reason TEXT NULL, chg TEXT NULL, created_at INTEGER NOT NULL, approved_at INTEGER NULL, last_seen INTEGER NULL, cover TEXT NULL, com_pct DECIMAL(6,2) NULL, payout TEXT NULL, hours TEXT NULL, coverage TEXT NULL, lat DECIMAL(10,7) NULL, lng DECIMAL(10,7) NULL, photo TEXT NULL, ad_promo_used DECIMAL(12,2) NOT NULL DEFAULT 0, ad_debt DECIMAL(12,2) NOT NULL DEFAULT 0, ad_limit DECIMAL(12,2) NULL)",
"CREATE TABLE IF NOT EXISTS seller_products (id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER NOT NULL, name TEXT NOT NULL, bn TEXT NULL, price DECIMAL(12,2) NOT NULL DEFAULT 0, old DECIMAL(12,2) NOT NULL DEFAULT 0, stock INTEGER NOT NULL DEFAULT 0, cat TEXT NULL, v TEXT NOT NULL DEFAULT 'both', about TEXT NULL, specs TEXT NULL, sub TEXT NULL, imgs TEXT NULL, status TEXT NOT NULL DEFAULT 'pending', hidden INTEGER NOT NULL DEFAULT 0, reject_reason TEXT NULL, chg TEXT NULL, vr TEXT NULL, sold INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, com_pct DECIMAL(6,2) NULL, stock_on INTEGER NOT NULL DEFAULT 1, max_q INTEGER NOT NULL DEFAULT 0, about_bn TEXT NULL, pcode VARCHAR(40) NULL, tags TEXT NULL, cat_id INTEGER NULL)",
"CREATE INDEX IF NOT EXISTS idx_sp_seller ON seller_products (seller_id, status)",
"CREATE INDEX IF NOT EXISTS idx_sp_status ON seller_products (status)",
"CREATE TABLE IF NOT EXISTS order_live (order_id TEXT NOT NULL PRIMARY KEY, lat DECIMAL(10,7) NOT NULL, lng DECIMAL(10,7) NOT NULL, acc INTEGER NULL, started_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)",
"CREATE TABLE IF NOT EXISTS seller_orders (order_id TEXT NOT NULL, seller_id INTEGER NOT NULL, sstat TEXT NOT NULL, note TEXT NULL, updated_at INTEGER NOT NULL, PRIMARY KEY (order_id, seller_id))",
"CREATE TABLE IF NOT EXISTS seller_notif (id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER NOT NULL, title TEXT NOT NULL, body TEXT NULL, is_read INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, url TEXT NULL, img TEXT NULL, kind TEXT NULL, dkey TEXT NULL)",
"CREATE INDEX IF NOT EXISTS idx_sn_seller ON seller_notif (seller_id, id)",
"CREATE TABLE IF NOT EXISTS chat_convs (id TEXT PRIMARY KEY, cid TEXT NOT NULL, name TEXT NULL, phone TEXT NULL, email TEXT NULL, reg INTEGER NOT NULL DEFAULT 0, mode TEXT NOT NULL DEFAULT 'bot', status TEXT NOT NULL DEFAULT 'open', assignee TEXT NULL, `view` TEXT NULL, order_id TEXT NULL, product TEXT NULL, unread_admin INTEGER NOT NULL DEFAULT 0, unread_user INTEGER NOT NULL DEFAULT 0, last_msg_id INTEGER NOT NULL DEFAULT 0, last_at INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL)",
"CREATE INDEX IF NOT EXISTS idx_cc_cid ON chat_convs (cid, last_at)",
"CREATE INDEX IF NOT EXISTS idx_cc_status ON chat_convs (status, last_at)",
"CREATE TABLE IF NOT EXISTS chat_msgs (id INTEGER PRIMARY KEY AUTOINCREMENT, conv_id TEXT NOT NULL, from_ TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 't', body TEXT NULL, url VARCHAR(255) NULL, dur INTEGER NULL, meta TEXT NULL, an VARCHAR(80) NULL, created_at INTEGER NOT NULL)",
"CREATE INDEX IF NOT EXISTS idx_cm_conv ON chat_msgs (conv_id, id)",
"CREATE TABLE IF NOT EXISTS seller_earnings (id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER NOT NULL, order_id TEXT NOT NULL, line INTEGER NOT NULL, product_id INTEGER NULL, pname TEXT NOT NULL, variant TEXT NULL, qty INTEGER NOT NULL DEFAULT 1, unit DECIMAL(12,2) NOT NULL DEFAULT 0, sale DECIMAL(12,2) NOT NULL DEFAULT 0, disc DECIMAL(12,2) NOT NULL DEFAULT 0, com_pct DECIMAL(6,2) NOT NULL DEFAULT 0, commission DECIMAL(12,2) NOT NULL DEFAULT 0, net DECIMAL(12,2) NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'pending', order_at INTEGER NOT NULL, cleared_at INTEGER NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, UNIQUE (order_id, line))",
"CREATE INDEX IF NOT EXISTS idx_se_seller ON seller_earnings (seller_id, status)",
"CREATE TABLE IF NOT EXISTS seller_withdrawals (id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER NOT NULL, amount DECIMAL(12,2) NOT NULL, method TEXT NOT NULL, details TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', reason TEXT NULL, admin_note TEXT NULL, pay_ref TEXT NULL, admin_name TEXT NULL, paid_at INTEGER NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)",
"CREATE INDEX IF NOT EXISTS idx_sw_seller ON seller_withdrawals (seller_id, id)",
"CREATE INDEX IF NOT EXISTS idx_sw_status ON seller_withdrawals (status, id)",
"CREATE TABLE IF NOT EXISTS seller_wtx (id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER NOT NULL, kind TEXT NOT NULL, amount DECIMAL(12,2) NOT NULL, effect INTEGER NOT NULL DEFAULT 0, bal_after DECIMAL(12,2) NOT NULL DEFAULT 0, ref TEXT NULL, note TEXT NULL, created_at INTEGER NOT NULL)",
"CREATE INDEX IF NOT EXISTS idx_swt_seller ON seller_wtx (seller_id, id)",
"CREATE TABLE IF NOT EXISTS seller_coupons (id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id INTEGER NOT NULL, product_id INTEGER NOT NULL, code TEXT NOT NULL UNIQUE, type TEXT NOT NULL, value DECIMAL(12,2) NOT NULL, min_buy DECIMAL(12,2) NOT NULL DEFAULT 0, starts_at INTEGER NULL, ends_at INTEGER NULL, max_uses INTEGER NOT NULL DEFAULT 0, per_user INTEGER NOT NULL DEFAULT 0, used INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'active', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)",
"CREATE INDEX IF NOT EXISTS idx_scp_seller ON seller_coupons (seller_id)",
"CREATE INDEX IF NOT EXISTS idx_scp_product ON seller_coupons (product_id)",
"CREATE TABLE IF NOT EXISTS coupon_uses (id INTEGER PRIMARY KEY AUTOINCREMENT, coupon_id INTEGER NOT NULL, user_id TEXT NOT NULL, order_id TEXT NOT NULL, amount DECIMAL(12,2) NOT NULL DEFAULT 0, released INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL)",
"CREATE INDEX IF NOT EXISTS idx_cu_coupon ON coupon_uses (coupon_id, user_id)",
"CREATE INDEX IF NOT EXISTS idx_cu_order ON coupon_uses (order_id)",
"CREATE TABLE IF NOT EXISTS bs_banners (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', places TEXT NOT NULL, data TEXT NOT NULL, pub TEXT NULL, autosave TEXT NULL, autosave_at INTEGER NULL, start_at INTEGER NULL, end_at INTEGER NULL, version INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, created_by TEXT NULL, updated_by TEXT NULL, published_at INTEGER NULL)",
"CREATE INDEX IF NOT EXISTS idx_bsb_status ON bs_banners (status, end_at)",
"CREATE TABLE IF NOT EXISTS bs_versions (id INTEGER PRIMARY KEY AUTOINCREMENT, banner_id INTEGER NOT NULL, version INTEGER NOT NULL, name TEXT NOT NULL, places TEXT NOT NULL, data TEXT NOT NULL, note TEXT NULL, created_at INTEGER NOT NULL, created_by TEXT NULL)",
"CREATE INDEX IF NOT EXISTS idx_bsv_banner ON bs_versions (banner_id, id)",
"CREATE TABLE IF NOT EXISTS bs_assets (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, name TEXT NOT NULL, file TEXT NOT NULL UNIQUE, mime TEXT NOT NULL, size INTEGER NOT NULL DEFAULT 0, w INTEGER NULL, h INTEGER NULL, family TEXT NULL, tags TEXT NULL, created_at INTEGER NOT NULL, created_by TEXT NULL)",
"CREATE INDEX IF NOT EXISTS idx_bsa_kind ON bs_assets (kind, id)",
"CREATE TABLE IF NOT EXISTS bs_templates (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, cat TEXT NOT NULL, data TEXT NOT NULL, created_at INTEGER NOT NULL, created_by TEXT NULL)",
"CREATE TABLE IF NOT EXISTS geo_areas (id INTEGER PRIMARY KEY AUTOINCREMENT, parent_id INTEGER NOT NULL DEFAULT 0, lvl INTEGER NOT NULL, code TEXT NOT NULL, name TEXT NOT NULL, bn TEXT NULL, active INTEGER NOT NULL DEFAULT 1, sort INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL)",
"CREATE INDEX IF NOT EXISTS idx_geo_parent ON geo_areas (parent_id, sort)",
"CREATE TABLE IF NOT EXISTS loc_min (id INTEGER PRIMARY KEY AUTOINCREMENT, parent_id INTEGER NOT NULL DEFAULT 0, lvl INTEGER NOT NULL, name TEXT NOT NULL, bn TEXT NULL, active INTEGER NOT NULL DEFAULT 1, fee DECIMAL(12,2) NULL, sort INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, eta INTEGER NULL, rider_pay DECIMAL(12,2) NULL)",
"CREATE INDEX IF NOT EXISTS idx_lmin_parent ON loc_min (parent_id, sort)",
"CREATE TABLE IF NOT EXISTS shop_follows (store TEXT NOT NULL, user_id TEXT NOT NULL, created_at INTEGER NOT NULL, PRIMARY KEY (store, user_id))",
"CREATE INDEX IF NOT EXISTS idx_sf_user ON shop_follows (user_id)",
"CREATE TABLE IF NOT EXISTS product_reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, pid TEXT NOT NULL, user_id TEXT NOT NULL, order_id TEXT NULL, stars INTEGER NOT NULL, body TEXT NULL, uname TEXT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)",
"CREATE UNIQUE INDEX IF NOT EXISTS idx_pr_pu ON product_reviews (pid, user_id)",
"CREATE TABLE IF NOT EXISTS an_visitors (vid TEXT PRIMARY KEY, first_at INTEGER NOT NULL, last_at INTEGER NOT NULL, uid TEXT NULL, ip TEXT NULL, pers INTEGER NOT NULL DEFAULT 0)",
"CREATE INDEX IF NOT EXISTS idx_anv_last ON an_visitors (last_at)",
"CREATE TABLE IF NOT EXISTS an_events (id INTEGER PRIMARY KEY AUTOINCREMENT, vid TEXT NOT NULL, sid TEXT NOT NULL, ev TEXT NOT NULL, pid TEXT NULL, uid TEXT NULL, vw TEXT NULL, created_at INTEGER NOT NULL, ip TEXT NULL, pg TEXT NULL, cat TEXT NULL, pn TEXT NULL)",
"CREATE INDEX IF NOT EXISTS idx_ane_t ON an_events (created_at, ev)",
"CREATE INDEX IF NOT EXISTS idx_ane_s ON an_events (sid)",
"CREATE INDEX IF NOT EXISTS idx_ane_ip ON an_events (ip, created_at)",
"CREATE INDEX IF NOT EXISTS idx_ane_v ON an_events (vid, id)",
"CREATE INDEX IF NOT EXISTS idx_ane_u ON an_events (uid, id)",
        ];
        return array_merge($a, schema_extra('sqlite'));
    }
    $e = ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';
    $a = [
"CREATE TABLE IF NOT EXISTS users (id VARCHAR(40) NOT NULL PRIMARY KEY, name VARCHAR(190) NOT NULL, email VARCHAR(190) NULL, mobile VARCHAR(20) NOT NULL, pw_hash VARCHAR(255) NULL, auto TINYINT NOT NULL DEFAULT 0, mvf TINYINT NOT NULL DEFAULT 0, wallet DECIMAL(12,2) NOT NULL DEFAULT 0, profile LONGTEXT NULL, blocked TINYINT NOT NULL DEFAULT 0, created_at INT NOT NULL, UNIQUE KEY email (email), UNIQUE KEY mobile (mobile))$e",
"CREATE TABLE IF NOT EXISTS sessions (token VARCHAR(100) NOT NULL PRIMARY KEY, user_id VARCHAR(40) NOT NULL, role VARCHAR(10) NOT NULL, created_at INT NOT NULL, expires_at INT NOT NULL, KEY idx_sessions_user (user_id))$e",
"CREATE TABLE IF NOT EXISTS admins (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, email VARCHAR(190) NOT NULL, name VARCHAR(190) NOT NULL, pw_hash VARCHAR(255) NOT NULL, role VARCHAR(20) NOT NULL DEFAULT 'admin', perms TEXT NULL, UNIQUE KEY email (email))$e",
"CREATE TABLE IF NOT EXISTS wallet_tx (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(40) NOT NULL, t VARCHAR(10) NOT NULL, amount DECIMAL(12,2) NOT NULL, order_id VARCHAR(40) NULL, pct DECIMAL(6,2) NULL, note VARCHAR(255) NULL, created_at INT NOT NULL, KEY idx_wtx_user (user_id, id))$e",
"CREATE TABLE IF NOT EXISTS orders (id VARCHAR(40) NOT NULL PRIMARY KEY, user_id VARCHAR(40) NULL, `view` VARCHAR(5) NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'Pending', sub DECIMAL(12,2) NOT NULL DEFAULT 0, fee DECIMAL(12,2) NOT NULL DEFAULT 0, cod DECIMAL(12,2) NOT NULL DEFAULT 0, total DECIMAL(12,2) NOT NULL DEFAULT 0, pay VARCHAR(10) NOT NULL, shop VARCHAR(190) NULL, veh VARCHAR(10) NULL, name VARCHAR(190) NOT NULL, mobile VARCHAR(20) NOT NULL, email VARCHAR(190) NULL, address TEXT NOT NULL, items LONGTEXT NOT NULL, extra LONGTEXT NULL, trk VARCHAR(40) NULL, cashback DECIMAL(12,2) NOT NULL DEFAULT 0, paid_wallet DECIMAL(12,2) NOT NULL DEFAULT 0, created_at INT NOT NULL, updated_at INT NOT NULL, disc DECIMAL(12,2) NOT NULL DEFAULT 0, coupon VARCHAR(40) NULL, delivered_at INT NULL, ip VARCHAR(45) NULL, KEY idx_orders_user (user_id, created_at), KEY idx_orders_created (created_at), KEY idx_orders_trk (trk))$e",
"CREATE TABLE IF NOT EXISTS kv (k VARCHAR(100) NOT NULL PRIMARY KEY, v LONGTEXT NULL, updated_at INT NOT NULL DEFAULT 0)$e",
"CREATE TABLE IF NOT EXISTS login_fails (ip VARCHAR(64) NOT NULL, ts INT NOT NULL, KEY idx_lf (ip, ts))$e",
"CREATE TABLE IF NOT EXISTS riders (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(190) NOT NULL, mobile VARCHAR(20) NOT NULL, email VARCHAR(190) NULL, pw_hash VARCHAR(255) NOT NULL, address TEXT NULL, nid VARCHAR(60) NULL, vehicle_type VARCHAR(20) NULL, vehicle_no VARCHAR(40) NULL, license_no VARCHAR(60) NULL, emerg_name VARCHAR(190) NULL, emerg_mobile VARCHAR(20) NULL, photo VARCHAR(80) NULL, docs TEXT NULL, status VARCHAR(12) NOT NULL DEFAULT 'pending', reject_reason VARCHAR(255) NULL, online TINYINT NOT NULL DEFAULT 0, chg TEXT NULL, created_at INT NOT NULL, approved_at INT NULL, last_seen INT NULL, UNIQUE KEY rmobile (mobile), UNIQUE KEY remail (email))$e",
"CREATE TABLE IF NOT EXISTS deliveries (order_id VARCHAR(40) NOT NULL PRIMARY KEY, rider_id INT NOT NULL, rstat VARCHAR(12) NOT NULL, otp VARCHAR(8) NOT NULL, fail_reason VARCHAR(190) NULL, assigned_at INT NOT NULL, updated_at INT NOT NULL, KEY idx_dl_rider (rider_id, rstat))$e",
"CREATE TABLE IF NOT EXISTS rider_notif (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, rider_id INT NOT NULL, title VARCHAR(190) NOT NULL, body VARCHAR(500) NULL, is_read TINYINT NOT NULL DEFAULT 0, created_at INT NOT NULL, url VARCHAR(500) NULL, img VARCHAR(500) NULL, kind VARCHAR(20) NULL, dkey VARCHAR(120) NULL, KEY idx_rn_rider (rider_id, id))$e",
"CREATE TABLE IF NOT EXISTS sellers (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, shop_name VARCHAR(190) NOT NULL, owner_name VARCHAR(190) NOT NULL, mobile VARCHAR(20) NOT NULL, email VARCHAR(190) NULL, pw_hash VARCHAR(255) NOT NULL, address TEXT NULL, nid VARCHAR(60) NULL, trade_no VARCHAR(80) NULL, sell_view VARCHAR(5) NOT NULL DEFAULT 'both', category VARCHAR(120) NULL, about TEXT NULL, logo VARCHAR(80) NULL, docs TEXT NULL, status VARCHAR(12) NOT NULL DEFAULT 'pending', reject_reason VARCHAR(255) NULL, chg TEXT NULL, created_at INT NOT NULL, approved_at INT NULL, last_seen INT NULL, cover VARCHAR(80) NULL, com_pct DECIMAL(6,2) NULL, payout TEXT NULL, hours TEXT NULL, coverage TEXT NULL, lat DECIMAL(10,7) NULL, lng DECIMAL(10,7) NULL, photo VARCHAR(80) NULL, ad_promo_used DECIMAL(12,2) NOT NULL DEFAULT 0, ad_debt DECIMAL(12,2) NOT NULL DEFAULT 0, ad_limit DECIMAL(12,2) NULL, UNIQUE KEY sshop (shop_name), UNIQUE KEY smobile (mobile), UNIQUE KEY semail (email))$e",
"CREATE TABLE IF NOT EXISTS seller_products (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, seller_id INT NOT NULL, name VARCHAR(190) NOT NULL, bn VARCHAR(190) NULL, price DECIMAL(12,2) NOT NULL DEFAULT 0, old DECIMAL(12,2) NOT NULL DEFAULT 0, stock INT NOT NULL DEFAULT 0, cat VARCHAR(120) NULL, v VARCHAR(5) NOT NULL DEFAULT 'both', about TEXT NULL, specs TEXT NULL, sub VARCHAR(120) NULL, imgs TEXT NULL, status VARCHAR(10) NOT NULL DEFAULT 'pending', hidden TINYINT NOT NULL DEFAULT 0, reject_reason VARCHAR(255) NULL, chg TEXT NULL, vr TEXT NULL, sold INT NOT NULL DEFAULT 0, created_at INT NOT NULL, updated_at INT NOT NULL, com_pct DECIMAL(6,2) NULL, stock_on TINYINT NOT NULL DEFAULT 1, max_q INT NOT NULL DEFAULT 0, about_bn TEXT NULL, pcode VARCHAR(40) NULL, tags TEXT NULL, cat_id INT NULL, KEY idx_sp_seller (seller_id, status), KEY idx_sp_status (status))$e",
"CREATE TABLE IF NOT EXISTS order_live (order_id VARCHAR(40) NOT NULL PRIMARY KEY, lat DECIMAL(10,7) NOT NULL, lng DECIMAL(10,7) NOT NULL, acc INT NULL, started_at INT NOT NULL, updated_at INT NOT NULL)$e",
"CREATE TABLE IF NOT EXISTS seller_orders (order_id VARCHAR(40) NOT NULL, seller_id INT NOT NULL, sstat VARCHAR(12) NOT NULL, note VARCHAR(255) NULL, updated_at INT NOT NULL, PRIMARY KEY (order_id, seller_id))$e",
"CREATE TABLE IF NOT EXISTS seller_notif (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, seller_id INT NOT NULL, title VARCHAR(190) NOT NULL, body VARCHAR(500) NULL, is_read TINYINT NOT NULL DEFAULT 0, created_at INT NOT NULL, url VARCHAR(500) NULL, img VARCHAR(500) NULL, kind VARCHAR(20) NULL, dkey VARCHAR(120) NULL, KEY idx_sn_seller (seller_id, id))$e",
"CREATE TABLE IF NOT EXISTS chat_convs (id VARCHAR(24) NOT NULL PRIMARY KEY, cid VARCHAR(60) NOT NULL, name VARCHAR(120) NULL, phone VARCHAR(40) NULL, email VARCHAR(190) NULL, reg TINYINT NOT NULL DEFAULT 0, mode VARCHAR(8) NOT NULL DEFAULT 'bot', status VARCHAR(10) NOT NULL DEFAULT 'open', assignee VARCHAR(80) NULL, `view` VARCHAR(5) NULL, order_id VARCHAR(40) NULL, product TEXT NULL, unread_admin INT NOT NULL DEFAULT 0, unread_user INT NOT NULL DEFAULT 0, last_msg_id INT NOT NULL DEFAULT 0, last_at INT NOT NULL DEFAULT 0, created_at INT NOT NULL, KEY idx_cc_cid (cid, last_at), KEY idx_cc_status (status, last_at))$e",
"CREATE TABLE IF NOT EXISTS chat_msgs (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, conv_id VARCHAR(24) NOT NULL, from_ VARCHAR(1) NOT NULL, kind VARCHAR(5) NOT NULL DEFAULT 't', body TEXT NULL, url VARCHAR(255) NULL, dur INT NULL, meta TEXT NULL, an VARCHAR(80) NULL, created_at INT NOT NULL, KEY idx_cm_conv (conv_id, id))$e",
"CREATE TABLE IF NOT EXISTS seller_earnings (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, seller_id INT NOT NULL, order_id VARCHAR(40) NOT NULL, line INT NOT NULL, product_id INT NULL, pname VARCHAR(255) NOT NULL, variant VARCHAR(255) NULL, qty INT NOT NULL DEFAULT 1, unit DECIMAL(12,2) NOT NULL DEFAULT 0, sale DECIMAL(12,2) NOT NULL DEFAULT 0, disc DECIMAL(12,2) NOT NULL DEFAULT 0, com_pct DECIMAL(6,2) NOT NULL DEFAULT 0, commission DECIMAL(12,2) NOT NULL DEFAULT 0, net DECIMAL(12,2) NOT NULL DEFAULT 0, status VARCHAR(12) NOT NULL DEFAULT 'pending', order_at INT NOT NULL, cleared_at INT NULL, created_at INT NOT NULL, updated_at INT NOT NULL, UNIQUE KEY se_line (order_id, line), KEY idx_se_seller (seller_id, status))$e",
"CREATE TABLE IF NOT EXISTS seller_withdrawals (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, seller_id INT NOT NULL, amount DECIMAL(12,2) NOT NULL, method VARCHAR(10) NOT NULL, details TEXT NOT NULL, status VARCHAR(12) NOT NULL DEFAULT 'pending', reason VARCHAR(255) NULL, admin_note VARCHAR(255) NULL, pay_ref VARCHAR(120) NULL, admin_name VARCHAR(190) NULL, paid_at INT NULL, created_at INT NOT NULL, updated_at INT NOT NULL, KEY idx_sw_seller (seller_id, id), KEY idx_sw_status (status, id))$e",
"CREATE TABLE IF NOT EXISTS seller_wtx (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, seller_id INT NOT NULL, kind VARCHAR(12) NOT NULL, amount DECIMAL(12,2) NOT NULL, effect TINYINT NOT NULL DEFAULT 0, bal_after DECIMAL(12,2) NOT NULL DEFAULT 0, ref VARCHAR(40) NULL, note VARCHAR(255) NULL, created_at INT NOT NULL, KEY idx_swt_seller (seller_id, id))$e",
"CREATE TABLE IF NOT EXISTS seller_coupons (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, seller_id INT NOT NULL, product_id INT NOT NULL, code VARCHAR(40) NOT NULL, type VARCHAR(6) NOT NULL, value DECIMAL(12,2) NOT NULL, min_buy DECIMAL(12,2) NOT NULL DEFAULT 0, starts_at INT NULL, ends_at INT NULL, max_uses INT NOT NULL DEFAULT 0, per_user INT NOT NULL DEFAULT 0, used INT NOT NULL DEFAULT 0, status VARCHAR(10) NOT NULL DEFAULT 'active', created_at INT NOT NULL, updated_at INT NOT NULL, UNIQUE KEY scp_code (code), KEY idx_scp_seller (seller_id), KEY idx_scp_product (product_id))$e",
"CREATE TABLE IF NOT EXISTS coupon_uses (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, coupon_id INT NOT NULL, user_id VARCHAR(40) NOT NULL, order_id VARCHAR(40) NOT NULL, amount DECIMAL(12,2) NOT NULL DEFAULT 0, released TINYINT NOT NULL DEFAULT 0, created_at INT NOT NULL, KEY idx_cu_coupon (coupon_id, user_id), KEY idx_cu_order (order_id))$e",
"CREATE TABLE IF NOT EXISTS bs_banners (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL, status VARCHAR(12) NOT NULL DEFAULT 'draft', places TEXT NOT NULL, data MEDIUMTEXT NOT NULL, pub MEDIUMTEXT NULL, autosave MEDIUMTEXT NULL, autosave_at INT NULL, start_at INT NULL, end_at INT NULL, version INT NOT NULL DEFAULT 0, created_at INT NOT NULL, updated_at INT NOT NULL, created_by VARCHAR(120) NULL, updated_by VARCHAR(120) NULL, published_at INT NULL, KEY idx_bsb_status (status, end_at))$e",
"CREATE TABLE IF NOT EXISTS bs_versions (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, banner_id INT NOT NULL, version INT NOT NULL, name VARCHAR(120) NOT NULL, places TEXT NOT NULL, data MEDIUMTEXT NOT NULL, note VARCHAR(200) NULL, created_at INT NOT NULL, created_by VARCHAR(120) NULL, KEY idx_bsv_banner (banner_id, id))$e",
"CREATE TABLE IF NOT EXISTS bs_assets (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, kind VARCHAR(12) NOT NULL, name VARCHAR(120) NOT NULL, file VARCHAR(40) NOT NULL, mime VARCHAR(40) NOT NULL, size INT NOT NULL DEFAULT 0, w INT NULL, h INT NULL, family VARCHAR(60) NULL, tags VARCHAR(200) NULL, created_at INT NOT NULL, created_by VARCHAR(120) NULL, UNIQUE KEY bsa_file (file), KEY idx_bsa_kind (kind, id))$e",
"CREATE TABLE IF NOT EXISTS bs_templates (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL, cat VARCHAR(40) NOT NULL, data MEDIUMTEXT NOT NULL, created_at INT NOT NULL, created_by VARCHAR(120) NULL)$e",
"CREATE TABLE IF NOT EXISTS geo_areas (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, parent_id INT NOT NULL DEFAULT 0, lvl TINYINT NOT NULL, code VARCHAR(60) NOT NULL, name VARCHAR(120) NOT NULL, bn VARCHAR(120) NULL, active TINYINT NOT NULL DEFAULT 1, sort INT NOT NULL DEFAULT 0, created_at INT NOT NULL, KEY idx_geo_parent (parent_id, sort))$e",
"CREATE TABLE IF NOT EXISTS loc_min (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, parent_id INT NOT NULL DEFAULT 0, lvl TINYINT NOT NULL, name VARCHAR(120) NOT NULL, bn VARCHAR(120) NULL, active TINYINT NOT NULL DEFAULT 1, fee DECIMAL(12,2) NULL, sort INT NOT NULL DEFAULT 0, created_at INT NOT NULL, eta INT NULL, rider_pay DECIMAL(12,2) NULL, KEY idx_lmin_parent (parent_id, sort))$e",
"CREATE TABLE IF NOT EXISTS shop_follows (store VARCHAR(40) NOT NULL, user_id VARCHAR(40) NOT NULL, created_at INT NOT NULL, PRIMARY KEY (store, user_id), KEY idx_sf_user (user_id))$e",
"CREATE TABLE IF NOT EXISTS product_reviews (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, pid VARCHAR(40) NOT NULL, user_id VARCHAR(40) NOT NULL, order_id VARCHAR(40) NULL, stars TINYINT NOT NULL, body TEXT NULL, uname VARCHAR(100) NULL, created_at INT NOT NULL, updated_at INT NOT NULL, UNIQUE KEY idx_pr_pu (pid, user_id))$e",
"CREATE TABLE IF NOT EXISTS an_visitors (vid VARCHAR(40) NOT NULL PRIMARY KEY, first_at INT NOT NULL, last_at INT NOT NULL, uid VARCHAR(40) NULL, ip VARCHAR(45) NULL, pers TINYINT NOT NULL DEFAULT 0, KEY idx_anv_last (last_at))$e",
"CREATE TABLE IF NOT EXISTS an_events (id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, vid VARCHAR(40) NOT NULL, sid VARCHAR(40) NOT NULL, ev VARCHAR(10) NOT NULL, pid VARCHAR(40) NULL, uid VARCHAR(40) NULL, vw VARCHAR(4) NULL, created_at INT NOT NULL, ip VARCHAR(45) NULL, pg VARCHAR(60) NULL, cat VARCHAR(80) NULL, pn VARCHAR(120) NULL, KEY idx_ane_t (created_at, ev), KEY idx_ane_s (sid), KEY idx_ane_ip (ip, created_at), KEY idx_ane_v (vid, id), KEY idx_ane_u (uid, id))$e",
    ];
    return array_merge($a, schema_extra('mysql'));
}


/** Tables added for NurBuy Minutes v2 (categories tree, notifications, web push, delivery, ads). */
function schema_extra($driver) {
    $sq = $driver === 'sqlite';
    $pk = $sq ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT NOT NULL AUTO_INCREMENT PRIMARY KEY';
    $i = $sq ? 'INTEGER' : 'INT'; $s = $sq ? 'TEXT' : 'VARCHAR(190)'; $d = 'DECIMAL(12,2)';
    $e = $sq ? '' : ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';
    // [table, columns, [[unique?, index name, columns], ...]]
    $T = [
        ['categories', "id $pk, parent_id $i NOT NULL DEFAULT 0, name $s NOT NULL, bn $s NULL, slug VARCHAR(120) NOT NULL, img VARCHAR(500) NULL, icon VARCHAR(500) NULL, sort $i NOT NULL DEFAULT 0, active $i NOT NULL DEFAULT 1, created_at $i NOT NULL, updated_at $i NOT NULL",
            [[1, 'ux_cat_slug', 'slug'], [0, 'idx_cat_parent', 'parent_id, sort']]],
        ['user_notif', "id $pk, user_id VARCHAR(40) NOT NULL, title $s NOT NULL, body VARCHAR(500) NULL, url VARCHAR(500) NULL, img VARCHAR(500) NULL, kind VARCHAR(20) NULL, dkey VARCHAR(120) NULL, is_read $i NOT NULL DEFAULT 0, created_at $i NOT NULL",
            [[0, 'idx_un_user', 'user_id, id'], [1, 'ux_un_dkey', 'user_id, dkey']]],
        ['push_subs', "id $pk, role VARCHAR(10) NOT NULL, owner_id VARCHAR(40) NOT NULL, ep_hash VARCHAR(64) NOT NULL, endpoint TEXT NOT NULL, p256dh VARCHAR(200) NOT NULL, auth VARCHAR(100) NOT NULL, ua VARCHAR(200) NULL, fails $i NOT NULL DEFAULT 0, created_at $i NOT NULL, last_ok $i NULL",
            [[1, 'ux_ps_ep', 'ep_hash'], [0, 'idx_ps_owner', 'role, owner_id']]],
        ['push_queue', "id $pk, sub_id $i NOT NULL, payload TEXT NOT NULL, dkey VARCHAR(160) NULL, tries $i NOT NULL DEFAULT 0, created_at $i NOT NULL, sent_at $i NULL",
            [[1, 'ux_pq_dkey', 'sub_id, dkey'], [0, 'idx_pq_sent', 'sent_at, id']]],
        ['admin_broadcasts', "id $pk, target VARCHAR(20) NOT NULL, ids TEXT NULL, title $s NOT NULL, body VARCHAR(500) NULL, img VARCHAR(500) NULL, url VARCHAR(500) NULL, sent $i NOT NULL DEFAULT 0, admin_name $s NULL, created_at $i NOT NULL", []],
        ['order_delays', "id $pk, order_id VARCHAR(40) NOT NULL, rider_id $i NOT NULL, mins $i NOT NULL, reason VARCHAR(40) NOT NULL, note VARCHAR(200) NULL, created_at $i NOT NULL",
            [[0, 'idx_od_order', 'order_id, id']]],
        ['rider_earnings', "id $pk, rider_id $i NOT NULL, order_id VARCHAR(40) NOT NULL, amount $d NOT NULL DEFAULT 0, loc_id $i NULL, area VARCHAR(255) NULL, created_at $i NOT NULL",
            [[1, 'ux_re_order', 'order_id'], [0, 'idx_re_rider', 'rider_id, id']]],
        ['ledger_keys', "k VARCHAR(120) NOT NULL PRIMARY KEY, created_at $i NOT NULL", []],
        ['ad_campaigns', "id $pk, seller_id $i NOT NULL, product_id $i NOT NULL, status VARCHAR(12) NOT NULL DEFAULT 'pending', days $i NOT NULL DEFAULT 7, daily_cap $d NULL, start_at $i NULL, end_at $i NULL, imp $i NOT NULL DEFAULT 0, clicks $i NOT NULL DEFAULT 0, imp_cost DECIMAL(12,4) NOT NULL DEFAULT 0, click_cost DECIMAL(12,4) NOT NULL DEFAULT 0, settled $d NOT NULL DEFAULT 0, pause_reason VARCHAR(30) NULL, reject_reason VARCHAR(255) NULL, note VARCHAR(255) NULL, created_at $i NOT NULL, updated_at $i NOT NULL, reviewed_at $i NULL",
            [[0, 'idx_ac_seller', 'seller_id, id'], [0, 'idx_ac_status', 'status']]],
        ['ad_events', "id $pk, campaign_id $i NOT NULL, kind VARCHAR(5) NOT NULL, vkey VARCHAR(64) NOT NULL, bucket $i NOT NULL, ip VARCHAR(64) NULL, created_at $i NOT NULL",
            [[1, 'ux_ae', 'campaign_id, kind, vkey, bucket'], [0, 'idx_ae_ip', 'ip, created_at']]],
        ['delivery_zones', "id $pk, name $s NOT NULL, bn $s NULL, active $i NOT NULL DEFAULT 1, poly TEXT NOT NULL, area_km2 DECIMAL(12,4) NOT NULL DEFAULT 0, fee $d NULL, eta $i NULL, rider_pay $d NULL, min_order $d NULL, free_over $d NULL, per_km $d NULL, km_free DECIMAL(6,2) NULL, color VARCHAR(9) NULL, sort $i NOT NULL DEFAULT 0, created_at $i NOT NULL, updated_at $i NOT NULL",
            [[0, 'idx_dz_active', 'active, sort']]],
        ['ad_ledger', "id $pk, seller_id $i NOT NULL, campaign_id $i NULL, kind VARCHAR(12) NOT NULL, amount $d NOT NULL DEFAULT 0, promo $d NOT NULL DEFAULT 0, wallet $d NOT NULL DEFAULT 0, debt $d NOT NULL DEFAULT 0, imp $i NOT NULL DEFAULT 0, clicks $i NOT NULL DEFAULT 0, note VARCHAR(255) NULL, created_at $i NOT NULL",
            [[0, 'idx_al_seller', 'seller_id, id']]],
        // v16: fraud reports from riders, account/IP restrictions, appeals, audit trail, rate-limit hits
        ['fraud_reports', "id $pk, order_id VARCHAR(40) NOT NULL, rider_id $i NOT NULL, user_id VARCHAR(40) NULL, mobile VARCHAR(20) NULL, reason VARCHAR(20) NOT NULL, note VARCHAR(500) NULL, evidence TEXT NULL, status VARCHAR(10) NOT NULL DEFAULT 'pending', decision_note VARCHAR(500) NULL, decided_by VARCHAR(80) NULL, decided_at $i NULL, created_at $i NOT NULL",
            [[0, 'idx_fr_status', 'status, id'], [0, 'idx_fr_order', 'order_id'], [0, 'idx_fr_user', 'user_id'], [0, 'idx_fr_rider', 'rider_id, id']]],
        ['blocks', "id $pk, kind VARCHAR(4) NOT NULL, target VARCHAR(64) NOT NULL, reason VARCHAR(300) NOT NULL, report_id $i NULL, active $i NOT NULL DEFAULT 1, expires_at $i NULL, created_by VARCHAR(80) NULL, created_at $i NOT NULL, lifted_by VARCHAR(80) NULL, lifted_at $i NULL, lift_note VARCHAR(300) NULL",
            [[0, 'idx_bl_target', 'kind, target, active'], [0, 'idx_bl_active', 'active, id']]],
        ['block_appeals', "id $pk, ref VARCHAR(16) NOT NULL, block_id $i NULL, user_id VARCHAR(40) NULL, name VARCHAR(100) NOT NULL, mobile VARCHAR(20) NOT NULL, message VARCHAR(1000) NOT NULL, ip VARCHAR(45) NULL, status VARCHAR(10) NOT NULL DEFAULT 'open', admin_note VARCHAR(500) NULL, decided_by VARCHAR(80) NULL, decided_at $i NULL, created_at $i NOT NULL",
            [[1, 'ux_ba_ref', 'ref'], [0, 'idx_ba_status', 'status, id'], [0, 'idx_ba_mobile', 'mobile']]],
        ['audit_log', "id $pk, actor_role VARCHAR(10) NOT NULL, actor VARCHAR(80) NULL, action VARCHAR(40) NOT NULL, target VARCHAR(80) NULL, detail VARCHAR(1000) NULL, ip VARCHAR(45) NULL, created_at $i NOT NULL",
            [[0, 'idx_au_t', 'created_at'], [0, 'idx_au_act', 'action, id']]],
        // v18: rider withdrawals (same shape as seller_withdrawals)
        ['rider_withdrawals', "id $pk, rider_id $i NOT NULL, amount $d NOT NULL, method VARCHAR(10) NOT NULL, details TEXT NOT NULL, status VARCHAR(12) NOT NULL DEFAULT 'pending', reason VARCHAR(255) NULL, admin_note VARCHAR(255) NULL, pay_ref VARCHAR(120) NULL, admin_name VARCHAR(190) NULL, paid_at $i NULL, created_at $i NOT NULL, updated_at $i NOT NULL",
            [[0, 'idx_rw_rider', 'rider_id, id'], [0, 'idx_rw_status', 'status, id']]],
        ['rate_hits', "k VARCHAR(80) NOT NULL, ts $i NOT NULL", [[0, 'idx_rh', 'k, ts']]],
        // v19: phones of the customer app (Firebase Cloud Messaging tokens); token_hash keeps each token unique
        ['device_tokens', "id $pk, user_id VARCHAR(40) NOT NULL, token TEXT NOT NULL, token_hash VARCHAR(64) NOT NULL, platform VARCHAR(10) NOT NULL, created_at $i NOT NULL, updated_at $i NOT NULL",
            [[1, 'ux_dt_token', 'token_hash'], [0, 'idx_dt_user', 'user_id']]],
    ];
    $out = [];
    foreach ($T as $t) {
        if ($sq) {
            $out[] = "CREATE TABLE IF NOT EXISTS {$t[0]} ({$t[1]})";
            foreach ($t[2] as $x) $out[] = 'CREATE ' . ($x[0] ? 'UNIQUE ' : '') . "INDEX IF NOT EXISTS {$x[1]} ON {$t[0]} ({$x[2]})";
        } else {
            $k = ''; foreach ($t[2] as $x) $k .= ', ' . ($x[0] ? 'UNIQUE ' : '') . "KEY {$x[1]} ({$x[2]})";
            $out[] = "CREATE TABLE IF NOT EXISTS {$t[0]} ({$t[1]}$k)$e";
        }
    }
    return $out;
}
