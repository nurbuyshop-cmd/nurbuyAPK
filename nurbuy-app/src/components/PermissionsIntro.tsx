import { requestRecordingPermissionsAsync } from 'expo-audio';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { StringKey } from '@/i18n/en';
import { askNotificationPermission } from '@/lib/push';
import { local } from '@/lib/storage';
import { useBlock } from '@/store/block';
import { needsConsent, useConsent } from '@/store/consent';
import { useT } from '@/store/i18n';
import { colors } from '@/theme';

import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

const KEY = 'nb_perm_intro';
const isDone = (v: unknown): v is 1 => v === 1;

const ROWS: { icon: IconName; title: StringKey; why: StringKey }[] = [
  { icon: 'bell', title: 'permNotif', why: 'permNotifWhy' },
  { icon: 'pin', title: 'permLoc', why: 'permLocWhy' },
  { icon: 'cam', title: 'permCam', why: 'permCamWhy' },
  { icon: 'mic', title: 'permMic', why: 'permMicWhy' },
  { icon: 'image', title: 'permPhotos', why: 'permPhotosWhy' },
];

/** Asks one after another; a refusal of one does not stop the others. */
async function askAll() {
  const steps: (() => Promise<unknown>)[] = [
    askNotificationPermission,
    () => Location.requestForegroundPermissionsAsync(),
    () => ImagePicker.requestCameraPermissionsAsync(),
    () => requestRecordingPermissionsAsync(),
  ];
  for (const step of steps) {
    try {
      await step();
    } catch {
      // not available on this phone or in this build
    }
  }
}

/**
 * Shown once on the first start (after the privacy question): what NurBuy needs access to and why, then the phone's own
 * permission questions one after another. Each feature still asks again by itself if access was refused.
 * Photos and files need no permission: the customer picks one photo at a time with the phone's photo picker.
 */
export function PermissionsIntro() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const [pending, setPending] = useState(false);
  const [busy, setBusy] = useState(false);
  const consentOpen = useConsent(needsConsent);
  const blocked = useBlock((s) => !!s.block);

  useEffect(() => {
    void local.get(KEY, isDone).then((done) => setPending(done === null));
  }, []);

  const finish = () => {
    setPending(false);
    void local.set(KEY, 1);
  };

  const allow = async () => {
    setBusy(true);
    await askAll();
    setBusy(false);
    finish();
  };

  const open = pending && !consentOpen && !blocked;

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={finish} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 18 }]}>
          <ScrollView contentContainerStyle={styles.content} bounces={false}>
            <View style={styles.badge}>
              <Icon name="shield" size={30} color={colors.primary} />
            </View>
            <Txt weight="bold" size={19} style={styles.center}>{t('permTitle')}</Txt>
            <Txt size={13.5} color={colors.grey} style={[styles.center, styles.sub]}>{t('permSub')}</Txt>
            {ROWS.map((r) => (
              <View key={r.title} style={styles.row}>
                <View style={styles.ic}>
                  <Icon name={r.icon} size={22} color={colors.primary} />
                </View>
                <View style={styles.flex}>
                  <Txt weight="bold" size={15}>{t(r.title)}</Txt>
                  <Txt size={13} color={colors.grey}>{t(r.why)}</Txt>
                </View>
              </View>
            ))}
          </ScrollView>
          <Button label={t('permAllow')} onPress={() => void allow()} busy={busy} />
          <Button label={t('permLater')} variant="link" onPress={finish} disabled={busy} style={styles.later} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { maxHeight: '92%', backgroundColor: colors.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingHorizontal: 20, paddingTop: 20 },
  content: { paddingBottom: 14 },
  badge: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#eef0fa', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  center: { textAlign: 'center' },
  sub: { marginTop: 6, marginBottom: 14, lineHeight: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 },
  ic: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#eef0fa', alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, minWidth: 0 },
  later: { marginTop: 4 },
});
