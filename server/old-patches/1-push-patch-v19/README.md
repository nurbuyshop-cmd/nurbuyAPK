# Phone push for the NurBuy customer app (API change, schema v19)

Status: **proposed, not uploaded**. Review `PATCH.diff` first. The files in `api/` are the patched copies; the
originals in `NurBuy-Minutes-Upload` are unchanged.

## What changes

| File | Change |
|---|---|
| `lib/db.php` | `SCHEMA_VERSION` 18 -> 19 (the new table is created on the first request after upload) |
| `lib/schema.php` | new table `device_tokens(id, user_id, token, token_hash UNIQUE, platform, created_at, updated_at)` |
| `index.php` | `POST /me/device` and `DELETE /me/device` |
| `lib/notify.php` | the two endpoints, FCM HTTP v1 sender, and a hook in `push_enqueue()` so every `notify('user', ...)` also reaches the customer's phones |
| `lib/handlers_chat.php` | optional: a support reply now creates a customer notification ("NurBuy সাপোর্ট থেকে নতুন বার্তা", link `/chat`). Before this, chat replies did not notify at all |

The token is stored in full; uniqueness uses `token_hash` (SHA-256) because FCM tokens are longer than a MySQL unique index allows comfortably.

## Firebase set-up (one time)

1. Create a Firebase project (free), add an **Android app** with package `com.nurbuy.minutes`.
2. Download `google-services.json` and give it to the app build (it goes in `nurbuy-app/`, and `app.json` gets `"android": { "googleServicesFile": "./google-services.json" }`).
3. Project settings > Service accounts > **Generate new private key**. Upload the JSON to the hosting **outside public_html**, e.g. `/home/USER/private/firebase-service-account.json`.
4. In the API `config.php` add: `'fcm_service_account' => '/home/USER/private/firebase-service-account.json',`
5. Upload the five files of `api/` over the API folder (same paths).

Without step 4 nothing changes for the website; the app simply does not get phone pushes.

## Checks after upload

- `https://apin.nurbuy.com/health` answers `{"ok":true,...}`.
- Log in on the app (development or EAS build, not Expo Go), allow notifications; a row appears in `device_tokens`.
- Change an order status in admin: the phone shows the notification; tapping it opens that order.
