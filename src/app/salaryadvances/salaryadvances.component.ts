import { Component, OnInit,Input } from '@angular/core';
import { Users } from '../interfaces/users';
import { AppservicesService } from '../services/appservices.service';
import { NewadvancesalaryComponent } from '../newadvancesalary/newadvancesalary.component';
import { SalariesService } from '../services/salaries.service';

@Component({
  selector: 'app-salaryadvances',
  templateUrl: './salaryadvances.component.html',
  styleUrls: ['./salaryadvances.component.scss'],
})
export class SalaryadvancesComponent implements OnInit {
@Input() agentsent:any={};
salariesadvanceslist:any[]=[];
loaded=false;
from=this.appserv.defaultdate();
to=this.appserv.defaultdate();
search="";
  constructor(public appserv: AppservicesService, private salaryserv: SalariesService) { }

  ngOnInit() {
    console.log('user sent',this.agentsent);
    this.listadvancesalaries();
  }

  handletransactionchange($event,transaction){}
  async menutransaction(transaction:any){
    const menu = await this.appserv.actionsheetctrl.create(
      {
        header:`${transaction.member_fullname}(${transaction.amount} ${transaction.abreviation})`,
        translucent:true,
        mode:'ios',
        buttons:[
          {text:'Abandonner',role:'cancel'},
          {text:'Activer',handler:()=> {
              
          },},
          {text:'Modifier',handler:()=> {
              this.updateadvance(transaction);
          },},  
          {text:'Annuler',handler:()=> {
              
          },},
          {text:'Imprimer',handler:()=> {
              
          },},
        ]
      }
    );
    menu.present();
  }

  listadvancesalaries(){
    this.loaded=true;
    this.salaryserv.advancesbyagent({agent_id:this.agentsent.agent_id,from:this.from,to:this.to}).subscribe(
      response=>{
        this.loaded=false;
        this.salariesadvanceslist=response;
        console.log('avances salaires',response);
      },error=>{
        this.loaded=false;
        console.log('avances error',error);
      });
  }

  async newadvance(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewadvancesalaryComponent,
      cssClass:"modal-border-radius-20",
      componentProps:{agentsent:this.agentsent}
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="added") {
      this.salariesadvanceslist.unshift(data);
    }
  }  
  
  async updateadvance(advance:any){
    const modal = await this.appserv.modalCtrl.create({
      component:NewadvancesalaryComponent,
      cssClass:"modal-border-radius-20",
      componentProps:{agentsent:this.agentsent,advancesent:advance}
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="updated") {
        advance.amount=data.amount;
        advance.description=data.description;
        advance.money_id=data.money_id;
        advance.done_at=data.done_at;
        advance.status=data.status;
        advance.abreviation=data.abreviation;
        advance.money_name=data.money_name;
    }
  }

  async dashboardperiodfilter(){
    const period = await  this.periodicfilter();
    this.from=period.from;
    this.to=period.to;
    if (this.from && this.to) {
      this.listadvancesalaries();
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

}
