import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { errorText } from '@/lib/errors';
import { initials } from '@/lib/format';
import { ApiError } from '@/api/api';
import { useT } from '@/store/i18n';
import { colors, radius, shadow } from '@/theme';

import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

/** White rounded box (the website's .card). */
export function Card({ children, style, title, right }: { children?: ReactNode; style?: StyleProp<ViewStyle>; title?: string; right?: ReactNode }) {
  return (
    <View style={[styles.card, style]}>
      {title || right ? (
        <View style={styles.cardHead}>
          {title ? <Txt weight="bold" size={16.5} style={styles.flex}>{title}</Txt> : <View style={styles.flex} />}
          {right}
        </View>
      ) : null}
      {children}
    </View>
  );
}

export type ChipTone = 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'grey';

const CHIP: Record<ChipTone, [string, string]> = {
  blue: [colors.infoBg, colors.primary],
  green: [colors.okBg, '#0b7a3b'],
  red: [colors.dangerBg, colors.danger],
  amber: [colors.warnBg, colors.warn],
  purple: [colors.purpleBg, colors.purple],
  grey: ['#eef0f6', colors.grey],
};

/** Small coloured label (status). */
export function Chip({ label, tone = 'blue' }: { label: string; tone?: ChipTone }) {
  const [bg, fg] = CHIP[tone];
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Txt weight="semibold" size={12.5} color={fg} numberOfLines={1}>{label}</Txt>
    </View>
  );
}

export type BannerTone = 'info' | 'ok' | 'bad' | 'warn';
const BANNER: Record<BannerTone, [string, string, IconName]> = {
  info: [colors.infoBg, colors.primary, 'info'],
  ok: [colors.okBg, '#0b7a3b', 'check'],
  bad: [colors.dangerBg, colors.danger, 'alert'],
  warn: [colors.warnBg, colors.warn, 'info'],
};

/** Coloured message box with an icon (the website's .banner). */
export function Banner({ tone = 'info', icon, children }: { tone?: BannerTone; icon?: IconName; children: ReactNode }) {
  const [bg, fg, ic] = BANNER[tone];
  return (
    <View style={[styles.banner, { backgroundColor: bg }]}>
      <Icon name={icon ?? ic} size={20} color={fg} />
      <View style={styles.flex}>{typeof children === 'string' ? <Txt size={14} color={colors.text}>{children}</Txt> : children}</View>
    </View>
  );
}

/** Label / value row. */
export function KV({ k, v }: { k: string; v: ReactNode }) {
  return (
    <View style={styles.kv}>
      <Txt size={13.5} color={colors.grey} style={styles.kvK}>{k}</Txt>
      <View style={styles.kvV}>{typeof v === 'string' || typeof v === 'number' ? <Txt size={14.5} weight="medium">{v}</Txt> : v}</View>
    </View>
  );
}

export function Spinner({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.spin, style]} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

/** Error box with "Try again" (the website's errBox()). */
export function ErrorBox({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const t = useT();
  const net = error instanceof ApiError && error.status === 0;
  return (
    <View style={styles.center}>
      <Icon name="alert" size={42} color={colors.danger} />
      <Txt weight="bold" size={17} style={styles.centerText}>{net ? t('errNoConnTitle') : t('errTitle')}</Txt>
      <Txt size={14} color={colors.grey} style={styles.centerText}>{errorText(error, t)}</Txt>
      <Button label={t('retry')} icon="refresh" small onPress={onRetry} style={styles.retry} />
    </View>
  );
}

/** Empty list message with an icon. */
export function Empty({ icon, title, sub, children }: { icon: IconName; title: string; sub?: string; children?: ReactNode }) {
  return (
    <View style={styles.center}>
      <View style={styles.emptyIc}>
        <Icon name={icon} size={30} color={colors.primary} />
      </View>
      <Txt weight="bold" size={16.5} style={styles.centerText}>{title}</Txt>
      {sub ? <Txt size={14} color={colors.grey} style={styles.centerText}>{sub}</Txt> : null}
      {children}
    </View>
  );
}

/** A photo, or the name's initials when there is none. */
export function Avatar({ name, uri, size = 48, ring }: { name: string; uri: string | null; size?: number; ring?: boolean }) {
  return (
    <View style={[styles.av, { width: size, height: size, borderRadius: size / 2 }, ring && styles.ring]}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />
      ) : (
        <Txt weight="bold" size={size * 0.36} color={colors.primary} latin>{initials(name)}</Txt>
      )}
    </View>
  );
}

/** Menu row with an icon and a chevron. */
export function MenuRow({ icon, label, sub, badge, onPress }: { icon: IconName; label: string; sub?: string; badge?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.menu, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={label}>
      <Icon name={icon} size={21} color={colors.primary} />
      <View style={styles.flex}>
        <Txt size={15} weight="medium">{label}</Txt>
        {sub ? <Txt size={12.5} color={colors.grey}>{sub}</Txt> : null}
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Txt weight="bold" size={11} color={colors.white}>{badge}</Txt>
        </View>
      ) : null}
      <Icon name="chevron" size={18} color={colors.grey} />
    </Pressable>
  );
}

export const ui = StyleSheet.create({
  page: { padding: 14, gap: 12, paddingBottom: 28 },
  flex: { flex: 1, minWidth: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  gap: { gap: 10 },
});

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  chip: { borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 2.5, alignSelf: 'flex-start' },
  banner: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: radius.md, alignItems: 'flex-start' },
  kv: { flexDirection: 'row', gap: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  kvK: { width: 112 },
  kvV: { flex: 1, minWidth: 0 },
  spin: { paddingVertical: 40, alignItems: 'center' },
  center: { alignItems: 'center', paddingVertical: 34, paddingHorizontal: 18, gap: 6 },
  centerText: { textAlign: 'center' },
  retry: { marginTop: 10, alignSelf: 'center' },
  emptyIc: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  av: { backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  ring: { borderWidth: 3, borderColor: colors.white },
  menu: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 54, paddingVertical: 8 },
  pressed: { opacity: 0.6 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
});
