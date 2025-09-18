import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  NotificationMessage,
  NotificationOptions,
  NotificationType,
} from '../models/notification-message.models';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly exampleSuccess = {
    type: NotificationType.SUCCESS,
    message:
      "Hello there! We present to your attention a project by the PADAWAN CADERS' GUILD team.",
    durationMs: 60000,
  };

  private readonly state$ = new BehaviorSubject<NotificationMessage | null>(this.exampleSuccess);
  readonly notificationState$ = this.state$.asObservable();
  private closeTimerId: ReturnType<typeof setTimeout> | null = null;

  showSuccess(message: string, options?: NotificationOptions) {
    this.emit(NotificationType.SUCCESS, message, options);
  }

  showError(message: string, options?: NotificationOptions) {
    this.emit(NotificationType.ERROR, message, options);
  }

  clear() {
    this.state$.next(null);
    this.closeTimer();
  }

  private emit(type: NotificationType, message: string, options?: NotificationOptions): void {
    const notificatioPayload: NotificationMessage = {
      type,
      message,
      autoClose: options?.autoClose ?? true,
      durationMs: options?.durationMs ?? 3000,
    };
    this.closeTimer();
    this.state$.next(notificatioPayload);

    if (notificatioPayload.autoClose && notificatioPayload.durationMs! > 0) {
      this.closeTimerId = setTimeout(() => {
        this.state$.next(null);
        this.closeTimerId = null;
      }, notificatioPayload.durationMs);
    }
  }

  private closeTimer(): void {
    if (this.closeTimerId != null) {
      clearTimeout(this.closeTimerId);
      this.closeTimerId = null;
    }
  }
}
