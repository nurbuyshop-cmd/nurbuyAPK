import { Tabs } from 'expo-router/tabs';

import { colors } from '@/theme';

// the bottom bar is drawn once in the root layout so it also stays on the order and notification pages
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, freezeOnBlur: true, sceneStyle: { backgroundColor: colors.bg } }} tabBar={() => null}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="products" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
