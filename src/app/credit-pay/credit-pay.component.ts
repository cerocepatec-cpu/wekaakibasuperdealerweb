import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreditApiService } from '../credit-api.service';
import { MembersaccountsService } from '../services/membersaccounts.service';
import { AppservicesService } from '../services/appservices.service';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-credit-pay',
  templateUrl: './credit-pay.component.html',
  styleUrls: ['./credit-pay.component.scss'],
})
export class CreditPayComponent implements OnInit {

 @Input() credit: any;

  mode: 'installments' | 'amount' = 'installments';

  installments: any[] = [];
  selectedInstallments: any[] = [];

  memberAccounts: any[] = [];
  selectedAccountId: number | null = null;

  funds: any[] = [];
  selectedFundId: number | null = null;

  amount = 0;
  loading = false;
  error = '';

  constructor(
    private authserv:AuthentificationService,
    public appserv:AppservicesService,
    private memberAccountServ:MembersaccountsService,
    private modalCtrl: ModalController,
    private creditApi: CreditApiService
  ) {}

  ngOnInit() {
    this.installments = this.credit.installments
      ?.filter((i: any) =>
        ['pending', 'partial', 'late'].includes(i.status)
      ) || [];

      console.log(this.installments);
    this.loadMemberAccounts();
    this.loadFunds();
  }

  close() {
    this.modalCtrl.dismiss(false);
  }

  /* ======================
   | DATA LOADING
   ======================*/

  async loadMemberAccounts() {
    const accounts=await this.memberAccountServ.getmemberaccounts(this.credit.user_id);
    if (accounts.data && accounts.message==="success") {
      this.memberAccounts=accounts.data;
      this.memberAccounts=this.memberAccounts.filter(c=>c.money_id===this.credit.money_id);
    }
  }

  loadFunds() {
    this.appserv.myTubs(this.appserv.actualUser.id).subscribe(
      data=>{
        this.funds=data;
        this.funds=this.funds.filter(f=>f.money_id===this.credit.money_id);
      },
      error=>{
        this.appserv.presentToast('Erreur survenue lors de la recupération de la liste des caisses.','danger');
      });
  }

  /* ======================
   | MODE HANDLING
   ======================*/

  toggleInstallment(installment: any) {
    const exists = this.selectedInstallments.find(
      i => i.id === installment.id
    );

    if (exists) {
      this.selectedInstallments =
        this.selectedInstallments.filter(i => i.id !== installment.id);
    } else {
      this.selectedInstallments.push(installment);
    }

    this.amount = this.selectedInstallments.reduce(
      (sum, i) => sum + Number(i.remaining_amount),
      0
    );
  }

  /* ======================
   | SUBMIT
   ======================*/

  async submit() {
    this.error = '';

    if (!this.selectedAccountId) {
      this.error = 'Veuillez choisir un compte du membre';
      return;
    }

    if (!this.selectedFundId) {
      this.error = 'Veuillez choisir une caisse';
      return;
    }

    if (this.amount <= 0) {
      this.error = 'Montant invalide';
      return;
    }

    const modalPin = await this.authserv.callPinModal();
    if (!modalPin) {
      this.appserv.presentToast('Le Pin est incorrect', 'warning');
      return;
    }

    this.loading = true;

    // 1️⃣ INITIATE
    this.creditApi.initiatePayment({
      credit_id: this.credit.id,
      member_account_id: this.selectedAccountId,
      amount: this.amount,
    }).subscribe({
      next: (payment) => {

        // 2️⃣ RECEIVE
        this.creditApi.receivePayment(payment.id, {
          fund_id: this.selectedFundId,
        }).subscribe({

          // 3️⃣ CONFIRM
          next: (res) => {
            this.creditApi.confirmPayment(payment.id).subscribe(() => {
              this.loading = false;
              this.modalCtrl.dismiss(res,"success");
            });
          },

          error: err => this.handleError(err)
        });
      },
      error: err => this.handleError(err)
    });
  }

  handleError(err: any) {
    this.loading = false;
    this.error = err?.error?.message ?? 'Erreur lors du paiement';
  }
}
