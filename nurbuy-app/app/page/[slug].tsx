import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { SITE_BASE } from '@/config';
import type { StringKey } from '@/i18n/en';
import { useCatalog } from '@/store/catalog';
import { useI18n, useT } from '@/store/i18n';
import { colors } from '@/theme';

type Slug = 'about' | 'privacy' | 'return' | 'shipping';
const TITLES: Record<Slug, StringKey> = { about: 'pgAbout', privacy: 'pgPrivacy', return: 'pgReturn', shipping: 'pgShipping' };
const isSlug = (v: unknown): v is Slug => v === 'about' || v === 'privacy' || v === 'return' || v === 'shipping';

/** Removes scripts, frames and inline event handlers from the admin's page HTML before showing it. */
function clean(html: string): string {
  return html
    .replace(/<(script|iframe|object|embed)[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|iframe|object|embed)[^>]*\/?>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
}

/** About / Privacy / Return / Shipping: the same text the admin saved for /page/{slug} on the website. */
export default function PageScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const pol = useCatalog((s) => s.catalog?.settings.pol);
  const loaded = useRef(false);
  const key: Slug = isSlug(slug) ? slug : 'about';
  const p = pol?.[key];
  const body = p ? (lang === 'bn' ? p.bn || p.en : p.en || p.bn) : '';
  const font = lang === 'bn' ? "'Noto Sans Bengali'" : "'Hind'";
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Hind:wght@400;600;700&family=Noto+Sans+Bengali:wght@400&display=swap" rel="stylesheet">
<style>body{margin:0;padding:16px 16px 40px;font-family:${font},sans-serif;color:#151a2d;font-size:16px;line-height:1.65;background:#fff;word-wrap:break-word}
img{max-width:100%;height:auto;border-radius:10px}h1,h2,h3{line-height:1.3;color:#151a2d}a{color:#1d2fe0}table{width:100%;border-collapse:collapse}td,th{border:1px solid #e3e7f2;padding:6px}
.pi-c{display:block;margin:0 auto}</style></head><body>${clean(body)}</body></html>`;

  return (
    <View style={styles.page}>
      <TopBar title={t(TITLES[key])} />
      {body ? (
        <WebView
          source={{ html, baseUrl: SITE_BASE }}
          originWhitelist={['*']}
          javaScriptEnabled={false}
          style={styles.web}
          onLoadEnd={() => (loaded.current = true)}
          onShouldStartLoadWithRequest={(r) => {
            // the page itself loads once; any tapped link afterwards opens in the phone's browser
            if (!loaded.current || !r.isTopFrame) return true;
            if (/^(https?|mailto|tel):/.test(r.url)) void Linking.openURL(r.url);
            return false;
          }}
        />
      ) : (
        <Txt size={15} color={colors.grey} style={styles.empty}>{t('pageEmpty')}</Txt>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.white },
  web: { flex: 1 },
  empty: { textAlign: 'center', padding: 32 },
});
