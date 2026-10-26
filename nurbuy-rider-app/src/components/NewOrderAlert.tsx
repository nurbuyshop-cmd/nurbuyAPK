import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Vibration } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDash } from '@/store/dash';
import { useLang } from '@/store/i18n';
import { colors } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';

/**
 * Orange "New order assigned to you" bar at the top of any page for 6 s after new assignments arrive (with the chime and a
 * vibration like the website's alertNew()); a tap opens the pending orders.
 */
export function NewOrderAlert() {
  const { t, f } = useLang();
  const insets = useSafeAreaInsets();
  const alert = useDash((s) => s.alert);
  const [shown, setShown] = useState(0);
  const visible = alert.id > 0 && alert.id !== shown;

  useEffect(() => {
    if (!visible) return;
    Vibration.vibrate([0, 200, 100, 200]);
    const id = setTimeout(() => setShown(alert.id), 6000);
    return () => clearTimeout(id);
  }, [visible, alert.id]);

  if (!visible) return null;
  return (
    <Pressable
      onPress={() => {
        setShown(alert.id);
        router.navigate({ pathname: '/orders', params: { tab: 'pending' } });
      }}
      style={[styles.bar, { top: insets.top + 8 }]}
      accessibilityRole="alert"
    >
      <Icon name="bell" size={22} color={colors.white} />
      <Txt weight="bold" size={15} color={colors.white} style={styles.flex}>
        {alert.count > 1 ? f('newOrderMany', { n: alert.count }) : t('newOrderOne')}
      </Txt>
      <Icon name="chevron" size={18} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.orange,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 54,
    zIndex: 960,
    elevation: 60,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  flex: { flex: 1 },
});
