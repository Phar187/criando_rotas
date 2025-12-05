// app/storage/base.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const parsed: T = JSON.parse(raw);
    console.log(`[Storage] Read ${key}:`, parsed);
    return parsed;
  } catch (err) {
    console.error(`[Storage] Error reading ${key}:`, err);
    return null;
  }
}

export async function writeJSON<T>(key: string, data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log(`[Storage] Saved ${key}:`, data);
  } catch (err) {
    console.error(`[Storage] Error writing ${key}:`, err);
  }
}

export async function clearKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`[Storage] Cleared ${key}`);
  } catch (err) {
    console.error(`[Storage] Error clearing ${key}:`, err);
  }
}
