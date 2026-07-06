import { Component, OnInit,Input } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { FenceService } from '../services/fence.service';

@Component({
  selector: 'app-printclosure',
  templateUrl: './printclosure.component.html',
  styleUrls: ['./printclosure.component.scss'],
})
export class PrintclosureComponent implements OnInit {
@Input() closure: any={};
@Input() format: 'ticket' | 'a4' = 'ticket'; // par défaut format ticket
currentYear = new Date().getFullYear();
  constructor(public appserv:AppservicesService,private fenceserv:FenceService) { }

  async ngOnInit() {
    const data = await this.fenceserv.show(this.closure);
    if (data && data.status===200 && data.message==="success") {
     this.closure=data.data; 
    }else{
      this.appserv.presentToast("Aucune clôture trouvée.","warning");
    }
    console.log("closure from API",data);
  }

  
  printPage() {
    const printContents = document.getElementById('printable')?.innerHTML;
    const popupWin = window.open('', '_blank', 'width=800,height=900');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Impression</title>
          <style>
           .a4-container, .ticket-container {
              padding: 12px;
              font-family: 'DejaVu Sans', sans-serif;
              color: #1a1a1a;
            }

            .header-banner {
              display: flex;
              justify-content: space-between;
              background-color: #0a5275;
              color: #fff;
              padding: 8px 12px;
              border-radius: 5px;
              margin-bottom: 10px;

              .enterprise-info { font-size: 12px; line-height: 1.4; }
              .enterprise-name { font-size: 16px; font-weight: bold; text-transform: uppercase; margin-bottom: 2px; }
              .meta-info { text-align: right; font-size: 12px; line-height: 1.4; b { text-transform: uppercase; } }
            }

            .title { 
              font-weight: bold; 
              color: #0a5275; 
              margin: 10px 0; 
              text-align: center; 
              text-transform: uppercase; 
            }

            .summary {
              background: linear-gradient(135deg,#eaf5fb,#f9fcff);
              border: 1px solid #c6d9e3;
              border-radius: 6px;
              padding: 10px;
              margin-bottom: 10px;

              .summary-table { 
                width: 100%; 
                border-collapse: collapse; 
                font-size: 12px;

                td { 
                  padding: 4px 6px; 
                  border-bottom: 1px dashed #c9d6de; 
                  &.summary-label { font-weight: 600; color: #333; }
                  &.summary-value { text-align: right; font-weight: bold; color: #0a5275; }
                }
                tr:last-child td { border-bottom: none; }
              }
            }

            .section {
              margin-bottom: 10px;
              border-radius: 6px;
              border: 1px solid #d9e0e6;
              background-color: #f9fafc;
              padding: 8px;

              .section-title { color: #0a5275; margin-bottom: 5px; }
              table { width: 100%; border-collapse: collapse; font-size: 12px;
                th { background-color: #0a5275; color: #fff; padding: 6px; text-align: left; text-transform: uppercase; }
                td { border: 1px solid #c8d2dc; padding: 5px; }
                tr:nth-child(even) { background-color: #f3f6f9; }
                .text-center { text-align: center; }
              }
            }

            .footer { 
              text-align: center; 
              font-size: 11px; 
              margin-top: 8px; 
              color: #555; 
            }
          </style>
        </head>
        <body onload="window.print(); window.close()">${printContents}</body>
      </html>
    `);
    popupWin!.document.close();
  }
}
