import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { CustomersService } from '../../services/customers.service';
import { Invoice } from '../../interfaces/invoices';
import { InvoiceService } from 'src/app/services/invoice.service';
import { Customers } from '../../interfaces/customers';
import { PosPrintingOptions } from 'src/app/interfaces/posprintingoptions';
import { Money } from 'src/app/interfaces/money';

@Component({
  selector: 'app-invoiceslist',
  templateUrl: './invoiceslist.component.html',
  styleUrls: ['./invoiceslist.component.scss'],
})
export class InvoiceslistComponent implements OnInit {
  @Input() customersent: Customers={};
  @ViewChild('printer_content') printerContent! : ElementRef; 
  listinvoices:Invoice[]=[];
  keptlistinvoices:Invoice[]=[];
  showprogress=false;
  from:any;
  to:any;
  defaultmoney=this.appserv.getDefaultmoney();
  search: any;
  totalGeneral=0;
  posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();
  canprint:boolean;
  constructor(public appserv: AppservicesService, public customerserv: CustomersService, public invoiceserv: InvoiceService) { }

  ngOnInit() {
    this.getinvoiceslist();
  }

  async getdatesfilter(){
    const period = await  this.appserv.getDatesForm();
      this.from=period.from;
      this.to=period.to;
      this.getinvoiceslist();
  }

  async filterByType(criteria: string){
    this.listinvoices=this.listinvoices.filter(i=>i.invoice.type_facture===criteria);
  }

  DeleteFilterByType(){
    this.listinvoices=this.keptlistinvoices;
  }

  async getinvoiceslist(){
    this.showprogress=true;
    this.invoiceserv.FilteredForACustomer({customer_id:this.customersent.id,from:this.from,to:this.to}).subscribe(
      (data:any)=>{
        this.showprogress=false;
        this.listinvoices=data.invoices;
        this.keptlistinvoices=data.invoices;
        this.from=data.from;
        this.to=data.to;
       this.totalCalculation();
      },error=>{
        this.showprogress=false;
        this.listinvoices=this.invoiceserv.getofflineInvoices();
      }
    )
  }

  totalCalculation(){
     this.listinvoices.forEach(element => {
      this.totalGeneral=this.totalGeneral+element.invoice.netToPay;
    });
  }

  printlist(){
      var win = window.open('','_blank','popup=1');
      win.document.write(`<html><head><title>Impression factures client</title><style>
       body {
         font-size: x-small;
         font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
       }
       table{
             width: 100%;
             border-collapse: collapse;
             thead th:nth-child(1){
                     width: 2%;
             }
             thead th:nth-child(2){
                     width: 14.6%;
             }
             thead th:nth-child(3){
                width: 8.3%;
             }
             thead th:nth-child(4){
                width: 8.3%;
             }
             thead th:nth-child(5){
                 width: 8.3%;
             }
             thead th:nth-child(6){
              width: 8.3%;
            }
            thead th:nth-child(7){
              width: 8.3%;
            }
            thead th:nth-child(8){
              width: 8.3%;
            }
            thead th:nth-child(9){
              width: 8.3%;
            }
            thead th:nth-child(10){
              width: 8.3%;
            }
            thead th:nth-child(11){
              width: 8.3%;
            }
            thead th:nth-child(12){
              width: 8.3%;
            }
         }
         .header{
             border-style: none none none none;
             border-width: 1px;
         }
  
         .suheader{
             border-style: none none none none;
             border-width: 1px;
         }
         thead{
           font-size:11!important;
         }
         table tbody{
             border-style: none none none none;
             border-width: 1px;
             font-size:11!important;
         }
  
         tfoot{
             font-size:11!important;
         }
         tr.border-bottom-dashed{
           border-style:none none none none ;
           border-width: 1px;
       }
  
       .border-bottom-dashed{
           border-style:none none none none ;
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
       .font-size-16{
         font-size: 16px !important;
       }
       .font-size-20{
        font-size: 20px !important;
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
       win.document.write(this.printerContent.nativeElement.innerHTML);
       win.document.write('</body></html>');
       win.print();
       win.close();
    } 
}
