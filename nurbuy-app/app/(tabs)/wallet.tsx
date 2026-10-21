import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchWallet, type WalletTx } from '@/api/account';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { shortDate } from '@/lib/dates';
import { money } from '@/lib/money';
import { useAuth } from '@/store/auth';
import { digits, fmt, useI18n, useT } from '@/store/i18n';
import { colors, radius, shadow } from '@/theme';

export default function WalletScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const status = useAuth((s) => s.status);
  const user = useAuth((s) => s.user);
  const q = useQuery({ queryKey: ['wallet'], queryFn: fetchWallet, enabled: status === 'user' });

  if (status !== 'user') {
    return (
      <View style={[styles.page, styles.center, { paddingTop: insets.top }]}>
        <Icon name="wallet" size={52} color={colors.grey} />
        <Txt weight="bold" size={18}>{t('walletLogin')}</Txt>
        <Txt size={14} color={colors.grey} style={styles.text}>{t('walletLoginSub')}</Txt>
        <Button label={t('authNeedBtn')} onPress={() => router.push('/auth')} style={styles.btn} />
      </View>
    );
  }

  const w = q.data;
  let earned = 0;
  let spent = 0;
  w?.tx.forEach((x) => {
    if (x.t === 'cb') earned += x.a;
    else if (x.t === 'cbr') earned -= x.a;
    else if (x.t === 'pay') spent += x.a;
  });

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <View style={styles.head}>
        <Txt weight="bold" size={20}>{t('tabWallet')}</Txt>
      </View>
      {!w ? (
        <ActivityIndicator color={colors.primary} style={styles.load} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} colors={[colors.primary]} />}
        >
          <View style={styles.card} accessible accessibilityLabel={`${t('availBal')} ${money(w.bal, lang)}`}>
            <View style={styles.cardTop}>
              <Txt weight="bold" size={18} color={colors.white}>
                NurBuy <Txt size={18} color={colors.white} style={styles.italic}>Wallet</Txt>
              </Txt>
              <View style={styles.pct}>
                <Txt weight="bold" size={12} color={colors.white}>{fmt(t('cashbackPct'), { n: w.pct }, lang)}</Txt>
              </View>
            </View>
            <Txt size={12.5} color="rgba(255,255,255,0.8)">{t('availBal')}</Txt>
            <Txt weight="bold" size={30} color={colors.white}>{money(w.bal, lang)}</Txt>
            <View style={styles.chip} />
            <Txt weight="semibold" size={17} color={colors.white} style={styles.cardNo}>{w.card}</Txt>
            <View style={styles.cardBottom}>
              <View>
                <Txt size={11} color="rgba(255,255,255,0.75)">{t('cardHolder')}</Txt>
                <Txt weight="bold" size={14} color={colors.white}>{user?.name ?? ''}</Txt>
              </View>
              <View style={styles.right}>
                <Txt size={11} color="rgba(255,255,255,0.75)">{t('mobileLabel')}</Txt>
                <Txt weight="bold" size={14} color={colors.white}>{user?.mobile ?? ''}</Txt>
              </View>
            </View>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Txt size={12} color={colors.grey}>{t('totalEarned')}</Txt>
              <Txt weight="bold" size={16} color="#12a150">{'+ ' + money(Math.max(0, earned), lang)}</Txt>
            </View>
            <View style={styles.stat}>
              <Txt size={12} color={colors.grey}>{t('totalSpent')}</Txt>
              <Txt weight="bold" size={16}>{money(spent, lang)}</Txt>
            </View>
          </View>

          <View style={styles.box}>
            <Txt weight="bold" size={16}>{t('howItWorks')}</Txt>
            {[fmt(t('how1'), { n: w.pct }, lang), t('how2'), t('how3')].map((s, i) => (
              <View key={i} style={styles.how}>
                <View style={styles.num}><Txt weight="bold" size={12} color={colors.primary}>{digits(i + 1, lang)}</Txt></View>
                <Txt size={13.5} color="#333" style={styles.flex}>{s}</Txt>
              </View>
            ))}
            <Txt size={12.5} color={colors.grey}>{t('howNote')}</Txt>
          </View>

          <View style={styles.box}>
            <Txt weight="bold" size={16}>{t('transactions')}</Txt>
            {w.tx.length ? w.tx.map((x, i) => <TxRow key={i} x={x} />) : <Txt size={13.5} color={colors.grey}>{t('noTx')}</Txt>}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function TxRow({ x }: { x: WalletTx }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const adj = x.t === 'adj';
  const incoming = x.t === 'cb' || (adj && x.a >= 0);
  const label =
    x.t === 'cbr' ? t('txBonusBack') : adj ? t('txAdjust') : x.t === 'cb' ? t('txBonus') + (x.pct != null ? ` (${digits(x.pct, lang)}%)` : '') : t('txPaid');
  return (
    <Pressable
      style={styles.tx}
      onPress={() => x.oid && router.push({ pathname: '/order/[id]', params: { id: x.oid } })}
      disabled={!x.oid}
      accessibilityRole={x.oid ? 'button' : undefined}
    >
      <View style={[styles.txIc, incoming ? styles.in : styles.out]}>
        <Icon name={incoming ? 'plus' : 'minus'} size={16} color={incoming ? '#12a150' : colors.danger} strokeWidth={2.4} />
      </View>
      <View style={styles.flex}>
        <Txt weight="semibold" size={14}>{label}</Txt>
        <Txt size={12} color={colors.grey}>{(x.oid ? x.oid + ' · ' : '') + shortDate(x.d, lang)}</Txt>
      </View>
      <Txt weight="bold" size={14.5} color={incoming ? '#12a150' : colors.text}>{(incoming ? '+ ' : '− ') + money(Math.abs(x.a), lang)}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
  text: { textAlign: 'center', lineHeight: 21 },
  btn: { alignSelf: 'stretch', marginTop: 8 },
  head: { backgroundColor: colors.white, paddingHorizontal: 14, paddingVertical: 12, ...shadow.card },
  load: { marginTop: 40 },
  content: { padding: 12, gap: 12, paddingBottom: 30 },
  flex: { flex: 1, minWidth: 0 },
  card: { backgroundColor: colors.primary, borderRadius: 20, padding: 20, gap: 4, ...shadow.card },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  italic: { fontStyle: 'italic' },
  pct: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  chip: { width: 40, height: 28, borderRadius: 6, backgroundColor: '#f5c451', marginTop: 12 },
  cardNo: { letterSpacing: 2, marginTop: 8 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  right: { alignItems: 'flex-end' },
  stats: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, gap: 4, ...shadow.card },
  box: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, gap: 10, ...shadow.card },
  how: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  num: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#eef0fa', alignItems: 'center', justifyContent: 'center' },
  tx: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#f0f1f6' },
  txIc: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  in: { backgroundColor: colors.okBg },
  out: { backgroundColor: colors.dangerBg },
});
