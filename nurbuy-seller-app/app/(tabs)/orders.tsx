import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { orders, type OrderState } from '@/api/seller';
import { ORDER_STATE, OrderCard } from '@/components/OrderCard';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Empty, ErrorBox, Spinner } from '@/components/ui';
import { useLoad } from '@/lib/useLoad';
import { useDash } from '@/store/dash';
import { useLang } from '@/store/i18n';
import { colors } from '@/theme';

type Filter = OrderState | 'all';
const FILTERS: Filter[] = ['new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'rejected', 'all'];
const isFilter = (v: unknown): v is Filter => typeof v === 'string' && (FILTERS as string[]).includes(v);

/** All orders with the website's status filters; refreshes with the 20-second check. */
export default function Orders() {
  const { t, n } = useLang();
  const params = useLocalSearchParams<{ f?: string }>();
  const [filter, setFilter] = useState<Filter>(isFilter(params.f) ? params.f : 'new');
  // the home page opens this tab with a filter ("new orders")
  const [seenParam, setSeenParam] = useState(params.f);
  if (seenParam !== params.f) {
    setSeenParam(params.f);
    if (isFilter(params.f)) setFilter(params.f);
  }
  const [refreshing, setRefreshing] = useState(false);
  const { data, error, reload } = useLoad('orders', orders);
  const tick = useDash((s) => s.tick);
  useEffect(() => {
    if (tick) void reload();
  }, [tick, reload]);

  const rows = data ? data.orders.filter((o) => filter === 'all' || o.st === filter) : [];

  return (
    <View style={styles.flex}>
      <TopBar title={t('orders')} />
      {data ? (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {FILTERS.map((k) => {
              const on = filter === k;
              return (
                <Pressable key={k} onPress={() => setFilter(k)} style={[styles.fc, on && styles.fcOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
                  <Txt weight="semibold" size={13.5} color={on ? colors.white : colors.text}>{k === 'all' ? t('oAll') : t(ORDER_STATE[k][0])}</Txt>
                  <View style={[styles.cnt, on && styles.cntOn]}>
                    <Txt weight="bold" size={11.5} color={on ? colors.primary : colors.grey}>{n(data.counts[k] ?? 0)}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
      {!data ? (
        error ? <ErrorBox error={error} onRetry={() => void reload()} /> : <Spinner />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(o) => o.id}
          renderItem={({ item }) => <OrderCard o={item} />}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={Sep}
          ListEmptyComponent={<Empty icon="list" title={t('noOrdersHere')} sub={t('noOrdersSub')} />}
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
        />
      )}
    </View>
  );
}

function Sep() {
  return <View style={styles.sep} />;
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  filters: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  fc: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 13, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  fcOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  cnt: { minWidth: 22, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: '#eef0f6', alignItems: 'center', justifyContent: 'center' },
  cntOn: { backgroundColor: colors.white },
  list: { padding: 14, paddingTop: 2, paddingBottom: 30, flexGrow: 1 },
  sep: { height: 10 },
});
