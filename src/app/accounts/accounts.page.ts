import { Component, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { Accounts } from 'src/app/interfaces/accounts';
import { AccountService } from '../services/account.service';
import { InfosaccountComponent } from './infosaccount/infosaccount.component';
import { EditaccountComponent } from './editaccount/editaccount.component';
import { NewaccountComponent } from './newaccount/newaccount.component';
import { ImportComponent } from '../import/import.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {

  showcheckbox=false;
  showprogress=false;
  keptaccounts: Accounts[]=[];
  listselectedaccounts: Accounts[]=[];
  listaccounts: Accounts[]=[];
  deletedaccounts: Accounts[]=[];
  keyword:any;
  constructor(public appserv: AppservicesService, private accountserv: AccountService) { }

  ngOnInit() {
    this.getlist(this.appserv.getactualuser().enterprise_id);
  }

  exportcsv(){
    if(this.listaccounts.length>0){
      let customers =[['N°','Nom','Type','Description']]; 
      let index=0;
      this.listaccounts.forEach(el => {
        index=index+1;
        const obj :any=[index,el.name,el.type,el.description];
        customers.push(obj);
      });
      this.appserv.exportInToExcel(customers,'csv','comptes');  
    }else{
      this.appserv.presentToast(`Liste des comptes vide`,'warning');
    }
  }
  async import(){
    const modal = await this.appserv.modalCtrl.create(
      {
        component:ImportComponent,
        cssClass:'modal-border-radius-20',
        componentProps:{"criteria":"accounts"}
      });
      modal.present();
  
      const {data,role}= await modal.onWillDismiss();
      if(role=='added'){
        this.listaccounts=this.listaccounts.concat(data);
      }
  }

  async menuaccount(account: Accounts){

    if(this.showcheckbox){
      const ifexists = this.listselectedaccounts.indexOf(account);
      if(ifexists==-1){
        this.listselectedaccounts.push(account);
      }else{
        this.listselectedaccounts=this.listselectedaccounts.filter(r=>r!=account);
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
            this.detailaccount(account);
          }
        },
      ];
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('comptes', 'edit'), {
        text: 'Modifier',
        handler: () => {
          this.editaccount(account);
        }
      });
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('comptes', 'delete'), {
        text: 'Supprimer',
        handler: () => {
          this.deleteaccount(account);
        }
      });
      const menu = await this.appserv.actionsheetctrl.create(
        {
          header: `${account.name}`,
          cssClass: 'myactionsheet',
          translucent: true,
          mode: 'ios',
          buttons: menubuttons
        }
      );

      (await menu).present();
    }
  }

  async deleteaccount(account: Accounts){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression',
      subHeader:`${account.name}`,
      message:'Voulez-vous vraiment supprimer ce compte?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.showprogress=true;
          this.accountserv.delete(account).subscribe(
            data=>{
              this.showprogress=false;
              if(data>0){
                this.appserv.presentToast(`Compte supprimé avec succès`,'success');
                this.listaccounts=this.listaccounts.filter(a=>a!=account);
                this.keptaccounts=this.keptaccounts.filter(a=>a!=account);
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

  async editaccount(account: Accounts){
    const modal = await this.appserv.modalCtrl.create({
      component:EditaccountComponent,
      componentProps:{'accountsent':account},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async detailaccount(account: Accounts){
    const modal = await this.appserv.modalCtrl.create({
      component:InfosaccountComponent,
      componentProps:{'accountsent':account},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='deleted'){
      this.listaccounts=this.listaccounts.filter(a=>a!=account);
    }
  }

  getlist(object: any){
    this.showprogress=true;
    if (this.appserv.isMyDeviceConnected()) {
      this.accountserv.getall(object).subscribe(
        data=>{
          this.showprogress=false;
          this.listaccounts=data;
          this.keptaccounts=data;
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast(`Erreur survenue lors du chargement des comptes. Vérifiez votre connexion`,'danger');
        });
    } else {
      this.showprogress=false;
      this.listaccounts=this.accountserv.getOfflineData();
      this.keptaccounts=this.listaccounts; 
    }
  }

  async multipledelete(){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression multiple',
      mode:'ios',
      message:`Voulez-vous supprimer ce${this.listselectedaccounts.length>1?'s':''} ${this.listselectedaccounts.length>1?this.listselectedaccounts.length:""} compte${this.listselectedaccounts.length>1?'s':''}? `,
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.listselectedaccounts.forEach(account => {
            this.showprogress=true;
            this.accountserv.delete(account).subscribe(
              data=>{
                this.showprogress=false;
                if(data>0){
                  this.listselectedaccounts=this.listselectedaccounts.filter(a=>a!=account);
                  this.deletedaccounts.push(account);
                  if(this.listselectedaccounts.length==0){
                    this.appserv.presentToast(`${this.deletedaccounts.length} suppression${this.deletedaccounts.length>1?'s':''} effectuée${this.deletedaccounts.length>1?'s':''} avec succès`,'success');
                  }

                  this.listaccounts=this.listaccounts.filter(a=>a!=account);
                  if(this.listselectedaccounts.length==0){
                    this.showcheckbox=false;
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

  filterbytype(criteria: string){
    this.listaccounts=this.keptaccounts.filter(a=>a.type===criteria);
  }

  deletefilter(){
    this.listaccounts=this.keptaccounts;
  }

   async newaccount(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewaccountComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
        this.listaccounts.unshift(data);
    }
  }


  async share(){
    this.appserv.sharedata('Cero apps',`Partager l'application avec ceux qui vous sont chers et rendez leur vie facile grâce à la solution CERO UZISHA`,'https://e-zezo.com');
  }
}
