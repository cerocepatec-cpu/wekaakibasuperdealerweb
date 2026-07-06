import { Component, OnInit, Input } from '@angular/core';
import { InfosagentComponent } from 'src/app/agents/infosagent/infosagent.component';
import { UserpickerComponent } from 'src/app/agents/userpicker/userpicker.component';
import { Deposits } from 'src/app/interfaces/deposit';
import { UserDeposit } from 'src/app/interfaces/userDeposit';
import { AppservicesService } from 'src/app/services/appservices.service';
import { DepositsService } from 'src/app/services/deposits.service';

@Component({
  selector: 'app-usersviewer',
  templateUrl: './usersviewer.component.html',
  styleUrls: ['./usersviewer.component.scss'],
})
export class UsersviewerComponent implements OnInit {
@Input() depositsent: Deposits={};
listusers: UserDeposit[]=[];
search:any;
showprogress=false;

constructor(public appserv: AppservicesService,private depositserv: DepositsService ) { }

  ngOnInit() {
    this.getlistusers();
  }

  async pickusers(){

    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{'multiselect':1,'listsent':this.listusers},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      //send users affectation to the API
      this.showprogress=true;
      data.forEach(agent => {
          const object ={deposit_id:this.depositsent.id,user_id:agent.id,level:'simple'};
          this.depositserv.addparticipants(object).subscribe(
            (datasent:any)=>{
              console.log(datasent);
              this.showprogress=false;
              if(datasent=='already'){
                this.appserv.presentToast(`Agent déjà affecté!`,'warnging');
              }else{
                this.listusers.push(datasent);
              }
            },
            error=>{
              console.log(error);
              this.showprogress=false;
                this.appserv.presentToast(`Erreur. L'affectation ne s'est pas terminée avec succès!`,'warning');
            });
      });
      if(data.length===0){
        this.showprogress=false;
        // this.appserv.presentToast(`Affectation terminée!`,'primary');
      }
    }
  }

  async menuparticipant(user: UserDeposit){

    const menu = await this.appserv.actionsheetctrl.create(
      {
        header: `${user.user_name}`,
        cssClass: 'myactionsheet',
        translucent: true,
        mode: 'ios',
        buttons:[
          {text:'Annuler',role:'cancel'},
          {
            text:'Retirer du dépôt',handler:()=>{
              this.deleteparticipant(user);
            }
          },
          {
            text:`${user.level=='simple'?'Nommer chef':'Révoquer les droits du chef'} `,handler:()=>{
              const criteria =user.level=='simple'?'chief':'simple';
              this.updateaffectation(user,criteria);
            }
          }
        ]
      }

    );

    (await menu).present();
  }

  async deleteparticipant(agent:UserDeposit){
    const alert = await this.appserv.alertctrl.create({
      header:`Retirer agent`,
      message:`Voulez-vous vraiment retirer l'agent ${agent.user_name} du dépôt ${this.depositsent.name}?`,
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=>{
          const object ={id:agent.id,deposit_id:agent.deposit_id,user_id:agent.user_id,level:agent.level};
          this.showprogress=true;
          this.depositserv.deleteparticipant(object).subscribe(
            data=>{
              if(data>0){
                this.listusers=this.listusers.filter(a=>a!=agent);
                this.appserv.presentToast(`Agent retiré avec succès!`,'success');
              }else{
                this.appserv.presentToast(`Impossible de retirer l'agent`,'warning');
              }
               this.showprogress=false;
            },
            error=>{
              this.appserv.presentToast(`Erreur. Operation non effectuée!`,'danger');
              this.showprogress=false; 
            });
        }}
      ]
    });
    alert.present();
  } 
  
  async updateaffectation(agent:UserDeposit,criteria: string){
    const object ={id:agent.id,deposit_id:agent.deposit_id,user_id:agent.user_id,level:criteria};
    this.showprogress=true;
    this.depositserv.updateaffectation(object).subscribe(
      data=>{
          if(criteria=='chief'){
            this.listusers.forEach(user => {
              user.level='simple';
            });
          }
          agent.level=data.level;
          this.appserv.presentToast(`Agent modifié avec succès!`,'success');
          this.showprogress=false;
      },
      error=>{
        this.appserv.presentToast(`Erreur. Modification non effectuée!`,'danger');
        this.showprogress=false; 
      });
  }

  async gotoinfosuser(user:UserDeposit){

    const modal = await this.appserv.modalCtrl.create({
      component:InfosagentComponent,
      componentProps:{'actualuser':user}
    });
    modal.present();
  }

  getlistusers(){
    this.showprogress=true;
    const datatosend ={deposit_id:this.depositsent.id};
    this.depositserv.getparticipants(datatosend).subscribe(
      data=>{
        this.showprogress=false;
        this.listusers=data;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de recupérer la liste des participants`,'danger');
      }
    );
  }
}
