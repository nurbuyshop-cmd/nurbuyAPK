import { useCallback } from 'react';
import { create } from 'zustand';

import { bn } from '@/i18n/bn';
import { en, type StringKey } from '@/i18n/en';
import { local } from '@/lib/storage';

export type Lang = 'en' | 'bn';

const KEY = 'nb_lang';
const isLang = (v: unknown): v is Lang => v === 'en' || v === 'bn';

type State = {
  lang: Lang;
  hydrate: () => Promise<void>;
  setLang: (l: Lang) => void;
};

/** Language, English by default like the website, persisted on the phone. */
export const useI18n = create<State>((set) => ({
  lang: 'en',
  hydrate: async () => {
    const l = await local.get(KEY, isLang);
    if (l) set({ lang: l });
  },
  setLang: (l) => {
    set({ lang: l });
    void local.set(KEY, l);
  },
}));

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';

/** Writes digits as Bangla numerals when the language is Bangla. */
export function digits(s: string | number, lang: Lang): string {
  const v = String(s);
  return lang === 'bn' ? v.replace(/\d/g, (d) => BN_DIGITS.charAt(Number(d))) : v;
}

/** Fills {name} placeholders; numbers are written with Bangla numerals in Bangla. */
export function fmt(s: string, vars: Record<string, string | number>, lang: Lang): string {
  return s.replace(/\{(\w+)\}/g, (m, k: string) => {
    const v = vars[k];
    if (v === undefined) return m;
    return typeof v === 'number' ? digits(v, lang) : v;
  });
}

const WEEKDAYS: Record<Lang, string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  bn: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'],
};

export function weekday(d: number, lang: Lang): string {
  return WEEKDAYS[lang][d] ?? '';
}

export function translate(key: StringKey, lang: Lang): string {
  return lang === 'bn' ? bn[key] : en[key];
}

/** Translation function bound to the current language. */
export function useT() {
  const lang = useI18n((s) => s.lang);
  return useCallback((key: StringKey) => translate(key, lang), [lang]);
}
