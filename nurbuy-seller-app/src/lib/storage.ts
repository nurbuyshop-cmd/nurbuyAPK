import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/** Non-secret local data (cached catalog, cart, language...). Failures never throw. */
export const local = {
  async get<T>(key: string, guard: (v: unknown) => v is T): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw === null) return null;
      const v: unknown = JSON.parse(raw);
      return guard(v) ? v : null;
    } catch {
      return null;
    }
  },
  async set(key: string, value: unknown): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable: the app keeps working from memory
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // nothing to do
    }
  },
};

/** Secrets (login token, visitor id). Kept in the OS keystore. */
export const secure = {
  async get(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async set(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // keystore unavailable: the value lives only for this launch
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // nothing to do
    }
  },
};
