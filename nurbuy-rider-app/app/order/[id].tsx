import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, RefreshControl, ScrollView, StyleSheet, Vibration, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError } from '@/api/api';
import { acceptOrder, isFinal, order as loadOrder, stepOrder, type RiderOrder } from '@/api/rider';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { OrderMap, type MapPoint } from '@/components/OrderMap';
import { CallLink, Countdown, ItemRow, NavButton, openLink, PickupStop, RChip } from '@/components/OrderParts';
import { DelaySheet, DeliverSheet, FailSheet, isStale, RejectSheet, ReportSheet } from '@/components/OrderSheets';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Banner, Card, Empty, ErrorBox, KV, Spinner } from '@/components/ui';
import { errorText } from '@/lib/errors';
import { ago, dateTime, money } from '@/lib/format';
import { failText, NEXT_STEP, payText, STEPS } from '@/lib/labels';
import { useDash } from '@/store/dash';
import { useLang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

type SheetName = 'reject' | 'deliver' | 'fail' | 'delay' | 'report' | null;

/** While an unfinished order is open, the customer's live pin follows every 7 s (website, NBGM-RIDER). */
const LIVE_MS = 7000;

function mapPoints(o: RiderOrder, t: (k: 'customer' | 'customerLive') => string): MapPoint[] {
  const pts: MapPoint[] = [];
  o.pickups.forEach((p, i) => {
    if (p.lat !== null && p.lng !== null) pts.push({ id: `p${i}`, kind: 'pick', lat: p.lat, lng: p.lng, label: p.name });
  });
  if (o.delivery.lat !== null && o.delivery.lng !== null) pts.push({ id: 'drop', kind: 'drop', lat: o.delivery.lat, lng: o.delivery.lng, label: t('customer') });
  if (o.live) pts.push({ id: 'live', kind: 'live', lat: o.live.lat, lng: o.live.lng, label: t('customerLive') });
  return pts;
}

/** One delivery: customer, pickups, map, products, payment, progress and the action buttons (website scrOrder()). */
export default function OrderPage() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { t, n, f, lang } = useLang();
  const insets = useSafeAreaInsets();
  const tick = useDash((s) => s.tick);
  const [o, setO] = useState<RiderOrder | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [sheet, setSheet] = useState<SheetName>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const sheetOpen = useRef(false);
  useEffect(() => {
    sheetOpen.current = sheet !== null;
  }, [sheet]);

  const load = useCallback(async () => {
    try {
      const x = await loadOrder(id);
      setO(x);
      setError(null);
    } catch (e) {
      setError(e);
    }
  }, [id]);

  useEffect(() => {
    let live = true;
    loadOrder(id).then(
      (x) => live && setO(x),
      (e: unknown) => live && setError(e),
    );
    return () => {
      live = false;
    };
  }, [id]);

  // the 15-second check refreshes the page; a sheet that is open is left alone (website pollTick())
  useEffect(() => {
    if (tick && !sheetOpen.current) void load();
  }, [tick, load]);

  const running = !!o && !isFinal(o.rstat);
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      if (AppState.currentState === 'active' && !sheetOpen.current) void load();
    }, LIVE_MS);
    return () => clearInterval(iv);
  }, [running, load]);

  const after = () => {
    setSheet(null);
    void useDash.getState().load().catch(() => {});
    void load();
  };

  // the order changed on the server: say so and show the latest state (website orderErr())
  const stale = (e: unknown) => {
    toast(errorText(e, t), 'bad');
    setSheet(null);
    void load();
  };

  const act = async (key: string, fn: () => Promise<void>, okText?: string) => {
    setBusy(key);
    try {
      await fn();
      if (okText) toast(okText, 'ok');
      after();
    } catch (e) {
      if (isStale(e)) stale(e);
      else toast(errorText(e, t), 'bad');
    }
    setBusy(null);
  };

  const delivered = () => {
    setSheet(null);
    setDone(true);
    Vibration.vibrate(120);
    void useDash.getState().load().catch(() => {});
    setTimeout(() => {
      setDone(false);
      router.replace({ pathname: '/orders', params: { tab: 'active' } });
    }, 1700);
  };

  const closedAway = (tab: 'pending' | 'active') => {
    setSheet(null);
    void useDash.getState().load().catch(() => {});
    router.replace({ pathname: '/orders', params: { tab } });
  };

  const title = o ? `#${n(o.id)}` : t('order');

  if (!o) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <View style={styles.root}>
        <TopBar title={title} back backTo="/orders" />
        {notFound ? (
          <Empty icon="box" title={t('orderNotFound')} sub={t('orderNotFoundSub')} />
        ) : error ? (
          <ErrorBox error={error} onRetry={() => void load()} />
        ) : (
          <Spinner />
        )}
      </View>
    );
  }

  const rs = o.rstat;
  const final = isFinal(rs);
  const pts = mapPoints(o, t);
  const navD = final ? '' : o.nav_delivery;
  const navP = final ? '' : o.nav_pickup;
  const idx = STEPS.findIndex((s) => s[0] === rs);
  const cod = o.total - o.sub - o.fee;
  const areaText = o.area.slice().reverse().map((x) => (lang === 'bn' ? x.bn || x.n : x.n)).join(', ');
  const geo = o.delivery.geo;
  const geoRows = [
    [t('deliveryZone'), o.delivery.zone ? (lang === 'en' ? o.delivery.zone.n : o.delivery.zone.bn || o.delivery.zone.n) : ''],
    [t('area'), geo?.area ?? ''],
    [t('city'), geo?.city ?? ''],
    [t('postOffice'), geo?.post ?? ''],
    [t('landmark'), geo?.landmark ?? ''],
  ].filter((r) => r[1]);

  // action bar (website bar2)
  const next = NEXT_STEP[rs];
  const canDeliver = rs === 'picked' || rs === 'ontheway' || rs === 'arrived';
  const activeRs = !final && rs !== 'assigned';
  const hasBar = rs === 'assigned' || activeRs || rs === 'failed';

  return (
    <View style={styles.root}>
      <TopBar title={title} back backTo="/orders" right={<RChip rs={rs} />} />
      <ScrollView
        contentContainerStyle={[styles.page, { paddingBottom: hasBar ? 24 : insets.bottom + 30 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
          />
        }
      >
        {rs === 'delivered' ? <Banner tone="ok">{`${t('deliveredOk')} - ${dateTime(o.updated_at, lang)}`}</Banner> : null}
        {rs === 'failed' ? (
          <Banner tone="bad" icon="x">
            <Txt weight="bold" size={14}>{t('deliveryFailed')}</Txt>
            <Txt size={14}>{failText(o.fail_reason, t) || '-'}</Txt>
          </Banner>
        ) : null}
        {rs === 'cancelled' ? (
          <Banner tone="bad" icon="x">
            <Txt size={14}>{t('orderCancelled')}</Txt>
            {o.fail_reason ? <Txt size={14}>{failText(o.fail_reason, t)}</Txt> : null}
          </Banner>
        ) : null}
        {rs === 'rejected' ? <Banner tone="bad" icon="x">{t('youRejected')}</Banner> : null}

        {o.deadline && !final ? (
          <Card>
            <View style={styles.row}>
              <Txt weight="semibold" size={14.5} style={styles.flex}>
                {t('deadline')}
                {o.eta ? ` (${n(o.eta.mins + o.eta.extra)} ${t('min')})` : ''}
              </Txt>
              <Countdown due={o.deadline} />
            </View>
            {o.eta?.delays.map((d, i) => (
              <Txt key={i} size={13} color={colors.grey} style={styles.mt6}>{`+${n(d.mins)} ${t('min')} · ${d.label}${d.note ? ` · ${d.note}` : ''}`}</Txt>
            ))}
          </Card>
        ) : null}

        {o.multi ? (
          <View style={styles.msn}>
            <Icon name="info" size={20} color="#7a4b00" />
            <View style={styles.flex}>
              <Txt weight="bold" size={14} color="#7a4b00">{f('multiShop', { n: o.pickups.length })}</Txt>
              <Txt size={14} color="#7a4b00">{t('multiShopSub')}</Txt>
            </View>
          </View>
        ) : null}

        <Card title={t('customer')}>
          <KV k={t('name')} v={o.customer.name} />
          <KV k={t('phone')} v={<CallLink mobile={o.customer.mobile} />} />
        </Card>

        {o.pickups.length ? (
          <Card title={o.pickups.length > 1 ? `${t('pickups')} (${n(o.pickups.length)})` : t('pickup')}>
            {o.pickups.map((st, i) => (
              <PickupStop key={i} st={st} i={i} count={o.pickups.length} final={final} />
            ))}
          </Card>
        ) : (
          <Card title={t('pickup')}>
            <View style={styles.row}>
              <Icon name="shop" size={20} color={colors.grey} />
              <Txt weight="semibold" size={15} style={styles.flex}>{o.pickup.name || t('notSpecified')}</Txt>
            </View>
            {navP ? (
              <View style={styles.mt10}>
                <NavButton label={t('navPickup')} url={navP} outline />
              </View>
            ) : null}
          </Card>
        )}

        <Card title={t('deliveryAddress')}>
          <View style={styles.rowTop}>
            <Icon name="pin" size={20} color={colors.grey} />
            <View style={styles.flex}>
              <Txt size={14.5}>{o.delivery.address}</Txt>
              {areaText ? <Txt size={13} color={colors.grey}>{`${t('areaColon')} ${areaText}`}</Txt> : null}
            </View>
          </View>
          {navD ? (
            <View style={styles.mt10}>
              <NavButton label={t('navigate')} url={navD} />
            </View>
          ) : null}
        </Card>

        {pts.length ? (
          <Card title={t('map')}>
            <OrderMap points={pts} lang={lang} />
            <View style={styles.legend}>
              {o.pickups.some((p) => p.lat !== null) ? <Legend color="#ff6a00" label={t('legendShop')} /> : null}
              {o.delivery.lat !== null ? <Legend color={colors.primary} label={t('legendCustomer')} /> : null}
              {o.live ? <Legend color="#16a34a" label={t('legendLive')} /> : null}
            </View>
            {o.live ? (
              <View style={[styles.live, !o.live.fresh && styles.liveOld]}>
                <View style={styles.flex}>
                  <Txt weight="semibold" size={13.5} color={o.live.fresh ? '#0f6b36' : colors.grey}>{o.live.fresh ? t('liveSharing') : t('liveLastSeen')}</Txt>
                  <Txt size={12} color={o.live.fresh ? '#0f6b36' : colors.grey}>{ago(o.live.at, lang)}</Txt>
                </View>
                {o.live.nav ? <Button small variant={o.live.fresh ? 'ok' : 'secondary'} label={t('navigate')} onPress={() => openLink(o.live?.nav ?? '')} /> : null}
              </View>
            ) : null}
            {geoRows.map(([k, v]) => (
              <KV key={k} k={k ?? ''} v={v ?? ''} />
            ))}
          </Card>
        ) : !final ? (
          <Card>
            <Txt size={13.5} color={colors.grey}>{t('noMapPin')}</Txt>
          </Card>
        ) : null}

        {o.note ? (
          <Banner tone="warn">
            <Txt weight="bold" size={14}>{t('specialNote')}</Txt>
            <Txt size={14}>{o.note}</Txt>
          </Banner>
        ) : null}

        <Card title={`${t('products')} (${n(o.items.length)})`}>
          {o.items.length ? o.items.map((it, i) => <ItemRow key={i} it={it} />) : <Txt color={colors.grey}>-</Txt>}
          <View style={styles.mt8}>
            <Sum k={t('subtotal')} v={money(o.sub, lang)} />
            <Sum k={t('deliveryFee')} v={money(o.fee, lang)} />
            {cod > 0.009 ? <Sum k={t('codCharge')} v={money(cod, lang)} /> : null}
            <View style={styles.sumT}>
              <Txt weight="bold" size={17}>{t('total')}</Txt>
              <Txt weight="bold" size={17}>{money(o.total, lang)}</Txt>
            </View>
          </View>
        </Card>

        {o.pay === 'cod' ? (
          <View style={styles.cash}>
            <Txt weight="semibold" size={14.5} color="#8a3d00">{t('collectInCash')}</Txt>
            <Txt weight="bold" size={32} color="#c24d00">{money(o.collect, lang)}</Txt>
            <Txt size={13} color="#8a3d00">{payText('cod', t)}</Txt>
          </View>
        ) : (
          <Card>
            <View style={styles.row}>
              <Icon name="check" size={22} color={colors.ok} />
              <View style={styles.flex}>
                <Txt weight="semibold" size={15}>{payText(o.pay, t)}</Txt>
                <Txt size={13} color={colors.grey}>{t('noCash')}</Txt>
              </View>
            </View>
          </Card>
        )}

        <Card title={t('orderInfo')}>
          <KV k={t('orderId')} v={`#${n(o.id)}`} />
          <KV k={t('type')} v={t('nurbuyMinutes')} />
          {o.rider_pay !== null ? <KV k={t('yourPayment')} v={money(o.rider_pay, lang)} /> : null}
          <KV k={t('payment')} v={payText(o.pay, t)} />
          <KV k={t('orderedAt')} v={dateTime(o.ordered_at, lang)} />
          <KV k={t('deadline')} v={o.deadline ? dateTime(o.deadline, lang) : '-'} />
        </Card>

        {(idx >= 0 && !final) || rs === 'delivered' ? (
          <Card title={t('progress')}>
            {STEPS.map(([k, label], i) => {
              const dn = i < idx || rs === 'delivered';
              const cu = !dn && i === idx;
              return (
                <View key={k} style={styles.stp}>
                  {i > 0 ? <View style={[styles.stpLine, (dn || cu) && styles.stpLineOn]} /> : null}
                  <View style={[styles.stpDot, dn && styles.stpDotDn, cu && styles.stpDotCu]}>{dn ? <Icon name="check" size={14} color={colors.white} strokeWidth={3} /> : null}</View>
                  <Txt size={cu ? 16 : 14.5} weight={cu ? 'bold' : 'regular'} color={cu ? colors.primary : dn ? colors.text : colors.grey}>{t(label)}</Txt>
                </View>
              );
            })}
          </Card>
        ) : null}
      </ScrollView>

      {hasBar ? (
        <View style={[styles.abar, { paddingBottom: insets.bottom + 10 }]}>
          {rs === 'assigned' ? (
            <View style={styles.row}>
              <Button label={t('reject')} variant="danger" onPress={() => setSheet('reject')} style={styles.flex} />
              <Button label={t('accept')} icon="check" variant="ok" busy={busy === 'acc'} onPress={() => void act('acc', () => acceptOrder(o.id), t('orderAccepted'))} style={styles.flex} />
            </View>
          ) : null}
          {activeRs ? (
            <>
              {next ? <Button label={t(next[1])} busy={busy === 'step'} onPress={() => void act('step', () => stepOrder(o.id, next[0]))} /> : null}
              {canDeliver ? <Button label={t('completeDelivery')} icon="check" variant={rs === 'arrived' ? 'ok' : 'secondary'} onPress={() => setSheet('deliver')} /> : null}
              {o.delay_left > 0 && o.view === 'min' ? <Button small label={t('runningLate')} icon="clock" variant="secondary" onPress={() => setSheet('delay')} /> : null}
              <View style={styles.row}>
                <Button small label={t('failCancel')} variant="ghost" onPress={() => setSheet('fail')} style={styles.flex} />
                <Button small label={t('reportCustomer')} variant="ghost" onPress={() => setSheet('report')} style={styles.flex} />
              </View>
            </>
          ) : null}
          {rs === 'failed' ? <Button small label={t('reportCustomer')} variant="ghost" onPress={() => setSheet('report')} /> : null}
        </View>
      ) : null}

      {sheet === 'reject' ? <RejectSheet o={o} onClose={() => setSheet(null)} onDone={() => closedAway('pending')} onStale={stale} /> : null}
      {sheet === 'deliver' ? <DeliverSheet o={o} onClose={() => setSheet(null)} onDone={delivered} onStale={stale} /> : null}
      {sheet === 'fail' ? <FailSheet o={o} onClose={() => setSheet(null)} onDone={() => closedAway('active')} onStale={stale} /> : null}
      {sheet === 'delay' ? <DelaySheet o={o} onClose={() => setSheet(null)} onDone={after} onStale={stale} /> : null}
      {sheet === 'report' ? <ReportSheet o={o} onClose={() => setSheet(null)} onStale={stale} /> : null}

      {done ? (
        <View style={styles.done} accessibilityRole="alert">
          <View style={styles.doneCk}>
            <Icon name="check" size={54} color={colors.ok} strokeWidth={3} />
          </View>
          <Txt weight="bold" size={28} color={colors.white}>{t('delivered')}</Txt>
          <Txt size={16} color="rgba(255,255,255,0.9)">{t('greatJob')}</Txt>
        </View>
      ) : null}
    </View>
  );
}


function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.leg}>
      <View style={[styles.legDot, { backgroundColor: color }]} />
      <Txt size={12.5} color={colors.grey}>{label}</Txt>
    </View>
  );
}

function Sum({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.sum}>
      <Txt size={14} color={colors.grey}>{k}</Txt>
      <Txt size={14}>{v}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1, minWidth: 0 },
  page: { padding: 14, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  mt6: { marginTop: 6 },
  mt8: { marginTop: 8 },
  mt10: { marginTop: 10 },
  msn: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 12, borderRadius: 12, backgroundColor: '#fff8e6', borderWidth: 1, borderColor: '#ffe2a6' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 10 },
  leg: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legDot: { width: 10, height: 10, borderRadius: 5 },
  live: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, padding: 10, borderRadius: 12, backgroundColor: '#e8f7ee' },
  liveOld: { backgroundColor: colors.bg },
  sum: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  sumT: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1.5, borderTopColor: colors.border, marginTop: 6, paddingTop: 9 },
  cash: { backgroundColor: '#ffe9d4', borderWidth: 2, borderColor: '#ffb877', borderRadius: 16, padding: 14, alignItems: 'center' },
  stp: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 40, paddingVertical: 6 },
  stpLine: { position: 'absolute', left: 11, top: -14, height: 34, width: 2, backgroundColor: '#d7dcec' },
  stpLineOn: { backgroundColor: colors.ok },
  stpDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e1e5f2', alignItems: 'center', justifyContent: 'center' },
  stpDotDn: { backgroundColor: colors.ok },
  stpDotCu: { backgroundColor: colors.primary, borderWidth: 4, borderColor: '#cfd6fb' },
  abar: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 14, paddingTop: 10, gap: 8, elevation: 16, shadowColor: '#141e5a', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -4 } },
  done: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.ok, alignItems: 'center', justifyContent: 'center', gap: 10, zIndex: 50, elevation: 50 },
  doneCk: { width: 104, height: 104, borderRadius: 52, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
});
