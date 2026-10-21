import NetInfo from '@react-native-community/netinfo';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCatalog } from '@/store/catalog';
import { useT } from '@/store/i18n';
import { colors } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';

/** Red bar while there is no internet; when it comes back, the catalog and the open pages refresh by themselves. */
export function OfflineBar() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [offline, setOffline] = useState(false);
  const was = useRef(false);

  useEffect(
    () =>
      NetInfo.addEventListener((s) => {
        // reachable is null while unknown: only an explicit "no" counts as offline
        const off = s.isConnected === false || s.isInternetReachable === false;
        if (was.current && !off) {
          void useCatalog.getState().refresh();
          void useCatalog.getState().refreshRatings();
          void qc.invalidateQueries();
        }
        was.current = off;
        setOffline(off);
      }),
    [qc],
  );

  if (!offline) return null;
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 4 }]} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Icon name="info" size={16} color={colors.white} />
      <Txt weight="semibold" size={13} color={colors.white}>{t('offline')}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#b42318', paddingBottom: 6, zIndex: 900, elevation: 40 },
});
