import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { Txt } from '@/components/Txt';
import { errorText } from '@/lib/errors';
import { isEmail, isMobile, normalizeMobile } from '@/lib/phone';
import { useAuth } from '@/store/auth';
import { useCatalog } from '@/store/catalog';
import { useI18n, useT, type Lang } from '@/store/i18n';
import { useLoginGate } from '@/store/loginGate';
import { toast } from '@/store/toast';
import { colors, TOUCH } from '@/theme';

type Mode = 'login' | 'signup';

export default function AuthScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<Mode>(params.mode === 'signup' ? 'signup' : 'login');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const done = useRef(false);

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [pw2, setPw2] = useState('');
  const [terms, setTerms] = useState(false);

  const login = useAuth((s) => s.login);
  const signup = useAuth((s) => s.signup);

  // leaving without logging in drops the action that was waiting for the login
  useEffect(() => () => {
    if (!done.current) useLoginGate.getState().close();
  }, []);

  const switchMode = (m: Mode) => {
    setMode(m);
    setErr('');
  };

  const finish = (msg: string) => {
    done.current = true;
    toast(msg);
    if (router.canGoBack()) router.back();
    else router.replace('/');
    useLoginGate.getState().runPending();
  };

  const submit = async () => {
    setErr('');
    if (mode === 'login') {
      const v = id.trim();
      if (!v) return setErr(t('vIdRequired'));
      if (!pw) return setErr(t('vPwRequired'));
      setBusy(true);
      try {
        const u = await login(v, pw);
        finish(t('authWelcomeName') + firstName(u.name) + '!');
      } catch (e) {
        setErr(errorText(e, t));
      } finally {
        setBusy(false);
      }
      return;
    }
    const nm = name.trim();
    const em = email.trim();
    if (nm.length < 2) return setErr(t('vName'));
    if (!isMobile(mobile)) return setErr(t('vMobile'));
    if (em && !isEmail(em)) return setErr(t('vEmail'));
    if (pw.length < 6) return setErr(t('vPwShort'));
    if (pw !== pw2) return setErr(t('vPwMatch'));
    if (!terms) return setErr(t('vTerms'));
    setBusy(true);
    try {
      await signup({ name: nm, mobile: normalizeMobile(mobile), email: em, password: pw });
      finish(t('authCreatedName') + firstName(nm) + '!');
    } catch (e) {
      setErr(errorText(e, t));
    } finally {
      setBusy(false);
    }
  };

  const lg = mode === 'login';
  const logo = useCatalog((s) => s.catalog?.settings.logo ?? '');

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.grow} keyboardShouldPersistTaps="handled">
        <View style={[styles.hero, { paddingTop: insets.top + 26 }]}>
          {/* the shop logo from the admin settings (same as the home header); the name only while it is missing */}
          {logo ? (
            <Image source={logo} style={styles.logo} contentFit="contain" contentPosition="left" accessibilityLabel="NurBuy" />
          ) : (
            <Txt weight="bold" size={26} color={colors.primary} style={styles.brand}>NurBuy</Txt>
          )}
          <Txt weight="bold" size={22} style={styles.heroTitle}>{t('authHero')}</Txt>
          <Txt size={14} color={colors.text} style={styles.heroSub}>{t('authHeroSub')}</Txt>
        </View>

        <View style={[styles.card, { paddingBottom: insets.bottom + 40 }]}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('close')} onPress={() => router.back()} style={styles.close}>
            <Icon name="x" size={20} color="#444" />
          </Pressable>

          <View style={styles.tabs} accessibilityRole="tablist">
            {(['login', 'signup'] as const).map((m) => (
              <Pressable
                key={m}
                accessibilityRole="tab"
                accessibilityState={{ selected: mode === m }}
                onPress={() => switchMode(m)}
                style={[styles.tab, mode === m && styles.tabOn]}
              >
                <Txt weight="bold" size={14.5} color={mode === m ? colors.primary : '#6b7391'}>
                  {m === 'login' ? t('authLogin') : t('authSignupTab')}
                </Txt>
              </Pressable>
            ))}
          </View>

          <Txt weight="bold" size={23} color="#111">{lg ? t('authWelcome') : t('authCreateTitle')}</Txt>
          <Txt size={14} color="#666" style={styles.sub}>{lg ? t('authLoginSub') : t('authSignupSub')}</Txt>

          {lg ? (
            <>
              <Field label={t('authId')} placeholder={t('authIdPh')} value={id} onChangeText={setId} autoComplete="username" textContentType="username" keyboardType="email-address" returnKeyType="next" />
              <Field label={t('authPassword')} placeholder={t('authPasswordPh')} value={pw} onChangeText={setPw} password autoComplete="current-password" textContentType="password" returnKeyType="go" onSubmitEditing={submit} />
              <Pressable accessibilityRole="button" onPress={() => toast(t('authForgotMsg'))} style={styles.forgot}>
                <Txt weight="bold" size={13.5} color={colors.primary}>{t('authForgot')}</Txt>
              </Pressable>
            </>
          ) : (
            <>
              <Field label={t('authName')} placeholder={t('authNamePh')} value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name" textContentType="name" />
              <Field label={t('authMobile')} placeholder="01XXXXXXXXX" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
              <Field label={t('authEmailOpt')} placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" />
              <Field label={t('authPassword')} placeholder={t('authPasswordNewPh')} value={pw} onChangeText={setPw} password autoComplete="new-password" textContentType="newPassword" />
              <Field label={t('authConfirm')} placeholder={t('authConfirmPh')} value={pw2} onChangeText={setPw2} password autoComplete="new-password" textContentType="newPassword" />
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: terms }}
                onPress={() => setTerms((v) => !v)}
                style={styles.terms}
              >
                <View style={[styles.box, terms && styles.boxOn]}>{terms ? <Icon name="check" size={14} color={colors.white} strokeWidth={3} /> : null}</View>
                <Txt size={13} color="#555" style={styles.flex}>{t('authTerms')}</Txt>
              </Pressable>
            </>
          )}

          <Txt weight="semibold" size={13.5} color="#d4143f" style={styles.err} accessibilityLiveRegion="polite">{err}</Txt>
          <Button label={lg ? t('authLoginBtn') : t('authSignupBtn')} onPress={submit} busy={busy} />

          <View style={styles.switch}>
            <Txt size={14} color="#555">{lg ? t('authNew') : t('authHave')} </Txt>
            <Pressable accessibilityRole="button" onPress={() => switchMode(lg ? 'signup' : 'login')} hitSlop={10}>
              <Txt weight="bold" size={14} color={colors.primary}>{lg ? t('authSignupBtn') : t('authLoginBtn')}</Txt>
            </Pressable>
          </View>

          <LangSwitch />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function LangSwitch() {
  const lang = useI18n((s) => s.lang);
  const setLang = useI18n((s) => s.setLang);
  const t = useT();
  const opts: { l: Lang; label: string }[] = [
    { l: 'bn', label: 'বাংলা' },
    { l: 'en', label: 'English' },
  ];
  return (
    <View style={styles.lang} accessibilityLabel={t('language')}>
      <Icon name="globe" size={18} color={colors.grey} />
      {opts.map((o) => (
        <Pressable key={o.l} accessibilityRole="button" accessibilityState={{ selected: lang === o.l }} onPress={() => setLang(o.l)} style={[styles.langBtn, lang === o.l && styles.langOn]}>
          <Txt weight="semibold" size={13.5} color={lang === o.l ? colors.primary : colors.grey}>{o.label}</Txt>
        </Pressable>
      ))}
    </View>
  );
}

const firstName = (n: string) => n.trim().split(/\s+/)[0] ?? '';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1, backgroundColor: colors.white },
  hero: { backgroundColor: '#dbe5ff', paddingHorizontal: 22, paddingBottom: 54 },
  brand: { fontStyle: 'italic', letterSpacing: -0.5 },
  logo: { height: 44, width: 170 },
  heroTitle: { marginTop: 18, marginBottom: 6 },
  heroSub: { opacity: 0.88 },
  card: { flex: 1, backgroundColor: colors.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, marginTop: -30, padding: 20 },
  close: { position: 'absolute', top: 10, right: 10, width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: '#eef0fa', borderRadius: 14, padding: 4, gap: 4, marginTop: 6, marginRight: 48, marginBottom: 18 },
  tab: { flex: 1, height: 44, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  tabOn: { backgroundColor: colors.white, shadowColor: '#1e2d78', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  sub: { marginTop: 4, marginBottom: 16 },
  forgot: { alignSelf: 'flex-end', minHeight: TOUCH, justifyContent: 'center', marginTop: -10 },
  terms: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: TOUCH },
  box: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: '#b9c0d8', alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  err: { minHeight: 20, marginVertical: 6 },
  switch: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 18, flexWrap: 'wrap' },
  lang: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 22 },
  langBtn: { minHeight: TOUCH, paddingHorizontal: 12, justifyContent: 'center', borderRadius: 10 },
  langOn: { backgroundColor: '#eef0fa' },
});
