export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface NotificationMessage {
  type: NotificationType;
  message: string;
  autoClose?: boolean;
  durationMs?: number;
}

export type NotificationOptions = Pick<NotificationMessage, 'autoClose' | 'durationMs'>;
