import { memo, type ReactNode } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useI18n } from '@/store/i18n';
import { colors, fonts, type FontWeight } from '@/theme';

type Props = TextProps & { weight?: FontWeight; size?: number; color?: string; /** keep English typography even when the app is in Bangla */ latin?: boolean };

// the Bengali Unicode block (letters, digits and the taka sign)
const BANGLA = /[ঀ-৿]/;

/** The plain text of the children, or null when they include other elements. */
function plainText(c: ReactNode): string | null {
  if (typeof c === 'string') return c;
  if (typeof c === 'number') return String(c);
  if (c === null || c === undefined || typeof c === 'boolean') return '';
  if (Array.isArray(c)) {
    let out = '';
    for (const x of c as ReactNode[]) {
      const s = plainText(x);
      if (s === null) return null;
      out += s;
    }
    return out;
  }
  return null;
}

/**
 * App text. English uses Hind in the requested weight; Bangla always uses Noto Sans Bengali at its single weight
 * and never gets bold or faux-bold, even when a style asks for it.
 */
function TxtImpl({ weight = 'regular', size = 15, color = colors.text, style, latin, ...rest }: Props) {
  const appLang = useI18n((s) => s.lang);
  // in Bangla mode, text without any Bangla letters (English product names, emails, names) keeps the English font
  const text = appLang === 'bn' && !latin ? plainText(rest.children) : null;
  const lang = latin || (text !== null && !BANGLA.test(text)) ? 'en' : appLang;
  const family = lang === 'bn' ? fonts.bn : fonts.en[weight];
  return (
    <Text
      maxFontSizeMultiplier={1.3}
      {...rest}
      style={[{ fontFamily: family, fontSize: size, color }, style, lang === 'bn' ? styles.noBold : styles.enWeight]}
    />
  );
}

const styles = StyleSheet.create({
  noBold: { fontFamily: fonts.bn, fontWeight: 'normal' },
  // the weight comes from the font file; a fontWeight on top would make Android synthesise a fake bold
  enWeight: { fontWeight: 'normal' },
});

export const Txt = memo(TxtImpl);

/** Font family for TextInput, which does not go through Txt. */
export function useInputFont(): string {
  const lang = useI18n((s) => s.lang);
  return lang === 'bn' ? fonts.bn : fonts.en.regular;
}
