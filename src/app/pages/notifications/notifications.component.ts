import { Component } from '@angular/core';
import { NotificationModel, NOTIFICATIONS } from './notifications.data';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  notifications: NotificationModel[] = NOTIFICATIONS;

  save() {
    alert('Something went wrong.\nTry again later!');
  }
}
