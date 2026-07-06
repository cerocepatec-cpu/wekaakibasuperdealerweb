import { Component, OnInit,ViewChild,Input } from '@angular/core';
import { Users } from '../interfaces/users';
import { AppservicesService } from '../services/appservices.service';
import { RolePermissionService } from '../services/role-permission.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-permissionparticipants',
  templateUrl: './permissionparticipants.component.html',
  styleUrls: ['./permissionparticipants.component.scss'],
})
export class PermissionparticipantsComponent implements OnInit {

@ViewChild('defaultinput') defaultinput!:IonInput;
@Input() permissionsent:any;
  listusers: Users[]=[];
  selectedusers: Users[]=[];
  search:any;
  showprogress=false;
  permissionName: string = '';
  totalUsers = 0;
  currentPage = 1;
  lastPage = 1;
  editMode = false;
  selectAll = false;

  constructor(public appserv:AppservicesService,private permissionService: RolePermissionService) { }

  ngOnInit() {
    this.getparticipants();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.defaultinput.setFocus();
    }, 200);
  }
   // === MODE ÉDITION ===
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.selectAll = false;
      this.selectedusers = [];
    }
  }

  // === SÉLECTION INDIVIDUELLE ===
  toggleUserSelection(user: any) {
    const index = this.selectedusers.findIndex(u => u.id === user.id);
    if (index > -1) {
      this.selectedusers.splice(index, 1);
    } else {
      this.selectedusers.push(user);
    }

    // Mettre à jour le checkbox global
    this.selectAll = this.selectedusers.length === this.listusers.length;
  }

  // === SÉLECTION TOTALE ===
  toggleSelectAll() {
    if (this.selectAll) {
      this.selectedusers = [...this.listusers];
    } else {
      this.selectedusers = [];
    }
  }

  // === CHECK UTILISATEUR SÉLECTIONNÉ ===
  isSelected(user: any): boolean {
    return this.selectedusers.some(u => u.id === user.id);
  }
  
  removeFromList(){

  }

  removeSingleUser(user:any){
    this.selectedusers.push(user);
    this.removeSelectedUsers();
  }

  async getparticipants(page:number=20){
    const params: any = { per_page: page };
    if (this.permissionsent.key) {
      params.module = this.permissionsent.key;
    }
    if (this.permissionsent.value && this.permissionsent.value.length > 0) {
      params.permissions = this.permissionsent.value; // HttpParams va gérer le tableau
    }

    const loader = await this.appserv.loadctrl.create({
      message: 'Chargement des participants...',
      spinner: 'crescent',
      mode: 'ios'
    });
    loader.present();

    this.permissionService.getPermissionUsers(params).subscribe({
      next: async (res: any) => {
        loader.dismiss();
        console.log('permissions service',res);
         if (res.status===200 && res.message==="success") {
          this.listusers = res.data;
          this.totalUsers = res.total_users;
          this.currentPage = res.pagination.current_page;
          this.lastPage = res.pagination.last_page;
        }
      },
      error: async (err) => {
        loader.dismiss();
        console.log("erreur", err);
        this.appserv.presentToast('Erreur. '+ err.error?.message || 'Impossible de charger les participants.',"danger");
      }
    });
  }


   nextPage() {
    if (this.currentPage < this.lastPage) {
      this.getparticipants(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getparticipants(this.currentPage - 1);
    }
  }

  async removeSelectedUsers() {
    if (!this.selectedusers.length) return;
    const confirm = await this.appserv.alertctrl.create({
      header: 'Confirmation',
      mode:'ios',
      message: `Voulez-vous vraiment retirer ces ${this.selectedusers.length} utilisateurs ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Oui, supprimer',
          handler: async () => {
            const loader = await this.appserv.loadctrl.create({
              message: 'Suppression en cours...',
              spinner: 'crescent',
              mode: 'ios'
            });
            await loader.present();

            const payload = {
              user_ids: this.selectedusers.map(u => u.id),
              module: this.permissionsent.key,
              permissions: this.permissionsent.value
            };

            this.permissionService.removeUsersFromPermission(payload).subscribe({
              next: async (res: any) => {
                await loader.dismiss();
                this.appserv.presentToast(`✅ ${res.message}`, 'success');
                this.selectedusers=[];
                this.editMode=false;
                this.getparticipants();
              },
              error: async (err) => {
                await loader.dismiss();
                this.appserv.presentToast(`Erreur: ${err.error?.message || 'Échec'}`, 'danger');
              }
            });
          }
        }
      ]
    });
    await confirm.present();
  }


}
