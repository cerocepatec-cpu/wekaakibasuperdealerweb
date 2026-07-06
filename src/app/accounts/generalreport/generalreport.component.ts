import { Component, OnInit,Input } from '@angular/core';
import { Accounts } from 'src/app/interfaces/accounts';
import { AppservicesService } from 'src/app/services/appservices.service';
@Component({
  selector: 'app-generalreport',
  templateUrl: './generalreport.component.html',
  styleUrls: ['./generalreport.component.scss'],
})
export class GeneralreportComponent implements OnInit {

  @Input() accountsent: Accounts={};
 
  totaldebts=0;
  totalcash=0;
  sold=0;
  actualuser=this.appserv.getactualuser();
    constructor(public appserv: AppservicesService) { }
  
    ngOnInit() {}
 

}
