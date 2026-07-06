import { Component, Input, OnInit } from '@angular/core';
import { PosPrintingOptions } from '../interfaces/posprintingoptions';
import { AppservicesService } from '../services/appservices.service';

@Component({
  selector: 'app-dynamicprint',
  templateUrl: './dynamicprint.component.html',
  styleUrls: ['./dynamicprint.component.scss'],
})
export class DynamicprintComponent implements OnInit {
  @Input() criteria: any;
  @Input() groupsSent: any;
  posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();
  constructor(public appserv:AppservicesService) { }

  ngOnInit() {}

  async print(bloc:string){
    var win = window.open('','_blank','popup=1');
    win.document.write(`<html><head><title>Impression groupes</title><style>
     body {
       font-size: x-small;
       font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
     }
     table{
           width: 100%;
           border-collapse: collapse;
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
     .text-wrapped{
       word-wrap: break-word;
     }
     .text-right{
       text-align: right;
     }
     .font-size-10{
       font-size: 10px !important;
     }   
     .font-size-14{
       font-size: 14px !important;
     }
     .font-size-15{
      font-size: 15!important;
     } 
     .font-size-16{
       font-size: 16px !important;
     }
     .font-size-20{
      font-size:20px !important;
     }
     .font-bold-600{
       font-weight: 600;
     }  
     .bg-medium-clean{
      background: #c0c1c2;
      }
     .text-italic{
       font-style: italic;
     }
     .font-bold-500{
      font-weight: 500;
      }
     .text-left{
       text-align:left;
     }
     .details-invoice{
      display: table;
      border-collapse: collapse;
      width: 100%;
  }
  .details-invoice > * {
      display: table-row;
      // border: 1px solid black;
      padding: 5px;
      .details-invoice-tr{
          span{
              display: table-cell;
              margin-right: 10px;
              border: 0.5px solid black;
          }
      }
    }
 </style></head><body>`);
    //  win.document.write(document.getElementById('header-bloc').innerHTML);
     win.document.write(document.getElementById(bloc).innerHTML);
     win.document.write('</body></html>');
     win.print();
     win.close();
  }

}
