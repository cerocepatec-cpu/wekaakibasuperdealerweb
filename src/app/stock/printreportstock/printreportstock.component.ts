import { Component, OnInit, Input } from '@angular/core';
import { PosPrintingOptions } from 'src/app/interfaces/posprintingoptions';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-printreportstock',
  templateUrl: './printreportstock.component.html',
  styleUrls: ['./printreportstock.component.scss'],
})
export class PrintreportstockComponent implements OnInit {
@Input() listsent:any;
@Input() criteriasent:any;
@Input() from:any;
@Input() to:any;
posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

  printToCart(printSectionId: string){
    var win = window.open('','_blank','popup=1');
    win.document.write(`<html><head><title>Impression fiche de stock</title><style>
     body {
       font-size: x-small;
       font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
     }
     table{
           table-layout: fixed;
           width: 100%;
           border-collapse: collapse;
           thead th:nth-child(1){
                   width: 10%;
           }
           thead th:nth-child(2){
                   width: 10%;
           }
           thead th:nth-child(3){
                   width: 15%;
           }
           thead th:nth-child(4){
                   width: 50%;
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
     .font-size-16{
       font-size: 16px !important;
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
     win.document.write(document.getElementById('content-printer').innerHTML);
     win.document.write('</body></html>');
     win.print();
     win.close();
    this.appserv.modalCtrl.dismiss(null,'printed');
  }
}
