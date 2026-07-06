import { Component, OnInit } from '@angular/core';
import { ConversionMoney } from 'src/app/interfaces/conversionmoneys';
import { AppservicesService } from 'src/app/services/appservices.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Money } from 'src/app/interfaces/money';
import { MoneyService } from 'src/app/services/money.service';
import { ConversionMoneysService } from 'src/app/services/conversion-moneys.service';
import { SelectmoneyComponent } from 'src/app/selectmoney/selectmoney.component';
@Component({
  selector: 'app-newconversion',
  templateUrl: './newconversion.component.html',
  styleUrls: ['./newconversion.component.scss'],
})
export class NewconversionComponent implements OnInit {
  showsaveprogress=false;
  listconversions:ConversionMoney[]=[];
  listmoney:Money[]=[];
  actualMoney1:Money={};
  actualMoney2:Money={};
  rate=0;
  newconversion = this.form.group(
    {
      money_id1: [],
      money_id2: [],
      rate: [1, Validators.required],
      operator: [''],
      user_id:[],
      enterprise_id:[]
    });

  constructor(public appserv: AppservicesService, private form: FormBuilder, private moneyserv: MoneyService, private conversionserv:ConversionMoneysService) { }

  ngOnInit() {
    this.getlistconversion(); 
    this.getlistmoney();
  }
  
  async moneypicker1(){
    const modal = await this.appserv.modalCtrl.create({
      component:SelectmoneyComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      if(this.actualMoney2 && this.actualMoney2.id==data.id){
        this.msgsamemoney;
      }else{
        this.actualMoney1=data;
      }
    }
  } 
  
  async moneypicker2(){
    const modal = await this.appserv.modalCtrl.create({
      component:SelectmoneyComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      if(this.actualMoney1 && this.actualMoney1.id==data.id){
        this.msgsamemoney();
      }else{
        this.actualMoney2=data;
      }
    }
  }

  msgsamemoney(){
    this.appserv.presentToast(`Veuillez choisir une autre monnaie différente de celle-ci.`,`warning`);
  }

  getlistconversion() {
    this.conversionserv.getListConversionsApi(this.appserv.getactualEse().id).subscribe(
      data => {
        this.listconversions = data;
        this.conversionserv.setOfflineData(data);
      },
      error => {
        this.listconversions=this.conversionserv.getOfflineData();
      }
    );
  }

  async getlistmoney() {
    this.moneyserv.getlistmonnaiesapi(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.listmoney=data;
        this.moneyserv.setOfflineData(data);
      },
      error=>{
        //get offline money
        this.listmoney=this.moneyserv.getOfflineData();
      }
    );
  }

  syncingform(){
    this.newconversion.patchValue({
      money_id1:this.actualMoney1.id,
      money_id2:this.actualMoney2.id,
      rate:this.rate,
      operator:'',
      enterprise_id:this.appserv.getactualEse().id,
      user_id:this.appserv.getactualuser().id
    });
  }

  async saveconversion() {
    
    if(this.rate>0){
      this.showsaveprogress=true;
      this.syncingform();
      if (this.newconversion.getRawValue().money_id1 && this.newconversion.getRawValue().money_id2 && this.newconversion.getRawValue().rate) {
        this.conversionserv.newConversionApi(this.newconversion.value).subscribe(
          data => {
            this.showsaveprogress=false;
            this.listconversions.push(data.original);
            this.newconversion.reset();
            this.conversionserv.addToOffline(data.original);
            this.appserv.presentToast('Conversion enregistrée avec succès', 'success');
            this.appserv.modalCtrl.dismiss(data.original,'added');
          },
          error => {
            this.showsaveprogress=false;
            /**
             * Save Offline
             */
            let object ={
              abreviation1:this.actualMoney1.abreviation,
              name1: this.actualMoney1.money_name,
              abreviation2:this.actualMoney2.abreviation,
              name2: this.actualMoney2.money_name,
              id:0,
              money_id1: this.actualMoney1.id,
              money_id2: this.actualMoney2.id,
              rate:this.rate,
              operator: '',
              user_id:this.appserv.getactualuser().id,
              enterprise_id:this.appserv.getactualEse().id,
              created_at: this.appserv.getDateTime(),
              updated_at:this.appserv.today
            };
            this.conversionserv.addToOffline(object);
            this.conversionserv.addToSyncingOffline(this.newconversion.value);
          }
        );
      } else {
        this.appserv.presentToast(`Vous devez séléctionner les données monnaies`, 'warning');
      }
    }else{
      this.appserv.presentToast(`Le taux de change doit être supérieur à 0`, 'warning');
    }
    
  }

}
