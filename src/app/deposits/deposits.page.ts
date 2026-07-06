import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Users } from '../interfaces/users';
import { Deposits } from '../interfaces/deposit';
import { DepositsService } from '../services/deposits.service';
import { EditpositComponent } from './editposit/editposit.component';
import { NewdepositComponent } from './newdeposit/newdeposit.component';
import { InfosepositComponent } from './infoseposit/infoseposit.component';


@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.page.html',
  styleUrls: ['./deposits.page.scss'],
})
export class DepositsPage implements OnInit {
  search: any;
  actualuser:Users={};
  listdeposits: Deposits[]=[];
  keptlistdeposits: Deposits[]=[];
  listselectedDeposits: Deposits[]=[];

  showprogress=false;
  showcheckbox=false;
  users:any[]=[];

  constructor(public appserv: AppservicesService,private modalctrl: ModalController,private actionSheet: ActionSheetController, private depositserv: DepositsService) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    this.getlistdeposits();
  }

  deletingfilter(){
    this.listdeposits=this.keptlistdeposits;
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };

async multipledelete(){
  const alert = await this.appserv.alertctrl.create({
    header:'Suppression multiple',
    mode:'ios',
    message:`Voulez-vous supprimer ce${this.listselectedDeposits.length>1?'s':''} ${this.listselectedDeposits.length} ${this.listselectedDeposits.length>1?'dépôts':'dépôt'} `,
    translucent:true,
    buttons:[
      {text:'Non',role:'cancel'},
      {text:'Oui',handler: async ()=> {
        this.listselectedDeposits.forEach(deposit => {
          this.showprogress=true;
          this.depositserv.deleteone(deposit).subscribe(
            data=>{
              this.showprogress=false;
              if(data>0){
                this.listselectedDeposits=this.listselectedDeposits.filter(a=>a!=deposit);
                this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
                this.listdeposits=this.listdeposits.filter(a=>a!=deposit);
                if(this.listselectedDeposits.length==0){
                  this.showcheckbox=false;
                }
              }else{
                this.appserv.presentToast(`Opération  echouée:`,'warning');
              }
            },
            error=>{
              //console.log(error);
              this.showprogress=false;
              this.appserv.presentToast(`Suppression impossible`,'danger');
            }
          );
        });
      },}
    ]
  });
  alert.present();
}


async editdeposit(deposit : Deposits){
  const modal = await this.appserv.modalCtrl.create({
    component:EditpositComponent,
    componentProps:{'depositsent':deposit},
    cssClass:'modal-border-radius-20'
  });
  modal.present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='edited'){
     deposit.name=data.name;
     deposit.description=data.description;
     deposit.withdrawing_method=data.withdrawing_method;
    }
}

async deletedeposit(deposit: Deposits){
  const alert = await this.appserv.alertctrl.create({
    header:'Suppression',
    subHeader:`${deposit.name}`,
    mode:'ios',
    translucent:true,
    buttons:[
      {text:'Non',role:'cancel'},
      {text:'Oui',handler: async ()=> {
        this.showprogress=true;
        this.depositserv.deleteone(deposit).subscribe(
          data=>{
            this.showprogress=false;
            if(data>0){
              this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
              this.listdeposits=this.listdeposits.filter(a=>a!=deposit);
            }else{
              this.appserv.presentToast(`Opération  echouée:`,'warning');
            }
          },
          error=>{
            this.showprogress=false;
            this.appserv.presentToast(`Suppression impossible`,'danger');
          }
        );
      },}
    ]
  });
  alert.present();
}

async detaildeposit(deposit: Deposits){
  const modal = await this.modalctrl.create(
    {
      component:InfosepositComponent,
      componentProps:{'depositsent':deposit},
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
    if(role=='edited'){
      deposit.name=data.name;
      deposit.description=data.description;
    }

    if(role==='deleted'){
      this.listdeposits=this.listdeposits.filter(de=>de!=deposit);
    }
}


async depositmenu(deposit : Deposits){
  if(this.showcheckbox){
    const ifexists = this.listselectedDeposits.indexOf(deposit);

    if(ifexists==-1){
      this.listselectedDeposits.push(deposit);
    }else{
      this.listselectedDeposits=this.listselectedDeposits.filter(r=>r!=deposit);
    }
  }else{
    let menubuttons=[
      {
        text: 'Annuler',
      role:'cancel'
      },
      {
        text: 'Infos',
        handler: () => {
          this.detaildeposit(deposit);
        }
      }
    ];
    menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('dépôts', 'edit'),
      {
        text: 'Modifier',
        handler: () => {
          this.editdeposit(deposit);
        }
      })
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('dépôts', 'delete'),
      {
        text: 'Supprimer',
        handler: () => {
          this.deletedeposit(deposit);
        }
      })


    const menu = await this.actionSheet.create(
      {
        header: `${deposit.name}`,
        cssClass: 'myactionsheet',
        translucent: true,
        mode: 'ios',
        buttons:menubuttons
      }

    );

    (await menu).present();

  }
}
  async newdeposit(){
    const modal = await this.modalctrl.create(
      {
        component:NewdepositComponent,
        cssClass:'modal-border-radius-20'
      });
      modal.present();

      const {data,role}= await modal.onWillDismiss();
      if(role=='added'){
        this.listdeposits.unshift(data);
      }
  }


  getlistdeposits(){
    this.showprogress=true;
    if (this.appserv.isMyDeviceConnected()) {
      this.depositserv.getalldepositslist(this.actualuser.enterprise_id).subscribe(
        data=>{
          this.showprogress=false;
          this.listdeposits=data;
          this.keptlistdeposits=data;
        },
        error=>{
            this.showprogress=false;
            this.appserv.presentToast("Une erreur est survenue lors du chargement des données.","warning");
        });
    } else {
        this.listdeposits=this.depositserv.getOfflineData();
        this.keptlistdeposits=this.listdeposits;
        this.showprogress=false;
    }
  }

}
