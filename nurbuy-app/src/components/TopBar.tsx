import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '@/store/i18n';
import { colors, TOUCH } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';

/** Sticky white bar with a round back button, a title and optional buttons on the right. */
export function TopBar({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  const t = useT();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        style={styles.back}
        accessibilityRole="button"
        accessibilityLabel={t('back')}
      >
        <Icon name="back" size={22} color={colors.text} strokeWidth={2} />
      </Pressable>
      <View style={styles.flex}>
        <Txt weight="bold" size={18} numberOfLines={1}>{title}</Txt>
        {sub ? <Txt size={12.5} color={colors.grey} numberOfLines={1}>{sub}</Txt> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
    zIndex: 2,
  },
  back: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, backgroundColor: '#f1f3f9', alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, minWidth: 0 },
});
