import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-invoice-print',
  templateUrl: './invoice-print.component.html',
  styleUrls: ['./invoice-print.component.scss'],
})
export class InvoicePrintComponent implements OnInit {
  @Input() invoice: any;
  @Input() datasent: any;
  @Input() mode: any;
  @Input() duplicata: boolean;
  @Input() isinvoice: boolean;
  posprintoptions: any = this.appserv.getDefaultPrinterConfig();
  today: any = this.appserv.defaultdate();
  defaultmoney: any = this.appserv.getDefaultmoney();
  actualEse: any = this.appserv.getactualEse();

  typeInvoice: string;

  constructor(
    public appserv: AppservicesService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    console.log('invoice sent', this.invoice);
  }

  ionViewDidEnter() {
    this.printToCart();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'printed');
  }

  printToCart() {
    const content = document.getElementById('invoiceOne');

    if (!content) {
      this.appserv.presentToast('Impossible de générer l’impression', 'danger');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=400,height=600');

    if (!printWindow) {
      this.appserv.presentToast('Popup bloquée par le navigateur', 'warning');
      return;
    }

    printWindow.document.open();

    printWindow.document.write(`
    <html>
      <head>
        <title>Transaction Print</title>
        <style>

          @page {
            size: auto;
            margin: 5mm;
          }

          body {
            margin: 0;
            padding: 0;
            font-family: monospace;
            font-size: 12px;
            width: 80mm;
          }

          .invoice {
            width: 100%;
          }

          .separator {
            border-bottom: 1px dashed #000;
            margin: 6px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          td {
            padding: 2px 0;
          }

          .text-right {
            text-align: right;
          }

          .text-center {
            text-align: center;
          }

          .font-bold-600 {
            font-weight: 600;
          }

          .small-text {
            font-size: 10px;
          }

          .net-to-pay {
            font-size: 14px;
            font-weight: bold;
          }

        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);

    printWindow.document.close();

    // 🔥 Important : attendre rendu complet
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    this.appserv.modalCtrl.dismiss(this.invoice, 'printed');
  }
}
