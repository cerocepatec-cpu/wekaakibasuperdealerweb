import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-select-cash-account-sheet',
  templateUrl: './select-cash-account-sheet.component.html',
  styleUrls: ['./select-cash-account-sheet.component.scss'],
})
export class SelectCashAccountSheetComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!:IonInput;
   @Input() accounts: any[] = [];
   @Input() moneyIdSent:number;
   search:any;
filteredAccounts: any[] = [];

  constructor(private appserv: AppservicesService) {}
  ngOnInit(): void {
     this.filteredAccounts = this.accounts.filter(
      account => account.money_id === this.moneyIdSent
    );
      console.log("💰 Caisses filtrées pour money_id =", this.moneyIdSent, this.filteredAccounts);
  }

 ngAfterViewInit(){
    setTimeout(() => { this.defaultinput.setFocus(); },200);
  }
    ngOnChanges(changes: SimpleChanges): void {
    if (this.accounts && this.moneyIdSent !== undefined) {
      this.filteredAccounts = this.accounts.filter(
        acc => acc.money_id === this.moneyIdSent
      );
    }
  }

  close() {
    this.appserv.modalCtrl.dismiss();
  }

  select(account: any) {
    this.appserv.modalCtrl.dismiss(account);
  }

}
