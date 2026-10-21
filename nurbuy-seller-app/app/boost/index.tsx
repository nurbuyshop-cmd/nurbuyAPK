import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ads } from '@/api/shop';
import { AccountBox, BoostCard, Ledger } from '@/components/BoostParts';
import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { Banner, Card, Empty, ErrorBox, Spinner } from '@/components/ui';
import { useLoad } from '@/lib/useLoad';
import { useLang } from '@/store/i18n';
import { colors } from '@/theme';

/** Boost account, all boosts and the charge history (website scrBoost()). */
export default function Boost() {
  const { t } = useLang();
  const { data, error, reload } = useLoad('ads', ads);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={styles.flex}>
      <TopBar title={t('boost')} back backTo="/profile" />
      {!data ? (
        error ? <ErrorBox error={error} onRetry={() => void reload()} /> : <Spinner />
      ) : (
        <ScrollView
          contentContainerStyle={styles.page}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await reload();
                setRefreshing(false);
              }}
            />
          }
        >
          <AccountBox a={data.account} />
          {!data.account.on ? <Banner tone="warn">{t('boostOff')}</Banner> : !data.account.can_run ? <Banner tone="warn">{t('boostNoMoney')}</Banner> : null}
          <Button icon="bolt" label={t('boostAProduct')} onPress={() => router.navigate({ pathname: '/products', params: { f: 'active' } })} />
          {data.campaigns.length ? (
            data.campaigns.map((c) => <BoostCard key={c.id} c={c} onChanged={() => void reload()} />)
          ) : (
            <Empty icon="bolt" title={t('noBoosts')} sub={t('noBoostsSub')} />
          )}
          <Card title={t('chargeHistory')}>
            <Ledger rows={data.ledger} />
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
