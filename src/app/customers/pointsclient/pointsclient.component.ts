import { Component, OnInit ,Input } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { CustomersService } from '../../services/customers.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { Customers } from '../../interfaces/customers';
import { Bonus } from '../../interfaces/bonus';
import { Points } from 'src/app/interfaces/points';
@Component({
  selector: 'app-pointsclient',
  templateUrl: './pointsclient.component.html',
  styleUrls: ['./pointsclient.component.scss'],
})
export class PointsclientComponent implements OnInit {

  @Input() customersent: Customers={};
  listpoints: Points[]=[];
  showprogress=false;
  constructor(public appserv: AppservicesService, public customerserv: CustomersService, public invoiceserv: InvoiceService) { }

  ngOnInit() {
    this.getlistpoints(this.customersent);
  }

  async getdatesfilter(){
    this.appserv.getdatesfilter();
  }

  async getlistpoints(customer: Customers){
    this.showprogress=true;
    this.customerserv.pointsforacustomer(customer).subscribe(
      data=>{
        this.showprogress=false;
        this.listpoints=data;
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de récupérer la liste des points du client`,'danger');
      }
    )
  }

}
