import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Users } from '../interfaces/users';
import { AppservicesService } from '../services/appservices.service';
import { RolePermissionService } from '../services/role-permission.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-roleparticipants',
  templateUrl: './roleparticipants.component.html',
  styleUrls: ['./roleparticipants.component.scss'],
})
export class RoleparticipantsComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!:IonInput;
  @Input() rolesent:any;
  listusers: Users[]=[];
  selectedusers: Users[]=[];
  search:any;
  showprogress=false;
  roleName: string = '';
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
  
  removeFromList(user:any){
    this.selectedusers.push(user);
    this.removeSelectedUsers();
  }

  async getparticipants(page:number=1){
    this.permissionService.getUsersByRole(this.rolesent.id,page).subscribe({
      next:(res)=> {
        if (res.status===200 && res.message==="success") {
          this.listusers = res.data;
          this.roleName = res.role;
          this.totalUsers = res.total_users;
          this.currentPage = res.current_page;
          this.lastPage = res.pagination.last_page;
           setTimeout(() => {
            this.defaultinput.setFocus();
          }, 200);
        }   
      },
      error:(err)=>{
        console.log('error recuperatioin participants',err);
        this.appserv.presentToast(err.error?.message,"danger");
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
    if (this.selectedusers.length === 0) return;

    const alert = await this.appserv.alertctrl.create({
      header: 'Confirmation',
      mode:'ios',
      translucent:true,
      message: `Voulez-vous vraiment rétirer le rôle ${this.roleName} pour ${this.selectedusers.length} utilisateur(s) ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Oui, supprimer',
          handler: () => {
            const userIds = this.selectedusers.map(u => u.id);
            this.permissionService.removeRoleFromUsers(this.rolesent.id, userIds).subscribe({
              next: (res: any) => {
                this.appserv.presentToast(res.message, 'success');
                this.getparticipants();
                this.selectedusers = [];
                this.editMode = false;
              },
              error: (err) => {
                this.appserv.presentToast('Erreur : ' + err.message, 'danger');
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

}
