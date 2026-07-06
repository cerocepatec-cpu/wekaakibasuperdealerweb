import { InfoservantComponent } from './infoservant/infoservant.component';
import { NewservantComponent } from './newservant/newservant.component';
import { Component, OnInit } from '@angular/core';
import { Servant } from '../interfaces/servants';
import { AppservicesService } from '../services/appservices.service';
import { ServantsService } from '../services/servants.service';

@Component({
  selector: 'app-servants',
  templateUrl: './servants.page.html',
  styleUrls: ['./servants.page.scss'],
})
export class ServantsPage implements OnInit {
  showcheckbox=false;
  showprogress=false;
  listselectedservants:Servant[]=[];
  listservants:Servant[]=[];
  keyword:any;

  constructor(public appserv: AppservicesService, private servantserv: ServantsService) { }

  ngOnInit() {
    this.getall();
  }

  async servantmenu(servant : Servant){

    if(this.showcheckbox){
      const ifexists = this.listselectedservants.indexOf(servant);
      if(ifexists==-1){
        this.listselectedservants.push(servant);
      }else{
        this.listselectedservants=this.listselectedservants.filter(r=>r!=servant);
      }
    }else{
      let menubuttons = [
        {
          text: 'Annuler',
        role:'cancel'
        },
        {
          text: 'Infos',
          handler: () => {
            this.detailservant(servant);
          }
        }
      ]
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('serveurs', 'edit'), {
        text: 'Modifier',
        handler: () => {
          this.editservant(servant);
        }
      })
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('serveurs', 'delete'), {
        text: 'Supprimer',
        handler: () => {
          this.deleteservant(servant);
        }
      })

      const menu = await this.appserv.actionsheetctrl.create(
        {
          header: `${servant.name}`,
          cssClass: 'myactionsheet',
          translucent: true,
          mode: 'ios',
          buttons: menubuttons
        }
      );

      (await menu).present();
    }
  }

  async detailservant(servant: Servant){
    const modal = await this.appserv.modalCtrl.create({
      component:InfoservantComponent,
      componentProps:{'servantsent':servant},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='deleted'){
      this.listservants=this.listservants.filter(s=>s!=servant);
    }
  }

  async editservant(servant: Servant){
    this.servantserv.editservant(servant);
  }

  async deleteservant(servant: Servant){

    const alert = await this.appserv.alertctrl.create({
      header:'Suppression',
      subHeader:`${servant.name}`,
      mode:'ios',
      translucent:true,
      message:`Voulez-vous vraiment supprimer ce serveur? `,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.showprogress=true;
          this.servantserv.deleteoneservant(servant).subscribe(
            (data:any)=>{
              this.showprogress=false;
              if(data>0){
                this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
                this.listservants=this.listservants.filter(a=>a!=servant);
              }else{
                this.appserv.presentToast(`Opération echouée. Véuillez réssayer.`,'warning');
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

  getall(){
    this.showprogress=true;
    if (this.appserv.isMyDeviceConnected()) {
      this.servantserv.getall(this.appserv.getactualuser().enterprise_id).subscribe(
        data=>{
          this.showprogress=false;
          this.listservants=data;
          this.servantserv.setofflinedata(data);
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast("Une erreur est survenue lors de la récupération des serveurs.","warning");
        });
    } else {
      this.showprogress=false;
      this.listservants=this.servantserv.getofflinedata();
    }
  }

  async newservant(){
   const modal = await this.appserv.modalCtrl.create({
      component:NewservantComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
      this.listservants.unshift(data);
    }
  }

  async multipledelete(){

    const alert = await this.appserv.alertctrl.create({
      header:'Suppression multiple',
      mode:'ios',
      message:`Voulez-vous supprimer ${this.listselectedservants.length>1?'ces':'ce'} ${this.listselectedservants.length>1?this.listselectedservants.length:''} ${this.listselectedservants.length>1?'serveurs':'serveur'}? `,
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.listselectedservants.forEach(serv => {
            this.showprogress=true;
            this.servantserv.deleteoneservant(serv).subscribe(
              data=>{
                this.showprogress=false;
                if(data>=1){
                  this.listselectedservants=this.listselectedservants.filter(a=>a!=serv);

                  this.listservants=this.listservants.filter(a=>a!=serv);
                  if(this.listselectedservants.length==0){
                    this.showcheckbox=false;
                    this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
                  }
                }else{
                  this.appserv.presentToast(`Opération  echouée:`,'warning');
                }
              },
              error=>{
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
}
