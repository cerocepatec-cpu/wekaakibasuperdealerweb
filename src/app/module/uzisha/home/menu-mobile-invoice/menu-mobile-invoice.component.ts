import { Component, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-menu-mobile-invoice',
  templateUrl: './menu-mobile-invoice.component.html',
  styleUrls: ['./menu-mobile-invoice.component.scss'],
})
export class MenuMobileInvoiceComponent implements OnInit {
items =[
  {text:'Dépôt',icon:'document-outline',value:'deposit'},
  {text:'Nouveau produit',icon:'text-outline',value:'product'},
  {text:"Entrée d'argent",icon:'add-circle-outline',value:'entry'},
  {text:'Dépenses',icon:'cash-outline',value:'expenditure'},
  {text:'Dettes',icon:'stats-chart-outline',value:'debt'},
  {text:'Mes ventes',icon:'cart-outline',value:'sells'},
  {text:'Clôturer',icon:'power',value:'fence'}];

  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

  select(item){
    this.appserv.modalCtrl.dismiss(item,'selected');
  }

}
