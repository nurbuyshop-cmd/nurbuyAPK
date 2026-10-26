import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { orders } from '@/api/rider';
import { OrderCard } from '@/components/OrderParts';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Empty, ErrorBox, Spinner } from '@/components/ui';
import { useLoad } from '@/lib/useLoad';
import { useAuth } from '@/store/auth';
import { useDash } from '@/store/dash';
import { useLang } from '@/store/i18n';
import { colors } from '@/theme';

type Tab = 'pending' | 'active';

/** New assignments to accept or reject, and the running deliveries (website scrOrders()). */
export default function Orders() {
  const { t, n } = useLang();
  const params = useLocalSearchParams<{ tab?: string }>();
  // the open list lives in the address so "Tap to accept or reject" and the new-order bar can open Pending
  const tab: Tab = params.tab === 'active' ? 'active' : 'pending';
  const setTab = (k: Tab) => router.setParams({ tab: k });
  const online = useAuth((s) => !!s.rider?.online);
  const dash = useDash((s) => s.dash);
  const tick = useDash((s) => s.tick);
  const { data, error, reload } = useLoad(`orders-${tab}`, () => orders(tab));
  const [refreshing, setRefreshing] = useState(false);


  // the 15-second check refreshes the open list (website pollTick()), and so does opening the tab
  useEffect(() => {
    if (tick) void reload();
  }, [tick, reload]);
  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  const seg = (k: Tab, label: string, count: number, color: string) => {
    const on = tab === k;
    return (
      <Pressable onPress={() => setTab(k)} style={[styles.segBtn, on && styles.segOn]} accessibilityRole="tab" accessibilityState={{ selected: on }}>
        <Txt weight={on ? 'bold' : 'medium'} size={15} color={on ? colors.primary : colors.grey}>{label}</Txt>
        {count > 0 ? (
          <View style={[styles.cnt, { backgroundColor: color }]}>
            <Txt weight="bold" size={11.5} color={colors.white}>{n(count)}</Txt>
          </View>
        ) : null}
      </Pressable>
    );
  };

  return (
    <View style={styles.flex}>
      <TopBar title={t('orders')} />
      <View style={styles.seg} accessibilityRole="tablist">
        {seg('pending', t('pending'), dash?.pending ?? 0, colors.orange)}
        {seg('active', t('active'), dash?.active ?? 0, colors.primary)}
      </View>
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
                await Promise.all([reload(), useDash.getState().load().catch(() => {})]);
                setRefreshing(false);
              }}
            />
          }
        >
          {data.length ? (
            data.map((o) => <OrderCard key={o.id} o={o} />)
          ) : (
            <Empty
              icon={tab === 'pending' ? 'bell' : 'box'}
              title={tab === 'pending' ? t('noPending') : t('noActive')}
              sub={online ? t('ordersAppearHere') : t('offlineGoOnline')}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  seg: { flexDirection: 'row', backgroundColor: '#e3e8f6', borderRadius: 14, padding: 4, marginHorizontal: 14, marginTop: 12, marginBottom: 4 },
  segBtn: { flex: 1, minHeight: 44, borderRadius: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  segOn: { backgroundColor: colors.white, elevation: 2, shadowColor: '#141e5a', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  cnt: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
  page: { padding: 14, gap: 10, paddingBottom: 30 },
});
