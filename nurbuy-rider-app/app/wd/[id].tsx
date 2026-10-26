import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { withdrawal } from '@/api/rider';
import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Banner, Card, ErrorBox, KV, Spinner } from '@/components/ui';
import { BKT, WdChip } from '@/components/WalletParts';
import { dateTime, money } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { useLang } from '@/store/i18n';
import { colors, radius } from '@/theme';

/** One withdrawal request: amount, where the money goes, when it was asked / paid (website scrWd()). */
export default function WithdrawalPage() {
  const { t, n, lang } = useLang();
  const { id = '0' } = useLocalSearchParams<{ id: string }>();
  const { data: w, error, reload } = useLoad(`wd:${id}`, () => withdrawal(Number(id)));
  const [refreshing, setRefreshing] = useState(false);

  if (!w) {
    return (
      <View style={styles.flex}>
        <TopBar title={t('withdrawal')} back backTo="/earnings" />
        {error ? <ErrorBox error={error} onRetry={() => void reload()} /> : <Spinner />}
      </View>
    );
  }
  const x = w.details;
  const bt = x.acc_type ? BKT[x.acc_type] : undefined;

  return (
    <View style={styles.flex}>
      <TopBar title={t('withdrawal')} back backTo="/earnings" />
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
        <Card>
          <View style={styles.head}>
            <View style={styles.grow}>
              <Txt size={13} color={colors.grey} latin>{w.no}</Txt>
              <Txt weight="bold" size={26}>{money(w.amount, lang)}</Txt>
            </View>
            <WdChip st={w.status} />
          </View>
          <KV k={t('method')} v={w.method === 'bkash' ? t('bkash') : t('bankAcc')} />
          {w.method === 'bkash' ? (
            <>
              <KV k={t('bkashNumber')} v={n(x.number ?? '')} />
              {bt ? <KV k={t('accType')} v={t(bt)} /> : null}
              {x.acc_name ? <KV k={t('name')} v={x.acc_name} /> : null}
            </>
          ) : (
            <>
              <KV k={t('accHolderShort')} v={x.holder ?? ''} />
              <KV k={t('bank')} v={x.bank ?? ''} />
              <KV k={t('branch')} v={x.branch ?? ''} />
              <KV k={t('accNumber')} v={n(x.acc_no ?? '')} />
            </>
          )}
          <KV k={t('requested')} v={dateTime(w.created_at, lang)} />
          {w.status === 'completed' && w.paid_at ? <KV k={t('paidOn')} v={dateTime(w.paid_at, lang)} /> : null}
          {w.pay_ref ? <KV k={t('payRef')} v={w.pay_ref} /> : null}
        </Card>

        {w.status === 'cancelled' && w.reason ? <Banner tone="bad">{w.reason}</Banner> : null}
        {w.status === 'pending' || w.status === 'processing' ? <Banner>{t('wdReviewing')}</Banner> : null}

        <Button label={t('backToEarnings')} variant="secondary" onPress={() => (router.canGoBack() ? router.back() : router.replace('/earnings'))} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  page: { padding: 14, gap: 12, paddingBottom: 30 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f4f6fc', borderRadius: radius.md, padding: 12, marginBottom: 6 },
  grow: { flex: 1, minWidth: 0 },
});
