/* eslint-disable eqeqeq */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Users } from 'src/app/interfaces/users';
import { AlertController, ModalController, LoadingController, ActionSheetController, IonInput } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { Departments } from 'src/app/interfaces/departments';
import { AppservicesService } from 'src/app/services/appservices.service';
import { DepartmentService } from 'src/app/services/departements.sevice';
import { ModaldepartsearchagentsComponent } from '../modaldepartsearchagents/modaldepartsearchagents.component';
import { ModaladdnewagentdepartComponent } from '../modaladdnewagentdepart/modaladdnewagentdepart.component';
import { UserpickerComponent } from 'src/app/agents/userpicker/userpicker.component';

@Component({
  selector: 'app-detaildepartment',
  templateUrl: './detaildepartment.component.html',
  styleUrls: ['./detaildepartment.component.scss'],
})
export class DetaildepartmentComponent implements OnInit {
  @ViewChild('departmentName') departmentName:IonInput;
  @ViewChild('descriptionInput') descriptionInput:IonInput;
  @Input() departsent: Departments;
  showprogress = false;
  listrequests: Request[] = [];
  listdepartments: Departments[] = [];
  listsubdepartments: Departments[] = [];
  listagents: Users[] = [];
  showedingmode = false;
  imgUrl = this.appserv.imgUrl;
  isDescriptionModalOpen = false;
  departinfos = this.formbuild.group({
    id: [],
    department_name: [],
    description: [],
    header_depart: [],
    user_id: [],
    subdeparts: []
  });
  newaffectation = this.formbuild.group({
    id: [],
    level: 'simple',
    user_id: [],
    department_id: []
  });
  constructor(private departmentServ: DepartmentService,private formbuild: FormBuilder, private actionSheetCtrl: ActionSheetController, private loading: LoadingController,
    private alrtctrl: AlertController, private route: ActivatedRoute,
    private appserv: AppservicesService, private modalctrl: ModalController) { }

  ngOnInit() {}

  ngAfterViewInit(){
    setTimeout(() => {
      this.getlistagents();
      this.getsubdeparts();
      this.getlistrequests();
      this.sycingfomrdata();
    }, 200);
  }
  
  @HostListener('window:keydown',['$event'])
  async validationInput(event:KeyboardEvent){
    if (event.key === 'Enter' && this.isDescriptionModalOpen || event.key === 'Enter' && this.showedingmode ) {
      this.editdepart(this.departsent);
    }
  }

  openDescriptionEdition(){
    this.isDescriptionModalOpen=true;
    setTimeout(() => {
      this.descriptionInput.setFocus();
    }, 200);
  }

  modeEdit(){
    this.showedingmode=!this.showedingmode;
    if (this.showedingmode) {
      setTimeout(() => {
        this.departmentName.setFocus();
      }, 100);
    }
  }

  async sycingfomrdata() {
    this.departinfos.patchValue({
      id: this.departsent.id,
      department_name: this.departsent.department_name,
      description: this.departsent.description,
      header_depart: this.departsent.header_depart,
      user_id: this.departsent.user_id
    });
  }

  async getlistagents() {
    this.departmentServ.getaffectedusers({id:this.departsent.id}).subscribe({
      next:(response)=>{
        if (response.message==="success") {
          this.listagents =response.data;
          this.departsent.nbrusers =response.data.length;
        }
        
        if (response.message==="error") {
          this.appserv.presentToast(`Une erreur est survenue lors de la récupération des agents du département`, 'danger');
        }
      },
      error:(err)=>{
        this.appserv.presentToast(`Une erreur est survenue lors de la récupération des agents du département`, 'danger');
      }
    });
  }

  async getlistrequests() {
    // this.appserv.requestsfordepartment(this.departsent.id).subscribe(
    //   (data: any) => {
    //     this.listrequests = data;
    //   },
    //   error => {
    //     this.appserv.presentToast(`Une erreur est survenue lors de la récupération des réquisitions du département`, 'danger');
    //   }
    // );
  }

  async closemodal() {
    this.modalctrl.dismiss(null, 'canupdate');
  }

  async confirmdescription() {

  }

  async canceldescription() {

  }

  async openfilesdetail() {
    // const modal = await this.modalctrl.create({
    //   component: ShowdepartementsfilesComponent,
    //   componentProps: { 'departsent': this.departsent },
    //   cssClass: 'modal-border-radius-20'
    // });
    // modal.present();
  }

  async getsubdeparts() {
    // this.appserv.getsubdepartments(this.departsent.id).subscribe(
    //   data => {
    //     this.listsubdepartments = data;
    //   },
    //   error => {
    //     this.appserv.presentToast(`Erreur lors de récupération des sous-départements`, 'danger');
    //   }
    // );
  }
  async opensearchagents() {
    const modal = await this.modalctrl.create({
      component: ModaldepartsearchagentsComponent,
      componentProps: {departsent: this.departsent,listagentsent: this.listagents },
      cssClass: 'modal-border-radius-20'
    });
    modal.present();
  }

  async opendepartsubdepartments() {
    // const modal = await this.modalctrl.create({
    //   component: ModaldepartsubdepartmentsComponent,
    //   componentProps: { 'departsent': this.departsent, 'listsubdepartsent': this.listsubdepartments },
    //   cssClass: 'modal-border-radius-20'
    // });
    // modal.present();

    // const { data, role } = await modal.onWillDismiss();
    // if (role == 'canupdatelist') {
    //   this.listsubdepartments = data;
    // }
  }

  async openaddnewagentdepart() {
    const modal = await this.modalctrl.create({
      component:UserpickerComponent,
      componentProps: {multiselect:true},
      cssClass: 'modal-border-radius-20'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'selected') {
      this.sendpeoples(data);
    }
  }

  async sendpeoples(membersList: any[]) {
    if (membersList.length > 0) {
      this.showprogress = true;
      this.departmentServ.usersAffectation({ agents: membersList, department: this.departsent }).subscribe({
        next: async (response: any) => {
          console.log('agents affected', response);
          this.showprogress = false;

          let created: any[] = [];
          let skipped: any[] = [];

          if (response?.data && Array.isArray(response.data)) {
            created = response.data.filter((r: any) => r.status === 'created');
            skipped = response.data.filter((r: any) => r.status === 'skipped');
          }

          let message = '';

          if (created.length > 0) {
            message += `<p><strong>✅ Ajoutés :</strong><br>${created.map(c => `• Agent ${c?.data?.user_id}`).join('<br>')}</p>`;
          }

          if (skipped.length > 0) {
            message += `<p><strong>⚠️ Ignorés :</strong><br>${skipped.map(s => `• Agent ${s?.message}`).join('<br>')}</p>`;
          }

          if (!message) {
            message = `Opération d'affectation terminée avec succès !`;
          }

          const alert = await this.appserv.alertctrl.create({
            header: 'Résultat de l’affectation',
            message,
            buttons: ['OK']
          });
          await alert.present();
        },
        error: async (err) => {
          console.log('error affectation', err);
          this.showprogress = false;

          const alert = await this.appserv.alertctrl.create({
            header: 'Erreur',
            message: `Erreur lors de l'affectation. Veuillez réessayer.`,
            buttons: ['OK']
          });
          await alert.present();
        }
      });
    } else {
      const alert = await this.appserv.alertctrl.create({
        header: 'Attention',
        message: `Vous devez au moins sélectionner un agent.`,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async openmodalrequests() {
    // const modal = await this.modalctrl.create({
    //   component: ModalrequestsviewdepartComponent,
    //   componentProps: { 'departsent': this.departsent, 'requestsent': this.listrequests },
    //   cssClass: 'modal-border-radius-20'
    // });
    // modal.present();
  }

  async completedepartmentsnumbers() {
    this.listdepartments.forEach(depart => {
      depart.nbrusers = this.listagents.filter(a => a.department_id === depart.id).length;
    });
  }
  async editdepart(depart: Departments) {
    if (depart.department_name === this.departinfos.get('department_name').value &&
      depart.description === this.departinfos.get('description').value) {
      this.appserv.presentToast(`Aucune modification apportée`, 'warning');
      this.showedingmode = false;
    } else {
      this.showprogress = true;
      this.departmentServ.update(this.departinfos.value).subscribe({
        next:(response)=>{
          this.showprogress = false;
          this.departsent.department_name = this.departinfos.get('department_name').value;
          this.departsent.description = this.departinfos.get('description').value;
          this.appserv.presentToast(`Département modifié avec succès`, `success`);
          this.modeEdit();
          this.isDescriptionModalOpen=false;
        },
        error:(err)=>{
          console.log('error',err);
          this.showprogress = false;
          this.appserv.presentToast(`Erreur lors de modification`, 'danger');
        }
      });
  }
}

  async actionstoagent(agent: Users) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `${agent.user_name}`,
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Nommer Chef',
          handler: () => {
            this.updateaffectation(agent);
          },
        },
        {
          text: 'Retirer',
          handler: () => {
            this.deleteaffectation(agent);
          }
        },
        {
          text: 'Annuler',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });
    await actionSheet.present();
  }

async deleteaffectation(agent: Users) {
  this.showprogress = true;
  this.departmentServ.deleteaffectation(agent.affectation_depart_id)
    .subscribe({
      next: (response)=> {
        if (response<=0) {
          this.appserv.presentToast(`Impossible de désaffecter l'agent!`, 'danger');
          return;
        }
        this.departsent.nbrusers -= 1;
        this.departsent.nbragents -= 1;
        this.listagents = this.listagents.filter(a => a.id !== agent.id);
        this.appserv.presentToast(
          `Agent ${agent.user_name} retiré du département`, 
          'success'
        );
      },
      error: (err) => {
        this.appserv.presentToast(`Désaffectation impossible`, 'danger');
      },
      complete: () => {
        this.showprogress = false;
      }
    });
}


  async infosuser(agent: Users) {
    // const modal = await this.modalctrl.create({
    //   component: InfosuserprofilComponent,
    //   componentProps: { 'agentsent': agent },
    //   cssClass: 'modal-border-radius-20'
    // });
    // modal.present();
    // const { data, role } = await modal.onWillDismiss();
    // if (role === 'updated') {
    //   agent = data;
    // }
  }
  async updateaffectation(agent: Users) {
    this.showprogress = true;
    this.newaffectation.patchValue(
      {
        id: agent.affectation_depart_id,
        user_id: agent.id,
        level: 'chief',
        department_id: this.departsent.id
      }
    );
    this.departmentServ.updateaffectationapi(this.newaffectation.value).subscribe({
      next:(response)=>{
        if (response.level==='chief') {
          this.listagents.forEach(a => {
            a.level ='simple';
          });
        }
        agent.level =response.level;
        this.showprogress = false;
      },
      error:(err)=>{
        this.appserv.presentToast(`Erreur survenue. Mise à jour impossible`, 'warning');
        this.showprogress = false;
      }
    });
  }

  async deletedepart(depart: Departments) {
    const alertc = await this.alrtctrl.create({
      cssClass: 'alert-confirm',
      header: 'Suppréssion département',
      subHeader: `${depart.department_name}`,
      message: 'Voulez-vous vraiment supprimer ce département?',
      mode: 'ios',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'cancelbutton'
        },
        {
          text: 'Oui',
          handler: async () => {
            const load = await this.loading.create({
              mode: 'ios',
              translucent: true,
              message: 'Suppression en cours...',
              spinner: 'circles'
            });
            load.present();

            this.departmentServ.delete(depart.id).subscribe(
              data => {
                load.dismiss();
                console.log('depart deleted', data);
                if (data.message==='error') {
                  this.appserv.presentToast(data.error, 'warning');
                }

                if (data.message==="success") {
                  this.listdepartments = this.listdepartments.filter(d => d.id !== depart.id);
                  this.appserv.presentToast('Département supprimé avec succès', 'success');
                  this.modalctrl.dismiss(this.listdepartments, 'deleted');
                  return;
                }
              },
              error => {
                load.dismiss();
                this.appserv.presentToast('Une erreur est survenue lors de la suppression du département', 'danger');
              }
            );
          }
        }
      ]
    });
    await alertc.present();
  }
}
