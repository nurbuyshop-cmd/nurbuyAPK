import { memo, useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';

import type { Product } from '@/api/catalog';
import type { CatalogIndex } from '@/lib/products';
import { useCardSizes } from '@/lib/useIndex';

import { ProductCard } from './ProductCard';

type Props = { items: Product[]; index: CatalogIndex };

const keyOf = (p: Product) => p.id;

/**
 * Home section row of product cards, swiped by hand and stopping on whole cards. It is the phone's own scrolling and
 * only the cards near the screen are drawn, so it stays smooth on weak phones.
 */
function ProductRowImpl({ items, index }: Props) {
  const { row, rowImg, gap, pad } = useCardSizes();
  const { width } = useWindowDimensions();
  const step = row + gap;
  const visible = Math.max(1, Math.ceil((width - pad) / step));
  const render = useCallback(
    ({ item }: { item: Product }) => (
      <View style={{ width: row, marginRight: gap }}>
        <ProductCard p={item} store={index.storeByName.get(item.sh)} badge={index.badges.get(item.id)} imgWidth={rowImg} />
      </View>
    ),
    [index, rowImg, row, gap],
  );
  const layout = useCallback((_: unknown, i: number) => ({ length: step, offset: pad + step * i, index: i }), [step, pad]);
  const content = useMemo(() => ({ paddingLeft: pad, paddingRight: Math.max(0, pad - gap) }), [pad, gap]);

  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={keyOf}
      renderItem={render}
      getItemLayout={layout}
      showsHorizontalScrollIndicator={false}
      snapToInterval={step}
      snapToAlignment="start"
      decelerationRate="fast"
      overScrollMode="never"
      contentContainerStyle={content}
      // a few cards beyond the screen are ready, the rest are drawn as the finger moves
      initialNumToRender={visible + 1}
      maxToRenderPerBatch={4}
      updateCellsBatchingPeriod={30}
      windowSize={5}
      removeClippedSubviews
      style={styles.row}
    />
  );
}

const styles = StyleSheet.create({
  row: { paddingBottom: 6 },
});

export const ProductRow = memo(ProductRowImpl);
