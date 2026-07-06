import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@dutchconcepts/capacitor-barcode-scanner';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-scanbarcode',
  templateUrl: './scanbarcode.component.html',
  styleUrls: ['./scanbarcode.component.scss'],
})
export class ScanbarcodeComponent implements OnInit {
result = null;
scanActive =false;

  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    BarcodeScanner.prepare();
  }
  ngOnDestroy() {
    BarcodeScanner.stopScan();
  }

  async startscan (){
    const allowed = await this.checkPermission();
    if(allowed){
      this.scanActive=true;
      const result = await BarcodeScanner.startScan();
      if(result.hasContent){
        this.result=result.content;
        this.scanActive=false;
      }
    }
  }

  async stopScanner(){

  }
  async checkPermission(){
    return new Promise(async (resolve,reject) =>{
      const status = await BarcodeScanner.checkPermission({force: true});
      if(status.granted){
        resolve(true);
      }else if(status.denied){
        const alert = await this.appserv.alertctrl.create({
          header:'Aucune permission',
          message:`Activer votre la persmission de votre camera s'il vous plaît`,
          buttons:[{
            text:'Non',
            role:'cancel'
          },
          {
            text:'Ouvrir configurations',
            handler:()=>{
              BarcodeScanner.openAppSettings();
              resolve(false);
            }
          }
        ]
        });
        alert.present();
      }else{
        resolve(false);
      }
    });
    
  }
}
