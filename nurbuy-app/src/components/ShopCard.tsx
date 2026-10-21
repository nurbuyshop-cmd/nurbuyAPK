import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Store } from '@/api/catalog';
import { useDelivery } from '@/lib/delivery';
import { thumb } from '@/lib/imageUrl';
import { money } from '@/lib/money';
import { shopState } from '@/lib/products';
import { digits, fmt, useI18n, useT } from '@/store/i18n';
import { colors, radius, shadow } from '@/theme';

import { FollowButton, useFollowerCount } from './FollowButton';
import { Icon } from './Icon';
import { ShopClosedText } from './ShopClosedText';
import { Txt } from './Txt';

/** Shop card for "Best Shop" and the shop search: logo, name, owner, followers, open state and delivery facts. No verified tick. */
function ShopCardImpl({ s, style }: { s: Store; style?: StyleProp<ViewStyle> }) {
  const t = useT();
  const lang = useI18n((x) => x.lang);
  const { eta, fee } = useDelivery();
  const st = shopState(s);
  const fl = useFollowerCount(s.id, s.fl);
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      onPress={() => router.push({ pathname: '/shop/[id]', params: { id: s.id } })}
      accessibilityRole="link"
      accessibilityLabel={s.n}
    >
      <View style={styles.top}>
        <View style={styles.av}>
          {s.img ? <Image source={thumb(s.img, 160)} style={styles.avImg} contentFit="cover" /> : <Icon name="store" size={26} color={colors.primary} />}
        </View>
        <View style={styles.flex}>
          <Txt weight="bold" size={16} numberOfLines={1}>{s.n}</Txt>
          {s.ow ? (
            <View style={styles.line}>
              <Icon name="user" size={14} color={colors.grey} />
              <Txt size={13} color={colors.grey} numberOfLines={1}>{s.ow}</Txt>
            </View>
          ) : null}
        </View>
        <View style={styles.side}>
          <View style={[styles.state, st.open ? styles.open : styles.shut]}>
            <Txt weight="bold" size={11.5} color={st.open ? '#12a150' : colors.danger}>{st.open ? t('openNow') : st.food ? t('restClosed') : t('closed')}</Txt>
          </View>
          <FollowButton storeId={s.id} compact />
        </View>
      </View>
      <View style={styles.facts}>
        <View style={styles.line}>
          <Icon name="users" size={15} color={colors.grey} />
          <Txt size={13} color={colors.grey}>{digits(fl, lang) + ' ' + t('followers')}</Txt>
        </View>
        <View style={styles.line}>
          <Icon name="scooter" size={15} color={colors.grey} />
          <Txt size={13} color={colors.grey}>{fmt(t('minsN'), { n: eta }, lang)}</Txt>
        </View>
        <View style={styles.line}>
          <Icon name="truck" size={15} color={colors.grey} />
          <Txt size={13} color={colors.grey}>{money(fee, lang)}</Txt>
        </View>
      </View>
      {!st.open ? <ShopClosedText state={st} size={12.5} color={colors.danger} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  pressed: { opacity: 0.9 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex: { flex: 1, minWidth: 0 },
  av: { width: 54, height: 54, borderRadius: 14, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avImg: { width: '100%', height: '100%' },
  line: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  side: { alignItems: 'flex-end', gap: 6 },
  state: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  open: { backgroundColor: '#e3f6ea' },
  shut: { backgroundColor: colors.dangerBg },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 12 },
});

export const ShopCard = memo(ShopCardImpl);
