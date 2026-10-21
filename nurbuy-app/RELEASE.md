# NurBuy অ্যাপ: রিলিজ চেকলিস্ট

## ১. সার্ভারে push ও কভার ছবি (একবার করা হয়ে গেছে, ২০২৬-১০-২০)

ব্যবস্থা: `New Updete 21/server/app-ext-addon/` (নির্দেশনা ওখানের README.txt-এ)।

- সার্ভারে `apin.nurbuy.com/app-ext/` ফোল্ডার (app-ext.php, .htaccess, firebase-service-account.json)।
- `config.php`-এর দ্বিতীয় লাইন এটা চালু করে।
- API প্যাকেজ আপডেট করলেও এগুলো মোছে না। শুধু `app-ext` ফোল্ডার আর `config.php` কখনো মুছবেন না।
- যাচাই: `POST https://apin.nurbuy.com/me/device` লগইন ছাড়া পাঠালে 401 আসবে (404 বা 500 নয়)।

পুরোনো প্যাচগুলো (`server/old-patches/`) আর লাগবে না, শুধু ইতিহাসের জন্য রাখা।

## ২. টেস্টের জন্য APK বানানো (EAS, Expo-র ক্লাউড)

একবার: https://expo.dev এ ফ্রি অ্যাকাউন্ট খুলুন।

VS Code টার্মিনালে, `nurbuy-app` ফোল্ডারে:

```powershell
npx eas-cli@latest login
npx eas-cli@latest init
$env:EAS_NO_VCS = "1"
npx eas-cli@latest build -p android --profile preview
```

- `init` অ্যাপটাকে আপনার Expo অ্যাকাউন্টে যুক্ত করে (`app.json`-এ একটা projectId বসে)।
- `EAS_NO_VCS=1`: এই কম্পিউটারে git নেই, তাই git ছাড়াই বিল্ড।
- প্রথমবার Android keystore জিজ্ঞেস করলে **Yes / Generate new keystore** দিন। Expo সেটা নিরাপদে রাখে; হারাবেন না।
- ১৫–২৫ মিনিট পরে একটা লিংক আসবে; ফোনে খুলে APK ইনস্টল করুন।

## ৩. APK-তে যা যা টেস্ট করবেন

- লগইন, এলাকা/ম্যাপ পিন, কার্ট, অর্ডার, অর্ডার ট্র্যাকিং, চ্যাট (লেখা, ছবি, ভয়েস)।
- **Push:** লগইন করে নোটিফিকেশনের অনুমতি দিন → অ্যাডমিন থেকে অর্ডারের স্ট্যাটাস বদলান → ফোনে নোটিফিকেশন আসবে → চাপলে সেই অর্ডার খুলবে।
- অ্যাপ বন্ধ অবস্থায় নোটিফিকেশনে চাপলেও অর্ডার খোলে কি না।

## ৪. Play Store-এর জন্য AAB

```powershell
$env:EAS_NO_VCS = "1"
npx eas-cli@latest build -p android --profile production
```

## ৫. Google Play Console

1. Developer account (এককালীন ২৫ ডলার): https://play.google.com/console
2. **Create app**: নাম `NurBuy`, ভাষা বাংলা/English, App, Free।
3. **Store listing**:
   - Short description (৮০ অক্ষর) ও Full description।
   - App icon 512×512 (`assets/icon.png` থেকে), Feature graphic 1024×500।
   - ফোনের অন্তত ২টা স্ক্রিনশট।
4. **Privacy policy URL**: `https://minutes.nurbuy.com/page/privacy` (অ্যাডমিনে লেখাটা আপডেট রাখুন)।
5. **App access**: লগইন লাগে বলে Google-এর রিভিউয়ের জন্য একটা টেস্ট অ্যাকাউন্টের মোবাইল/পাসওয়ার্ড দিন।
6. **Ads**: Sponsored পণ্য দেখায়, তাই "Yes, contains ads" দেওয়াই নিরাপদ।
7. **Data safety** (অ্যাপ যা সংগ্রহ করে):
   - নাম, মোবাইল, ইমেইল, ঠিকানা (অর্ডার ও অ্যাকাউন্ট)।
   - সঠিক লোকেশন (ডেলিভারির পিন ও অর্ডার চলাকালীন লাইভ লোকেশন, শুধু অ্যাপ খোলা থাকলে)।
   - ছবি ও অডিও (শুধু সাপোর্ট চ্যাটে গ্রাহক নিজে পাঠালে)।
   - অ্যাপ অ্যাক্টিভিটি (দেখা পণ্য, শুধু সম্মতি দিলে)।
   - Device ID (push টোকেন)।
   - সব ডেটা এনক্রিপ্টেড (HTTPS) পথে যায়; গ্রাহক প্রোফাইল থেকে অ্যাক্টিভিটি মুছতে পারেন।
8. **Content rating** প্রশ্নোত্তর পূরণ, **Target audience** ১৮+ (কেনাকাটা ও পেমেন্ট)।
9. **Testing → Internal testing** এ প্রথমে AAB আপলোড করে নিজেরা টেস্ট করুন, তারপর Production।

Google Play নিজে অ্যাপ সাইন করে (Play App Signing); EAS-এর keystore হলো upload key।
