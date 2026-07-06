import { Component, OnInit, Input } from '@angular/core';
import { StockHistory } from 'src/app/interfaces/stockhistory';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-detailmouvement',
  templateUrl: './detailmouvement.component.html',
  styleUrls: ['./detailmouvement.component.scss'],
})
export class DetailmouvementComponent implements OnInit {
@Input() mouvementsent:StockHistory={};
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

  export(criteria: string){
    let data :any;
    let subtitle=`Produit : ${this.mouvementsent.service_name}`;
    if(criteria=='excel'){
      data=[['ID. Opération',this.mouvementsent.id],['Type',this.mouvementsent.type],['Type mouvement',this.mouvementsent.type_approvement],['Dépôt',this.mouvementsent.deposit_name],['Description produit',this.mouvementsent.description],['Date',this.mouvementsent.created_at],['Mouvement fait par',this.mouvementsent.done_by_name],[`Date d'expiration`,this.mouvementsent.expiration_date],['Bon de livraison',this.mouvementsent.bon_livraison],['Motif',this.mouvementsent.motif],['Facture',this.mouvementsent.invoice_id],['Code bar',this.mouvementsent.code_bar],['Note',this.mouvementsent.note],['Pièce Jointe',this.mouvementsent.attachment],['Stock initial',this.mouvementsent.quantity_before],['Quantité',this.mouvementsent.quantity],['Prix',this.mouvementsent.price],['Total',this.mouvementsent.price>0?this.mouvementsent.quantity*this.mouvementsent.price:this.mouvementsent.quantity],['Solde',this.mouvementsent.quantity_before>0?this.mouvementsent.quantity_before-this.mouvementsent.quantity:this.mouvementsent.quantity]];
      this.appserv.exportInToExcel(data,'csv','mouvementstock');
    }else if(criteria=='pdf'){
      data=[['ID. Opération',this.mouvementsent.id],['Type',this.mouvementsent.type],['Type mouvement',this.mouvementsent.type_approvement],['Dépôt',this.mouvementsent.deposit_name],['Date',this.mouvementsent.created_at],['Mouvement fait par',this.mouvementsent.done_by_name],[`Date d'expiration`,this.mouvementsent.expiration_date],['Motif',this.mouvementsent.motif],['Stock initial',this.mouvementsent.quantity_before],['Quantité',this.mouvementsent.quantity],['Prix',this.mouvementsent.price],['Total',this.mouvementsent.price>0?this.mouvementsent.quantity*this.mouvementsent.price:this.mouvementsent.quantity],['Solde',this.mouvementsent.quantity_before>0?this.mouvementsent.quantity_before-this.mouvementsent.quantity:this.mouvementsent.quantity]];
      const pdfojb=this.appserv.pdftabledownload(data,'DETAIL MOUVEMENT STOCK',subtitle,'portrait','A4');
      this.appserv.pdfaction(pdfojb,'mouvementstock'); 
    }else{
      data=[['ID. Opération',this.mouvementsent.id],['Type',this.mouvementsent.type],['Type mouvement',this.mouvementsent.type_approvement],['Dépôt',this.mouvementsent.deposit_name],['Date',this.mouvementsent.created_at],['Mouvement fait par',this.mouvementsent.done_by_name],[`Date d'expiration`,this.mouvementsent.expiration_date],['Motif',this.mouvementsent.motif],['Stock initial',this.mouvementsent.quantity_before],['Quantité',this.mouvementsent.quantity],['Prix',this.mouvementsent.price],['Total',this.mouvementsent.price>0?this.mouvementsent.quantity*this.mouvementsent.price:this.mouvementsent.quantity],['Solde',this.mouvementsent.quantity_before>0?this.mouvementsent.quantity_before-this.mouvementsent.quantity:this.mouvementsent.quantity]];
      const pdfojb=this.appserv.pdftabledownload(data,'DETAIL MOUVEMENT STOCK',subtitle,'portrait','A4');
      pdfojb.print();
    }
  }

}
