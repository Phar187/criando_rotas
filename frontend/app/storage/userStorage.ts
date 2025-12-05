import { readJSON, writeJSON, clearKey } from './fs/base';
import { UserData } from '../../types';

const USER_KEY = '@safeRoute:user';

export async function saveUser(user: UserData) {
  await writeJSON(USER_KEY, user);
}

export async function getUser(): Promise<UserData | null> {
  return readJSON<UserData>(USER_KEY);
}

export async function clearUser() {
  await clearKey(USER_KEY);
}
