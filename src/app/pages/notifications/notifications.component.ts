import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsDataService } from '../../core/services/notifications-data.service';
import { NotificationModel } from './notifications.data';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private readonly notificationsDataService = inject(NotificationsDataService);
  notifications$!: Observable<NotificationModel[]>;

  ngOnInit(): void {
    this.notifications$ = this.notificationsDataService.notifications$;
  }

  ngOnDestroy(): void {
    this.notificationsDataService.unsubscribe();
  }

  save() {
    alert('This functionality is not implemented yet.');
  }
}
