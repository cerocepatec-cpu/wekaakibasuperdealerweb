import { Component, OnInit, Input } from '@angular/core';
import { Accounts } from 'src/app/interfaces/accounts';
import { Expenditures } from 'src/app/interfaces/expenditures';
import { AppservicesService } from 'src/app/services/appservices.service';
import { ExpendituresService } from 'src/app/services/expenditures.service';
import { EditaccountComponent } from '../editaccount/editaccount.component';
import { AccountService } from 'src/app/services/account.service';
import { GeneralreportComponent } from '../generalreport/generalreport.component';
import { OthersEntries } from 'src/app/interfaces/otherentries';
import { OthersentriesService } from 'src/app/services/othersentries.service';

@Component({
  selector: 'app-infosaccount',
  templateUrl: './infosaccount.component.html',
  styleUrls: ['./infosaccount.component.scss'],
})
export class InfosaccountComponent implements OnInit {
@Input()  accountsent:Accounts={};
showprogress=false;
totalexpenditures=0;
totalentries=0;
listexpenditures:Expenditures[]=[];
entrires:Expenditures[]=[];
typeoperation='all';
entries:OthersEntries[]=[];
  constructor(public appserv: AppservicesService,private expenditureserv: ExpendituresService,private entriesserv: OthersentriesService, private accountserv: AccountService) { }

  ngOnInit() {
    const object ={account_id:this.accountsent.id};
    this.getlist(object);
    this.getlistentries();
  }

  async gotoedit(){
      const modal = await this.appserv.modalCtrl.create({
        component:EditaccountComponent,
        componentProps:{'accountsent':this.accountsent}
      });
      modal.present();
  }

  async deleteproduct(){

    const alert = await this.appserv.alertctrl.create({
      header:'Suppression',
      subHeader:`${this.accountsent.name}`,
      message:'Voulez-vous vraiment supprimer ce compte?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.showprogress=true;
          this.accountserv.delete(this.accountsent).subscribe(
            data=>{
              this.showprogress=false;
              if(data>0){
                this.appserv.presentToast(`Compte supprimé avec succès`,'success');
                this.appserv.modalCtrl.dismiss(this.accountsent,'deleted');
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

  async printgeneraldetail(){
    const modal = await this.appserv.modalCtrl.create({
      component:GeneralreportComponent,
      componentProps:{'accountsent':this.accountsent}
    });
    modal.present();
  }

  expenditurestotal(){
    this.totalexpenditures=0;
    this.listexpenditures.forEach((expenditure:any) => {
        this.totalexpenditures +=expenditure.amount;
    });
  }

  getlist(object: any){
    this.showprogress=true;
    this.expenditureserv.filterbyaccount(object).subscribe(
      data=>{
        this.showprogress=false;
        this.listexpenditures=data;
        this.expenditurestotal();
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Erreur survenue lors du chargement des depenses. Verifiviez votre connexion`,'danger');
      }
    )
  } 
  
  getlistentries(){
    this.showprogress=true;
    this.entriesserv.foranaccount(this.accountsent).subscribe(
      data=>{
        this.showprogress=false;
        this.entries=data;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Erreur survenue lors du chargement des entrée. Verifiviez votre connexion`,'danger');
      }
    )
  }
}
