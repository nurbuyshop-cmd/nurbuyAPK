import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ads } from '@/api/shop';
import { BoostCard, Ledger } from '@/components/BoostParts';
import { TopBar } from '@/components/TopBar';
import { Card, Empty, ErrorBox, Spinner } from '@/components/ui';
import { useLoad } from '@/lib/useLoad';
import { useLang } from '@/store/i18n';
import { colors } from '@/theme';

/** One boost with its own charges. */
export default function BoostDetail() {
  const { t } = useLang();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { data, error, reload } = useLoad('ads', ads);
  const c = data?.campaigns.find((x) => String(x.id) === id);

  return (
    <View style={styles.flex}>
      <TopBar title={t('boost')} back backTo="/boost" />
      {!data ? (
        error ? <ErrorBox error={error} onRetry={() => void reload()} /> : <Spinner />
      ) : !c ? (
        <Empty icon="bolt" title={t('boostNotFound')} />
      ) : (
        <ScrollView contentContainerStyle={styles.page}>
          <BoostCard c={c} full onChanged={() => void reload()} />
          <Card title={t('boostCharges')}>
            <Ledger rows={data.ledger.filter((r) => r.campaign_id === c.id)} />
          </Card>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  page: { padding: 14, gap: 12, paddingBottom: 30 },
});
