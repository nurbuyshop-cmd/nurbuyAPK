import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Order } from '@/api/orders';
import { shortDate } from '@/lib/dates';
import { money } from '@/lib/money';
import { isActive, isCancelled, minutesLeft, statusLabel } from '@/lib/orders';
import { fmt, useI18n, useT } from '@/store/i18n';
import { colors, radius, shadow } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';

/** Order in the list: state, promised time or end date, items and total. */
function OrderCardImpl({ o, skew, now }: { o: Order; skew: number; now: number }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const active = isActive(o);
  const cancelled = isCancelled(o);
  const left = minutesLeft(o, now, skew);
  const title = active
    ? left !== null && left > 0
      ? fmt(t('arrivingIn'), { n: left }, lang)
      : left !== null
        ? t('late')
        : t(statusLabel(o))
    : (cancelled ? t('cancelledOn') : t('deliveredOn')) + shortDate(o.updatedAt, lang);
  const names = o.items.map((i) => (lang === 'bn' && i.bn ? i.bn : i.n)).join(', ');

  return (
    <Pressable style={styles.card} onPress={() => router.push({ pathname: '/order/[id]', params: { id: o.id } })} accessibilityRole="button">
      <View style={styles.top}>
        <View style={[styles.ic, active ? styles.icActive : cancelled ? styles.icBad : styles.icOk]}>
          <Icon name={active ? 'truck' : cancelled ? 'x' : 'ok'} size={20} color={active ? colors.primary : cancelled ? colors.danger : '#12a150'} />
        </View>
        <View style={styles.flex}>
          <Txt weight="bold" size={15} numberOfLines={1}>{title}</Txt>
          <Txt size={12.5} color={colors.grey}>{`${o.id} · ${t(statusLabel(o))}`}</Txt>
        </View>
        <Icon name="chevron" size={18} color={colors.grey} />
      </View>
      <Txt size={13.5} color="#444" numberOfLines={2}>{names}</Txt>
      <View style={styles.bottom}>
        <Txt size={12.5} color={colors.grey}>{shortDate(o.createdAt, lang)}</Txt>
        <Txt weight="bold" size={15}>{money(o.total, lang)}</Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, gap: 8, marginBottom: 10, ...shadow.card },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flex: { flex: 1, minWidth: 0 },
  ic: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  icActive: { backgroundColor: '#eef0fa' },
  icOk: { backgroundColor: colors.okBg },
  icBad: { backgroundColor: colors.dangerBg },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

export const OrderCard = memo(OrderCardImpl);
