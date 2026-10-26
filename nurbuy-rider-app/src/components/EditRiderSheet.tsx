import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { updateMe, type Vehicle } from '@/api/rider';
import type { StringKey } from '@/i18n/en';
import { errorField, errorText, fieldText } from '@/lib/errors';
import { normMobile, validEmail, validMobile, validNid } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { useT } from '@/store/i18n';
import { toast } from '@/store/toast';

import { Button } from './Button';
import { Field } from './Field';
import { Sheet } from './Sheet';
import { Txt } from './Txt';
import { Banner } from './ui';
import { VehiclePicker } from './VehiclePicker';

type Key = 'name' | 'mobile' | 'email' | 'address' | 'nid' | 'vehicle_no' | 'license_no' | 'emerg_name' | 'emerg_mobile';

function norm(k: string, x: string): string {
  const v = x.trim();
  if (k === 'mobile' || k === 'emerg_mobile') return normMobile(v);
  if (k === 'nid') return v.replace(/\s+/g, '');
  if (k === 'email') return v.toLowerCase();
  return v;
}

/**
 * Edit application (before approval: everything) or profile (after approval: name and NID are fixed; address and
 * emergency contact change at once; mobile, email and vehicle wait for admin approval). Website openEdit().
 * Only the changed fields are sent, like the website.
 */
export function EditRiderSheet({ onClose }: { onClose: () => void }) {
  const t = useT();
  const rider = useAuth((s) => s.rider);
  const setRider = useAuth((s) => s.setRider);
  const appr = rider?.status === 'approved';
  const [v, setV] = useState<Record<Key, string>>(() => ({
    name: rider?.name ?? '',
    mobile: rider?.mobile ?? '',
    email: rider?.email ?? '',
    address: rider?.address ?? '',
    nid: rider?.nid ?? '',
    vehicle_no: rider?.vehicle_no ?? '',
    license_no: rider?.license_no ?? '',
    emerg_name: rider?.emerg_name ?? '',
    emerg_mobile: rider?.emerg_mobile ?? '',
  }));
  const [vt, setVt] = useState<Vehicle | ''>(rider?.vehicle_type ?? '');
  const [err, setErr] = useState<Partial<Record<Key | 'vehicle_type', string>>>({});
  const [busy, setBusy] = useState(false);
  if (!rider) return null;
  const cyc = vt === 'cycle';

  const set = (k: Key) => (x: string) => {
    setV((s) => ({ ...s, [k]: x }));
    if (err[k]) setErr((s) => ({ ...s, [k]: undefined }));
  };

  const save = async () => {
    const e: Partial<Record<Key | 'vehicle_type', string>> = {};
    const need = (k: Key | 'vehicle_type', ok: boolean, msg: StringKey) => {
      if (!ok) e[k] = t(msg);
    };
    if (!appr) {
      need('name', v.name.trim().length >= 2, 'fName');
      need('nid', validNid(v.nid), 'fNid');
    }
    need('address', !!v.address.trim(), 'fAddress');
    need('emerg_name', !!v.emerg_name.trim(), 'fEmergName');
    need('emerg_mobile', validMobile(v.emerg_mobile), 'fEmergMobile');
    need('mobile', validMobile(v.mobile), 'fMobile');
    need('email', !v.email.trim() || validEmail(v.email.trim()), 'fEmail');
    need('vehicle_type', !!vt, 'fVehicleType');
    if (!cyc) {
      need('vehicle_no', !!v.vehicle_no.trim(), 'fVehicleNo');
      need('license_no', !!v.license_no.trim(), 'fLicenseNo');
    }
    setErr(e);
    if (Object.keys(e).length) return;

    const cur: Record<string, string> = {
      name: rider.name, mobile: rider.mobile, email: rider.email, address: rider.address, nid: rider.nid,
      emerg_name: rider.emerg_name, emerg_mobile: rider.emerg_mobile,
    };
    const keys: Key[] = ['address', 'emerg_name', 'emerg_mobile', 'mobile', 'email', ...(appr ? [] : (['name', 'nid'] as Key[]))];
    const body: Record<string, string> = {};
    for (const k of keys) {
      const nv = norm(k, v[k]);
      if (nv !== norm(k, cur[k] ?? '')) body[k] = nv;
    }
    const vno = cyc ? '' : v.vehicle_no.trim();
    const lno = cyc ? '' : v.license_no.trim();
    if (vt !== rider.vehicle_type || vno !== rider.vehicle_no.trim() || lno !== rider.license_no.trim()) {
      body.vehicle_type = vt;
      body.vehicle_no = vno;
      body.license_no = lno;
    }
    if (!Object.keys(body).length) {
      toast(t('nothingChanged'));
      onClose();
      return;
    }
    setBusy(true);
    try {
      const r = await updateMe(body);
      setRider(r);
      const sens = appr && ['mobile', 'email', 'vehicle_type', 'vehicle_no', 'license_no'].some((k) => k in body);
      toast(sens && r.chg ? t('savedSensitive') : t('saved'), 'ok', 4500);
      onClose();
    } catch (x) {
      setBusy(false);
      const f = errorField(x);
      if (f && (f in v || f === 'vehicle_type')) setErr({ [f]: fieldText(x, t) });
      else toast(errorText(x, t), 'bad');
    }
  };

  const groupA = (
    <>
      <Field label={t('address')} value={v.address} onChangeText={set('address')} rows={3} maxLength={500} error={err.address} />
      <Field label={t('emergNameLong')} value={v.emerg_name} onChangeText={set('emerg_name')} autoCapitalize="words" maxLength={100} error={err.emerg_name} />
      <Field label={t('emergMobileLong')} value={v.emerg_mobile} onChangeText={set('emerg_mobile')} keyboardType="phone-pad" maxLength={16} error={err.emerg_mobile} />
    </>
  );
  const groupB = (
    <>
      <Field label={t('mobile')} value={v.mobile} onChangeText={set('mobile')} keyboardType="phone-pad" maxLength={16} error={err.mobile} />
      <Field label={t('email')} value={v.email} onChangeText={set('email')} keyboardType="email-address" maxLength={190} error={err.email} />
      <View>
        <Txt weight="semibold" size={13.5} color="#333" style={styles.label}>{t('vehicleType')}</Txt>
        <VehiclePicker
          value={vt}
          onChange={(x) => {
            setVt(x);
            setErr((s) => ({ ...s, vehicle_type: undefined, vehicle_no: undefined, license_no: undefined }));
          }}
          error={err.vehicle_type}
        />
      </View>
      {!cyc ? (
        <>
          <Field label={t('vehicleNo')} value={v.vehicle_no} onChangeText={set('vehicle_no')} autoCapitalize="characters" maxLength={40} error={err.vehicle_no} />
          <Field label={t('licenseNo')} value={v.license_no} onChangeText={set('license_no')} autoCapitalize="characters" maxLength={60} error={err.license_no} />
        </>
      ) : null}
    </>
  );

  return (
    <Sheet title={appr ? t('editProfile') : t('editApp')} onClose={onClose}>
      {appr ? (
        <>
          {groupA}
          <Banner tone="warn">{t('needsApproval')}</Banner>
          <View style={styles.gap} />
          {groupB}
        </>
      ) : (
        <>
          <Field label={t('fullName')} value={v.name} onChangeText={set('name')} autoCapitalize="words" maxLength={100} error={err.name} />
          {groupB}
          {groupA}
          <Field label={t('nidNumber')} value={v.nid} onChangeText={set('nid')} keyboardType="number-pad" maxLength={30} error={err.nid} />
        </>
      )}
      <Button label={t('save')} busy={busy} onPress={() => void save()} />
      <Button label={t('cancel')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6 },
  gap: { height: 12 },
});
