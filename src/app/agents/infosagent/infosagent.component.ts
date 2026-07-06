import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { EditagentComponent } from '../editagent/editagent.component';
import { Users } from 'src/app/interfaces/users';
import { SecurityComponent } from '../security/security.component';
import { ChangepermissionsComponent } from '../changepermissions/changepermissions.component';
import { UsersService } from 'src/app/services/users.service';
import { MembersaccountsComponent } from 'src/app/membersaccounts/membersaccounts.component';
import { NewagentComponent } from '../newagent/newagent.component';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { ChangePinComponent } from 'src/app/changepin/changepin.component';

@Component({
  selector: 'app-infosagent',
  templateUrl: './infosagent.component.html',
  styleUrls: ['./infosagent.component.scss'],
})
export class InfosagentComponent implements OnInit {
@Input() actualuser:Users={};
defaultavatar='';
showsecurityprogress=false;
showpermissionprogress=false;
criteriaData:string;
  constructor(public appserv: AppservicesService, private Userserv: UsersService,private authserv:AuthentificationService) { }

  ngOnInit() {}

  @HostListener('window:keydown', ['$event'])
  async handleKeyDown(event: KeyboardEvent) {
    const topModal = await this.appserv.modalCtrl.getTop();
    const topAlert = await this.appserv.alertctrl.getTop();

    if (topModal && topModal.component !== this.constructor) {
      return;
    }
  
    if (topAlert && !topAlert.classList.contains('alert-transaction-validation')) {
      return;
    }
  
    if (topAlert && topAlert.classList.contains('alert-transaction-validation')) {
      if (event.key === 'Enter') {
        const yesButton = topAlert.querySelector('.alert-button:nth-child(2)') as HTMLElement;
        yesButton?.click();
      } else if (event.key === 'Escape') {
        const cancelButton = topAlert.querySelector('.alert-button:nth-child(1)') as HTMLElement;
        cancelButton?.click();
      }
      return; // éviter d’exécuter autre chose
    }
  
    // ✅ Si aucune alerte n’est ouverte, Enter déclenche la validation
    if (!topAlert && event.key === 'Enter') {
      event.preventDefault();
      this.validateUpdate(this.criteriaData);
    }
  }

  async changepin(){
    const modal = await this.appserv.modalCtrl.create({
      component: ChangePinComponent,
      componentProps: { 'usersent':this.actualuser},
      cssClass: 'modal-border-radius-20'
    });
    modal.present();
  }

  async changeaccess(criteria:string){
    this.criteriaData=criteria;
    const pin :any= await this.authserv.callPinModal();
    if (!pin || pin.length<4) {
       this.appserv.presentToast('Aucun ou mauvais Pin fourni svp!', 'warning');
       return;
    }

    const alert = await this.appserv.alertctrl.create({
      header: 'Changement d\'accès',
      message: `Voulez-vous vraiment modifier cet accès?`,
      mode: 'ios',
      cssClass:"alert-transaction-validation",
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Oui',
          handler: () => {
           this.validateUpdate(criteria);
          }
        }
      ]});
    alert.present();
  }
 
  async validateUpdate(criteria:string){
     this.actualuser.loading = true;
    this.Userserv.changeaccess({user:this.actualuser.id,criteria:criteria,value:!this.actualuser[criteria]}).subscribe({
        next:(response) => {
          this.actualuser.loading =false;
        if (response.message==="success" && response.status===200) {
          this.actualuser[criteria]=!this.actualuser[criteria];
          this.appserv.presentToast(`Accès modifié avec succès!`, 'success');
        }else{
          this.appserv.presentToast('Impossible de terminer le traitement. Veuillez réessayer', 'danger');
        }
      },
      error:(error) => {
        this.actualuser.loading = false;
        this.appserv.presentToast('Impossible de terminer le traitement. Veuillez réessayer', 'danger');
      }
    });
  }

  async edituser(user: Users){
    const modal = await this.appserv.modalCtrl.create({
      component:NewagentComponent,
      componentProps:{'userSent':user},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async openeditprofil() {
    this.appserv.closemodal();
    const modal = await this.appserv.modalCtrl.create({
      component: EditagentComponent,
      componentProps: {agentsent: this.appserv.getactualuser()},
      cssClass: 'fullscreen-modal'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'edited') {
      //do what you're supposed to do
    }
  }

  async gotochangepermission(){

    const modal = await this.appserv.modalCtrl.create({
      component: ChangepermissionsComponent,
      componentProps: {usersent: this.actualuser},
      cssClass: 'modal-border-radius-20'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'edited') {
      //do what you're supposed to do
    }
  } 
  
  async gotomembersaccounts(){

    const modal = await this.appserv.modalCtrl.create({
      component: MembersaccountsComponent,
      componentProps: {usersent: this.actualuser},
      cssClass: 'modal-border-radius-20'
    });
    modal.present();
  }

  async gotochangesecurity(){
    const modal = await this.appserv.modalCtrl.create({
      component: SecurityComponent,
      componentProps: { 'usersent':this.actualuser},
      cssClass: 'modal-border-radius-20'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'edited') {
      this.actualuser.user_password=data.user_password;
    }
  }

  async editAgentStatus(user: Users,status:string){
    const pin :any= await this.authserv.callPinModal();
    if (!pin || pin.length<4) {
       this.appserv.presentToast('Aucun ou mauvais Pin fourni svp!', 'warning');
       return;
    }

    if (user.status===status) {
      this.appserv.presentToast('Aucune modification à éffectuer','primary');
    } else {
      user.loading=true;
      let msg =status==='enabled'?'activé':'désactivé';
      this.Userserv.edithagentstatus({user_id:user.id,status:status}).subscribe(
        response =>{
          user.loading=false;
          user.status=response.status;
          this.appserv.presentToast(`Agent ${msg} avec succès!`,'success');
        },
        error=>{
          user.loading=false;
          this.appserv.presentToast('Impossible de terminer le traitement. Veuillez réessayer','danger');
        }); 
    }
  }

 async  activeuser(){
    const ctrl = await this.appserv.alertctrl.create({
      header:'Activation compte',
      message:'Voulez-vous vraiment activer ce compte?',
      mode:'ios',
      buttons:[
        {text:'Annuler',role:'cancel'},
        {text:'Oui',handler:()=>{
          this.editAgentStatus(this.actualuser,'enabled');
        }}
      ]
    });
    ctrl.present();
  }

  async  disactiveuser(){
    const ctrl = await this.appserv.alertctrl.create({
      header:'Désactivation compte',
      message:'Voulez-vous vraiment désactiver ce compte?',
      mode:'ios',
      buttons:[
        {text:'Annuler',role:'cancel'},
        {text:'Oui',handler:()=>{
          this.editAgentStatus(this.actualuser,'disabled');
        }}
      ]
    });

    ctrl.present();
  }
}
