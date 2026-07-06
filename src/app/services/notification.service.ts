// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  message: string;
  color: 'success' | 'danger' | 'warning';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<AppNotification[]>([]);

  constructor(private toastCtrl: ToastController, private platform: Platform) {}

  // Observable pour récupérer les notifications persistantes
  getNotifications() {
    return this.notifications$.asObservable();
  }

  // Ajouter une notification
  async notify(message: string, color: 'success' | 'danger' | 'warning' = 'success', duration = 3000, persist = false) {
    // Toast immédiat
    try {
      const toast = await this.toastCtrl.create({
        message,
        duration,
        color,
        position: this.platform.is('mobile') ? 'bottom' : 'top'
      });
      await toast.present();
    } catch (err) {
      console.error('Erreur lors de l’affichage du toast global:', err);
    }

    // Notifications persistantes si persist = true
    if (persist) {
      const current = this.notifications$.value;
      this.notifications$.next([...current, { message, color, timestamp: new Date() }]);
    }
  }

  // Supprimer une notification persistante
  removeNotification(index: number) {
    const current = this.notifications$.value;
    current.splice(index, 1);
    this.notifications$.next([...current]);
  }

  // Supprimer toutes les notifications persistantes
  clearNotifications() {
    this.notifications$.next([]);
  }
}
