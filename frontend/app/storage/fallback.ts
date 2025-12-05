import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getFallback(key: string) {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}
export async function setFallback(key: string, data: any) {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}
