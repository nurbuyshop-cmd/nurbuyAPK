import { Tabs } from 'expo-router/tabs';

// the bottom bar is drawn once in the root layout so it stays on product, shop and other pages too
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, freezeOnBlur: true }} tabBar={() => null}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="category" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
