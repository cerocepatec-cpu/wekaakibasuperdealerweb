import { Component,OnInit,OnDestroy } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { ConnectionService } from 'ng-connection-service';
import { AppservicesService } from './services/appservices.service';
import { Users } from './interfaces/users';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthentificationService } from './services/authentification.service';
// Import des modals
import { NewfenceComponent } from './finances/fences/newfence/newfence.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { InfosagentComponent } from './agents/infosagent/infosagent.component';
import { SettingsPage } from './settings/settings.page';
import { IntroPage } from './intro/intro.page';
import { OthersmenumobileComponent } from './module/uzisha/home/othersmenumobile/othersmenumobile.component';
import { Observable } from 'rxjs';
import { AppNotification, NotificationService } from './services/notification.service';
import { Menu } from './interfaces/menu';
import { RefreshtokenComponent } from './refreshtoken/refreshtoken.component';
import { EditagentComponent } from './agents/editagent/editagent.component';
import { filter } from 'rxjs';
import { PermissionsStorageService } from './services/permissions-storage.service';
import { PermissionService } from './services/permission.service';
import { ClosurefundComponent } from './closurefund/closurefund.component';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  notifications$:Observable<AppNotification[]>;
  actualuser: Users = {};
  submenu: any[] = [];
  menu: Menu[] = [];
  results: any[] = [];
  private tokenTimeout: any;

  constructor(
    private authserv:AuthentificationService,
    private notifService: NotificationService,
    private platform: Platform,
    private authService: AuthentificationService,
    private connectionservice: ConnectionService,
    public appserv: AppservicesService,
    private route: Router,
    public permissionsStorage: PermissionsStorageService,
    private permissionserv:PermissionService
  ) {
    this.notifications$ = this.notifService.getNotifications();
    this.actualuser = this.appserv.getactualuser();

    setTimeout(() => {
      const actualUser = this.appserv.getactualuser();
      const actualEse = this.appserv.getactualEse();

      if (!actualUser || !actualEse?.id) {
        localStorage.clear();
        this.route.navigateByUrl('/login', { replaceUrl: true });
      } else {
        this.actualuser = actualUser;
      }
    }, 1500);

    this.checkInternetConnectivity();
  }

  async ngOnInit() {
    //verification a chaque navigation
    this.appserv.route.events
    .pipe(filter(event=>event instanceof NavigationEnd))
    .subscribe(()=>{
      this.runEmailCheck();
      this.scheduleTokenCheck();
    });

    this.runEmailCheck();
    this.scheduleTokenCheck();
    await this.permissionsStorage.loadPermissions();
    if (this.appserv.getactualuser().id>0) {
       this.appserv.loadpermissionsfromAPI();
        this.permissionsStorage.permissions$.subscribe(perms => {
      });
    }
  }

  ngOnDestroy(){
    if (this.tokenTimeout) clearTimeout(this.tokenTimeout);
  }

  private async runEmailCheck() {
    if (await this.shouldSkipSecurityChecks()) return;

    const user = this.appserv.getactualuser();
    if (user && user.id) {
      if (!user.email || !user.user_phone || !user.name) {
        const modal = await this.appserv.modalCtrl.create({
          component: EditagentComponent,
          backdropDismiss: false,
          showBackdrop: true,
          animated: false,
          cssClass: 'fullscreen-modal',
        });
        await modal.present();
      }
    }
  }

  // ======================
  // Planifier le check du token exactement à l’expiration
  // ======================
  private async scheduleTokenCheck() {
    if (this.tokenTimeout) clearTimeout(this.tokenTimeout);
    if (await this.shouldSkipSecurityChecks()) return;

    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const expiresIn = localStorage.getItem('expires_in');
    const tokenCreatedAt = localStorage.getItem('token_created_at');

    if (!accessToken || !expiresIn || !tokenCreatedAt) {
      this.authService.logout();
      return;
    }

    const createdAt = Number(tokenCreatedAt);
    const duration = Number(expiresIn) * 1000;
    const expiryTime = createdAt + duration;
    const delay = Math.max(expiryTime - Date.now(), 0);

    // Planifie le check exact à l’expiration
    this.tokenTimeout = setTimeout(() => this.checkTokenExpiry(), delay);
  }

    // ======================
  // Vérification du token
  // ======================
  private async checkTokenExpiry(): Promise<void> {
    if (await this.shouldSkipSecurityChecks()) return;

    const refreshToken = localStorage.getItem('refresh_token');
    const refreshExpiresAt = localStorage.getItem('refresh_expires_at');

    if (refreshToken && refreshExpiresAt && Date.now() < new Date(refreshExpiresAt).getTime()) {
      const topModal = await this.appserv.modalCtrl.getTop();
      if (!topModal) {
        const modal = await this.appserv.modalCtrl.create({
          component: RefreshtokenComponent,
          backdropDismiss: false,
          showBackdrop: true,
          animated: false,
          cssClass: 'fullscreen-modal',
          componentProps: { isModal: true, refreshToken: true },
        });
        await modal.present();
      }
      // Reprogrammer le prochain check si nécessaire après refresh
      this.scheduleTokenCheck();
      return;
    }
    this.authService.logout();
  }

   // ======================
  // Détermine si on doit ignorer les checks
  // ======================
  private async shouldSkipSecurityChecks(): Promise<boolean> {
    const currentRoute = this.appserv.route.url.toLowerCase();

    // 1️⃣ Routes exclues (login)
    const excludedRoutes = ['/login'];
    if (excludedRoutes.some(route => currentRoute.includes(route))) return true;

    // 2️⃣ Ignorer si un modal RefreshtokenComponent est actif
    const topModal = await this.appserv.modalCtrl.getTop();
    if (topModal && topModal.component === RefreshtokenComponent) {
      console.log('⏩ Ignoré : modal RefreshtokenComponent actif');
      return true;
    }

    return false;
  }
 
  private loadMenuFromLocalStorage() {
    const records = localStorage.getItem('permission');
    if (records) {
      try {
        const dataMenu: any[] = JSON.parse(records);
        this.submenu = dataMenu.filter((item) => item.type === 'submenu');
        this.menu = dataMenu.filter((item) => item.type === 'menu');
        this.results = this.menu;
      } catch (e) {
        console.error('Erreur parsing menu:', e);
        this.submenu = [];
        this.menu = [];
        this.results = [];
      }
    }
  }

  async initializeApp() {
    await this.platform.ready();
    const isSessionValid = this.authService.validateSessionIntegrity();
    if (!isSessionValid) {
      this.authService.clearSession();
      this.route.navigateByUrl('/login', { replaceUrl: true });
      this.notifService.notify('Bienvenue dans Weka Akiba!', 'success', 3000);
    }
  }

  /** ✅ Vérifie si roles et permissions sont bien initialisés pour éviter crash */
  private ensurePermissionsIntegrity() {
    const roles = localStorage.getItem('roles');
    const permissions = localStorage.getItem('permissions');

    if (!roles || !permissions) {
      localStorage.setItem('roles', JSON.stringify([]));
      localStorage.setItem('permissions', JSON.stringify([]));
        if (this.appserv.getactualuser().id  && this.appserv.getactualuser().user_type==='super_admin') {
          console.log('actual user',this.appserv.getactualuser());
            this.appserv.route.navigateByUrl('/roles/permissions');
        }
      console.warn('⚠️ Permissions ou rôles réinitialisés pour éviter un crash.');
    }
  }

  async emailAutomaticDetector(){
    if (!this.appserv.isModalSecurityChanged) {
        const user = this.appserv.getactualuser();
        if (user && user.id) {
          console.log('Actual user on app component',user);
          if (!user.email || !user.user_phone || !user.full_name || !user.pin || user.pin==='0000' || user.pin==='1234') {
              const modal = await this.appserv.modalCtrl.create({
              component:EditagentComponent,
              backdropDismiss: false,
              showBackdrop: true,
              animated: false,
              cssClass:'fullscreen-modal',
            });
            modal.present();
            this.appserv.isModalSecurityChanged=true;
          } 
        }
    }
  }

  async ionViewDidEnter() {
    this.loadMenuFromLocalStorage();
  }

  async gotoOthersmenu() {
    const modal = await this.appserv.modalCtrl.create({
      component: OthersmenumobileComponent,
      cssClass: 'modal-border-radius-20',
      initialBreakpoint: 0.75,
      breakpoints: [0.5, 0.75, 0.8, 1],
    });
    modal.present();
  }

  async shownotificationcenter() {
    const modal = await this.appserv.modalCtrl.create({
      component: NotificationsComponent,
      componentProps: { isModal: true },
      cssClass: 'modal-border-radius-20',
      initialBreakpoint: 1,
      breakpoints: [0.5, 0.75, 0.8, 1],
    });
    modal.present();
  }

 async gotouserprofil(){
    const modal = await this.appserv.modalCtrl.create({
      component:InfosagentComponent,
      componentProps:{'actualuser':this.appserv.getactualuser()},
      cssClass:'modal-border-radius-20',
    });
    modal.present();
  }

  async showcerouzishainfos() {
    const modal = await this.appserv.modalCtrl.create({
      component: IntroPage,
      componentProps: { isModal: true },
      cssClass: 'modal-border-radius-20',
      initialBreakpoint: 1,
      breakpoints: [0.5, 0.75, 0.8, 1],
    });
    modal.present();
  }

  async showsettingspage() {
    const modal = await this.appserv.modalCtrl.create({
      component: SettingsPage,
      componentProps: { isModal: true },
      cssClass: 'modal-border-radius-20',
      initialBreakpoint: 1,
      breakpoints: [0.5, 0.75, 0.8, 1],
    });
    modal.present();
  }

  async fencing() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewfenceComponent,
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  checkInternetConnectivity() {
    this.connectionservice.monitor().subscribe((connectivity) => {
      if (connectivity.hasInternetAccess && connectivity.hasNetworkConnection) {
        localStorage.setItem('online', 'true');
      } else {
        localStorage.setItem('online', 'false');
      }
    });
  }

  async logout(){
    const alert = await this.appserv.alertctrl.create({
      header: 'Déconnexion',
      message: 'Voulez-vous vraiment vous déconnecter? Vous serez déconnecté sur tous vos appareils.', 
      mode: 'ios', 
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Oui',
          handler: () => {
            this.authserv.logout();
          }
        }
      ]
    });
    await alert.present();
  }

  async presenteFencePage() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewfenceComponent,
      componentProps: { isModal: true },
      cssClass: 'modal-border-radius-20',
      initialBreakpoint: 1,
      breakpoints: [0.5, 0.75, 0.8, 1],
    });
    modal.present();
  }

   removeNotification(index: number) {
    this.notifService.removeNotification(index);
  }

  async gotoclosure(){
    const modal = await this.appserv.modalCtrl.create({
      component:ClosurefundComponent,
      componentProps:{funds:[]},
      cssClass:"modal-border-radius-20"
    });
    modal.present()
  }
}
