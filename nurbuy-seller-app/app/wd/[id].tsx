import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, Share, StyleSheet, View } from 'react-native';

import { withdrawal } from '@/api/wallet';
import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Banner, Card, ErrorBox, KV, Spinner } from '@/components/ui';
import { InvRow, Invoice, ProgressSteps, usePayLine, WdChip, type Step } from '@/components/WalletParts';
import { dateTime, money } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { useLang } from '@/store/i18n';
import { colors, radius } from '@/theme';

/** One withdrawal: amount, method, progress and (when paid) its invoice (website scrWd()). */
export default function WithdrawalPage() {
  const { t, n, f, lang } = useLang();
  const { id = '0' } = useLocalSearchParams<{ id: string }>();
  const { data, error, reload } = useLoad(`wd:${id}`, () => withdrawal(Number(id)));
  const payLine = usePayLine();
  const [refreshing, setRefreshing] = useState(false);

  if (!data) {
    return (
      <View style={styles.flex}>
        <TopBar title={t('withdrawal')} back backTo="/wallet" />
        {error ? <ErrorBox error={error} onRetry={() => void reload()} /> : <Spinner />}
      </View>
    );
  }
  const { w, seller } = data;
  const flow = ['pending', 'processing', 'completed'] as const;
  const cur = flow.indexOf(w.status as (typeof flow)[number]);
  const labels = [t('wfSent'), t('wfProcessing'), t('wfPaid')];
  const steps: Step[] =
    w.status === 'cancelled'
      ? [
          { label: t('wfSent'), state: 'done' },
          { label: t('wfCancelled'), state: 'bad' },
        ]
      : labels.map((label, i) => ({ label, state: i < cur ? 'done' : i === cur ? (w.status === 'completed' ? 'done' : 'cur') : 'todo' }));

  const share = () => {
    const lines = [
      `NurBuy - ${t('payInvoice')}`,
      `${t('wdId')}: ${w.no}`,
      `${t('paidTo')}: ${seller.shop_name} (${seller.owner_name}, ${seller.mobile})`,
      `${t('payMethod')}: ${w.method === 'bkash' ? t('bkash') : t('bankTransfer')}`,
      `${t('account')}: ${payLine(w, false)}`,
      `${t('reqDate')}: ${dateTime(w.created_at, lang)}`,
      `${t('payDate')}: ${dateTime(w.paid_at ?? 0, lang)}`,
      w.pay_ref ? `${t('txRef')}: ${w.pay_ref}` : '',
      `${t('amountPaid')}: ${money(w.amount, lang)}`,
      `${t('confirmedBy')}: ${w.admin_name || 'NurBuy'}`,
    ].filter(Boolean);
    void Share.share({ message: lines.join('\n'), title: w.no });
  };

  return (
    <View style={styles.flex}>
      <TopBar title={t('withdrawal')} back backTo="/wallet" />
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
            <Txt weight="bold" size={18} latin style={styles.flex}>{w.no}</Txt>
            <WdChip st={w.status} />
          </View>
          <View style={styles.amt}>
            <Txt size={13.5} color={colors.grey}>{t('amount')}</Txt>
            <Txt weight="bold" size={24}>{money(w.amount, lang)}</Txt>
          </View>
          <KV k={t('method')} v={payLine(w, true)} />
          <KV k={t('requested')} v={dateTime(w.created_at, lang)} />
          {w.paid_at ? <KV k={t('paidOn')} v={dateTime(w.paid_at, lang)} /> : null}
          {w.pay_ref ? <KV k={t('payRef')} v={w.pay_ref} /> : null}
          {w.admin_note ? <KV k={t('nbNote')} v={w.admin_note} /> : null}
        </Card>

        {w.status === 'cancelled' ? (
          <>
            <View style={styles.rsn}>
              <Txt weight="bold" size={13} color={colors.danger}>{t('whyCancelled')}</Txt>
              <Txt size={15}>{w.reason || '-'}</Txt>
            </View>
            <Banner tone="ok">{f('returnedBal', { a: money(w.amount, lang) })}</Banner>
          </>
        ) : null}

        <Card title={t('progress')}>
          <ProgressSteps steps={steps} />
        </Card>

        {w.status === 'completed' ? (
          <>
            <Card title={t('wdInvoiceT')} right={<Button small icon="receipt" label={t('shareInvoice')} onPress={share} />} />
            <Invoice title={t('payInvoice')} no={w.no}>
              <View style={styles.parties}>
                <View style={styles.flex}>
                  <Txt size={12} color={colors.grey}>{t('paidTo')}</Txt>
                  <Txt weight="bold" size={14.5}>{seller.shop_name}</Txt>
                  <Txt size={13.5}>{seller.owner_name}</Txt>
                  <Txt size={13.5}>{n(seller.mobile)}</Txt>
                </View>
                <View style={styles.rightCol}>
                  <Txt size={12} color={colors.grey}>{t('status')}</Txt>
                  <Txt weight="bold" size={13.5} color={colors.ok} style={styles.right}>{t('paidDone')}</Txt>
                </View>
              </View>
              <InvRow k={t('wdId')} v={w.no} />
              <InvRow k={t('payMethod')} v={w.method === 'bkash' ? t('bkash') : t('bankTransfer')} />
              <InvRow k={t('account')} v={payLine(w, false)} />
              <InvRow k={t('reqDate')} v={dateTime(w.created_at, lang)} />
              <InvRow k={t('payDate')} v={dateTime(w.paid_at ?? 0, lang)} />
              {w.pay_ref ? <InvRow k={t('txRef')} v={w.pay_ref} /> : null}
              <InvRow k={t('amountPaid')} v={money(w.amount, lang)} strong />
              <Txt size={13}>{`${t('confirmedBy')}: ${w.admin_name || 'NurBuy'}`}</Txt>
              <Txt size={12} color={colors.grey}>{t('sysInvoice')}</Txt>
            </Invoice>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0, backgroundColor: colors.bg },
  page: { padding: 14, gap: 12, paddingBottom: 30 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amt: { backgroundColor: '#f4f6fc', borderRadius: radius.md, padding: 12, marginVertical: 10, gap: 2 },
  rsn: { backgroundColor: colors.dangerBg, borderRadius: 14, padding: 14, gap: 4, borderLeftWidth: 4, borderLeftColor: colors.danger },
  parties: { flexDirection: 'row', gap: 10 },
  rightCol: { alignItems: 'flex-end', maxWidth: '45%' },
  right: { textAlign: 'right' },
});
