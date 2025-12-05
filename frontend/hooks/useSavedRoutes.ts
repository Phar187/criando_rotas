import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Coords } from '../types';

const STORAGE_KEY = '@saved_routes';

export interface SavedRoute {
  id: string;
  origemTexto: string;
  destinoTexto: string;
  origemCoords: Coords;
  destinoCoords: Coords;
  createdAt: number;
}

export function useSavedRoutes() {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) setRoutes(JSON.parse(raw));
  }

  async function add(route: SavedRoute) {
    const updated = [route, ...routes].slice(0, 10); // mantém só as últimas 10
    setRoutes(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  async function clear() {
    setRoutes([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  return { routes, add, clear };
}
