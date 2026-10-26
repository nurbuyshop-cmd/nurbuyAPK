import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { history, type HistSt, type Range } from '@/api/rider';
import { DateField } from '@/components/DateField';
import { OrderCard } from '@/components/OrderParts';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Empty, ErrorBox, Spinner } from '@/components/ui';
import { Filters } from '@/components/WalletParts';
import { useLoad } from '@/lib/useLoad';
import { useRefocus } from '@/lib/useRefocus';
import { useLang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

/** Finished deliveries with date and status filters (website scrHistory()). */
export default function History() {
  const { t, f } = useLang();
  const [range, setRange] = useState<Range>('today');
  const [st, setSt] = useState<HistSt>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const bad = range === 'custom' && !!from && !!to && from > to;
  const key = `hist-${range}-${st}-${range === 'custom' ? `${from}-${to}` : ''}`;
  const { data, error, reload } = useLoad(key, () => (bad ? Promise.resolve([]) : history(range, st, from, to)));
  const [refreshing, setRefreshing] = useState(false);
  // the tab stays mounted: finished deliveries are read again each time it is opened
  useRefocus(reload);

  const pickDate = (which: 'from' | 'to', v: string) => {
    const a = which === 'from' ? v : from;
    const b = which === 'to' ? v : to;
    if (a && b && a > b) toast(t('fromBeforeTo'), 'bad');
    if (which === 'from') setFrom(v);
    else setTo(v);
  };

  return (
    <View style={styles.flex}>
      <TopBar title={t('history')} />
      <View style={styles.filters}>
        <Filters
          items={[
            ['today', t('today')],
            ['yesterday', t('yesterday')],
            ['week', t('thisWeek')],
            ['month', t('thisMonth')],
            ['custom', t('custom')],
          ]}
          value={range}
          onChange={setRange}
        />
        {range === 'custom' ? (
          <View style={styles.dates}>
            <DateField label={t('from')} value={from} onChange={(v) => pickDate('from', v)} />
            <DateField label={t('to')} value={to} onChange={(v) => pickDate('to', v)} />
          </View>
        ) : null}
        <Filters
          items={[
            ['all', t('all')],
            ['completed', t('completed')],
            ['cancelled', t('cancelled')],
            ['failed', t('failed')],
          ]}
          value={st}
          onChange={setSt}
        />
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
                await reload();
                setRefreshing(false);
              }}
            />
          }
        >
          {data.length ? (
            <>
              <Txt size={13} color={colors.grey}>{f('nOrders', { n: data.length })}</Txt>
              {data.map((o) => (
                <OrderCard key={o.id} o={o} hist />
              ))}
            </>
          ) : (
            <Empty icon="history" title={t('noHistory')} sub={t('noHistorySub')} />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  filters: { paddingTop: 6 },
  dates: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingTop: 6 },
  page: { padding: 14, paddingTop: 6, gap: 10, paddingBottom: 30 },
});
