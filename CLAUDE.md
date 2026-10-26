# NurBuy workspace

The owner is not a developer and reads only Bangla: always reply in Bangla (code and code comments stay in English).
Explain steps for cPanel / phone in simple words. Never upload, publish or change the live server yourself; give the
user a file plus exact steps, then verify with `curl.exe` against the live API.

## Folders

| Folder | What it is |
|---|---|
| `nurbuy-app/` | Customer Android app (Expo / React Native). Its own `CLAUDE.md` has the details. |
| `nurbuy-seller-app/` | Seller Android app (Expo / React Native), started 2026-10-20. Its own `CLAUDE.md` has the plan. |
| `nurbuy-rider-app/` | Rider app (not started yet). |
| `NurBuy-Minutes-Upload/` | The user's own deploy zips of the whole system: `1_API` (apin.nurbuy.com), `2_WEBSITE` (minutes.nurbuy.com, customer site), `3_ADMIN`, `4_SELLER` (seller.nurbuy.com), `5_RIDER` (rider.nurbuy.com). Extracted copies in `_extracted/`. These are the source of truth for API shapes and website behaviour; there are no other docs. The user may replace these zips with newer versions. |
| `server/app-ext-addon/` | Live server add-on (push notifications via FCM, `/me/device`, `/me/cover`). Installed on 2026-10-20. v2 adds `/seller/device`, v3 (2026-10-21, `app-ext-v3-rider-push.zip`) adds `/rider/device` + rider push; v3 contains everything. |
| `server/old-patches/` | Superseded API patches, kept for history only. Do not upload. |
| `reference/` | Images (app icon source `images/006.png`), reference videos, an old copy of live API assets. |

Each app is worked on in its own chat; start by reading that app's `CLAUDE.md`.

## Backend facts every app needs

- API: `https://apin.nurbuy.com` (PHP + MySQL, cPanel host). Route table in `index.php`, handlers in `lib/handlers_*.php`
  (see `NurBuy-Minutes-Upload/_extracted/1_API_apin.nurbuy.com/`). Auth: `Authorization: Bearer <token>` from `/auth/login`;
  sessions have a role (`user`, `seller`, `rider`, `admin`).
- The user deploys new API packages that REPLACE `index.php` and `lib/`. Never patch those files for the apps: put server
  additions in `apin.nurbuy.com/app-ext/app-ext.php` (started from `config.php`, which is not in the package).
  After any API update check `POST /me/device` without login -> 401 (404/500 means the add-on is not running).
  Send it with `-H "Content-Type: application/json"` and a small JSON body; a bare POST can give a false 404.
- Host security filter (WAF): any request body containing `data:image` is rejected (PHP sees 405). Upload images as
  multipart files. Test uploads with `curl.exe`, not .NET HttpClient.
- Push: Firebase project `nurbuy-d93f2`; service-account JSON on the server at `app-ext/firebase-service-account.json`
  (config key `fcm_service_account`). The add-on sends FCM for every new `user_notif` row. Sellers/riders have
  `seller_notif` / `rider_notif` tables (same `notify()` function) - extend the add-on for their apps, do not edit lib/.
- Delivery: zones mode is active (map polygons, `/public/zones`, `/public/zones/check`); zones carry district/thana/village names.

## Tooling (Windows, PowerShell 5.1, folder inside OneDrive)

- Use `npx.cmd` (PowerShell blocks `npx.ps1`). git is not installed: EAS needs `$env:EAS_NO_VCS="1"`.
- EAS account `nurbuy`. Android test build:
  `$env:EAS_NO_VCS="1"; npx.cmd eas-cli@latest build -p android --profile preview --non-interactive --no-wait`,
  then poll `npx.cmd eas-cli@latest build:view <id>`; give the user the build page link.
- npm installs are slow (10-15 min) because of OneDrive. Zips for cPanel must be made with .NET `ZipFile` and `/` paths
  (PowerShell 5.1 `Compress-Archive` writes backslashes).
