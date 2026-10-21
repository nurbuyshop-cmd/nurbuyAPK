import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { markNotificationsRead, notifications, reapply } from '@/api/seller';
import { Button } from '@/components/Button';
import { DocRows } from '@/components/DocRows';
import { EditSellerSheet } from '@/components/EditSellerSheet';
import { Icon, type IconName } from '@/components/Icon';
import { NotifCards } from '@/components/NotifCards';
import { LangButton } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Banner, Card, KV } from '@/components/ui';
import { errorText } from '@/lib/errors';
import { useLoad } from '@/lib/useLoad';
import { useAuth } from '@/store/auth';
import { toggleLang, useLang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

/** The gate for shops that are not approved: under review, rejected (re-apply) or suspended (website scrStatus()). */
export default function Status() {
  const { t, n } = useLang();
  const insets = useSafeAreaInsets();
  const seller = useAuth((s) => s.seller);
  const justApplied = useAuth((s) => s.justApplied);
  const [busy, setBusy] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const msgs = useLoad('status-msgs', notifications);
  const { reload } = msgs;
  // the root layout re-reads the account every 20 s; the messages follow it
  useEffect(() => {
    if (seller) void reload();
  }, [seller, reload]);
  const unread = msgs.data?.unread ?? 0;
  useEffect(() => {
    if (unread > 0) void markNotificationsRead().catch(() => {});
  }, [unread]);

  if (!seller) return null;
  const st = seller.status;
  const rej = st === 'rejected';
  const sus = st === 'suspended';

  const check = async () => {
    setBusy('chk');
    const before = seller.status;
    const s = await useAuth.getState().refreshMe();
    setBusy(null);
    if (!s) toast(t('errNetwork'), 'bad');
    else if (s.status === before) toast(t('noChange'));
  };

  const doReapply = async () => {
    setBusy('re');
    try {
      useAuth.getState().setSeller(await reapply());
      useAuth.setState({ justApplied: false });
      toast(t('reapplied'), 'ok');
    } catch (e) {
      toast(errorText(e, t), 'bad');
    }
    setBusy(null);
  };

  const logout = async () => {
    setBusy('out');
    await useAuth.getState().logout();
  };

  const hero: [IconName, string, string] = sus ? ['lock', t('stSuspended'), t('stSuspendedSub')] : rej ? ['x', t('stRejected'), t('stRejectedSub')] : ['clock', t('stReview'), t('stReviewSub')];
  const bad = sus || rej;

  return (
    <View style={styles.flex}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await Promise.all([useAuth.getState().refreshMe(), reload()]);
              setRefreshing(false);
            }}
          />
        }
      >
        <View style={[styles.hero, bad && styles.heroBad, { paddingTop: insets.top + 12 }]}>
          <View style={styles.heroTop}>
            <Txt weight="bold" size={17} color={colors.white} latin style={styles.flex}>NurBuy Seller</Txt>
            <LangButton label={t('langSwitch')} onPress={toggleLang} />
          </View>
          <View style={styles.ci}>
            <Icon name={hero[0]} size={34} color={bad ? colors.danger : colors.primary} />
          </View>
          <Txt weight="bold" size={22} color={colors.white} style={styles.center}>{hero[1]}</Txt>
          <Txt size={14.5} color="rgba(255,255,255,0.9)" style={styles.center}>{hero[2]}</Txt>
        </View>

        <View style={styles.page}>
          {justApplied && st === 'pending' ? <Banner tone="ok">{t('stSubmitted')}</Banner> : null}
          {bad ? (
            <View style={styles.rsn}>
              <Txt weight="bold" size={13} color={colors.danger}>{sus ? t('reason') : t('rejectReason')}</Txt>
              <Txt size={15.5}>{seller.reject_reason || (sus ? t('stContact') : t('noReason'))}</Txt>
            </View>
          ) : null}

          {msgs.data && msgs.data.list.length ? (
            <Card title={t('msgsFromNurbuy')}>
              <NotifCards list={msgs.data.list.slice(0, 5)} />
            </Card>
          ) : null}

          {!sus ? (
            <>
              <Card title={t('yourApp')}>
                <KV k={t('shop')} v={seller.shop_name} />
                <KV k={t('owner')} v={seller.owner_name} />
                <KV k={t('mobile')} v={n(seller.mobile)} />
                <KV k={t('email')} v={seller.email || '-'} />
                <KV k={t('address')} v={seller.address} />
                <KV k={t('nid')} v={n(seller.nid)} />
                {seller.trade_no ? <KV k={t('tradeNo')} v={seller.trade_no} /> : null}
              </Card>
              <Card title={t('documents')}>
                <DocRows seller={seller} canEdit />
              </Card>
            </>
          ) : null}

          <View style={styles.btns}>
            {rej ? (
              <Button label={t('reapply')} icon="refresh" variant="orange" busy={busy === 're'} onPress={() => void doReapply()} />
            ) : (
              <Button label={t('checkStatus')} icon="refresh" busy={busy === 'chk'} onPress={() => void check()} />
            )}
            {!sus ? <Button label={t('editApp')} icon="edit" variant="secondary" onPress={() => setEdit(true)} /> : null}
            <Button label={t('logout')} icon="logout" variant="ghost" busy={busy === 'out'} onPress={() => void logout()} />
          </View>
        </View>
      </ScrollView>
      {edit ? <EditSellerSheet onClose={() => setEdit(false)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  hero: { backgroundColor: colors.primary, paddingHorizontal: 18, paddingBottom: 26, alignItems: 'center', gap: 6 },
  heroBad: { backgroundColor: '#b4232f' },
  heroTop: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', marginBottom: 10 },
  ci: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  center: { textAlign: 'center' },
  page: { padding: 14, gap: 12 },
  rsn: { backgroundColor: colors.dangerBg, borderRadius: 14, padding: 14, gap: 4, borderLeftWidth: 4, borderLeftColor: colors.danger },
  btns: { gap: 10, marginTop: 4 },
});
