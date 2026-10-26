import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { docKindsFor, signup, upload, type LocalFile, type UploadKind, type Vehicle } from '@/api/rider';
import { Button } from '@/components/Button';
import { uploadErrorText } from '@/components/DocRows';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { PickSourceSheet } from '@/components/PickSourceSheet';
import { LangButton, TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Banner, Card, Chip } from '@/components/ui';
import { VehiclePicker } from '@/components/VehiclePicker';
import type { StringKey } from '@/i18n/en';
import { errorField, errorText, fieldText } from '@/lib/errors';
import { pickFile, type PickSource } from '@/lib/files';
import { DOC_LABEL } from '@/lib/labels';
import { normMobile, validEmail, validMobile, validNid } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { toggleLang, useLang } from '@/store/i18n';
import { usePhoto } from '@/store/photo';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

type Key = 'name' | 'mobile' | 'email' | 'address' | 'nid' | 'password' | 'password2' | 'vehicle_no' | 'license_no' | 'emerg_name' | 'emerg_mobile';
type ErrKey = Key | 'vehicle_type' | UploadKind | 'all';
const STEP1: string[] = ['name', 'mobile', 'email', 'address', 'nid', 'password'];
const STEP2: string[] = ['vehicle_type', 'vehicle_no', 'license_no', 'emerg_name', 'emerg_mobile'];

type UpState = { s: 'wait' | 'up' | 'done' | 'err'; p: number; m?: string };

/** "Become a Rider" in 3 steps: personal, vehicle + emergency contact, documents (website scrApply()). */
export default function Apply() {
  const { t, n } = useLang();
  const startApplication = useAuth((s) => s.startApplication);
  const finishApplication = useAuth((s) => s.finishApplication);
  const scroll = useRef<ScrollView>(null);
  const [step, setStepRaw] = useState(1);
  const [v, setV] = useState<Record<Key, string>>({
    name: '', mobile: '', email: '', address: '', nid: '', password: '', password2: '', vehicle_no: '', license_no: '', emerg_name: '', emerg_mobile: '',
  });
  const [vt, setVt] = useState<Vehicle | ''>('');
  const [err, setErr] = useState<Partial<Record<ErrKey, string>>>({});
  const [files, setFiles] = useState<Partial<Record<UploadKind, LocalFile>>>({});
  const [pickFor, setPickFor] = useState<UploadKind | null>(null);
  const [busy, setBusy] = useState(false);
  // after the account is created the photo and documents upload one by one
  const [signed, setSigned] = useState(false);
  const [up, setUp] = useState<Partial<Record<UploadKind, UpState>>>({});
  const [uploading, setUploading] = useState(false);

  const setStep = (s: number) => {
    setStepRaw(s);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  const set = (k: Key) => (x: string) => {
    setV((s) => ({ ...s, [k]: x }));
    if (err[k]) setErr((s) => ({ ...s, [k]: undefined }));
  };

  const goBack = useCallback(() => {
    if (signed) return true;
    if (step > 1) setStepRaw(step - 1);
    else if (router.canGoBack()) router.back();
    else router.replace('/login');
    return true;
  }, [signed, step]);

  // the phone's Back button walks back through the steps like the website's back arrow
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', goBack);
      return () => sub.remove();
    }, [goBack]),
  );

  const cyc = vt === 'cycle';
  const kinds = (): UploadKind[] => ['photo', ...docKindsFor(vt)];

  const check1 = (): boolean => {
    const e: Partial<Record<ErrKey, string>> = {};
    const need = (k: Key, ok: boolean, msg: StringKey) => {
      if (!ok) e[k] = t(msg);
    };
    need('name', v.name.trim().length >= 2, 'fName');
    need('mobile', validMobile(v.mobile), 'fMobile');
    need('email', !v.email.trim() || validEmail(v.email.trim()), 'fEmail');
    need('address', !!v.address.trim(), 'fAddress');
    need('nid', validNid(v.nid), 'fNid');
    if (v.password.length < 8) e.password = t('fPassword');
    else if (v.password2 !== v.password) e.password2 = t('fPwMismatch');
    setErr(e);
    return !Object.keys(e).length;
  };

  const check2 = (): boolean => {
    const e: Partial<Record<ErrKey, string>> = {};
    if (!vt) e.vehicle_type = t('fVehicleType');
    if (vt && !cyc) {
      if (!v.vehicle_no.trim()) e.vehicle_no = t('fVehicleNo');
      if (!v.license_no.trim()) e.license_no = t('fLicenseNo');
    }
    if (!v.emerg_name.trim()) e.emerg_name = t('fEmergName');
    if (!validMobile(v.emerg_mobile)) e.emerg_mobile = t('fEmergMobile');
    setErr(e);
    return !Object.keys(e).length;
  };

  const uploadAll = async (only?: UploadKind[]) => {
    const list = (only ?? kinds()).filter((k) => files[k]);
    setUploading(true);
    setUp((s) => ({ ...s, ...Object.fromEntries(list.map((k) => [k, { s: 'wait', p: 0 }])) }));
    let ok = true;
    for (const k of list) {
      const f = files[k];
      if (!f) continue;
      setUp((s) => ({ ...s, [k]: { s: 'up', p: 0.02 } }));
      try {
        const rider = await upload(k, f, (p) => setUp((s) => ({ ...s, [k]: { s: 'up', p } })));
        useAuth.getState().setRider(rider);
        setUp((s) => ({ ...s, [k]: { s: 'done', p: 1 } }));
      } catch (e) {
        ok = false;
        setUp((s) => ({ ...s, [k]: { s: 'err', p: 0, m: uploadErrorText(e, t) } }));
      }
    }
    setUploading(false);
    if (ok) finish();
  };

  const finish = () => {
    finishApplication();
    void useAuth.getState().refreshMe().then(() => usePhoto.getState().load(true));
    // the gate opens the status page
  };

  const submit = async () => {
    const miss = kinds().filter((k) => !files[k]);
    if (miss.length) {
      setErr(Object.fromEntries(miss.map((k) => [k, t('required')])));
      return;
    }
    if (!vt) return;
    setBusy(true);
    setErr({});
    try {
      const r = await signup({
        name: v.name.trim(),
        mobile: normMobile(v.mobile),
        email: v.email.trim(),
        address: v.address.trim(),
        nid: v.nid.replace(/\s+/g, ''),
        vehicle_type: vt,
        vehicle_no: cyc ? '' : v.vehicle_no.trim(),
        license_no: cyc ? '' : v.license_no.trim(),
        emerg_name: v.emerg_name.trim(),
        emerg_mobile: normMobile(v.emerg_mobile),
        password: v.password,
      });
      await startApplication(r.token, r.rider);
      setSigned(true);
      setBusy(false);
      void uploadAll();
    } catch (e) {
      setBusy(false);
      const f = errorField(e);
      if (f && (STEP1.includes(f) || STEP2.includes(f))) {
        setStep(STEP1.includes(f) ? 1 : 2);
        const m = fieldText(e, t);
        setErr({ [f]: m });
        toast(m, 'bad');
      } else {
        setErr({ all: errorText(e, t) });
        toast(errorText(e, t), 'bad');
      }
    }
  };

  const next = () => {
    if (step === 1 && check1()) setStep(2);
    else if (step === 2 && check2()) setStep(3);
    else if (step === 3) void submit();
  };

  const pick = async (k: UploadKind, src: PickSource) => {
    try {
      const f = await pickFile(src, k === 'photo' ? 'photo' : 'doc', k);
      if (!f) return;
      setFiles((s) => ({ ...s, [k]: f }));
      setErr((s) => ({ ...s, [k]: undefined }));
    } catch (e) {
      toast(uploadErrorText(e, t), 'bad');
    }
  };

  const names: StringKey[] = ['stepPersonal', 'stepVehicle', 'stepDocs'];
  const failed = kinds().some((k) => up[k]?.s === 'err');

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopBar
        title={t('applyTitle')}
        back={!signed}
        backTo="/login"
        right={signed ? undefined : <LangButton label={t('langSwitch')} onPress={toggleLang} />}
      />
      <ScrollView ref={scroll} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.prog}>
          {names.map((nm, i) => {
            const s = i + 1;
            const on = s === step && !signed;
            const done = s < step || signed;
            return (
              <View key={nm} style={styles.stepWrap}>
                {i > 0 ? <View style={[styles.line, (done || on) && styles.lineOn]} /> : null}
                <View style={styles.step}>
                  <View style={[styles.dot, on && styles.dotOn, done && styles.dotDone]}>
                    {done ? <Icon name="check" size={15} color={colors.white} strokeWidth={3} /> : <Txt weight="bold" size={13} color={on ? colors.white : colors.grey}>{n(s)}</Txt>}
                  </View>
                  <Txt size={12.5} weight="semibold" color={on ? colors.primary : colors.grey}>{t(nm)}</Txt>
                </View>
              </View>
            );
          })}
        </View>

        {step === 1 ? (
          <Card>
            <Field label={t('fullName')} required value={v.name} onChangeText={set('name')} autoCapitalize="words" autoComplete="name" maxLength={100} error={err.name} />
            <Field label={t('mobile')} required value={v.mobile} onChangeText={set('mobile')} keyboardType="phone-pad" autoComplete="tel" placeholder="01XXXXXXXXX" maxLength={16} error={err.mobile} />
            <Field label={t('emailOpt')} value={v.email} onChangeText={set('email')} keyboardType="email-address" autoComplete="email" maxLength={190} error={err.email} />
            <Field label={t('presentAddress')} required value={v.address} onChangeText={set('address')} rows={3} maxLength={500} error={err.address} />
            <Field label={t('nidNumber')} required value={v.nid} onChangeText={set('nid')} keyboardType="number-pad" maxLength={30} error={err.nid} />
            <Field label={t('pwMin')} required value={v.password} onChangeText={set('password')} password autoComplete="new-password" error={err.password} />
            <Field label={t('pwConfirm')} required value={v.password2} onChangeText={set('password2')} password autoComplete="new-password" error={err.password2} />
          </Card>
        ) : null}

        {step === 2 ? (
          <>
            <Card title={`${t('vehicleType')} *`}>
              <VehiclePicker
                value={vt}
                onChange={(x) => {
                  setVt(x);
                  setErr((s) => ({ ...s, vehicle_type: undefined }));
                }}
                error={err.vehicle_type}
              />
              {vt && !cyc ? (
                <>
                  <Field label={t('vehicleNo')} required value={v.vehicle_no} onChangeText={set('vehicle_no')} autoCapitalize="characters" maxLength={40} error={err.vehicle_no} />
                  <Field label={t('licenseNo')} required value={v.license_no} onChangeText={set('license_no')} autoCapitalize="characters" maxLength={60} error={err.license_no} />
                </>
              ) : null}
            </Card>
            <Card title={t('emergContact')}>
              <Field label={t('emergName')} required value={v.emerg_name} onChangeText={set('emerg_name')} autoCapitalize="words" maxLength={100} error={err.emerg_name} />
              <Field label={t('emergMobile')} required value={v.emerg_mobile} onChangeText={set('emerg_mobile')} keyboardType="phone-pad" placeholder="01XXXXXXXXX" maxLength={16} error={err.emerg_mobile} />
            </Card>
          </>
        ) : null}

        {step === 3 && !signed ? (
          <Card title={t('uploadDocs')}>
            <Txt size={13.5} color={colors.grey} style={styles.sub}>{t('uploadDocsSub')}</Txt>
            {kinds().map((k) => {
              const f = files[k];
              return (
                <Pressable key={k} onPress={() => setPickFor(k)} style={[styles.up, !!f && styles.upHas, !!err[k] && styles.upErr]} accessibilityRole="button">
                  <View style={styles.thumb}>
                    {f ? (
                      f.type.startsWith('image/') ? <Image source={{ uri: f.uri }} style={styles.thumbImg} contentFit="cover" /> : <Icon name="file" size={24} color={colors.primary} />
                    ) : (
                      <Icon name="camera" size={24} color={colors.primary} />
                    )}
                  </View>
                  <View style={styles.flexRow}>
                    <Txt weight="semibold" size={14.5}>
                      {t(DOC_LABEL[k])}
                      <Txt color={colors.danger}> *</Txt>
                    </Txt>
                    <Txt size={12.5} color={colors.grey} numberOfLines={1}>{f ? f.name : t(k === 'photo' ? 'photoPickHint' : 'docPickHint')}</Txt>
                    {err[k] ? <Txt size={12.5} color={colors.danger}>{err[k]}</Txt> : null}
                  </View>
                  <Icon name={f ? 'check' : 'chevron'} size={20} color={f ? colors.ok : colors.grey} />
                </Pressable>
              );
            })}
            {err.all ? <Banner tone="bad">{err.all}</Banner> : null}
          </Card>
        ) : null}

        {signed ? (
          <Card title={t('uploadingDocs')}>
            {kinds().map((k) => {
              const s = up[k] ?? { s: 'wait', p: 0 };
              return (
                <View key={k} style={styles.upRow}>
                  <View style={styles.flexRow}>
                    <Txt size={14.5}>{t(DOC_LABEL[k])}</Txt>
                    {s.s === 'up' ? (
                      <View style={styles.pb}>
                        <View style={[styles.pbFill, { width: `${Math.round(s.p * 100)}%` }]} />
                      </View>
                    ) : null}
                    {s.s === 'err' && s.m ? <Txt size={12.5} color={colors.danger}>{s.m}</Txt> : null}
                  </View>
                  {s.s === 'done' ? (
                    <Chip label={t('upUploaded')} tone="green" />
                  ) : s.s === 'err' ? (
                    <Chip label={t('upFailed')} tone="red" />
                  ) : s.s === 'up' ? (
                    <Chip label={`${n(Math.round(s.p * 100))}%`} />
                  ) : (
                    <Chip label={t('upWaiting')} tone="grey" />
                  )}
                </View>
              );
            })}
            {uploading ? <Txt size={13} color={colors.grey} style={styles.keep}>{t('keepOpen')}</Txt> : null}
            {!uploading && failed ? (
              <View style={styles.btns}>
                <Button label={t('retryFailed')} icon="refresh" onPress={() => void uploadAll(kinds().filter((k) => up[k]?.s === 'err'))} />
                <Button label={t('continueLater')} variant="secondary" onPress={finish} />
              </View>
            ) : null}
          </Card>
        ) : (
          <View style={styles.btns}>
            <Button label={step === 3 ? t('submitApp') : t('next')} busy={busy} onPress={next} />
            {step === 1 ? <Button label={t('haveAccount')} variant="ghost" onPress={() => router.replace('/login')} /> : null}
          </View>
        )}
      </ScrollView>
      {pickFor ? <PickSourceSheet title={t(DOC_LABEL[pickFor])} pdf={pickFor !== 'photo'} onClose={() => setPickFor(null)} onPick={(s) => void pick(pickFor, s)} /> : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  page: { padding: 14, gap: 12, paddingBottom: 40 },
  prog: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginVertical: 6 },
  stepWrap: { flexDirection: 'row', alignItems: 'flex-start' },
  step: { alignItems: 'center', gap: 4, width: 74 },
  line: { width: 30, height: 2, backgroundColor: colors.border, marginTop: 15 },
  lineOn: { backgroundColor: colors.primary },
  dot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e6e9f3', alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.primary },
  dotDone: { backgroundColor: colors.ok },
  sub: { marginBottom: 12 },
  up: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#c9d1ea', borderRadius: 14, padding: 10, marginBottom: 10 },
  upHas: { borderStyle: 'solid', borderColor: '#9ad8b1', backgroundColor: '#f6fcf8' },
  upErr: { borderColor: colors.danger, backgroundColor: '#fffafa' },
  thumb: { width: 54, height: 54, borderRadius: 10, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  thumbImg: { width: 54, height: 54 },
  flexRow: { flex: 1, minWidth: 0, gap: 2 },
  upRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  pb: { height: 6, borderRadius: 3, backgroundColor: '#e6e9f3', overflow: 'hidden', marginTop: 4 },
  pbFill: { height: 6, backgroundColor: colors.primary },
  keep: { textAlign: 'center', marginTop: 10 },
  btns: { gap: 10 },
});
