import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { deleteProduct, type Product } from '@/api/products';
import { ads } from '@/api/shop';
import { BoostSheet } from '@/components/BoostParts';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ProductCard } from '@/components/ProductCard';
import { Sheet } from '@/components/Sheet';
import { StockSheet, VariantStockSheet } from '@/components/StockSheets';
import { TopBar } from '@/components/TopBar';
import { Txt, useInputFont } from '@/components/Txt';
import { Empty, ErrorBox, Spinner } from '@/components/ui';
import type { StringKey } from '@/i18n/en';
import { errorText } from '@/lib/errors';
import { useDash } from '@/store/dash';
import { useLang } from '@/store/i18n';
import { matches, useProducts, type PFilter } from '@/store/products';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

const FILTERS: [PFilter, StringKey][] = [
  ['all', 'pfAll'],
  ['active', 'pfLive'],
  ['pending', 'pfReview'],
  ['rejected', 'pfRejected'],
  ['hidden', 'pfHidden'],
  ['low', 'pfLow'],
];
const isFilter = (v: unknown): v is PFilter => typeof v === 'string' && FILTERS.some(([k]) => k === v);

/** A product changed from its card (stock, hide/show): update the list and the dashboard numbers. */
function changed(p: Product) {
  useProducts.getState().put(p);
  void useDash.getState().load().catch(() => {});
}

/** The seller's products with the website's filters and search (website scrProducts()). */
export default function Products() {
  const { t, n, lang } = useLang();
  const font = useInputFont();
  const params = useLocalSearchParams<{ f?: string }>();
  const list = useProducts((s) => s.list);
  const counts = useProducts((s) => s.counts);
  const error = useProducts((s) => s.error);
  const filter = useProducts((s) => s.filter);
  const q = useProducts((s) => s.q);
  const { load, drop, setFilter, setQ } = useProducts.getState();
  const [refreshing, setRefreshing] = useState(false);
  const [stockOf, setStockOf] = useState<Product | null>(null);
  const [delOf, setDelOf] = useState<Product | null>(null);
  const [delBusy, setDelBusy] = useState(false);
  const [boostOf, setBoostOf] = useState<{ p: Product; rates?: { imp1000: number; click: number }; maxDays?: number } | null>(null);

  // the home page opens this tab with a filter (under review, rejected, low stock)
  const [seenParam, setSeenParam] = useState<string | undefined>(undefined);
  if (seenParam !== params.f) {
    setSeenParam(params.f);
    if (isFilter(params.f)) setFilter(params.f);
  }

  useEffect(() => {
    void useProducts.getState().load();
  }, []);

  const rows = useMemo(() => (list ?? []).filter((p) => matches(p, filter, q)), [list, filter, q]);
  const pendingCount = (counts?.pending ?? 0) + (list ?? []).filter((p) => p.status === 'active' && !!p.chg).length;
  const countOf = (k: PFilter): number =>
    !counts ? 0 : k === 'pending' ? pendingCount : k === 'low' ? counts.low + counts.out : counts[k];

  // the boost sheet shows the current charges, so the boost account is read first
  const openBoost = (p: Product) => {
    setBoostOf({ p });
    ads().then(
      (d) => setBoostOf((b) => (b && b.p.id === p.id ? { p, rates: d.account.rates, maxDays: d.account.max_days } : b)),
      () => {},
    );
  };

  const remove = async () => {
    if (!delOf) return;
    setDelBusy(true);
    try {
      await deleteProduct(delOf.id);
      drop(delOf.id);
      toast(t('deleted'), 'ok');
      setDelOf(null);
      void load();
    } catch (e) {
      toast(errorText(e, t), 'bad');
    }
    setDelBusy(false);
  };

  return (
    <View style={styles.flex}>
      <TopBar title={t('products')} right={<Button small icon="plus" label={t('add')} onPress={() => router.push({ pathname: '/product/[id]', params: { id: 'new' } })} />} />
      {!list ? (
        error ? <ErrorBox error={error} onRetry={() => void load()} /> : <Spinner />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(p) => String(p.id)}
          renderItem={({ item }) => <ProductCard p={item} onChanged={changed} onStock={setStockOf} onDelete={setDelOf} onBoost={openBoost} />}
          ItemSeparatorComponent={Sep}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={styles.head}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                {FILTERS.map(([k, label]) => {
                  const on = filter === k;
                  return (
                    <Pressable key={k} onPress={() => setFilter(k)} style={[styles.fc, on && styles.fcOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
                      <Txt weight="semibold" size={13.5} color={on ? colors.white : colors.text}>{t(label)}</Txt>
                      <View style={[styles.cnt, on && styles.cntOn]}>
                        <Txt weight="bold" size={11.5} color={on ? colors.primary : colors.grey}>{n(countOf(k))}</Txt>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <View style={styles.search}>
                <Icon name="search" size={19} color={colors.grey} />
                <TextInput
                  value={q}
                  onChangeText={setQ}
                  placeholder={t('searchProducts')}
                  placeholderTextColor="#9aa1b8"
                  style={[styles.searchIn, { fontFamily: font }]}
                  returnKeyType="search"
                  autoCorrect={false}
                />
              </View>
            </View>
          }
          ListEmptyComponent={
            <Empty icon="box" title={list.length ? t('noProductsMatch') : t('noProductsYet')} sub={list.length ? t('tryOtherFilter') : t('addFirst')}>
              {!list.length ? <Button icon="plus" label={t('addProduct')} onPress={() => router.push({ pathname: '/product/[id]', params: { id: 'new' } })} style={styles.emptyBtn} /> : null}
            </Empty>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await load();
                setRefreshing(false);
              }}
            />
          }
        />
      )}

      {stockOf ? (
        stockOf.vr?.v.length ? (
          <VariantStockSheet p={stockOf} onClose={() => setStockOf(null)} onSaved={changed} />
        ) : (
          <StockSheet p={stockOf} onClose={() => setStockOf(null)} onSaved={changed} />
        )
      ) : null}
      {boostOf ? (
        <BoostSheet
          productId={boostOf.p.id}
          name={lang === 'bn' && boostOf.p.bn ? boostOf.p.bn : boostOf.p.name}
          rates={boostOf.rates}
          maxDays={boostOf.maxDays}
          onClose={() => setBoostOf(null)}
        />
      ) : null}
      {delOf ? (
        <Sheet title={t('deleteQ')} sub={lang === 'bn' && delOf.bn ? delOf.bn : delOf.name} onClose={() => setDelOf(null)}>
          <Txt size={14.5}>{t('deleteSub')}</Txt>
          <Button label={t('delete')} icon="trash" variant="dangerSolid" busy={delBusy} onPress={() => void remove()} />
          <Button label={t('cancel')} variant="ghost" onPress={() => setDelOf(null)} />
        </Sheet>
      ) : null}
    </View>
  );
}

function Sep() {
  return <View style={styles.sep} />;
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 14, paddingTop: 0, paddingBottom: 30, flexGrow: 1 },
  head: { marginHorizontal: -14, marginBottom: 10 },
  filters: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  fc: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 13, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  fcOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  cnt: { minWidth: 22, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: '#eef0f6', alignItems: 'center', justifyContent: 'center' },
  cntOn: { backgroundColor: colors.white },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 14, paddingHorizontal: 12, height: 48, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  searchIn: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 0 },
  emptyBtn: { marginTop: 14, alignSelf: 'stretch' },
  sep: { height: 10 },
});
