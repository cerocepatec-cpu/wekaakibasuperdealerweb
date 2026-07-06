import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { InvoicePrintComponent } from '../module/uzisha/home/invoice-print/invoice-print.component';
import { Users } from '../interfaces/users';
import { MembersaccountsService } from '../services/membersaccounts.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { IonicSafeString } from '@ionic/angular';

@Component({
  selector: 'app-newtransaction',
  templateUrl: './newtransaction.component.html',
  styleUrls: ['./newtransaction.component.scss'],
})
export class NewtransactionComponent implements OnInit {
  @Input() usersent: Users = {};

  accountslist: any[] = [];
  accountslistBackup: any[] = [];
  actualaccount: any = {};

  listtubs: any[] = [];
  listtubsBackup: any[] = [];

  showprogress = false;
  previewLoading = false;
  validationLoading = false;

  previewData: any = null;

  transactionform = this.fb.group({
    amount: [0, Validators.required],
    sold_before: [],
    sold_after: [],
    type: ['deposit', Validators.required],
    motif: ['', Validators.required],
    nature: ['cash_virtual', Validators.required],
    user_id: [0, Validators.required],
    member_account_id: [0, Validators.required],
    enterprise_id: [0, Validators.required],
    transaction_status: [''],
    operation_done_by: [],
    account_id: [],
    phone: [],
    adresse: [],
    fund_id: [0],

    apply_fees: [true],
  });
  constructor(
    private fb: FormBuilder,
    public appserv: AppservicesService,
    private memberserv: MembersaccountsService,
    private authserv: AuthentificationService
  ) {}

  ngOnInit() {
    this.getmemberaccounts();

    this.transactionform.patchValue({
      user_id: this.appserv.actualUser.id,
      enterprise_id: this.appserv.actualEse.id,
      transaction_status: 'validated',
    });

    this.transactionform.valueChanges.subscribe(() => {
      this.previewData = null;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getlistTubs();
    }, 200);
  }

  get selectedTypeLabel(): string {
    return this.transactionform.getRawValue().type === 'withdraw'
      ? 'Retrait'
      : 'Dépôt';
  }

  get selectedAccountMoney(): string {
    return this.actualaccount?.money_abreviation || '';
  }

  segmentChanged(event: any) {
    const value = event.detail.value;

    this.previewData = null;

    this.transactionform.patchValue({
      type: value,
      nature: value === 'withdraw' ? 'finance_withdrawal' : 'cash_virtual',

      apply_fees: true,
    });
  }

  resetFilters() {
    this.accountslist = [...this.accountslistBackup];
    this.listtubs = [...this.listtubsBackup];
  }

  filterAccountAndFunds() {
    const memberAccountId =
      this.transactionform.getRawValue().member_account_id;
    // const fundId = this.transactionform.getRawValue().fund_id;

    this.accountslist = [...this.accountslistBackup];
    this.listtubs = [...this.listtubsBackup];

    if (memberAccountId) {
      const memberAccount = this.accountslistBackup.find(
        (a) => Number(a.id) === Number(memberAccountId)
      );

      if (memberAccount) {
        this.actualaccount = memberAccount;

        this.listtubs = this.listtubsBackup.filter(
          (tub) => Number(tub.money_id) === Number(memberAccount.money_id)
        );
      }
    }

    // if (fundId) {
    //   const memberTub = this.listtubsBackup.find(
    //     (t) => Number(t.id) === Number(fundId)
    //   );

    //   if (memberTub) {
    //     this.accountslist = this.accountslistBackup.filter(
    //       (acc) => Number(acc.money_id) === Number(memberTub.money_id)
    //     );
    //   }
    // }
  }

  @HostListener('window:keydown', ['$event'])
  async handleKeyDown(event: KeyboardEvent) {
    const topModal = await this.appserv.modalCtrl.getTop();
    const topAlert = await this.appserv.alertctrl.getTop();

    if (topModal && topModal.component !== this.constructor) {
      return;
    }

    if (
      topAlert &&
      !topAlert.classList.contains('alert-transaction-validation')
    ) {
      return;
    }

    if (
      topAlert &&
      topAlert.classList.contains('alert-transaction-validation')
    ) {
      if (event.key === 'Enter') {
        const yesButton = topAlert.querySelector(
          '.alert-button:nth-child(2)'
        ) as HTMLElement;
        yesButton?.click();
      } else if (event.key === 'Escape') {
        const cancelButton = topAlert.querySelector(
          '.alert-button:nth-child(1)'
        ) as HTMLElement;
        cancelButton?.click();
      }
      return;
    }

    if (!topAlert && event.key === 'Enter') {
      event.preventDefault();
      this.validateoperation();
    }
  }

  selectaccount(account: any) {
    this.actualaccount = account;

    this.transactionform.patchValue({
      member_account_id: account.id,
    });

    this.filterAccountAndFunds();
  }

  getlistTubs() {
    this.showprogress = true;

    this.appserv.myTubs(this.appserv.actualUser.id).subscribe(
      (data) => {
        this.showprogress = false;
        this.listtubs = data || [];
        this.listtubsBackup = [...this.listtubs];
      },
      () => {
        this.showprogress = false;
        this.appserv.presentToast(
          'Erreur survenue lors de la récupération de la liste des caisses.',
          'danger'
        );
      }
    );
  }

  getmemberaccounts() {
    this.showprogress = true;

    this.memberserv.membersaccounts(this.usersent.id).subscribe(
      (response) => {
        this.showprogress = false;

        if (response.message !== 'success') {
          this.appserv.presentToast(response.error, 'warning');
          return;
        }

        this.accountslist = response.data || [];
        this.accountslistBackup = [...this.accountslist];
      },
      () => {
        this.showprogress = false;
        this.appserv.presentToast(
          'Impossible de récupérer les comptes du membre',
          'danger'
        );
      }
    );
  }

  validateLocalForm(): boolean {
    const raw = this.transactionform.getRawValue();

    if (!raw.member_account_id || raw.member_account_id <= 0) {
      this.appserv.presentToast('Vous devez sélectionner un compte', 'warning');
      return false;
    }

    if (
      (!raw.fund_id || raw.fund_id <= 0) &&
      this.transactionform.getRawValue().type === 'deposit'
    ) {
      this.appserv.presentToast(
        'Vous devez sélectionner une caisse',
        'warning'
      );
      return false;
    }

    if (!raw.amount || raw.amount <= 0) {
      this.appserv.presentToast(
        "Le montant de l'opération doit être supérieur à 0",
        'warning'
      );
      return false;
    }

    if (!raw.motif || raw.motif.length <= 2) {
      this.appserv.presentToast('Veuillez fournir le motif svp!', 'warning');
      return false;
    }

    return true;
  }

  buildPayload(preview = false): any {
    return {
      ...this.transactionform.getRawValue(),
      preview,
      transaction_status: 'validated',
    };
  }

  async validateoperation() {
    if (!this.validateLocalForm()) {
      return;
    }

    const raw = this.transactionform.getRawValue();

    if (raw.nature === 'finance_withdrawal') {
      await this.previewWithdraw();
      return;
    }

    await this.confirmAndSend();
  }

  async previewWithdraw() {
    const load = await this.appserv.loadctrl.create({
      message: 'Calcul des frais...',
      mode: 'ios',
      translucent: true,
      spinner: 'crescent',
    });

    await load.present();

    this.previewLoading = true;
    this.showprogress = true;

    this.memberserv.membernewtransaction(this.buildPayload(true)).subscribe({
      next: async (response) => {
        this.previewLoading = false;
        this.showprogress = false;
        await load.dismiss();

        if (response.status === 200) {
          this.previewData = response.data;
          await this.openPreviewConfirm();
          return;
        }

        this.appserv.presentToast(
          response.error || 'Impossible de calculer la prévisualisation',
          'warning'
        );
      },
      error: async (err) => {
        this.previewLoading = false;
        this.showprogress = false;
        await load.dismiss();

        this.appserv.presentToast(
          err?.error?.error || 'Erreur pendant la prévisualisation',
          'danger'
        );
      },
    });
  }

  async openPreviewConfirm() {
    const p = this.previewData || {};
    const money = this.selectedAccountMoney;

    const message = new IonicSafeString(`
<div style="
text-align:left;
padding:6px 0;
">

<div style="
background:#f8fafc;
border-radius:18px;
padding:14px;
margin-bottom:12px;
">

<div style="
font-size:12px;
opacity:.7;
margin-bottom:6px;
">
Résumé financier
</div>

<div style="
display:flex;
justify-content:space-between;
margin-bottom:8px;
">
<span>Montant demandé</span>
<strong>
${p.amount || 0} ${money}
</strong>
</div>

<div style="
display:flex;
justify-content:space-between;
margin-bottom:8px;
">
<span>Frais</span>
<strong style="color:#f59e0b;">
${p?.fees?.fee || 0} ${money}
</strong>
</div>

<div style="
display:flex;
justify-content:space-between;
margin-bottom:8px;
">
<span>Taux appliqué</span>
<strong>
${p?.fees?.percent || 0}%
</strong>
</div>

${
  (p.first_entry_amount || 0) > 0
    ? `
<div style="
display:flex;
justify-content:space-between;
margin-bottom:8px;
">
<span>Première mise</span>
<strong style="color:#ef4444;">
${p.first_entry_amount} ${money}
</strong>
</div>
`
    : ''
}

<hr style="
border:none;
border-top:1px solid #e2e8f0;
margin:12px 0;
">

<div style="
display:flex;
justify-content:space-between;
font-size:16px;
font-weight:700;
margin-bottom:8px;
">
<span>Total à débiter</span>
<span style="
color:#16a34a;
">
${p.total_required || p.total_amount || 0}
${money}
</span>
</div>

<div style="
display:flex;
justify-content:space-between;
opacity:.8;
">
<span>Solde actuel</span>
<strong>
${p.member_sold_before || 0}
${money}
</strong>
</div>

</div>

</div>
`);

    const alert = await this.appserv.alertctrl.create({
      header: 'Confirmer le retrait',
      subHeader: `Total à débiter : ${
        p.total_required || p.total_amount || 0
      } ${money}`,
      message: `
    <div style="text-align:left">
      <p><strong>Montant :</strong> ${p.amount || 0} ${money}</p>
      <p><strong>Frais :</strong> ${p?.fees?.fee || 0} ${money}</p>
      <p><strong>Taux :</strong> ${p?.fees?.percent || 0}%</p>

      ${
        (p.first_entry_amount || 0) > 0
          ? `<p><strong>Première mise :</strong> ${p.first_entry_amount} ${money}</p>`
          : ''
      }

      <p><strong>Solde actuel :</strong> ${
        p.member_sold_before || 0
      } ${money}</p>
    </div>
  `,
      cssClass: 'alert-transaction-validation',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Valider',
          handler: async () => {
            const pin: any = await this.authserv.callPinModal();

            if (pin && pin.length === 4) {
              this.sendtransaction();
            } else {
              this.appserv.presentToast(
                'Aucun ou mauvais Pin fourni svp!',
                'warning'
              );
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmAndSend() {
    const alert = await this.appserv.alertctrl.create({
      header: 'Validation',
      message: `Validez-vous cette opération de ${this.selectedTypeLabel.toLowerCase()} ?`,
      mode: 'ios',
      translucent: true,
      cssClass: 'custom-alert alert-transaction-validation',
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui',
          handler: async () => {
            const pin: any = await this.authserv.callPinModal();

            if (pin && pin.length === 4) {
              this.sendtransaction();
            } else {
              this.appserv.presentToast(
                'Aucun ou mauvais Pin fourni svp!',
                'warning'
              );
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async sendtransaction() {
    const load = await this.appserv.loadctrl.create({
      message: 'Validation en cours...',
      mode: 'ios',
      translucent: true,
      spinner: 'crescent',
    });

    await load.present();

    this.validationLoading = true;
    this.showprogress = true;

    this.memberserv.membernewtransaction(this.buildPayload(false)).subscribe({
      next: async (response) => {
        this.validationLoading = false;
        this.showprogress = false;
        await load.dismiss();

        if (response.message === 'success' && response.status === 200) {
          this.appserv.presentToast(
            'Opération validée avec succès!',
            'success'
          );

          this.alertprintoperation(response.data);
          this.appserv.modalCtrl.dismiss();
          return;
        }

        this.appserv.presentToast(
          response.error || 'Impossible de valider cette opération',
          'warning'
        );
      },
      error: async (err) => {
        this.validationLoading = false;
        this.showprogress = false;
        await load.dismiss();

        this.appserv.presentToast(
          err?.error?.error ||
            'Une erreur est survenue. Veuillez réessayer plus tard!',
          'danger'
        );
      },
    });
  }

  async alertprintoperation(data: any) {
    const alert = await this.appserv.alertctrl.create({
      header: 'Félicitation!',
      message: 'Opération terminée avec succès!',
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Imprimer',
          handler: async () => {
            const modalprint = await this.appserv.modalCtrl.create({
              component: InvoicePrintComponent,
              componentProps: { datasent: data },
            });

            modalprint.present();
          },
        },
        { text: 'Fermer', role: 'cancel' },
      ],
    });

    alert.present();
  }

  async beforeleft() {
    const alert = await this.appserv.alertctrl.create({
      header: 'Attention!',
      message:
        'Vous avez une activité en cours! Voulez-vous vraiment fermer cette fenêtre?',
      mode: 'ios',
      translucent: true,
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui',
          handler: () => {
            this.appserv.closemodal();
          },
        },
      ],
    });

    alert.present();
  }
}
