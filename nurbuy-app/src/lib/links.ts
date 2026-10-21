import { router } from 'expo-router';
import { Linking } from 'react-native';

import { SITE_BASE } from '@/config';

import type { CatalogIndex } from './products';

/** Plain website paths and the app screen each one opens. */
const SIMPLE: Record<string, () => void> = {
  '': () => router.navigate('/'),
  '/': () => router.navigate('/'),
  '/orders': () => router.navigate('/orders'),
  '/wallet': () => router.navigate('/wallet'),
  '/cart': () => router.navigate('/cart'),
  '/chat': () => router.push('/chat'),
  '/wishlist': () => router.push('/wishlist'),
  '/notifications': () => router.push('/notifications'),
};

/**
 * Opens a website-style link inside the app: notification links (/orders/NBM-1, /wallet, /chat), banner links
 * (#p=SP2, /p/name-sp2, /c/slug, /shop/name-sl1, #hot, /best ...) and outside addresses in the phone's browser.
 * Returns false when nothing could be opened.
 */
export function openAppLink(raw: string, idx: CatalogIndex | null): boolean {
  let v = raw.trim();
  if (v.startsWith(SITE_BASE)) v = v.slice(SITE_BASE.length) || '/';
  if (v.startsWith('/#/')) v = v.slice(2);

  const om = /^\/orders?\/([^/?#]+)/.exec(v);
  if (om?.[1]) {
    router.push({ pathname: '/order/[id]', params: { id: decodeURIComponent(om[1]) } });
    return true;
  }
  const simple = SIMPLE[v];
  if (simple) {
    simple();
    return true;
  }

  const pm = /^#p=(.+)$/.exec(v) ?? /^\/p\/(?:.*-)?((?:sp|p)\d+)$/i.exec(v);
  if (pm?.[1]) {
    const id = decodeURIComponent(pm[1]).toUpperCase();
    if (!idx?.byId.has(id)) return false;
    router.push({ pathname: '/product/[id]', params: { id } });
    return true;
  }
  const sm = /^\/shop\/(?:.*-)?(sl\d+)$/i.exec(v);
  if (sm?.[1]) {
    router.push({ pathname: '/shop/[id]', params: { id: sm[1].toUpperCase() } });
    return true;
  }
  const cm = /^\/c\/(.+)$/.exec(v);
  if (cm?.[1]) {
    const slug = cm[1].split('/').filter(Boolean).at(-1);
    const cat = idx ? [...idx.catById.values()].find((c) => c.slug === slug) : undefined;
    if (!cat) return false;
    router.push({ pathname: '/products', params: { src: 'cat', cid: String(cat.id) } });
    return true;
  }
  const lm = /^[#/](hot|best|new|all)$/.exec(v);
  if (lm?.[1]) {
    router.push({ pathname: '/products', params: { src: lm[1] } });
    return true;
  }
  if (/^(https?:|mailto:|tel:)/i.test(v)) {
    void Linking.openURL(v);
    return true;
  }
  return false;
}
