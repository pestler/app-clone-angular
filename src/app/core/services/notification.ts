import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationMessage, NotificationType } from '../models/notification-message.models';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly state$ = new BehaviorSubject<NotificationMessage | null>(null);
  readonly notificationState$ = this.state$.asObservable();

  showSuccess(message: string, options?: { autoClose?: boolean; durationMs?: number }) {
    this.emit(NotificationType.SUCCESS, message, options);
  }

  showError(message: string, options?: { autoClose?: boolean; durationMs?: number }) {
    this.emit(NotificationType.ERROR, message, options);
  }

  private emit(
    type: NotificationType,
    message: string,
    options?: { autoClose?: boolean; durationMs?: number },
  ): void {
    const NotificatioPpayload: NotificationMessage = {
      type,
      message,
      autoClose: options?.autoClose ?? true,
      durationMs: options?.durationMs ?? 3000,
    };
    this.state$.next(NotificatioPpayload);
  }
}
