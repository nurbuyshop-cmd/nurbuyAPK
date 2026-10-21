import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Card, Empty, ErrorBox, Spinner } from '@/components/ui';
import { EarnChip, InvRow, Invoice } from '@/components/WalletParts';
import { dateTime, money } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { useLang } from '@/store/i18n';
import { salesGroups, useWallet } from '@/store/wallet';
import { colors } from '@/theme';

/** Sales invoice for one order: the seller's lines, discount, commission and net (website scrSinv()). */
export default function SalesInvoice() {
  const { t, n, lang } = useLang();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const data = useWallet((s) => s.data);
  const error = useWallet((s) => s.error);
  const seller = useAuth((s) => s.seller);

  useEffect(() => {
    void useWallet.getState().load();
  }, []);

  const g = useMemo(() => (data ? salesGroups(data.earnings).find((x) => x.id === id) : undefined), [data, id]);

  const share = () => {
    if (!g) return;
    const lines = [
      `NurBuy - ${t('salesInvoice')} INV-${g.id}`,
      `${t('seller')}: ${seller?.shop_name ?? ''}`,
      `${t('order')}: #${g.id} (${dateTime(g.at, lang)})`,
      ...g.lines.map((e) => `${e.pname}${e.variant ? ` (${e.variant})` : ''} x${n(e.qty)} = ${money(e.sale, lang)}${e.status === 'cancelled' ? ` [${t('cancelledLine')}]` : ''}`),
      `${t('saleAmount')}: ${money(g.sale, lang)}`,
      g.disc > 0 ? `${t('couponDisc')}: -${money(g.disc, lang)}` : '',
      `${t('nbCharges')}: -${money(g.com, lang)}`,
      `${t('netEarn')}: ${money(g.net, lang)}`,
    ].filter(Boolean);
    void Share.share({ message: lines.join('\n'), title: `INV-${g.id}` });
  };

  return (
    <View style={styles.flex}>
      <TopBar title={t('salesInvoice')} back backTo="/txns" />
      {!data ? (
        error ? <ErrorBox error={error} onRetry={() => void useWallet.getState().load()} /> : <Spinner />
      ) : !g ? (
        <Empty icon="receipt" title={t('invNotFound')} />
      ) : (
        <ScrollView contentContainerStyle={styles.page}>
          <Card right={<Button small icon="receipt" label={t('shareInvoice')} onPress={share} />}>
            <EarnChip st={g.st} />
          </Card>
          <Invoice title={t('salesInvoice')} no={`INV-${g.id}`}>
            <View style={styles.parties}>
              <View style={styles.grow}>
                <Txt size={12} color={colors.grey}>{t('seller')}</Txt>
                <Txt weight="bold" size={14.5}>{seller?.shop_name ?? ''}</Txt>
                <Txt size={13.5}>{seller?.owner_name ?? ''}</Txt>
                <Txt size={13}>{seller?.address ?? ''}</Txt>
              </View>
              <View style={styles.rightCol}>
                <Txt size={12} color={colors.grey}>{t('order')}</Txt>
                <Txt weight="bold" size={14} latin>{`#${g.id}`}</Txt>
                <Txt size={12.5} style={styles.right}>{dateTime(g.at, lang)}</Txt>
              </View>
            </View>
            {g.lines.map((e) => (
              <View key={e.id} style={[styles.line, e.status === 'cancelled' && styles.cx]}>
                <View style={styles.grow}>
                  <Txt size={14} weight="medium">{e.pname}</Txt>
                  {e.variant ? <Txt size={12.5} color={colors.grey}>{e.variant}</Txt> : null}
                  <Txt size={12.5} color={colors.grey}>{`${n(e.qty)} x ${money(e.unit, lang)}`}</Txt>
                  {e.status === 'cancelled' ? <Txt size={12.5} color={colors.danger}>{t('cancelledLine')}</Txt> : null}
                </View>
                <Txt weight="semibold" size={14}>{money(e.sale, lang)}</Txt>
              </View>
            ))}
            <InvRow k={t('saleAmount')} v={money(g.sale, lang)} />
            {g.disc > 0 ? <InvRow k={t('couponDisc')} v={`- ${money(g.disc, lang)}`} /> : null}
            <InvRow k={t('nbCharges')} v={`- ${money(g.com, lang)}`} />
            <InvRow k={t('netEarn')} v={money(g.net, lang)} strong />
            <Txt size={12.5} color={colors.grey}>{g.st === 'available' ? t('invAvail') : g.st === 'pending' ? t('invPending') : t('invCancelled')}</Txt>
            <Txt size={12} color={colors.grey}>{t('sysInvoice')}</Txt>
          </Invoice>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  grow: { flex: 1, minWidth: 0 },
  page: { padding: 14, gap: 12, paddingBottom: 30 },
  parties: { flexDirection: 'row', gap: 10 },
  rightCol: { alignItems: 'flex-end', maxWidth: '45%' },
  right: { textAlign: 'right' },
  line: { flexDirection: 'row', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eef0f6' },
  cx: { opacity: 0.6 },
});
