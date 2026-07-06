import { Component, OnInit, Input } from '@angular/core';
import { Invoice } from 'src/app/interfaces/invoices';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-achieveinvoice',
  templateUrl: './achieveinvoice.component.html',
  styleUrls: ['./achieveinvoice.component.scss'],
})
export class AchieveinvoiceComponent implements OnInit {
@Input() invoicesent: Invoice ={};
amount_paid: any=0;
note='';
  types =[{title:'Valider et Imprimer',description:'Enregistrer la facture et imprimer',icone:'print-outline',value:'sale-print',selected:true},
          {title:'Valider sans imprimer',description:'Enregistrer sans imprimer',icone:'save-outline',value:'sale-no-print',selected:false},
          {title:'Valider et Partager',description:'Partager la facture par mail,whatsapp,Telegram, etc.',icone:'share-outline',value:'sale-share',selected:false},
          {title:'Mettre en Pause',description:'Mettre la facture en pause pour la rétravailler plus tard',img:'',icone:'pause-circle-outline',value:'pause',selected:false}
        ];
    constructor(public appserv: AppservicesService) { }
  
    ngOnInit() {
      if(this.invoicesent.type_facture!='credit'){
        this.amount_paid=this.invoicesent.total;
      }
      this.invoicesent.after_validation='sale-print';
    }
  
    sendData(){
      const object ={amount_paid:this.amount_paid,after_validation:this.invoicesent.after_validation};
      this.appserv.modalCtrl.dismiss(object,'selected');
    }

    selected(type: any){
      this.invoicesent.after_validation=type.value;
      this.types.forEach(element => {
        element.selected=false;
      });
      type.selected=true;
    }
}
