import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

import { liteOn, useLite } from '@/store/lite';
import { colors, radius } from '@/theme';

/** Grey placeholder block that pulses softly (no pulse in lite mode). Used while the first data is loading. */
export function SkeletonBlock({ w = '100%', h, r = 10, style }: { w?: DimensionValue; h: number; r?: number; style?: StyleProp<ViewStyle> }) {
  const lite = useLite(liteOn);
  const [op] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (lite) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(op, { toValue: 0.55, duration: 700, useNativeDriver: true }),
        Animated.timing(op, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [lite, op]);
  return <Animated.View style={[{ width: w, height: h, borderRadius: r, backgroundColor: '#e6e9f2', opacity: op }, style]} />;
}

/** The home page while the very first catalog loads: category circles and two product rows. */
export function HomeSkeleton() {
  return (
    <View style={styles.wrap} accessibilityLabel="loading" accessibilityRole="progressbar">
      <SkeletonBlock h={38} r={10} />
      <SkeletonBlock h={150} r={radius.lg} style={styles.gap} />
      <View style={[styles.row, styles.gap]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.cat}>
            <SkeletonBlock w={58} h={58} r={29} />
            <SkeletonBlock w={46} h={9} r={4} />
          </View>
        ))}
      </View>
      <ProductRowSkeleton />
      <ProductRowSkeleton />
    </View>
  );
}

function ProductRowSkeleton() {
  return (
    <View style={styles.gapBig}>
      <SkeletonBlock w={140} h={18} r={6} />
      <View style={[styles.row, styles.gap]}>
        {[0, 1].map((i) => (
          <View key={i} style={styles.card}>
            <SkeletonBlock h={150} r={22} />
            <SkeletonBlock w="70%" h={11} r={5} style={styles.line} />
            <SkeletonBlock h={13} r={5} style={styles.line} />
            <SkeletonBlock w="45%" h={15} r={5} style={styles.line} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 14, paddingTop: 10, backgroundColor: colors.bg },
  row: { flexDirection: 'row', gap: 12 },
  gap: { marginTop: 12 },
  gapBig: { marginTop: 22 },
  cat: { flex: 1, alignItems: 'center', gap: 6 },
  card: { flex: 1 },
  line: { marginTop: 8 },
});
