import { Component, OnInit, Input } from '@angular/core';
import { Expenditures } from 'src/app/interfaces/expenditures';
import { AppservicesService } from 'src/app/services/appservices.service';
import { PrintexpenditureandentryComponent } from '../../printexpenditureandentry/printexpenditureandentry.component';

@Component({
  selector: 'app-detailexpenditure',
  templateUrl: './detailexpenditure.component.html',
  styleUrls: ['./detailexpenditure.component.scss'],
})
export class DetailexpenditureComponent implements OnInit {
@Input() expendituresent : Expenditures;
@Input() typesent : any;
@Input() isentry :boolean;
posprintoptions=this.appserv.getDefaultPrinterConfig();
showprogress=false;
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {
    console.log('expenditure',this.expendituresent);
  }

  async printOperation(){
    const modal = await this.appserv.modalCtrl.create({
      component:PrintexpenditureandentryComponent,
      componentProps:{'typesent':'withdraw',"expendituresent":this.expendituresent},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
  }
}
