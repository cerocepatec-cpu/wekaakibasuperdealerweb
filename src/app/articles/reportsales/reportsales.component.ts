import { Component, OnInit, Input } from '@angular/core';
import { Articles } from '../../interfaces/articles';
import { AppservicesService } from '../../services/appservices.service';
import { Deposits } from 'src/app/interfaces/deposit';
import { DepositsService } from 'src/app/services/deposits.service';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-reportsales',
  templateUrl: './reportsales.component.html',
  styleUrls: ['./reportsales.component.scss'],
})
export class ReportsalesComponent implements OnInit {
@Input() servicesent: Articles={};
listdeposits:Deposits[]=[];

constructor(public appserv: AppservicesService, private depositserv: DepositsService,private customserv: CustomersService) { }

  ngOnInit() {
    this.getlistdeposits();
  }

  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }
  async pickcustomers(){
    this.customserv.pickallcustomers();
  }

  async depositpicker(){
    this.depositserv.depositpicker();
  }
  async getlistdeposits(){
    // this.listdeposits=this.depositserv.getalldepositslist(this.appserv.getactualuser().enterprise_id);
  }
 
}
