import { STORAGE_KEYS } from '@/shared/config';
import { readStorage, writeStorage, removeStorage } from '@/shared/lib';
import type { Credentials } from './types';

export function loadCredentials(): Credentials | null {
  return readStorage<Credentials>(STORAGE_KEYS.credentials);
}

export function saveCredentials(creds: Credentials): void {
  writeStorage(STORAGE_KEYS.credentials, creds);
}

export function clearCredentials(): void {
  removeStorage(STORAGE_KEYS.credentials);
}
