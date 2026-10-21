import { router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { en, type StringKey } from '@/i18n/en';
import { digits, useI18n } from '@/store/i18n';
import { colors } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

const TABS: Record<string, { icon: IconName; label: StringKey }> = {
  index: { icon: 'navHome', label: 'tabHome' },
  category: { icon: 'navCategory', label: 'tabCategory' },
  wallet: { icon: 'navWallet', label: 'tabWallet' },
  cart: { icon: 'navCart', label: 'tabCart' },
  orders: { icon: 'navOrders', label: 'tabOrders' },
  profile: { icon: 'navProfile', label: 'tabProfile' },
};

const ORDER = ['index', 'category', 'wallet', 'cart', 'orders', 'profile'] as const;
const PATHS = { index: '/', category: '/category', wallet: '/wallet', cart: '/cart', orders: '/orders', profile: '/profile' } as const;

// screens that keep their own full-screen layout (keyboard, sign-in, pickers, checkout bar)
const NO_BAR = ['/auth', '/restricted', '/location', '/order-success', '/chat', '/checkout', '/search'];

/** Whether the bottom bar shows on this path. */
export const showsNavBar = (pathname: string): boolean => !NO_BAR.some((p) => pathname === p || pathname.startsWith(`${p}/`));

type TabName = (typeof ORDER)[number];

/**
 * The website's phone bottom bar on every page: black icons, the open tab in brand blue, orange cart badge.
 * A tapped tab turns blue at once and a thin line runs along the top of the bar until its page is open
 * (the first visit builds the page; later visits show the kept page straight away).
 */
export function NavBar({ cartCount }: { cartCount: number }) {
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  // the tab just tapped, and the page it was tapped on: while still on that page, the switch is in progress
  const [press, setPress] = useState<{ name: TabName; from: string } | null>(null);
  // once the page has changed the tap is finished (so coming back here later never lights the old tab again)
  const [seen, setSeen] = useState(pathname);
  if (seen !== pathname) {
    setSeen(pathname);
    if (press) setPress(null);
  }
  const loading = !!press && press.from === pathname;
  const current = ORDER.find((n) => PATHS[n] === pathname);
  const active = loading ? press.name : current;

  const go = (name: TabName) => {
    if (name === active) return;
    setPress({ name, from: pathname });
    // let the blue tab and the loading line draw first, then build the page
    setTimeout(() => router.navigate(PATHS[name]), 16);
    // never leave the line running if the page could not open
    setTimeout(() => setPress((p) => (p?.name === name ? null : p)), 8000);
  };

  return (
    <View style={[styles.bar, { paddingBottom: 8 + insets.bottom }]}>
      {loading ? <LoadingLine /> : null}
      {ORDER.map((name) => {
        const tab = TABS[name];
        if (!tab) return null;
        const on = active === name;
        const color = on ? colors.primary : '#000';
        return (
          <Pressable
            key={name}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={en[tab.label]}
            onPress={() => go(name)}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            <Icon name={tab.icon} size={26} color={color} />
            <Txt latin weight={on ? 'bold' : 'medium'} size={12.5} color={color} numberOfLines={1}>{en[tab.label]}</Txt>
            {name === 'cart' && cartCount > 0 ? (
              <View style={styles.badge}>
                <Txt weight="bold" size={10} color={colors.white}>{digits(cartCount > 99 ? '99+' : cartCount, lang)}</Txt>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

/** Thin brand-blue line sliding along the top edge of the bar while a page opens (runs on the animation thread). */
function LoadingLine() {
  const { width } = useWindowDimensions();
  const [t] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(t, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [t]);
  const x = t.interpolate({ inputRange: [0, 1], outputRange: [-width * 0.4, width] });
  return (
    <View style={styles.track} pointerEvents="none">
      <Animated.View style={[styles.line, { width: width * 0.4, transform: [{ translateX: x }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { position: 'absolute', top: -1, left: 0, right: 0, height: 2.5, overflow: 'hidden' },
  line: { height: '100%', borderRadius: 2, backgroundColor: colors.primary },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingHorizontal: 4,
    shadowColor: '#141e5a',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  item: { flex: 1, alignItems: 'center', gap: 2, minHeight: 48, justifyContent: 'center' },
  pressed: { transform: [{ scale: 0.92 }] },
  badge: {
    position: 'absolute',
    top: -3,
    right: '22%',
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
