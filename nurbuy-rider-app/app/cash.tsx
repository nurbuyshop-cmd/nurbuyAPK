import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { cash, type Range } from '@/api/rider';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Card, Empty, ErrorBox, Spinner } from '@/components/ui';
import { Filters } from '@/components/WalletParts';
import { dateTime, money, MONTHS } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { useRefocus } from '@/lib/useRefocus';
import { useLang } from '@/store/i18n';
import { colors } from '@/theme';

type R = Exclude<Range, 'custom'>;

/** Cash from delivered COD orders: total, day by day, and each order (website scrCash()). */
export default function Cash() {
  const { t, n, f, lang } = useLang();
  const [range, setRange] = useState<R>('today');
  const { data, error, reload } = useLoad(`cash-${range}`, () => cash(range));
  const [refreshing, setRefreshing] = useState(false);
  useRefocus(reload);

  const day = (ymd: string) => {
    const [, m = '1', d = '1'] = ymd.split('-');
    return `${n(Number(d))} ${MONTHS[lang][Number(m) - 1] ?? ''}`;
  };

  return (
    <View style={styles.flex}>
      <TopBar title={t('cashCollected')} back />
      <Filters
        items={[
          ['today', t('today')],
          ['yesterday', t('yesterday')],
          ['week', t('last7')],
          ['month', t('thisMonth')],
        ]}
        value={range}
        onChange={setRange}
      />
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
          <View style={styles.cash}>
            <Txt size={13.5} color="#8a3d00">{t('totalCash')}</Txt>
            <Txt weight="bold" size={32} color="#c24d00">{money(data.total, lang)}</Txt>
            <Txt size={13} color="#8a3d00">{f('nCodDeliveries', { n: data.count })}</Txt>
          </View>
          {!data.orders.length ? (
            <Empty icon="history" title={t('noCashCollected')} sub={t('noCashSub')} />
          ) : (
            <>
              {data.days.length > 1 ? (
                <Card title={t('dayByDay')}>
                  {data.days.map((d) => (
                    <View key={d.date} style={styles.kv}>
                      <Txt size={14.5} style={styles.grow}>
                        {`${day(d.date)} `}
                        <Txt size={12.5} color={colors.grey}>{`(${f('nOrders', { n: d.count })})`}</Txt>
                      </Txt>
                      <Txt weight="semibold" size={14.5}>{money(d.total, lang)}</Txt>
                    </View>
                  ))}
                </Card>
              ) : null}
              <Card title={t('orders')}>
                {data.orders.map((o) => (
                  <Pressable key={o.id} onPress={() => router.push({ pathname: '/order/[id]', params: { id: o.id } })} style={({ pressed }) => [styles.kv, pressed && styles.pressed]} accessibilityRole="button">
                    <View style={styles.grow}>
                      <Txt weight="semibold" size={14.5}>{`#${n(o.id)}`}</Txt>
                      <Txt size={12.5} color={colors.grey}>{`${o.cu} - ${dateTime(o.at, lang)}`}</Txt>
                    </View>
                    <Txt weight="semibold" size={14.5}>{money(o.cod, lang)}</Txt>
                  </Pressable>
                ))}
              </Card>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  page: { padding: 14, paddingTop: 6, gap: 12, paddingBottom: 30 },
  cash: { backgroundColor: '#ffe9d4', borderWidth: 2, borderColor: '#ffb877', borderRadius: 16, padding: 14, alignItems: 'center' },
  kv: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#eef1f8' },
  grow: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.6 },
});
