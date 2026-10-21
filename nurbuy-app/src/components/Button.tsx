import { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, TOUCH } from '@/theme';

import { Txt } from './Txt';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'link';
  busy?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

function ButtonImpl({ label, onPress, variant = 'primary', busy, disabled, style }: Props) {
  const off = disabled || busy;
  const fg = variant === 'primary' ? colors.white : colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!off, busy: !!busy }}
      disabled={off}
      onPress={onPress}
      style={({ pressed }) => [styles.base, styles[variant], off && styles.off, pressed && styles.pressed, style]}
    >
      {busy ? <ActivityIndicator color={fg} /> : <Txt weight="bold" size={variant === 'link' ? 14 : 16} color={fg}>{label}</Txt>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: TOUCH, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  primary: {
    minHeight: 52,
    borderRadius: 13,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  outline: { minHeight: 50, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.white },
  link: { paddingHorizontal: 4 },
  off: { opacity: 0.6 },
  pressed: { transform: [{ scale: 0.98 }] },
});

export const Button = memo(ButtonImpl);
