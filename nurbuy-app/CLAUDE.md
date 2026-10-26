# NurBuy customer app

Android app for customers of minutes.nurbuy.com. Name "NurBuy", package `com.nurbuy.minutes`, scheme `nurbuy`,
EAS project `@nurbuy/nurbuy-minutes`. Expo SDK 57, React Native 0.86, expo-router. See also `AGENTS.md` (Expo rules)
and `RELEASE.md` (build / Play Store checklist, in Bangla). Workspace-wide facts: `../CLAUDE.md`.

## Layout

- `app/` routes (expo-router; not `src/app`). `app/_layout.tsx` = boot, overlays, global bottom bar (`NavBar`), push setup.
  `app/(tabs)/` home, category, cart, orders, profile. Other screens: product/[id], shop/[id], location, checkout, chat, search...
- `src/api/` server calls (`api.ts`: JSON via fetch, FormData via XMLHttpRequest), `src/store/` zustand stores,
  `src/lib/` helpers, `src/components/`, `src/i18n/en.ts` + `bn.ts` (every UI string in both).
- `modules/nurbuy-vision/` local Kotlin module (ML Kit, on-device photo search); hidden in Expo Go.
- `scripts/sync-bs-renderer.js` regenerates `src/lib/bsRenderer.ts` from the website's Banner Studio renderer.

## Decisions the user asked for (keep them)

- Bottom nav labels always English; Bangla UI font Noto Sans Bengali, text without Bangla letters uses Hind (`Txt`).
- White background everywhere. Status bar shown with dark icons (was hidden 2026-10 because of blinking; user asked to show it again on 2026-10-26).
- Auto-sliding only for shops row, sponsored row and the product photo gallery; product rows move by finger only.
- Sliders and rows must use the phone's native scrolling (`AutoSlider` = ScrollView + snap, `ProductRow` = FlatList);
  never drive finger drags from JavaScript (PanResponder) - it stuttered on cheap phones.
- Addresses (profile) open the same `/location` page (`?mode=addr&i=`); the map zone fills District/Thana/Village;
  no landmark field; address line optional.
- Intro video built but switched off (`components/IntroVideo.tsx`). Lite mode is automatic only (no switch).
- Deferred by the user, do not start unasked: OTP / forgot password, bKash payment, Play Store publishing.

## Gotchas

- Expo SDK 57 global `fetch` (expo/fetch) rejects React Native FormData file parts -> uploads go through XMLHttpRequest.
- Never set expo-image-picker plugin option `microphonePermission: false` (it removes RECORD_AUDIO from the whole app).
- R8 minify is off on purpose (enabled it once; size 27 MB vs 38 MB was not worth the risk). APK is arm64 + armv7 only.
- Push does not load in Expo Go (`src/lib/push.ts` skips it); test push only with an EAS APK.
- Lint rules forbid reading refs during render and setState in effects: keep mutable slider/controller state in small
  classes held by `useState`, pass `useRef` objects only to `ref=`.

## Checks before a build

`npx.cmd tsc --noEmit` and `npx.cmd expo lint` (both must be clean). Quick phone preview: `npx.cmd expo start --lan`
(user's phone and laptop on the same Wi-Fi, Expo Go). A change reaches the installed app only through a new EAS build.
