/** Design tokens copied from seller.nurbuy.com. */
export const colors = {
  primary: '#1d2fe0',
  primary2: '#2a5fd6',
  orange: '#ff6a00',
  text: '#151a2d',
  grey: '#6b7390',
  bg: '#f1f4fa',
  card: '#ffffff',
  border: '#e3e7f2',
  white: '#ffffff',
  ok: '#12a150',
  okBg: '#e4f6ec',
  danger: '#d92d3a',
  dangerBg: '#fdeaec',
  warn: '#b45309',
  warnBg: '#fff1e3',
  infoBg: '#e8edff',
  purple: '#6d28d9',
  purpleBg: '#f1e9ff',
  overlay: 'rgba(21,26,45,0.45)',
} as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 } as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;

/** Minimum touch target for icon buttons. */
export const TOUCH = 44;

export const shadow = {
  card: {
    shadowColor: '#151a2d',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
} as const;

/** Font family names registered in the root layout. Bangla has a single weight and is never bold. */
export const fonts = {
  en: { regular: 'Hind_400Regular', medium: 'Hind_500Medium', semibold: 'Hind_600SemiBold', bold: 'Hind_700Bold' },
  bn: 'NotoSansBengali_400Regular',
} as const;

export type FontWeight = keyof typeof fonts.en;
