import { Share } from 'react-native';

import type { Product } from '@/api/catalog';
import { SITE_BASE } from '@/config';
import { translate, type Lang } from '@/store/i18n';

import { money } from './money';
import { productName } from './products';

/** Same slug rule as the website, so shared links open the product there too. */
function slug(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}

export function productUrl(p: Product): string {
  return `${SITE_BASE}/p/${slug(p.n) || 'product'}-${p.id.toLowerCase()}`;
}

/** Opens the phone's share sheet with the website's share text and product link. */
export async function shareProduct(p: Product, lang: Lang, siteName: string): Promise<void> {
  const about = (lang === 'bn' ? p.aboutBn || p.about : p.about || p.aboutBn).replace(/\s+/g, ' ').trim();
  const short = about.length > 110 ? about.slice(0, 107) + '...' : about;
  const url = productUrl(p);
  const text = `${productName(p, lang)} — ${money(p.pr, lang)}${short ? '\n' + short : ''}\n${siteName} Minutes: ${translate('shareTail', lang)}`;
  try {
    await Share.share({ message: `${text}\n${url}`, url, title: productName(p, lang) });
  } catch {
    // the customer closed the share sheet
  }
}
