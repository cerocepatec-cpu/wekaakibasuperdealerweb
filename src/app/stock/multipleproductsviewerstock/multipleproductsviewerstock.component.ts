import { Component, OnInit, Input } from '@angular/core';
import { StockHistory } from 'src/app/interfaces/stockhistory';
import { AppservicesService } from 'src/app/services/appservices.service';
import { DetailmouvementComponent } from '../detailmouvement/detailmouvement.component';
import { from } from 'rxjs';

@Component({
  selector: 'app-multipleproductsviewerstock',
  templateUrl: './multipleproductsviewerstock.component.html',
  styleUrls: ['./multipleproductsviewerstock.component.scss'],
})
export class MultipleproductsviewerstockComponent implements OnInit {
@Input() datasent :any;
@Input() periodes :any;
search:any;
from:any;
to:any;
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {
    this.from=this.periodes.from;
    this.to=this.periodes.to;
  }

  async export(criteria: string){
    let subtitle='';
      if(this.from && this.to){
        subtitle=`Période allant du ${this.appserv.frdate(this.from)} au ${this.appserv.frdate(this.to)} `;
      }else{
        subtitle=`Du début jusqu'à nos jours`;
      }
    let data =[];
    const line2=['N°','Date','Par','Dépôt','Produit','Quantité','Prix','Total','Stock initial','Solde','Expiration','Type',' Mouvement'];
    data.push(line2);
    this.datasent.forEach(el => {
        let index = 0;
        const line1 =[el[0]['service_name']];
        data.push(line1);
          el.forEach(mouv => {
            index =index+1;
            const object =[
              index,
              mouv.created_at,
              mouv.done_by_name,
              mouv.deposit_name,
              mouv.service_name,
              mouv.quantity,
              mouv.price,
              mouv.quantity*mouv.price,
              mouv.quantity_before?mouv.quantity_before:0,
              mouv.type==='withdraw'?mouv.quantity_before>=1?mouv.quantity_before-mouv.quantity:mouv.quantity:mouv.quantity_before>=1?mouv.quantity_before+mouv.quantity:mouv.quantity,
              mouv.expiration_date,
              mouv.type==='entry'?'entrée':'sortie',
              mouv.type_approvement
            ];
            data.push(object);
          });
    });

    if(criteria=='pdf'){
        const pdfojb=this.appserv.pdftabledownload(data,'MOUVEMENTS STOCK',subtitle,'landscape','A4');
        this.appserv.pdfaction(pdfojb,'rapportstock');
    }else if(criteria=='excel'){
      this.appserv.exportInToExcel(data,'csv','rapportstock');
    }else{
      const pdfojb=this.appserv.pdftabledownload(data,'MOUVEMENTS STOCK',subtitle,'landscape','A4');
      pdfojb.print();
    }
  }

  async detail(mouv: StockHistory){
    const modal = await this.appserv.modalCtrl.create({
      component:DetailmouvementComponent,
      componentProps:{'mouvementsent':mouv}
    });
    modal.present();
  }
}
