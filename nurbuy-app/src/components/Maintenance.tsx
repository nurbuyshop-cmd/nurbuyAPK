import { StyleSheet, View } from 'react-native';

import { useCatalog } from '@/store/catalog';
import { useT } from '@/store/i18n';
import { colors } from '@/theme';

import { Button } from './Button';
import { Icon } from './Icon';
import { Txt } from './Txt';

/** Covers the app while the admin has maintenance switched on (settings.maint); it lifts on the next catalog refresh. */
export function Maintenance() {
  const t = useT();
  const on = useCatalog((s) => s.catalog?.settings.maint === true);
  if (!on) return null;
  return (
    <View style={styles.page} accessibilityViewIsModal>
      <Icon name="tool" size={56} color={colors.primary} />
      <Txt weight="bold" size={22} style={styles.center}>{t('maintTitle')}</Txt>
      <Txt size={15} color="#556" style={styles.center}>{t('maintBody')}</Txt>
      <Button label={t('retry')} variant="outline" onPress={() => void useCatalog.getState().refresh()} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10, zIndex: 1000, elevation: 50 },
  center: { textAlign: 'center' },
  btn: { alignSelf: 'stretch', marginTop: 12 },
});
