import { BluetoothdevicesComponent } from './../tab3/bluetoothdevices/bluetoothdevices.component';
import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { Router } from '@angular/router';
import { Menu } from '../interfaces/menu';
import { InfosagentComponent } from '../agents/infosagent/infosagent.component';
import { AuthentificationService } from '../services/authentification.service';
import { SyncingService } from '../services/syncing.service';
import { PosSettingsComponent } from '../pos-settings/pos-settings.component';
import { ArticlesService } from '../services/articles.service';
import { ProviderpasswordComponent } from './providerpassword/providerpassword.component';
import { CustomersLoyaltyComponent } from './customers-loyalty/customers-loyalty.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
@Input() isModal:boolean;
showprogress=false;
seachinput:any;
actualuser:any;
imgUrl=this.appserv.imgUrl;
menus:Menu[]=[];
keptmenus :Menu[]=[
  {router:'/articles/services-categories',title:'Catégories',imgSrc:'',icon:'grid',avatar_class:'square-avatar-warning'},
  {router:'/articles/uom',title:'Unités de mesure',imgSrc:'',icon:'git-network',avatar_class:'square-avatar-secondary'},
  {router:'/articles',title:'Articles/Services',imgSrc:'',icon:'create',avatar_class:'square-avatar-danger'},
  {router:'/articles/customers-categories',title:'Catégories client',imgSrc:'',icon:'people',avatar_class:'square-avatar-danger'},
  {router:'/customers',title:'Clients',imgSrc:'',icon:'people',avatar_class:'square-avatar-primary'},
  {router:'/stock/deposits',title:'Dépôts',imgSrc:'',icon:'storefront',avatar_class:'square-avatar-success'},
  {router:'/stock/story',title:'Mouvements Stock (Entrées/Sorties)',imgSrc:'',icon:'swap-vertical',avatar_class:'square-avatar-warning'},
  {router:'/finances/invoices',title:'Factures',imgSrc:'',icon:'swap-horizontal',avatar_class:'square-avatar-primary'},
  {router:'/finances/expenditures',title:'Dépenses',imgSrc:'',icon:'swap-horizontal',avatar_class:'square-avatar-primary'},
  {router:'/fences',title:'Clôtures',imgSrc:'',icon:'power',avatar_class:'square-avatar-warning'},
  {router:'/printers',title:'Imprimantes',imgSrc:'',icon:'print-outline',avatar_class:'square-avatar-primary'}
];
  constructor(private syncingServ: SyncingService, private router: Router,private authService:AuthentificationService, public appserv: AppservicesService, private articleServ: ArticlesService) {}
  
  ngOnInit(): void {
      this.getconnecteduser();
  }

    ionViewDidEnter(){
     
    }

    SyncingDataLength(){
      let length = this.syncingServ.getSyncingOffLinePayments().length + this.syncingServ.getSyncingOffLineDebts().length + this.syncingServ.getSyncingOffLineStockHistories().length + this.syncingServ.getSyncingOffLineInvoices().length + this.syncingServ.getSyncingCustomers().length + this.syncingServ.getSyncingExpenditures().length + this.syncingServ.getSyncingEntries().length;
      return length;
    }
  
    async updatealltvalines(data:boolean){
      const alert = await this.appserv.alertctrl.create({
        header:"Modification application TVA",
        // subHeader:`${{data===true?'Activation':'Désactivation'}}`,
        message:" Confirmez-Vous cette action?",
        mode:'ios',
        translucent:true,
        buttons:[
          {text:"Non",role:'cancel'},
          {text:"Oui",handler:async ()=>{
             this.articleServ.updateallproducts({user_id:this.appserv.actualUser.id,criteria:'set_tva',value:data}).subscribe(
              response=>{
                if (response) {
                  console.log(response);
                  this.appserv.presentToast("La mise à jour s'est terminée avec succès.","success");
                }
              },error=>{
                this.appserv.presentToast("Une erreur est survenue. Veuillez réessayer plus tard.","danger");
              });
          }}
        ]
      });
      alert.present();
    }

    async gotocustomersloyalty(){
      this.appserv.modalCtrl.dismiss();
      const modal = await this.appserv.modalCtrl.create({
        component:CustomersLoyaltyComponent,
        cssClass:'modal-border-radius-20'
      });
      modal.present();
    }

  async gotoposSettings(){
    this.appserv.modalCtrl.dismiss();
      const modal = await this.appserv.modalCtrl.create({
        component:PosSettingsComponent,
        cssClass:'modal-border-radius-20'
      });
      modal.present();
      const {data,role} = await modal.onWillDismiss();
  }

  getconnecteduser(){
    this.actualuser=this.appserv.getactualuser();
  }

  async disconect(){
    localStorage.removeItem('actualUser');
    localStorage.removeItem('actualEnterprise');
    localStorage.removeItem('TOKEN_KEY');
    localStorage.removeItem('permission');
    this.router.navigateByUrl('/logout');
    if (this.isModal) {
      this.appserv.modalCtrl.dismiss();
    }
  }

  async gotobluetoothpage(){
    
    const modal = await this.appserv.modalCtrl.create({
      component:BluetoothdevicesComponent
    });
    modal.present();
  }

  async searchmenu(event: any){
    const key = event.target.value.toLowerCase();
    if(key){
      this.menus=this.keptmenus.filter((k)=>k.title.toLowerCase().indexOf(key) > -1);
    }else{
      this.menus=[];
    }
  }

  async closemodal(link?:string){
    if(link){
      this.appserv.closemodal();
      this.router.navigateByUrl(`${link}`)
    }else{
      this.appserv.closemodal();
    }
  }

  async gotoinfosagent(){

    const modal = await this.appserv.modalCtrl.create({
      component:InfosagentComponent,
      componentProps:{'actualuser':this.appserv.getactualuser()},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async shareapp(){
    this.appserv.sharedata('Cero apps share',`Partager l'application avec ceux qui vous sont chers et rendez leur vie facile grâce à la solution CERO UZISHA`,'https://e-zezo.com');
  }

  async resetproducts(){
    const alert = await this.appserv.alertctrl.create({
      header:"Réinitialisation base de produits",
      subHeader:"Action non reversible",
      message:"Attention! Attention ! Attention!. Vous êtes sur le point de supprimer tous vos articles. Notez que cette action est irreversible et peut engendrer des conséquences sur vos mouvements des stocks, vos factures, etc. Voulez-vous toujours continuer?",
      mode:'ios',
      translucent:true,
      buttons:[
        {text:"Non",role:'cancel'},
        {text:"Oui",handler:async ()=>{
            const modal = await this.appserv.modalCtrl.create({
              component:ProviderpasswordComponent,
              cssClass:"modal-border-radius-20 modal-300-width"
            });
            modal.present();
            const {data,role} = await modal.onWillDismiss();
            if (role==="verified") {
              this.resetallfromapi();
            }
        }}
      ]
    });
    alert.present();
  }

  async resetallfromapi(){
    const loader = await this.appserv.loadctrl.create({
      message:"Suppression en cours...",
      mode:"ios",
      translucent:true,
      spinner:"circular"
    });
    loader.present()
    
    this.articleServ.deleteallservices({enterprise_id:this.appserv.actualEse.id}).subscribe(
      data=>{
        loader.dismiss();
        if (data.deleted_counter==data.all) {
          this.appserv.presentToast(`Tous les articles ont été supprimés`,'success');
        }
        
        if(data.deleted_counter!=data.all){
          this.appserv.presentToast(`${data.deleted_counter} articles sur ${data.all} ont été supprimés`,'success');
        } 
        
        if(data.all===0){
          this.appserv.presentToast(`Liste vide. Rien à supprimer.`,'success');
        } 
        this.articleServ.resetofflinedata();       
      },
      error=>{
        loader.dismiss();
        this.appserv.presentToast('Impossible de supprimer les articles. Veuillez réessayer ou contacter votre administrateur','warning');
      });
  }
}
