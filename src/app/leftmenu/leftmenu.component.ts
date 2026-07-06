import { Component, OnInit } from '@angular/core';
import { Users } from '../interfaces/users';
import { Menu } from '../interfaces/menu';
import { AppservicesService } from '../services/appservices.service';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.scss'],
})
export class LeftmenuComponent implements OnInit {
  showmenutext=true;
  showsearch_input=false;
  actualuser:Users={};
  public results :any[]=[];
  public menu:Menu[]=[
    {router:'/home',title:'Accueil',imgSrc:'',icon:'home-outline',avatar_class:''},
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
  constructor(public appserv: AppservicesService) { 
   
  }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    this.results=this.menu;
  }

}
