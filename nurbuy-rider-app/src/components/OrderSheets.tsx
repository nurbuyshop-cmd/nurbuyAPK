import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ApiError } from '@/api/api';
import {
  askDelay,
  DELAY_REASONS,
  deliverOrder,
  FAIL_REASONS,
  failOrder,
  rejectOrder,
  REPORT_REASONS,
  reportCustomer,
  uploadEvidence,
  type DelayReason,
  type FailReason,
  type LocalFile,
  type ReportReason,
  type RiderOrder,
} from '@/api/rider';
import type { StringKey } from '@/i18n/en';
import { errorText, fieldText } from '@/lib/errors';
import { pickPhotos } from '@/lib/files';
import { money } from '@/lib/format';
import { DELAY_LABEL, FAIL_LABEL, REPORT_LABEL } from '@/lib/labels';
import { useLang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors } from '@/theme';

import { Button } from './Button';
import { uploadErrorText } from './DocRows';
import { Field } from './Field';
import { Icon } from './Icon';
import { Select } from './Select';
import { Sheet } from './Sheet';
import { Txt, useInputFont } from './Txt';
import { Banner } from './ui';

/** The order changed on the server meanwhile (or was taken away): the page shows the latest state. */
export const isStale = (e: unknown) => e instanceof ApiError && (e.code === 'bad_state' || e.status === 404);

type Common = { o: RiderOrder; onClose: () => void; onDone: () => void; onStale: (e: unknown) => void };

/** Round radio rows (website .rad). */
function Radios<K extends string>({ keys, labels, value, onChange, error }: { keys: readonly K[]; labels: Record<K, StringKey>; value: K | null; onChange: (k: K) => void; error?: string }) {
  const { t } = useLang();
  return (
    <View style={styles.rads}>
      {keys.map((k) => {
        const on = value === k;
        return (
          <Pressable key={k} onPress={() => onChange(k)} style={[styles.rad, on && styles.radOn]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
            <View style={[styles.dot, on && styles.dotOn]}>{on ? <View style={styles.dotIn} /> : null}</View>
            <Txt size={15} weight={on ? 'semibold' : 'regular'} style={styles.flex}>{t(labels[k])}</Txt>
          </Pressable>
        );
      })}
      {error ? <Txt size={13} color={colors.danger} accessibilityRole="alert">{error}</Txt> : null}
    </View>
  );
}

/** "Reject this order?" (website rejask). */
export function RejectSheet({ o, onClose, onDone, onStale }: Common) {
  const { t } = useLang();
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try {
      await rejectOrder(o.id);
      toast(t('orderRejected'));
      onDone();
    } catch (e) {
      setBusy(false);
      if (isStale(e)) onStale(e);
      else toast(errorText(e, t), 'bad');
    }
  };
  return (
    <Sheet title={t('rejectAsk')} sub={t('rejectAskSub')} onClose={onClose}>
      <Button label={t('yesReject')} variant="dangerSolid" busy={busy} onPress={() => void go()} />
      <Button label={t('keepIt')} variant="secondary" onPress={onClose} />
    </Sheet>
  );
}

/** Four boxes for the customer's delivery code (website FORM.otp). */
export function DeliverSheet({ o, onClose, onDone, onStale }: Common) {
  const { t, n, lang } = useLang();
  const font = useInputFont();
  const input = useRef<TextInput>(null);
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const go = async () => {
    if (code.length !== 4 || busy) return;
    setBusy(true);
    try {
      await deliverOrder(o.id, code);
      onDone();
    } catch (e) {
      setBusy(false);
      if (e instanceof ApiError && e.code === 'bad_otp') {
        setCode('');
        setErr(errorText(e, t));
        input.current?.focus();
      } else if (isStale(e)) onStale(e);
      else setErr(errorText(e, t));
    }
  };

  return (
    <Sheet title={t('completeDelivery')} sub={t('askCode')} onClose={onClose}>
      {o.pay === 'cod' ? (
        <Banner tone="warn">
          <Txt size={14}>
            {`${t('collectCash1')} `}
            <Txt weight="bold" size={14}>{money(o.collect, lang)}</Txt>
            {` ${t('collectCash2')}`}
          </Txt>
        </Banner>
      ) : null}
      <Pressable onPress={() => input.current?.focus()} style={styles.otp} accessibilityLabel={t('fOtp')}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.bx, (i === code.length || (code.length === 4 && i === 3)) && styles.bxCur, !!err && styles.bxBad]}>
            <Txt weight="bold" size={26}>{code[i] ? n(code[i]) : ''}</Txt>
          </View>
        ))}
        <TextInput
          ref={input}
          value={code}
          onChangeText={(v) => {
            setCode(v.replace(/\D/g, '').slice(0, 4));
            setErr('');
          }}
          keyboardType="number-pad"
          maxLength={4}
          autoFocus
          autoComplete="one-time-code"
          caretHidden
          style={[styles.otpInput, { fontFamily: font }]}
          onSubmitEditing={() => void go()}
        />
      </Pressable>
      {err ? <Txt size={13.5} color={colors.danger} style={styles.center} accessibilityRole="alert">{err}</Txt> : null}
      <Button label={t('confirmDelivery')} icon="check" variant="ok" busy={busy} disabled={code.length !== 4} onPress={() => void go()} />
      <Button label={t('cancel')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

/** "Delivery failed / Cancel" with a reason (website FORM.fail). */
export function FailSheet({ o, onClose, onDone, onStale }: Common) {
  const { t } = useLang();
  const [reason, setReason] = useState<FailReason | null>(null);
  const [note, setNote] = useState('');
  const [err, setErr] = useState<{ reason?: string; note?: string }>({});
  const [busy, setBusy] = useState(false);
  const go = async () => {
    if (!reason) return setErr({ reason: t('fReason') });
    if (reason === 'other' && !note.trim()) return setErr({ note: t('fNote') });
    setBusy(true);
    try {
      await failOrder(o.id, reason, note.trim());
      toast(t('markedFailed'));
      onDone();
    } catch (e) {
      setBusy(false);
      const f = e instanceof ApiError ? e.field : undefined;
      if (f === 'reason' || f === 'note') setErr({ [f]: fieldText(e, t) });
      else if (isStale(e)) onStale(e);
      else toast(errorText(e, t), 'bad');
    }
  };
  return (
    <Sheet title={t('failCancel')} sub={t('failSub')} onClose={onClose}>
      <Radios keys={FAIL_REASONS} labels={FAIL_LABEL} value={reason} onChange={(k) => { setReason(k); setErr({}); }} error={err.reason} />
      <Field label={t('failNote')} value={note} onChangeText={(v) => { setNote(v); setErr({}); }} rows={2} maxLength={120} error={err.note} />
      <Button label={t('markFailed')} variant="dangerSolid" busy={busy} onPress={() => void go()} />
      <Button label={t('back')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

/** "Running late?": 1-5 extra minutes with a reason; the customer gets a message (website FORM.delay). */
export function DelaySheet({ o, onClose, onDone, onStale }: Common) {
  const { t, n } = useLang();
  const [mins, setMins] = useState(5);
  const [reason, setReason] = useState<DelayReason>('traffic');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const go = async () => {
    if (reason === 'other' && !note.trim()) return setErr(t('fNote'));
    setBusy(true);
    try {
      await askDelay(o.id, reason, note.trim(), mins);
      toast(t('delaySent'), 'ok', 4000);
      onDone();
    } catch (e) {
      setBusy(false);
      if (isStale(e)) onStale(e);
      else toast(e instanceof ApiError && e.code === 'delay_limit' && e.error ? e.error : errorText(e, t), 'bad', 5000);
    }
  };
  return (
    <Sheet title={t('askMoreTime')} sub={t('askMoreTimeSub')} onClose={onClose}>
      <Select
        label={t('extraMinutes')}
        value={mins}
        options={[1, 2, 3, 4, 5].map((x) => ({ value: x, label: `${n(x)} ${t('min')}` }))}
        onChange={setMins}
      />
      <Txt weight="semibold" size={13.5} color="#333">{`${t('reason')} *`}</Txt>
      <Radios keys={DELAY_REASONS} labels={DELAY_LABEL} value={reason} onChange={(k) => { setReason(k); setErr(''); }} />
      <Field label={t('delayNote')} value={note} onChangeText={(v) => { setNote(v); setErr(''); }} maxLength={160} error={err} />
      <Button label={t('sendToCustomer')} icon="clock" busy={busy} onPress={() => void go()} />
      <Button label={t('cancel')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

/** Report a customer to the NurBuy team with up to 3 proof photos (website FORM.report). */
export function ReportSheet({ o, onClose, onStale }: Omit<Common, 'onDone'>) {
  const { t } = useLang();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState('');
  const [photos, setPhotos] = useState<LocalFile[]>([]);
  const [err, setErr] = useState<{ reason?: string; note?: string; evidence?: string }>({});
  const [busy, setBusy] = useState(false);

  const add = async (src: 'camera' | 'gallery') => {
    try {
      const more = await pickPhotos(src, 3 - photos.length);
      if (more.length) setPhotos((p) => [...p, ...more].slice(0, 3));
      setErr((s) => ({ ...s, evidence: undefined }));
    } catch (e) {
      setErr((s) => ({ ...s, evidence: uploadErrorText(e, t) }));
    }
  };

  const go = async () => {
    if (!reason) return setErr({ reason: t('fReason') });
    if (reason === 'other' && note.trim().length < 5) return setErr({ note: t('describeWhat') });
    setBusy(true);
    try {
      const names: string[] = [];
      for (const p of photos) names.push(await uploadEvidence(p));
      await reportCustomer(o.id, reason, note.trim(), names);
      toast(t('reportSent'), 'ok');
      onClose();
    } catch (e) {
      setBusy(false);
      if (e instanceof ApiError && e.code === 'duplicate') {
        toast(t('alreadyReported'));
        onClose();
        return;
      }
      const f = e instanceof ApiError ? e.field : undefined;
      if (f === 'reason' || f === 'note') setErr({ [f]: fieldText(e, t) });
      else if (f === 'evidence' || (e instanceof ApiError && (e.status === 413 || e.status === 415))) setErr({ evidence: uploadErrorText(e, t) });
      else if (isStale(e)) onStale(e);
      else toast(errorText(e, t), 'bad');
    }
  };

  return (
    <Sheet title={t('reportCustomer')} sub={t('reportSub')} onClose={onClose}>
      <Radios keys={REPORT_REASONS} labels={REPORT_LABEL} value={reason} onChange={(k) => { setReason(k); setErr({}); }} error={err.reason} />
      <Field label={t('whatHappened')} value={note} onChangeText={(v) => { setNote(v); setErr({}); }} rows={3} maxLength={500} error={err.note} />
      <Txt weight="semibold" size={13.5} color="#333">{t('proofPhotos')}</Txt>
      {photos.length ? (
        <View style={styles.photos}>
          {photos.map((p, i) => (
            <View key={p.uri} style={styles.photo}>
              <Image source={{ uri: p.uri }} style={styles.photoImg} contentFit="cover" />
              <Pressable onPress={() => setPhotos((s) => s.filter((_, k) => k !== i))} style={styles.rm} accessibilityRole="button" accessibilityLabel={t('remove')}>
                <Icon name="x" size={14} color={colors.white} strokeWidth={3} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
      {photos.length < 3 ? (
        <View style={styles.row}>
          <Button small variant="secondary" icon="camera" label={t('takePhoto')} onPress={() => void add('camera')} style={styles.flex} />
          <Button small variant="secondary" icon="img" label={t('chooseGallery')} onPress={() => void add('gallery')} style={styles.flex} />
        </View>
      ) : null}
      {err.evidence ? <Txt size={13} color={colors.danger}>{err.evidence}</Txt> : null}
      <Button label={t('sendReport')} variant="dangerSolid" busy={busy} onPress={() => void go()} />
      <Button label={t('back')} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  row: { flexDirection: 'row', gap: 8 },
  center: { textAlign: 'center' },
  rads: { gap: 8 },
  rad: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 50, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#dfe3f1', backgroundColor: '#fafbff' },
  radOn: { borderColor: colors.primary, backgroundColor: colors.infoBg },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#b9c1da', alignItems: 'center', justifyContent: 'center' },
  dotOn: { borderColor: colors.primary },
  dotIn: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.primary },
  otp: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: 8 },
  bx: { width: 58, height: 66, borderRadius: 14, borderWidth: 2, borderColor: '#dfe3f1', backgroundColor: '#fafbff', alignItems: 'center', justifyContent: 'center' },
  bxCur: { borderColor: colors.primary, backgroundColor: colors.white },
  bxBad: { borderColor: colors.danger, backgroundColor: '#fffafa' },
  otpInput: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0.01, color: 'transparent' },
  photos: { flexDirection: 'row', gap: 8 },
  photo: { width: 84, height: 84, borderRadius: 12, overflow: 'hidden', backgroundColor: '#eef1f8' },
  photoImg: { width: 84, height: 84 },
  rm: { position: 'absolute', top: 4, right: 4, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
});
