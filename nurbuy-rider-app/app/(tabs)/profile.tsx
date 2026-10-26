import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { changePassword, upload } from '@/api/rider';
import { Button } from '@/components/Button';
import { DocRows, uploadErrorText } from '@/components/DocRows';
import { EditRiderSheet } from '@/components/EditRiderSheet';
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
import { CHANGE_LABEL, vehicleText } from '@/lib/labels';
import { useAuth } from '@/store/auth';
import { toggleLang, useLang } from '@/store/i18n';
import { usePhoto } from '@/store/photo';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

/** Rider profile: photo, details, documents, password, language and logout (website scrProfile()). */
export default function Profile() {
  const { t, n, lang } = useLang();
  const rider = useAuth((s) => s.rider);
  const setRider = useAuth((s) => s.setRider);
  const photo = usePhoto((s) => s.uri);
  const [pick, setPick] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [pw, setPw] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // pending changes may have been approved meanwhile: read the account each time the tab opens
  useFocusEffect(
    useCallback(() => {
      void useAuth.getState().refreshMe();
    }, []),
  );

  if (!rider) return null;

  const changePhoto = async (src: PickSource) => {
    try {
      const f = await pickFile(src, 'photo', 'photo');
      if (!f) return;
      setBusy('photo');
      toast(t('uploadingPhoto'));
      setRider(await upload('photo', f));
      await usePhoto.getState().load(true);
      toast(t('photoUpdated'), 'ok');
    } catch (e) {
      toast(uploadErrorText(e, t), 'bad');
    }
    setBusy(null);
  };

  const chg = rider.chg;
  const chgValue = (k: string, v: string) => (k === 'vehicle_type' ? vehicleText(v, t) : k === 'mobile' ? n(v) : v || '-');

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
              await usePhoto.getState().load(true);
              setRefreshing(false);
            }}
          />
        }
      >
        <Card style={styles.head}>
          <Pressable onPress={() => setPick(true)} disabled={busy === 'photo'} accessibilityRole="button" accessibilityLabel={t('changePhoto')} style={styles.avWrap}>
            <Avatar name={rider.name} uri={photo} size={92} />
            <View style={styles.cam}>
              <Icon name="camera" size={17} color={colors.white} />
            </View>
          </Pressable>
          <Txt weight="bold" size={20} style={styles.center}>{rider.name}</Txt>
          <View style={styles.chips}>
            <Chip label={t('approvedRider')} tone="green" />
            {rider.code ? <Chip label={rider.code} tone="grey" /> : null}
          </View>
        </Card>

        <Card>
          <MenuRow icon="bag" label={t('earnings')} sub={t('earningsSub')} onPress={() => router.push('/earnings')} />
          <MenuRow icon="wallet" label={t('cashCollected')} sub={t('cashSub')} onPress={() => router.push('/cash')} />
        </Card>

        {chg ? (
          <Banner tone="warn" icon="clock">
            <Txt weight="bold" size={14}>{t('pendingChanges')}</Txt>
            {Object.entries(chg).map(([k, v]) => {
              const label = CHANGE_LABEL[k];
              return <Txt key={k} size={14}>{`${label ? t(label) : k}: ${chgValue(k, v)}`}</Txt>;
            })}
          </Banner>
        ) : null}

        <Card title={t('myDetails')} right={<Button small variant="secondary" icon="edit" label={t('edit')} onPress={() => setEdit(true)} />}>
          <KV k={t('mobile')} v={n(rider.mobile)} />
          <KV k={t('email')} v={rider.email || '-'} />
          <KV k={t('address')} v={rider.address} />
          <KV k={t('vehicle')} v={vehicleText(rider.vehicle_type, t) + (rider.vehicle_no ? ` - ${rider.vehicle_no}` : '')} />
          {rider.license_no ? <KV k={t('licenseShort')} v={rider.license_no} /> : null}
          <KV k={t('emergContactShort')} v={`${rider.emerg_name} (${n(rider.emerg_mobile)})`} />
          <KV k={t('nid')} v={n(maskNid(rider.nid))} />
          <Txt size={12.5} color={colors.grey} style={styles.hint}>{t('profileHint')}</Txt>
        </Card>

        <Card title={t('documents')}>
          <DocRows rider={rider} canEdit={false} />
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
        <Txt size={12} color={colors.grey} style={styles.center} latin>{`NurBuy Rider · ${lang === 'bn' ? 'বাংলা' : 'English'}`}</Txt>
      </ScrollView>

      {pick ? <PickSourceSheet title={t('changePhoto')} onClose={() => setPick(false)} onPick={(s) => void changePhoto(s)} /> : null}
      {edit ? <EditRiderSheet onClose={() => setEdit(false)} /> : null}
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
  head: { alignItems: 'center', gap: 6 },
  avWrap: { marginBottom: 4 },
  cam: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.orange,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  chips: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  hint: { marginTop: 10 },
  btns: { gap: 10 },
});
