import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreditApiService } from '../credit-api.service';

@Component({
  selector: 'app-credit-approve-modal', 
  templateUrl: './credit-approve-modal.component.html',
  styleUrls:['./credit-approve-modal.component.scss'],
})
export class CreditApproveModal {

  @Input() credit: any;

  loading = false;
  error = '';

  approvedAmount: number | null = null;

  constructor(
    private modalCtrl: ModalController,
    private creditApi: CreditApiService
  ) {}

  ngOnInit() {
    // par défaut, proposer le montant demandé
    this.approvedAmount = Number(
      this.credit.principal_amount_requested
    );
  }

  close() {
    this.modalCtrl.dismiss(false);
  }

  confirm() {
    this.error = '';

    const requested = Number(
      this.credit.principal_amount_requested
    );

    if (!this.approvedAmount || this.approvedAmount <= 0) {
      this.error = 'Montant validé invalide';
      return;
    }

    if (this.approvedAmount > requested) {
      this.error =
        'Le montant validé ne peut pas dépasser le montant demandé';
      return;
    }

    this.loading = true;

    this.creditApi.approve(this.credit.id, {
      approved_amount: this.approvedAmount,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.modalCtrl.dismiss(true);
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.message ??
          'Erreur lors de la validation du crédit';
      },
    });
  }
}
