import { StyleSheet, View } from 'react-native';

import { useCatalog } from '@/store/catalog';
import { useT } from '@/store/i18n';
import { colors } from '@/theme';

import { Button } from './Button';
import { HomeSkeleton } from './Skeleton';
import { Txt } from './Txt';

/** Shown while the very first catalog loads (grey placeholders), or when it could not load and nothing is cached. */
export function CatalogState() {
  const t = useT();
  const error = useCatalog((s) => s.error);
  const refresh = useCatalog((s) => s.refresh);
  if (!error) return <HomeSkeleton />;
  return (
    <View style={styles.box}>
      <Txt size={15} color={colors.grey} style={styles.text}>{t('catLoadError')}</Txt>
      <Button label={t('retry')} variant="outline" onPress={() => void refresh()} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 32, alignItems: 'center', justifyContent: 'center', gap: 14 },
  text: { textAlign: 'center', lineHeight: 22 },
  btn: { alignSelf: 'stretch' },
});
