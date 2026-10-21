import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { OrderCard } from '@/components/OrderCard';
import { Txt, useInputFont } from '@/components/Txt';
import type { StringKey } from '@/i18n/en';
import { isActive, isCancelled, useOrders } from '@/lib/orders';
import { useNow } from '@/lib/useNow';
import { useAuth } from '@/store/auth';
import { useT } from '@/store/i18n';
import { colors, TOUCH } from '@/theme';

type Tab = 'all' | 'active' | 'delivered' | 'cancelled';
const TABS: [Tab, StringKey][] = [['all', 'all'], ['active', 'tabActive'], ['delivered', 'tabDelivered'], ['cancelled', 'tabCancelled']];
const RANGES: [number, StringKey][] = [[7, 'range7'], [30, 'range30'], [90, 'range90'], [0, 'rangeAll']];

export default function OrdersScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const font = useInputFont();
  const status = useAuth((s) => s.status);
  const q = useOrders();
  const now = useNow(15000);
  const [tab, setTab] = useState<Tab>('all');
  const [range, setRange] = useState(90);
  const [search, setSearch] = useState('');

  // server clock offset, so the countdown matches the server even when the phone clock is off
  const skew = useMemo(() => {
    const o = q.data?.find((x) => x.eta);
    return o?.eta ? o.eta.now - q.dataUpdatedAt : 0;
  }, [q.data, q.dataUpdatedAt]);

  const list = useMemo(() => {
    const s = search.trim().toLowerCase();
    const from = range ? now - range * 86400000 : 0;
    return (q.data ?? []).filter((o) => {
      if (o.createdAt < from) return false;
      if (tab === 'active' && !isActive(o)) return false;
      if (tab === 'delivered' && o.status !== 'Delivered') return false;
      if (tab === 'cancelled' && !isCancelled(o)) return false;
      return !s || o.id.toLowerCase().includes(s) || o.items.some((i) => `${i.n} ${i.bn}`.toLowerCase().includes(s));
    });
  }, [q.data, tab, range, search, now]);

  if (status !== 'user') {
    return (
      <View style={[styles.page, styles.center, { paddingTop: insets.top }]}>
        <Icon name="box" size={52} color={colors.grey} />
        <Txt size={15} color={colors.grey} style={styles.text}>{t('loginOrders')}</Txt>
        <Button label={t('authNeedBtn')} onPress={() => router.push('/auth')} style={styles.btn} />
      </View>
    );
  }

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <View style={styles.head}>
        <Txt weight="bold" size={20}>{t('tabOrders')}</Txt>
        <View style={styles.search}>
          <Icon name="search" size={18} color={colors.grey} />
          <TextInput value={search} onChangeText={setSearch} placeholder={t('findItems')} placeholderTextColor="#9aa1b8" style={[styles.input, { fontFamily: font }]} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {RANGES.map(([d, k]) => (
            <Chip key={d} on={range === d} label={t(k)} onPress={() => setRange(d)} />
          ))}
        </ScrollView>
        <View style={styles.tabs} accessibilityRole="tablist">
          {TABS.map(([k, l]) => (
            <Pressable key={k} onPress={() => setTab(k)} style={[styles.tab, tab === k && styles.tabOn]} accessibilityRole="tab" accessibilityState={{ selected: tab === k }}>
              <Txt weight="bold" size={13.5} color={tab === k ? colors.primary : colors.grey}>{t(l)}</Txt>
            </Pressable>
          ))}
        </View>
      </View>
      {q.isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.load} />
      ) : (
        <FlashList
          data={list}
          keyExtractor={(o) => o.id}
          renderItem={({ item }) => <OrderCard o={item} skew={skew} now={now} />}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} colors={[colors.primary]} />}
          ListEmptyComponent={<Txt size={14} color={colors.grey} style={styles.text}>{t('noOrders')}</Txt>}
        />
      )}
    </View>
  );
}

function Chip({ on, label, onPress }: { on: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, on && styles.chipOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
      <Txt weight="semibold" size={12.5} color={on ? colors.white : colors.text}>{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  text: { textAlign: 'center', paddingVertical: 24 },
  btn: { alignSelf: 'stretch' },
  head: { backgroundColor: colors.white, paddingHorizontal: 14, paddingTop: 12, gap: 10 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, borderRadius: 22, backgroundColor: '#f1f3f9', paddingHorizontal: 14 },
  input: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 0 },
  chips: { gap: 8 },
  chip: { minHeight: 34, paddingHorizontal: 12, borderRadius: 17, borderWidth: 1, borderColor: colors.border, justifyContent: 'center' },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabs: { flexDirection: 'row' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: TOUCH, borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabOn: { borderBottomColor: colors.primary },
  list: { padding: 12 },
  load: { marginTop: 40 },
});
