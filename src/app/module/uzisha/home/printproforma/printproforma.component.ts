import { Component, OnInit, Input } from '@angular/core';
import { Invoice } from 'src/app/interfaces/invoices';
import { PosPrintingOptions } from 'src/app/interfaces/posprintingoptions';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-printproforma',
  templateUrl: './printproforma.component.html',
  styleUrls: ['./printproforma.component.scss'],
})
export class PrintproformaComponent implements OnInit {
@Input() invoice: Invoice;
@Input() typeInvoice: any;
@Input() today: any;
@Input() listselectedarticles: any;
@Input() totalgeneral: any;
@Input() vat_amount: any;
@Input() reduction: any;
@Input() netToPay: any;
@Input() defaultmoney: any;
@Input() total_received: any;
@Input() actualcustomer: any;
@Input() actualEse: any;
@Input() tva_rate: any;
posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();

  constructor(public appserv: AppservicesService) { }

  ngOnInit() {
    //console.log(this.invoice);
    //construct array for note
    // console.log('invoice sent',this.invoice);
    if (this.invoice.note && this.invoice.note.length>0) {
      this.invoice.noteArray = this.invoice.note.split(';'); 
    }
  }

  async printToCart(){
    if (this.typeInvoice==='model1') {
      this.printA4model1();
    }
  }

  cancel() {
    return this.appserv.modalCtrl.dismiss(null, 'printed');
  }

  async printA4model1(){
    var win = window.open('','_blank','popup=1');
    await win.document.write(`<html><head><title>Invoice_proforma_A4</title>
      <style>
        body {
          font-size: x-small;
          font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
        }
        .proforma-line{
          background-color: #ec8b6d;
          font-weight: bold;
          border: 3px solid #ec8b6d;
          border-radius: 5px;
          width: 45px;
          float: left;
      }
    
      .text-medium{
        color: #a2a09f;
      }
      .background-proforma-model1{
        background: #f4a68f;
      }
      .table-proforma-model1{
        width: 100%!important;
      
        .thead-proforma-model1{
          background: #f4a68f;
          border-radius: 5px;
          height: 20px!important;
        }
      
        .tbody-proforma-model1{
          border-bottom: 2px solid #efb3a1;
          padding: 5px!important;
          line-height: 2.5;
        }
      
        .line-height-2-5{
          line-height: 2.5;
        }
      }
      .margin-5{
        margin: 5px;
      }
      .bg-medium-clean-proforma{
      background:   #f0f0f0; 
      }
      .font-bold-500{
        font-weight: 500;
      }
      .text-center{
        text-align: center;
      }
      .font-bold-600{
        font-weight: 600;
      }
      .font-size-20{
        font-size: 20px!important;
      }
      .font-size-25{
        font-size: 25px!important;
      }
      .font-size-30{
        font-size: 30px!important;
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
        thead{
          font-size:11!important;
        }
        table tbody{
            font-size:11!important;
        }

        tfoot{
            font-size:11!important;
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
      .font-size-12{
        font-size: 12px !important;
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
    
      .footer{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        bottom: 0;
      }
      .ion-padding{
        padding:10px!important;
      }
      .bd-radius-10{
        border-radius: 10px;
      }

    .grid{
        display: grid;
        grid-template-rows: auto auto;
        grid-gap: 10px;
      }
      .top-moins-20{
        top:-20px;
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
      await win.print();
      win.close();
       this.appserv.modalCtrl.dismiss(this.invoice,'printed');
 }

}
