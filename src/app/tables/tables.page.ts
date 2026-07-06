import { InfostableComponent } from './infostable/infostable.component';
import { EditComponent } from './edit/edit.component';
import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { Tables } from '../interfaces/tables';
import { NewtableComponent } from './newtable/newtable.component';
import { TableService } from '../services/table.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.page.html',
  styleUrls: ['./tables.page.scss'],
})
export class TablesPage implements OnInit {
  showcheckbox=false;
  showprogress=false;
  listables: Tables[]=[];
  listselectedtables: Tables[]=[];
  keyword:any;
  constructor(public appserv: AppservicesService, private tableserv: TableService) { }

  ngOnInit() {
    this.getlist();
  }

  getlist(){
    if (this.appserv.isMyDeviceConnected()) {
      this.tableserv.getlist(this.appserv.getactualuser().enterprise_id).subscribe(
        data=>{
          this.showprogress=false;
          this.listables=data;
        },
        error=>{
          this.appserv.presentToast("Une erreur est survenue lors de la récupération des tables.","warning");
         
        });
    } else {
      this.listables=this.tableserv.getofflinedata();
    }
    
  }

  async newtable(){

    const modal = await this.appserv.modalCtrl.create(
      {
        component:NewtableComponent,
        cssClass:'modal-border-radius-20'
      });
      modal.present();

      const {data,role} = await modal.onWillDismiss();
      if(role=='added'){
        this.listables.unshift(data);
      }
  }

  async multipledelete(){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression multiple',
      mode:'ios',
      message:`Voulez-vous supprimer ${this.listselectedtables.length>1?'ces':'cette'} ${this.listselectedtables.length>1?this.listselectedtables.length:''} ${this.listselectedtables.length>1?'tables':'table'}? `,
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.listselectedtables.forEach(table => {
            this.showprogress=true;
            this.tableserv.delete(table.id).subscribe(
              data=>{
                this.showprogress=false;
                if(data>=1){
                  this.listselectedtables=this.listselectedtables.filter(a=>a!=table);

                  this.listables=this.listables.filter(a=>a!=table);
                  if(this.listselectedtables.length==0){
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

  async tablemenu(table: Tables){
    if(this.showcheckbox){
      const ifexists = this.listselectedtables.indexOf(table);

      if(ifexists==-1){
        this.listselectedtables.push(table);
      }else{
        this.listselectedtables=this.listselectedtables.filter(r=>r!=table);
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
            this.detailtable(table);
          }
        },
      ];
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('tables', 'edit'), {
        text: 'Modifier',
        handler: () => {
          this.tableserv.calledit(table);
        }
      })
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('tables', 'delete'), {
        text: 'Supprimer',
        handler: () => {
          this.delete(table);
        }
      })
      const menu = await this.appserv.actionsheetctrl.create(
        {
          header: `${table.name}`,
          cssClass: 'myactionsheet',
          translucent: true,
          mode: 'ios',
          buttons: menubuttons
        }
      );
      (await menu).present();
    }
  }


  async detailtable(table: Tables){

    const modal = await this.appserv.modalCtrl.create({
      component:InfostableComponent,
      componentProps:{'tablesent':table}
    });
    modal.present();

    const {data,role} = await modal.onWillDismiss();

    if(role=='deleted'){
      this.listables=this.listables.filter(t=>t!=table);
    }
  }



  async delete(table: Tables){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression',
      subHeader:`${table.name}`,
      message:`Voulez-vous vraiment supprimer cette table?`,
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.showprogress=true;
          this.tableserv.delete(table.id).subscribe(
            data=>{
              this.showprogress=false;
              if(data==1){
                this.appserv.presentToast('Table supprimée avec succès','success');
                this.listables=this.listables.filter(t=>t!=table);
              }
            },
            error=>{
              this.showprogress=false;
              this.appserv.presentToast(`Impossible de supprimer la table`,'danger');
            }
          )

        },}
      ]
    });
    alert.present();
  }
}
