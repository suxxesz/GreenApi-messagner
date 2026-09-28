export type MessengerType = 'whatsapp' | 'telegram';

export interface MessengerConfig {
  id: MessengerType;
  label: string;
  shortLabel: string;
  chatPlaceholder: string;
  helpUrl: string;
}
