import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { Money } from '../interfaces/money';
import { MoneyService } from '../services/money.service';
import { PosPrintingOptions } from '../interfaces/posprintingoptions';
import { TextinputsetupComponent } from '../textinputsetup/textinputsetup.component';
import { ConversionMoney } from '../interfaces/conversionmoneys';
import { ConversionsComponent } from '../moneys/conversions/conversions.component';
import { ConversionMoneysService } from '../services/conversion-moneys.service';
import { ConversioneditionComponent } from '../moneys/conversionedition/conversionedition.component';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';

@Component({
  selector: 'app-pos-settings',
  templateUrl: './pos-settings.component.html',
  styleUrls: ['./pos-settings.component.scss'],
})
export class PosSettingsComponent implements OnInit {
listmoney:Money[]=[];
listconversions:ConversionMoney[]=[];
posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();
posprinterformat:any=this.appserv.getDefaultFormatPrinter();
defaultmoney:Money={};
  constructor(public appserv:AppservicesService, private moneyserv: MoneyService, private conversionserv:ConversionMoneysService) { }

  ngOnInit() {
    this.getting();
    this.getlistconversion();
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

  getting(){
    if(this.moneyserv.getOfflineData().length>0){
      this.listmoney=this.moneyserv.getOfflineData();
    }else{
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
  }

  async setfootermsg(){
    const modal = await this.appserv.modalCtrl.create({
      component:TextinputsetupComponent,
      componentProps:{'title':`Entrer le message par ici`,'datatoedit':this.appserv.getactualEse().invoicefooter},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='edited'){
      let Ese=this.appserv.getactualEse();
      Ese.invoicefooter=data;
      localStorage.setItem('actualEnterprise',OrbitEncoder.encode(Ese));
    }
  }

  changeprincipalmoney($event:any){

    if($event.detail.checked==true){
      this.listmoney.forEach(element => {
        element.principal=0;
      });
      $event.detail.value.principal=1;
      this.defaultmoney=$event.detail.value;
      // localStorage.setItem('moneys',JSON.stringify(this.listmoney));
      // localStorage.setItem('defaultmoney',JSON.stringify($event.detail.value))
    }
  }

  headerchanging($event:any){
    this.editposoptions();
  }

  closemodal(){
    let object={'posprintoptions':this.posprintoptions,'posprinterformat':this.posprinterformat,'defaultmoney':this.defaultmoney,'actualEse':this.appserv.getactualEse()};
    this.appserv.modalCtrl.dismiss(object,'edited');
  }


  changepaperformat($event: any){

    if($event.detail.checked==true && $event.detail.value=='pos'){
      localStorage.setItem('posprinterformat','pos');
      this.posprinterformat='pos';
    }else if($event.detail.checked==true && $event.detail.value=='a4'){
      localStorage.setItem('posprinterformat','a4');
      this.posprinterformat='a4';
    }else{

    }
  }

  editposoptions(){
    localStorage.setItem('printersetup',JSON.stringify(this.posprintoptions));
    //console.log(this.posprintoptions);
  }

  async addConversion(){
    const modal = await this.appserv.modalCtrl.create({
      component:ConversionsComponent,
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
