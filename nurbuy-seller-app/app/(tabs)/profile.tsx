import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { changePassword, removeCover, uploadForSeller } from '@/api/seller';
import { Button } from '@/components/Button';
import { DocRows, uploadErrorText } from '@/components/DocRows';
import { EditSellerSheet } from '@/components/EditSellerSheet';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { PickSourceSheet } from '@/components/PickSourceSheet';
import { Sheet } from '@/components/Sheet';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Avatar, Banner, Card, Chip, KV, MenuRow } from '@/components/ui';
import { errorField, errorText, fieldText } from '@/lib/errors';
import { pickFile, type PickSource } from '@/lib/files';
import { maskNid } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { useDash } from '@/store/dash';
import { toggleLang, useLang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors, radius } from '@/theme';

/** Shop profile: cover and logo, details, documents, password, language and logout (website scrProfile()). */
export default function Profile() {
  const { t, n, lang } = useLang();
  const seller = useAuth((s) => s.seller);
  const setSeller = useAuth((s) => s.setSeller);
  const unread = useDash((s) => s.unread);
  const [pick, setPick] = useState<'cover' | 'logo' | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [pw, setPw] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    void useAuth.getState().refreshMe();
  }, []);

  if (!seller) return null;

  const upload = async (kind: 'cover' | 'logo', src: PickSource) => {
    try {
      const f = await pickFile(src, kind, kind);
      if (!f) return;
      setBusy(kind);
      toast(kind === 'cover' ? t('uploadingCover') : t('uploadingLogo'));
      setSeller(await uploadForSeller(kind, f));
      toast(kind === 'cover' ? t('coverUpdated') : t('logoUpdated'), 'ok');
    } catch (e) {
      toast(uploadErrorText(e, t), 'bad');
    }
    setBusy(null);
  };

  const dropCover = async () => {
    setBusy('rm');
    try {
      setSeller(await removeCover());
      toast(t('coverRemoved'), 'ok');
    } catch (e) {
      toast(errorText(e, t), 'bad');
    }
    setBusy(null);
  };

  const chg = seller.chg;

  return (
    <View style={styles.flex}>
      <TopBar title={t('profile')} />
      <ScrollView
        contentContainerStyle={styles.page}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await useAuth.getState().refreshMe();
              setRefreshing(false);
            }}
          />
        }
      >
        <View style={styles.coverCard}>
          <View style={styles.cover}>
            {seller.cover ? (
              <Image source={{ uri: seller.cover }} style={StyleSheet.absoluteFill} contentFit="cover" />
            ) : (
              <View style={styles.noCover}>
                <Icon name="img" size={28} color={colors.grey} />
                <Txt size={13} color={colors.grey}>{t('noCover')}</Txt>
              </View>
            )}
            <View style={styles.logo}>
              <Avatar name={seller.shop_name} uri={seller.logo} size={74} ring />
            </View>
          </View>
          <View style={styles.coverBody}>
            <Txt weight="bold" size={20} style={styles.center}>{seller.shop_name}</Txt>
            <View style={styles.chips}>
              <Chip label={t('approvedSeller')} tone="green" />
              <Chip label="NurBuy Minutes" tone="grey" />
            </View>
            <Txt weight="semibold" size={14.5} style={styles.coverTitle}>{t('coverLogo')}</Txt>
            <Txt size={12.5} color={colors.grey}>{t('coverHint')}</Txt>
            <View style={styles.btnRow}>
              <Button small variant="secondary" icon="camera" label={seller.cover ? t('changeCover') : t('addCover')} busy={busy === 'cover'} onPress={() => setPick('cover')} style={styles.grow} />
              <Button small variant="secondary" icon="camera" label={t('changeLogo')} busy={busy === 'logo'} onPress={() => setPick('logo')} style={styles.grow} />
            </View>
            {seller.cover ? <Button small variant="danger" icon="trash" label={t('removeCover')} busy={busy === 'rm'} onPress={() => void dropCover()} /> : null}
          </View>
        </View>

        <Card>
          <MenuRow icon="bell" label={t('notifications')} badge={unread ? n(unread > 99 ? '99+' : unread) : undefined} onPress={() => router.push('/notifications')} />
          <MenuRow icon="receipt" label={t('txns')} onPress={() => router.push('/txns')} />
          <MenuRow icon="tag" label={t('coupons')} onPress={() => router.push('/coupons')} />
          <MenuRow icon="bolt" label={t('boost')} onPress={() => router.push('/boost')} />
        </Card>

        <Card>
          <MenuRow
            icon="pin"
            label={t('hoursLoc')}
            sub={`${seller.hours ? (seller.open_now ? t('openNow') : t('closedNow')) : t('alwaysOpen')} · ${seller.lat != null ? t('locSet') : t('locNotSet')}`}
            onPress={() => router.push('/shop')}
          />
        </Card>

        {chg ? (
          <Banner tone="warn" icon="clock">
            <Txt weight="bold" size={14}>{t('pendingChanges')}</Txt>
            {Object.entries(chg).map(([k, v]) => (
              <Txt key={k} size={14}>{`${k === 'mobile' ? t('mobile') : k === 'email' ? t('email') : k}: ${k === 'mobile' ? n(v) : v || '-'}`}</Txt>
            ))}
          </Banner>
        ) : null}

        <Card title={t('shopDetails')} right={<Button small variant="secondary" icon="edit" label={t('edit')} onPress={() => setEdit(true)} />}>
          <KV k={t('shop')} v={seller.shop_name} />
          <KV k={t('owner')} v={seller.owner_name} />
          <KV k={t('mobile')} v={n(seller.mobile)} />
          <KV k={t('email')} v={seller.email || '-'} />
          <KV k={t('address')} v={seller.address} />
          <KV k={t('category')} v={seller.category || '-'} />
          {seller.about ? <KV k={t('about')} v={seller.about} /> : null}
          <KV k={t('nid')} v={n(maskNid(seller.nid))} />
          {seller.trade_no ? <KV k={t('tradeNo')} v={seller.trade_no} /> : null}
          <Txt size={12.5} color={colors.grey} style={styles.hint}>{t('profileHint')}</Txt>
        </Card>

        <Card title={t('documents')}>
          <DocRows seller={seller} canEdit={false} />
        </Card>

        <Card title={t('settings')}>
          <View style={styles.btns}>
            <Button variant="secondary" icon="lock" label={t('changePw')} onPress={() => setPw(true)} />
            <Button variant="secondary" icon="globe" label={t('langSwitchLong')} onPress={toggleLang} />
            <Button
              variant="danger"
              icon="logout"
              label={t('logout')}
              busy={busy === 'out'}
              onPress={() => {
                setBusy('out');
                void useAuth.getState().logout();
              }}
            />
          </View>
        </Card>
        <Txt size={12} color={colors.grey} style={styles.center} latin>{`NurBuy Seller · ${lang === 'bn' ? 'বাংলা' : 'English'}`}</Txt>
      </ScrollView>

      {pick ? <PickSourceSheet title={pick === 'cover' ? t('changeCover') : t('changeLogo')} onClose={() => setPick(null)} onPick={(s) => void upload(pick, s)} /> : null}
      {edit ? <EditSellerSheet onClose={() => setEdit(false)} /> : null}
      {pw ? <PasswordSheet onClose={() => setPw(false)} /> : null}
    </View>
  );
}

function PasswordSheet({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const [v, setV] = useState({ current: '', password: '', password2: '' });
  const [err, setErr] = useState<{ current?: string; password?: string; password2?: string }>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof v) => (x: string) => {
    setV((s) => ({ ...s, [k]: x }));
    if (err[k]) setErr((s) => ({ ...s, [k]: undefined }));
  };
  const save = async () => {
    const e: typeof err = {};
    if (!v.current) e.current = t('currentPwNeed');
    if (v.password.length < 8) e.password = t('fPassword');
    else if (v.password !== v.password2) e.password2 = t('fPwMismatch');
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await changePassword(v.current, v.password);
      toast(t('pwChanged'), 'ok');
      onClose();
    } catch (x) {
      setBusy(false);
      const f = errorField(x);
      if (f === 'current' || f === 'password') setErr({ [f]: fieldText(x, t) });
      else toast(errorText(x, t), 'bad');
    }
  };
  return (
    <Sheet title={t('changePw')} onClose={onClose}>
      <Field label={t('currentPw')} password value={v.current} onChangeText={set('current')} autoComplete="current-password" error={err.current} />
      <Field label={t('newPw')} password value={v.password} onChangeText={set('password')} autoComplete="new-password" error={err.password} />
      <Field label={t('newPw2')} password value={v.password2} onChangeText={set('password2')} autoComplete="new-password" error={err.password2} />
      <Button label={t('updatePw')} busy={busy} onPress={() => void save()} />
      <Button label={t('cancel')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  page: { padding: 14, gap: 12, paddingBottom: 30 },
  coverCard: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cover: { height: 130, backgroundColor: '#e9edf7' },
  noCover: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  logo: { position: 'absolute', left: 0, right: 0, bottom: -37, alignItems: 'center' },
  coverBody: { paddingTop: 44, padding: 16, gap: 6 },
  center: { textAlign: 'center' },
  chips: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 6 },
  coverTitle: { marginTop: 6 },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  grow: { flex: 1 },
  hint: { marginTop: 10 },
  btns: { gap: 10 },
});
