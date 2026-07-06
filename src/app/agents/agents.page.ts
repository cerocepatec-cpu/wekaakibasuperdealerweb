import { Component, OnInit, ViewChild } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { NewagentComponent } from './newagent/newagent.component';
import { EditagentComponent } from './editagent/editagent.component';
import { InfosagentComponent } from './infosagent/infosagent.component';
import { Users } from '../interfaces/users';
import { UsersService } from '../services/users.service';
import { PermissionsComponent } from '../roles/permissions/permissions.component';
import { PickrolesComponent } from '../roles/pickroles/pickroles.component';
import { EditroleComponent } from '../roles/editrole/editrole.component';
import { ImportComponent } from '../import/import.component';
import { IonInput } from '@ionic/angular';
import { UserpickerComponent } from './userpicker/userpicker.component';
import { TipquantityComponent } from '../tab2/tipquantity/tipquantity.component';
import { NotificationService } from '../services/notification.service';
import { AuthentificationService } from '../services/authentification.service';
@Component({
  selector: 'app-agents',
  templateUrl: './agents.page.html',
  styleUrls: ['./agents.page.scss'],
})
export class AgentsPage implements OnInit {
  @ViewChild('defaultinput') inputdefault!: IonInput;
  showprogress = false;
  keptUsers: Users[] = [];
  listselectedUsers: Users[] = [];
  listUsers: Users[] = [];
  listUsersKepted: Users[] = [];
  deletedUsers: Users[] = [];
  showcheckbox = false;
  keyword: any;
  pagetitle = 'Membres';

  constructor(
    public appserv: AppservicesService,
    private Userserv: UsersService,
    private authserv: AuthentificationService
  ) {}

  ngOnInit() {
    this.getlist();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputdefault.setFocus();
    }, 100);
  }

  async setcollectionpercentage(user: Users) {
    const pin: any = await this.authserv.callPinModal();
    if (!pin || pin.length < 4) {
      this.appserv.presentToast('Aucun ou mauvais Pin fourni svp!', 'warning');
      return;
    }
    const modal = await this.appserv.modalCtrl.create({
      component: TipquantityComponent,
      componentProps: { title: 'Entrer un pourcentage' },
      mode: 'ios',
      initialBreakpoint: 0.25,
      breakpoints: [0.25, 0.5, 0.75, 1],
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'edited') {
      if (data > 0) {
        user.loading = true;
        this.Userserv.updatecollectionpercentage({
          user_id: user.id,
          percentage: data,
        }).subscribe({
          next: (response) => {
            user.loading = false;
            if (response.message === 'success' && response.status === 200) {
              user.collection_percentage = response.data.collection_percentage;
              this.appserv.presentToast(
                'Mise à jour terminée avec succès!',
                'success'
              );
            } else {
              this.appserv.presentToast(response.error, 'warning');
            }
          },
          error: (err) => {
            user.loading = false;
            // console.log('errur lors de la mise ajour du pourcentage',err);
            this.appserv.presentToast(
              'Impossible de fixer le pourcentage. Une erreur est survenue. Veuillez réessayer svp!',
              'danger'
            );
          },
        });
      } else {
        this.appserv.presentToast(
          'Vous devez entrer un pourcentage supérieur à 0 svp!',
          'warning'
        );
      }
    }
  }

  handlesearchchange($event: any) {
    const criteria =
      this.pagetitle === 'Collecteurs' ? 'collectors' : 'members';
    if ($event.detail.value.length > 0) {
      this.showprogress = true;
      this.Userserv.memberslookup({
        enterprise_id: this.appserv.actualEse.id,
        keyword: $event.detail.value,
        criteria: criteria,
      }).subscribe({
        next: (res) => {
          this.showprogress = false;
          this.listUsers = res;
        },
        error: (err) => {
          this.showprogress = false;
          if (err.status === 401 || err.status === 403) {
            this.appserv.presentToast(`${err.error.message}.`, 'warning');
            return;
          }
        },
      });
    } else {
      this.listUsers = this.keptUsers;
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  }

  async importexcelfile() {
    const modal = await this.appserv.modalCtrl.create({
      component: ImportComponent,
      cssClass: 'modal-border-radius-20',
      componentProps: { criteria: 'users' },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'added') {
      this.ngOnInit();
    }
  }

  async editAgentStatus(user: Users, status: string) {
    const pin: any = await this.authserv.callPinModal();
    if (!pin || pin.length < 4) {
      this.appserv.presentToast('Aucun ou mauvais Pin fourni svp!', 'warning');
      return;
    }

    if (user.status === status) {
      this.appserv.presentToast('Aucune modification à éffectuer', 'primary');
    } else {
      user.loading = true;
      let msg = status === 'enabled' ? 'activé' : 'désactivé';
      this.Userserv.edithagentstatus({
        user_id: user.id,
        status: status,
      }).subscribe({
        next: (response) => {
          user.loading = false;
          user.status = response.status;
          this.appserv.presentToast(`Agent ${msg} avec succès!`, 'success');
        },
        error: (err) => {
          user.loading = false;
          this.appserv.presentToast(
            'Impossible de terminer le traitement. Veuillez réessayer',
            'danger'
          );
        },
      });
    }
  }

  async makeSuperAdmin(user: any) {
    const alert = this.appserv.alertctrl.create({
      header: `Modification Compte`,
      subHeader: `${user.user_name}`,
      mode: 'ios',
      message: `Voulez-vous donner accès à toutes les données de votre système au même titre que le propriétaire de l'Entreprise?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Oui',
          handler: () => {
            user.loading = true;
            this.Userserv.setAsSuperAdmin(user).subscribe(
              (response) => {
                user.loading = false;
                user.user_type = response.user_type;
                if (response.user_type === 'super_admin') {
                  this.appserv.presentToast(
                    `Agent nommé Super Admin avec succès!`,
                    'success'
                  );
                } else {
                  this.appserv.presentToast(
                    `Droit de  Super Admin retiré à l'agent. avec succès!`,
                    'success'
                  );
                }
              },
              (error) => {
                user.loading = false;
                this.appserv.presentToast(
                  `Impossible de nommer l'utilisateur comme Super Admin`,
                  'danger'
                );
              }
            );
          },
        },
      ],
    });
    (await alert).present();
  }

  async gotopermissions() {
    const modal = await this.appserv.modalCtrl.create({
      component: PermissionsComponent,
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
  }

  async editRole(agent: Users) {
    this.showprogress = true;
    this.Userserv.getRoleAndPermissions(agent.permissions).subscribe(
      async (datareturned) => {
        this.showprogress = false;
        const modal = await this.appserv.modalCtrl.create({
          component: EditroleComponent,
          componentProps: { actualrole: datareturned },
          cssClass: 'modal-border-radius-20',
        });
        modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (role == 'updated') {
          agent.role_title = data.title;
          agent.role_description = data.description;
        }
      },
      (error) => {
        this.showprogress = false;
        this.appserv.presentToast(
          `Erreur survenue lors du chargement des informations sur le rôle`,
          'warning'
        );
      }
    );
  }

  async deleteuser(user: Users) {
    const alert = await this.appserv.alertctrl.create({
      header: 'Suppression',
      subHeader: `${user.user_name}`,
      message: 'Voulez-vous vraiment supprimer cet agent?',
      mode: 'ios',
      translucent: true,
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui',
          handler: async () => {
            this.showprogress = true;
            this.Userserv.delete(user).subscribe(
              (data) => {
                this.showprogress = false;
                if (data > 0) {
                  this.appserv.presentToast(
                    `Compte supprimé avec succès`,
                    'success'
                  );
                  this.listUsers = this.listUsers.filter((a) => a != user);
                  this.keptUsers = this.keptUsers.filter((a) => a != user);
                } else {
                  this.appserv.presentToast(`Opération  echouée:`, 'warning');
                }
              },
              (error) => {
                this.showprogress = false;
                this.appserv.presentToast(`Suppression impossible`, 'danger');
              }
            );
          },
        },
      ],
    });
    alert.present();
  }

  async edituser(user: Users) {
    const modal = await this.appserv.modalCtrl.create({
      component: NewagentComponent,
      componentProps: { userSent: user },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
  }

  async detailuser(user: Users) {
    const modal = await this.appserv.modalCtrl.create({
      component: InfosagentComponent,
      componentProps: { actualuser: user },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'deleted') {
      this.listUsers = this.listUsers.filter((a) => a != user);
    }
  }

  getlistcollectors() {
    this.pagetitle = 'Collecteurs';
    this.showprogress = true;
    this.Userserv.getlistusersbytypes({
      enterprise_id: this.appserv.getactualEse().id,
      usertype: 'collectors',
    }).subscribe({
      next: (data) => {
        console.log("gettin collectors list",data);
        this.showprogress = false;
        this.listUsers = data.data;
      },
      error: (error) => {
        console.log("ERROR ON GETTING COLLECTORS",error);
        this.showprogress = false;
        this.appserv.presentToast(
          `Erreur lors de la récupération de la liste des agents`,
          'danger'
        );
      },
    });
  }

  getlistSuperdealer() {
    this.pagetitle = 'Superdealer';
    this.showprogress = true;
    this.Userserv.getlistusersbytypes({
      enterprise_id: this.appserv.getactualEse().id,
      usertype: 'super_dealer',
    }).subscribe({
      next: (data) => {
        this.showprogress = false;
        this.listUsers = data.data;
        console.log('Super dealers list=>', data);
      },
      error: (error) => {
        this.showprogress = false;
        // console.log('Error fetching super dealers list=>', error);
        this.appserv.presentToast(
          `Erreur lors de la récupération de la liste des super dealers`,
          'danger'
        );
      },
    });
  }

  getlist() {
    this.pagetitle = 'Membres';
    this.showprogress = true;
    this.Userserv.getlistusers(this.appserv.getactualEse().id).subscribe({
      next: (res) => {
        this.showprogress = false;
        this.listUsers = res;
        this.keptUsers = res;
        this.appserv.shouldrefreshlist = false;
      },
      error: (err) => {
        this.showprogress = false;
        this.appserv.shouldrefreshlist = false;
        if (err.status === 401 || err.status === 403) {
          this.appserv.presentToast(`${err.error.message}.`, 'warning');
          return;
        }
      },
    });
  }

 

  filterbytype(criteria: string) {
    this.listUsers = this.keptUsers.filter((a) => a.status === criteria);
  }

  deletefilter() {
    this.listUsers = this.keptUsers;
  }

  async newuser() {
    if (this.pagetitle === 'Membres') {
      const modal = await this.appserv.modalCtrl.create({
        component: NewagentComponent,
        componentProps: { keyword: this.keyword },
        cssClass: 'modal-border-radius-20',
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (role == 'added') {
        this.listUsers.unshift(data);
      }
    } else {
      const modal = await this.appserv.modalCtrl.create({
        component: UserpickerComponent,
        componentProps: { multiselect: 1 },
        cssClass: 'modal-border-radius-20',
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();

      if (role === 'selected') {
        if (this.pagetitle === 'Collecteurs') {
          this.memberstocollectors(data);
        } else if (this.pagetitle === 'Superdealer') {
          this.memberstosuperdealer(data);
        }
      }
    }
  }
  async memberstosuperdealer(members: Users | Users[]) {
    const load = await this.appserv.loadctrl.create({
      message: 'Affectation super dealer en cours...',
      mode: 'ios',
      translucent: true,
    });
    await load.present();

    this.Userserv.memberstosuperdealer({ members: members }).subscribe(
      {
        next: (response) => {
        load.dismiss();

        if (response.message === 'success' && response.status === 200) {
          this.appserv.presentToast(
            `Affectation super dealer effectuée avec succès!`,
            'success'
          );
          this.getlistSuperdealer();
        }

        if (response.message === 'error') {
          this.appserv.presentToast(
            `Une erreur est survenue lors de l'affectation du super dealer. Veuillez réessayer plus tard!`,
            'warning'
          );
        }
      },
      error: (error) => {
        load.dismiss();
        console.log("error lors de l'affectation du super dealer=>",error );
        this.appserv.presentToast(
          `Impossible d'affecter le super dealer. Veuillez réessayer plus tard`,
          'danger'
        );
      }}
    );
  }

  async memberstocollectors(members: Users) {
    const load = await this.appserv.loadctrl.create({
      message: 'Affectation collecteurs en cours...',
      mode: 'ios',
      translucent: true,
    });
    load.present();
    this.Userserv.membertocollectors({ members: members }).subscribe({
      next: (response) => {
        load.dismiss();
        if (response.message === 'success' && response.status === 200) {
          this.getlistcollectors();
        }

        if (response.message === 'error') {
          this.appserv.presentToast(
            `Une erreur est survenue lors de l'affectation des collecteurs.Veuillez réessayer plus tard!`,
            'warning'
          );
        }
      },
      error: (error) => {
        load.dismiss();
        this.appserv.presentToast(
          `Impossible d'affecter les collecteurs. Veuillez réessayer plus tard`,
          'danger'
        );
      },
    });
  }
  // memberstosuperdealer(data: any) {
  //   return this.appserv .post<any>(
  //     `${this.apiUrl}/memberstosuperdealer`,
  //     data,
  //     this.httpOptions
  //   );
  // }
  async pickrules() {
    const modal = await this.appserv.modalCtrl.create({
      component: PickrolesComponent,
      cssClass: 'modal-border-radius-20',
    });
    modal.onDidDismiss();
    //this.getlist(this.appserv.getactualuser().enterprise_id);
    modal.present();
  }
}
