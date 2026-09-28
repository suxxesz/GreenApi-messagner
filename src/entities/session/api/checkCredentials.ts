import { getSettingsRequest } from '@/shared/api/green-api';
import type { Credentials } from '../model/types';

export async function checkCredentials(creds: Credentials): Promise<boolean> {
  if (!creds.idInstance.trim() || !creds.apiTokenInstance.trim()) return false;
  try {
    return await getSettingsRequest(creds);
  } catch {
    throw new Error('Не удалось связаться с GREEN-API. Проверьте интернет-соединение.');
  }
}
