import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Linking, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { photoSearchSupported, pickSearchPhoto } from '@/lib/vision';
import { useT } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors, TOUCH } from '@/theme';

import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

const usePhotoSheet = create<{ open: boolean }>(() => ({ open: false }));

/** Opens the "Search by Photo" sheet (camera icon in the search bars). */
export const openPhotoSearch = () => usePhotoSheet.setState({ open: true });
const close = () => usePhotoSheet.setState({ open: false });

/** Bottom sheet: take a photo or choose one, then show the matching products. */
export function PhotoSearchSheet() {
  const t = useT();
  const open = usePhotoSheet((s) => s.open);
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);

  const start = async (source: 'camera' | 'gallery') => {
    setBusy(true);
    setDenied(false);
    try {
      const r = await pickSearchPhoto(source);
      if (!r) return;
      if ('denied' in r) {
        setDenied(true);
        return;
      }
      close();
      router.push({ pathname: '/photo-search', params: { uri: r.uri } });
    } catch {
      toast(t('photoError'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={close} accessibilityLabel={t('close')} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 18 }]}>
        <View style={styles.grip} />
        <Txt weight="bold" size={19} style={styles.center}>{t('photoSearch')}</Txt>
        {!photoSearchSupported ? (
          <Txt size={14} color={colors.grey} style={[styles.center, styles.tip]}>{t('photoUnsupported')}</Txt>
        ) : (
          <>
            <Txt size={13.5} color={colors.grey} style={[styles.center, styles.tip]}>{t('photoTip')}</Txt>
            <View style={styles.options}>
              <Option icon="cam" label={t('photoTake')} onPress={() => void start('camera')} disabled={busy} />
              <Option icon="image" label={t('photoGallery')} onPress={() => void start('gallery')} disabled={busy} />
            </View>
            {busy ? <ActivityIndicator color={colors.primary} style={styles.busy} /> : null}
            {denied ? (
              <View style={styles.denied}>
                <Txt size={13.5} color={colors.danger} style={styles.center}>{t('photoCamDenied')}</Txt>
                <Button label={t('openSettings')} variant="link" onPress={() => void Linking.openSettings()} />
              </View>
            ) : null}
          </>
        )}
        <Button label={t('cancel')} variant="link" onPress={close} style={styles.cancel} />
      </View>
    </Modal>
  );
}

function Option({ icon, label, onPress, disabled }: { icon: IconName; label: string; onPress: () => void; disabled: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.option, pressed && styles.pressed, disabled && styles.off]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.optIcon}>
        <Icon name={icon} size={28} color={colors.primary} />
      </View>
      <Txt weight="semibold" size={14} style={styles.center}>{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingHorizontal: 20, paddingTop: 10 },
  grip: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: '#dfe3f1', marginBottom: 14 },
  center: { textAlign: 'center' },
  tip: { marginTop: 6, lineHeight: 20 },
  options: { flexDirection: 'row', gap: 12, marginTop: 18 },
  option: { flex: 1, minHeight: 110, alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 16, borderWidth: 1.5, borderColor: colors.border, padding: 12 },
  optIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#eef0fa', alignItems: 'center', justifyContent: 'center' },
  pressed: { backgroundColor: '#f5f6fa' },
  off: { opacity: 0.5 },
  busy: { marginTop: 14 },
  denied: { marginTop: 12, alignItems: 'center' },
  cancel: { marginTop: 8, minHeight: TOUCH },
});
