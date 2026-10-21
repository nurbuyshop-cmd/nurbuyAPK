import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { OrderState, SellerOrder } from '@/api/seller';
import type { StringKey } from '@/i18n/en';
import { ago, money } from '@/lib/format';
import { useLang } from '@/store/i18n';
import { colors, radius, shadow } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';
import { Chip, type ChipTone } from './ui';

export const ORDER_STATE: Record<OrderState, [StringKey, ChipTone]> = {
  new: ['osNew', 'amber'],
  confirmed: ['osConfirmed', 'blue'],
  packed: ['osPacked', 'purple'],
  shipped: ['osShipped', 'purple'],
  delivered: ['osDelivered', 'green'],
  cancelled: ['osCancelled', 'red'],
  rejected: ['osRejected', 'red'],
};

export function OrderChip({ st }: { st: OrderState }) {
  const { t } = useLang();
  const [k, tone] = ORDER_STATE[st];
  return <Chip label={t(k)} tone={tone} />;
}

/** One order in a list (website ocard()). */
function OrderCardImpl({ o }: { o: SellerOrder }) {
  const { lang, n } = useLang();
  const first = o.items
    .slice(0, 2)
    .map((i) => `${lang === 'bn' && i.bn ? i.bn : i.n}${i.variant ? ` (${i.variant})` : ''} x${n(i.q)}`)
    .join(', ');
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/order/[id]', params: { id: o.id } })}
      style={({ pressed }) => [styles.card, o.st === 'new' && styles.isNew, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <View style={styles.row}>
        <Txt weight="bold" size={15} latin style={styles.flex} numberOfLines={1}>#{o.id}</Txt>
        <OrderChip st={o.st} />
      </View>
      <View style={styles.line}>
        <Icon name="box" size={17} color={colors.grey} />
        <Txt size={14} style={styles.flex} numberOfLines={2}>{first}{o.items.length > 2 ? ` +${n(o.items.length - 2)}` : ''}</Txt>
      </View>
      <View style={styles.line}>
        <Icon name="user" size={17} color={colors.grey} />
        <Txt size={14} style={styles.flex}>{o.cu || '-'}</Txt>
      </View>
      <View style={styles.foot}>
        <Txt weight="bold" size={16}>{money(o.sub, lang)}</Txt>
        <View style={styles.flex} />
        <Txt size={12.5} color={colors.grey}>{ago(o.created_at * 1000, lang)}</Txt>
      </View>
    </Pressable>
  );
}

export const OrderCard = memo(OrderCardImpl);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, gap: 7, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  isNew: { borderColor: '#ffc89e', borderLeftWidth: 4, borderLeftColor: colors.orange },
  pressed: { opacity: 0.75 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  foot: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f0f2f8' },
  flex: { flex: 1, minWidth: 0 },
});
