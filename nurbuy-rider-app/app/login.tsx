import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View, type TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { LangButton } from '@/components/TopBar';
import { Txt } from '@/components/Txt';
import { Banner, Card } from '@/components/ui';
import { errorText } from '@/lib/errors';
import { useAuth } from '@/store/auth';
import { toggleLang, useT } from '@/store/i18n';
import { colors } from '@/theme';

export default function Login() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const login = useAuth((s) => s.login);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<{ id?: string; pw?: string; all?: string }>({});
  const [busy, setBusy] = useState(false);
  const pwRef = useRef<TextInput>(null);

  const submit = async () => {
    const e: typeof err = {};
    if (!id.trim()) e.id = t('loginIdNeed');
    if (!pw) e.pw = t('passwordNeed');
    setErr(e);
    if (e.id || e.pw || busy) return;
    setBusy(true);
    try {
      await login(id.trim(), pw);
      // the gate in the root layout opens home or the status page
    } catch (x) {
      setErr({ all: errorText(x, t) });
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.page, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <LangButton label={t('langSwitch')} onPress={toggleLang} />
        </View>
        <View style={styles.logo}>
          <View style={styles.mark}>
            <Icon name="bike" size={32} color={colors.white} />
          </View>
          <Txt weight="bold" size={26} latin>NurBuy</Txt>
          <Txt weight="semibold" size={14} color={colors.orange} latin>RIDER</Txt>
        </View>
        <Txt size={15} color={colors.grey} style={styles.center}>{t('loginSub')}</Txt>
        <Card style={styles.card}>
          {err.all ? (
            <View style={styles.banner}>
              <Banner tone="bad">{err.all}</Banner>
            </View>
          ) : null}
          <Field
            label={t('loginId')}
            value={id}
            onChangeText={(v) => {
              setId(v);
              if (err.id) setErr((s) => ({ ...s, id: undefined }));
            }}
            placeholder="01XXXXXXXXX"
            autoComplete="username"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => pwRef.current?.focus()}
            error={err.id}
          />
          <Field
            ref={pwRef}
            label={t('password')}
            value={pw}
            onChangeText={(v) => {
              setPw(v);
              if (err.pw) setErr((s) => ({ ...s, pw: undefined }));
            }}
            password
            autoComplete="current-password"
            returnKeyType="go"
            onSubmitEditing={() => void submit()}
            error={err.pw}
          />
          <Button label={t('login')} busy={busy} onPress={() => void submit()} style={styles.btn} />
        </Card>
        <View style={styles.applyBox}>
          <Txt size={14} color={colors.grey}>{t('newToNurbuy')}</Txt>
          <Pressable onPress={() => router.push('/apply')} style={styles.applyLink} accessibilityRole="link">
            <Txt weight="bold" size={15.5} color={colors.primary}>{t('becomeRider')}</Txt>
            <Icon name="chevron" size={17} color={colors.primary} />
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  page: { paddingHorizontal: 18, flexGrow: 1 },
  top: { alignItems: 'flex-end' },
  logo: { alignItems: 'center', gap: 2, marginTop: 18, marginBottom: 10 },
  mark: { width: 62, height: 62, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  center: { textAlign: 'center', marginBottom: 18 },
  card: { padding: 18 },
  banner: { marginBottom: 12 },
  btn: { marginTop: 6 },
  applyBox: { alignItems: 'center', marginTop: 22, gap: 2 },
  applyLink: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 44 },
});
