import { Component, OnInit, Input } from '@angular/core';
import { Users } from 'src/app/interfaces/users';
import { PointOfSales } from 'src/app/interfaces/pos';
import { AppservicesService } from 'src/app/services/appservices.service';
import { PosService } from 'src/app/services/pos.service';
import { NewposComponent } from '../newpos/newpos.component';
import { DepositposComponent } from '../depositpos/depositpos.component';
import { UsersposComponent } from '../userspos/userspos.component';
import { UserpickerComponent } from 'src/app/agents/userpicker/userpicker.component';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-infospos',
  templateUrl: './infospos.component.html',
  styleUrls: ['./infospos.component.scss'],
})
export class InfosposComponent implements OnInit {
@Input() posSent: PointOfSales;
showprogress=false;
agents:Users[]=[];
  constructor(public appserv: AppservicesService, private posServ:PosService, private userServ: UsersService) { }

  ngOnInit() {
    this.getlistagents();
  }
  
  async adduser(){
    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{'multiselect':true},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role}= await modal.onWillDismiss();
    if (role==='selected') {
      this.affectUsers(data);
    }
  }

  async affectUsers(list: Users[]){
    const load = await this.appserv.loadctrl.create({
      mode:'ios',
      translucent:true,
      message:'Affectation en cours...',
      spinner:'dots'
    });
    load.present();
    let object =[];
    list.forEach(el => {
      object.push({user_id:el.id,pos_id:this.posSent.id});
    });
    this.posServ.affectUsers({users:object}).subscribe(
      data=>{
        load.dismiss();
        this.agents=this.agents.concat(data);
        this.appserv.presentToast(`Affectation terminée avec succès`,'success');
      },
      error=>{
        load.dismiss();
        this.appserv.presentToast(`Une erreur est survenue lors de l'affectation des agents au POS`,'danger');
      });
  }

  async deleteuser(user: Users){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression agent',
      mode:'ios',
      message:'Voulez-vous vraiment désaffecter cet agent de ce POS?',
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=>{
          this.showprogress=true;
          this.userServ.deleteAgentTopos({user_id:user.id,pos_id:this.posSent.id}).subscribe(
            data=>{
              this.showprogress=false;
              this.appserv.presentToast('Agent rétiré du POS avec succès','success');
              this.agents=this.agents.filter(d=>d!=user);
            },error=>{
              this.showprogress=false;
              this.appserv.presentToast(`Erreur survenue. Nous n'avons pas pû rétirer l'agent`,'danger');
            });
        }}
      ]
    });
    alert.present();
  }
  
  getlistagents(){
    this.showprogress=true;
    this.posServ.getlistagents(this.posSent.id).subscribe(
      data=>{
        this.showprogress=false;
        this.agents=data;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Erreur survenue lors de la recupération de la liste des agents du POS`,'danger');
      });
  }
async gotoedit(){
  const modal = await this.appserv.modalCtrl.create({
    component:NewposComponent,
    componentProps:{'posSent':this.posSent},
    cssClass:'modal-border-radius-20'
  });
  modal.present();
}
async deletepos(posSent: PointOfSales){
  const alert = await this.appserv.alertctrl.create({
    header:"Suppression POS",
    mode:'ios',
    subHeader:posSent.name,
    message:'Voulez-vous vraiment supprimer cet POS?',
    buttons:[
      {text:'Non','role':'cancel'},
      {text:'Oui',handler:()=>{
        this.validatedelete(posSent);
      }}
    ]
  });
  alert.present();
}
async gotodeposits(){
  const modal = await this.appserv.modalCtrl.create({
    component:DepositposComponent,
    componentProps:{'posSent':this.posSent},
    cssClass:'modal-border-radius-20'
  });
  modal.present();
}
async gotousersviewer(){
  const modal = await this.appserv.modalCtrl.create({
    component:UsersposComponent,
    componentProps:{'posSent':this.posSent},
    cssClass:'modal-border-radius-20'
  });
  modal.present();
}

validatedelete(posSent: PointOfSales){
  this.showprogress=true;
  this.posServ.deletepos(posSent).subscribe(
    data=>{
      this.showprogress=false;
      this.appserv.presentToast('POS supprimé avec succès','success');
      this.appserv.modalCtrl.dismiss(posSent,'deleted');
    },
    error=>{
      this.showprogress=false;
      this.appserv.presentToast('Erreur de suppression','danger');
    });
  }

}

