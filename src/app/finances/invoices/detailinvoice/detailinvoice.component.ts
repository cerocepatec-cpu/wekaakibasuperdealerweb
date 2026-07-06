import { Component, OnInit, Input } from '@angular/core';
import { Invoice } from 'src/app/interfaces/invoices';
import { AppservicesService } from 'src/app/services/appservices.service';
import { DetailsInvoice } from '../../../interfaces/detailinvoice';
import { InfosdebtComponent } from 'src/app/debts/infosdebt/infosdebt.component';

@Component({
  selector: 'app-detailinvoice',
  templateUrl: './detailinvoice.component.html',
  styleUrls: ['./detailinvoice.component.scss'],
})
export class DetailinvoiceComponent implements OnInit {
  @Input() invoicesent: any ={};
  showprogress=false;
  details: DetailsInvoice[]=[];
  search:any;
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {
    this.invoicesent.details.forEach((detail:any) => {
      
        if (!detail.subservices) {
          detail.subservices=[];
        }
        this.details.push(detail);
    });
    console.log(this.invoicesent);
  }

  async gotopaymentsviewer(){
      let debt={debt:this.invoicesent.debt[0],payments:this.invoicesent.payments};
    const modal = await this.appserv.modalCtrl.create({
      component:InfosdebtComponent,
      componentProps:{'debtsent':debt},
      cssClass:'modal-border-radius-20',
    });

    modal.present();
  }


}
