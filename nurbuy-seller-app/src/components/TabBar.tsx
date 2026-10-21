import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDash } from '@/store/dash';
import { digits, useI18n } from '@/store/i18n';
import { colors } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

type Tab = { path: '/home' | '/products' | '/orders' | '/wallet' | '/profile'; icon: IconName; label: string; also?: string[] };

// labels stay in English in both languages, like the customer app's bottom bar
const TABS: Tab[] = [
  { path: '/home', icon: 'navHome', label: 'Home' },
  { path: '/products', icon: 'navBox', label: 'Products' },
  { path: '/orders', icon: 'navOrders', label: 'Orders', also: ['/order/'] },
  { path: '/wallet', icon: 'navWallet', label: 'Wallet', also: ['/wd/', '/txns', '/sinv/'] },
  { path: '/profile', icon: 'navProfile', label: 'Profile', also: ['/notifications', '/coupons', '/boost'] },
];

/** Pages that show the bottom bar. */
export const showsTabBar = (p: string): boolean => TABS.some((t) => p === t.path || (t.also ?? []).some((a) => p.startsWith(a)));

/** The seller website's phone bottom bar: the open tab in brand blue, orange badges for new orders and unread alerts. */
export function TabBar() {
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const newOrders = useDash((s) => s.dash?.stats.new ?? 0);
  const unread = useDash((s) => s.unread);

  return (
    <View style={[styles.bar, { paddingBottom: 8 + insets.bottom }]}>
      {TABS.map((tab) => {
        const on = pathname === tab.path || (tab.also ?? []).some((a) => pathname.startsWith(a));
        const color = on ? colors.primary : '#1b1f2e';
        const badge = tab.path === '/orders' ? newOrders : tab.path === '/profile' ? unread : 0;
        return (
          <Pressable
            key={tab.path}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={tab.label}
            onPress={() => {
              if (pathname !== tab.path) router.navigate(tab.path);
            }}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            <Icon name={tab.icon} size={25} color={color} />
            <Txt latin weight={on ? 'bold' : 'medium'} size={12.5} color={color} numberOfLines={1}>{tab.label}</Txt>
            {badge > 0 ? (
              <View style={styles.badge}>
                <Txt weight="bold" size={10} color={colors.white}>{digits(badge > 99 ? '99+' : badge, lang)}</Txt>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
    right: '20%',
    minWidth: 17,
    height: 17,
    paddingHorizontal: 3,
    borderRadius: 9,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
