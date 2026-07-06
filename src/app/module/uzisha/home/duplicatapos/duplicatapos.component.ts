import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Invoice } from 'src/app/interfaces/invoices';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-duplicatapos',
  templateUrl: './duplicatapos.component.html',
  styleUrls: ['./duplicatapos.component.scss'],
})
export class DuplicataposComponent implements OnInit {

  @Input() invoice: Invoice;
  posprintoptions: any;
  today=this.appserv.today;
  listselectedarticles: any;
  totalgeneral: any;
  vat_amount: any;
  reduction: any;
  netToPay: any;
  defaultmoney=this.appserv.defaultmoney;
  total_received: any;
  actualcustomer: any;
  actualEse=this.appserv.actualEse;
  tva_rate: any;
  typeInvoice: string;


  constructor(public appserv: AppservicesService, private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.typeInvoice = 'model1';
    this.posprintoptions=this.appserv.getDefaultPrinterConfig();
    this.listselectedarticles=this.invoice.details;
    this.totalgeneral=this.invoice.invoice.total;
    this.vat_amount=this.invoice.invoice.vat_amount;
    this.reduction=this.invoice.invoice.discount;
    this.netToPay=this.invoice.invoice.netToPay;
    this.total_received=this.invoice.invoice.total_received;
    this.actualcustomer=this.invoice.customer;
    this.tva_rate=this.invoice.invoice.vat_percent;
    console.log('invoice sent',this.invoice);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  printToCart(){
    var win = window.open('','_blank','popup=1');
    win.document.write(`<html><head><title>Invoice_duplication_Pos</title><style>
     body {
       font-size: x-small;
       font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
     }
     table{
           table-layout: fixed;
           width: 100%;
           border-collapse: collapse;
           thead th:nth-child(1){
                   width: 50%;
                   text-align: left;
           }
           thead th:nth-child(2){
                   width: 10%;
                   text-align: right;
           }
           thead th:nth-child(3){
                   width: 15%;
                   text-align: right;
           }
           thead th:nth-child(4){
                   width: 25%;
                   text-align: right;
           }
       }
       .header{
           border-style: none none dashed none;
           border-width: 1px;
       }

       .suheader{
           border-style: none none dashed none;
           border-width: 1px;
       }
       thead{
         font-size:11!important;
       }
       table tbody{
           border-style: none none dashed none;
           border-width: 1px;
           font-size:11!important;
       }

       tfoot{
           font-size:11!important;
       }
       tr.border-bottom-dashed{
         border-style:none none dashed none ;
         border-width: 1px;
     }

     .border-bottom-dashed{
         border-style:none none dashed none ;
         border-width: 1px;
     }
     .text-wrapped{
       word-wrap: break-word;
     }
     .text-right{
       text-align: right;
     }
     .font-size-10{
       font-size: 10px !important;
     }
     .font-bold-600{
       font-weight: 600;
     }
     .text-italic{
       font-style: italic;
     }
     .text-left{
       text-align:left;
     }
 </style></head><body>`);
     
     var image = document.createElement("img");
     image.setAttribute('src',this.appserv.getactualEse().logo?this.appserv.imgUrl+this.appserv.getactualEse().logo:'');
     image.setAttribute('style','width: 50px;height: 50px;');
     const div = document.createElement('div');
     div.setAttribute('id','imagebloc');
     div.appendChild(image);
     win.document.body.appendChild(div);
     win.document.write(document.getElementById('invoiceOne').innerHTML);
     win.document.write('</body></html>');
     //console.log('document created',win.document);
     win.print();
     win.close();
     this.appserv.modalCtrl.dismiss(this.invoice,'printed');
  }
}
