import { Component, OnInit, Input } from '@angular/core';
import { Role } from 'src/app/interfaces/role';
import { AppservicesService } from 'src/app/services/appservices.service';
import { NewroleComponent } from '../newrole/newrole.component';
import { PermissionService } from '../../services/permission.service';
import { Users } from 'src/app/interfaces/users';
import { InfosroleComponent } from '../infosrole/infosrole.component';
import { EditroleComponent } from '../editrole/editrole.component';
import { ChangepermissionsComponent } from 'src/app/agents/changepermissions/changepermissions.component';
import { DetailroleComponent } from '../detailrole/detailrole.component';

@Component({
  selector: 'app-pickroles',
  templateUrl: './pickroles.component.html',
  styleUrls: ['./pickroles.component.scss'],
})
export class PickrolesComponent implements OnInit {
  @Input() canPick:boolean;
  @Input() ismodal=false;
  showprogress=false;
  listroles:Role[]=[];
  selectedroles:Role[]=[];
  actualuser: Users;
  search:any;

  constructor(public appserv:AppservicesService, public permissionService: PermissionService) {
    this.actualuser=this.appserv.getactualuser();
  }

  ngOnInit() {
    this.getlist();
  }

  async getlist(){
    this.showprogress=true;
    this.permissionService.getall(this.actualuser.enterprise_id).subscribe((resp)=>{
      this.showprogress=false;
      this.listroles = resp;
    });
  }
  async selected(role:Role){
    if (this.canPick) {
      this.permissionService.actualrole = role;
      const ifselected = this.selectedroles.indexOf(role);
      if(ifselected==-1){
        role.selected=true;
        this.selectedroles.push(role);
      }else{
        role.selected=false;
        this.selectedroles=this.selectedroles.filter(r=>r!=role);
      }
    }else {
      let menubuttons = [
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
      ];
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('agents', 'edit'),
      {
        text: 'Modifier',
        handler: () => {
          this.editrole(role);
        }
      }); 
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('agents', 'delete'),
      {
        text: 'Supprimer',
        handler: () => {
          this.delete(role);
        }
      });
      const menu = await this.appserv.actionsheetctrl.create(
        {
          header: `${role.title}`,
          cssClass: 'myactionsheet',
          translucent: true,
          mode: 'ios',
          buttons: menubuttons
        }
      );

      (await menu).present();
    }
  }

  senddata(){
    if(this.selectedroles.length>0){
      this.appserv.modalCtrl.dismiss(this.selectedroles,'selected');
    }else{
      this.appserv.presentToast(`Vous devez sélectionner au moins un rôle`,'warning');
    }
  }

  async addnewrule(){

    const modal = await this.appserv.modalCtrl.create({
      component:NewroleComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role === 'added') {
      this.listroles.push(data);
    }
  }

  async delete(role: Role){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression rôle',
      subHeader:role.name?role.name:role.description,
      message:'Voulez-vous vraiment supprimer ce rôle?',
      mode:'ios',
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
            this.showprogress=true;
            this.permissionService.delete(role).subscribe(
              data=>{
                this.showprogress=false;
                this.appserv.presentToast('Rôle supprimé avec succès','success');
                this.listroles=this.listroles.filter(r=>r!==role);
                this.appserv.shouldrefreshlist=true;
              },error=>{
                this.showprogress=false;
                this.appserv.presentToast('Impossible de supprimer le rôle','danger');
              });
        }}
      ]
    });
    alert.present();
  }

  async editrole(role: Role){
    const modal = await this.appserv.modalCtrl.create({
      component:EditroleComponent,
      componentProps:{'actualrole':role},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async detailrole(roles: Role){
    const modal = await this.appserv.modalCtrl.create({
      component:DetailroleComponent,
      componentProps:{'roleSent':roles},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='deleted'){
      this.listroles =this.listroles.filter(a=>a!=roles);
    }
  }
}
