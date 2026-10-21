import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Category } from '@/api/catalog';
import { thumb } from '@/lib/imageUrl';
import { categoryName } from '@/lib/products';
import { useI18n, useT } from '@/store/i18n';
import { colors, shadow } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';

/** Home category circles: the first nine main categories and an "All" button that opens the category page. */
function CategoryCirclesImpl({ cats }: { cats: Category[] }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  return (
    <View style={styles.grid}>
      {cats.slice(0, 9).map((c) => (
        <Pressable
          key={c.id}
          style={styles.cell}
          onPress={() => router.push({ pathname: '/products', params: { src: 'cat', cid: String(c.id) } })}
          accessibilityRole="button"
          accessibilityLabel={categoryName(c, lang)}
        >
          <View style={styles.circle}>
            {c.img ? <Image source={thumb(c.img, 160)} style={styles.img} contentFit="cover" /> : <Icon name="bag" size={26} color={colors.primary} />}
          </View>
          <Txt weight="medium" size={12} numberOfLines={2} style={styles.label}>{categoryName(c, lang)}</Txt>
        </Pressable>
      ))}
      <Pressable style={styles.cell} onPress={() => router.navigate('/category')} accessibilityRole="button" accessibilityLabel={t('allCategories')}>
        <View style={styles.circle}>
          <Icon name="grid" size={24} color={colors.text} strokeWidth={2} />
        </View>
        <Txt weight="medium" size={12} style={styles.label}>{t('all')}</Txt>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 14, marginVertical: 16 },
  cell: { width: '20%', alignItems: 'center', gap: 5, paddingHorizontal: 2 },
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadow.card,
  },
  img: { width: '100%', height: '100%' },
  label: { textAlign: 'center', lineHeight: 15 },
});

export const CategoryCircles = memo(CategoryCirclesImpl);
