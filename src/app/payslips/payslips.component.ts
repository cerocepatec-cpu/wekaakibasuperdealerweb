import { Component, Input, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';

@Component({
  selector: 'app-payslips',
  templateUrl: './payslips.component.html',
  styleUrls: ['./payslips.component.scss'],
})
export class PayslipsComponent implements OnInit {
  @Input() agentsent:any={};
  from=this.appserv.defaultdate();
  to=this.appserv.defaultdate();
  loaded=false;
  constructor(public appserv:AppservicesService) { }

  ngOnInit() {}

  async dashboardperiodfilter(){
    const period = await  this.periodicfilter();
    this.from=period.from;
    this.to=period.to;
    if (this.from && this.to) {
      
    }
  }

  async periodicfilter(){
    let dateFrom="";
    let dateTo="";
    const modal = await this.appserv.periodicfilter();
    modal.present(); 
  
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      dateFrom=data.from;
      dateTo=data.to;
    }
    return {from:dateFrom,to:dateTo};
  }

  printreport(){}
}
