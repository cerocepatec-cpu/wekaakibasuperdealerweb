import { Component, OnInit } from '@angular/core';
import { NotificationService, AppNotification } from '../services/notification.service';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-notifications-center',
  templateUrl: './notificationscenter.component.html',
  styleUrls: ['./notificationscenter.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class NotificationsCenterComponent implements OnInit {
  notifications: AppNotification[] = [];

  constructor(private notifService: NotificationService) {}

  ngOnInit() {
  // On s'abonne aux notifications persistantes du service
  this.notifService.getNotifications().subscribe(notifs => {
    this.notifications = notifs; // met à jour automatiquement la liste affichée
  });

  // Optionnel : récupérer les notifications persistantes du localStorage après reload
  const postReloadNotif = localStorage.getItem('post_reload_notification');
  if (postReloadNotif) {
    const data = JSON.parse(postReloadNotif);
    this.notifService.notify(data.message, data.color, 0, true);
    localStorage.removeItem('post_reload_notification');
  }
}


  remove(index: number) {
    this.notifService.removeNotification(index);
  }
}
