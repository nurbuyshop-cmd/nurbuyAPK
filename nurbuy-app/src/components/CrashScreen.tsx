import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useT } from '@/store/i18n';
import { colors } from '@/theme';

import { Button } from './Button';
import { Icon } from './Icon';
import { Txt } from './Txt';

/**
 * Shown instead of a white screen when a page fails unexpectedly. The customer can try again or go home.
 * The technical error is never shown to the customer.
 */
export function CrashScreen({ retry }: { retry: () => void | Promise<void> }) {
  const t = useT();
  return (
    <View style={styles.page}>
      <Icon name="info" size={56} color={colors.primary} />
      <Txt weight="bold" size={20} style={styles.center}>{t('crashTitle')}</Txt>
      <Txt size={14.5} color={colors.grey} style={styles.center}>{t('crashBody')}</Txt>
      <Button label={t('retry')} onPress={() => void retry()} style={styles.btn} />
      <Button
        label={t('goHome')}
        variant="outline"
        onPress={() => {
          void retry();
          router.replace('/');
        }}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
  center: { textAlign: 'center' },
  btn: { alignSelf: 'stretch', marginTop: 6 },
});
