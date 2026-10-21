import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import type { Product } from '@/api/catalog';
import { thumb } from '@/lib/imageUrl';
import { money } from '@/lib/money';
import { productName } from '@/lib/products';
import { useI18n, useT } from '@/store/i18n';
import { colors, shadow } from '@/theme';

import { Txt } from './Txt';

/** Small tiles of recently opened products. */
function HistoryRowImpl({ items }: { items: Product[] }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  if (!items.length) return <Txt size={13} color={colors.grey} style={styles.empty}>{t('historyEmpty')}</Txt>;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.slice(0, 12).map((p) => (
        <Pressable key={p.id} style={styles.tile} onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })} accessibilityRole="button" accessibilityLabel={productName(p, lang)}>
          <Image source={p.img ? thumb(p.img, 160) : undefined} style={styles.img} contentFit="contain" />
          <Txt weight="semibold" size={12} numberOfLines={1} style={styles.name}>{productName(p, lang)}</Txt>
          <Txt weight="semibold" size={11.5} color={colors.primary} numberOfLines={1}>{money(p.pr, lang)}</Txt>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 12, paddingHorizontal: 14, paddingVertical: 4 },
  tile: { width: 96, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 6, ...shadow.card },
  img: { width: '100%', aspectRatio: 1, borderRadius: 8, backgroundColor: colors.white },
  name: { marginTop: 5 },
  empty: { paddingHorizontal: 14, paddingVertical: 8 },
});

export const HistoryRow = memo(HistoryRowImpl);
