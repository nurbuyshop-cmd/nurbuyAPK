import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { changePassword, updateMe, uploadProfilePhoto } from '@/api/account';
import { ApiError } from '@/api/api';
import { forgetMe } from '@/api/access';
import { saveProfile } from '@/api/profile';
import { Button } from '@/components/Button';
import { EditDialog, type DialogField } from '@/components/EditDialog';
import { Icon, type IconName } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import type { StringKey } from '@/i18n/en';
import { savedAddresses } from '@/lib/addresses';
import { errorText } from '@/lib/errors';
import { isStr, type Obj } from '@/lib/guards';
import { isEmail, isMobile, normalizeMobile } from '@/lib/phone';
import { pickPhoto } from '@/lib/photo';
import { unregisterPush } from '@/lib/push';
import { visitorId } from '@/lib/visitor';
import { useAuth } from '@/store/auth';
import { useConsent } from '@/store/consent';
import { useFollows } from '@/store/follows';
import { digits, useI18n, useT, type Lang } from '@/store/i18n';
import { placeText, selectedPlaces, useLocation } from '@/store/location';
import { toast } from '@/store/toast';
import { colors, radius, shadow, TOUCH } from '@/theme';

type Dialog = { title: string; fields: DialogField[]; onSave: (v: Record<string, string>) => Promise<string> | string } | null;

/** Merges a change into the profile JSON and saves it; returns an error text or ''. */
async function patchProfile(patch: Obj, t: (k: StringKey) => string): Promise<string> {
  const auth = useAuth.getState();
  const before = auth.profile;
  const next = { ...before, ...patch };
  auth.setProfile(next);
  try {
    await saveProfile(next);
    return '';
  } catch (e) {
    auth.setProfile(before);
    return errorText(e, t);
  }
}

export default function ProfileScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const setLang = useI18n((s) => s.setLang);
  const insets = useSafeAreaInsets();
  const status = useAuth((s) => s.status);
  const user = useAuth((s) => s.user);
  const profile = useAuth((s) => s.profile);
  const logout = useAuth((s) => s.logout);
  const following = useFollows((s) => s.ids.length);
  const consent = useConsent();
  const areas = useLocation((s) => s.areas);
  const sel = useLocation((s) => s.sel);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [busy, setBusy] = useState<'' | 'avatar' | 'cover' | 'out'>('');

  const avatar = isStr(profile.avatar) && /^(https:|data:image)/.test(profile.avatar) ? profile.avatar : null;
  const cover = isStr(profile.cover) && /^(https:|data:image)/.test(profile.cover) ? profile.cover : null;
  const { list: addr, parts: addrParts } = savedAddresses(profile);
  const user_ = status === 'user' ? user : null;

  // profile photo and cover are uploaded as image files; the server writes their address into the profile
  const onPhoto = async (kind: 'avatar' | 'cover') => {
    let ph: { uri: string } | null;
    try {
      ph = await pickPhoto(kind);
    } catch {
      toast(t('photoFailed'));
      return;
    }
    if (!ph) return;
    setBusy(kind);
    try {
      const url = await uploadProfilePhoto(kind, ph.uri);
      const auth = useAuth.getState();
      auth.setProfile({ ...auth.profile, [kind]: url });
      toast(t('photoSaved'));
    } catch (e) {
      toast(e instanceof ApiError && e.status !== 0 && e.error !== 'Error' ? `${t('photoFailed')} (${e.error})` : t('photoFailed'));
    } finally {
      setBusy('');
    }
  };
  const onAvatar = () => onPhoto('avatar');
  const onCover = () => onPhoto('cover');

  // name, mobile and email are each changed on their own (only that one value is sent)
  const saveMe = async (p: { name?: string; mobile?: string; email?: string }) => {
    try {
      const u = await updateMe(p);
      useAuth.setState({ user: u });
      toast(t('saved'));
      return '';
    } catch (e) {
      return errorText(e, t);
    }
  };

  const editName = () =>
    setDialog({
      title: t('editName'),
      fields: [{ key: 'v', label: t('name'), value: user_?.name, autoComplete: 'name', maxLength: 40 }],
      onSave: (v) => (!v.v ? t('vName') : saveMe({ name: v.v })),
    });

  const editMobile = () =>
    setDialog({
      title: t('editMobile'),
      fields: [{ key: 'v', label: t('mobileLabel'), value: user_?.mobile, keyboardType: 'phone-pad', autoComplete: 'tel' }],
      onSave: (v) => (!isMobile(v.v ?? '') ? t('vMobile') : saveMe({ mobile: normalizeMobile(v.v ?? '') })),
    });

  const editEmail = () =>
    setDialog({
      title: t('editEmail'),
      fields: [{ key: 'v', label: t('emailLabel'), value: user_?.email, keyboardType: 'email-address', autoComplete: 'email' }],
      onSave: (v) => (v.v && !isEmail(v.v) ? t('vEmail') : saveMe({ email: v.v ?? '' })),
    });

  const editPassword = () =>
    setDialog({
      title: user_?.hasPw ? t('changePassword') : t('setPassword'),
      fields: [
        ...(user_?.hasPw ? [{ key: 'cur', label: t('currentPw'), password: true, autoComplete: 'current-password' as const }] : []),
        { key: 'pw', label: t('newPw'), password: true, autoComplete: 'new-password' },
      ],
      onSave: async (v) => {
        if ((v.pw ?? '').length < 6) return t('vPwShort');
        try {
          await changePassword(v.pw ?? '', v.cur ?? '');
          void useAuth.getState().refreshMe();
          toast(t('pwChanged'));
          return '';
        } catch (e) {
          return errorText(e, t);
        }
      },
    });

  // add (-1) or edit a saved address on the same page as the delivery location (map, GPS, lists, lines)
  const openAddr = (i: number) => router.push({ pathname: '/location', params: { mode: 'addr', i: String(i) } });
  const removeAddr = (i: number) => {
    const next = addr.filter((_, j) => j !== i);
    void patchProfile({ addr: next, addrX: addrParts.filter((x) => next.includes(x.t)) }, t);
  };

  const doLogout = async () => {
    setBusy('out');
    await unregisterPush();
    await logout();
    setBusy('');
    toast(t('authLoggedOut'));
  };

  const erase = async () => {
    try {
      await forgetMe(await visitorId());
      toast(t('erased'));
    } catch (e) {
      toast(errorText(e, t));
    }
  };

  const place = placeText(selectedPlaces(areas, sel).slice(-2), lang);

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 30 }}>
      {user_ ? (
        <>
          <View style={[styles.cover, { paddingTop: insets.top }]}>
            {cover ? <Image source={cover} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
            <View style={[styles.coverBtns, { top: insets.top + 8 }]}>
              {cover ? <RoundBtn icon="x" label={t('removeCover')} onPress={() => void patchProfile({ cover: '' }, t)} /> : null}
              <RoundBtn icon="cam" label={t('changeCover')} onPress={() => void onCover()} busy={busy === 'cover'} />
            </View>
          </View>
          <View style={styles.headCard}>
            <Pressable style={styles.avatar} onPress={() => void onAvatar()} accessibilityRole="button" accessibilityLabel={t('changePhoto')}>
              {busy === 'avatar' ? (
                <ActivityIndicator color={colors.primary} />
              ) : avatar ? (
                <Image source={avatar} style={styles.avatarImg} contentFit="cover" />
              ) : (
                <Icon name="user" size={40} color={colors.primary} />
              )}
              <View style={styles.cam}><Icon name="cam" size={14} color={colors.white} /></View>
            </Pressable>
            <Pressable style={styles.nameRow} onPress={editName} accessibilityRole="button" accessibilityLabel={t('editName')}>
              <Txt weight="bold" size={20} numberOfLines={1}>{user_.name}</Txt>
              <Icon name="pen" size={16} color={colors.grey} />
            </Pressable>
            {place ? <Txt size={13} color={colors.grey}>{place}</Txt> : null}
            {user_.mvf ? (
              <View style={styles.verified}>
                <Icon name="check" size={13} color="#12a150" strokeWidth={3} />
                <Txt weight="bold" size={12} color="#12a150">{t('verified')}</Txt>
              </View>
            ) : null}
          </View>

          <Group>
            <Row icon="heart" label={t('following')} value={t('shopsYouFollow') + ' · ' + digits(following, lang)} onPress={() => router.push({ pathname: '/shops', params: { following: '1' } })} />
            <Row icon="bag" label={t('wishlist')} onPress={() => router.push('/wishlist')} />
            <Row icon="box" label={t('myOrders')} onPress={() => router.navigate('/orders')} />
            <Row icon="wallet" label={t('wallet')} onPress={() => router.navigate('/wallet')} />
            <Row icon="chat" label={t('helpSupport')} onPress={() => router.push('/chat')} />
          </Group>

          <Group>
            <Row icon="phone" label={t('mobileLabel')} value={user_.mobile} action={t('edit')} onPress={editMobile} />
            <Row icon="mail" label={t('emailLabel')} value={user_.email || '—'} action={t('edit')} onPress={editEmail} />
            <Row icon="lock" label={t('password')} value={user_.hasPw ? '••••••' : ''} action={user_.hasPw ? t('changePassword') : t('setPassword')} onPress={editPassword} />
          </Group>

          <Group>
            <View style={styles.addrHead}>
              <Icon name="pin" size={20} color={colors.grey} />
              <Txt weight="bold" size={15}>{t('addresses')}</Txt>
            </View>
            {addr.map((a, i) => (
              <View key={a + i} style={styles.addr}>
                <Txt size={14} style={styles.flex}>{a}</Txt>
                <Pressable onPress={() => openAddr(i)} style={styles.small} accessibilityRole="button">
                  <Txt weight="bold" size={12.5} color={colors.primary}>{t('edit')}</Txt>
                </Pressable>
                <Pressable onPress={() => removeAddr(i)} style={styles.small} accessibilityRole="button" accessibilityLabel={t('deleteAddr')}>
                  <Icon name="trash" size={18} color={colors.danger} />
                </Pressable>
              </View>
            ))}
            <Pressable onPress={() => openAddr(-1)} style={styles.addBtn} accessibilityRole="button">
              <Icon name="plus" size={18} color={colors.primary} strokeWidth={2.4} />
              <Txt weight="bold" size={14} color={colors.primary}>{t('addAddress')}</Txt>
            </Pressable>
          </Group>
        </>
      ) : (
        <View style={[styles.guest, { paddingTop: insets.top + 24 }]}>
          <Icon name="user" size={48} color={colors.primary} />
          <Txt size={15} color={colors.grey} style={styles.center}>{t('profileGuest')}</Txt>
          <Button label={t('authNeedBtn')} onPress={() => router.push('/auth')} style={styles.stretch} />
        </View>
      )}

      <Group>
        <View style={styles.langHead}>
          <Icon name="globe" size={20} color={colors.grey} />
          <Txt weight="bold" size={15}>{t('language')}</Txt>
        </View>
        <View style={styles.langRow}>
          {([{ l: 'bn', label: 'বাংলা' }, { l: 'en', label: 'English' }] as { l: Lang; label: string }[]).map((o) => (
            <Pressable key={o.l} accessibilityRole="radio" accessibilityState={{ selected: lang === o.l }} onPress={() => setLang(o.l)} style={[styles.langBtn, lang === o.l && styles.langOn]}>
              <Txt weight="semibold" size={14.5} color={lang === o.l ? colors.primary : colors.grey}>{o.label}</Txt>
            </Pressable>
          ))}
        </View>
      </Group>

      {consent.info?.personalization === 1 ? (
        <Group>
          <Txt weight="bold" size={15}>{t('privacyChoices')}</Txt>
          <View style={styles.switchRow}>
            <Txt size={14} style={styles.flex}>{t('allowTracking')}</Txt>
            <Switch value={consent.consent === 1} onValueChange={(v) => void consent.setConsent(v ? 1 : 0)} trackColor={{ true: colors.primary }} accessibilityLabel={t('allowTracking')} />
          </View>
          <Pressable onPress={() => void erase()} style={styles.erase} accessibilityRole="button">
            <Txt weight="bold" size={13.5} color={colors.danger}>{t('eraseActivity')}</Txt>
          </Pressable>
        </Group>
      ) : null}

      <Group>
        <Row icon="info" label={t('pgAbout')} onPress={() => router.push({ pathname: '/page/[slug]', params: { slug: 'about' } })} />
        <Row icon="shield" label={t('pgPrivacy')} onPress={() => router.push({ pathname: '/page/[slug]', params: { slug: 'privacy' } })} />
        <Row icon="ret" label={t('pgReturn')} onPress={() => router.push({ pathname: '/page/[slug]', params: { slug: 'return' } })} />
        <Row icon="truck" label={t('pgShipping')} onPress={() => router.push({ pathname: '/page/[slug]', params: { slug: 'shipping' } })} />
        {user_ ? <Row icon="logout" label={t('logout')} danger onPress={() => void doLogout()} busy={busy === 'out'} /> : null}
      </Group>

      {dialog ? <EditDialog title={dialog.title} fields={dialog.fields} onSave={dialog.onSave} onClose={() => setDialog(null)} /> : null}
    </ScrollView>
  );
}

function Group({ children }: { children: ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

function Row({ icon, label, value, action, danger, busy, onPress }: { icon: IconName; label: string; value?: string; action?: string; danger?: boolean; busy?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={busy} style={({ pressed }) => [styles.row, pressed && styles.pressed]} accessibilityRole="button">
      <View style={[styles.ic, danger && styles.icDanger]}>
        <Icon name={icon} size={19} color={danger ? colors.danger : colors.primary} />
      </View>
      <View style={styles.flex}>
        <Txt weight="semibold" size={14.5} color={danger ? colors.danger : colors.text}>{label}</Txt>
        {value ? <Txt size={13} color={colors.grey} numberOfLines={1}>{value}</Txt> : null}
      </View>
      {busy ? <ActivityIndicator color={colors.primary} /> : action ? <Txt weight="bold" size={12.5} color={colors.primary}>{action}</Txt> : <Icon name="chevron" size={18} color={colors.grey} />}
    </Pressable>
  );
}

function RoundBtn({ icon, label, busy, onPress }: { icon: IconName; label: string; busy?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.round} accessibilityRole="button" accessibilityLabel={label}>
      {busy ? <ActivityIndicator color={colors.white} /> : <Icon name={icon} size={18} color={colors.white} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1, minWidth: 0 },
  full: { width: '100%', height: '100%' },
  // the photo is clipped to the circle (the frame itself stays open so the camera badge can sit on its edge)
  avatarImg: { width: 92, height: 92, borderRadius: 46 },
  center: { textAlign: 'center' },
  stretch: { alignSelf: 'stretch' },
  cover: { height: 170, backgroundColor: colors.primary, overflow: 'hidden' },
  coverBtns: { position: 'absolute', right: 12, flexDirection: 'row', gap: 8 },
  round: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  headCard: { alignItems: 'center', marginTop: -50, gap: 4, paddingHorizontal: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: colors.white, backgroundColor: '#eef0fa', alignItems: 'center', justifyContent: 'center', overflow: 'visible', ...shadow.card },
  cam: { position: 'absolute', right: 0, bottom: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: TOUCH, marginTop: 4 },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.okBg, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  group: { backgroundColor: colors.white, borderRadius: radius.lg, marginHorizontal: 12, marginTop: 12, padding: 6, ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingHorizontal: 8, borderRadius: 12 },
  pressed: { backgroundColor: '#f5f6fa' },
  ic: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#eef0fa', alignItems: 'center', justifyContent: 'center' },
  icDanger: { backgroundColor: colors.dangerBg },
  addrHead: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
  addr: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#f0f1f6' },
  small: { minWidth: 40, minHeight: 40, alignItems: 'center', justifyContent: 'center' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: TOUCH, paddingHorizontal: 8 },
  guest: { alignItems: 'center', gap: 12, paddingHorizontal: 24 },
  langHead: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
  langRow: { flexDirection: 'row', gap: 8, padding: 8, paddingTop: 0 },
  langBtn: { flex: 1, minHeight: TOUCH, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  langOn: { borderColor: colors.primary, backgroundColor: '#eef0fa' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 8 },
  erase: { minHeight: TOUCH, justifyContent: 'center', paddingHorizontal: 8 },
});
