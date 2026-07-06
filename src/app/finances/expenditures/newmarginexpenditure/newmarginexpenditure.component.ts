import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MarginsSettings } from 'src/app/interfaces/margins-settings';
import { Money } from 'src/app/interfaces/money';
import { AppservicesService } from 'src/app/services/appservices.service';
import { MarginsSettingsService } from 'src/app/services/margins-settings.service';
import { MoneyService } from 'src/app/services/money.service';

@Component({
  selector: 'app-newmarginexpenditure',
  templateUrl: './newmarginexpenditure.component.html',
  styleUrls: ['./newmarginexpenditure.component.scss'],
})
export class NewmarginexpenditureComponent implements OnInit {
  @Input() marginSent:MarginsSettings={};
showprogress=false;
listmoneys: Money[]=[];
newMargin = this.fb.group({
    id:[],
    description:['',Validators.required],
    minimum:[],
    maximum:['',Validators.required],	
    user_id:[],	
    money_id:[],	
    enterprise_id:[]
});
  constructor(private fb: FormBuilder, public appserv: AppservicesService, private moneyserv: MoneyService, private marginServ: MarginsSettingsService) { }

  ngOnInit() {
    this.getlistmoney();
    if (this.marginSent) {
      this.syncingdata();
    }
  }

  syncingdata(){
    this.newMargin.patchValue({
      id:this.marginSent.id,
      description:this.marginSent.description,
      user_id:this.marginSent.user_id,
      enterprise_id:this.marginSent.enterprise_id,
      minimum:this.marginSent.minimum,
      maximum:this.marginSent.maximum,
      money_id:this.marginSent.money_id
    });
  } 
  
  revercingdata(dataSent: MarginsSettings){
      this.marginSent.id=dataSent.id;
      this.marginSent.description=dataSent.description;
      this.marginSent.user_id=dataSent.user_id;
      this.marginSent.enterprise_id=dataSent.enterprise_id;
      this.marginSent.minimum=dataSent.minimum;
      this.marginSent.maximum=dataSent.maximum;
      this.marginSent.money_id=dataSent.money_id
  }

  addNewMargin(){
    if (!this.marginSent.id) {
      if (this.newMargin.valid) {
        this.showprogress=true;
        this.newMargin.patchValue({
          user_id:this.appserv.actualUser.id,
          enterprise_id:this.appserv.actualEse.id
        });
        this.marginServ.new(this.newMargin.value).subscribe(
          data=>{
            this.showprogress=false;
            this.appserv.modalCtrl.dismiss(data,'added');
            this.appserv.presentToast("Nouvelle marge ajoutée avec succès",'success');
          },
          error=>{
            this.showprogress=false;
            this.appserv.presentToast("Erreur survenue lors de l'ajout de la marge",'danger');
          });
      }else{
        this.appserv.presentToast("Veuillez compléter toutes les informations obligatoires.","warning");
      }
    }else{
      this.showprogress=true;
      this.marginServ.update(this.newMargin.value).subscribe(
        data=>{
          this.showprogress=false;
          this.revercingdata(data);
          this.appserv.modalCtrl.dismiss(data,'updated');
          this.appserv.presentToast('Marge mise à jour avec succès.','success');
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast('Erreur survenue lors de la  mise à jour de la marge','danger');
        });
    }
  }

  getlistmoney(){
    this.moneyserv.getlistmonnaiesapi(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.listmoneys=data;
        this.moneyserv.setOfflineData(data);
      },
      error=>{
        //get offline money
        this.listmoneys=this.moneyserv.getOfflineData();
      });
  }
 
}
