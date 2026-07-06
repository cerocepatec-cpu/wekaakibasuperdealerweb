import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { DebtsService } from 'src/app/services/debts.service';

@Component({
  selector: 'app-infosdebt',
  templateUrl: './infosdebt.component.html',
  styleUrls: ['./infosdebt.component.scss'],
})
export class InfosdebtComponent implements OnInit {
@Input() debtsent:any;
showprogress=false;
keyword:any;
total=0;

constructor(public appserv:AppservicesService, private debtserv: DebtsService) { }

  ngOnInit() {
    this.getdebtdetails();
  }

  getdebtdetails(){
    this.showprogress=true;
    this.debtserv.getpayments({debt_id:this.debtsent.debt.id}).subscribe(
      data=>{
        this.showprogress=false;
        this.debtsent.payments=data;
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast('Impossible de communiquer avec le serveur','warning');
      });
      this.debtsent.payments.forEach(element => {
        this.total=this.total+element.amount_payed;
    });
  }
}
