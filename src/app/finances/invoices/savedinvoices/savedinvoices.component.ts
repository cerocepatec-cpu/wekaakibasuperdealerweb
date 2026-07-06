import { Component, OnInit} from '@angular/core';
import { Invoice } from 'src/app/interfaces/invoices';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-savedinvoices',
  templateUrl: './savedinvoices.component.html',
  styleUrls: ['./savedinvoices.component.scss'],
})
export class SavedinvoicesComponent implements OnInit {
  keyword:any;
  showprogress=false;
  savedInvoices : Invoice[]=[];

  constructor(public appserv: AppservicesService) { }

  ngOnInit() {
    this.getsavedinvoices();
  }

  getsavedinvoices(){
    const records = localStorage.getItem('invoicesSaved');
    if (records !== null) {
      this.savedInvoices = JSON.parse(records);
    }
  }

  async menuinvoice(invoice:Invoice){

    const sheet = await this.appserv.actionsheetctrl.create({
      header:`Facture enregistrée`,
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Modifier',handler:()=> {
          this.appserv.modalCtrl.dismiss(invoice,'toedit');
          },
        },
        {text:'Supprimer',handler:()=>{
          this.savedInvoices=this.savedInvoices.filter(i=>i!=invoice);
          localStorage.setItem('invoicesSaved',JSON.stringify(this.savedInvoices));
          this.appserv.modalCtrl.dismiss(invoice,'deleted');
          }
        },
        {
          text:'Annuler',role:'cancel'
        }
      ]
    });

    sheet.present();
  }

 async deleteall(){
    if(this.savedInvoices.length>0){
      const alert = await this.appserv.alertctrl.create({
        header:'Suppression brouillons',
        message:`Voulez-vous supprimer toutes les factures enregistrées comme brouillons?`,
        mode:'ios',
        translucent:true,
        buttons:[
          {text:'Non',role:'cancel'},
          {text:'Oui',handler:()=>{
            localStorage.removeItem('invoicesSaved');
            this.appserv.modalCtrl.dismiss([],'all-deleted');
          }}
        ]
      });
      alert.present();
    } 
  }
}
