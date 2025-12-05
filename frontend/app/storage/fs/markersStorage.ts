// app/storage/markersStorage.ts
import { readJSON, writeJSON } from './base';
import { nanoid } from 'nanoid/non-secure';

const FILE = 'markers.json';

export type MarkerPayload = {
  title?: string;
  description?: string;
  coords?: { latitude: number; longitude: number } | null;
  tag?: string;
};

export type MarkerStored = MarkerPayload & {
  id: string;
  createdAt: number;
};

export async function getMarkers(): Promise<MarkerStored[]> {
  const data = await readJSON<MarkerStored[]>(FILE);
  return data ?? [];
}

export async function addMarker(marker: MarkerPayload): Promise<MarkerStored | null> {
  try {
    const all = await getMarkers();
    const newMarker: MarkerStored = {
      id: nanoid(),
      createdAt: Date.now(),
      title: marker.title ?? 'Aviso',
      description: marker.description ?? '',
      coords: marker.coords ?? null,
      tag: marker.tag ?? 'default',
    };
    const updated = [...all, newMarker];
    await writeJSON(FILE, updated);
    return newMarker;
  } catch (err) {
    console.error('addMarker error', err);
    return null;
  }
}
