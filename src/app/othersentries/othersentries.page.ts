import { Component, OnInit, ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { ExpendituresService } from '../services/expenditures.service';
import { Expenditures } from '../interfaces/expenditures';
import { DetailexpenditureComponent } from '../finances/expenditures/detailexpenditure/detailexpenditure.component';
import { Users } from '../interfaces/users';
import { UserpickerComponent } from '../agents/userpicker/userpicker.component';
import { NewexpenditureComponent } from '../finances/expenditures/newexpenditure/newexpenditure.component';
import { AccountpickerComponent } from '../accounts/accountpicker/accountpicker.component';
import { Accounts } from '../interfaces/accounts';
import { DatepickerComponent } from '../reports/datepicker/datepicker.component';
import { OthersentriesService } from '../services/othersentries.service';
import { menu } from '../module/uzisha/left-menu/data-menu';
import { PrintexpenditureandentryComponent } from '../finances/printexpenditureandentry/printexpenditureandentry.component';
import { OthersEntries } from '../interfaces/otherentries';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-othersentries',
  templateUrl: './othersentries.page.html',
  styleUrls: ['./othersentries.page.scss'],
})
export class OthersentriesPage implements OnInit {
  @ViewChild('defaultinput') defaultinput! : IonInput;
  showcheckbox=false;
  showprogress=false;
  keptexpenditures: Expenditures[]=[];
  listselectedexpenditures:Expenditures[]=[];
  listexpenditures:Expenditures[]=[];
  totalgeneral=0;
  keyword:any;

  constructor(public appserv: AppservicesService, private expenditureserv: ExpendituresService, private entryServ: OthersentriesService) { }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }

  ngOnInit() {
    const object = {user_id:this.appserv.getactualuser().id};
    this.getlist(object);
  }

  totalcalculate(){
    this.totalgeneral=0;
    this.listexpenditures.forEach((expenditure:any) => {
        this.totalgeneral +=expenditure.amount;
    });
  }
  async menuexpenditure(expenditure: Expenditures){

    if(this.showcheckbox){
      const ifexists = this.listselectedexpenditures.indexOf(expenditure);
      if(ifexists==-1){
        this.listselectedexpenditures.push(expenditure);
      }else{
        this.listselectedexpenditures=this.listselectedexpenditures.filter(r=>r!=expenditure);
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
            this.detailexpenditure(expenditure);
          }
        },
        {
          text: 'Imprimer',
          handler: () => {
            this.printexpenditure(expenditure);
          }
        }
      ];

      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('Entrée argent', 'delete'), {
        text: 'Annuler entrée',
        handler: async () => {
          const alert = this.appserv.alertctrl.create({
            header:"Supprimer dépense",
            subHeader:expenditure.amount+' '+ expenditure.abreviation,
            mode:'ios',
            message:"Voulez-vous vraiment supprimer cette entrée?",
            translucent:true,
            buttons:[
              {text:'Non',cssClass:'cancel-button',role:'cancel'},
              {text:'Oui',cssClass:'yes-button',handler:()=>{
                this.deleteEntry(expenditure);
              }}
            ]});
          (await alert).present();
        }
      });
      
      const menu = await this.appserv.actionsheetctrl.create(
        {
          header: `${expenditure.beneficiary_name?expenditure.beneficiary_name:expenditure.uuid}`,
          cssClass: 'myactionsheet',
          translucent: true,
          mode: 'ios',
          buttons: menubuttons
        }
      );

      (await menu).present();
    }
  }

  async deleteEntry(entry: OthersEntries){
    this.showprogress=true;
    this.entryServ.delete(entry).subscribe(
      data=>{
        this.showprogress=false;
        this.appserv.presentToast('Opération supprimée avec succès.','success');
        this.listexpenditures=this.listexpenditures.filter(e=>e!=entry);
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast('Impossible de supprimer cette opération.','warning');
      });
  }

  async printexpenditure(entry: OthersEntries){
    const modal = await this.appserv.modalCtrl.create({
      component:PrintexpenditureandentryComponent,
      componentProps:{'typesent':'entry',"expendituresent":entry},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
  }

  async cancelexpenditure(expenditure: Expenditures){

  }

  async share(expenditure: Expenditures){

  }

  async detailexpenditure(expenditure: Expenditures){
    const modal = await this.appserv.modalCtrl.create({
      component:DetailexpenditureComponent,
      componentProps:{'expendituresent':expenditure,'typesent':"entry"},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  getlist(object: any){
    this.showprogress=true;
    if (this.appserv.isMyDeviceConnected()) {
      this.entryServ.entriesdoneby(object).subscribe(
        data=>{
          this.showprogress=false;
          this.listexpenditures=data;
          this.keptexpenditures=data;
          this.totalcalculate();
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast("Impossible de charger l'historique des entrées","warning");
        });
    } else {
        /**
         * Get Offline List
         */
        this.showprogress=false;
        this.listexpenditures=this.entryServ.getOfflineData();
        this.totalcalculate();
    }
   
  }

  multipledelete(){}

  filterbytype(criteria: string){
    //filter by gestion or caisse account (new algorithm needed)
    this.listexpenditures=this.keptexpenditures.filter(e=>e===criteria);
    this.totalcalculate();
  }

  deletefilter(){
    this.listexpenditures=this.keptexpenditures;
    this.totalcalculate();
  }

  filterbyuser(user: Users){
    this.listexpenditures=this.keptexpenditures.filter(e=>e.user_id===user.id);
    this.totalcalculate();
  }

  async userpicker(){
    const modal = await this.appserv.modalCtrl.create({
        component:UserpickerComponent,
        cssClass:'modal-border-radius-20'
      });
      modal.present();
      const {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        this.filterbyuser(data);
      }
  }

  async newentry(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewexpenditureComponent,
      componentProps:{'title':'Nouvelle entrée argent','isentry':true},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
        this.listexpenditures.unshift(data);
        const alert = await this.appserv.alertctrl.create({
          header:"Impréssion",
          message:"Voulez-vous imprimer un bon d'entrée?",
          mode:"ios",
          translucent:true,
          buttons:[
            {text:"Non",role:"cancel"},
            {text:"Oui",handler:()=>{
              this.printexpenditure(data);
            }}
          ]
        });
        alert.present();
    }
  }

  async accountpicker(){
    const modal = await this.appserv.modalCtrl.create({
      component:AccountpickerComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
     this.listexpenditures=this.keptexpenditures.filter(e=>e.account_id===data.id);
    }
  }

  filterbyaccount(account: Accounts){
    this.listexpenditures=this.keptexpenditures.filter(e=>e.account_id===account.id);
    this.totalcalculate();
  }

  anonyaccount(){
    this.listexpenditures=this.keptexpenditures.filter(e=>e.account_id===null);
    this.totalcalculate();
  }

  async periodfilter(){
    const modal = await this.appserv.modalCtrl.create({
      component:DatepickerComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      const object = {user_id:this.appserv.getactualuser().id,from:data.from,to:data.to};
      this.getlist(object);
    }
  }
}
