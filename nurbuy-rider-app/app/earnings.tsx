import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { earnings } from '@/api/rider';
import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Banner, Card, ErrorBox, Spinner } from '@/components/ui';
import { WdCard } from '@/components/WalletParts';
import { dateTime, money } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { useRefocus } from '@/lib/useRefocus';
import { useLang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { useWallet } from '@/store/wallet';
import { colors, radius, shadow } from '@/theme';

/** Delivery earnings: balance with Withdraw, totals, withdrawals and each order's payment (website scrEarnings()). */
export default function Earnings() {
  const { t, n, lang } = useLang();
  const earn = useLoad('earnings', earnings);
  const wal = useWallet((s) => s.data);
  const walErr = useWallet((s) => s.error);
  const [refreshing, setRefreshing] = useState(false);
  const reloadEarn = earn.reload;
  useRefocus(reloadEarn);

  // fresh numbers each time the page opens (also when coming back from a withdraw request)
  useFocusEffect(
    useCallback(() => {
      void useWallet.getState().load();
    }, []),
  );

  const reload = async () => {
    await Promise.all([reloadEarn(), useWallet.getState().load()]);
  };

  const d = earn.data;
  if (!d || !wal) {
    const e = earn.error ?? walErr;
    return (
      <View style={styles.flex}>
        <TopBar title={t('earnings')} back />
        {e ? <ErrorBox error={e} onRetry={() => void reload()} /> : <Spinner />}
      </View>
    );
  }
  const s = d.summary;
  const ws = wal.summary;
  const can = ws.available >= ws.min && ws.available > 0;

  const start = () => {
    if (!can) {
      toast(ws.available <= 0 ? t('noBalance') : t('belowMinBal'), 'bad');
      return;
    }
    router.push('/withdraw');
  };

  return (
    <View style={styles.flex}>
      <TopBar title={t('earnings')} back />
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
        <View style={styles.bal}>
          <View style={styles.grow}>
            <Txt size={13.5} color="rgba(255,255,255,0.85)">{t('availBalance')}</Txt>
            <Txt weight="bold" size={28} color={colors.white}>{money(ws.available, lang)}</Txt>
            <Txt size={12.5} color="rgba(255,255,255,0.85)">{`${t('minWithdraw')} ${money(ws.min, lang)}`}</Txt>
          </View>
          <Button label={t('withdraw')} icon="up" variant="orange" onPress={start} style={!can && styles.dim} />
        </View>
        {!can ? <Txt size={13} color={colors.grey}>{ws.available <= 0 ? t('noBalanceSub') : t('belowMinSub')}</Txt> : null}

        <View style={styles.tiles}>
          <Tile k={t('today')} v={money(s.today, lang)} />
          <Tile k={t('last7')} v={money(s.week, lang)} />
          <Tile k={t('thisMonth')} v={money(s.month, lang)} />
          <Tile k={t('allTime')} v={money(s.total, lang)} />
          <Tile k={t('pendingWd')} v={money(ws.wd_pending, lang)} />
          <Tile k={t('withdrawn')} v={money(ws.withdrawn, lang)} />
        </View>

        <Banner>{t('earnInfo')}</Banner>

        <Card title={t('withdrawals')}>
          {wal.withdrawals.length ? (
            <View style={styles.list}>
              {wal.withdrawals.map((w) => (
                <WdCard key={w.id} w={w} />
              ))}
            </View>
          ) : (
            <Txt color={colors.grey}>{t('noWithdrawals')}</Txt>
          )}
        </Card>

        <Card title={t('payments')}>
          {d.items.length ? (
            d.items.map((x, i) => (
              <Pressable key={`${x.order_id}-${i}`} onPress={() => router.push({ pathname: '/order/[id]', params: { id: x.order_id } })} style={({ pressed }) => [styles.pay, pressed && styles.pressed]} accessibilityRole="button">
                <View style={styles.grow}>
                  <Txt weight="semibold" size={14.5}>{`#${n(x.order_id)}`}</Txt>
                  <Txt size={12.5} color={colors.grey}>{`${x.area ? `${x.area} · ` : ''}${dateTime(x.at, lang)}`}</Txt>
                </View>
                <Txt weight="bold" size={14.5}>{money(x.amount, lang)}</Txt>
              </Pressable>
            ))
          ) : (
            <Txt color={colors.grey}>{t('noPayments')}</Txt>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

function Tile({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.tile}>
      <Txt size={13} color={colors.grey}>{k}</Txt>
      <Txt weight="bold" size={19}>{v}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  page: { padding: 14, gap: 12, paddingBottom: 30 },
  grow: { flex: 1, minWidth: 0 },
  bal: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.primary, borderRadius: radius.lg, padding: 16 },
  dim: { opacity: 0.6 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '48%', flexGrow: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: 13, borderWidth: 1, borderColor: colors.border, gap: 2, ...shadow.card },
  list: { gap: 10 },
  pay: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eef1f8' },
  pressed: { opacity: 0.6 },
});
