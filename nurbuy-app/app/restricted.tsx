import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appealStatus, sendAppeal } from '@/api/access';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Txt, useInputFont } from '@/components/Txt';
import { errorText } from '@/lib/errors';
import { useAuth } from '@/store/auth';
import { useBlock } from '@/store/block';
import { useConsent } from '@/store/consent';
import { useI18n, useT } from '@/store/i18n';
import { colors, TOUCH } from '@/theme';

type Panel = 'none' | 'appeal' | 'status';

/** Shown when the server restricted this customer or connection. Browsing stays possible; ordering is refused by the server. */
export default function RestrictedScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const font = useInputFont();
  const block = useBlock((s) => s.block);
  const info = useConsent((s) => s.info);
  const user = useAuth((s) => s.user);

  const [panel, setPanel] = useState<Panel>('none');
  const [name, setName] = useState(user?.name ?? '');
  const [mobile, setMobile] = useState(user?.mobile ?? '');
  const [why, setWhy] = useState('');
  const [ref, setRef] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [sentRef, setSentRef] = useState('');
  const [status, setStatus] = useState<{ label: string; reply: string } | null>(null);

  // the block payload carries the same care details as /access/info; fall back to the cached copy
  const b = {
    title: block?.title || info?.title || t('blkTitle'),
    message: (lang === 'bn' && (block?.message_bn || info?.message_bn)) || block?.message || info?.message || '',
    phone: (block?.phone || info?.phone || '').trim(),
    hours: block?.hours || info?.hours || '',
    appeal: (block?.appeal ?? info?.appeal ?? 0) === 1,
    note: block?.appeal_note || info?.appeal_note || '',
    ref: block?.ref ?? null,
    expires: block?.expires ?? null,
  };
  const tel = 'tel:' + b.phone.replace(/[^\d+]/g, '');
  const ends = b.expires ? formatDate(b.expires, lang) : '';

  const close = () => {
    useBlock.getState().setBlock(null);
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const send = async () => {
    setErr('');
    setBusy(true);
    try {
      setSentRef(await sendAppeal({ name: name.trim(), mobile: mobile.trim(), message: why.trim() }));
    } catch (e) {
      setErr(errorText(e, t));
    } finally {
      setBusy(false);
    }
  };

  const check = async () => {
    setErr('');
    setStatus(null);
    setBusy(true);
    try {
      const r = await appealStatus(ref.trim(), mobile.trim());
      const label = r.status === 'open' ? t('blkOpen') : r.status === 'approved' ? t('blkApproved') : t('blkRejected');
      setStatus({ label, reply: r.reply });
    } catch (e) {
      setErr(errorText(e, t));
    } finally {
      setBusy(false);
    }
  };

  const input = [styles.input, { fontFamily: font }];

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.page} contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.card} accessibilityViewIsModal>
          <View style={styles.icon}>
            <Icon name="shield" size={32} color={colors.danger} />
          </View>
          <Txt weight="bold" size={22} color="#111" style={styles.center}>{b.title}</Txt>
          {b.message ? <Txt size={15} color="#444" style={[styles.center, styles.msg]}>{b.message}</Txt> : null}
          {ends ? <Txt size={13} color="#666" style={styles.center}>{t('blkEnds') + ends}</Txt> : null}
          {b.ref ? <Txt size={13} color="#666" style={styles.center}>{t('blkRef')}: <Txt weight="bold" size={13} color="#111">{b.ref}</Txt></Txt> : null}

          <View style={styles.care}>
            <Txt weight="semibold" size={12.5} color="#666" style={styles.center}>{t('blkCare')}</Txt>
            {b.phone ? (
              <>
                <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(tel)}>
                  <Txt weight="bold" size={24} color="#111" style={styles.center}>{b.phone}</Txt>
                </Pressable>
                {b.hours ? <Txt size={13} color="#666" style={styles.center}>{b.hours}</Txt> : null}
              </>
            ) : (
              <Txt size={13} color="#666" style={styles.center}>{t('blkCareNone')}</Txt>
            )}
          </View>

          {b.phone ? <Button label={t('blkCall')} onPress={() => void Linking.openURL(tel)} style={styles.dark} /> : null}

          {b.appeal && panel === 'none' ? (
            <Button label={t('blkAppeal')} variant="outline" onPress={() => setPanel('appeal')} style={styles.gap} />
          ) : null}

          {b.appeal && panel === 'appeal' ? (
            sentRef ? (
              <View style={styles.ok}>
                <Txt size={13.5} color={colors.okText}>
                  {t('blkSent')}
                  <Txt weight="bold" size={13.5} color={colors.okText}>{sentRef}</Txt>
                  {'\n' + t('blkSentNote')}
                </Txt>
              </View>
            ) : (
              <View style={styles.form}>
                {b.note ? <Txt size={13} color="#555" style={styles.note}>{b.note}</Txt> : null}
                <TextInput style={input} placeholder={t('blkYourName')} placeholderTextColor="#9aa1b8" value={name} onChangeText={setName} autoComplete="name" />
                <TextInput style={input} placeholder={t('blkMobile')} placeholderTextColor="#9aa1b8" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" autoComplete="tel" />
                <TextInput style={[input, styles.area]} placeholder={t('blkWhy')} placeholderTextColor="#9aa1b8" value={why} onChangeText={setWhy} multiline maxLength={1000} textAlignVertical="top" />
                <Txt size={13} color={colors.danger} accessibilityLiveRegion="polite">{err}</Txt>
                <Button label={t('blkSend')} onPress={send} busy={busy} style={styles.dark} />
                <Pressable accessibilityRole="button" onPress={() => { setErr(''); setPanel('status'); }} style={styles.link}>
                  <Txt size={13.5} color="#555" style={styles.underline}>{t('blkStatusLink')}</Txt>
                </Pressable>
              </View>
            )
          ) : null}

          {b.appeal && panel === 'status' ? (
            <View style={styles.form}>
              <TextInput style={input} placeholder={t('blkRefPh')} placeholderTextColor="#9aa1b8" value={ref} onChangeText={setRef} autoCapitalize="characters" />
              <TextInput style={input} placeholder={t('authMobile')} placeholderTextColor="#9aa1b8" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
              <Txt size={13} color={colors.danger} accessibilityLiveRegion="polite">{err}</Txt>
              {status ? (
                <View style={styles.ok}>
                  <Txt weight="bold" size={13.5} color={colors.okText}>{status.label}</Txt>
                  {status.reply ? <Txt size={13.5} color={colors.okText}>{status.reply}</Txt> : null}
                </View>
              ) : null}
              <Button label={t('blkCheck')} onPress={check} busy={busy} style={styles.dark} />
            </View>
          ) : null}

          <Pressable accessibilityRole="button" onPress={close} style={styles.link}>
            <Txt size={13.5} color="#555" style={styles.underline}>{t('blkBack')}</Txt>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function formatDate(sec: number, lang: string): string {
  try {
    return new Date(sec * 1000).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return new Date(sec * 1000).toDateString();
  }
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: { flex: 1, backgroundColor: '#f4f5f8' },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 14 },
  card: { backgroundColor: colors.white, borderRadius: 22, padding: 24, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 25, shadowOffset: { width: 0, height: 12 }, elevation: 6 },
  icon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.dangerBg, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  center: { textAlign: 'center' },
  msg: { lineHeight: 24, marginTop: 10, marginBottom: 10 },
  care: { backgroundColor: '#f6f7fb', borderRadius: 14, padding: 14, marginTop: 16, marginBottom: 12, gap: 4 },
  dark: { backgroundColor: '#111', shadowOpacity: 0, borderRadius: 26, marginVertical: 8 },
  gap: { marginVertical: 8 },
  form: { marginTop: 10 },
  note: { lineHeight: 20, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: '#dcdce2', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, marginVertical: 6, color: '#111', minHeight: TOUCH },
  area: { minHeight: 90 },
  ok: { backgroundColor: colors.okBg, borderRadius: 12, padding: 12, marginVertical: 8 },
  link: { alignSelf: 'center', minHeight: TOUCH, justifyContent: 'center', marginTop: 4 },
  underline: { textDecorationLine: 'underline' },
});
