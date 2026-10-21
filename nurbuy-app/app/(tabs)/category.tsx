import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CatalogState } from '@/components/CatalogState';
import { Icon } from '@/components/Icon';
import { ProductGrid } from '@/components/ProductGrid';
import { Txt } from '@/components/Txt';
import { track } from '@/lib/analytics';
import { thumb } from '@/lib/imageUrl';
import { categoryName, inCategory } from '@/lib/products';
import { useIndex } from '@/lib/useIndex';
import { useCatalog } from '@/store/catalog';
import { useI18n, useT } from '@/store/i18n';
import { usePersonal } from '@/store/personal';
import { colors, TOUCH } from '@/theme';

/** All categories: main-category tabs, sub-category chips and a 2-column product grid. */
export default function CategoryScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const idx = useIndex();
  const cats = useCatalog((s) => s.catalog?.cats);
  const [main, setMain] = useState<number | null>(null);
  const [sub, setSub] = useState<number | null>(null);

  const cur = main !== null ? cats?.find((c) => c.id === main) : undefined;
  const items = useMemo(() => {
    if (!idx) return [];
    if (main === null) return [...idx.hot, ...idx.best];
    return inCategory(idx.all, sub ?? main);
  }, [idx, main, sub]);

  const pick = (id: number | null) => {
    setMain(id);
    setSub(null);
    if (id) {
      usePersonal.getState().remember(id);
      void track('click', { pg: 'category', cat: cats?.find((c) => c.id === id)?.n });
    }
  };

  const subChips =
    cur && cur.subs.length ? (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {[{ id: null as number | null, label: t('all') }, ...cur.subs.map((s) => ({ id: s.id as number | null, label: categoryName(s, lang) }))].map((c) => (
          <Pressable key={String(c.id)} onPress={() => setSub(c.id)} style={[styles.chip, sub === c.id && styles.chipOn]} accessibilityRole="tab" accessibilityState={{ selected: sub === c.id }}>
            <Txt weight="semibold" size={13.5} color={sub === c.id ? colors.white : colors.text}>{c.label}</Txt>
          </Pressable>
        ))}
      </ScrollView>
    ) : undefined;

  return (
    <View style={styles.page}>
      <View style={[styles.head, { paddingTop: insets.top + 10 }]}>
        <Txt weight="bold" size={20} style={styles.title}>{t('allCategories')}</Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          <Tab label={t('all')} on={main === null} onPress={() => pick(null)} />
          {cats?.map((c) => <Tab key={c.id} label={categoryName(c, lang)} img={c.img} on={main === c.id} onPress={() => pick(c.id)} />)}
        </ScrollView>
      </View>
      {idx ? <ProductGrid key={`${main ?? 'all'}-${sub ?? ''}`} items={items} index={idx} header={subChips} /> : <CatalogState />}
    </View>
  );
}

function Tab({ label, img, on, onPress }: { label: string; img?: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.tab} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={label}>
      <View style={[styles.circle, on && styles.circleOn]}>
        {img ? <Image source={thumb(img, 160)} style={styles.img} contentFit="cover" /> : <Icon name="grid" size={22} color={on ? colors.primary : colors.text} />}
      </View>
      <Txt weight={on ? 'bold' : 'medium'} size={12} color={on ? colors.primary : colors.text} numberOfLines={2} style={styles.label}>{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  head: { backgroundColor: colors.white, paddingBottom: 8, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 1 } },
  title: { paddingHorizontal: 14, marginBottom: 8 },
  tabs: { paddingHorizontal: 10, gap: 4 },
  tab: { width: 72, alignItems: 'center', gap: 4, paddingVertical: 2 },
  circle: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  circleOn: { borderColor: colors.primary },
  img: { width: '100%', height: '100%' },
  label: { textAlign: 'center', lineHeight: 15 },
  chips: { gap: 8, paddingBottom: 12 },
  chip: { minHeight: TOUCH - 8, paddingHorizontal: 14, borderRadius: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, justifyContent: 'center' },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
});
