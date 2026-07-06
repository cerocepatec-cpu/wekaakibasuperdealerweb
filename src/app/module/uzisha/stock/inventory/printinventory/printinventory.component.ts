import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { PosPrintingOptions } from 'src/app/interfaces/posprintingoptions';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-printinventory',
  templateUrl: './printinventory.component.html',
  styleUrls: ['./printinventory.component.scss'],
})
export class PrintinventoryComponent implements OnInit {
  @ViewChild('printer_content') printerContent! : ElementRef; 
  @Input() datefiltered :any;
  @Input() listarticles :any;
  posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();

  constructor(public appserv: AppservicesService) { }

  ngOnInit() {
    this.print();
  }

  async print(){
    let header = document.getElementById('header');
    let subheader = document.getElementById('subheader');
    subheader.hidden=false;
    header.hidden=false;
    var win = window.open('','_blank','popup=1');
   await win.document.write(`<html><head><title>Inventory Printing.</title><style>
    body {
      font-size: x-small;
      font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
    }
    table{
          table-layout: fixed;
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
      tr.border-bottom-dashed{
        border-style:none none dashed none ;
        border-width: 1px;
    }

    .border-bottom-dashed{
        border-style:none none dashed none ;
        border-width: 1px;
    }
    .bg-medium-clean{
      background: #c0c1c2;
    }
    .font-bold-500{
      font-weight: 500;
    }
    .font-size-13{
      font-size:13px !important;
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
    .font-size-20{
      font-size:20px !important;
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
</style></head><body>`);
    win.document.write(this.printerContent.nativeElement.innerHTML);
    win.document.write('</body></html>');
    await win.print();
    header.hidden=true;
    subheader.hidden=true;
    win.close();
    this.appserv.modalCtrl.dismiss();
}

}
