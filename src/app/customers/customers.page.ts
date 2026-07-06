import { Component, OnInit, ViewChild } from '@angular/core';
import { Customers } from 'src/app/interfaces/customers';
import { AppservicesService } from 'src/app/services/appservices.service';
import { CustomerscategoriesComponent } from '../articles/customerscategories/customerscategories.component';
import { CustomersService } from '../services/customers.service';
import { CategoryCustomers } from '../interfaces/categoriecustomers';
import { AddnewcustomerComponent } from '../articles/addnewcustomer/addnewcustomer.component';
import { Users } from '../interfaces/users';
import { InfoscustomerComponent } from './infoscustomer/infoscustomer.component';
import { EditcustomerComponent } from './editcustomer/editcustomer.component';
import { ImportComponent } from '../import/import.component';
import { articlePaginator } from '../interfaces/articlespaginator';
import { PageEvent } from '@angular/material/paginator';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  @ViewChild('defaultinput') defaultinput!: IonInput;
  listcustomers: Customers[]=[];
  listselectedcustomers: Customers[]=[];
  actualuser:Users={};
  search: any;

  listcategories:CategoryCustomers[]=[];

  showdefaultprogress=false;
  showcheckbox=false;

   /**
   * pagination options
   */
   paginationOptions : articlePaginator={};

   pageSizeOptions = [];
   hidePageSize = false;
   showPageSizeOptions = false;
   showFirstLastButtons = true;
   disabled = false;
   pageEvent: PageEvent;

  constructor(private customerserv:CustomersService,public appserv: AppservicesService) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    if (this.appserv.permissionFilter('clients', 'view')) {
      this.getcustomerslist();
    }
    if (this.appserv.permissionFilter('customers categories', 'view')) {
      this.getlistcategories();
    }
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }
  PageEventHandled(page: string){
    const url =page==="first-page"?this.paginationOptions.first_page_url:page==="previous-page"?this.paginationOptions.prev_page_url:page==="next-page"?this.paginationOptions.next_page_url:page==="last-page"?this.paginationOptions.last_page_url:"";
    if (this.appserv.isMyDeviceConnected()) {
        if (url!=null) {
        this.showdefaultprogress=true;
        this.appserv.gotoanypaginationurl(url).subscribe(
          data=>{
            this.paginationOptions=data;
            this.showdefaultprogress=false;
            this.listcustomers=data.data;
          },error=>{
            this.showdefaultprogress=false;
          });
      }else{
        this.appserv.presentToast('Aucune donnée à afficher','warning');
      }
    }else{
      this.PageEventHandledByPage(page);
    }
  }

  PageEventHandledByPage(page: string){
    const currentPage =page==="first-page"?1:page==="previous-page"?this.paginationOptions.current_page-1:page==="next-page"?this.paginationOptions.current_page+1:page==="last-page"?this.paginationOptions.last_page:1;
    const data=this.customerserv.getofflinepaginatedbypage(currentPage);
    
    if (typeof data !=="undefined") {
      this.paginationOptions=data;
      this.listcustomers=this.paginationOptions.data; 
    }else{
      this.appserv.presentToast("Aucune donnée trouvée","warning");
    }    
  }

  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }
  async importcsvfile(){
    const modal = await this.appserv.modalCtrl.create(
      {
        component:ImportComponent,
        cssClass:'modal-border-radius-20',
        componentProps:{"criteria":"customer"}
      });
      modal.present();
  
      const {data,role}= await modal.onWillDismiss();
      if(role=='added'){
        this.listcustomers=this.listcustomers.concat(data);
      }
  }
async newcategory(){
  const modal = await this.appserv.modalCtrl.create({
    component:CustomerscategoriesComponent,
    componentProps:{'listcategories':this.listcategories}
  });
  modal.present();

  const {data,role} = await modal.onWillDismiss();
  if(role=='added'){
    this.listcategories.unshift(data);
  }

  if(role=='deleted'){
    this.listcategories=this.listcategories.filter(c=>c!=data);
  }
}

async newcustomer(){
  const modal = await this.appserv.modalCtrl.create({
    component:AddnewcustomerComponent,
    componentProps:{'listcategories':this.listcategories,'search':this.search},
    cssClass:'modal-border-radius-20'
  });
  (await modal).present();

  const {data,role} = await modal.onWillDismiss();
  if(role=='added'){
    this.listcustomers.unshift(data);
  }
}
  async selected(customer: Customers){

  }

  excelexport(){

    if(this.listcustomers.length>0){
      let customers =[['N°','Nom','Type','Téléphone','Adresse mail','Catégorie','Sexe']]; 
      let index=0;
      this.listcustomers.forEach(el => {
        index=index+1;
        const obj :any=[index,el.customerName,el.type,el.phone,el.mail,el.category_name,el.sex];
        customers.push(obj);
      });
  
      this.appserv.exportInToExcel(customers,'csv','clients');  
    }else{
      this.appserv.presentToast(`Liste des clients vide`,'warning');
    }
  }

  getcustomerslist(){
    this.showdefaultprogress=true;
    if (this.appserv.isMyDeviceConnected()) {
        this.customerserv.getallcustomerspaginated(this.appserv.getactualuser().enterprise_id).subscribe(
          data=>{
            console.log('customers paginated',data);
            this.showdefaultprogress=false;
            this.paginationOptions=data;
            this.listcustomers=data.data;
        },
        error=>{
          this.showdefaultprogress=false;
          this.appserv.presentToast("Impossible de charger la liste des clients. Verifier votre connexion","warning");
        });
    } else {
      this.showdefaultprogress=false;
      this.showdefaultprogress=false;
      this.paginationOptions=this.customerserv.getofflinepaginatedbypage();
      if (this.paginationOptions) {
        this.listcustomers=this.paginationOptions.data; 
      }
    } 
  }

async getlistcategories(){
  this.customerserv.getlistcustomerscategories(this.actualuser.enterprise_id).subscribe(
    data=>{
      this.listcategories=data;
    },
    error=>{
      //console.log('erreur lors de loading list customers categories');
    });
}

async multipledelete(){

  const alert = await this.appserv.alertctrl.create({
    header:'Suppression multiple',
    mode:'ios',
    message:`Voulez-vous supprimer ce${this.listselectedcustomers.length>1?'s':''} ${this.listselectedcustomers.length} client${this.listselectedcustomers.length>1?'s':''}? `,
    translucent:true,
    buttons:[
      {text:'Non',role:'cancel'},
      {text:'Oui',handler: async ()=> {
        this.listselectedcustomers.forEach(customer => {
          this.showdefaultprogress=true;
          this.customerserv.deleteonecustomer(customer).subscribe(
            (data:any)=>{
              this.showdefaultprogress=false;
              if(data>0){
                this.listselectedcustomers=this.listselectedcustomers.filter(a=>a!=customer);
                this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
                this.listcustomers=this.listcustomers.filter(a=>a!=customer);
                if(this.listselectedcustomers.length==0){
                  this.showcheckbox=false;
                }
              }else{
                this.appserv.presentToast(`Opération  echouée:`,'warning');
              }
            },
            error=>{
              //console.log(error);
              this.showdefaultprogress=false;
              this.appserv.presentToast(`Suppression impossible`,'danger');
            }
          );
        });
      },}
    ]
  });
  alert.present();
}

async deletecustomer(customer: Customers){
  const alert = await this.appserv.alertctrl.create({
    header:'Suppression',
    subHeader:`${customer.customerName}`,
    mode:'ios',
    translucent:true,
    message:`Voulez-vous vraiment supprimer ce client? `,
    buttons:[
      {text:'Non',role:'cancel'},
      {text:'Oui',handler: async ()=> {
        this.showdefaultprogress=true;
        this.customerserv.deleteonecustomer(customer).subscribe(
          data=>{
            this.showdefaultprogress=false;
            if(data>0){
              this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
              this.listcustomers=this.listcustomers.filter(a=>a!=customer);
            }else{
              this.appserv.presentToast(`Opération echouée:`,'warning');
            }
          },
          error=>{
            //console.log(error);
            this.showdefaultprogress=false;
            this.appserv.presentToast(`Suppression impossible`,'danger');
          }
        );
      },}
    ]
  });
  alert.present();
}

async detailcustomer(customer: Customers){
  const modal = await this.appserv.modalCtrl.create(
    {
      component:InfoscustomerComponent,
      componentProps:{'customersent':customer},
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
    if(role=='edited'){

    }

    if(role=='deleted'){
        this.listcustomers=this.listcustomers.filter(c=>c!=customer);
    }
}

async customermenu(customer : Customers){

    if(this.showcheckbox){
      const ifexists = this.listselectedcustomers.indexOf(customer);
      if(ifexists==-1){
        this.listselectedcustomers.push(customer);
      }else{
        this.listselectedcustomers=this.listselectedcustomers.filter(r=>r!=customer);
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
            this.detailcustomer(customer);
          }
        },
      ];
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('clients', 'edit'),
      {
        text: 'Modifier',
        handler: () => {
          this.editcustomer(customer);
        }
      })
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('clients', 'delete'),
      {
        text: 'Supprimer',
        handler: () => {
          this.deletecustomer(customer);
        }
      })
      const menu = await this.appserv.actionsheetctrl.create(
        {
          header: `${customer.customerName}`,
          cssClass: 'myactionsheet',
          translucent: true,
          mode: 'ios',
          buttons: menubuttons
        }
      );

      (await menu).present();
    }
  }

  async editcustomer(customer: Customers){
    const modal = await this.appserv.modalCtrl.create({
      component:EditcustomerComponent,
      componentProps:{'customersent':customer},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }
}
