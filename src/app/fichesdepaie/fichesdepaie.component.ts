import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { NewposteComponent } from '../newposte/newposte.component';
import { NewpositionComponent } from '../newposition/newposition.component';
import { SalariesService } from '../services/salaries.service';
import { EditsalaryComponent } from '../editsalary/editsalary.component';
import { SalaryadvancesComponent } from '../salaryadvances/salaryadvances.component';
import { PayslipsComponent } from '../payslips/payslips.component';
import { Users } from '../interfaces/users';

@Component({
  selector: 'app-fichesdepaie',
  templateUrl: './fichesdepaie.component.html',
  styleUrls: ['./fichesdepaie.component.scss'],
})
export class FichesdepaieComponent implements OnInit {
  from=this.appserv.defaultdate();
  to=this.appserv.defaultdate();
  showprogress=false;
  agentslist:any[]=[];
  search:any;
  loaded=false;
  positionslist:any[]=[];
    constructor(public appserv:AppservicesService,private salaryserv:SalariesService) { }
  
    ngOnInit() {
      this.employeeslist();
      this.getpositionslist();
    }
  
    handleRefresh($event){}
  
    togglePositionsChange(position){
  
    }
  
    async newsetting(){
      const modal = await this.appserv.modalCtrl.create({
        component:NewposteComponent,
        componentProps:{criteria:"employees"},
        cssClass:"modal-border-radius-20"
      });
      modal.present();
      const {data,role} = await modal.onWillDismiss();
      if (role==="created") {
        this.agentslist=this.agentslist.concat(data);
      } 
    }
  
    async newposition(){
      const modal = await this.appserv.modalCtrl.create({
        component:NewpositionComponent,
        cssClass:"modal-border-radius-20"
      });
      modal.present();
      const {data,role} = await modal.onWillDismiss();
      if (role==="created") {
        this.positionslist.unshift(data);
      } 
    }
  
    async editemployee(agent:any){
      const modal = await this.appserv.modalCtrl.create({
        component:EditsalaryComponent,
        initialBreakpoint:0.50,
        breakpoints:[0.25,0.50],
        componentProps:{agent:agent},
        cssClass:"modal-border-radius-20"
      });
      modal.present();
      const {data,role} = await modal.onWillDismiss();
      if (role==="updated") {
        agent=data;
      } 
    }
  
    handleopenaccordion(agent){
  
    }
  
    async dashboardperiodfilter(){
      const period = await  this.periodicfilter();
      this.from=period.from;
      this.to=period.to;
      if (this.from && this.to) {
        this.employeeslist();
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

    async addsalaryadvance(agent:Users){
      const modal = await this.appserv.modalCtrl.create({
        component:SalaryadvancesComponent,
        componentProps:{agentsent:agent},
        cssClass:"modal-border-radius-20"
      });
      modal.present();
    }
  
    async gotopayslips(agent){
      const modal = await this.appserv.modalCtrl.create({
        component:PayslipsComponent,
        componentProps:{agentsent:agent},
        cssClass:"modal-border-radius-20"
      });
      modal.present();
    }
  
    async getpositionslist(){
      this.salaryserv.getpositionslist({user_id:this.appserv.actualUser.id}).subscribe(
        response=>{
          if (response.message==="success" && response.status===200) {
            this.positionslist=response.data;
          }
          
          if (response.message==="error" && response.status===400) {
            this.appserv.presentToast("Une erreur est survenue lors de la récupération de la liste des postes!","warning");
          }
        },error=>{
          this.appserv.presentToast("Impossible de récupérer la liste des postes.","danger");
        });
    } 
    
    async employeeslist(){
      this.salaryserv.employeespayslips({enterprise_id:this.appserv.getactualEse().id,from:this.from,to:this.to}).subscribe(
        response=>{
          this.agentslist=response;
          console.log('salaries',response);
          // if (response.message==="success" && response.status===200) {
            
          // }
          
          // if (response.message==="error" && response.status===400) {
          //   this.appserv.presentToast("Une erreur est survenue lors de la récupération de la liste des employés!","warning");
          // }
        },error=>{
          this.appserv.presentToast("Impossible de récupérer la liste des employés.","danger");
        });
    }

}
