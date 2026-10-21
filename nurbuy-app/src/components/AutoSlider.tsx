import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  AppState,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/theme';

const PAUSE = 6000;
// time an automatic slide takes on the phone before the copy -> real item jump is safe
const SETTLE = 900;

type Shape = { n: number; copies: number; step: number; loop: boolean };
type ScrollEvt = NativeSyntheticEvent<NativeScrollEvent>;

/**
 * Drives one slider. The finger is followed by the phone's own scrolling (never JavaScript), so drags and flicks stay
 * smooth on weak phones; this only starts the automatic slides and silently jumps from a copy back to the real item.
 */
class SliderControl {
  private view: ScrollView | null = null;
  private shape: Shape;
  private pos: number;
  private dragging = false;
  private placed = false;
  private pausedUntil = 0;
  private focused = true;
  private foreground = true;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private onShown: (i: number) => void = () => {};

  constructor(shape: Shape) {
    this.shape = shape;
    this.pos = shape.copies;
  }

  attach(v: ScrollView | null) {
    this.view = v;
  }

  update(shape: Shape, onShown: (i: number) => void) {
    const s = this.shape;
    this.shape = shape;
    this.onShown = onShown;
    // new items or a new screen width: start again on the first real item
    if (s.n !== shape.n || s.step !== shape.step || s.copies !== shape.copies) this.reset();
  }

  reset = () => {
    this.pos = this.shape.copies;
    this.view?.scrollTo({ x: this.pos * this.shape.step, animated: false });
  };

  /** Only the first layout places the row on the first real item (later ones, e.g. photos loading, must not move it). */
  laidOut = () => {
    if (this.placed) return;
    this.placed = true;
    this.reset();
  };

  setFocused(on: boolean) {
    this.focused = on;
  }

  setForeground(on: boolean) {
    this.foreground = on;
  }

  /** One automatic step forward, unless the customer is touching it or it is off screen. */
  tick() {
    if (!this.view || !this.focused || !this.foreground || this.dragging || Date.now() < this.pausedUntil) return;
    const p = this.pos + 1;
    this.pos = p;
    this.view.scrollTo({ x: p * this.shape.step, animated: true });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.landed(p), SETTLE);
  }

  dragStart = () => {
    this.dragging = true;
    this.pausedUntil = Date.now() + PAUSE;
    clearTimeout(this.timer);
  };

  dragEnd = (e: ScrollEvt) => {
    this.dragging = false;
    this.pausedUntil = Date.now() + PAUSE;
    // a release without a flick may not send a "momentum end", so check a moment later as well
    const x = e.nativeEvent.contentOffset.x;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.landed(Math.round(x / this.shape.step)), 450);
  };

  momentumStart = () => clearTimeout(this.timer);

  momentumEnd = (e: ScrollEvt) => {
    clearTimeout(this.timer);
    this.landed(Math.round(e.nativeEvent.contentOffset.x / this.shape.step));
  };

  stop() {
    clearTimeout(this.timer);
  }

  private landed(p: number) {
    if (this.dragging) return;
    const { n, copies, step, loop } = this.shape;
    let q = p;
    if (loop) {
      // on a copy: move to the identical real item without animation (the customer sees no change)
      if (q >= n + copies) q -= n;
      else if (q < copies) q += n;
      if (q !== p) this.view?.scrollTo({ x: q * step, animated: false });
    }
    this.pos = q;
    this.onShown(q - copies);
  }
}

type Props<T> = {
  data: T[];
  keyOf: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  /** width of one item */
  itemWidth: number;
  gap?: number;
  /** space before the first item */
  padding?: number;
  /** items fully on screen at once; with this many or fewer the row stays still */
  visible?: number;
  /** slides by itself (false: only follows the finger) */
  auto?: boolean;
  /** ms between automatic slides */
  interval?: number;
  /** page dots under the slider (photo gallery) */
  dots?: boolean;
  /** called with the first visible item's index after every slide (and once at the start) */
  onIndex?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * A row that slides by itself, round and round in one direction (after the last item the first comes in from the
 * right), and can be swiped. Copies of the first and last items sit at both ends so the jump back is never seen.
 */
export function AutoSlider<T>({
  data,
  keyOf,
  renderItem,
  itemWidth,
  gap = 0,
  padding = 0,
  visible = 1,
  auto = true,
  interval = 3200,
  dots = false,
  onIndex,
  style,
}: Props<T>) {
  const n = data.length;
  const loop = n > visible;
  const copies = loop ? Math.min(n, visible + 1) : 0;
  const step = itemWidth + gap;
  const items = useMemo(
    () => (loop ? [...data.slice(n - copies), ...data, ...data.slice(0, copies)] : data),
    [data, loop, n, copies],
  );

  const [ctl] = useState(() => new SliderControl({ n, copies, step, loop }));
  const [shown, setShown] = useState(0);

  const view = useRef<ScrollView>(null);

  useEffect(() => {
    ctl.attach(view.current);
    ctl.update({ n, copies, step, loop }, (i) => {
      if (dots) setShown(i);
      onIndex?.(i);
    });
  });

  // pause while another screen is on top or the app is in the background
  useFocusEffect(
    useCallback(() => {
      ctl.setFocused(true);
      return () => ctl.setFocused(false);
    }, [ctl]),
  );
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => ctl.setForeground(s === 'active'));
    return () => {
      sub.remove();
      ctl.stop();
    };
  }, [ctl]);

  useEffect(() => {
    if (!loop || !auto) return;
    const id = setInterval(() => ctl.tick(), interval);
    return () => clearInterval(id);
  }, [ctl, loop, auto, interval]);

  useEffect(() => {
    onIndex?.(0);
    // report the first items once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // drawn once; the dots changing does not redraw the items
  const cells = useMemo(
    () =>
      items.map((item, i) => (
        <View key={`${keyOf(item)}~${i}`} style={{ width: itemWidth, marginRight: gap }}>
          {renderItem(item, loop ? (((i - copies) % n) + n) % n : i)}
        </View>
      )),
    [items, keyOf, renderItem, itemWidth, gap, loop, copies, n],
  );

  if (!loop) {
    return <View style={[styles.row, { paddingLeft: padding, paddingRight: Math.max(0, padding - gap) }, style]}>{cells}</View>;
  }

  return (
    <View style={style}>
      <ScrollView
        ref={view}
        horizontal
        showsHorizontalScrollIndicator={false}
        // the phone's own scrolling, stopping on a whole item, one item per swipe
        snapToInterval={step}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        overScrollMode="never"
        contentOffset={{ x: copies * step, y: 0 }}
        onLayout={ctl.laidOut}
        onScrollBeginDrag={ctl.dragStart}
        onScrollEndDrag={ctl.dragEnd}
        onMomentumScrollBegin={ctl.momentumStart}
        onMomentumScrollEnd={ctl.momentumEnd}
        contentContainerStyle={{ paddingLeft: padding, paddingRight: Math.max(0, padding - gap) }}
      >
        {cells}
      </ScrollView>
      {dots ? (
        <View style={styles.dots} pointerEvents="none">
          {data.map((item, i) => <View key={`${keyOf(item)}~${i}`} style={[styles.dot, i === shown && styles.dotOn]} />)}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  dots: { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.2)' },
  dotOn: { width: 18, backgroundColor: colors.primary },
});
