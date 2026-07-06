import { Component, OnInit,Input } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { CustomersService } from '../../services/customers.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { Customers } from '../../interfaces/customers';
import { Bonus } from '../../interfaces/bonus';

@Component({
  selector: 'app-bonusclient',
  templateUrl: './bonusclient.component.html',
  styleUrls: ['./bonusclient.component.scss'],
})
export class BonusclientComponent implements OnInit {

  @Input() customersent: Customers={};
  listbonus:Bonus[]=[];
  showprogress=false;
  generalsold=0;
  defaultmoney=this.appserv.getDefaultmoney();
  constructor(public appserv: AppservicesService, public customerserv: CustomersService, public invoiceserv: InvoiceService) { }

  ngOnInit() {
    this.getlistbonus(this.customersent);
  }

  async getdatesfilter(){
    this.appserv.getdatesfilter();
  }

  async getlistbonus(customer: Customers){
    this.showprogress=true;
    this.customerserv.bonusforacustomer(customer).subscribe(
      data=>{
        this.showprogress=false;
        this.listbonus=data;
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de récupérer la liste des bonus du client`,'danger');
      });
  }

  printlist(){}
}
