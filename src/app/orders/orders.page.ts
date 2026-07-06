import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { Orders } from '../interfaces/orders';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../interfaces/invoices';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  showcheckbox=false;
  showprogress=false;
  listselectedorders:Invoice[]=[];
  listsorders:Invoice[]=[];
  keyword:any;

  constructor(public appserv: AppservicesService, private invoiceserv: InvoiceService) { }

  ngOnInit() {
    this.getlist();
  }

  async neworder(){

  }
  
  getlist(){
    this.showprogress=true;
    this.invoiceserv.ordersforenterprise(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.showprogress=false;
        this.listsorders=data;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de charger l'historique des commandes`,'danger');
      }
    )
  }
  multipledelete(){}

  ordermenu(order: Orders){}
}
