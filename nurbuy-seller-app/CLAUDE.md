# NurBuy seller app

Android app for sellers, mirroring seller.nurbuy.com. Name "NurBuy Seller", package `com.nurbuy.seller`, scheme
`nurbuyseller`, slug `nurbuy-seller` (EAS project not created yet: the first `eas build` / `eas init` creates
`@nurbuy/nurbuy-seller` and writes `extra.eas.projectId` into app.json). Expo SDK 57, React Native 0.86, expo-router.
Same toolchain and lessons as the customer app: `../nurbuy-app/CLAUDE.md`. Workspace facts: `../CLAUDE.md`.

Source of truth: the seller website `../NurBuy-Minutes-Upload/_extracted/4_SELLER_seller.nurbuy.com/index.html`
(one file, all JS inside; functions scrXxx = pages, ACT.xxx = buttons, FORM.xxx = forms) and the API
`../NurBuy-Minutes-Upload/_extracted/1_API_apin.nurbuy.com/lib/handlers_seller.php` (+ handlers_wallet.php, handlers_ads.php).
All seller endpoints are `/seller/*`, login token from `POST /seller/login` (role `seller`).

## Layout

- `app/` routes. `_layout.tsx` = boot, fonts, `Gate` (logged out -> /login or /apply; not approved -> /status;
  approved -> /home), 20-second polling (`POLL_MS`), bottom `TabBar`, `NewOrderAlert`, `OfflineBar`, `Toast`.
  `(tabs)/` home, products, orders, wallet, profile. Other pages: login, apply (3 steps + document uploads), status,
  order/[id], notifications.
- `src/api/api.ts` (fetch for JSON, XMLHttpRequest for multipart uploads with progress, `fetchPrivateFile` for documents),
  `src/api/seller.ts` (types + calls), `src/store/` (auth, dash = dashboard numbers + new-order detection, i18n, toast),
  `src/lib/` (format, errors, files = camera/gallery/PDF + JPEG shrink, useLoad, links, sound), `src/components/`,
  `src/i18n/en.ts` + `bn.ts` (every text in both; Bangla is the default language like the website).

## Plan (stop after each step for the user to test)

1. DONE 2026-10-20: setup, login, apply (3 steps, NID/license upload with progress, retry), status gate (pending /
   rejected + re-apply / suspended, edit application, view/replace documents, NurBuy messages), home dashboard,
   orders list + filters, order detail (confirm / pack / reject with reason), notifications, profile (cover + logo,
   edit, documents, password, language, logout), new-order chime + orange alert while the app is open.
   Products and Wallet tabs show a "coming soon" card with a link to the website.
2. DONE 2026-10-20: Products tab (filters, search, stock / variant stock sheets, hide / show, delete) and
   `app/product/[id].tsx` (id "new" or number): photos (1-5, multi-pick, upload progress, make main), name / bn /
   product ID, category tree from `/seller/meta` (any depth), simple / variable, track stock, price, max per order,
   descriptions, tags, specs, variants (attributes + options + colours, Generate with confirm, per-variant fields,
   filters / sort / select, bulk edit, SKU maker, variant photos), quick variant stock for live products.
   Form state: `src/store/pform.ts`; actions `src/lib/variants.ts`; checks + request body `src/lib/productForm.ts`;
   parts `src/components/pf/`. Boost button on product cards comes with step 4.
3. DONE 2026-10-20: Wallet tab (balance, totals, earnings / withdrawals / by product, earning sheet),
   `app/withdraw.tsx` (amount -> bKash / bank -> details -> confirm; last payout details pre-filled),
   `app/wd/[id].tsx` (progress + invoice), `app/txns.tsx` (statement, sales invoices, withdrawal invoices),
   `app/sinv/[id].tsx`, `app/coupons.tsx` (list, create / edit with `DateField` calendar, copy, delete).
   Store `src/store/wallet.ts`; API `src/api/wallet.ts`. Invoices are shared as text with the phone's Share sheet
   (the website prints; no PDF in the app yet). Profile menu links Transactions and Coupons.
4. DONE 2026-10-20: `app/shop.tsx` (opening hours per day with a TimeSheet picker, map pin via `ShopMap`
   WebView: Google Maps with the /public/maps key and baseUrl seller.nurbuy.com, falls back to OpenStreetMap
   (Leaflet) like the website; first map position is never reported; GPS via expo-location; address; owner photo
   kind "photo"), `app/boost/index.tsx` + `app/boost/[id].tsx` (account box, campaigns with pause / resume / stop,
   charge ledger), Boost button on live product cards (`BoostSheet`, reads rates from /seller/ads first).
   Profile menu: Product Boost, Hours & location.
5. DONE (code) 2026-10-20: add-on v2 `../server/app-ext-addon/app-ext-v2-seller-push.zip` adds POST/DELETE
   `/seller/device` (tokens saved in device_tokens as "seller:<id>") and sends `seller_notif` rows via FCM (kv cursor
   `appext_snotif`). App: `src/lib/push.ts` (channel "default" with sound new_order.wav, MAX importance),
   registered after login in `app/_layout.tsx`, taps open `openPanelLink`, logout unregisters.
   `app.config.js` adds `google-services.json` only when the file exists. Waiting for the user: upload add-on v2
   (check `POST /seller/device` -> 401) and add Android app `com.nurbuy.seller` in Firebase project nurbuy-d93f2,
   put its google-services.json in this folder, then rebuild. Push never works in Expo Go.
   EAS project `@nurbuy/nurbuy-seller` (id dff405d5-...), first preview build 8d1a420e (without Firebase).
6. Polish + EAS preview APK.

## Decisions (keep)

- Look follows the seller website: light grey page (#f1f4fa) with white cards; bottom bar labels in English like
  the customer app; status bar hidden.
- Uploads: images are shrunk to JPEG on the phone (documents/products 1600 px, cover 2000 px, logo 512 px square)
  and sent as multipart files (the host WAF blocks `data:image` in bodies). Documents may also be PDF (max 4 MB).
- A PDF document cannot be previewed in the app (a note is shown); images open in a sheet.

## Checks before a build

`npx.cmd tsc --noEmit` and `npx.cmd expo lint` (both clean), `npx.cmd expo export --platform android --output-dir
$env:TEMP\nbs-export-check`. Typed routes (`.expo/types`) are only written while `npx expo start` runs.
Quick phone preview: `npx.cmd expo start --lan` + Expo Go.
