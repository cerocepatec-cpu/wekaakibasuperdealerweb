/* eslint-disable quote-props */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonInput, LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Departments } from '../interfaces/departments';
import { Users } from '../interfaces/users';
import { AppservicesService } from '../services/appservices.service';
import { DetaildepartmentComponent } from './detaildepartment/detaildepartment.component';
import { DepartmentService } from '../services/departements.sevice';
@Component({
  selector: 'app-departements',
  templateUrl: './departements.component.html',
  styleUrls: ['./departements.component.scss'],
})
export class DepartementsComponent implements OnInit {
@ViewChild('defaultinput') defaultinput!:IonInput;
  listdepartments: Departments[] = [];
  listdepartmentsprinted: Departments[] = [];
  subdepartments: Departments[] = [];
  addedrecently: Departments[] = [];
  listagents: Users[] = [];
  segmentmode = 'md';
  showsearchbar = false;
  showsubdepartlist = false;
  shownewagentform = false;
  showlistgrid = true;
  showsaveprogress = false;
  searchsubdepart: string;
  searchdepart: string;
  searchparentdepart: string;
  departname: string;
  departdescription: string;
  headerdepart: Departments;
  newdepartment = this.form.group({
    department_name: ['', Validators.required],
    description: [],
    header_depart: [],
    user_id: [],
    enterprise_id:[],
    subdeparts: []
  });

  constructor(private departmentServ: DepartmentService,private form: FormBuilder, public appserv: AppservicesService) { }

  ngOnInit() {
    const olduser = this.appserv.getactualuser();

    if (olduser) {
      this.getlistdepartments();
    }
    else {
      this.appserv.route.navigateByUrl('/login');
    }
  }
ngAfterViewInit(){
  setTimeout(() => {
    this.defaultinput.setFocus();
  }, 200);
}
  async completedepartmentsnumbers() {
    this.listdepartments.forEach(depart => {
      depart.nbrusers = this.listagents.filter(a => a.department_id == depart.id).length;
    });
  }

  async canclesearchsubdepart() {
    this.showsearchbar = !this.showsearchbar;
  }

  async addsubdepart(dep: Departments) {
    if (this.subdepartments.indexOf(dep) === -1) {
      this.subdepartments.push(dep);
      dep.selected = true;
    }
    else {
      this.subdepartments = this.subdepartments.filter(d => d !== dep);
      dep.selected = false;
    }
  }



  async getlistdepartments() {
    const load = await this.appserv.loadctrl.create({
      mode: 'ios',
      translucent: true,
      message: 'Chargement en cours...',
      spinner: 'crescent'
    });
    load.present();
    this.departmentServ.listdepartments({ id:this.appserv.getactualEse().id}).subscribe({
      next: (res) => {
         console.log('Départements:', res);
        load.dismiss();
        this.listdepartments = res.data;
        this.listdepartmentsprinted = this.listdepartments;
        this.syncingdata();
        this.completedepartmentsnumbers();
       
      },
      error: (err) => {
        console.log(err);
        load.dismiss();
        this.appserv.presentToast('Erreur : ' + err,"danger");
      }
    });
  }

  async syncingdata() {
    this.completedepartmentsnumbers();
    this.getsubdepartments();
    this.getrequestsdepartments();
  }

  async filterall() {
    this.listdepartmentsprinted = this.listdepartments;
  }

  async closemodal() {
    this.appserv.modalCtrl.dismiss();
  }

  async savenewdepartement() {

    if (this.departname && this.departname.length >= 2) {
      const name = this.departname;
      const oldfund = this.listdepartments.filter(d => d.department_name.toLocaleLowerCase() === name.toLocaleLowerCase());
      if (oldfund.length > 0) {
        this.appserv.presentToast('Doublon observé. Un autre département porte le même nom.', 'warning');
      }
      else {
        this.showsaveprogress = true;
        this.newdepartment.patchValue({
          department_name: this.departname,
          subdeparts: this.subdepartments,
          description: this.departdescription,
          user_id: this.appserv.actualUser.id,
          header_depart: this.headerdepart ? this.headerdepart.id : 0,
          enterprise_id:this.appserv.actualUser.enterprise_id
        });
        this.departmentServ.new(this.newdepartment.value).subscribe(
          (data: any) => {
            this.showsaveprogress = false;
            this.listdepartments.push(data.data);
            this.listdepartmentsprinted = this.listdepartments;
            this.appserv.presentToast(`Département ${this.newdepartment.get('department_name').value} ajouté avec succès.`, 'success');
            this.newdepartment.reset();
            this.departname = '';
            this.departdescription = '';
            this.subdepartments = [];
            this.headerdepart = null;
            this.syncingdata();
            this.showsubdepartlist = false;
          },
          error => {
            this.showsaveprogress = false;
            this.appserv.presentToast(`Erreur. Une erreur est survenue lors de l'enregistrement`, 'warning');
          });
      }
    } else {
      this.appserv.presentToast('Veuillez compléter le nom du département svp!', 'warning');
    }
  }

  async gotodepartdetail(depart: Departments) {
    const modal = await this.appserv.modalCtrl.create({
      component:DetaildepartmentComponent,
      componentProps: {departsent: depart },
      cssClass: 'modal-border-radius-20'
    });

    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'deleted') {
      this.listdepartments = this.listdepartments.filter(d => d.id !== depart.id);
    }
  }

  async getrequestsdepartments() {
    this.listdepartments.forEach(depart => {
      // this.appserv.requestsfordepartment(depart.id).subscribe(
      //   data => {
      //     depart.nbrRequests = data.length;
      //   },
      //   error => { }
      // );
    });
  }

  async getsubdepartments() {
    this.listdepartments.forEach(depart => {
      // this.appserv.getsubdepartments(depart.id).subscribe(
      //   data => {
      //     depart.nbrsubdepart = data.length;
      //   },
      //   error => { }
      // );
    });
  }

  async changeparent(depart: Departments) {
    this.headerdepart = depart;
    this.appserv.modalCtrl.dismiss();
  }
}
