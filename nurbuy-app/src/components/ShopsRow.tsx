import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';

import type { Store } from '@/api/catalog';

import { AutoSlider } from './AutoSlider';
import { ShopCard } from './ShopCard';

const GAP = 12;
// the home row shows the first shops only ("View all" lists every shop), which keeps the page light on weak phones
const MAX = 15;
const keyOf = (s: Store) => s.id;
const renderShop = (s: Store) => <ShopCard s={s} />;

/** Home "Best Shops" row: one wide shop card at a time that slides by itself, round and round. */
export function ShopsRow({ stores }: { stores: Store[] }) {
  const { width } = useWindowDimensions();
  const card = Math.round(width * 0.86);
  const list = useMemo(() => stores.slice(0, MAX), [stores]);
  return (
    <AutoSlider
      data={list}
      keyOf={keyOf}
      renderItem={renderShop}
      itemWidth={card}
      gap={GAP}
      padding={14}
      visible={1}
      interval={3800}
      style={styles.row}
    />
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 4 },
});
