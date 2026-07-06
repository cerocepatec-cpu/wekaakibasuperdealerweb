import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private errorCount = 0;

  constructor(private injector: Injector, private zone: NgZone) {}

  handleError(error: any): void {
    // console.error('🔥 Erreur interceptée :', error);
    this.errorCount++;

    // 🔥 Protection anti-boucle infinie
    if (this.errorCount > 5) {
      // localStorage.clear();
      // console.warn('Trop d’erreurs détectées. Nettoyage du localStorage...');
      localStorage.setItem('post_reload_notification', JSON.stringify({
        message: 'Des erreurs multiples ont été détectées, l’app a été rechargée.',
        color: 'danger'
      }));
      localStorage.setItem('INTRO_KEY', 'true'); // Pour forcer l’intro au reload
      // location.reload();
      return;
    }

    //const notifService = this.injector.get(NotificationService);

    // Utiliser NgZone pour s'assurer que la notification se met à jour côté UI
    // this.zone.run(() => {
    //   notifService.notify(
    //     error?.message || 'Une erreur inattendue est survenue',
    //     'danger',
    //     0,       // durée toast = 0 pour persistant
    //     true     // persistante
    //   );
    // });
  }
}
