import { Component, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { Role } from '../interfaces/role';
import { RoleService } from '../services/role.service';
import { PermissionsComponent } from '../roles/permissions/permissions.component';
import { EditroleComponent } from './editrole/editrole.component';
import { InfosroleComponent } from './infosrole/infosrole.component';
import { NewroleComponent } from './newrole/newrole.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
})
export class RolesPage implements OnInit {

  showprogress=false;
  keptRoles: Role[]=[];
  listselectedRoles: Role[]=[];
  listRoles: Role[]=[];
  deletedRoles: Role[]=[];
  showcheckbox=false;

  constructor(public appserv: AppservicesService, private Roleserv: RoleService) { }

  ngOnInit() {

  }

  async gotopermissions(){
    const modal = await this.appserv.modalCtrl.create({
      component:PermissionsComponent
    });
    modal.present();
  }

  async menurole(role: Role){

    if(this.showcheckbox){
      const ifexists = this.listselectedRoles.indexOf(role);
      if(ifexists==-1){
        this.listselectedRoles.push(role);
      }else{
        this.listselectedRoles=this.listselectedRoles.filter(r=>r!=role);
      }
    }else{
      const menu = await this.appserv.actionsheetctrl.create(
        {
          header: `${role.name}`,
          cssClass: 'myactionsheet',
          translucent: true,
          mode: 'ios',
          buttons:[
            {
              text: 'Annuler',
            role:'cancel'
            },
            {
              text: 'Infos',
              handler: () => {
                this.detailrole(role);
              }
            },
            {
              text: 'Modifier',
              handler: () => {
                this.editrole(role);
              }
            },
            {
              text:'Supprimer',
              handler: () => {
                this.deleterole(role);
              }
            }
          ]
        }
      );

      (await menu).present();
    }
  }

  async deleterole(role: Role){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression',
      subHeader:`${role.name}`,
      message:'Voulez-vous vraiment supprimer ce rôle?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.showprogress=true;
          this.Roleserv.delete(role).subscribe(
            data=>{
              this.showprogress=false;
              if(data>0){
                this.appserv.presentToast(`Rôle supprimé avec succès`,'success');
                this.listRoles=this.listRoles.filter(a=>a!=role);
                this.keptRoles=this.keptRoles.filter(a=>a!=role);
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

  async editrole(role: Role){
    //console.log('role from roles page',role);
    
    const modal = await this.appserv.modalCtrl.create({
      component:EditroleComponent,
      componentProps:{'Rolesent':role}
    });
    modal.present();
  }

  async detailrole(rolesent: Role){
    const modal = await this.appserv.modalCtrl.create({
      component:InfosroleComponent,
      componentProps:{'Rolesent':rolesent}
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='deleted'){
      this.listRoles=this.listRoles.filter(a=>a!=rolesent);
    }
  }

  getlist(object: any){
    this.showprogress=true;
    this.Roleserv.getlistRoles(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.showprogress=false;
        this.listRoles=data;
        this.keptRoles=data;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Erreur survenue lors du chargement de la liste des rôles. Vérifiez votre connexion`,'danger');
      }
    )
  }

  async multipledelete(){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression multiple',
      mode:'ios',
      message:`Voulez-vous supprimer ce${this.listselectedRoles.length>1?'s':''} ${this.listselectedRoles.length>1?this.listselectedRoles.length:""} rôle${this.listselectedRoles.length>1?'s':''}? `,
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.listselectedRoles.forEach(role => {
            this.showprogress=true;
            this.Roleserv.delete(role).subscribe(
              data=>{
                this.showprogress=false;
                if(data>0){
                  this.listselectedRoles=this.listselectedRoles.filter(a=>a!=role);
                  this.deletedRoles.push(role);
                  if(this.listselectedRoles.length==0){
                    this.appserv.presentToast(`${this.deletedRoles.length} suppression${this.deletedRoles.length>1?'s':''} effectuée${this.deletedRoles.length>1?'s':''} avec succès`,'success');
                  }

                  this.listRoles=this.listRoles.filter(a=>a!=role);
                  if(this.listselectedRoles.length==0){
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

  filterbytype(criteria: string){
    this.listRoles=this.keptRoles.filter(a=>a===criteria);
  }

  deletefilter(){
    this.listRoles=this.keptRoles;
  }

   async newrole(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewroleComponent
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
        this.listRoles.unshift(data);
    }
  }

}
