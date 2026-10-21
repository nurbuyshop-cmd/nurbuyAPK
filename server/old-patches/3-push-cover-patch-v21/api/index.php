<?php
/* NurBuy API front controller: routing, CORS, JSON error handling. */
define('NB', 1);
error_reporting(E_ALL);
ini_set('display_errors', '0');
require __DIR__ . '/lib/helpers.php';
require __DIR__ . '/lib/db.php';
require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/handlers_public.php';
require __DIR__ . '/lib/handlers_user.php';
require __DIR__ . '/lib/handlers_orders.php';
require __DIR__ . '/lib/handlers_admin.php';
require __DIR__ . '/lib/handlers_rider.php';
require __DIR__ . '/lib/autoassign.php';
require __DIR__ . '/lib/handlers_seller.php';
require __DIR__ . '/lib/handlers_chat.php';
require __DIR__ . '/lib/handlers_wallet.php';
require __DIR__ . '/lib/handlers_bs.php';
require __DIR__ . '/lib/handlers_biz.php';
require __DIR__ . '/lib/handlers_loc.php';
require __DIR__ . '/lib/upload.php';
require __DIR__ . '/lib/notify.php';
require __DIR__ . '/lib/handlers_cat.php';
require __DIR__ . '/lib/handlers_delivery.php';
require __DIR__ . '/lib/handlers_share.php';
require __DIR__ . '/lib/handlers_ads.php';
require __DIR__ . '/lib/handlers_maps.php';
require __DIR__ . '/lib/handlers_zones.php';
require __DIR__ . '/lib/handlers_fraud.php';
require __DIR__ . '/lib/handlers_udata.php';
require __DIR__ . '/lib/handlers_reviews.php';
require __DIR__ . '/lib/handlers_rider_wd.php';

try {
    @date_default_timezone_set((string)cfg('timezone', 'Asia/Dhaka'));
} catch (Throwable $e) { /* config missing: handled below */ }

try {
    send_cors();
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    if ($method === 'OPTIONS') { http_response_code(204); exit; }
    // optional method override for hosts that block PUT/PATCH/DELETE
    if ($method === 'POST') {
        $ov = strtoupper($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? ($_GET['_method'] ?? ''));
        if (in_array($ov, ['PUT', 'PATCH', 'DELETE'], true)) $method = $ov;
    }

    ensure_schema();
    if (function_exists('push_flush') && mt_rand(1, 8) === 1) register_shutdown_function(function () { if (function_exists('fastcgi_finish_request')) @fastcgi_finish_request(); try { if ((int)db_val('SELECT COUNT(*) FROM push_queue WHERE sent_at IS NULL AND tries < 5') > 0) push_flush(20); } catch (Throwable $e) { /* ignore */ } });

    // ---- resolve path: ?r=/x, /index.php/x, or /x (relative to script dir)
    if (isset($_GET['r']) && is_string($_GET['r'])) {
        $path = $_GET['r'];
    } else {
        $path = (string)parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $dir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/index.php')), '/');
        if ($dir !== '' && strpos($path, $dir . '/') === 0) $path = substr($path, strlen($dir));
        elseif ($dir !== '' && $path === $dir) $path = '/';
        if (strpos($path, '/index.php') === 0) $path = substr($path, strlen('/index.php'));
    }
    $path = '/' . trim(rawurldecode($path), '/');

    $routes = [
        ['GET', '#^/$#', function () { json_out(['ok' => true, 'name' => 'NurBuy API']); }],
        ['GET', '#^/health$#', 'h_health'],
        ['GET', '#^/catalog$#', 'h_catalog'],
        ['GET', '#^/brand$#', 'h_brand'],
        ['GET', '#^/thumb/(\d+)/([A-Za-z0-9_.-]+)$#', 'h_thumb'],
        ['POST', '#^/newsletter$#', 'h_newsletter_subscribe'],
        ['POST', '#^/auth/signup$#', 'h_signup'],
        ['POST', '#^/auth/login$#', 'h_login'],
        ['POST', '#^/auth/logout$#', 'h_logout'],
        ['GET', '#^/auth/me$#', 'h_me'],
        ['PUT', '#^/me$#', 'h_me_update'],
        ['PUT', '#^/me/profile$#', 'h_me_profile'],
        ['POST', '#^/me/avatar$#', 'h_me_avatar'],
        ['POST', '#^/me/cover$#', 'h_me_cover'],
        ['POST', '#^/me/password$#', 'h_me_password'],
        ['POST', '#^/me/verify-mobile$#', 'h_verify_mobile'],
        ['GET', '#^/wallet$#', 'h_wallet'],
        ['GET', '#^/public/maps$#', 'h_public_maps'],
        ['GET', '#^/public/zones$#', 'h_public_zones'],
        ['POST', '#^/public/zones/check$#', 'h_public_zone_check'],
        ['POST', '#^/orders$#', 'h_order_create'],
        ['POST', '#^/orders/([^/]+)/live$#', 'h_order_live_post'],
        ['GET', '#^/orders/([^/]+)/live$#', 'h_order_live_get'],
        ['GET', '#^/orders/mine$#', 'h_orders_mine'],
        ['POST', '#^/rider/signup$#', 'h_rider_signup'],
        ['POST', '#^/rider/login$#', 'h_rider_login'],
        ['POST', '#^/rider/logout$#', 'h_logout'],
        ['GET', '#^/rider/me$#', 'h_rider_me'],
        ['PUT', '#^/rider/me$#', 'h_rider_me_update'],
        ['POST', '#^/rider/reapply$#', 'h_rider_reapply'],
        ['POST', '#^/rider/password$#', 'h_rider_password'],
        ['POST', '#^/rider/upload$#', 'h_rider_upload'],
        ['GET', '#^/rider/file$#', 'h_rider_file'],
        ['POST', '#^/rider/online$#', 'h_rider_online'],
        ['GET', '#^/rider/dashboard$#', 'h_rider_dashboard'],
        ['GET', '#^/rider/cash$#', 'h_rider_cash'],
        ['GET', '#^/rider/orders$#', 'h_rider_orders'],
        ['GET', '#^/rider/orders/([^/]+)$#', 'h_rider_order_get'],
        ['POST', '#^/rider/orders/([^/]+)/accept$#', 'h_rider_order_accept'],
        ['POST', '#^/rider/orders/([^/]+)/reject$#', 'h_rider_order_reject'],
        ['POST', '#^/rider/orders/([^/]+)/status$#', 'h_rider_order_status'],
        ['POST', '#^/rider/orders/([^/]+)/deliver$#', 'h_rider_order_deliver'],
        ['POST', '#^/rider/orders/([^/]+)/fail$#', 'h_rider_order_fail'],
        ['GET', '#^/rider/notifications$#', 'h_rider_notifications'],
        ['POST', '#^/rider/notifications/read$#', 'h_rider_notifications_read'],
        ['GET', '#^/admin/riders$#', 'h_admin_riders'],
        ['GET', '#^/admin/riders/([0-9]+)$#', 'h_admin_rider_get'],
        ['PATCH', '#^/admin/riders/([0-9]+)$#', 'h_admin_rider_patch'],
        ['GET', '#^/admin/riders/([0-9]+)/file$#', 'h_admin_rider_file'],
        ['GET', '#^/admin/riders/([0-9]+)/cash$#', 'h_admin_rider_cash'],
        ['POST', '#^/admin/riders/([0-9]+)/message$#', 'h_admin_rider_message'],
        ['POST', '#^/admin/orders/([^/]+)/assign$#', 'h_admin_order_assign'],
        ['POST', '#^/admin/orders/([^/]+)/unassign$#', 'h_admin_order_unassign'],
        ['POST', '#^/seller/signup$#', 'h_seller_signup'],
        ['POST', '#^/seller/login$#', 'h_seller_login'],
        ['POST', '#^/seller/logout$#', 'h_logout'],
        ['GET', '#^/seller/me$#', 'h_seller_me'],
        ['PUT', '#^/seller/me$#', 'h_seller_me_update'],
        ['POST', '#^/seller/reapply$#', 'h_seller_reapply'],
        ['POST', '#^/seller/password$#', 'h_seller_password'],
        ['POST', '#^/seller/upload$#', 'h_seller_upload'],
        ['GET', '#^/seller/file$#', 'h_seller_file'],
        ['GET', '#^/seller/meta$#', 'h_seller_meta'],
        ['GET', '#^/seller/dashboard$#', 'h_seller_dashboard'],
        ['GET', '#^/seller/products$#', 'h_seller_products'],
        ['GET', '#^/seller/pcode-new$#', 'h_seller_pcode_new'],
        ['POST', '#^/seller/products$#', 'h_seller_product_create'],
        ['GET', '#^/seller/products/([0-9]+)$#', 'h_seller_product_get'],
        ['PUT', '#^/seller/products/([0-9]+)$#', 'h_seller_product_update'],
        ['DELETE', '#^/seller/products/([0-9]+)$#', 'h_seller_product_delete'],
        ['POST', '#^/seller/products/([0-9]+)/stock$#', 'h_seller_product_stock'],
        ['POST', '#^/seller/products/([0-9]+)/variants/stock$#', 'h_seller_product_variants_stock'],
        ['POST', '#^/seller/products/([0-9]+)/visibility$#', 'h_seller_product_visibility'],
        ['GET', '#^/seller/orders$#', 'h_seller_orders'],
        ['GET', '#^/seller/orders/([^/]+)$#', 'h_seller_order_get'],
        ['POST', '#^/seller/orders/([^/]+)/action$#', 'h_seller_order_action'],
        ['GET', '#^/seller/notifications$#', 'h_seller_notifications'],
        ['GET', '#^/seller/wallet$#', 'h_seller_wallet'],
        ['POST', '#^/seller/withdrawals$#', 'h_seller_withdraw_create'],
        ['GET', '#^/seller/withdrawals/([0-9]+)$#', 'h_seller_withdraw_get'],
        ['GET', '#^/seller/coupons$#', 'h_seller_coupons'],
        ['POST', '#^/seller/coupons$#', 'h_seller_coupon_create'],
        ['PUT', '#^/seller/coupons/([0-9]+)$#', 'h_seller_coupon_update'],
        ['DELETE', '#^/seller/coupons/([0-9]+)$#', 'h_seller_coupon_delete'],
        ['DELETE', '#^/seller/cover$#', 'h_seller_cover_delete'],
        ['POST', '#^/coupons/check$#', 'h_coupon_check'],
        ['GET', '#^/admin/withdrawals$#', 'h_admin_withdrawals'],
        ['GET', '#^/admin/withdrawals/([0-9]+)$#', 'h_admin_withdrawal_get'],
        ['POST', '#^/admin/withdrawals/([0-9]+)/action$#', 'h_admin_withdrawal_action'],
        ['PUT', '#^/admin/sellers/([0-9]+)/commission$#', 'h_admin_seller_commission'],
        ['POST', '#^/seller/notifications/read$#', 'h_seller_notifications_read'],
        ['GET', '#^/admin/sellers$#', 'h_admin_sellers'],
        ['GET', '#^/admin/sellers/([0-9]+)$#', 'h_admin_seller_get'],
        ['PATCH', '#^/admin/sellers/([0-9]+)$#', 'h_admin_seller_patch'],
        ['GET', '#^/admin/sellers/([0-9]+)/file$#', 'h_admin_seller_file'],
        ['POST', '#^/admin/sellers/([0-9]+)/message$#', 'h_admin_seller_message'],
        ['POST', '#^/admin/categories/rename$#', 'h_admin_category_rename'],
        ['GET', '#^/admin/seller-products$#', 'h_admin_seller_products'],
        ['GET', '#^/admin/seller-products/([0-9]+)$#', 'h_admin_seller_product_get'],
        ['PATCH', '#^/admin/seller-products/([0-9]+)$#', 'h_admin_seller_product_patch'],
        ['POST', '#^/chat/send$#', 'h_chat_send'],
        ['GET', '#^/chat/sync$#', 'h_chat_sync'],
        ['POST', '#^/chat/read$#', 'h_chat_read'],
        ['POST', '#^/chat/upload$#', 'h_chat_upload'],
        ['GET', '#^/admin/chat/convs$#', 'h_admin_chat_convs'],
        ['GET', '#^/admin/chat/convs/([A-Za-z0-9_]+)$#', 'h_admin_chat_conv'],
        ['POST', '#^/admin/chat/convs/([A-Za-z0-9_]+)/send$#', 'h_admin_chat_send'],
        ['POST', '#^/admin/chat/convs/([A-Za-z0-9_]+)/status$#', 'h_admin_chat_status'],
        ['POST', '#^/admin/chat/upload$#', 'h_admin_chat_upload'],
        ['GET', '#^/admin/chat/unread$#', 'h_admin_chat_unread'],
        ['POST', '#^/admin/login$#', 'h_admin_login'],
        ['GET', '#^/admin/state$#', 'h_admin_state_get'],
        ['GET', '#^/admin/pcode-check$#', 'h_admin_pcode_check'],
        ['PUT', '#^/admin/state$#', 'h_admin_state_put'],
        ['GET', '#^/admin/site-content$#', 'h_admin_site_get'],
        ['PUT', '#^/admin/site-content$#', 'h_admin_site_put'],
        ['GET', '#^/admin/newsletter$#', 'h_admin_newsletter'],
        ['GET', '#^/admin/orders$#', 'h_admin_orders'],
        ['GET', '#^/admin/orders/([^/]+)/live$#', 'h_admin_order_live'],
        ['PATCH', '#^/admin/orders/([^/]+)$#', 'h_admin_order_patch'],
        ['GET', '#^/admin/customers$#', 'h_admin_customers'],
        ['GET', '#^/admin/customers/([^/]+)/avatar$#', 'h_admin_customer_avatar'],
        ['GET', '#^/admin/customers/([^/]+)/activity$#', 'h_admin_customer_activity'],
        ['PATCH', '#^/admin/customers/([^/]+)$#', 'h_admin_customer_patch'],
        ['POST', '#^/admin/wallet$#', 'h_admin_wallet'],
        ['POST', '#^/admin/upload$#', 'h_admin_upload'],
        ['GET', '#^/bs/banners$#', 'h_bs_public'],
        ['GET', '#^/bs/f/([a-z0-9]{5,40})$#', 'h_bs_font'],
        ['GET', '#^/admin/bs/me$#', 'h_bs_me'],
        ['GET', '#^/admin/bs/banners$#', 'h_bs_list'],
        ['POST', '#^/admin/bs/banners$#', 'h_bs_create'],
        ['GET', '#^/admin/bs/banners/(\d+)$#', 'h_bs_get'],
        ['PUT', '#^/admin/bs/banners/(\d+)$#', 'h_bs_update'],
        ['DELETE', '#^/admin/bs/banners/(\d+)$#', 'h_bs_delete'],
        ['PUT', '#^/admin/bs/banners/(\d+)/autosave$#', 'h_bs_autosave'],
        ['POST', '#^/admin/bs/banners/(\d+)/publish$#', 'h_bs_publish'],
        ['PUT', '#^/admin/bs/banners/(\d+)/status$#', 'h_bs_status'],
        ['POST', '#^/admin/bs/banners/(\d+)/duplicate$#', 'h_bs_duplicate'],
        ['GET', '#^/admin/bs/banners/(\d+)/versions/(\d+)$#', 'h_bs_version_get'],
        ['POST', '#^/admin/bs/banners/(\d+)/versions/(\d+)/restore$#', 'h_bs_version_restore'],
        ['GET', '#^/admin/bs/assets$#', 'h_bs_assets'],
        ['POST', '#^/admin/bs/assets$#', 'h_bs_asset_upload'],
        ['PUT', '#^/admin/bs/assets/(\d+)$#', 'h_bs_asset_update'],
        ['DELETE', '#^/admin/bs/assets/(\d+)$#', 'h_bs_asset_delete'],
        ['GET', '#^/admin/bs/templates$#', 'h_bs_templates'],
        ['POST', '#^/admin/bs/templates$#', 'h_bs_template_create'],
        ['DELETE', '#^/admin/bs/templates/(\d+)$#', 'h_bs_template_delete'],
        ['GET', '#^/admin/bs/team$#', 'h_bs_team'],
        ['POST', '#^/admin/bs/team$#', 'h_bs_team_create'],
        ['PUT', '#^/admin/bs/team/(\d+)$#', 'h_bs_team_update'],
        ['DELETE', '#^/admin/bs/team/(\d+)$#', 'h_bs_team_delete'],
        ['GET', '#^/admin/bs/products$#', 'h_bs_products'],
        ['POST', '#^/admin/password$#', 'h_admin_password'],
        ['GET', '#^/geo$#', 'h_geo'],
        ['POST', '#^/t$#', 'h_track'],
        ['GET', '#^/admin/biz/revenue$#', 'h_admin_biz_revenue'],
        ['GET', '#^/admin/biz/commissions$#', 'h_admin_biz_commissions'],
        ['GET', '#^/admin/biz/delivery$#', 'h_admin_biz_delivery'],
        ['GET', '#^/admin/biz/shops$#', 'h_admin_biz_shops'],
        ['GET', '#^/admin/biz/tx$#', 'h_admin_biz_tx'],
        ['GET', '#^/admin/biz/tx/(NB[CD]-[0-9A-Za-z-]+)$#', 'h_admin_biz_tx_get'],
        ['GET', '#^/admin/biz/stats$#', 'h_admin_biz_stats'],
        ['GET', '#^/admin/zones$#', 'h_admin_zones'],
        ['POST', '#^/admin/zones$#', 'h_admin_zone_create'],
        ['POST', '#^/admin/zones/test$#', 'h_admin_zone_test'],
        ['PUT', '#^/admin/sellers/([0-9]+)/coverage$#', 'h_admin_seller_coverage'],
        ['PUT', '#^/admin/zones/([0-9]+)$#', 'h_admin_zone_update'],
        ['DELETE', '#^/admin/zones/([0-9]+)$#', 'h_admin_zone_delete'],
        ['GET', '#^/admin/loc(?:/min)?$#', 'h_admin_loc'],
        ['POST', '#^/admin/loc(?:/min)?$#', 'h_admin_loc_create'],
        ['PUT', '#^/admin/loc(?:/min)?/([0-9]+)$#', 'h_admin_loc_update'],
        ['DELETE', '#^/admin/loc(?:/min)?/([0-9]+)$#', 'h_admin_loc_delete'],
        // categories (unlimited depth)
        ['GET', '#^/categories$#', 'h_categories'],
        ['GET', '#^/admin/categories$#', 'h_admin_categories'],
        ['POST', '#^/admin/categories$#', 'h_admin_category_create'],
        ['POST', '#^/admin/categories/reorder$#', 'h_admin_category_reorder'],
        ['PUT', '#^/admin/categories/([0-9]+)$#', 'h_admin_category_update'],
        ['DELETE', '#^/admin/categories/([0-9]+)$#', 'h_admin_category_delete'],
        // notifications + web push
        ['GET', '#^/me/notifications$#', 'h_me_notifications'],
        ['POST', '#^/me/notifications/read$#', 'h_me_notifications_read'],
        ['GET', '#^/push/key$#', 'h_push_key'],
        ['POST', '#^/push/subscribe$#', 'h_push_subscribe'],
        ['POST', '#^/push/unsubscribe$#', 'h_push_unsubscribe'],
        // customer app: phone push tokens (Firebase Cloud Messaging)
        ['POST', '#^/me/device$#', 'h_me_device_add'],
        ['DELETE', '#^/me/device$#', 'h_me_device_del'],
        ['GET', '#^/admin/notify$#', 'h_admin_notify_list'],
        ['POST', '#^/admin/notify$#', 'h_admin_notify'],
        ['GET', '#^/admin/notify/people$#', 'h_admin_notify_people'],
        // delivery: rider extra time, rider earnings
        ['POST', '#^/rider/orders/([^/]+)/delay$#', 'h_rider_order_delay'],
        ['GET', '#^/rider/earnings$#', 'h_rider_earnings'],
        ['GET', '#^/rider/wallet$#', 'h_rider_wallet'],
        ['POST', '#^/rider/withdrawals$#', 'h_rider_withdraw_create'],
        ['GET', '#^/rider/withdrawals/([0-9]+)$#', 'h_rider_withdraw_get'],
        ['GET', '#^/admin/rider-withdrawals$#', 'h_admin_rider_withdrawals'],
        ['GET', '#^/admin/rider-withdrawals/([0-9]+)$#', 'h_admin_rider_withdrawal_get'],
        ['POST', '#^/admin/rider-withdrawals/([0-9]+)/action$#', 'h_admin_rider_withdrawal_action'],
        ['GET', '#^/admin/riders/([0-9]+)/earnings$#', 'h_admin_rider_earnings'],
        // shareable links + previews
        ['GET', '#^/share/meta$#', 'h_share_meta'],
        ['GET', '#^/og/((?:sp|p)[0-9]+)$#i', 'h_og_image'],
        ['GET', '#^/site/manifest$#', 'h_site_manifest'],
        // product boost
        ['POST', '#^/ads/ev$#', 'h_ad_event'],
        ['GET', '#^/seller/ads$#', 'h_seller_ads'],
        ['POST', '#^/seller/ads$#', 'h_seller_ad_create'],
        ['GET', '#^/seller/ads/([0-9]+)$#', 'h_seller_ad_get'],
        ['POST', '#^/seller/ads/([0-9]+)/action$#', 'h_seller_ad_action'],
        ['GET', '#^/admin/ads$#', 'h_admin_ads'],
        ['POST', '#^/admin/ads/limit$#', 'h_admin_ad_limit'],
        ['POST', '#^/admin/ads/([0-9]+)/action$#', 'h_admin_ad_action'],
        ['GET', '#^/reviews/summary$#', 'h_reviews_summary'],
        ['GET', '#^/reviews/([A-Za-z0-9_.-]{1,40})$#', 'h_reviews_get'],
        ['POST', '#^/reviews/([A-Za-z0-9_.-]{1,40})$#', 'h_review_post'],
        ['GET', '#^/follows$#', 'h_follows_mine'],
        ['GET', '#^/follows/counts$#', 'h_follow_counts'],
        ['POST', '#^/follows/([A-Za-z0-9_-]{1,40})$#', 'h_follow_set'],
        ['PUT', '#^/seller/shop$#', 'h_seller_shop_update'],
        // fraud prevention, restrictions, appeals, user data
        ['GET', '#^/access/info$#', 'h_access_info'],
        ['POST', '#^/appeals$#', 'h_appeal_create'],
        ['GET', '#^/appeals/status$#', 'h_appeal_status'],
        ['POST', '#^/privacy/forget$#', 'h_privacy_forget'],
        ['GET', '#^/reco/recent$#', 'h_reco_recent'],
        ['POST', '#^/rider/reports/upload$#', 'h_rider_report_upload'],
        ['GET', '#^/rider/reports$#', 'h_rider_reports'],
        ['POST', '#^/rider/orders/([^/]+)/report$#', 'h_rider_report_create'],
        ['GET', '#^/admin/fraud/summary$#', 'h_admin_fraud_summary'],
        ['GET', '#^/admin/fraud/settings$#', 'h_admin_fraud_settings_get'],
        ['PUT', '#^/admin/fraud/settings$#', 'h_admin_fraud_settings_put'],
        ['GET', '#^/admin/fraud/reports$#', 'h_admin_fraud_reports'],
        ['GET', '#^/admin/fraud/reports/([0-9]+)$#', 'h_admin_fraud_report_get'],
        ['POST', '#^/admin/fraud/reports/([0-9]+)/decide$#', 'h_admin_fraud_report_decide'],
        ['GET', '#^/admin/fraud/file$#', 'h_admin_fraud_file'],
        ['GET', '#^/admin/fraud/blocks$#', 'h_admin_fraud_blocks'],
        ['POST', '#^/admin/fraud/blocks$#', 'h_admin_fraud_block_create'],
        ['POST', '#^/admin/fraud/blocks/([0-9]+)/lift$#', 'h_admin_fraud_block_lift'],
        ['GET', '#^/admin/fraud/appeals$#', 'h_admin_fraud_appeals'],
        ['POST', '#^/admin/fraud/appeals/([0-9]+)/decide$#', 'h_admin_fraud_appeal_decide'],
        ['GET', '#^/admin/fraud/audit$#', 'h_admin_fraud_audit'],
        ['GET', '#^/admin/udata/summary$#', 'h_admin_udata_summary'],
        ['GET', '#^/admin/udata/visitors$#', 'h_admin_udata_visitors'],
        ['GET', '#^/admin/udata/visitors/([A-Za-z0-9]{8,40})$#', 'h_admin_udata_visitor'],
        ['DELETE', '#^/admin/udata/visitors/([A-Za-z0-9]{8,40})$#', 'h_admin_udata_delete_visitor'],
        ['GET', '#^/admin/udata/users$#', 'h_admin_udata_users'],
        ['GET', '#^/admin/udata/users/([^/]+)$#', 'h_admin_udata_user'],
        ['DELETE', '#^/admin/udata/users/([^/]+)/activity$#', 'h_admin_udata_erase_user'],
        ['POST', '#^/admin/udata/purge$#', 'h_admin_udata_purge'],
    ];
    $allow = [];
    foreach ($routes as $r) {
        if (preg_match($r[1], $path, $m)) {
            if ($r[0] !== $method) { $allow[] = $r[0]; continue; }
            array_shift($m);
            call_user_func_array($r[2], $m);
            exit;
        }
    }
    if ($allow) { header('Allow: ' . implode(', ', $allow)); json_error(405, 'Method not allowed'); }
    json_error(404, 'Not found');
} catch (ApiError $e) {
    json_error($e->status, $e->getMessage(), $e->field, $e->errCode, $e->extra);
} catch (Throwable $e) {
    error_log('NurBuy API error: ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    $msg = 'Server error';
    if ($e instanceof RuntimeException && strpos($e->getMessage(), 'config') !== false) $msg = 'Server is not configured';
    json_error(500, $msg);
}
