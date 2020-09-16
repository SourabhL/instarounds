import {Component, OnDestroy, OnInit} from '@angular/core';
import { NotificationService } from './notification.service';
import { Notification, NotificationType } from './notification';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationListComponent implements OnInit, OnDestroy{

  notifications: Notification[] = [];
  private _subscription: Subscription;

  constructor(private _notificationSvc: NotificationService) { }

  private _addNotification(notification: Notification) {
    this.notifications.push(notification);

    if (notification.timeout !== 0) {
      setTimeout(() => this.close(notification), notification.timeout);

    }
  }

  ngOnInit() {
    this._subscription = this._notificationSvc.getObservable().subscribe(notification => this._addNotification(notification));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  close(notification: Notification) {
    this.notifications = this.notifications.filter(notif => notif.id !== notification.id);
  }


  className(notification: Notification): string {

    let style: string;

    switch (notification.type) {

      case NotificationType.success:
        style = 'success';
        break;

      case NotificationType.warning:
        style = 'warning';
        break;

      case NotificationType.error:
        style = 'error';
        break;
      case NotificationType.info:
        style = 'info';
        break;

      default:
        style = 'info';
        break;
    }

    return style;
  }
}
