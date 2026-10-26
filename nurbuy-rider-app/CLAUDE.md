# NurBuy rider app

Android app for delivery riders, mirroring rider.nurbuy.com. Name "NurBuy Rider", package `com.nurbuy.rider`, scheme
`nurbuyrider`, slug `nurbuy-rider` (EAS project `@nurbuy/nurbuy-rider` is created by the first `eas build`).
Built exactly like the seller app (`../nurbuy-seller-app/CLAUDE.md`: same Expo SDK 57 / RN 0.86 / expo-router setup,
folder layout, look, uploads, push, checks). Toolchain lessons: `../nurbuy-app/CLAUDE.md`. Workspace facts: `../CLAUDE.md`.

Source of truth: the rider website `../NurBuy-Minutes-Upload/_extracted/5_RIDER_rider.nurbuy.com/index.html`
(one file; scrXxx = pages, ACT.xxx = buttons, FORM.xxx = forms; map part between NBGM-RIDER markers) and the API
`../NurBuy-Minutes-Upload/_extracted/1_API_apin.nurbuy.com/lib/handlers_rider.php` + `handlers_rider_wd.php`
(routes in `index.php`). All rider endpoints are `/rider/*`, token from `POST /rider/login` (role `rider`).
`autoassign.php` is not in the current API package; assignment is server-side only, the app just sees assigned orders.

## Layout

- Started 2026-10-21 as a copy of the seller app (same deps + package-lock, seller-only files removed).
- `app/` routes. `_layout.tsx` = boot, fonts, `Gate` (logged out -> /login or /apply; not approved -> /status;
  approved -> /home), polling (`POLL_MS` 15 s approved = dashboard, `STATUS_POLL_MS` 20 s otherwise = /rider/me),
  bottom `TabBar` (Home, Orders, History, Alerts, Profile like the website), `NewOrderAlert` (pending count grew:
  chime + vibration + orange bar), `OfflineBar`, `Toast`. `(tabs)/` home, orders, history, notifications, profile.
  Other pages: login, apply, status.
- `src/api/rider.ts` (types + calls), `src/store/` (auth, dash, photo = the rider's private photo as data URL via
  `/rider/file?kind=photo`, i18n, toast), `src/lib/labels.ts` (vehicle / document / pending-change labels),
  `src/components/VehiclePicker.tsx`, `EditRiderSheet.tsx` (sends only changed fields, like the website), `DocRows.tsx`.
- Uploads: `/rider/upload` kinds photo (square 1200 px, no PDF), nid_front, nid_back, license (1600 px or PDF <= 4 MB).

## Plan (stop after each step for the user to test)

1. DONE (code) 2026-10-21, checks clean, waiting for the user's phone test. Setup, login, apply (3 steps: personal / vehicle cycle-bike-car + emergency contact / documents photo, NID front+back,
   license unless cycle; upload progress, retry, "upload later"), status gate (pending / rejected + re-apply / suspended,
   edit application, replace documents, NurBuy messages, auto-refresh), profile (photo, my details, edit with
   admin-approval banner for mobile/email/vehicle, documents, password, language, logout), notifications tab.
   Home / Orders / History show a placeholder until step 2-3.
2. DONE (code) 2026-10-21, checks clean, waiting for the phone test. `(tabs)/home.tsx`, `(tabs)/orders.tsx` (tab in
   the address: `?tab=pending|active`), `app/order/[id].tsx` (own action bar, no bottom bar; reloads every 7 s while
   unfinished and on each dashboard tick unless a sheet is open), `src/components/OrderParts.tsx` (RChip, Countdown,
   PayBadge, ItemRow, PickupStop, OrderCard, NavButton, CallLink), `OrderSheets.tsx` (reject, OTP, fail, delay,
   report with photos), `OrderMap.tsx` (WebView, Google key from /public/maps with baseUrl rider.nurbuy.com, Leaflet
   fallback, markers updated via `nbUpdate`). `app/cash.tsx` and `app/earnings.tsx` are placeholders for step 3.
   Home (online/offline switch, pending strip, active delivery card with live countdown, cash today, earnings today/month,
   stats), Orders tab (Pending / Active), order detail (customer call, pickups incl. multi-shop with seller call, map +
   Navigate via Google Maps, customer live location every 7 s, items, totals, COD amount, progress stepper; accept /
   reject, next step buttons, OTP delivery with 4 boxes + "Delivered" screen, fail with reason, ask extra time,
   report customer with up to 3 photos), 15-second polling, new-order chime + vibration while the app is open.
3. DONE (code) 2026-10-21, checks clean, waiting for the phone test. `(tabs)/history.tsx`, `app/cash.tsx`,
   `app/earnings.tsx`, `app/withdraw.tsx` (copied from the seller app), `app/wd/[id].tsx` (website scrWd: no invoice),
   `src/store/wallet.ts`, `src/components/WalletParts.tsx` (Filters chips, WdChip, WdCard, StepHeader, usePayLine).
   Profile menu links Earnings and Cash collected.
   History (today / yesterday / week / month / custom dates; all / completed / cancelled / failed), Cash collected
   (ranges, day by day, orders), Earnings (balance, tiles, withdrawals, payments) + Withdraw (amount -> bKash / bank ->
   details -> confirm, last payout pre-filled) + withdrawal detail.
4. DONE (code) 2026-10-21: `../server/app-ext-addon/app-ext-v3-rider-push.zip` (seller + rider senders share
   `appext_send_new_role`; rider cursor kv `appext_rnotif`, tokens "rider:<id>"). App: `src/lib/push.ts` uses
   `/rider/device`, `pushPermission()`; `src/components/PushBanner.tsx` on Home and Alerts (website pushBanner).
   Live 2026-10-21: v1 is installed (POST /me/device with a JSON body -> 401; customer push works), v2 was never
   uploaded (/seller/device 404). Check with a JSON body and Content-Type: a bare POST without body gave a false 404.
   v3 uploaded and verified live 2026-10-21 (all three device routes 401). Still waiting for the user: add Android apps com.nurbuy.rider (and
   com.nurbuy.seller) in Firebase nurbuy-d93f2 and send google-services.json (goes in this folder; app.config.js
   picks it up). Push never works in Expo Go.
   Push: add-on v3 (POST/DELETE `/rider/device`, tokens "rider:<id>", FCM for `rider_notif` rows) in
   `../server/app-ext-addon/`; Firebase Android app `com.nurbuy.rider` + google-services.json; loud "new order" channel;
   tap opens the right page.
5. EAS project `@nurbuy/nurbuy-rider` (id 0119badd-0abb-41c7-a38d-017a4461197f) created 2026-10-21;
   google-services.json in this folder. Polish done 2026-10-21: removed expo-location + expo-clipboard (unused; no
   location permission), map gestures 'cooperative' (one finger scrolls the page), History / Cash / Earnings reload
   on reopen (`src/lib/useRefocus.ts`), Alerts tab reloads when the unread count grows. Build d7b726dc cancelled;
   preview build 7074ab01 (with Firebase + polish) started 2026-10-21.
