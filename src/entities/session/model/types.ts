import type { MessengerType } from '@/entities/messenger';

export interface Credentials {
  messenger: MessengerType;
  idInstance: string;
  apiTokenInstance: string;
}
