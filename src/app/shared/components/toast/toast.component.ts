import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { NotificationType } from '../../../core/models/notification-message.models';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  private readonly notification = inject(NotificationService);
  private readonly snackBar = inject(MatSnackBar);

  readonly notificationState = toSignal(this.notification.notificationState$, {
    requireSync: true,
  });

  constructor() {
    effect(() => {
      const message = this.notificationState();
      if (!message) return;

      const snackbarConfig = {
        duration: message.durationMs,
        horizontalPosition: 'center' as const,
        verticalPosition: 'top' as const,
        panelClass: message.type === NotificationType.SUCCESS ? ['toast-success'] : ['toast-error'],
      };

      const snackbarRef = this.snackBar.open(message.message, 'Ok', snackbarConfig);

      snackbarRef
        .onAction()
        .pipe(take(1))
        .subscribe(() => {
          this.snackBar.dismiss();
          this.notification.clear();
        });
    });
  }

  get isSuccess(): boolean {
    return this.notificationState()?.type === NotificationType.SUCCESS;
  }
}
