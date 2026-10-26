import { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, TOUCH } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerSolid' | 'ok' | 'orange';

type Props = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  small?: boolean;
  busy?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const FG: Record<ButtonVariant, string> = {
  primary: colors.white,
  secondary: colors.primary,
  ghost: colors.text,
  danger: colors.danger,
  dangerSolid: colors.white,
  ok: colors.white,
  orange: colors.white,
};

/** The website's buttons: blue main button, light secondary, ghost, red danger, green confirm and orange. */
function ButtonImpl({ label, onPress, variant = 'primary', icon, small, busy, disabled, style }: Props) {
  const off = disabled || busy;
  const fg = FG[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!off, busy: !!busy }}
      disabled={off}
      onPress={onPress}
      style={({ pressed }) => [styles.base, small && styles.small, styles[variant], off && styles.off, pressed && styles.pressed, style]}
    >
      {busy ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={small ? 17 : 19} color={fg} /> : null}
          <Txt weight="bold" size={small ? 14 : 15.5} color={fg} style={styles.label}>{label}</Txt>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  small: { minHeight: TOUCH, paddingHorizontal: 12, borderRadius: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  label: { textAlign: 'center', flexShrink: 1 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.infoBg },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.dangerBg },
  dangerSolid: { backgroundColor: colors.danger },
  ok: { backgroundColor: colors.ok },
  orange: { backgroundColor: colors.orange },
  off: { opacity: 0.55 },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
});

export const Button = memo(ButtonImpl);
