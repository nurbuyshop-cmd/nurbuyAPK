import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ApiError } from '@/api/api';
import { order, orderAction, type OrderState, type SellerOrder } from '@/api/seller';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { OrderChip, ORDER_STATE } from '@/components/OrderCard';
import { Sheet } from '@/components/Sheet';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Banner, Card, ErrorBox, KV, Spinner } from '@/components/ui';
import type { StringKey } from '@/i18n/en';
import { errorText } from '@/lib/errors';
import { dateTime, money } from '@/lib/format';
import { useLoad } from '@/lib/useLoad';
import { useDash } from '@/store/dash';
import { useLang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

const FLOW: OrderState[] = ['new', 'confirmed', 'packed', 'shipped', 'delivered'];
const FLOW_LABEL: Record<string, StringKey> = { new: 'flReceived', confirmed: 'flConfirmed', packed: 'flPacked', shipped: 'flShipped', delivered: 'flDelivered' };

/** One order: the seller's own items, confirm / pack / reject, and the progress steps (website scrOrder()). */
export default function OrderPage() {
  const { t, n, lang } = useLang();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { data: o, error, reload } = useLoad(`order:${id}`, () => order(id));
  const [busy, setBusy] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const tick = useDash((s) => s.tick);
  useEffect(() => {
    if (tick && !rejecting) void reload();
    // a sheet that is open keeps the page as it is
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, reload]);

  const after = () => {
    void reload();
    void useDash.getState().load().catch(() => {});
  };

  const act = async (a: 'confirm' | 'pack') => {
    setBusy(a);
    try {
      await orderAction(id, a);
      toast(a === 'confirm' ? t('orderConfirmed') : t('markedPacked'), 'ok');
      after();
    } catch (e) {
      toast(errorText(e, t), 'bad');
      if (e instanceof ApiError && (e.code === 'bad_state' || e.code === 'order_closed')) after();
    }
    setBusy(null);
  };

  return (
    <View style={styles.flex}>
      <TopBar title={`${t('order')} #${id}`} back backTo="/orders" />
      {!o ? (
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
          <Card>
            <View style={styles.head}>
              <Txt weight="bold" size={18} latin style={styles.flex}>#{o.id}</Txt>
              <OrderChip st={o.st} />
            </View>
            <KV k={t('ordered')} v={dateTime(o.created_at * 1000, lang)} />
            <KV k={t('soldVia')} v="NurBuy Minutes" />
            <KV k={t('customer')} v={o.cu || '-'} />
            {o.st === 'rejected' && o.note ? <KV k={t('yourReason')} v={o.note} /> : null}
          </Card>

          {o.other ? <Banner>{t('otherShops')}</Banner> : null}

          {o.st === 'new' || o.st === 'confirmed' ? (
            <Card title={t('action')}>
              <View style={styles.btns}>
                {o.st === 'new' ? (
                  <>
                    <Button label={t('confirmOrder')} icon="check" variant="ok" busy={busy === 'confirm'} disabled={!!busy} onPress={() => void act('confirm')} />
                    <Button label={t('confirmPack')} icon="box" variant="secondary" busy={busy === 'pack'} disabled={!!busy} onPress={() => void act('pack')} />
                  </>
                ) : (
                  <Button label={t('markPacked')} icon="box" variant="ok" busy={busy === 'pack'} disabled={!!busy} onPress={() => void act('pack')} />
                )}
                <Button label={t('rejectOrder')} icon="x" variant="danger" disabled={!!busy} onPress={() => setRejecting(true)} />
              </View>
            </Card>
          ) : null}

          <Card title={t('yourItems')}>
            {o.items.map((i, k) => (
              <View key={k} style={styles.item}>
                <Txt weight="bold" size={14.5} color={colors.primary} style={styles.qty}>{`${n(i.q)}x`}</Txt>
                <View style={styles.flex}>
                  <Txt size={14.5} weight="medium">{lang === 'bn' && i.bn ? i.bn : i.n}</Txt>
                  {i.variant ? <Txt size={13} color={colors.purple}>{i.variant}</Txt> : null}
                  <Txt size={12.5} color={colors.grey}>{`${money(i.unit, lang)} ${t('each')}`}</Txt>
                </View>
                <Txt weight="semibold" size={14.5}>{money(i.q * i.unit, lang)}</Txt>
              </View>
            ))}
            <View style={styles.total}>
              <Txt weight="bold" size={15.5} style={styles.flex}>{t('yourTotal')}</Txt>
              <Txt weight="bold" size={17}>{money(o.sub, lang)}</Txt>
            </View>
          </Card>

          <Card title={t('progress')}>
            <Steps o={o} />
          </Card>
        </ScrollView>
      )}
      {rejecting ? (
        <RejectSheet
          id={id}
          onClose={() => setRejecting(false)}
          onDone={() => {
            setRejecting(false);
            after();
          }}
        />
      ) : null}
    </View>
  );
}

function Steps({ o }: { o: SellerOrder }) {
  const { t } = useLang();
  const bad = o.st === 'cancelled' || o.st === 'rejected';
  const steps: { label: string; state: 'done' | 'cur' | 'todo' | 'bad' }[] = bad
    ? [
        { label: t('flReceived'), state: 'done' },
        { label: t(ORDER_STATE[o.st][0]), state: 'bad' },
      ]
    : FLOW.map((k, i) => {
        const cur = FLOW.indexOf(o.st);
        return { label: t(FLOW_LABEL[k] ?? 'flReceived'), state: i < cur ? 'done' : i === cur ? 'cur' : 'todo' };
      });
  return (
    <View>
      {steps.map((s, i) => (
        <View key={i} style={styles.step}>
          <View style={styles.rail}>
            <View style={[styles.dot, s.state === 'done' && styles.dotDone, s.state === 'cur' && styles.dotCur, s.state === 'bad' && styles.dotBad]}>
              {s.state === 'bad' ? <Icon name="x" size={13} color={colors.white} strokeWidth={3} /> : s.state !== 'todo' ? <Icon name="check" size={13} color={colors.white} strokeWidth={3} /> : null}
            </View>
            {i < steps.length - 1 ? <View style={[styles.railLine, s.state === 'done' && styles.railDone]} /> : null}
          </View>
          <Txt size={14.5} weight={s.state === 'cur' || s.state === 'bad' ? 'bold' : 'regular'} color={s.state === 'todo' ? colors.grey : s.state === 'bad' ? colors.danger : colors.text} style={styles.stepLabel}>
            {s.label}
          </Txt>
        </View>
      ))}
    </View>
  );
}

function RejectSheet({ id, onClose, onDone }: { id: string; onClose: () => void; onDone: () => void }) {
  const { t } = useLang();
  const [reason, setReason] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const send = async () => {
    if (!reason.trim()) {
      setErr(t('fReason'));
      return;
    }
    setBusy(true);
    try {
      await orderAction(id, 'reject', reason.trim());
      toast(t('orderRejected'), 'ok');
      onDone();
    } catch (e) {
      setBusy(false);
      toast(errorText(e, t), 'bad');
      if (e instanceof ApiError && (e.code === 'bad_state' || e.code === 'order_closed')) onDone();
    }
  };
  return (
    <Sheet title={t('rejectQ')} sub={t('rejectSub')} onClose={onClose}>
      <Field
        label={t('reason')}
        required
        rows={3}
        maxLength={200}
        placeholder={t('rejectPh')}
        value={reason}
        onChangeText={(v) => {
          setReason(v);
          if (err) setErr('');
        }}
        error={err}
      />
      <Button label={t('rejectBtn')} variant="dangerSolid" busy={busy} onPress={() => void send()} />
      <Button label={t('back')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0, backgroundColor: colors.bg },
  page: { padding: 14, gap: 12, paddingBottom: 30 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  btns: { gap: 10 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  qty: { minWidth: 34 },
  total: { flexDirection: 'row', alignItems: 'center', paddingTop: 12 },
  step: { flexDirection: 'row', gap: 12, minHeight: 42 },
  rail: { alignItems: 'center', width: 24 },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e6e9f3', alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.ok },
  dotCur: { backgroundColor: colors.primary },
  dotBad: { backgroundColor: colors.danger },
  railLine: { flex: 1, width: 2, backgroundColor: '#e6e9f3', marginVertical: 2 },
  railDone: { backgroundColor: colors.ok },
  stepLabel: { paddingTop: 2 },
});
