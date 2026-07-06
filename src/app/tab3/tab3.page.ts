import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { Users } from '../interfaces/users';
import { BluetoothdevicesComponent } from './bluetoothdevices/bluetoothdevices.component';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { Menu } from '../interfaces/menu';
import { InfosagentComponent } from '../agents/infosagent/infosagent.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
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
  constructor(private router: Router,private authService:AuthentificationService, public appserv: AppservicesService) {}
  
  ngOnInit(): void {
      this.getconnecteduser();
  }

    ionViewDidEnter(){
     
    }

  getconnecteduser(){
    this.actualuser=this.appserv.getactualuser();
  }

  async disconect(){
    await this.authService.logout();
    this.router.navigateByUrl('/',{replaceUrl:true});
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
      componentProps:{'actualuser':this.appserv.getactualuser()}
    });
    modal.present();
  }

  async shareapp(){
    this.appserv.sharedata('Cero apps share',`Partager l'application avec ceux qui vous sont chers et rendez leur vie facile grâce à la solution CERO UZISHA`,'https://e-zezo.com');
  }
}
