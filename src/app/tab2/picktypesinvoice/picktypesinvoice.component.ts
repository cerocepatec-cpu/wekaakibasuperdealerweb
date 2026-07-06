import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { Invoice } from 'src/app/interfaces/invoices';
@Component({
  selector: 'app-picktypesinvoice',
  templateUrl: './picktypesinvoice.component.html',
  styleUrls: ['./picktypesinvoice.component.scss'],
})
export class PicktypesinvoiceComponent implements OnInit {

  @Input() invoicesent: Invoice ={};

  types =[{title:'Cash',description:'Vendre cash sans crédit',img:'../../../assets/cash.jpeg',value:'cash',selected:false},
          {title:'Crédit',description:'Vendre à crédit',img:'../../../assets/credit.jpeg',value:'credit',selected:false},
          {title:'Proforma',description:'Enregistrer entant que proforma',img:'../../../assets/proforma.jpeg',value:'proforma',selected:false},
          {title:'Commande',description:'Enregistrer la facture en tant que commande',img:'../../../assets/commande.png',value:'order',selected:false}
        ];
    constructor(public appserv: AppservicesService) { }
  
    ngOnInit() {
      this.types.forEach(element => {
          if(element.value==this.invoicesent.type_facture){
            element.selected=true;
          }
      });
    }
  

    selected(type: any){
      this.invoicesent.type_facture=type.value;
      this.types.forEach(element => {
        element.selected=false;
      });
      type.selected=true;
      this.appserv.modalCtrl.dismiss(this.invoicesent,'selected');
    }
}
