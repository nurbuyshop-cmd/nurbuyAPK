import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { Product } from '@/api/catalog';
import { BannerSlot } from '@/components/BannerSlot';
import { CatalogState } from '@/components/CatalogState';
import { ProductGrid } from '@/components/ProductGrid';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { track } from '@/lib/analytics';
import type { Placement } from '@/lib/banners';
import { categoryName, inCategory } from '@/lib/products';
import { useIndex } from '@/lib/useIndex';
import { useHistory } from '@/store/history';
import { useI18n, useT } from '@/store/i18n';
import { usePersonal } from '@/store/personal';
import { colors, TOUCH } from '@/theme';

const CATEGORY_SPOT: Placement[] = ['category'];

type Src ='hot' | 'best' | 'new' | 'all' | 'cat' | 'history';
const isSrc = (v: unknown): v is Src => v === 'hot' || v === 'best' || v === 'new' || v === 'all' || v === 'cat' || v === 'history';

/** "View All" lists and category pages: a 2-column grid; categories add sub-category chips. */
export default function ProductsScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const params = useLocalSearchParams<{ src?: string; cid?: string }>();
  const src: Src = isSrc(params.src) ? params.src : 'all';
  const cid = Number(params.cid ?? 0);
  const idx = useIndex();
  const historyIds = useHistory((s) => s.ids);
  const [sub, setSub] = useState<number | null>(null);

  const cat = idx && src === 'cat' ? idx.catById.get(cid) : undefined;

  useEffect(() => {
    if (src !== 'cat' || !cid) return;
    usePersonal.getState().remember(cid);
    void track('click', { pg: 'category', cat: cat?.n });
  }, [src, cid, cat?.n]);

  const items = useMemo<Product[]>(() => {
    if (!idx) return [];
    switch (src) {
      case 'hot':
        return idx.hot;
      case 'best':
        return idx.best;
      case 'new':
        return idx.newest;
      case 'history':
        return historyIds.map((id) => idx.byId.get(id)).filter((p): p is Product => !!p);
      case 'cat':
        return inCategory(idx.all, sub ?? cid);
      default:
        return [...idx.hot, ...idx.best];
    }
  }, [idx, src, cid, sub, historyIds]);

  const title =
    src === 'cat' && cat
      ? categoryName(cat, lang)
      : { hot: t('hotDeals'), best: t('bestSellingAll'), new: t('newProducts'), history: t('history'), all: t('allProducts'), cat: t('allProducts') }[src];

  const subChips =
    cat && cat.subs.length ? (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {[{ id: null as number | null, label: t('all') }, ...cat.subs.map((s) => ({ id: s.id as number | null, label: categoryName(s, lang) }))].map((c) => (
          <Pressable
            key={String(c.id)}
            onPress={() => setSub(c.id)}
            style={[styles.chip, sub === c.id && styles.chipOn]}
            accessibilityRole="tab"
            accessibilityState={{ selected: sub === c.id }}
          >
            <Txt weight="semibold" size={13.5} color={sub === c.id ? colors.white : colors.text}>{c.label}</Txt>
          </Pressable>
        ))}
      </ScrollView>
    ) : null;

  const header =
    src === 'cat' ? (
      <View>
        <BannerSlot placements={CATEGORY_SPOT} style={styles.banner} />
        {subChips}
      </View>
    ) : undefined;

  return (
    <View style={styles.page}>
      <TopBar title={title} />
      {idx ? <ProductGrid key={`${src}-${cid}-${sub ?? ''}`} items={items} index={idx} header={header} /> : <CatalogState />}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  chips: { gap: 8, paddingBottom: 12 },
  banner: { marginBottom: 12 },
  chip: { minHeight: TOUCH - 8, paddingHorizontal: 14, borderRadius: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, justifyContent: 'center' },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
});
