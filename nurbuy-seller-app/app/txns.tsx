import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import type { Tx } from '@/api/wallet';
import { Icon } from '@/components/Icon';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Empty, ErrorBox, Spinner } from '@/components/ui';
import { EarnChip, ListCard, TxIcon, WdCard } from '@/components/WalletParts';
import type { StringKey } from '@/i18n/en';
import { dateOnly, dateTime, money } from '@/lib/format';
import { useLang } from '@/store/i18n';
import { salesGroups, useWallet } from '@/store/wallet';
import { colors, radius } from '@/theme';

type Tab = 'stmt' | 'sales' | 'wdi';

const TXK: Record<string, StringKey> = { earn: 'txEarn', earn_rev: 'txEarnRev', wd_req: 'txWdReq', wd_cancel: 'txWdCancel', wd_done: 'txWdDone', ad: 'txAd' };

/** Statement, sales invoices (one per order) and paid withdrawal invoices (website scrTxns()). */
export default function Txns() {
  const { t, n, lang } = useLang();
  const data = useWallet((s) => s.data);
  const error = useWallet((s) => s.error);
  const [tab, setTab] = useState<Tab>('stmt');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    void useWallet.getState().load();
  }, []);

  const groups = useMemo(() => (data ? salesGroups(data.earnings) : []), [data]);
  const paid = useMemo(() => (data ? data.withdrawals.filter((w) => w.status === 'completed') : []), [data]);

  const openTx = (x: Tx) => {
    if (!x.ref) return;
    if (/^WD-/.test(x.ref)) router.push({ pathname: '/wd/[id]', params: { id: String(parseInt(x.ref.slice(3), 10)) } });
    else router.push({ pathname: '/sinv/[id]', params: { id: x.ref } });
  };

  return (
    <View style={styles.flex}>
      <TopBar title={t('txns')} back backTo="/wallet" />
      {!data ? (
        error ? <ErrorBox error={error} onRetry={() => void useWallet.getState().load()} /> : <Spinner />
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
            {(
              [
                ['stmt', 'tStatement', data.tx.length],
                ['sales', 'tSalesInv', groups.length],
                ['wdi', 'tWdInv', paid.length],
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

          {tab === 'sales' ? (
            groups.length ? (
              groups.map((g) => (
                <ListCard key={g.id} onPress={() => router.push({ pathname: '/sinv/[id]', params: { id: g.id } })}>
                  <View style={styles.row}>
                    <Txt weight="bold" size={15} latin style={styles.grow}>{`INV-${g.id}`}</Txt>
                    <EarnChip st={g.st} />
                  </View>
                  <View style={styles.row}>
                    <Icon name="box" size={16} color={colors.grey} />
                    <Txt size={13.5} style={styles.grow} numberOfLines={2}>{g.lines.map((e) => `${e.pname} x${n(e.qty)}`).join(', ')}</Txt>
                  </View>
                  <View style={styles.row}>
                    <Txt size={13} color={colors.grey}>{t('net')}</Txt>
                    <Txt weight="bold" size={16} color={colors.ok} style={styles.grow}>{money(g.net, lang)}</Txt>
                    <Txt size={12.5} color={colors.grey}>{dateOnly(g.at, lang)}</Txt>
                  </View>
                </ListCard>
              ))
            ) : (
              <Empty icon="receipt" title={t('noSalesInv')} />
            )
          ) : tab === 'wdi' ? (
            paid.length ? paid.map((w) => <WdCard key={w.id} w={w} />) : <Empty icon="receipt" title={t('noPaidWd')} />
          ) : data.tx.length ? (
            <View style={styles.stmt}>
              {data.tx.map((x) => {
                const k = TXK[x.kind];
                const sign = x.effect > 0 ? '+' : x.effect < 0 ? '-' : '';
                return (
                  <Pressable key={x.id} onPress={() => openTx(x)} disabled={!x.ref} style={({ pressed }) => [styles.txr, pressed && styles.pressed]}>
                    <TxIcon effect={x.effect} />
                    <View style={styles.grow}>
                      <Txt weight="semibold" size={14}>{k ? t(k) : x.kind}</Txt>
                      {x.ref || x.note ? <Txt size={12} color={colors.grey} latin={!x.note}>{`${x.ref}${x.note ? ` · ${x.note}` : ''}`}</Txt> : null}
                      <Txt size={12} color={colors.grey}>{dateTime(x.at, lang)}</Txt>
                    </View>
                    <View style={styles.right}>
                      <Txt weight="bold" size={15} color={x.effect > 0 ? colors.ok : x.effect < 0 ? colors.danger : colors.text}>{`${sign}${money(x.amount, lang)}`}</Txt>
                      <Txt size={11.5} color={colors.grey}>{`${t('balance')} ${money(x.bal, lang)}`}</Txt>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Empty icon="list" title={t('noTx')} />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  grow: { flex: 1, minWidth: 0 },
  page: { padding: 14, gap: 10, paddingBottom: 30 },
  tabs: { gap: 8, paddingVertical: 4 },
  fc: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 13, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  fcOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  cnt: { minWidth: 22, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: '#eef0f6', alignItems: 'center', justifyContent: 'center' },
  cntOn: { backgroundColor: colors.white },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stmt: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12 },
  txr: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  pressed: { opacity: 0.6 },
  right: { alignItems: 'flex-end' },
});
