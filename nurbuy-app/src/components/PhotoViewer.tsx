import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { thumb } from '@/lib/imageUrl';
import { digits, useI18n, useT } from '@/store/i18n';
import { useViewer } from '@/store/viewer';

import { Icon } from './Icon';
import { Txt } from './Txt';

/**
 * Full-screen photo viewer: swipe between photos, pinch with two fingers to zoom (the platform's own zoomable scroll view),
 * tap the cross or the back button to close.
 */
export function PhotoViewer() {
  const t = useT();
  const urls = useViewer((s) => s.urls);
  const start = useViewer((s) => s.start);
  const close = useViewer((s) => s.close);
  return (
    <Modal visible={urls.length > 0} animationType="fade" onRequestClose={close} statusBarTranslucent>
      {urls.length ? <Body key={urls.join('|')} urls={urls} start={start} close={close} label={t('close')} /> : null}
    </Modal>
  );
}

function Body({ urls, start, close, label }: { urls: string[]; start: number; close: () => void; label: string }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const lang = useI18n((s) => s.lang);
  const [i, setI] = useState(start);
  return (
    <View style={styles.page}>
      <FlatList
        data={urls}
        horizontal
        pagingEnabled
        initialScrollIndex={start}
        getItemLayout={(_, n) => ({ length: width, offset: width * n, index: n })}
        keyExtractor={(u, n) => u + n}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setI(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <ScrollView
            style={{ width, height }}
            contentContainerStyle={{ width, height, alignItems: 'center', justifyContent: 'center' }}
            maximumZoomScale={4}
            minimumZoomScale={1}
            bouncesZoom
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            centerContent
          >
            <Image source={thumb(item, 960)} style={{ width, height: height * 0.8 }} contentFit="contain" />
          </ScrollView>
        )}
      />
      <Pressable onPress={close} style={[styles.close, { top: insets.top + 10 }]} accessibilityRole="button" accessibilityLabel={label}>
        <Icon name="x" size={24} color="#fff" />
      </Pressable>
      {urls.length > 1 ? (
        <View style={[styles.count, { bottom: insets.bottom + 20 }]}>
          <Txt weight="semibold" size={13} color="#fff">{`${digits(i + 1, lang)} / ${digits(urls.length, lang)}`}</Txt>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#000' },
  close: { position: 'absolute', right: 12, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  count: { position: 'absolute', alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 4 },
});
