import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { setOnline } from '@/api/rider';
import { Icon } from '@/components/Icon';
import { Countdown, RChip } from '@/components/OrderParts';
import { PushBanner } from '@/components/PushBanner';
import { Txt } from '@/components/Txt';
import { Avatar, ErrorBox, Spinner } from '@/components/ui';
import { errorText } from '@/lib/errors';
import { money } from '@/lib/format';
import { payText } from '@/lib/labels';
import { useAuth } from '@/store/auth';
import { useDash } from '@/store/dash';
import { useLang } from '@/store/i18n';
import { usePhoto } from '@/store/photo';
import { toast } from '@/store/toast';
import { colors, radius, shadow } from '@/theme';

/** Online switch, new assignments, the running delivery, cash, earnings and today's numbers (website scrHome()). */
export default function Home() {
  const { t, n, f, lang } = useLang();
  const insets = useSafeAreaInsets();
  const rider = useAuth((s) => s.rider);
  const photo = usePhoto((s) => s.uri);
  const d = useDash((s) => s.dash);
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      await useDash.getState().load();
      setError(null);
    } catch (e) {
      setError(e);
    }
  }, []);

  // fresh numbers each time the tab opens (the 15-second check keeps them fresh while it stays open)
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (!rider) return null;
  if (!d) return <View style={styles.flex}>{error ? <ErrorBox error={error} onRetry={() => void load()} /> : <Spinner style={{ marginTop: insets.top + 40 }} />}</View>;

  const on = rider.online;
  const a = d.active_order;
  const first = rider.name.trim().split(/\s+/)[0] ?? '';

  const toggle = async () => {
    setBusy(true);
    try {
      const now = await setOnline(!on);
      useAuth.getState().setRider({ ...rider, online: now });
      toast(now ? t('onlineNow') : t('offlineNow'), now ? 'ok' : 'info');
      await load();
    } catch (e) {
      toast(errorText(e, t), 'bad');
    }
    setBusy(false);
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scroll}
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
      <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>
        <View style={styles.row}>
          <Avatar name={rider.name} uri={photo} size={52} ring />
          <View style={styles.flex1}>
            <Txt size={13.5} color="rgba(255,255,255,0.85)">{t('welcomeBack')}</Txt>
            <Txt weight="bold" size={21} color={colors.white} numberOfLines={1}>{first}</Txt>
          </View>
        </View>
      </View>

      <View style={styles.page}>
        <Pressable
          onPress={() => void toggle()}
          disabled={busy}
          style={[styles.sw, on && styles.swOn, busy && styles.busy]}
          accessibilityRole="switch"
          accessibilityState={{ checked: on, busy }}
        >
          <View style={[styles.tg, on && styles.tgOn]}>
            {busy ? <ActivityIndicator color={colors.white} size="small" style={styles.tgSpin} /> : <View style={[styles.knob, on && styles.knobOn]} />}
          </View>
          <View style={styles.flex1}>
            <Txt weight="bold" size={18} color={on ? '#0b7a3b' : colors.text}>{on ? t('youOnline') : t('youOffline')}</Txt>
            <Txt size={13} color={colors.grey}>{on ? t('tapOffline') : t('tapOnline')}</Txt>
          </View>
        </Pressable>

        <PushBanner />

        {d.pending > 0 ? (
          <Pressable onPress={() => router.navigate({ pathname: '/orders', params: { tab: 'pending' } })} style={styles.strip} accessibilityRole="button">
            <View style={styles.stripIc}>
              <Icon name="bell" size={21} color={colors.white} />
            </View>
            <View style={styles.flex1}>
              <Txt weight="bold" size={15} color="#8a3d00">{d.pending > 1 ? f('nNewWaiting', { n: d.pending }) : t('oneNewWaiting')}</Txt>
              <Txt size={13} color="#8a3d00">{t('tapAcceptReject')}</Txt>
            </View>
            <Icon name="chevron" size={18} color="#8a3d00" />
          </Pressable>
        ) : null}

        {a ? (
          <Pressable onPress={() => router.push({ pathname: '/order/[id]', params: { id: a.id } })} style={styles.act} accessibilityRole="button">
            <View style={styles.row}>
              <Txt weight="bold" size={14.5} color={colors.white} style={styles.flex1}>{t('activeDelivery')}</Txt>
              <RChip rs={a.rstat} />
            </View>
            <Txt weight="bold" size={19} color={colors.white} style={styles.actId}>{`#${n(a.id)}`}</Txt>
            <Txt size={13.5} color="rgba(255,255,255,0.85)" numberOfLines={1}>{`${a.customer.name} - ${a.delivery.address}`}</Txt>
            <View style={[styles.row, styles.mt10]}>
              {a.collect > 0 ? (
                <View style={styles.actCod}>
                  <Txt size={14} color="#8a3d00">{t('collect')}</Txt>
                  <Txt weight="bold" size={16} color="#8a3d00">{money(a.collect, lang)}</Txt>
                </View>
              ) : (
                <View style={styles.actPaid}>
                  <Txt size={13} color={colors.white}>{payText(a.pay, t)}</Txt>
                </View>
              )}
              <View style={styles.flex1} />
              {a.deadline ? <Countdown due={a.deadline} /> : null}
            </View>
          </Pressable>
        ) : null}

        <Pressable onPress={() => router.push('/cash')} style={styles.cash} accessibilityRole="button">
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Txt size={13.5} color="#8a3d00">{t('cashToday')}</Txt>
              <Txt weight="bold" size={30} color="#c24d00">{money(d.cash_today, lang)}</Txt>
            </View>
            <Icon name="chevron" size={20} color="#8a3d00" />
          </View>
          <Txt size={12.5} color="#8a3d00">{t('cashTodaySub')}</Txt>
        </Pressable>

        {d.earn ? (
          <Pressable onPress={() => router.push('/earnings')} style={styles.card} accessibilityRole="button">
            <View style={styles.row}>
              <View style={styles.ic2}>
                <Icon name="bag" size={21} color={colors.primary} />
              </View>
              <View style={styles.flex1}>
                <Txt size={13} color={colors.grey}>{t('earnToday')}</Txt>
                <Txt weight="bold" size={22}>{money(d.earn.today, lang)}</Txt>
              </View>
              <View style={styles.alignR}>
                <Txt size={12.5} color={colors.grey}>{t('thisMonth')}</Txt>
                <Txt weight="bold" size={15}>{money(d.earn.month, lang)}</Txt>
              </View>
              <Icon name="chevron" size={18} color={colors.grey} />
            </View>
          </Pressable>
        ) : null}

        <View style={styles.stats}>
          <Stat k={t('todayDeliveries')} v={n(d.today)} color={colors.primary} />
          <Stat k={t('pending')} v={n(d.pending)} color={colors.orange} />
          <Stat k={t('active')} v={n(d.active)} color={colors.primary} />
          <Stat k={t('completedToday')} v={n(d.completed_today)} color={colors.ok} />
          <Stat k={t('cancelledToday')} v={n(d.cancelled_today)} color={colors.danger} />
          <Stat k={t('completedTotal')} v={n(d.completed_total)} color={colors.text} />
        </View>
      </View>
    </ScrollView>
  );
}

function Stat({ k, v, color }: { k: string; v: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Txt size={13} color={colors.grey}>{k}</Txt>
      <Txt weight="bold" size={28} color={color}>{v}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  flex1: { flex: 1, minWidth: 0 },
  scroll: { paddingBottom: 28 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mt10: { marginTop: 10 },
  alignR: { alignItems: 'flex-end' },
  hero: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingBottom: 54, borderBottomLeftRadius: 26, borderBottomRightRadius: 26 },
  page: { paddingHorizontal: 14, gap: 12, marginTop: -38 },
  sw: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg, backgroundColor: colors.white, minHeight: 84, borderWidth: 2, borderColor: colors.border, ...shadow.card },
  swOn: { borderColor: colors.ok, backgroundColor: '#f3fbf6' },
  busy: { opacity: 0.7 },
  tg: { width: 62, height: 36, borderRadius: 18, backgroundColor: '#c3c9dc', justifyContent: 'center', paddingHorizontal: 4 },
  tgOn: { backgroundColor: colors.ok },
  tgSpin: { alignSelf: 'center' },
  knob: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.white, elevation: 2 },
  knobOn: { alignSelf: 'flex-end' },
  strip: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderRadius: radius.lg, backgroundColor: colors.warnBg, borderWidth: 1.5, borderColor: '#ffd2a8', minHeight: 60 },
  stripIc: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  act: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: 15, elevation: 6, shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
  actId: { marginTop: 6, marginBottom: 2 },
  actCod: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.white, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 4 },
  actPaid: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  cash: { backgroundColor: '#ffe9d4', borderWidth: 2, borderColor: '#ffb877', borderRadius: radius.lg, padding: 14, gap: 2 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  ic2: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { width: '48%', flexGrow: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: 13, minHeight: 92, justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border, ...shadow.card },
});
