import { router } from 'expo-router';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '@/store/i18n';
import { useLoginGate } from '@/store/loginGate';
import { colors } from '@/theme';

import { Button } from './Button';
import { Icon } from './Icon';
import { Txt } from './Txt';

/** Bottom sheet shown when a guest taps something that needs an account. */
export function LoginGate() {
  const t = useT();
  const open = useLoginGate((s) => s.open);
  const close = useLoginGate((s) => s.close);
  const insets = useSafeAreaInsets();

  const goLogin = () => {
    // keep the pending action: the auth screen runs it after a successful login
    useLoginGate.setState({ open: false });
    router.push('/auth');
  };

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={close} accessibilityLabel={t('close')} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.icon}>
          <Icon name="user" size={30} color={colors.primary} />
        </View>
        <Txt weight="bold" size={19} style={styles.center}>{t('authNeedTitle')}</Txt>
        <Txt size={14} color={colors.grey} style={[styles.center, styles.body]}>{t('authNeedBody')}</Txt>
        <Button label={t('authNeedBtn')} onPress={goLogin} />
        <Button label={t('cancel')} variant="link" onPress={close} style={styles.cancel} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 22 },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eef0fa',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  center: { textAlign: 'center' },
  body: { marginTop: 8, marginBottom: 18, lineHeight: 21 },
  cancel: { marginTop: 6 },
});
