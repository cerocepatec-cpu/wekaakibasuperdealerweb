import { ConversionMoney } from './../../interfaces/conversionmoneys';
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppservicesService } from 'src/app/services/appservices.service';
import { ModalController } from '@ionic/angular';
import { ConversionMoneysService } from 'src/app/services/conversion-moneys.service';

@Component({
  selector: 'app-conversionedition',
  templateUrl: './conversionedition.component.html',
  styleUrls: ['./conversionedition.component.scss'],
})
export class ConversioneditionComponent implements OnInit {
@Input() conversionsent: ConversionMoney;
showprogress=false;
conversionform=this.formbuild.group(
  {
    id:[],
    money_id1:[],
    money_id2:[],
    rate:[],
    operator:[]
  });
showsaveprogress=false;
constructor(private conversionServ: ConversionMoneysService, private formbuild: FormBuilder,private appserv: AppservicesService) { }

  ngOnInit() {
    this.sycingdata();
  }

  async sycingdata(){
    this.conversionform.patchValue({
      id:this.conversionsent.id,
      money_id1:this.conversionsent.money_id1,
      money_id2:this.conversionsent.money_id2,
      rate:this.conversionsent.rate,
      operator:this.conversionsent.operator
    });
  }

  async editconversion(){
    this.showprogress=true;
    this.conversionServ.editConversionApi(this.conversionform.value).subscribe(
      data=>{
        this.showprogress=false;
        this.appserv.presentToast('Conversion modifiée avec succès','success');
        this.conversionsent.rate=this.conversionform.get('rate').value;
        this.appserv.modalCtrl.dismiss();
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast('Une erreur est survenue lors de la modification de la conversion.','danger');
      }
    );
  }
}
