/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { ConversioneditionComponent } from '../conversionedition/conversionedition.component';
import { Component, OnInit } from '@angular/core';
import { ConversionMoney } from 'src/app/interfaces/conversionmoneys';
import { AppservicesService } from 'src/app/services/appservices.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Money } from 'src/app/interfaces/money';
import { MoneyService } from 'src/app/services/money.service';
import { ConversionMoneysService } from 'src/app/services/conversion-moneys.service';
import { NewconversionComponent } from './newconversion/newconversion.component';

@Component({
  selector: 'app-conversions',
  templateUrl: './conversions.component.html',
  styleUrls: ['./conversions.component.scss'],
})
export class ConversionsComponent implements OnInit {
  searchconversion: any;
  showsaveprogress = false;
  listconversions: ConversionMoney[] = [];
  listmoney: Money[] = [];
 

  constructor(public appserv: AppservicesService, private form: FormBuilder, private moneyserv: MoneyService, private conversionserv:ConversionMoneysService) { }

  ngOnInit() { this.getlistconversion(); this.getlistmoney(); }

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

  async menuconversion(conversion: ConversionMoney) {

    const menu = await this.appserv.actionsheetctrl.create({
      header: `${conversion.name1} => ${conversion.name2}`,
      translucent: true,
      mode: 'ios',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Modifier',
          handler: async () => {
            const modalct = this.appserv.modalCtrl.create({
              component: ConversioneditionComponent,
              componentProps: { 'conversionsent': conversion },
              cssClass: 'modal-border-radius-20',
              initialBreakpoint: 0.30,
              breakpoints: [0, 0.25, 0.5, 0.75],
            });
            (await modalct).present();
          }
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.deleteconversion(conversion);
          }
        }
      ]
    });

    (await menu).present();
  }

  async deleteconversion(conversion) {
    // this.appserv.deleteconversionapi(conversion).subscribe(
    //   data => {
    //     this.appserv.presentToast('Conversion supprimée avec succès', 'success');
    //     this.listconversions = this.listconversions.filter(c => c !== conversion);
    //   }, error => {
    //     this.appserv.presentToast(`Erreur lors de la suppression`, 'danger');
    //   }
    // );
  }

  
  async addnew(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewconversionComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
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
}
