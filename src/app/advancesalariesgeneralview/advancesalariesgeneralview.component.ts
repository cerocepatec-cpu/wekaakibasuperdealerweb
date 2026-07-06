import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { Users } from '../interfaces/users';
import { SalariesService } from '../services/salaries.service';
import { EmployeespickerComponent } from '../employeespicker/employeespicker.component';

@Component({
  selector: 'app-advancesalariesgeneralview',
  templateUrl: './advancesalariesgeneralview.component.html',
  styleUrls: ['./advancesalariesgeneralview.component.scss'],
})
export class AdvancesalariesgeneralviewComponent implements OnInit {
  showprogress=false;
  nbradvancestovalidate=0;
  nbradvancesvalidated=0;
  nbradvancescancelled=0;
  advancesalarieslist:any[]=[];
  keptadvancesalarieslist:any[]=[];
  selectedadvancesalarieslist:any[]=[];
  from=this.appserv.defaultdate();
  to=this.appserv.defaultdate();
  selectedmembers:any[]=[];
  search:any;
  buttonselectalltransactions=false;
  loaded=false;
  constructor(public appserv:AppservicesService,private salaryserv:SalariesService) { }

  ngOnInit() {
    this.listadvancesalaries();
  }

  handleRefresh($event){}

  async agentsfilter(){
    const modal = await this.appserv.modalCtrl.create({
      component:EmployeespickerComponent,
      componentProps:{"criteria":"multiple"},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="selected") {
      this.selectedmembers=data;
      this.listadvancesalaries();
    }
  }

  handletypechanged($event){
    this.advancesalarieslist=this.keptadvancesalarieslist.filter(a=>a.status===$event.detail.value);
  }

  handleselectedadvanceschanged($event){
    if (this.selectedadvancesalarieslist.length>0) {
      switch ($event.detail.value) {
        case "validated":
          this.updatemultipleadvances($event.detail.value);
          break; 
        case "pending":
          this.updatemultipleadvances($event.detail.value);
          break; 
        case "cancelled":
          this.updatemultipleadvances($event.detail.value);
          break;
      
        default:
          break;
      }
    }else{
      this.appserv.presentToast("Vous devez au moins sélectionner une avance sur salaire!","warning");
    }
 
    console.log($event);
  }

  async updatemultipleadvances(criteria:string){
    const load = await this.appserv.loadctrl.create({
      message:"Opération en cours...",
      mode:'ios',
      translucent:true,
      spinner:'circles'
    });
    load.present();
    this.salaryserv.updateadvancesalary({mode:"multiple",advances:this.selectedadvancesalarieslist,done_by:this.appserv.actualUser.id,criteria:criteria}).subscribe(
      response=>{
        load.dismiss();
        if (response.message==="success" && response.status===200) {
          this.appserv.presentToast(`${response.updated.length} avances ont été ${criteria==="validated"?"validées":criteria==="pending"?"mises en attente":criteria==="cancelled"?" annulées":""} et ${response.failed.length} ont échoué!`,"secondary");
          this.buttonselectalltransactions=false;
          this.ngOnInit();
        }
        console.log(response);
      },error=>{
        console.log(error);
        load.dismiss();
      });
  }

  handleadvancechange($event,transaction){}
  menudavance(transaction){}

  handletransactionchange($event,transaction:any){
    if ($event.detail.checked) {
      transaction.selected=true;
      this.selectedadvancesalarieslist.push(transaction);
      
    }else{
      transaction.selected=false;
      this.selectedadvancesalarieslist=this.selectedadvancesalarieslist.filter(t=>t!==transaction);
      this.buttonselectalltransactions=false;
    }
  
    if (this.selectedadvancesalarieslist.length===this.advancesalarieslist.length) {
      this.buttonselectalltransactions=true;
    }else{
      this.buttonselectalltransactions=false;
    }
  }

  selectalltransactions($event){
    if ($event.detail.checked) {
      this.advancesalarieslist.map((transaction)=>{
        transaction.selected=true;
      });
      this.selectedadvancesalarieslist=this.advancesalarieslist;
    }else{
      this.selectedadvancesalarieslist=[];
      this.advancesalarieslist.map((transaction)=>{
        transaction.selected=false;
      });
    }
    // console.log($event); 
  }

  listadvancesalaries(){
    this.loaded=true;
    let members=[];
    if (this.selectedmembers.length>0) {
      this.selectedmembers.forEach(agent => {
        members.push(agent.agent_id);
      });
      console.log('selected agents',members);
    }
    this.salaryserv.advancesbyagent({agent_id:this.appserv.actualUser.id,from:this.from,to:this.to,agents:members}).subscribe(
      response=>{
        this.loaded=false;
        this.advancesalarieslist=response;
        this.keptadvancesalarieslist=response;
        console.log('avances salaires',response);
        this.selectedadvancesalarieslist=[];
        this.updatenumbers();
      },error=>{
        this.loaded=false;
        console.log('avances error',error);
      });
  }

  updatenumbers(){
    this.nbradvancescancelled=this.advancesalarieslist.filter(a=>a.status==="cancelled").length;
    this.nbradvancestovalidate=this.advancesalarieslist.filter(a=>a.status==="pending").length;
    this.nbradvancesvalidated=this.advancesalarieslist.filter(a=>a.status==="validated").length;
  }

  restoredata(){
    this.advancesalarieslist=this.keptadvancesalarieslist;
    this.selectedmembers=[];
    this.advancesalarieslist.forEach(element => {
      element.selected=false;
    });
    this.selectedadvancesalarieslist=[];
  }

  filteradvances(status:string){
    this.advancesalarieslist=this.keptadvancesalarieslist.filter(a=>a.status===status);
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
