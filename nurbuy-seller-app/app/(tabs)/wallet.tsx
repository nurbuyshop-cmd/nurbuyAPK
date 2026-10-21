import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import type { Earning } from '@/api/wallet';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Sheet } from '@/components/Sheet';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Empty, ErrorBox, KV, Spinner } from '@/components/ui';
import { EarnChip, ListCard, WdCard } from '@/components/WalletParts';
import type { StringKey } from '@/i18n/en';
import { dateTime, money, pct } from '@/lib/format';
import { useLang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { useWallet } from '@/store/wallet';
import { colors, radius, shadow } from '@/theme';

type Tab = 'earn' | 'wd' | 'prod';

/** Balance, withdraw button, totals and the earnings / withdrawals / by-product lists (website scrWallet()). */
export default function Wallet() {
  const { t, n, lang } = useLang();
  const data = useWallet((s) => s.data);
  const error = useWallet((s) => s.error);
  const [tab, setTab] = useState<Tab>('earn');
  const [refreshing, setRefreshing] = useState(false);
  const [earn, setEarn] = useState<Earning | null>(null);

  useEffect(() => {
    void useWallet.getState().load();
  }, []);

  const reload = () => void useWallet.getState().load();

  return (
    <View style={styles.flex}>
      <TopBar title={t('wallet')} right={<Button small variant="secondary" icon="receipt" label={t('invoices')} onPress={() => router.push('/txns')} />} />
      {!data ? (
        error ? <ErrorBox error={error} onRetry={reload} /> : <Spinner />
      ) : (
        <ScrollView
          contentContainerStyle={styles.page}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await useWallet.getState().load();
                setRefreshing(false);
              }}
            />
          }
        >
          {(() => {
            const s = data.summary;
            const can = s.available >= s.min && s.available > 0;
            return (
              <>
                <View style={styles.bal}>
                  <Txt size={13.5} color="rgba(255,255,255,0.85)">{t('availBal')}</Txt>
                  <Txt weight="bold" size={30} color={colors.white}>{money(s.available, lang)}</Txt>
                  <Txt size={12.5} color="rgba(255,255,255,0.85)">
                    {`${t('minWithdraw')} ${money(s.min, lang)}${s.com_pct > 0 ? ` · ${t('nbCommission')} ${pct(s.com_pct, lang)}` : ''}`}
                  </Txt>
                  <Button
                    variant="orange"
                    icon="wallet"
                    label={t('withdraw')}
                    style={[styles.wbtn, !can && styles.dim]}
                    onPress={() => {
                      if (!can) toast(s.available > 0 ? t('wBelowMin') : t('wNoMoneyToast'), 'bad');
                      else router.push('/withdraw');
                    }}
                  />
                </View>
                {!can ? <Txt size={13} color={colors.grey}>{s.available <= 0 ? t('wNoMoney') : t('wBelowMin')}</Txt> : null}
                <View style={styles.grid}>
                  <Stat k={t('totalEarn')} v={money(s.total, lang)} sub={t('totalEarnSub')} tone={colors.ok} />
                  <Stat k={t('pendingAmt')} v={money(s.pending, lang)} sub={t('pendingAmtSub')} tone={colors.orange} />
                  <Stat k={t('pendingWd')} v={money(s.wd_pending, lang)} sub={t('pendingWdSub')} tone={colors.primary} />
                  <Stat k={t('withdrawn')} v={money(s.withdrawn, lang)} sub={t('withdrawnSub')} tone={colors.text} />
                </View>
              </>
            );
          })()}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
            {(
              [
                ['earn', 'tEarnings', data.earnings.length],
                ['wd', 'tWithdrawals', data.withdrawals.length],
                ['prod', 'tByProduct', data.by_product.length],
              ] as [Tab, StringKey, number][]
            ).map(([k, label, c]) => {
              const on = tab === k;
              return (
                <Pressable key={k} onPress={() => setTab(k)} style={[styles.fc, on && styles.fcOn]} accessibilityRole="tab" accessibilityState={{ selected: on }}>
                  <Txt weight="semibold" size={13.5} color={on ? colors.white : colors.text}>{t(label)}</Txt>
                  <View style={[styles.cnt, on && styles.cntOn]}>
                    <Txt weight="bold" size={11.5} color={on ? colors.primary : colors.grey}>{n(c)}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {tab === 'wd' ? (
            data.withdrawals.length ? (
              data.withdrawals.map((w) => <WdCard key={w.id} w={w} />)
            ) : (
              <Empty icon="wallet" title={t('noWds')} sub={t('noWdsSub')} />
            )
          ) : tab === 'prod' ? (
            data.by_product.length ? (
              data.by_product.map((p, i) => (
                <ListCard key={i}>
                  <Txt weight="semibold" size={15}>{p.pname}</Txt>
                  <View style={styles.pRow}>
                    <Txt size={13} color={colors.grey}>{`${t('qty')} ${n(p.qty)}`}</Txt>
                    <Txt size={13} color={colors.grey}>{`${t('sales')} ${money(p.sale, lang)}`}</Txt>
                    <Txt size={13} color={colors.grey}>{`${t('commission')} ${money(p.commission + p.disc, lang)}`}</Txt>
                  </View>
                  <View style={styles.pRow}>
                    <Txt size={14} weight="semibold">{t('netEarn')}</Txt>
                    <Txt size={16} weight="bold" color={colors.ok}>{money(p.net, lang)}</Txt>
                  </View>
                  {p.earned < p.net ? <Txt size={12.5} color={colors.grey}>{`${t('earned')} ${money(p.earned, lang)}`}</Txt> : null}
                </ListCard>
              ))
            ) : (
              <Empty icon="box" title={t('noSales')} />
            )
          ) : data.earnings.length ? (
            data.earnings.map((e) => (
              <ListCard key={e.id} onPress={() => setEarn(e)}>
                <View style={styles.pRow}>
                  <Txt weight="semibold" size={15} style={styles.flexT} numberOfLines={2}>
                    {e.pname}
                    {e.variant ? <Txt size={13} color={colors.grey}>{` (${e.variant})`}</Txt> : null}
                  </Txt>
                  <EarnChip st={e.status} />
                </View>
                <View style={styles.line}>
                  <Icon name="list" size={16} color={colors.grey} />
                  <Txt size={13.5} color={colors.grey}>{`#${e.order_id} · ${n(e.qty)} x ${money(e.unit, lang)}`}</Txt>
                </View>
                <View style={styles.pRow}>
                  <Txt size={13} color={colors.grey}>
                    {`${t('sale')} ${money(e.sale, lang)}${e.commission + e.disc > 0 ? `  - ${money(e.commission + e.disc, lang)}` : ''}`}
                  </Txt>
                  <Txt weight="bold" size={16} color={e.status === 'cancelled' ? colors.grey : colors.ok} style={e.status === 'cancelled' ? styles.strike : undefined}>
                    {money(e.net, lang)}
                  </Txt>
                </View>
              </ListCard>
            ))
          ) : (
            <Empty icon="wallet" title={t('noEarn')} sub={t('noEarnSub')} />
          )}
        </ScrollView>
      )}

      {earn ? (
        <Sheet title={t('earnDetails')} onClose={() => setEarn(null)}>
          <View>
            <KV k={t('product')} v={`${earn.pname}${earn.variant ? ` (${earn.variant})` : ''}`} />
            <KV k={t('orderId')} v={`#${earn.order_id}`} />
            <KV k={t('orderDate')} v={dateTime(earn.order_at, lang)} />
            <KV k={t('quantity')} v={`${n(earn.qty)} x ${money(earn.unit, lang)}`} />
            <KV k={t('saleAmount')} v={money(earn.sale, lang)} />
            {earn.disc > 0 ? <KV k={t('couponDisc')} v={`- ${money(earn.disc, lang)}`} /> : null}
            <KV k={`${t('commission')} (${pct(earn.com_pct, lang)})`} v={`- ${money(earn.commission, lang)}`} />
            <KV k={t('netEarn')} v={<Txt weight="bold" size={16} color={colors.ok}>{money(earn.net, lang)}</Txt>} />
            <KV k={t('status')} v={<EarnChip st={earn.status} />} />
            {earn.cleared_at ? <KV k={t('addedToBal')} v={dateTime(earn.cleared_at, lang)} /> : null}
          </View>
          <Button
            variant="secondary"
            icon="receipt"
            label={t('viewInvoice')}
            onPress={() => {
              const id = earn.order_id;
              setEarn(null);
              router.push({ pathname: '/sinv/[id]', params: { id } });
            }}
          />
          <Button
            variant="ghost"
            label={t('openOrder')}
            onPress={() => {
              const id = earn.order_id;
              setEarn(null);
              router.push({ pathname: '/order/[id]', params: { id } });
            }}
          />
        </Sheet>
      ) : null}
    </View>
  );
}

function Stat({ k, v, sub, tone }: { k: string; v: string; sub: string; tone: string }) {
  return (
    <View style={styles.stat}>
      <Txt size={12.5} color={colors.grey}>{k}</Txt>
      <Txt weight="bold" size={19} color={tone} numberOfLines={1} adjustsFontSizeToFit>{v}</Txt>
      <Txt size={11.5} color={colors.grey}>{sub}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  flexT: { flex: 1, minWidth: 0 },
  page: { padding: 14, gap: 10, paddingBottom: 30 },
  bal: { backgroundColor: colors.primary, borderRadius: radius.xl, padding: 18, gap: 4, ...shadow.card },
  wbtn: { marginTop: 10 },
  dim: { opacity: 0.6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { flexBasis: '47%', flexGrow: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: 12, gap: 3, borderWidth: 1, borderColor: colors.border },
  tabs: { gap: 8, paddingVertical: 4 },
  fc: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 13, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  fcOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  cnt: { minWidth: 22, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: '#eef0f6', alignItems: 'center', justifyContent: 'center' },
  cntOn: { backgroundColor: colors.white },
  pRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  strike: { textDecorationLine: 'line-through' },
});
