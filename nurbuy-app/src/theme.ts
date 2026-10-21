/** Design tokens copied from minutes.nurbuy.com. */
export const colors = {
  primary: '#1d2fe0',
  primary2: '#2a5fd6',
  orange: '#ff6a00',
  text: '#151a2d',
  grey: '#6b7390',
  bg: '#ffffff',
  border: '#e3e7f2',
  white: '#ffffff',
  danger: '#be123c',
  dangerBg: '#fde8ec',
  okBg: '#e3f6ea',
  okText: '#14532d',
  overlay: 'rgba(21,26,45,0.45)',
} as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 } as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;

/** Minimum touch target for icon buttons. */
export const TOUCH = 44;

export const shadow = {
  card: {
    shadowColor: '#151a2d',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
} as const;

/** Font family names registered in the root layout. Bangla has a single weight and is never bold. */
export const fonts = {
  en: { regular: 'Hind_400Regular', medium: 'Hind_500Medium', semibold: 'Hind_600SemiBold', bold: 'Hind_700Bold' },
  bn: 'NotoSansBengali_400Regular',
} as const;

export type FontWeight = keyof typeof fonts.en;
