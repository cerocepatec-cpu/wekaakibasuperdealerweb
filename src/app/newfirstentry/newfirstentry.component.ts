import { Component, Input, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { InvoicePrintComponent } from '../module/uzisha/home/invoice-print/invoice-print.component';
import { Users } from '../interfaces/users';
import { MembersaccountsService } from '../services/membersaccounts.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Money } from '../interfaces/money';
import { Tubs } from '../interfaces/tubs';
import { MoneyService } from '../services/money.service';
import { UserpickerComponent } from '../agents/userpicker/userpicker.component';
import { UsersService } from '../services/users.service';
@Component({
  selector: 'app-newfirstentry',
  templateUrl: './newfirstentry.component.html',
  styleUrls: ['./newfirstentry.component.scss'],
})
export class NewfirstentryComponent implements OnInit {
  @Input() usersent:Users={};
  @Input() firstentrysent:any={};
  listtubs: Tubs[]=[];
  listmoney: Money[]=[];
  actualcollector:Users={};
  actualfund:Tubs={};
  showprogress=false;
  firstentryform=this.fb.group(
    {
      id:[],
      amount:[0,Validators.required],
      description:[],
      done_by_id:[0,Validators.required],
      member_id:[0,Validators.required],
      collector_id:[0,Validators.required],
      money_id:[0,Validators.required],
      sync_status:[],
      cashed:[],
      cashed_by:[],
      cashed_at:[],
      fund:[],      
      enterprise_id:[0,Validators.required],
      done_at:[]
    });
  constructor(private userserv:UsersService, private moneyserv:MoneyService, private fb: FormBuilder,public appserv: AppservicesService,private memberserv:MembersaccountsService) { }

  ngOnInit() {
    this.getlistMoney();
    this.getlistTubs();
    if (this.firstentrysent.id) {
      // console.log("first entry to edit",this.firstentrysent);
      this.firstentryform.patchValue({
        id:this.firstentrysent.id,
        amount:this.firstentrysent.amount,
        description:this.firstentrysent.description,
        done_by_id:this.firstentrysent.done_by_id,
        member_id:this.firstentrysent.member_id,
        collector_id:this.firstentrysent.collector_id,
        money_id:this.firstentrysent.money_id,
        sync_status:this.firstentrysent.sync_status,
        cashed:this.firstentrysent.cashed,
        cashed_by:this.firstentrysent.cashed_by,
        fund:this.firstentrysent.fund,
        enterprise_id:this.firstentrysent.enterprise_id,
        done_at:this.firstentrysent.done_at
      });
      this.lookingforcollector();
    }else{
      this.firstentryform.patchValue({
        member_id:this.usersent.id,
        cashed:0,
        done_by_id:this.appserv.actualUser.id,
        enterprise_id:this.appserv.actualEse.id,
        done_at:this.appserv.defaultdate(),
      });
    }
   
  }

  fundchanged($event){
    console.log('fund changed',$event);
    if (parseInt($event)) {
      const fund = this.listtubs.find(f => f.id === parseInt($event)) ?? null;
      if (fund) {
        this.firstentryform.patchValue({
          money_id:fund.money_id
        });
      }
    }
  }

  async lookingforcollector(){
    this.userserv.getuserbyid(this.firstentrysent.collector_id).subscribe(
      response=>{
        this.actualcollector=response;
        console.log('collector lokkup',response);
      },
      error=>{
        console.log('error',error);
      });
  }

  async agentsfilter(){
    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{criteria:"single",usertype:'collectors'},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="selected") {
     this.actualcollector=data;
     this.firstentryform.patchValue({
      collector_id:this.actualcollector.id
     });
    }
  }

  getlistMoney(){
    this.moneyserv.getlistmonnaiesapi(this.appserv.actualEse.id).subscribe(
      data=>{
        this.listmoney=data;
      },
      error=>{
        this.appserv.presentToast('Erreur survenue lors de la recupération de la liste des monnaies.','danger');
      });
  } 
  getlistTubs(){
    this.appserv.myTubs(this.appserv.actualUser.id).subscribe(
      data=>{
        this.listtubs=data;
      },
      error=>{
        this.appserv.presentToast('Erreur survenue lors de la recupération de la liste des caisses.','danger');
      }
    );
  }

  async validateoperation(){
    if (this.firstentryform.getRawValue().fund && this.firstentryform.getRawValue().collector_id && this.firstentryform.getRawValue().amount && this.firstentryform.getRawValue().money_id) {
          const alert  = await this.appserv.alertctrl.create({
          header:this.firstentrysent.id>0?"Modification":"Validation",
          message:`Validez-vous cette opération?`,
          mode:'ios',
          translucent:true,
          buttons:[
            {text:'Non',role:'cancel'},
            {text:'Oui',handler:()=> {
              if (this.firstentrysent.id>0) {
                this.updatefirstentry();
              }else{
                this.sendtransaction();
              }  
            },}
          ]
        });
        alert.present();
    }else{
      this.appserv.presentToast("Vous devez obligatoirement toutes les informations necessairess svp!. Caisse, monnaie, montant et Collecteur.","warning");
    }
  
  }  

  async sendtransaction(){
    this.showprogress=true;
    this.memberserv.membernewfirstentry(this.firstentryform.value).subscribe(
      response=>{
        this.showprogress=false;
        console.log('new first entry',response);
      
        if (response.message==="success" && response.status===200) {
          this.appserv.presentToast(`Première mise faite avec succès!`,"success");
          this.appserv.modalCtrl.dismiss(response.data,'added');
        } 
        
        if (response.message==="error" && response.error==="no account find") {
          console.log('error new transaction',response.error);
          this.appserv.presentToast("Une erreur est survenue. Veuillez réessayer plus tard!","warning");
        } 
      },
      error=>{
        this.showprogress=false;
        console.log('error new transaction',error);
        this.appserv.presentToast("Une erreur est survenue. Veuillez réessayer plus tard!","danger");
      });
  } 
  
  async updatefirstentry(){
    this.showprogress=true;
    this.memberserv.updatefirstentry(this.firstentryform.value).subscribe(
      response=>{
        this.showprogress=false;
        console.log('updqted first entry',response);
      
        if (response.message==="success" && response.status===200) {
          this.appserv.presentToast(`Première mise modifiée avec succès!`,"success");
          this.appserv.modalCtrl.dismiss(response.data,'updated');
        } 
        
        if (response.message==="error" && response.error==="no account find") {
          
        } 
      },
      error=>{
        this.showprogress=false;
        console.log('error new transaction',error);
        this.appserv.presentToast("Une erreur est survenue. Veuillez réessayer plus tard!","danger");
      });
  }
  
  async alertprintoperation(data:any){
    const alert  = await this.appserv.alertctrl.create({
      header:"Félicitation!",
      message:"Opération terminée avec succès!",
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Imprimer',handler:async()=> {
          const modalprint = await this.appserv.modalCtrl.create({
            component:InvoicePrintComponent,
            componentProps:{criteria:'firstmise',datasent:data}
          });
          modalprint.present();
      },},
        {text:'Fermer',role:'cancel'}
      ]
    });
    alert.present();
  }
  async beforeleft(){
    const alert  = await this.appserv.alertctrl.create({
      header:"Attention!",
      message:"Vous avez une activité en cours! Voulez-vous vraiment fermer cette fenêtre?",
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=> {
            this.appserv.closemodal();
        },}
      ]
    });
    alert.present();
  }
}
