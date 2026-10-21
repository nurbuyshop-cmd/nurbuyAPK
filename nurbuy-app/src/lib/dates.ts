import { digits, type Lang } from '@/store/i18n';

const MONTHS: Record<Lang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  bn: ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'],
};

/** "14 Oct 2026" in Bangladesh time, with Bangla month names and numerals in Bangla. */
export function shortDate(ms: number, lang: Lang): string {
  const d = new Date(ms + 6 * 3600 * 1000);
  return digits(`${d.getUTCDate()} `, lang) + MONTHS[lang][d.getUTCMonth()] + digits(` ${d.getUTCFullYear()}`, lang);
}
