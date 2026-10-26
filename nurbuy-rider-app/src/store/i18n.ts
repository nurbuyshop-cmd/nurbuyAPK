import { useCallback } from 'react';
import { create } from 'zustand';

import { bn } from '@/i18n/bn';
import { en, type StringKey } from '@/i18n/en';
import { local } from '@/lib/storage';

export type Lang = 'en' | 'bn';

const KEY = 'nbr_lang';
const isLang = (v: unknown): v is Lang => v === 'en' || v === 'bn';

type State = {
  lang: Lang;
  hydrate: () => Promise<void>;
  setLang: (l: Lang) => void;
};

/** Language, Bangla by default like the rider website, persisted on the phone. */
export const useI18n = create<State>((set) => ({
  lang: 'bn',
  hydrate: async () => {
    const l = await local.get(KEY, isLang);
    if (l) set({ lang: l });
  },
  setLang: (l) => {
    set({ lang: l });
    void local.set(KEY, l);
  },
}));

export const toggleLang = () => {
  const s = useI18n.getState();
  s.setLang(s.lang === 'bn' ? 'en' : 'bn');
};

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

export function translate(key: StringKey, lang: Lang): string {
  return lang === 'bn' ? bn[key] : en[key];
}

/** Translation function bound to the current language. */
export function useT() {
  const lang = useI18n((s) => s.lang);
  return useCallback((key: StringKey) => translate(key, lang), [lang]);
}

/** Current-language helpers used by most pages: t(), digits n(), placeholders f(). */
export function useLang() {
  const lang = useI18n((s) => s.lang);
  const t = useCallback((key: StringKey) => translate(key, lang), [lang]);
  const n = useCallback((v: string | number) => digits(v, lang), [lang]);
  const f = useCallback((key: StringKey, vars: Record<string, string | number>) => fmt(translate(key, lang), vars, lang), [lang]);
  return { lang, t, n, f };
}
