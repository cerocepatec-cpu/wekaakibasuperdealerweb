import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreditApiService } from '../credit-api.service';
import { AppservicesService } from '../services/appservices.service';

@Component({
  selector: 'app-credit-disburse',
  templateUrl: './credit-disburse.component.html',
})
export class CreditDisburseComponent implements OnInit {

  @Input() credit!: any;
  @Input() funds: any[] = [];

  selectedFundId: number | null = null;
  disburseAmount: number | null = null;

  loading = false;
  error = '';

  get approvedAmount() {
    return Number(this.credit.principal_amount_approved);
  }

  get alreadyDisbursed() {
    return Number(this.credit.total_disbursed_amount ?? 0);
  }

  get remainingAmount() {
    return this.approvedAmount - this.alreadyDisbursed;
  }

  constructor(
    public appserv:AppservicesService,
    private modalCtrl: ModalController,
    private creditApi: CreditApiService
  ) {}

  ngOnInit(): void {
      this.getlistTubs();
  }

  close() {
    this.modalCtrl.dismiss();
  }

getlistTubs() {
  this.appserv.myTubs(this.appserv.actualUser.id).subscribe(
    (data: any[]) => {

      // 🔒 filtrage strict par monnaie du crédit
      this.funds = data.filter(fund =>
        fund.money_id === this.credit.money_id
      );

      // sécurité supplémentaire
      if (this.funds.length === 0) {
        this.appserv.presentToast(
          'Aucune caisse disponible pour la monnaie du crédit.',
          'warning'
        );
      }

    },
    () => {
      this.appserv.presentToast(
        'Erreur survenue lors de la récupération des caisses.',
        'danger'
      );
    }
  );
}


  confirm() {
    if (!this.selectedFundId) {
      this.error = 'Veuillez sélectionner une caisse';
      return;
    }

    if (!this.disburseAmount || this.disburseAmount <= 0) {
      this.error = 'Veuillez saisir un montant valide';
      return;
    }

    if (this.disburseAmount > this.remainingAmount) {
      this.error = 'Le montant dépasse le reste à servir';
      return;
    }

    this.loading = true;
    this.error = '';

    this.creditApi.disburse(this.credit.id, {
      fund_id: this.selectedFundId,
      amount: this.disburseAmount,
    }).subscribe({
      next: (res) => {
        console.log("credit disbursed",res);
        this.loading = false;
        this.modalCtrl.dismiss(res,'success');
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.error =
          err?.error?.message ??
          'Erreur lors du service du crédit';
      }
    });
  }
}
