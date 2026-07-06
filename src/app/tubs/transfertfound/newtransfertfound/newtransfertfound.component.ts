/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tubs } from 'src/app/interfaces/tubs';
import { AppservicesService } from 'src/app/services/appservices.service';
import { PicktubsComponent } from '../../picktubs/picktubs.component';
import { ConversionMoney } from 'src/app/interfaces/conversionmoneys';
import { MoneyService } from 'src/app/services/money.service';
import { ConversionMoneysService } from 'src/app/services/conversion-moneys.service';

@Component({
  selector: 'app-newtransfertfound',
  templateUrl: './newtransfertfound.component.html',
  styleUrls: ['./newtransfertfound.component.scss'],
})
export class NewtransfertfoundComponent implements OnInit {
@Input() tubSent: Tubs={};
listconversions: ConversionMoney[]=[];
receiverTub: Tubs={};
showconvertedamount=false;
showprogress=false;
newtransfert = this.fb.group({
  amount:[0,Validators.required],
  type: [],
  comment:[],
  money_id:[],
  sender_id:[],
  tubSender_id:[],
  tubReceiver_id:[],
  rate: [],
  enterprise_id:[0],
  converted_amount:[],
  date_operation:[]
});
  constructor(private moneyserv:MoneyService, private conversionserv:ConversionMoneysService,private fb: FormBuilder, public appserv: AppservicesService) { }

  ngOnInit() {
    this.getconversions();
  }

  getconversions(){
    this.conversionserv.getListConversionsApi(this.appserv.actualEse.id).subscribe(
      data=>{
        this.listconversions=data;
      },
      error=>{
        this.appserv.presentToast(`Impossible de charger la liste des conversions`, 'warning');
      }
    );
  }
async picktubs(criteria?: string){
  const modal = await this.appserv.modalCtrl.create({
    component:PicktubsComponent,
    cssClass:'modal-border-radius-20',
  });

  modal.present();
  const {data,role} = await modal.onWillDismiss();
  if(role == 'selected'){
    if(criteria=='tub1'){
      if(this.receiverTub.id){
        if (this.tubSent.id==data.id || data.id==this.receiverTub.id) {
          this.appserv.presentToast(`Veuillez sélectionner une autre caisse`,'warning');
        }else{
          if(this.tubSent.money_id==data.money_id){
            this.tubSent=data;
            this.newtransfert.patchValue({
              rate:1
            });
          }else{
            const alert = await this.appserv.alertctrl.create({
              header:'Avertissement',
              message:`La caisse expeditrice et celle destinataire n'ont pas la même monnaie. Voulez-vous continuer malgré tout? `,
              mode:'ios',
              translucent:true,
              buttons:[
                {text:'Annuler',role:'cancel'},
                {text:'Continuer',handler: async ()=>{
                 this.moneydifferents(data,criteria);
                }}
              ]
            });
            alert.present();
          }
        }
      }else{
        this.tubSent=data;
      }
    }else{
      if(this.tubSent.id){
        if (this.tubSent.id==data.id) {
          this.appserv.presentToast(`Veuillez sélectionner une autre caisse`,'warning');
        }else{
          if(this.tubSent.money_id==data.money_id){
            this.receiverTub=data;
            this.newtransfert.patchValue({
              rate:1
            });
          }else{
            const alert = await this.appserv.alertctrl.create({
              header:'Avertissement',
              message:`La caisse expéditrice et celle destinataire n'ont pas la même monnaie. Voulez-vous continuer malgré tout? `,
              mode:'ios',
              translucent:true,
              buttons:[
                {text:'Annuler',role:'cancel'},
                {text:'Continuer',handler: async ()=>{
                 this.moneydifferents(data,criteria);
                }}
              ]
            });
            alert.present();
          }
        }
      }else{
        this.receiverTub=data;
      }
    }
  }
}

moneydifferents(tub: Tubs,criteria?: string){
  // this.newpayment.fund_id = tub.id;
  tub.cssclass = 'ionsuccess';
  if(criteria=='tub1'){
    this.tubSent = tub;
  }else{
    this.receiverTub=tub;
  }
  //looking for conversions
  let conversions=this.listconversions.filter(c=>c.money_id2===tub.id && c.money_id1===this.tubSent.money_id);
  if(conversions.length>0){
    this.showconvertedamount=true;
    this.newtransfert.patchValue({
      converted_amount:this.newtransfert.getRawValue().amount*conversions[0].rate,
      rate:conversions[0].rate
    });
  }else{
    conversions=this.listconversions.filter(c=>c.money_id2===this.tubSent.money_id && c.money_id1===tub.id);
    if(conversions.length>0){
      //conversion funded
      this.showconvertedamount=true;
      this.newtransfert.patchValue({
        rate:Math.round(1/conversions[0].rate),
        converted_amount:this.newtransfert.getRawValue().amount*this.newtransfert.getRawValue().rate,
      });
    }else{
      //the user must enter the rate manually
      this.showconvertedamount=true;
      let newrate=0;
      while (newrate<=0) {
        newrate=parseFloat(prompt(`Veuillez entrer un taux s'il vous plaît`));
      }
      this.newtransfert.patchValue({
        rate:newrate,
        converted_amount:this.newtransfert.getRawValue().amount*this.newtransfert.getRawValue().rate,
      });
    }
  }
}

ratechanging(){
  if(this.tubSent.money_id===this.receiverTub.money_id){
    this.newtransfert.patchValue({
      rate:1,
      converted_amount:this.newtransfert.getRawValue().amount
    });
  }else{
    this.newtransfert.patchValue({
      converted_amount:this.newtransfert.getRawValue().amount*this.newtransfert.getRawValue().rate
    });
  }
}
  async addnewtransfert(){
    if (this.newtransfert.getRawValue().date_operation) {
        if(this.receiverTub.id){
          if(this.tubSent.id){
            if(this.newtransfert.getRawValue().amount>0){
              this.newtransfert.patchValue({
                enterprise_id:this.appserv.actualUser.enterprise_id,
                sender_id:this.appserv.actualUser.id,
                tubReceiver_id:this.receiverTub.id,
                tubSender_id:this.tubSent.id,
                money_id:this.tubSent.money_id,
                type:'withdraw'
              });
              this.showprogress=true;
              this.appserv.newtransfert(this.newtransfert.value).subscribe(
                (data: any)=>{
                  this.showprogress=false;
                  if(data.message=='success'){
                    this.appserv.presentToast(`Transfert effectué avec succes`,'success');
                    //update tub amount
                    console.log(data);
                    this.tubSent.sold=this.tubSent.sold-data.data.amount;
                    this.appserv.modalCtrl.dismiss(data,'added');
                  }else if(data.message=='sold not enough'){
                    this.appserv.presentToast(`Solde de la caisse expéditrice insuffisant.`,'warning');
                  }
                  else{
                    this.appserv.presentToast(`Transfert échoué, veuillez réessayer plus tard.`,'warning');
                  }
                },
                error=>{
                  this.showprogress=false;
                  this.appserv.presentToast(`Une erreur est survenue, transfert échoué, veuillez réessayer plus tard.`,'danger');
                });
            }else{
              this.appserv.presentToast(`Veuillez entrer un montant à transférer svp!`,'warning');
            }
          }else{
            this.appserv.presentToast(`Vous devez selectionner une caisse expeditrice`,'warning');
          }
      }else{
        this.appserv.presentToast(`Veuillez sélectionner une caisse destinataire svp!`,'warning');
      }
    } else {
      this.appserv.presentToast('Veuillez entrer une date svp!','warning');
    }
  }

}
