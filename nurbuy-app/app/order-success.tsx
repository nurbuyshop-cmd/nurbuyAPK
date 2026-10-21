import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { money } from '@/lib/money';
import { fmt, useI18n, useT } from '@/store/i18n';
import { colors } from '@/theme';

/** Shown right after an order is placed. */
export default function OrderSuccessScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const { id, eta, bonus } = useLocalSearchParams<{ id: string; eta?: string; bonus?: string }>();
  const mins = Number(eta) || 59;
  const cb = Number(bonus) || 0;
  return (
    <View style={[styles.page, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.icon}>
        <Icon name="check" size={46} color={colors.white} strokeWidth={3} />
      </View>
      <Txt weight="bold" size={24} style={styles.center}>{t('orderPlaced')}</Txt>
      <Txt size={15} color={colors.grey} style={styles.center}>
        {t('orderId') + ': '}
        <Txt weight="bold" size={15}>{id}</Txt>
      </Txt>
      <View style={styles.eta}>
        <Icon name="bolt" size={20} color="#8a5a00" />
        <Txt weight="bold" size={15} color="#8a5a00">{fmt(t('arrivingWithin'), { n: mins }, lang)}</Txt>
      </View>
      {cb > 0 ? <Txt size={14} color="#12a150" style={styles.center}>{fmt(t('bonusAfter'), { v: money(cb, lang) }, lang)}</Txt> : null}
      <View style={styles.flex} />
      <Button label={t('trackOrder')} onPress={() => router.replace({ pathname: '/order/[id]', params: { id: id ?? '' } })} />
      <Button label={t('continueShopping')} variant="outline" onPress={() => router.replace('/')} style={styles.second} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 20, gap: 12 },
  icon: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#12a150', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  center: { textAlign: 'center' },
  eta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff3c4', borderRadius: 14, padding: 14, marginTop: 8 },
  flex: { flex: 1 },
  second: { marginTop: 4 },
});
