import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Order } from '@/api/orders';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { SumLine } from '@/components/SumLine';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { shortDate } from '@/lib/dates';
import { money } from '@/lib/money';
import { isActive, isCancelled, minutesLeft, orderAgain, statusLabel, stepOf, STEPS, useOrders } from '@/lib/orders';
import { useIndex } from '@/lib/useIndex';
import { useLiveShare } from '@/lib/useLiveShare';
import { useNow } from '@/lib/useNow';
import { digits, fmt, useI18n, useT } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors, radius, shadow } from '@/theme';

export default function OrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const q = useOrders();
  const o = q.data?.find((x) => x.id === id);
  return (
    <View style={styles.page}>
      <TopBar title={t('orderDetails')} sub={id} />
      {!o ? (
        q.isLoading ? <ActivityIndicator color={colors.primary} style={styles.load} /> : <Txt size={15} color={colors.grey} style={styles.none}>{t('noOrders')}</Txt>
      ) : (
        <Body o={o} refreshing={q.isRefetching} onRefresh={() => void q.refetch()} serverOffset={o.eta ? o.eta.now - q.dataUpdatedAt : 0} />
      )}
    </View>
  );
}

function Body({ o, refreshing, onRefresh, serverOffset }: { o: Order; refreshing: boolean; onRefresh: () => void; serverOffset: number }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const idx = useIndex();
  const now = useNow(1000);
  const active = isActive(o);
  const cancelled = isCancelled(o);
  const step = stepOf(o);
  const left = minutesLeft(o, now, serverOffset);
  const live = useLiveShare(o.id, active);
  const area = useMemo(() => {
    const a = o.extra.area;
    if (!Array.isArray(a)) return '';
    return a
      .map((x: unknown) => (x && typeof x === 'object' && 'n' in x ? String((lang === 'bn' && 'bn' in x ? x.bn : x.n) ?? '') : ''))
      .filter(Boolean)
      .reverse()
      .join(', ');
  }, [o.extra, lang]);

  const again = () => {
    if (!idx) return;
    const [add, skip] = orderAgain(o, idx);
    if (!add) return toast(t('orderAgainNone'));
    toast(skip ? fmt(t('orderAgainSome'), { a: add, b: skip }, lang) : t('orderAgainDone'));
    router.navigate('/cart');
  };

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}>
      <View style={styles.card}>
        <Txt weight="bold" size={18}>
          {active
            ? left !== null && left > 0
              ? fmt(t('arrivingIn'), { n: left }, lang)
              : left !== null
                ? t('late')
                : t(statusLabel(o))
            : (cancelled ? t('cancelledOn') : t('deliveredOn')) + shortDate(o.updatedAt, lang)}
        </Txt>
        <Txt size={13} color={colors.grey}>{t('placedOn') + shortDate(o.createdAt, lang)}</Txt>
        {!cancelled ? (
          <View style={styles.steps}>
            {STEPS.map((k, i) => (
              <View key={k} style={styles.step}>
                <View style={styles.stepTop}>
                  <View style={[styles.line, i === 0 && styles.hidden, i <= step && styles.lineOn]} />
                  <View style={[styles.dot, i <= step && styles.dotOn]}>{i <= step ? <Icon name="check" size={12} color={colors.white} strokeWidth={3} /> : null}</View>
                  <View style={[styles.line, i === STEPS.length - 1 && styles.hidden, i < step && styles.lineOn]} />
                </View>
                <Txt weight={i === step ? 'bold' : 'regular'} size={11.5} color={i <= step ? colors.text : colors.grey} style={styles.stepLabel}>{t(k)}</Txt>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.bad}>
            <Txt weight="bold" size={14} color={colors.danger}>{t(statusLabel(o))}</Txt>
          </View>
        )}
      </View>

      {active && o.delivery ? (
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.ic}><Icon name="scooter" size={20} color={colors.primary} /></View>
            <View style={styles.flex}>
              <Txt size={12.5} color={colors.grey}>{t('rider')}</Txt>
              <Txt weight="bold" size={15}>{o.delivery.rider}</Txt>
            </View>
          </View>
          {o.delivery.otp ? (
            <View style={styles.otp}>
              <Txt size={12.5} color={colors.grey}>{t('deliveryCode')}</Txt>
              <Txt weight="bold" size={30} color={colors.primary} style={styles.otpNum} accessibilityLabel={o.delivery.otp.split('').join(' ')}>
                {digits(o.delivery.otp, 'en')}
              </Txt>
              <Txt size={12.5} color={colors.grey} style={styles.center}>{t('otpNote')}</Txt>
            </View>
          ) : null}
        </View>
      ) : null}

      {active ? (
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Txt weight="bold" size={15}>{live.on ? t('liveOn') : t('shareLive')}</Txt>
              <Txt size={12.5} color={colors.grey}>{t('shareLiveSub')}</Txt>
              {live.denied ? <Txt size={12.5} color={colors.danger}>{t('locDenied')}</Txt> : null}
            </View>
            <Switch value={live.on} onValueChange={live.toggle} trackColor={{ true: colors.primary }} accessibilityLabel={t('shareLive')} />
          </View>
        </View>
      ) : null}

      <View style={styles.card}>
        <Txt weight="bold" size={16}>{t('items')}</Txt>
        {o.items.map((it, i) => (
          <View key={it.id + it.vid + i} style={styles.item}>
            <View style={styles.flex}>
              <Txt size={14} numberOfLines={2}>{lang === 'bn' && it.bn ? it.bn : it.n}</Txt>
              <Txt size={12.5} color={colors.grey}>{`${money(it.unit, lang)} × ${digits(it.q, lang)} · ${it.shop}`}</Txt>
            </View>
            {o.status === 'Delivered' && it.id.startsWith('SP') ? (
              <Pressable onPress={() => router.push({ pathname: '/reviews/[id]', params: { id: it.id } })} style={styles.review} accessibilityRole="button">
                <Txt weight="bold" size={12} color={colors.primary}>{t('reviewThis')}</Txt>
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Txt weight="bold" size={16}>{t('deliveryAddress')}</Txt>
        <Txt size={14}>{o.name + ' · ' + o.mobile}</Txt>
        <Txt size={14} color="#444">{o.address}</Txt>
        {area ? <Txt size={13} color={colors.grey}>{area}</Txt> : null}
      </View>

      <View style={styles.card}>
        <Txt weight="bold" size={16}>{t('payment')}</Txt>
        <Txt size={13.5} color={colors.grey}>{o.pay === 'wallet' ? t('walletPay') : o.pay === 'cod' ? t('cod') : t('onlinePay')}</Txt>
        <SumLine label={t('subtotal')} value={money(o.sub, lang)} />
        <SumLine label={t('deliveryFee')} value={o.fee ? money(o.fee, lang) : t('freeCaps')} green={!o.fee} />
        {o.disc ? <SumLine label={`${t('discount')}${o.coupon ? ` (${o.coupon})` : ''}`} value={'− ' + money(o.disc, lang)} green /> : null}
        {o.cod ? <SumLine label={t('codCharge')} value={'+ ' + money(o.cod, lang)} /> : null}
        {o.paid ? <SumLine label={t('paidWallet')} value={money(o.paid, lang)} /> : null}
        <SumLine label={t('total')} value={money(o.total, lang)} bold />
        {o.bonus && o.bonus.amount > 0 && (o.bonus.state === 'pending' || o.bonus.state === 'credited') ? (
          <Txt size={13} color="#12a150">{fmt(o.bonus.state === 'credited' ? t('bonusCredited') : t('bonusPending'), { v: money(o.bonus.amount, lang) }, lang)}</Txt>
        ) : null}
      </View>

      {!active ? <Button label={t('orderAgain')} variant="outline" onPress={again} style={styles.again} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  load: { marginTop: 40 },
  none: { textAlign: 'center', padding: 32 },
  content: { padding: 12, gap: 10 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, gap: 6, ...shadow.card },
  flex: { flex: 1, minWidth: 0 },
  center: { textAlign: 'center' },
  steps: { flexDirection: 'row', marginTop: 14 },
  step: { flex: 1, alignItems: 'center' },
  stepTop: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch' },
  line: { flex: 1, height: 3, backgroundColor: '#e3e7f2' },
  lineOn: { backgroundColor: colors.primary },
  hidden: { opacity: 0 },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#e3e7f2', alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.primary },
  stepLabel: { textAlign: 'center', marginTop: 6 },
  bad: { backgroundColor: colors.dangerBg, borderRadius: 10, padding: 10, marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ic: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#eef0fa', alignItems: 'center', justifyContent: 'center' },
  otp: { alignItems: 'center', backgroundColor: '#f3f5ff', borderRadius: 12, padding: 12, marginTop: 8, gap: 2 },
  otpNum: { letterSpacing: 8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#f0f1f6' },
  review: { borderWidth: 1.5, borderColor: colors.primary, borderRadius: 10, paddingHorizontal: 10, minHeight: 34, justifyContent: 'center' },
  again: { marginTop: 4 },
});
