import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { pushPermission, registerPush, type PushPermission } from '@/lib/push';
import { useT } from '@/store/i18n';
import { toast } from '@/store/toast';

import { Button } from './Button';
import { Txt } from './Txt';
import { Banner } from './ui';

/**
 * "Get new delivery alerts" while the phone blocks the app's notifications (website pushBanner()).
 * "Turn on" asks the phone; when it was refused for good, it opens the app's settings instead.
 */
export function PushBanner() {
  const t = useT();
  const [perm, setPerm] = useState<PushPermission>('granted');

  // checked each time the page opens (the rider may have changed it in the phone's settings)
  useFocusEffect(
    useCallback(() => {
      let live = true;
      void pushPermission().then((p) => live && setPerm(p));
      return () => {
        live = false;
      };
    }, []),
  );

  if (perm === 'granted' || perm === 'unsupported') return null;

  const turnOn = async () => {
    if (perm === 'denied') {
      void Linking.openSettings();
      return;
    }
    await registerPush();
    const p = await pushPermission();
    setPerm(p);
    toast(p === 'granted' ? t('alertsOn') : t('alertsNotOn'), p === 'granted' ? 'ok' : 'bad');
  };

  return (
    <Banner tone="warn" icon="bell">
      <Txt weight="bold" size={14}>{t('getAlerts')}</Txt>
      <Txt size={13}>{perm === 'denied' ? t('alertsBlocked') : t('alertsSub')}</Txt>
      <View style={styles.btn}>
        <Button small label={perm === 'denied' ? t('openSettings') : t('turnOn')} onPress={() => void turnOn()} />
      </View>
    </Banner>
  );
}

const styles = StyleSheet.create({
  btn: { marginTop: 8, alignSelf: 'flex-start' },
});
