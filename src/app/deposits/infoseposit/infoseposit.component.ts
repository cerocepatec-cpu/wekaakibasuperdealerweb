import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Deposits } from 'src/app/interfaces/deposit';
import { AppservicesService } from 'src/app/services/appservices.service';
import { DepositsService } from 'src/app/services/deposits.service';
import { ListviewerComponent } from 'src/app/stock/listviewer/listviewer.component';
import { EditpositComponent } from '../editposit/editposit.component';
import { InventorydepositComponent } from '../inventorydeposit/inventorydeposit.component';
import { StockvalorisationComponent } from '../stockvalorisation/stockvalorisation.component';
import { ServicesviewerComponent } from '../servicesviewer/servicesviewer.component';
import { UsersviewerComponent } from '../usersviewer/usersviewer.component';
import { ReportsService } from 'src/app/services/reports.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-infoseposit',
  templateUrl: './infoseposit.component.html',
  styleUrls: ['./infoseposit.component.scss'],
})
export class InfosepositComponent implements OnInit {
  @Input() depositsent: Deposits={};
  stockhistories: any[]=[];
  keptstockhistories: any[]=[];
  showprogress=false;
  invoicetypefilter='all';
  showentries=true;
  showWithdraw=true;
  totalgeneral=0;

  constructor(public appserv: AppservicesService, private depositserv: DepositsService,private reportserv: ReportsService) { }

  ngOnInit() {
    this.gethistorystock();
  }

  async gotostockvalorisation(){

    const modal = await this.appserv.modalCtrl.create({
      component:StockvalorisationComponent,
      componentProps:{'depositsent':this.depositsent},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async gotoinventory(){

    const modal = await this.appserv.modalCtrl.create({
      component:InventorydepositComponent,
      componentProps:{'depositsent':this.depositsent},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async gotoservicesviewer(){

    const modal = await this.appserv.modalCtrl.create({
      component:ServicesviewerComponent,
      componentProps:{'depositsent':this.depositsent},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async gotousersviewer(){

    const modal = await this.appserv.modalCtrl.create({
      component:UsersviewerComponent,
      componentProps:{'depositsent':this.depositsent},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }
  
  async gotoedit(){

    const modal = await this.appserv.modalCtrl.create({
      component:EditpositComponent,
      componentProps:{'depositsent':this.depositsent},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  
      const {data,role}= await modal.onWillDismiss();
        if(role=='edited'){
       this.depositsent.name=data.name;
       this.depositsent.description=data.description;
      }
  }

 async deletedeposit(deposit: Deposits){
   
      const alert = await this.appserv.alertctrl.create({
        header:'Suppression',
        subHeader:`${deposit.name}`,
        mode:'ios',
        translucent:true,
        buttons:[
          {text:'Non',role:'cancel'},
          {text:'Oui',handler: async ()=> {
            this.showprogress=true;
            this.depositserv.deleteone(deposit).subscribe(
              data=>{
                this.showprogress=false;
                if(data>0){
                  this.appserv.modalCtrl.dismiss(this.depositsent,'deleted');
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

  printgeneralreport(deposit: Deposits){

  }
  totalcalculate(){
    if (this.showWithdraw && this.showentries) {
      this.totalgeneral=0;
      this.stockhistories.forEach(element => {
        this.totalgeneral +=element.sold;
      });
    }

    if(!this.showWithdraw && this.showentries){
      this.totalgeneral=0;
      this.stockhistories.forEach(element => {
        this.totalgeneral +=element.totalEntries;
      });
    }  
    
    if(this.showWithdraw && !this.showentries){
      this.totalgeneral=0;
      this.stockhistories.forEach(element => {
        this.totalgeneral +=element.totalWithdraw;
      });
    }
  }

  filter(criteria: string){
    switch (criteria) {
      case 'entry':
        this.showentries=true;
        this.showWithdraw=false;
        this.totalcalculate();
        break;
      case 'withdraw':
        this.showentries=false;
        this.showWithdraw=true;
        this.totalcalculate(); 
        break;
      default:
        this.showWithdraw=true;
        this.showentries=true;
        this.totalcalculate();
        break;
    }
  }
  async gotoviewer(){
    const modal = await this.appserv.modalCtrl.create({
      component:ListviewerComponent,
      componentProps:{'listsent':this.keptstockhistories},
      cssClass:'modal-border-radius-20'
    })
    modal.present();
    
  }

  gethistorystock(){
    //daily report
    this.showprogress=true;
    let deposits=[];
    let articles=[];
    deposits.push(this.depositsent.id);
    
    this.reportserv.stockReportByDeposits({user_id:this.appserv.actualUser.id,deposits:deposits,services:articles,from:this.appserv.defaultdate(),to:this.appserv.defaultdate()}).subscribe(
      (data:any)=>{
        this.showprogress=false;
        this.stockhistories=data.data[0].services;
        this.keptstockhistories=data.data[0].services;
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de charger l'historique des entrées-sorties`,'danger');
      }
    )
  }

}
