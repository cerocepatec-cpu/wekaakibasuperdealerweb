import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-printlistinvoices',
  templateUrl: './printlistinvoices.component.html',
  styleUrls: ['./printlistinvoices.component.scss'],
})
export class PrintlistinvoicesComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  printlist(){
      var win = window.open('','_blank','popup=1');
      win.document.write(`<html><head><title>Impression factures client</title><style>
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
    } 

}
