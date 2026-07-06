import { Component, OnInit,Input, ElementRef, ViewChild } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { CustomersService } from '../../services/customers.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { Customers } from '../../interfaces/customers';
import { Bonus } from '../../interfaces/bonus';
import { Cautions } from 'src/app/interfaces/cautions';
import { NewcautionComponent } from './newcaution/newcaution.component';
import { PosPrintingOptions } from 'src/app/interfaces/posprintingoptions';
@Component({
  selector: 'app-cautionsclient',
  templateUrl: './cautionsclient.component.html',
  styleUrls: ['./cautionsclient.component.scss'],
})
export class CautionsclientComponent implements OnInit {

  @Input() customersent: Customers={};
  @ViewChild('printer_content') printerContent! : ElementRef; 
  listcautions:Cautions[]=[];
  showprogress=false;
  generalsold:number=0;
  notused:number=0;
  alreadyused:number=0;
  defaultmoney=this.appserv.getDefaultmoney();
  from:any;
  to:any;
  posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();

  constructor(public appserv: AppservicesService, public customerserv: CustomersService, public invoiceserv: InvoiceService) { }

  ngOnInit() {
    this.getlistcautions();
  }

  printlist(){
    var win = window.open('','_blank','popup=1');
      win.document.write(`<html><head><title>Impression historique cautions</title><style>
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
                width: 28.8%;
             }
             thead th:nth-child(3){
                width: 16.6%;
             }
             thead th:nth-child(4){
                width: 16.6%;
             }
             thead th:nth-child(5){
                 width: 16.6%;
             }
             thead th:nth-child(6){
              width: 16.6%;
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
  async calculatesold(){
    this.generalsold=0;
    this.notused=0;
      this.alreadyused=0;
    this.listcautions.forEach((caution:any) => {
      this.notused +=caution.amount;
      this.alreadyused +=caution.amount_used;
    });
    this.generalsold +=this.notused-this.alreadyused;
  }
  async getdatesfilter(){
    const period = await  this.appserv.getDatesForm();
    this.from=period.from;
    this.to=period.to;
    this.getlistcautions();
  }

  async getlistcautions(){
    this.showprogress=true;
    this.customerserv.FilteredCautionsForACustomer({customer_id:this.customersent.id,from:this.from,to:this.to}).subscribe(
      (data:any)=>{
        this.showprogress=false;
        this.listcautions=data.cautions;
        this.from=data.from;
        this.to=data.to;
        this.calculatesold();
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de récupérer la liste des cautions du client`,'danger');
      });
  }

  async newcaution(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewcautionComponent,
      componentProps:{'customersent':this.customersent},
      initialBreakpoint:0.30,
      breakpoints:[0.25,0.30,0.50,0.75,1],
      cssClass:"modal-border-radius-20"
    });
    modal.present();

    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
      this.listcautions.unshift(data);
      this.calculatesold();
    }
  }
}
