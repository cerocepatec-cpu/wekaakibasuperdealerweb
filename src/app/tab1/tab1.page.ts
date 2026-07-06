import { Component, OnInit } from '@angular/core';
import { Users } from '../interfaces/users';
import { AppservicesService } from '../services/appservices.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { Menu } from '../interfaces/menu';
import { ExpiredarticlesComponent } from '../stock/expiredarticles/expiredarticles.component';
import { UnpaidinvoicesComponent } from '../finances/unpaidinvoices/unpaidinvoices.component';
import { ArticlestosupplyComponent } from '../stock/articlestosupply/articlestosupply.component';
import { SubscriptionsComponent } from '../agents/subscriptions/subscriptions.component';
import { EnterpriseinfosComponent } from '../signup/enterpriseinfos/enterpriseinfos.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  keyword:string='';
  showsearch_input=false;
  actualuser:Users={};
  public menu:Menu[]=[
    {router:'/articles',title:'produits',imgSrc:'../../assets/product.png',icon:'',avatar_class:''},
    {router:'/providers',title:'fournisseurs',imgSrc:'../../assets/customer2.png',icon:'',avatar_class:''},
    {router:'/stock',title:'stock',imgSrc:'../../assets/stock3.jpeg',icon:'',avatar_class:''},
    {router:'/tables',title:'tables',imgSrc:'../../assets/table.png',icon:'',avatar_class:''},
    {router:'/servants',title:'serveurs',imgSrc:'../../assets/servant.png',icon:'',avatar_class:''},
    {router:'/orders',title:'commandes',imgSrc:'../../assets/order.png',icon:'',avatar_class:''},
    {router:'/finances/invoices',title:'factures',imgSrc:'../../assets/invoice.png',icon:'',avatar_class:''},
    {router:'/finances/expenditures',title:'depenses',imgSrc:'../../assets/expense.png',icon:'',avatar_class:''},
    {router:'/finances/fences',title:'clôtures',imgSrc:'../../assets/expenditure.png',icon:'',avatar_class:''},
    {router:'/accounts',title:'comptes',imgSrc:'../../assets/expenditure.png',icon:'',avatar_class:''},
    {router:'/agents',title:'agents',imgSrc:'',icon:'people-outline',avatar_class:''},
    {router:'/deposits',title:'dépôts',imgSrc:'',icon:'document-outline',avatar_class:''},
    {router:'/tabs/tab3',title:'Configurations',imgSrc:'',icon:'settings-outline',avatar_class:''}
];
public results :any[]=[];

  constructor(public appserv: AppservicesService) {
    // this.appserv.checkInternetConnectivity();
  }

  ngOnInit(){
    this.actualuser=this.appserv.getactualuser();
    this.results=this.menu;
  }

  async gotonotifications(){
    const modal = await this.appserv.modalCtrl.create({
      component:NotificationsComponent
    });

    modal.present();
  }

  async searchmenu(event: any){
    const key = event.target.value.toLowerCase();
    this.results=this.menu.filter((k)=>k.title.toLowerCase().indexOf(key) > -1);
  }

  async setupenterprise(){
    const modal = await this.appserv.modalCtrl.create({
      component:EnterpriseinfosComponent,
      componentProps:{'owner':this.actualuser,'modalincoming':true}
    });
    modal.present();

    const {data,role} = await modal.onWillDismiss();
    if(role=='created'){
      this.actualuser.enterprise_id=data.id;
      localStorage.setItem('actualUser',JSON.stringify(this.actualuser));
    }
  }

  async gotoexpiredarticles(){
    const modal = await this.appserv.modalCtrl.create({
      component:ExpiredarticlesComponent
    });

    modal.present();
  }

  async gotounpaid(){
    const modal = await this.appserv.modalCtrl.create({
      component:UnpaidinvoicesComponent
    });

    modal.present();
  }

  async gotoarticlestosupply(){
    const modal = await this.appserv.modalCtrl.create({
      component:ArticlestosupplyComponent
    });

    modal.present();
  }

  async gotosubscription(){
    const modal = await this.appserv.modalCtrl.create({
      component:SubscriptionsComponent
    });

    modal.present();
  }
}
