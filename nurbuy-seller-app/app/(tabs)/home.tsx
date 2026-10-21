import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { OrderCard } from '@/components/OrderCard';
import { Txt } from '@/components/Txt';
import { Avatar, Empty, ErrorBox, Spinner } from '@/components/ui';
import { money } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { useDash } from '@/store/dash';
import { toggleLang, useLang } from '@/store/i18n';
import { colors, radius, shadow } from '@/theme';

type Tone = 'org' | 'pri' | 'grn' | 'red' | '';

const TONE: Record<Exclude<Tone, ''>, [string, string]> = {
  org: [colors.warnBg, colors.orange],
  pri: [colors.infoBg, colors.primary],
  grn: [colors.okBg, colors.ok],
  red: [colors.dangerBg, colors.danger],
};

/** One number box (website stat()). */
function Stat({ k, v, tone = '', onPress }: { k: string; v: string; tone?: Tone; onPress?: () => void }) {
  const [bg, fg] = tone ? TONE[tone] : [colors.card, colors.text];
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.stat, { backgroundColor: bg }, pressed && styles.pressed]}>
      <Txt size={12.5} color={colors.grey} numberOfLines={2}>{k}</Txt>
      <Txt weight="bold" size={21} color={fg} numberOfLines={1} adjustsFontSizeToFit>{v}</Txt>
    </Pressable>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

function SecHead({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <View style={styles.secHead}>
      <Txt weight="bold" size={17} style={styles.flex}>{title}</Txt>
      {right}
    </View>
  );
}

export default function Home() {
  const { t, n, f, lang } = useLang();
  const insets = useSafeAreaInsets();
  const seller = useAuth((s) => s.seller);
  const dash = useDash((s) => s.dash);
  const unread = useDash((s) => s.unread);
  const [error, setError] = useState<unknown>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      await useDash.getState().load();
      setError(null);
    } catch (e) {
      setError(e);
    }
  };

  // the root layout refreshes the numbers every 20 s; this only loads them when the page opens without any
  useEffect(() => {
    if (useDash.getState().dash) return;
    useDash
      .getState()
      .load()
      .catch((e: unknown) => setError(e));
  }, []);

  if (!seller) return null;
  const d = dash;

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
      <View style={[styles.hero, { paddingTop: insets.top + 14 }]}>
        <View style={styles.heroRow}>
          <Avatar name={seller.shop_name} uri={seller.logo} size={52} ring />
          <View style={styles.flex}>
            <Txt size={13.5} color="rgba(255,255,255,0.85)">{t('welcomeBack')}</Txt>
            <Txt weight="bold" size={20} color={colors.white} numberOfLines={1}>{seller.shop_name}</Txt>
          </View>
          <Pressable onPress={() => router.push('/notifications')} style={styles.hbtn} accessibilityLabel={t('notifications')} accessibilityRole="button">
            <Icon name="bell" size={22} color={colors.white} />
            {unread > 0 ? (
              <View style={styles.badge}>
                <Txt weight="bold" size={10} color={colors.white}>{n(unread > 99 ? '99+' : unread)}</Txt>
              </View>
            ) : null}
          </Pressable>
          <Pressable onPress={toggleLang} style={styles.hbtn} accessibilityLabel="Language" accessibilityRole="button">
            <Txt weight="bold" size={13} color={colors.white}>{lang === 'bn' ? 'EN' : 'বাং'}</Txt>
          </Pressable>
        </View>
      </View>

      <View style={styles.page}>
        {!d ? (
          error ? <ErrorBox error={error} onRetry={() => void load()} /> : <Spinner />
        ) : (
          <>
            {d.stats.new > 0 ? (
              <Pressable onPress={() => router.navigate({ pathname: '/orders', params: { f: 'new' } })} style={styles.strip} accessibilityRole="button">
                <View style={styles.stripIc}>
                  <Icon name="bell" size={20} color={colors.white} />
                </View>
                <Txt size={14.5} style={styles.flex}>{f('newWaiting', { n: d.stats.new })}</Txt>
                <Icon name="chevron" size={18} color={colors.orange} />
              </Pressable>
            ) : null}

            <Grid>
              <Stat k={t('sNew')} v={n(d.stats.new)} tone="org" onPress={() => router.navigate({ pathname: '/orders', params: { f: 'new' } })} />
              <Stat k={t('sConfirmed')} v={n(d.stats.confirmed)} tone="pri" />
              <Stat k={t('sPacked')} v={n(d.stats.packed)} tone="pri" />
              <Stat k={t('sToday')} v={n(d.stats.today)} />
            </Grid>
            <Grid>
              <Stat k={t('sSalesToday')} v={money(d.stats.sales_today, lang)} tone="grn" />
              <Stat k={t('sSalesTotal')} v={money(d.stats.sales_total, lang)} tone="grn" />
              <Stat k={t('sDelivered')} v={n(d.stats.delivered)} />
              <Stat k={t('sCancelled')} v={n(d.stats.cancelled)} tone={d.stats.cancelled ? 'red' : ''} />
            </Grid>

            {d.wallet ? (
              <Pressable onPress={() => router.navigate('/wallet')} style={styles.wstrip} accessibilityRole="button">
                <Icon name="wallet" size={24} color={colors.primary} />
                <View style={styles.flex}>
                  <Txt size={12.5} color={colors.grey}>{t('availBal')}</Txt>
                  <Txt weight="bold" size={19}>{money(d.wallet.available, lang)}</Txt>
                  <Txt size={12.5} color={colors.grey}>{`${t('pendingBal')} ${money(d.wallet.pending, lang)}`}</Txt>
                </View>
                <Txt weight="semibold" size={14} color={colors.primary}>{t('wallet')}</Txt>
                <Icon name="chevron" size={17} color={colors.primary} />
              </Pressable>
            ) : null}

            <SecHead title={t('products')} right={<Button small icon="plus" label={t('addProduct')} onPress={() => router.push({ pathname: '/product/[id]', params: { id: 'new' } })} />} />
            <Grid>
              <Stat k={t('pLive')} v={n(d.products.active)} tone="pri" onPress={() => router.navigate({ pathname: '/products', params: { f: 'active' } })} />
              <Stat k={t('pReview')} v={n(d.products.pending)} tone={d.products.pending ? 'org' : ''} onPress={() => router.navigate({ pathname: '/products', params: { f: 'pending' } })} />
              <Stat k={t('pRejected')} v={n(d.products.rejected)} tone={d.products.rejected ? 'red' : ''} onPress={() => router.navigate({ pathname: '/products', params: { f: 'rejected' } })} />
              <Stat k={t('pLow')} v={n(d.products.low + d.products.out)} tone={d.products.low + d.products.out ? 'org' : ''} onPress={() => router.navigate({ pathname: '/products', params: { f: 'low' } })} />
            </Grid>

            <SecHead
              title={t('recentOrders')}
              right={
                <Pressable onPress={() => router.navigate('/orders')} style={styles.link} accessibilityRole="link">
                  <Txt weight="semibold" size={14} color={colors.primary}>{t('seeAll')}</Txt>
                  <Icon name="chevron" size={16} color={colors.primary} />
                </Pressable>
              }
            />
            {d.recent.length ? (
              <View style={styles.list}>
                {d.recent.map((o) => (
                  <OrderCard key={o.id} o={o} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Empty icon="list" title={t('noOrders')} sub={t('noOrdersSub')} />
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  scroll: { paddingBottom: 24 },
  hero: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingBottom: 36, borderBottomLeftRadius: 22, borderBottomRightRadius: 22 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hbtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 3, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  page: { paddingHorizontal: 14, marginTop: -22, gap: 12 },
  strip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff4ea', borderWidth: 1, borderColor: '#ffd2ad', borderRadius: radius.lg, padding: 12, ...shadow.card },
  stripIc: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { flexBasis: '47%', flexGrow: 1, minHeight: 82, borderRadius: radius.lg, padding: 12, gap: 4, justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border, ...shadow.card },
  pressed: { opacity: 0.75 },
  wstrip: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  secHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 40 },
  list: { gap: 10 },
  emptyCard: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
});
