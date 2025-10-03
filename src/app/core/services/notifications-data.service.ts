import { inject, Injectable } from '@angular/core';
import { collection, Firestore, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { NotificationModel } from '../../pages/notifications/notifications.data';

@Injectable({
  providedIn: 'root',
})
export class NotificationsDataService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly notifications$$ = new BehaviorSubject<NotificationModel[]>([]);
  readonly notifications$ = this.notifications$$.asObservable();

  private unsubscribeFromNotifications: (() => void) | null = null;

  constructor() {
    this.listenToNotifications();
  }

  listenToNotifications() {
    if (this.unsubscribeFromNotifications) {
      this.unsubscribeFromNotifications();
    }

    const notificationsCollection = collection(this.firestore, 'notifications');
    const q = query(notificationsCollection, orderBy('date', 'desc'));

    this.unsubscribeFromNotifications = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map((doc) => doc.data() as NotificationModel);
      this.notifications$$.next(notifications);
    });
  }

  unsubscribe() {
    if (this.unsubscribeFromNotifications) {
      this.unsubscribeFromNotifications();
    }
  }
}
