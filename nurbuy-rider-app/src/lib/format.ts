import { digits, type Lang } from '@/store/i18n';

/** ৳1,234.5 with Bangla numerals in Bangla (same as the website's money()). */
export function money(x: number, lang: Lang): string {
  const v = Math.round((Number(x) || 0) * 100) / 100;
  const [a = '0', b] = String(v).split('.');
  const s = a.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (b ? `.${b}` : '');
  return `৳${digits(s, lang)}`;
}

export const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  bn: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
};

const pad2 = (x: number) => (x < 10 ? '0' : '') + x;

function clock(d: Date, lang: Lang): string {
  const h = d.getHours();
  const m = d.getMinutes();
  const h12 = h % 12 || 12;
  if (lang === 'bn') {
    const p = h < 4 ? 'রাত' : h < 6 ? 'ভোর' : h < 12 ? 'সকাল' : h < 15 ? 'দুপুর' : h < 18 ? 'বিকাল' : h < 20 ? 'সন্ধ্যা' : 'রাত';
    return `${p} ${digits(`${h12}:${pad2(m)}`, lang)}`;
  }
  return `${h12}:${pad2(m)} ${h < 12 ? 'AM' : 'PM'}`;
}

/** "Today, 3:05 PM" / "আজ, দুপুর ৩:০৫" (website fmtDT). */
export function dateTime(ms: number, lang: Lang): string {
  if (!ms) return '-';
  const d = new Date(ms);
  const now = new Date();
  const y = new Date(now.getTime() - 86400000);
  const day =
    d.toDateString() === now.toDateString()
      ? lang === 'bn' ? 'আজ' : 'Today'
      : d.toDateString() === y.toDateString()
        ? lang === 'bn' ? 'গতকাল' : 'Yesterday'
        : `${digits(d.getDate(), lang)} ${MONTHS[lang][d.getMonth()]}${d.getFullYear() !== now.getFullYear() ? ` ${digits(d.getFullYear(), lang)}` : ''}`;
  return `${day}, ${clock(d, lang)}`;
}

/** "5 Oct 2026" / "৫ অক্টোবর ২০২৬" (website fmtD). */
export function dateOnly(ms: number, lang: Lang): string {
  if (!ms) return '-';
  const d = new Date(ms);
  return `${digits(d.getDate(), lang)} ${MONTHS[lang][d.getMonth()]} ${digits(d.getFullYear(), lang)}`;
}

/** 12.5 -> "12.5%" with Bangla numerals in Bangla. */
export const pct = (x: number, lang: Lang) => `${digits(String(Math.round((Number(x) || 0) * 100) / 100), lang)}%`;

/** "*******1234" (account numbers in lists). */
export const maskAcc = (s: string) => (s.length <= 4 ? s : '*'.repeat(s.length - 4) + s.slice(-4));

/** "5 min ago" / "৫ মিনিট আগে" (website ago()). */
export function ago(ms: number, lang: Lang): string {
  const s = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  const bnl = lang === 'bn';
  if (s < 45) return bnl ? 'এইমাত্র' : 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60) return bnl ? `${digits(m, lang)} মিনিট আগে` : `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return bnl ? `${digits(h, lang)} ঘণ্টা আগে` : `${h} h ago`;
  const dd = Math.floor(h / 24);
  if (dd === 1) return bnl ? 'গতকাল' : 'Yesterday';
  if (dd < 7) return bnl ? `${digits(dd, lang)} দিন আগে` : `${dd} days ago`;
  return dateTime(ms, lang);
}

export function initials(s: string): string {
  const p = s.trim().split(/\s+/);
  const a = (p[0] ?? '?').charAt(0);
  const b = p.length > 1 ? (p[p.length - 1] ?? '').charAt(0) : '';
  return (a + b).toUpperCase();
}

/** NID shown with only the last 3 digits. */
export function maskNid(s: string): string {
  return s.length <= 3 ? s : '*'.repeat(s.length - 3) + s.slice(-3);
}

/** A typed number as plain ASCII: Bangla digits become 0-9, commas and spaces are dropped (website num()). */
export function numText(s: string | number | null | undefined): string {
  return String(s ?? '')
    .replace(/[০-৯]/g, (c) => String('০১২৩৪৫৬৭৮৯'.indexOf(c)))
    .replace(/[,\s]/g, '')
    .replace('।', '.');
}

export const isMoney = (s: string) => /^\d+(\.\d{1,2})?$/.test(s);
export const isWhole = (s: string) => /^\d+$/.test(s);

/** "৳120" or "৳100 - ৳150" for a product with variants (active ones only, website vRange()). */
export function priceRange(prices: number[], lang: Lang): string {
  if (!prices.length) return '-';
  const a = Math.min(...prices);
  const b = Math.max(...prices);
  return a === b ? money(a, lang) : `${money(a, lang)} - ${money(b, lang)}`;
}

export function normMobile(v: string): string {
  let x = v.replace(/[\s\-()]/g, '');
  if (x.startsWith('+88')) x = x.slice(3);
  else if (x.startsWith('88') && x.length === 13) x = x.slice(2);
  return x;
}

export const validMobile = (v: string) => /^01\d{9}$/.test(normMobile(v));
export const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const validNid = (v: string) => /^[0-9A-Za-z-]{6,30}$/.test(v.replace(/\s+/g, ''));
