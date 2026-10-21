import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Product } from '@/api/catalog';
import type { CatalogIndex } from '@/lib/products';
import { useCardSizes } from '@/lib/useIndex';
import { fmt, useI18n, useT } from '@/store/i18n';
import { colors } from '@/theme';

import { Button } from './Button';
import { Icon } from './Icon';
import { ProductCard } from './ProductCard';
import { Txt } from './Txt';

const BATCH = 30;
const keyOf = (p: Product) => p.id;

type Props = {
  items: Product[];
  index: CatalogIndex;
  header?: ReactElement;
  emptyText?: string;
  /** false: an empty list shows nothing (search page before anything is typed) */
  showEmpty?: boolean;
  onItemLongPress?: (p: Product) => void;
};

/**
 * Two-column product grid with "Load More" in batches of 30, like the website's All Products page.
 * A new item list starts again from the first batch and the top, without a remount (on the search page a remount on
 * every letter made the keyboard drop and come back).
 */
export function ProductGrid({ items, index, header, emptyText, showEmpty = true, onItemLongPress }: Props) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const { gridImg, gap, pad } = useCardSizes();
  const [batch, setBatch] = useState({ items, shown: BATCH });
  const shown = batch.items === items ? batch.shown : BATCH;
  // the same list object between redraws, so the grid does not lay itself out again for nothing
  const data = useMemo(() => items.slice(0, shown), [items, shown]);
  const rem = items.length - data.length;
  const list = useRef<FlashListRef<Product>>(null);
  useEffect(() => {
    list.current?.scrollToOffset({ offset: 0, animated: false });
  }, [items]);

  const render = useCallback(
    ({ item, index: i }: { item: Product; index: number }) => (
      <View style={[styles.cell, i % 2 ? { paddingLeft: gap / 2 } : { paddingRight: gap / 2 }]}>
        <ProductCard
          p={item}
          store={index.storeByName.get(item.sh)}
          badge={index.badges.get(item.id)}
          imgWidth={gridImg}
          onLongPress={onItemLongPress ? () => onItemLongPress(item) : undefined}
        />
      </View>
    ),
    [index, gridImg, gap, onItemLongPress],
  );

  return (
    <FlashList
      ref={list}
      data={data}
      numColumns={2}
      keyExtractor={keyOf}
      drawDistance={400}
      renderItem={render}
      contentContainerStyle={{ paddingHorizontal: pad, paddingTop: 10, paddingBottom: 32 }}
      ListHeaderComponent={
        <View>
          {header}
          {items.length ? <Txt size={13} color={colors.grey} style={styles.count}>{fmt(t('showing'), { a: data.length, b: items.length }, lang)}</Txt> : null}
        </View>
      }
      ListEmptyComponent={
        showEmpty ? (
          <View style={styles.empty}>
            <Icon name="search" size={40} color={colors.grey} />
            <Txt size={14} color={colors.grey} style={styles.center}>{emptyText ?? t('noProducts')}</Txt>
          </View>
        ) : null
      }
      ListFooterComponent={
        rem > 0 ? <Button label={`${t('loadMore')} (${fmt('{n}', { n: Math.min(rem, BATCH) }, lang)})`} variant="outline" onPress={() => setBatch({ items, shown: shown + BATCH })} /> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, marginBottom: 18 },
  count: { marginBottom: 10 },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 48 },
  center: { textAlign: 'center' },
});
