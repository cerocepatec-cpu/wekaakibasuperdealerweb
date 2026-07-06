import { Component, OnInit, ViewChild} from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { IonInput } from '@ionic/angular';
import { FundService } from '../services/funds.service';
import { AuthentificationService } from '../services/authentification.service';
import { ClosurefundComponent } from '../closurefund/closurefund.component';

export interface HomeCardPermission {
  module: string;
  action: string;
}

export interface HomeCardItem {
  name: string;
  router: string;
  icon: string;
  bgClass: string;
  permission?: HomeCardPermission;
}

export interface HomeCardGroup {
  category: string;
  items: HomeCardItem[];
  permission?: HomeCardPermission;
}

@Component({
  selector: 'app-welcomepage',
  templateUrl: './welcomepage.component.html',
  styleUrls: ['./welcomepage.component.scss'],
})
export class WelcomepageComponent implements OnInit {
@ViewChild('defaultinput') defaultinput!:IonInput;
search:any;
balances: any[] = [];
dailyBalance = 12540000; // exemple
loading = false;
error: string | null = null;
results:HomeCardGroup[]=[];
pinCode = '';
pinValidated = false;
lockAnimation = false;
filteredHomeCards : HomeCardGroup[]= [];
private hideTimer: any;

  constructor(public appserv: AppservicesService,private fundserv:FundService,private authserv:AuthentificationService) { }

  ngOnInit() {
   // 🧹 supprime les null
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.takePermissions();
      this.defaultinput.setFocus();
      this.getbalances();
    },500);
  }

takePermissions(){
   this.results=this.appserv.homeCards;
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.filteredHomeCards = this.results
    .map(group => {
      // 🔐 items autorisés
      const allowedItems = group.items.filter(item =>
        !item.permission ||
        this.appserv.permissionFilter(
          item.permission.module,
          item.permission.action
        )
      );

      // 🔍 la catégorie est-elle autorisée ?
      const isCategoryAllowed =
        // 1️⃣ permission catégorie OK
        (group.permission &&
          this.appserv.permissionFilter(
            group.permission.module,
            group.permission.action
          )) ||
        // 2️⃣ pas de permission catégorie MAIS items autorisés
        (!group.permission && allowedItems.length > 0);

      return isCategoryAllowed
        ? { ...group, items: allowedItems }
        : null;
    })
    .filter(Boolean); 
}
async gotoclosure(){
  const modal = await this.appserv.modalCtrl.create({
    component:ClosurefundComponent,
    componentProps:{funds:[]},
    cssClass:"modal-border-radius-20"
  });
  modal.present()
}

 startAutoHideTimer() {
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => this.lockBalances(), 30000);
  }

  /** 🔒 Masque les soldes */
  lockBalances() {
    this.lockAnimation = true;
    setTimeout(() => {
      this.pinValidated = false;
      this.lockAnimation = false;
    }, 600);
  }
  
  /** 👁️ Toggle de la visibilité des soldes */
  toggleBalanceVisibility() {
    if (!this.pinValidated) {
      this.pinVerify();
    } else {
      this.lockBalances();
    }
  }

   /** 🔐 Appelé après validation du PIN */
  async pinVerify() {
    const pin :any= await this.authserv.callPinModal();
    if (!pin || pin.length<4) {
       this.appserv.presentToast('Aucun ou mauvais Pin fourni svp!', 'warning');
       return;
    }
    this.pinValidated = true;
    this.startAutoHideTimer();
  }

  getbalances(){
    this.fundserv.getbalances(this.appserv.getactualuser().id).subscribe({
      next:(res)=>{
        this.balances = res.data;
      },
      error:(err)=>{
        this.appserv.presentToast(err.error,"warning");
      }
    });
  }
}
