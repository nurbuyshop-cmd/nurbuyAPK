NurBuy app server add-on (push notifications + cover photo)
============================================================

The API upload package replaces index.php and lib/ every time, which removed the
app's push notifications and cover upload. This add-on lives outside those files,
so API updates no longer remove it.

Install once (cPanel File Manager, folder apin.nurbuy.com):

1. Upload app-ext.zip into apin.nurbuy.com and Extract it.
   You get the folder apin.nurbuy.com/app-ext/ (app-ext.php and .htaccess inside).

2. Open apin.nurbuy.com/config.php with Edit. Directly under the first line "<?php"
   add this one line, then Save:

   if (defined('NB') && is_file(__DIR__ . '/app-ext/app-ext.php')) require_once __DIR__ . '/app-ext/app-ext.php';

Later API updates: upload the API package as usual. Do NOT delete the app-ext folder
or config.php. Nothing else is needed.

Version 2 (2026-10-20, app-ext-v2-seller-push.zip): adds POST/DELETE /seller/device and phone push for
seller notifications (seller_notif) for the seller app. Update = upload the zip into apin.nurbuy.com and
Extract, replacing app-ext/app-ext.php (the Firebase JSON in app-ext/ stays). config.php needs no change.
Check: POST /seller/device without login -> 401 (404 means the new file is not in place).

If the API itself one day contains push/cover, the add-on switches that part off by itself.
To remove the add-on: delete the line from config.php (and the app-ext folder).
