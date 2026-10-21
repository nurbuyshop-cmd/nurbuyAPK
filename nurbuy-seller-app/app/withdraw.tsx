import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ApiError } from '@/api/api';
import { requestWithdraw, type BankDetails, type BkashDetails } from '@/api/wallet';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { Select } from '@/components/Select';
import { TopBar } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Banner, Card, ErrorBox, KV, Spinner } from '@/components/ui';
import { StepHeader } from '@/components/WalletParts';
import type { StringKey } from '@/i18n/en';
import { errorText } from '@/lib/errors';
import { isMoney, money, normMobile, numText, validMobile } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { useDash } from '@/store/dash';
import { useLang } from '@/store/i18n';
import { toast } from '@/store/toast';
import { useWallet } from '@/store/wallet';
import { colors, radius } from '@/theme';

type Method = 'bkash' | 'bank';
const BKT: ['personal' | 'agent' | 'merchant', StringKey][] = [
  ['personal', 'btPersonal'],
  ['agent', 'btAgent'],
  ['merchant', 'btMerchant'],
];

/** Withdraw wizard: amount -> bKash or bank -> details -> confirm (website scrWithdraw()). */
export default function Withdraw() {
  const { t, n, f, lang } = useLang();
  const data = useWallet((s) => s.data);
  const error = useWallet((s) => s.error);
  const seller = useAuth((s) => s.seller);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<Method | null>(null);
  const [bk, setBk] = useState<BkashDetails>({ number: '', acc_type: 'personal', acc_name: '' });
  const [bn, setBn] = useState<BankDetails>({ holder: '', bank: '', branch: '', acc_no: '', routing: '', acc_type: 'savings', note: '' });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  // the last used payout details fill the form once the wallet has loaded
  const [filled, setFilled] = useState(false);
  if (data && !filled) {
    setFilled(true);
    const po = data.payout;
    if (po.last) setMethod(po.last);
    setBk({ number: seller?.mobile ?? '', acc_type: 'personal', acc_name: seller?.owner_name ?? '', ...po.bkash });
    setBn((b) => ({ ...b, holder: seller?.owner_name ?? '', ...po.bank }));
  }

  useEffect(() => {
    if (!useWallet.getState().data) void useWallet.getState().load();
  }, []);

  const back = useCallback(() => {
    if (step > 1) setStep(step - 1);
    else if (router.canGoBack()) router.back();
    else router.replace('/wallet');
    return true;
  }, [step]);
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', back);
      return () => sub.remove();
    }, [back]),
  );

  const clearErr = (k: string) => {
    if (err[k]) setErr((s) => ({ ...s, [k]: '' }));
  };

  if (!data) {
    return (
      <View style={styles.flex}>
        <TopBar title={t('withdrawMoney')} back backTo="/wallet" />
        {error ? <ErrorBox error={error} onRetry={() => void useWallet.getState().load()} /> : <Spinner />}
      </View>
    );
  }
  const s = data.summary;

  const next1 = () => {
    const a = numText(amount);
    const v = isMoney(a) ? Number(a) : NaN;
    if (Number.isNaN(v) || v <= 0) return setErr({ amount: t('fAmount') });
    if (v < s.min) return setErr({ amount: f('fAmountMin', { a: money(s.min, lang) }) });
    if (v > s.available) return setErr({ amount: f('fAmountMax', { a: money(s.available, lang) }) });
    setAmount(String(v));
    setErr({});
    setStep(2);
  };

  const next3 = () => {
    const e: Record<string, string> = {};
    if (method === 'bkash') {
      const num = normMobile(numText(bk.number));
      setBk((b) => ({ ...b, number: num, acc_name: b.acc_name.trim() }));
      if (!validMobile(num)) e.number = t('fWdNumber');
    } else {
      const k = { ...bn, holder: bn.holder.trim(), bank: bn.bank.trim(), branch: bn.branch.trim(), acc_no: numText(bn.acc_no).replace(/-/g, ''), routing: numText(bn.routing), note: bn.note.trim() };
      setBn(k);
      if (k.holder.length < 2) e.holder = t('fHolder');
      else if (k.bank.length < 2) e.bank = t('fBank');
      else if (k.branch.length < 2) e.branch = t('fBranch');
      else if (!/^[0-9A-Za-z]{6,30}$/.test(k.acc_no)) e.acc_no = t('fAccNo');
      else if (k.routing && !/^\d{5,12}$/.test(k.routing)) e.routing = t('fRouting');
    }
    setErr(e);
    if (!Object.keys(e).length) setStep(4);
  };

  const submit = async () => {
    if (!method) return;
    setBusy(true);
    try {
      const w = await requestWithdraw(Number(amount), method, method === 'bkash' ? bk : bn);
      toast(t('wdSent'), 'ok', 4500);
      void useWallet.getState().load();
      void useDash.getState().load().catch(() => {});
      router.replace({ pathname: '/wd/[id]', params: { id: String(w.id) } });
    } catch (e) {
      setBusy(false);
      if (e instanceof ApiError && (e.field === 'amount' || e.code === 'insufficient_balance' || e.code === 'below_min')) {
        void useWallet.getState().load();
        setStep(1);
        setErr({ amount: e.code === 'below_min' ? t('errBelowMin') : e.code === 'insufficient_balance' ? t('errInsufficient') : e.error || t('fAmount') });
        return;
      }
      if (e instanceof ApiError && e.field && ['number', 'holder', 'bank', 'branch', 'acc_no', 'routing'].includes(e.field)) {
        setStep(3);
        setErr({ [e.field]: e.error });
        return;
      }
      toast(errorText(e, t), 'bad');
    }
  };

  const after = Math.round((s.available - Number(amount || 0)) * 100) / 100;
  const quick = [0.25, 0.5, 1].map((x) => (x === 1 ? s.available : Math.floor(s.available * x))).filter((a, i, arr) => a >= s.min && arr.indexOf(a) === i);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopBar title={t('withdrawMoney')} back backTo="/wallet" />
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <StepHeader names={[t('stepAmount'), t('stepMethod'), t('stepDetails'), t('stepConfirm')]} step={step} />

        {step === 1 ? (
          <Card>
            <View style={styles.avail}>
              <Txt size={13.5} color={colors.grey}>{t('availToWd')}</Txt>
              <Txt weight="bold" size={22}>{money(s.available, lang)}</Txt>
            </View>
            <Field
              label={t('howMuch')}
              required
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={(x) => {
                setAmount(x);
                clearErr('amount');
              }}
              placeholder={n(s.min)}
              hint={f('minMax', { a: money(s.min, lang), b: money(s.available, lang) })}
              error={err.amount}
            />
            <View style={styles.quick}>
              {quick.map((a) => (
                <Pressable
                  key={a}
                  onPress={() => {
                    setAmount(String(a));
                    clearErr('amount');
                  }}
                  style={styles.qbtn}
                  accessibilityRole="button"
                >
                  <Txt weight="semibold" size={13.5} color={colors.primary}>{`${a === s.available ? `${t('all')} ` : ''}${money(a, lang)}`}</Txt>
                </Pressable>
              ))}
            </View>
            <Button label={t('next')} onPress={next1} style={styles.mt} />
          </Card>
        ) : null}

        {step === 2 ? (
          <Card title={t('howReceive')}>
            <View style={styles.methods}>
              {(['bkash', 'bank'] as Method[]).map((m) => {
                const on = method === m;
                return (
                  <Pressable
                    key={m}
                    onPress={() => {
                      setMethod(m);
                      clearErr('method');
                    }}
                    style={[styles.mth, on && styles.mthOn]}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: on }}
                  >
                    <Icon name={m === 'bkash' ? 'wallet' : 'receipt'} size={28} color={on ? colors.primary : colors.grey} />
                    <Txt weight="bold" size={15}>{m === 'bkash' ? t('bkash') : t('bankAcc')}</Txt>
                    <Txt size={12} color={colors.grey}>{m === 'bkash' ? t('mobileWallet') : t('bankTransfer')}</Txt>
                  </Pressable>
                );
              })}
            </View>
            {err.method ? <Txt size={13} color={colors.danger} style={styles.mt}>{err.method}</Txt> : null}
            <View style={styles.row2}>
              <Button label={t('back')} variant="ghost" icon="back" onPress={back} style={styles.grow} />
              <Button label={t('next')} onPress={() => (method ? setStep(3) : setErr({ method: t('chooseMethod') }))} style={styles.grow} />
            </View>
          </Card>
        ) : null}

        {step === 3 && method === 'bkash' ? (
          <Card title={t('bkashDetails')}>
            <Field label={t('bkashNumber')} required keyboardType="phone-pad" maxLength={14} placeholder="01XXXXXXXXX" value={bk.number} onChangeText={(x) => { setBk({ ...bk, number: x }); clearErr('number'); }} error={err.number} />
            <Txt weight="semibold" size={13.5} color="#333" style={styles.lab}>
              {t('accType')}
              <Txt color={colors.danger}> *</Txt>
            </Txt>
            <View style={styles.radios}>
              {BKT.map(([k, label]) => (
                <Pressable key={k} onPress={() => setBk({ ...bk, acc_type: k })} style={[styles.rad, bk.acc_type === k && styles.radOn]} accessibilityRole="radio" accessibilityState={{ checked: bk.acc_type === k }}>
                  <Txt weight="semibold" size={14} color={bk.acc_type === k ? colors.primary : colors.text}>{t(label)}</Txt>
                </Pressable>
              ))}
            </View>
            <Field label={t('accNameOpt')} maxLength={100} autoCapitalize="words" value={bk.acc_name} onChangeText={(x) => setBk({ ...bk, acc_name: x })} />
            <View style={styles.row2}>
              <Button label={t('back')} variant="ghost" icon="back" onPress={back} style={styles.grow} />
              <Button label={t('next')} onPress={next3} style={styles.grow} />
            </View>
          </Card>
        ) : null}

        {step === 3 && method === 'bank' ? (
          <Card title={t('bankDetails')}>
            <Field label={t('accHolder')} required maxLength={100} autoCapitalize="words" value={bn.holder} onChangeText={(x) => { setBn({ ...bn, holder: x }); clearErr('holder'); }} error={err.holder} />
            <Field label={t('bankName')} required maxLength={100} autoCapitalize="words" placeholder={t('bankPh')} value={bn.bank} onChangeText={(x) => { setBn({ ...bn, bank: x }); clearErr('bank'); }} error={err.bank} />
            <Field label={t('branchName')} required maxLength={100} autoCapitalize="words" value={bn.branch} onChangeText={(x) => { setBn({ ...bn, branch: x }); clearErr('branch'); }} error={err.branch} />
            <Field label={t('accNumber')} required maxLength={34} keyboardType="number-pad" value={bn.acc_no} onChangeText={(x) => { setBn({ ...bn, acc_no: x }); clearErr('acc_no'); }} error={err.acc_no} />
            <Field label={t('routingOpt')} maxLength={12} keyboardType="number-pad" value={bn.routing} onChangeText={(x) => { setBn({ ...bn, routing: x }); clearErr('routing'); }} error={err.routing} />
            <Select
              label={t('accType')}
              value={bn.acc_type}
              options={[
                { value: 'savings', label: t('savings') },
                { value: 'current', label: t('current') },
                { value: '', label: t('other') },
              ]}
              onChange={(x) => setBn({ ...bn, acc_type: x })}
            />
            <Field label={t('otherInfo')} rows={2} maxLength={200} placeholder={t('otherInfoPh')} value={bn.note} onChangeText={(x) => setBn({ ...bn, note: x })} />
            <View style={styles.row2}>
              <Button label={t('back')} variant="ghost" icon="back" onPress={back} style={styles.grow} />
              <Button label={t('next')} onPress={next3} style={styles.grow} />
            </View>
          </Card>
        ) : null}

        {step === 4 && method ? (
          <Card title={t('checkConfirm')}>
            <View style={styles.avail}>
              <Txt size={13.5} color={colors.grey}>{t('wdAmount')}</Txt>
              <Txt weight="bold" size={24}>{money(Number(amount), lang)}</Txt>
            </View>
            <KV k={t('method')} v={method === 'bkash' ? t('bkash') : t('bankAcc')} />
            {method === 'bkash' ? (
              <>
                <KV k={t('bkashNumber')} v={n(bk.number)} />
                <KV k={t('accType')} v={t(BKT.find(([k]) => k === bk.acc_type)?.[1] ?? 'btPersonal')} />
                {bk.acc_name ? <KV k={t('name')} v={bk.acc_name} /> : null}
              </>
            ) : (
              <>
                <KV k={t('accHolderShort')} v={bn.holder} />
                <KV k={t('bank')} v={bn.bank} />
                <KV k={t('branch')} v={bn.branch} />
                <KV k={t('accNumber')} v={n(bn.acc_no)} />
                {bn.routing ? <KV k={t('routing')} v={n(bn.routing)} /> : null}
                {bn.note ? <KV k={t('other')} v={bn.note} /> : null}
              </>
            )}
            <KV k={t('balAfter')} v={money(after, lang)} />
            <View style={styles.mt}>
              <Banner>{t('wdHoldNote')}</Banner>
            </View>
            <View style={styles.btns}>
              <Button label={t('confirmWd')} icon="check" variant="ok" busy={busy} onPress={() => void submit()} />
              <Button label={t('back')} variant="ghost" icon="back" onPress={back} />
            </View>
          </Card>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  page: { padding: 14, gap: 12, paddingBottom: 40 },
  avail: { backgroundColor: '#f4f6fc', borderRadius: radius.md, padding: 12, marginBottom: 12, gap: 2 },
  quick: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  qbtn: { minHeight: 40, paddingHorizontal: 12, borderRadius: 20, backgroundColor: colors.infoBg, justifyContent: 'center' },
  mt: { marginTop: 12 },
  methods: { flexDirection: 'row', gap: 10 },
  mth: { flex: 1, alignItems: 'center', gap: 4, padding: 16, borderRadius: 14, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.white },
  mthOn: { borderColor: colors.primary, backgroundColor: '#f3f5ff' },
  row2: { flexDirection: 'row', gap: 10, marginTop: 14 },
  grow: { flex: 1 },
  lab: { marginBottom: 6 },
  radios: { flexDirection: 'row', gap: 8, marginBottom: 13 },
  rad: { flex: 1, minHeight: 46, borderRadius: 12, borderWidth: 1.5, borderColor: '#dfe3f1', alignItems: 'center', justifyContent: 'center' },
  radOn: { borderColor: colors.primary, backgroundColor: '#f3f5ff' },
  btns: { gap: 10, marginTop: 14 },
});
