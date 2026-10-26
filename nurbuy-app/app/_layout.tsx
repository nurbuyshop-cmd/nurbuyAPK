import { Hind_400Regular, Hind_500Medium, Hind_600SemiBold, Hind_700Bold } from '@expo-google-fonts/hind';
import { NotoSansBengali_400Regular } from '@expo-google-fonts/noto-sans-bengali';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { router, Stack, usePathname, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { SafeAreaInsetsContext, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { AddToCartSheet } from '@/components/AddToCartSheet';
import { ConsentBanner } from '@/components/ConsentBanner';
import { CrashScreen } from '@/components/CrashScreen';
import { LoginGate } from '@/components/LoginGate';
import { Maintenance } from '@/components/Maintenance';
import { OfflineBar } from '@/components/OfflineBar';
import { PermissionsIntro } from '@/components/PermissionsIntro';
import { PhotoSearchSheet } from '@/components/PhotoSearchSheet';
import { PhotoViewer } from '@/components/PhotoViewer';
import { NavBar, showsNavBar } from '@/components/TabBar';
import { Toast } from '@/components/Toast';
import { pageOf, track } from '@/lib/analytics';
import { openAppLink } from '@/lib/links';
import { indexCatalog } from '@/lib/products';
import { listenNotificationTaps, registerPush } from '@/lib/push';
import { useAuth } from '@/store/auth';
import { useBlock } from '@/store/block';
import { cartCount, useCart } from '@/store/cart';
import { useCatalog } from '@/store/catalog';
import { useConsent } from '@/store/consent';
import { useHistory } from '@/store/history';
import { useI18n } from '@/store/i18n';
import { areaComplete, useLocation } from '@/store/location';
import { useLite } from '@/store/lite';
import { usePersonal } from '@/store/personal';
import { colors } from '@/theme';

/** Any page that fails unexpectedly shows this instead of a white screen. */
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <CrashScreen retry={retry} />;
}

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000, refetchOnWindowFocus: false } },
});

/** The splash waits at most this long for the first catalog download when nothing is cached. */
const FIRST_LOAD_WAIT = 12000;

async function boot(): Promise<void> {
  await Promise.all([
    useI18n.getState().hydrate(),
    useAuth.getState().hydrate(),
    useConsent.getState().hydrate(),
    useCart.getState().hydrate(),
    useHistory.getState().hydrate(),
    useLocation.getState().hydrate(),
    usePersonal.getState().hydrate(),
    useLite.getState().hydrate(),
  ]);
  const cat = useCatalog.getState();
  void cat.refreshRatings();
  // show the saved catalog at once and refresh it in the background; without one, keep the splash until real data arrives
  const fresh = cat.refresh();
  if (!(await cat.loadCached())) await Promise.race([fresh, new Promise((r) => setTimeout(r, FIRST_LOAD_WAIT))]);
}

/** Whether the bottom bar shows; changes only when a page with or without it opens, not on every page change. */
const useBarShown = create<{ shown: boolean }>(() => ({ shown: true }));

// screens underneath the open one stay frozen (no redraws while hidden)
const SCREEN_OPTIONS = { headerShown: false, freezeOnBlur: true, contentStyle: { backgroundColor: colors.bg } };
const AUTH_OPTIONS = { presentation: 'modal' as const, contentStyle: { backgroundColor: colors.white } };
const RESTRICTED_OPTIONS = { presentation: 'fullScreenModal' as const, gestureEnabled: false };
const NO_GESTURE = { gestureEnabled: false };

/**
 * The screens. This deliberately does not follow the current page, so opening a page does not redraw every open screen
 * (that made taps feel slow on weak phones).
 */
function Screens() {
  const insets = useSafeAreaInsets();
  const bar = useBarShown((s) => s.shown);
  // the bar already covers the bottom inset, so pages above it must not pad for it twice
  const inner = useMemo(() => (bar ? { ...insets, bottom: 0 } : insets), [bar, insets]);
  return (
    <View style={styles.root}>
      <SafeAreaInsetsContext.Provider value={inner}>
        <Stack screenOptions={SCREEN_OPTIONS}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" options={AUTH_OPTIONS} />
          <Stack.Screen name="restricted" options={RESTRICTED_OPTIONS} />
          <Stack.Screen name="location" options={NO_GESTURE} />
          <Stack.Screen name="order-success" options={NO_GESTURE} />
        </Stack>
      </SafeAreaInsetsContext.Provider>
    </View>
  );
}

/** The bottom bar, on every page except full-screen flows (sign-in, checkout, chat...). */
function BottomBar() {
  const count = useCart(cartCount);
  const bar = useBarShown((s) => s.shown);
  return bar ? <NavBar cartCount={count} /> : null;
}

/** Everything that depends on the page being shown, kept in one small piece that draws nothing. */
function RouteWatch({ ready, booted }: { ready: boolean; booted: boolean }) {
  const pathname = usePathname();
  const block = useBlock((s) => s.block);

  useEffect(() => {
    const shown = showsNavBar(pathname);
    if (useBarShown.getState().shown !== shown) useBarShown.setState({ shown });
  }, [pathname]);

  useEffect(() => {
    if (ready && block && pathname !== '/restricted') router.push('/restricted');
  }, [ready, block, pathname]);

  // areas mode (no delivery zones): the first visit must choose District, Thana and Village before shopping
  const mustPick = useLocation((s) => !s.zones?.active && !!s.areas?.districts.length && !areaComplete(s.areas, s.sel));
  useEffect(() => {
    if (ready && mustPick && !block && pathname !== '/location') router.push({ pathname: '/location', params: { force: '1' } });
  }, [ready, mustPick, block, pathname]);

  // the screen the customer is on, for visitor analytics
  const page = pageOf(pathname);
  useEffect(() => {
    if (booted) void track('page', { pg: page });
  }, [booted, page]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Hind_400Regular, Hind_500Medium, Hind_600SemiBold, Hind_700Bold, NotoSansBengali_400Regular });
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    boot().finally(() => setBooted(true));
  }, []);

  // like the website: refresh the catalog every 60 s and the star ratings every 90 s while the app is in front
  useEffect(() => {
    const cat = useCatalog.getState();
    const a = setInterval(() => AppState.currentState === 'active' && void cat.refresh(), 60_000);
    const b = setInterval(() => AppState.currentState === 'active' && void cat.refreshRatings(), 90_000);
    const sub = AppState.addEventListener('change', (s) => s === 'active' && void cat.refresh());
    return () => {
      clearInterval(a);
      clearInterval(b);
      sub.remove();
    };
  }, []);

  const ready = booted && (fontsLoaded || !!fontError);

  // the logo splash stays until the app is ready (the intro video is switched off for now: components/IntroVideo.tsx)
  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  // visitor analytics: one visit per launch and a ping every minute while open (pages: RouteWatch)
  useEffect(() => {
    if (!booted) return;
    void track('visit');
    const id = setInterval(() => AppState.currentState === 'active' && void track('ping'), 60_000);
    return () => clearInterval(id);
  }, [booted]);

  // phone push: register this phone after login (also on an app start with a saved login)
  const status = useAuth((s) => s.status);
  useEffect(() => {
    if (!ready || status !== 'user') return;
    void registerPush();
    // also when the app comes back (a start without internet would otherwise leave the phone unregistered)
    const sub = AppState.addEventListener('change', (s) => s === 'active' && void registerPush());
    return () => sub.remove();
  }, [ready, status]);

  // tapping a notification opens its order, chat, wallet or product (also when it started the app)
  useEffect(() => {
    if (!ready) return;
    return listenNotificationTaps((url) => {
      const c = useCatalog.getState().catalog;
      openAppLink(url, c ? indexCatalog(c, useLocation.getState().sel) : null);
    });
  }, [ready]);

  // a signed-out phone must not keep showing the previous customer's orders
  useEffect(() => useAuth.subscribe((s, prev) => {
    if (prev.status === 'user' && s.status === 'guest') queryClient.clear();
  }), []);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <View style={styles.root}>
          <StatusBar style="dark" />
          <RouteWatch ready={ready} booted={booted} />
          <Screens />
          <BottomBar />
          <AddToCartSheet />
          <PhotoViewer />
          <PhotoSearchSheet />
          <OfflineBar />
          <Maintenance />
          <ConsentBanner />
          <PermissionsIntro />
          <LoginGate />
          <Toast />
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
