import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { Articles } from '../../interfaces/articles';
import { AppservicesService } from '../../services/appservices.service';
import { StockHistory } from '../../interfaces/stockhistory';
import { Users } from '../../interfaces/users';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-printgeneraldetails',
  templateUrl: './printgeneraldetails.component.html',
  styleUrls: ['./printgeneraldetails.component.scss'],
})
export class PrintgeneraldetailsComponent implements OnInit {

  @ViewChild('invoice') invoiceElement!: ElementRef;
  @Input() article: Articles = {};
  mouvements: StockHistory[] = [];
  actualuser: Users = {};

  constructor(public appserv: AppservicesService, private stockserv: StockService) { }

  ngOnInit() {
    this.actualuser = this.appserv.actualUser;
    this.getmouvements();
  }

  public generatePDF(): void {
  }

  closemodal() {
    this.appserv.closemodal();
  }
  getmouvements() {
    this.stockserv.stockhistoryforaservice(this.article.service.id).subscribe(
      data => {
        this.mouvements = data;
      },
      error => {
        this.appserv.presentToast(`Erreur lors de la recuperation de l'historique des mouvements stock`, 'warning');
      }
    );
  }

}
