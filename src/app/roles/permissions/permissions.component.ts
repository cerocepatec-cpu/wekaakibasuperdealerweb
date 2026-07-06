import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { UserpickerComponent } from 'src/app/agents/userpicker/userpicker.component';
import { PermissionparticipantsComponent } from 'src/app/permissionparticipants/permissionparticipants.component';
import { PickpermissionsComponent } from 'src/app/pickpermissions/pickpermissions.component';
import { RoleparticipantsComponent } from 'src/app/roleparticipants/roleparticipants.component';
import { AppservicesService } from 'src/app/services/appservices.service';
import { RolePermissionService } from 'src/app/services/role-permission.service';

interface RoleWithGroupedPermissions {
  id: number;
  title: string;
  name: string;
  description?: string;
  permissions: Record<string, string[]>; // module => liste des permissions
}

interface Permission {
  name: string;
  assigned: boolean;
}

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit {
@ViewChild('searchpermissioninput') searchpermissioninput:IonInput;
@ViewChild('searchrolesinput') searchrolesinput:IonInput;
groupedPermissions: Record<string, string[]> = {};
selectedPermissions: string[] = [];
activeTab: 'permissions' | 'roles' = 'permissions';
roles: RoleWithGroupedPermissions[] = [];
permissionsLoader=false;
rolesLoader=false;
loadingPermissions: Record<string, boolean> = {};
loadingModules: Record<string, boolean> = {};
searchpermission:any;
searchrole:any;
  constructor(
    public appserv: AppservicesService,
    private permissionService: RolePermissionService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.getAllPermissions();
      setTimeout(() => {
        this.getAllRoles();
      }, 200);
    }, 200);
  }

  ngAfterViewInit(){
    setTimeout(() => {
       this.setfocus(this.searchpermissioninput);
    },300);
  }

  setfocus(input:IonInput){
    setTimeout(() => {
      input.setFocus();
    }, 200);
  }

    handletabchanged($event){
    switch ($event.index) {
      case 0:
        setTimeout(() => {
          this.setfocus(this.searchpermissioninput);
        }, 100);
        break;
      case 1:
        setTimeout(() => {
          this.setfocus(this.searchrolesinput);
        }, 100);
        break;
      default:
        break;
    }
  }

  getAllPermissions(){
    this.permissionsLoader=true;
    this.permissionService.getGroupedPermissions().subscribe({
      next: (data: Record<string, string[]>) => {
        this.permissionsLoader=false;
        this.groupedPermissions = data;
      },
      error: (err) => {
        this.permissionsLoader=false;
        this.appserv.presentToast('Erreur de chargement des permissions', 'danger');
      },
    });
  }
  
  async pickpermission(rolesent:any){
    const modal = await this.appserv.modalCtrl.create({
      component:PickpermissionsComponent,
      componentProps:{permissionsSent:this.groupedPermissions,selectMultiple:true},
      mode:'ios',
      cssClass:"modal-border-radius"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="selected") {
      console.log('permissions from modal',data);
      this.updateRolePermissions(rolesent.id,data,true);
    }
  }

  getAllRoles(){
    this.rolesLoader=true;
    this.permissionService.getRoles().subscribe({
      next: (response:any) => {
        this.rolesLoader=false;
        if (response && response.message==="success" && response.status===200) {
          this.roles =response.data;
        }else{
          this.appserv.presentToast(response.error, 'warning');
        }
      },
      error: (err) => {
        this.rolesLoader=false;
        this.appserv.presentToast('Erreur survenue. '+ err, 'danger');
      },
    });
  }

  roleHasPermission(role: any, perm: string): boolean {
    if (!role.permissions) return false;
    return Object.values(role.permissions).some((group: any) =>
      group.includes(perm)
    );
  }

onPermissionToggle(event: any, perm: string, roleId: number) {
  const isChecked = event.detail.checked;
  this.loadingPermissions[perm] = true;

  this.permissionService.toggleRolePermission(roleId, [perm], isChecked).subscribe({
    next: (res: any) => {
      this.loadingPermissions[perm] = false;

      this.appserv.presentToast(
        isChecked ? 'Permission ajoutée avec succès' : 'Permission retirée avec succès',
        'success'
      );

      const role = this.roles.find((r: any) => r.id === roleId);
      if (role) {
        Object.keys(role.permissions).forEach((moduleKey) => {
          const perms = role.permissions[moduleKey];
          const hasPerm = perms.includes(perm);

          if (isChecked && !hasPerm) perms.push(perm);
          else if (!isChecked && hasPerm)
            role.permissions[moduleKey] = perms.filter((p: string) => p !== perm);
        });
      }
    },
    error: (err) => {
      console.log(err);
      this.loadingPermissions[perm] = false;
      this.appserv.presentToast('Erreur: ' + err.message, 'danger');
    },
  });
}

async viewUsersParticipants(role:any){
  const modal = await this.appserv.modalCtrl.create({
      component:RoleparticipantsComponent,
      componentProps:{rolesent:role},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
} 

async viewPermissionParticipants(permission:any){
  console.log("Permission viewer=>",permission);
  const modal = await this.appserv.modalCtrl.create({
      component:PermissionparticipantsComponent,
      componentProps:{permissionsent:permission},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
} 

async assignRoleToUser(rolesent:any){
   const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{multiselect:true},
      initialBreakpoint:0.75,
      breakpoints:[0.25,0.50,0.75,1],
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="selected") {
      const loader = await this.appserv.loadctrl.create({
        message:"Attribution des roles en cours...",
        spinner:'crescent',
        mode:'ios'
      });
      loader.present();
      let users = data.map((u:any)=>u.id);
      try {
        this.permissionService.assignRoleToUser({user_ids:users,role_id:rolesent.id}).subscribe({
          next: async (res)=>{
              loader.dismiss();
              const alert = await this.appserv.alertctrl.create({
              header: 'Attribution terminée ✅',
              message:  `Rôle : ${res.role}\n` +
              `Total utilisateurs : ${res.total_users}\n` +
              `Rôles attribués : ${res.assigned_roles}\n` +
              `Permissions attribuées : ${res.assigned_permissions}\n` +
              `Statut : ${res.status === 'success' ? 'Succès ✅' : 'Échec ❌'}\n\n` +
              (res.errors.length ? 'Erreurs :\n' + res.errors.join('\n') : ''),
              mode: 'ios',
              cssClass: 'alert-success',
              buttons: ['OK']
            });
            alert.present();
          },
          error:(err)=>{
             loader.dismiss();
            console.log('Erreur lors de l attributions roles aux agents',err);
            this.appserv.presentToast("Erreur lors de l'attribution des rôles aux agents."+ err.error.message,'danger');
          },
          complete() {
              loader.dismiss();
          },
        });
      } catch (error) {
        this.appserv.presentToast("Une erreur grave est survenue.","danger");
      }finally{
        loader.dismiss();
      }
      
      console.log("user picked",data);
    }
}

async updateRolePermissions(roleId: number, permissions: string[], isChecked: boolean) {
  const loader = await this.appserv.loadctrl.create({
    message: 'Modification en cours...',
    mode: 'ios',
    spinner: 'crescent'
  });
  await loader.present();

  this.permissionService.toggleRolePermission(roleId, permissions, isChecked).subscribe({
    next: (res: any) => {
      loader.dismiss();
      console.log('✅ Permissions API Response:', res);

      this.appserv.presentToast(
        isChecked
          ? 'Permissions ajoutées avec succès'
          : 'Permissions retirées avec succès',
        'success'
      );

      // ✅ Trouver le rôle actuel
      const role = this.roles.find((r: any) => r.id === roleId);
      if (!role) return;
      const firstPerm = permissions[0];
      const moduleKey = firstPerm.split('.')[0]; 

      if (!role.permissions[moduleKey]) {
        role.permissions[moduleKey] = [];
      }

      let perms = role.permissions[moduleKey];

      if (isChecked) {
        // ➕ Ajouter les nouvelles permissions (éviter les doublons)
        permissions.forEach(perm => {
          if (!perms.includes(perm)) {
            perms.push(perm);
          }
        });
      } else {
        // ➖ Retirer les permissions décochées
        perms = perms.filter((p: string) => !permissions.includes(p));
      }

      // ✅ Mettre à jour le module du rôle
      role.permissions[moduleKey] = perms;

      // ✅ Synchronisation complète avec le backend si renvoie la liste à jour
      if (res.data && res.data.permissions && Array.isArray(res.data.permissions)) {
        const updatedPermissions = res.data.permissions;
        // Filtrer les permissions pour ce module uniquement
        role.permissions[moduleKey] = updatedPermissions.filter((p: string) =>
          p.startsWith(`${moduleKey}.`)
        );
      }

      // ✅ Réordonner le module ajouté pour qu'il soit au début si nouveau
      const newRolePermissions = { [moduleKey]: role.permissions[moduleKey], ...role.permissions };
      role.permissions = newRolePermissions;
    },

    error: (err) => {
      loader.dismiss();
      console.error('❌ Erreur API:', err);
      this.appserv.presentToast('Erreur: ' + (err?.error?.message || err.message), 'danger');
    },
  });
}

togglePermission(event: any, permission: string) {
    const checked = event.detail.checked;
    if (checked && !this.selectedPermissions.includes(permission)) {
      this.selectedPermissions.push(permission);
    } else if (!checked) {
      this.selectedPermissions = this.selectedPermissions.filter(p => p !== permission);
    }
  }

  async assignToUser() {
    if (this.selectedPermissions.length === 0) return;
    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{multiselect:true},
      initialBreakpoint:0.75,
      breakpoints:[0.25,0.50,0.75,1],
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="selected") {
      const alert = await this.appserv.alertctrl.create({
        header:"Confirmation",
        message:"Confirmez-vous l'attribution de ces permissions?",
        mode:'ios',
        translucent:true,
        buttons:[
          {text:"Non",role:"cancel"},
          {text:"Oui",handler:()=>{
            let users = data.map((u:any)=>u.id);
            this.validatePermissionsAssignation(users);
          }}
        ]
      });
      alert.present();
        console.log('role=.',role,'data=>',data);
    }
  }

  async showApiResult(result: any) 
  {
    const messages = [];

    if (result.success && result.success.length) {
      messages.push('✅ ' + result.success.join('\n'));
    }

    if (result.skipped && result.skipped.length) {
      messages.push('⚠️ ' + result.skipped.join('\n'));
    }

    if (result.errors && result.errors.length) {
      messages.push('❌ ' + result.errors.join('\n'));
    }

    const alert = await this.appserv.alertctrl.create({
      header: 'Résultat',
      message: messages.join('<br>'),
      buttons: ['OK'],
      cssClass: 'ion-text-wrap'
    });

    await alert.present();
  }

  async validatePermissionsAssignation(data:any) {
    const loading = await this.appserv.loadctrl.create({
      message:"Attribution des permissions en cours...",
      mode:'ios',
      translucent:true
    });
    await loading.present();
    this.permissionService.assignPermissions({permissions:this.selectedPermissions,users:data}).subscribe({
      next:(res)=>{
        console.log('Permissions attribuées avec succès :', res);
        loading.dismiss();
        this.showApiResult(res);
      },
      error:(err)=>{
        loading.dismiss();
        console.error('Erreur lors de l\'attribution des permissions :', err);
        this.appserv.presentToast('Erreur lors de l\'attribution des permissions','danger');
      }
    });
  }

  async createRole() {
    if (this.selectedPermissions.length === 0) return;

    const alert = await this.appserv.alertctrl.create({
      header: 'Créer un rôle',
      inputs: [
        { name: 'title', placeholder: 'Titre du rôle' },
        { name: 'description', placeholder: 'Description' },
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Créer',
          handler: (data) => {
            const roleData = {
              ...data,
              permissions: this.selectedPermissions,
            };
            this.permissionService.newrole(roleData).subscribe({
              next: (response:any) => {
                if (response && response.message==="success" && response.status===200) {  
                  this.roles.push(response.data);
                  this.appserv.presentToast('Rôle créé avec succès ✅', 'success');
                }else{
                  this.appserv.presentToast(response.error, 'warning');
                }
              },
              error: (err) => {
                this.appserv.presentToast('Erreur lors de la création du rôle. '+ err, 'danger');
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }

   deleteRole(role: any) {
    console.log('Suppression du rôle :', role);
    this.appserv.presentToast(`Rôle "${role.title}" supprimé`, 'danger');
  }

  
// Toggle individuel
async toggleRolePermission(event:any, permission: string, roleId: number) {
  const checked = event.detail.checked;
  this.loadingPermissions[permission] = true;
  console.log('checking=>',checked,"permission role=>",permission,"role ID=>",roleId);
  try {
    if (checked) {
      await this.permissionService.addPermissionToRole({roleId, permission}).toPromise();
      if (!this.selectedPermissions.includes(permission)) this.selectedPermissions.push(permission);
      this.appserv.presentToast(`Permission "${permission}" attribuée ✅`, 'success');
    } else {
      await this.permissionService.removePermissionFromRole({roleId, permission}).toPromise();
      this.selectedPermissions = this.selectedPermissions.filter(p => p !== permission);
      this.appserv.presentToast(`Permission "${permission}" retirée ✅`, 'warning');
    }
  } catch (err: any) {
    console.error(err);
    event.target.checked = !checked; // revert toggle si erreur
    this.appserv.presentToast(`Impossible de modifier la permission "${permission}".`,'warning');
  } finally {
    this.loadingPermissions[permission] = false;
  }
}

// Toggle module entier
  async toggleModulePermissions(event: any, permissions: string[], roleId: number) {
    const checked = event.detail.checked;
    this.loadingModules[permissions[0].split('.')[0]] = true; // clé module

    try {
      for (const perm of permissions) {
        if (checked && !this.selectedPermissions.includes(perm)) {
          await this.permissionService.addPermissionToRole({roleId, perm}).toPromise();
          this.selectedPermissions.push(perm);
        } else if (!checked && this.selectedPermissions.includes(perm)) {
          await this.permissionService.removePermissionFromRole({roleId, perm}).toPromise();
          this.selectedPermissions = this.selectedPermissions.filter(p => p !== perm);
        }
      }
      this.appserv.presentToast(
        `Permissions du module ${permissions[0].split('.')[0]} mises à jour ✅`,
        'success'
      );
    } catch (err: any) {
      console.error(err);
      this.appserv.presentToast(`Impossible de modifier certaines permissions du module.`,'warning');
    } finally {
      this.loadingModules[permissions[0].split('.')[0]] = false;
    }
  }

  // Helpers pour état module
 isModuleFullyChecked(modulePerms: unknown[]): boolean {
  const perms = modulePerms as string[];
  return perms.every(p => this.selectedPermissions.includes(p));
}

 isModulePartiallyChecked(modulePerms: unknown[]): boolean {
  const perms = modulePerms as string[];
  const someChecked = perms.some(p => this.selectedPermissions.includes(p));
  return someChecked && !this.isModuleFullyChecked(perms);
}

  // Affiche action après le point
  getActionLabel(permission: string | unknown): string {
    if (typeof permission !== 'string') return '';
    const parts = permission.split('.');
    return parts.length > 1 ? parts.slice(1).join('.') : permission;
  }
}
