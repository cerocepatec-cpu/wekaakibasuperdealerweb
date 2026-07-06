import { Component, OnInit } from '@angular/core';
import { NewfenceComponent } from 'src/app/finances/fences/newfence/newfence.component';
import { Menu } from 'src/app/interfaces/menu';
import { Users } from 'src/app/interfaces/users';
import { AppservicesService } from 'src/app/services/appservices.service';
import { Router } from '@angular/router';
import { IntroPage } from 'src/app/intro/intro.page';
import { NotificationsComponent } from 'src/app/notifications/notifications.component';
import { InfosagentComponent } from 'src/app/agents/infosagent/infosagent.component';
import { SettingsPage } from 'src/app/settings/settings.page';
import { MenuController } from '@ionic/angular';
import { OthersmenumobileComponent } from './home/othersmenumobile/othersmenumobile.component';
import { AuthentificationService } from 'src/app/services/authentification.service';


@Component({
  selector: 'app-uzisha',
  templateUrl: './uzisha.page.html',
  styleUrls: ['./uzisha.page.scss'],
})
export class UzishaPage implements OnInit {
  keyword:string='';
  showsearch_input=false;
  actualuser:Users={};
  menu:Menu[]= [];
  submenu = [];
  results :any[]=[];
  showmenutext=true;
  constructor(
    private authserv:AuthentificationService,
    public appserv : AppservicesService,
    public route: Router,
    private menuctrl : MenuController) {
    
   }


  ngOnInit() {}

  openmenu(){
    this.menuctrl.open('first-menu');
  }

  async gotoOthersmenu(){
    const modal = await this.appserv.modalCtrl.create({
      component:OthersmenumobileComponent,
      cssClass:'modal-border-radius-20',
      initialBreakpoint:0.75,
      breakpoints:[0.50,0.75,0.80,1]
    });
    modal.present();
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
    
  async fencing(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewfenceComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
  }

  goToo(){
    this.route.navigateByUrl('stock');
  }

  async changemodeOffandOn(){
    if(this.appserv.isMyDeviceConnected()===true){
      this.appserv.ChangeConnectivity(false);
    }else{
      this.appserv.ChangeConnectivity(true);
    }
  }

  async showcerouzishainfos(){
    const modal = await this.appserv.modalCtrl.create({
      component:IntroPage,
      componentProps:{'isModal':true},
      cssClass:'modal-border-radius-20',
      initialBreakpoint:1,
      breakpoints:[0.50,0.75,0.80,1]
    });
    modal.present();
  }

  async presenteFencePage(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewfenceComponent,
      componentProps:{'isModal':true},
      cssClass:'modal-border-radius-20',
      initialBreakpoint:1,
      breakpoints:[0.50,0.75,0.80,1]
    });
    modal.present();
  }

  async shownotificationcenter(){
    const modal = await this.appserv.modalCtrl.create({
      component:NotificationsComponent,
      componentProps:{'isModal':true},
      cssClass:'modal-border-radius-20',
      initialBreakpoint:1,
      breakpoints:[0.50,0.75,0.80,1]
    });
    modal.present();
  }

  async showsettingspage(){
    const modal = await this.appserv.modalCtrl.create({
      component:SettingsPage,
      componentProps:{'isModal':true},
      cssClass:'modal-border-radius-20',
      initialBreakpoint:1,
      breakpoints:[0.50,0.75,0.80,1]
    });
    modal.present();
  }
  async gotouserprofil(){
    const modal = await this.appserv.modalCtrl.create({
      component:InfosagentComponent,
      componentProps:{'actualuser':this.appserv.getactualuser()},
      cssClass:'modal-border-radius-20',
      initialBreakpoint:0.50,
      breakpoints:[0.50,0.75,0.80,1]
    });
    modal.present();
  }
}
