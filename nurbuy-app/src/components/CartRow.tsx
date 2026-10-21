import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { CartItem } from '@/lib/cart';
import { thumb } from '@/lib/imageUrl';
import { money } from '@/lib/money';
import { productName } from '@/lib/products';
import { useCart } from '@/store/cart';
import { fmt, useI18n, useT } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

import { Icon } from './Icon';
import { QtyStepper } from './QtyStepper';
import { Txt } from './Txt';

/** One cart line: photo, name, option, price, quantity and remove. */
function CartRowImpl({ it }: { it: CartItem }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const setQty = useCart((s) => s.setQty);
  const { p, v, line } = it;
  const remove = () => {
    setQty(line.id, line.vid, 0);
    toast(t('removedFromCart'));
  };
  const img = v?.img || p?.img || '';
  return (
    <View style={styles.row}>
      <Pressable onPress={() => p && router.push({ pathname: '/product/[id]', params: { id: p.id } })} style={styles.im} accessibilityRole="button">
        <Image source={img ? thumb(img, 160) : undefined} style={styles.img} contentFit="contain" />
      </Pressable>
      <View style={styles.flex}>
        <Txt weight="semibold" size={14} numberOfLines={2}>{p ? productName(p, lang) : t('productGone')}</Txt>
        {v ? <Txt size={12.5} color={colors.grey}>{v.name}</Txt> : null}
        {it.outOfStock && p ? <Txt weight="bold" size={12.5} color={colors.danger}>{t('outOfStock')}</Txt> : null}
        <View style={styles.bottom}>
          <Txt weight="bold" size={15}>{money(it.unit * line.q, lang)}</Txt>
          {p && !it.outOfStock ? (
            <QtyStepper
              value={Math.min(line.q, it.max)}
              max={it.max}
              onChange={(q) => setQty(line.id, line.vid, q)}
              onLimit={() => toast(fmt(t('maxPerOrder'), { n: it.max }, lang))}
            />
          ) : null}
        </View>
      </View>
      <Pressable onPress={remove} style={styles.rm} hitSlop={6} accessibilityRole="button" accessibilityLabel={t('remove')}>
        <Icon name="x" size={18} color={colors.grey} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, padding: 14, borderTopWidth: 1, borderTopColor: '#f3f4f8' },
  im: { width: 78, height: 78, borderRadius: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  img: { width: '100%', height: '100%' },
  flex: { flex: 1, minWidth: 0, gap: 2 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  rm: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});

export const CartRow = memo(CartRowImpl);
