import { digits, type Lang } from '@/store/i18n';

/** "৳ 300" or "৳ 299.50", with Bangla numerals in Bangla. */
export function money(n: number, lang: Lang): string {
  const v = Math.round(n * 100) / 100;
  const s = v % 1 ? v.toFixed(2) : String(v);
  return '৳ ' + digits(s, lang);
}

/** Price as the product cards show it: always two decimals ("৳ 300.00"). */
export function money2(n: number, lang: Lang): string {
  return '৳ ' + digits((Math.round(n * 100) / 100).toFixed(2), lang);
}

/** Whole percent saved, 0 when there is no discount. */
export function discountPct(price: number, old: number): number {
  return old > price && old > 0 ? Math.round(((old - price) * 100) / old) : 0;
}
