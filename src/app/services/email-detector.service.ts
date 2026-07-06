// email-detector.service.ts
import { Injectable } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AppservicesService } from './appservices.service';

@Injectable({
  providedIn: 'root'
})
export class EmailDetectorService {
  private userEmail: string | null = null;

  constructor(
    private platform: Platform,
    private appserv:AppservicesService,
    private alertCtrl: AlertController
  ) {}

  /**
   * Point d'entrée principal : appelé juste après connexion
   */
  async checkEmailAfterLogin(user: any) {
    // 1️⃣ Vérifier si l'email est déjà connu (dans ton API, localStorage, ou le profil utilisateur)
    this.userEmail = user?.email || this.appserv.getactualuser().email;
    if (this.userEmail) {
      console.log('✅ Email déjà connu :', this.userEmail);
      return this.userEmail;
    }

    // 2️⃣ Essayer de détecter un compte via Google (OAuth côté web)
    const googleEmail = await this.detectViaGoogleOAuth();
    if (googleEmail) {
      this.saveEmail(googleEmail);
      console.log('✅ Email détecté via Google :', googleEmail);
      return googleEmail;
    }

    // 3️⃣ Essayer via plugin natif Android (si tu veux le support mobile)
    if (this.platform.is('android')) {
      const deviceEmail = await this.detectViaDeviceAccount();
      if (deviceEmail) {
        this.saveEmail(deviceEmail);
        console.log('✅ Email détecté via le device Android :', deviceEmail);
        return deviceEmail;
      }
    }

    // 4️⃣ Si aucun email trouvé, demander à l’utilisateur
    const manualEmail = await this.askEmailManually();
    if (manualEmail) {
      this.saveEmail(manualEmail);
      console.log('✅ Email saisi manuellement :', manualEmail);
      return manualEmail;
    }

    console.warn('⚠️ Aucun email détecté');
    return null;
  }

  /**
   * Simulation : récupération via Google Identity (OAuth web)
   */
  async detectViaGoogleOAuth(): Promise<string | null> {
    return new Promise((resolve) => {
      // Vérifie si le SDK Google est chargé
      if (!('google' in window)) {
        resolve(null);
        return;
      }

      // Exemple simplifié : on déclenche un prompt Google One Tap
      const google = (window as any).google;
      google.accounts.id.initialize({
        client_id: '959991418713-t74le41ib8bjq76pd9d3vp1mp948uujd.apps.googleusercontent.com',
        callback: (response: any) => {
          const payload = JSON.parse(atob(response.credential.split('.')[1]));
          resolve(payload.email);
        }
      });

      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          resolve(null);
        }
      });
    });
  }

  /**
   * Optionnel : détection native Android via plugin Capacitor (si app mobile)
   */
  async detectViaDeviceAccount(): Promise<string | null> {
    try {
      const { EmailAccounts } = (window as any).Capacitor.Plugins;
      const result = await EmailAccounts.getEmails();
      return result?.emails?.[0] || null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Demande à l'utilisateur de saisir son email manuellement
   */
  async askEmailManually(): Promise<string | null> {
    const alertTop = await this.alertCtrl.getTop();
    if (!alertTop && this.appserv.getactualuser().id) {
       const alert = await this.alertCtrl.create({
        header: 'Adresse e-mail',
        message: 'Veuillez saisir votre adresse e-mail pour continuer',
        inputs: [
            { name: 'email', type: 'email', placeholder: 'ex: exemple@gmail.com' }
        ],
        buttons: [
            { text: 'Annuler', role: 'cancel' },
            {
            text: 'Valider',
            handler: (data) => {
                if (data.email && this.validateEmail(data.email)) {
                this.saveEmail(data.email);
                return true;
                } else {
                return false;
                }
            }
            }
        ]});

        await alert.present();
        const { data, role } = await alert.onDidDismiss();
        return role === 'cancel' ? null : data?.values?.email || null; 
    }
    return null;
  }

  private validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private saveEmail(email: string) {
    this.userEmail = email;
    //got to api
    this.appserv.presentToast('Adresse e-mail enregistrée avec succès !', 'success');
  }

  getEmail() {
    return this.userEmail;
  }
}
