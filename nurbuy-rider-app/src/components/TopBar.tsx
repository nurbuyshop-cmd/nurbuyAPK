import { router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '@/store/i18n';
import { colors, TOUCH } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';

/** Sticky white bar with an optional round back button, a title and optional buttons on the right. */
export function TopBar({ title, back, backTo = '/home', right }: { title: string; back?: boolean; backTo?: Href; right?: ReactNode }) {
  const t = useT();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      {back ? (
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace(backTo))}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel={t('back')}
        >
          <Icon name="back" size={22} color={colors.text} strokeWidth={2.2} />
        </Pressable>
      ) : null}
      <Txt weight="bold" size={19} numberOfLines={1} style={styles.flex}>{title}</Txt>
      {right}
    </View>
  );
}

/** Small round language button (বাং / EN) used in bars. */
export function LangButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable onPress={onPress} style={styles.lang} accessibilityRole="button" accessibilityLabel="Language">
      <Icon name="globe" size={17} color={colors.primary} />
      <Txt weight="semibold" size={13.5} color={colors.primary}>{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 2,
  },
  back: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, backgroundColor: '#f1f3f9', alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, minWidth: 0 },
  lang: { flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 38, paddingHorizontal: 12, borderRadius: 19, backgroundColor: colors.infoBg },
});
