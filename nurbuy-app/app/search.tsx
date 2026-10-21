import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { useDeferredValue, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Product } from '@/api/catalog';
import { CatalogState } from '@/components/CatalogState';
import { Icon } from '@/components/Icon';
import { openPhotoSearch } from '@/components/PhotoSearchSheet';
import { ProductGrid } from '@/components/ProductGrid';
import { ShopCard } from '@/components/ShopCard';
import { Txt, useInputFont } from '@/components/Txt';
import { searchProducts, searchStores } from '@/lib/products';
import { useIndex } from '@/lib/useIndex';
import { fmt, useI18n, useT } from '@/store/i18n';
import { colors, TOUCH } from '@/theme';

type Mode = 'product' | 'shop';

const NONE: Product[] = [];

/** Search with two modes: products (English and Bangla titles, tags, product ID) and shops. */
export default function SearchScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const font = useInputFont();
  const params = useLocalSearchParams<{ mode?: string; q?: string }>();
  const [mode, setMode] = useState<Mode>(params.mode === 'shop' ? 'shop' : 'product');
  // a word tapped on the photo search results arrives as ?q=
  const [q, setQ] = useState(params.q ?? '');
  const query = useDeferredValue(q);
  const idx = useIndex();
  const stores = idx?.stores;

  const products = useMemo(() => (idx && query.trim() ? searchProducts(idx.all, query) : NONE), [idx, query]);
  const shops = useMemo(() => searchStores(stores ?? [], query), [stores, query]);

  return (
    <View style={styles.page}>
      <View style={[styles.head, { paddingTop: insets.top + 8 }]}>
        <View style={styles.row}>
          <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button" accessibilityLabel={t('back')}>
            <Icon name="back" size={22} color={colors.text} strokeWidth={2} />
          </Pressable>
          <View style={styles.box}>
            <Icon name="search" size={20} color={colors.primary} strokeWidth={2.4} />
            <TextInput
              value={q}
              onChangeText={setQ}
              autoFocus={!params.q}
              placeholder={mode === 'shop' ? t('searchShopPh') : t('searchPh')}
              placeholderTextColor="#8a90a8"
              style={[styles.input, { fontFamily: font }]}
              returnKeyType="search"
              accessibilityLabel={mode === 'shop' ? t('searchShop') : t('searchProduct')}
            />
            {q ? (
              <Pressable onPress={() => setQ('')} hitSlop={10} accessibilityRole="button" accessibilityLabel={t('clear')}>
                <Icon name="x" size={18} color={colors.grey} />
              </Pressable>
            ) : mode === 'product' ? (
              <Pressable onPress={openPhotoSearch} hitSlop={10} accessibilityRole="button" accessibilityLabel={t('photoSearch')}>
                <Icon name="cam" size={22} color={colors.primary} />
              </Pressable>
            ) : null}
          </View>
        </View>
        <View style={styles.modes} accessibilityRole="tablist">
          {(['product', 'shop'] as const).map((m) => (
            <Pressable key={m} onPress={() => setMode(m)} style={[styles.mode, mode === m && styles.modeOn]} accessibilityRole="tab" accessibilityState={{ selected: mode === m }}>
              <Txt weight="bold" size={14} color={mode === m ? colors.primary : colors.grey}>{m === 'product' ? t('searchProduct') : t('searchShop')}</Txt>
            </Pressable>
          ))}
        </View>
      </View>

      {!idx ? (
        <CatalogState />
      ) : mode === 'product' ? (
        // one grid stays mounted while typing: remounting it on every letter made the keyboard drop and come back
        <ProductGrid
          items={products}
          index={idx}
          showEmpty={!!query.trim()}
          header={query.trim() ? <Txt weight="bold" size={16} style={styles.res}>{fmt(t('resultsFor'), { q: query.trim() }, lang)}</Txt> : undefined}
        />
      ) : (
        <FlashList
          data={shops}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => <ShopCard s={item} style={styles.shop} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Txt size={14} color={colors.grey} style={styles.empty}>{t('noShops')}</Txt>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  head: { backgroundColor: colors.white, paddingHorizontal: 12, paddingBottom: 6, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 1 } },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  back: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, backgroundColor: '#f1f3f9', alignItems: 'center', justifyContent: 'center' },
  box: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, borderWidth: 1.5, borderColor: colors.primary, borderRadius: 26, paddingHorizontal: 14 },
  input: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: 0 },
  modes: { flexDirection: 'row', marginTop: 8 },
  mode: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: TOUCH, borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  modeOn: { borderBottomColor: colors.primary },
  res: { marginBottom: 4 },
  list: { padding: 14 },
  shop: { marginBottom: 12 },
  empty: { textAlign: 'center', paddingVertical: 40 },
});
