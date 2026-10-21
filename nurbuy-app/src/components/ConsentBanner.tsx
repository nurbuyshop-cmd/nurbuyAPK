import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { needsConsent, useConsent } from '@/store/consent';
import { useT } from '@/store/i18n';
import { colors, TOUCH } from '@/theme';

import { Txt } from './Txt';

/** Privacy choice shown on first launch (same text and buttons as the website's cookie notice). */
export function ConsentBanner() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const show = useConsent(needsConsent);
  const setConsent = useConsent((s) => s.setConsent);
  if (!show) return null;

  return (
    <View style={[styles.wrap, { bottom: insets.bottom + 74 }]} accessibilityRole="alert" accessibilityLabel={t('consentTitle')}>
      <Txt weight="bold" size={15} style={styles.title}>{t('consentTitle')}</Txt>
      <Txt size={13.5} color="#222" style={styles.body}>{t('consentBody')}</Txt>
      <View style={styles.row}>
        <Pressable accessibilityRole="button" onPress={() => void setConsent(0)} style={[styles.btn, styles.ghost]}>
          <Txt weight="bold" size={13.5} color={colors.text}>{t('consentEssential')}</Txt>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => void setConsent(1)} style={[styles.btn, styles.pri]}>
          <Txt weight="bold" size={13.5} color={colors.white}>{t('consentAll')}</Txt>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e3e3e8',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  title: { marginBottom: 4 },
  body: { lineHeight: 20 },
  row: { flexDirection: 'row', gap: 8, marginTop: 12, justifyContent: 'flex-end' },
  btn: { minHeight: TOUCH, borderRadius: 22, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  ghost: { borderColor: colors.text, backgroundColor: colors.white },
  pri: { borderColor: colors.text, backgroundColor: colors.text },
});
