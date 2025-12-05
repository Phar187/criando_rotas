import { readJSON, writeJSON } from './fs/base';
import { nanoid } from 'nanoid/non-secure';

const FILE = 'alerts.json';

export type AlertPayload = {
  message: string;
  type?: 'info' | 'warning' | 'error';
};

export type AlertStored = AlertPayload & {
  id: string;
  createdAt: number;
};

export async function getAlerts(): Promise<AlertStored[]> {
  const data = await readJSON<AlertStored[]>(FILE);
  return data ?? [];
}

export async function addAlert(alert: AlertPayload): Promise<AlertStored | null> {
  try {
    const all = await getAlerts();
    const newAlert: AlertStored = {
      id: nanoid(),
      createdAt: Date.now(),
      message: alert.message,
      type: alert.type ?? 'info',
    };
    const updated = [...all, newAlert];
    await writeJSON(FILE, updated);
    return newAlert;
  } catch (err) {
    console.error('addAlert error', err);
    return null;
  }
}
