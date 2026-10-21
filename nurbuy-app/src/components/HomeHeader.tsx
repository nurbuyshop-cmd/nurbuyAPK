import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCatalog } from '@/store/catalog';
import { useNotifs } from '@/lib/useNotifs';
import { chatUnread, useChat } from '@/store/chat';
import { digits, useI18n, useT } from '@/store/i18n';
import { requireLogin } from '@/store/loginGate';
import { deliverText, useLocation } from '@/store/location';
import { colors, TOUCH } from '@/theme';

import { Icon } from './Icon';
import { openPhotoSearch } from './PhotoSearchSheet';
import { Txt } from './Txt';

const GAP = 10;

type Props = {
  /** the page's scroll position (driven on the animation thread) */
  scrollY: Animated.Value;
  /** full header height, so the page can start below it */
  onHeight: (h: number) => void;
};

/**
 * Phone header floating over the page: brand logo, language switch, "deliver to" line and the search bar.
 * While the page scrolls, the "deliver to" line slides up under the logo row and the search bar follows it,
 * all on the animation thread, so it stays smooth on weak phones.
 */
export function HomeHeader({ scrollY, onHeight }: Props) {
  const [fold, setFold] = useState(TOUCH + GAP);
  const slide = scrollY.interpolate({ inputRange: [0, fold], outputRange: [0, -fold], extrapolate: 'clamp' });
  const opacity = scrollY.interpolate({ inputRange: [0, fold * 0.7], outputRange: [1, 0], extrapolate: 'clamp' });
  const t = useT();
  const insets = useSafeAreaInsets();
  const lang = useI18n((s) => s.lang);
  const setLang = useI18n((s) => s.setLang);
  const logo = useCatalog((s) => s.catalog?.settings.logo ?? '');
  const unread = useChat(chatUnread);
  const notifUnread = useNotifs().data?.unread ?? 0;

  return (
    <View style={styles.overlay} pointerEvents="box-none" onLayout={(e) => onHeight(e.nativeEvent.layout.height)}>
      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        {logo ? (
          <Image source={logo} style={styles.logo} contentFit="contain" contentPosition="left" accessibilityLabel="NurBuy" />
        ) : (
          <Txt weight="bold" size={24} color={colors.primary} style={styles.brand}>NurBuy</Txt>
        )}
        <View style={styles.icons}>
          <Pressable
            onPress={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            style={styles.lang}
            accessibilityRole="button"
            accessibilityLabel={t('language')}
          >
            <Icon name="globe" size={22} color="#1877f2" />
            <Txt weight="bold" size={13} color="#1877f2">{lang === 'bn' ? 'EN' : 'বাং'}</Txt>
          </Pressable>
          <Pressable onPress={() => requireLogin(() => router.push('/notifications'))} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel={t('notifications')}>
            <Icon name="bell" size={25} color="#1877f2" />
            {notifUnread ? (
              <View style={styles.badge}>
                <Txt weight="bold" size={10} color={colors.white}>{digits(notifUnread > 9 ? '9+' : notifUnread, lang)}</Txt>
              </View>
            ) : null}
          </Pressable>
          <Pressable onPress={() => requireLogin(() => router.push('/chat'))} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel={t('helpSupport')}>
            <Icon name="chat" size={26} color="#1877f2" />
            {unread ? (
              <View style={styles.badge}>
                <Txt weight="bold" size={10} color={colors.white}>{digits(unread > 9 ? '9+' : unread, lang)}</Txt>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>
      <Animated.View style={[styles.lower, { transform: [{ translateY: slide }] }]}>
        <Animated.View style={{ opacity }} onLayout={(e) => setFold(Math.round(e.nativeEvent.layout.height) + GAP)}>
          <DeliverTo />
        </Animated.View>
        <View style={styles.search}>
          <Pressable style={styles.searchTap} onPress={() => router.push('/search')} accessibilityRole="search" accessibilityLabel={t('searchPh')}>
            <Icon name="search" size={22} color={colors.primary} strokeWidth={2.4} />
            <Txt size={16} color="#8a90a8" numberOfLines={1} style={styles.flex}>{t('searchPh')}</Txt>
          </Pressable>
          <Pressable onPress={openPhotoSearch} style={styles.camBtn} hitSlop={6} accessibilityRole="button" accessibilityLabel={t('photoSearch')}>
            <Icon name="cam" size={23} color={colors.primary} />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

/** "Deliver to ..." chip: the address line with the chosen village and thana (see deliverText); opens the location screen. */
function DeliverTo() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const text = useLocation((s) => deliverText(s, lang));
  return (
    <Pressable style={styles.loc} onPress={() => router.push('/location')} accessibilityRole="button" accessibilityLabel={t('deliverTo')}>
      <Icon name="pin" size={20} color={colors.text} />
      <View style={styles.locText}>
        <Txt size={12} color={colors.grey}>{t('deliverTo')}</Txt>
        <Txt weight="bold" size={14} numberOfLines={1}>{text || t('chooseArea')}</Txt>
      </View>
      <Icon name="chevron" size={16} color={colors.grey} strokeWidth={2.4} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loc: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: TOUCH },
  locText: { flexShrink: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  // the logo row stays on top; the lower part slides up underneath it
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, paddingHorizontal: 14, zIndex: 2, elevation: 2 },
  lower: { backgroundColor: colors.white, paddingHorizontal: 14, paddingTop: GAP, paddingBottom: 12, gap: GAP, zIndex: 1, elevation: 1 },
  logo: { height: 34, width: 130 },
  brand: { fontStyle: 'italic' },
  lang: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: TOUCH, paddingHorizontal: 6 },
  icons: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconBtn: { width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 4, right: 2, minWidth: 17, height: 17, borderRadius: 9, paddingHorizontal: 3, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 26,
    paddingLeft: 14,
    paddingRight: 4,
    backgroundColor: colors.white,
  },
  searchTap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: '100%' },
  flex: { flex: 1 },
  camBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
