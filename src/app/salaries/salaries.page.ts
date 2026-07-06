import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { NewposteComponent } from '../newposte/newposte.component';
import { NewpositionComponent } from '../newposition/newposition.component';
import { SalariesService } from '../services/salaries.service';
import { EditsalaryComponent } from '../editsalary/editsalary.component';
import { SalaryadvancesComponent } from '../salaryadvances/salaryadvances.component';
import { PayslipsComponent } from '../payslips/payslips.component';
import { Users } from '../interfaces/users';
import { helper } from 'echarts';

@Component({
  selector: 'app-salaries',
  templateUrl: './salaries.page.html',
  styleUrls: ['./salaries.page.scss'],
})
export class SalariesPage implements OnInit {
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

  async deleteemployee(agent){
    const alert  = await this.appserv.alertctrl.create({
      header:"Validation suppression",
      message:`Validez-vous cette opération?`,
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:async()=> {
            const load = await this.appserv.loadctrl.create({
              message:"Suppression en cours...",
              mode:'ios',
              translucent:true
            });
            load.present();
            this.salaryserv.deletesalary({id:agent.id}).subscribe(
              response=>{
                load.dismiss();
                if (response.message==="success" && response.status===200 && response.data) {
                  this.appserv.presentToast("Employé supprimé de la liste des agents salariés avec succès!","success");
                  this.ngOnInit();
                }
                console.log('deleting salary',response);
              },
              error=>{
                load.dismiss();
                console.log('deleting salary',error);
              });
        },}
      ]
    });
    alert.present();
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
    this.salaryserv.employeeslist({user_id:this.appserv.actualUser.id}).subscribe(
      response=>{
        console.log('salaries',response);
        if (response.message==="success" && response.status===200) {
          this.agentslist=response.data;
        }
        
        if (response.message==="error" && response.status===400) {
          this.appserv.presentToast("Une erreur est survenue lors de la récupération de la liste des employés!","warning");
        }
      },error=>{
        this.appserv.presentToast("Impossible de récupérer la liste des employés.","danger");
      });
  }
}
