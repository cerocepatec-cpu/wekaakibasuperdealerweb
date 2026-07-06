import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { InvoicePrintComponent } from '../module/uzisha/home/invoice-print/invoice-print.component';
import { Users } from '../interfaces/users';
import { MembersaccountsService } from '../services/membersaccounts.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
@Component({
  selector: 'app-newvirtualsale',
  templateUrl: './newvirtualsale.component.html',
  styleUrls: ['./newvirtualsale.component.scss'],
})
export class NewvirtualsaleComponent implements OnInit {

   @Input() usersent: Users = {};
    accountslist: any[] = [];
    actualaccount: any = {};
    listtubs: any[] = [];
    showprogress = false;
    transactionform = this.fb.group({
      amount: [0, Validators.required],
      sold_before: [],
      sold_after: [],
      type: ['deposit', Validators.required],
      motif: [],
      nature: ['cash_virtual', Validators.required],
      user_id: [0, Validators.required],
      member_account_id: [0, Validators.required],
      enterprise_id: [0, Validators.required],
      transaction_status: [],
      operation_done_by: [],
      account_id: [],
      phone: [],
      adresse: [],
      fund_id: [],
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
        // type:this.appserv.permissionFilter('comptes','deposit')?'deposit':'withdraw',
        user_id: this.appserv.actualUser.id,
        enterprise_id: this.appserv.actualEse.id,
        transaction_status: 'validated',
      });
    }
  
    segmentChanged(event: any) {
      const value = event.detail.value;
      this.transactionform.patchValue({
        type: value,
        nature: value === 'withdraw' ? 'finance_withdrawal' : 'cash_virtual',
      });
      // console.log(event.detail.value);
    }
    filterAccountAndFunds() {
      if (this.transactionform.getRawValue().member_account_id) {
        console.log('actual account');
        const memberAccount = this.accountslist.find(
          (a) => a.id === this.transactionform.getRawValue().member_account_id
        );
        if (memberAccount) {
          console.log('actual account', memberAccount);
          this.accountslist = this.accountslist.filter(
            (acc) => acc.money_id === memberAccount.money_id
          );
        }
      }
  
      if (this.transactionform.getRawValue().fund_id) {
        console.log('actual tub');
        const memberTub = this.listtubs.find(
          (t) => t.id === this.transactionform.getRawValue().fund_id
        );
        if (memberTub) {
          console.log('actual tub', memberTub);
          this.listtubs = this.listtubs.filter(
            (tub) => tub.money_id === memberTub.money_id
          );
        }
      }
    }
  
    ngAfterViewInit() {
      setTimeout(() => {
        this.getlistTubs();
      }, 200);
    }
    @HostListener('window:keydown', ['$event'])
    async handleKeyDown(event: KeyboardEvent) {
      const topModal = await this.appserv.modalCtrl.getTop();
      const topAlert = await this.appserv.alertctrl.getTop();
  
      // Si un autre composant/modal que celui-ci est au-dessus
      if (topModal && topModal.component !== this.constructor) {
        return;
      }
  
      // Si une autre alerte que celle de ce composant est ouverte
      if (
        topAlert &&
        !topAlert.classList.contains('alert-transaction-validation')
      ) {
        return;
      }
  
      // ✅ Si une alerte de validation est ouverte
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
        return; // éviter d’exécuter autre chose
      }
  
      // ✅ Si aucune alerte n’est ouverte, Enter déclenche la validation
      if (!topAlert && event.key === 'Enter') {
        event.preventDefault();
        this.validateoperation();
      }
    }
  
    selectaccount(account) {
      this.actualaccount = account;
      this.transactionform.patchValue({
        member_account_id: account.id,
      });
    }
  
    getlistTubs() {
      this.showprogress = true;
      this.appserv.myTubs(this.appserv.actualUser.id).subscribe(
        (data) => {
          console.log('list tubs', data);
          this.showprogress = false;
          this.listtubs = data;
        },
        (error) => {
          this.showprogress = false;
          this.appserv.presentToast(
            'Erreur survenue lors de la recupération de la liste des caisses.',
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
          this.accountslist = response.data;
          console.log('accounts for member', response);
        },
        (error) => {
          this.showprogress = false;
          this.appserv.presentToast(
            'Impossible de récupérer les comptes du membre',
            'danger'
          );
        }
      );
    }
  
    async validateoperation() {
      if (
        !this.transactionform.getRawValue().member_account_id ||
        this.transactionform.getRawValue().member_account_id <= 0
      ) {
        this.appserv.presentToast(
          'Vous devez sélectionner un compte à ' +
            (this.transactionform.getRawValue().type === 'deposit'
              ? 'débiter'
              : 'créditer'),
          'warning'
        );
        return;
      }
  
      if (
        this.transactionform.getRawValue().type === 'deposit' &&
        this.transactionform.getRawValue().fund_id <= 0
      ) {
        this.appserv.presentToast(
          'Vous devez sélectionner une caisse',
          'warning'
        );
        return;
      }
  
      if (this.transactionform.getRawValue().amount <= 0) {
        this.appserv.presentToast(
          "Le montant de l'opération doit être supérieur à 0",
          'warning'
        );
        return;
      }
  
      if (
        !this.transactionform.getRawValue().motif ||
        this.transactionform.getRawValue().motif.length <= 2
      ) {
        this.appserv.presentToast('Veuillez fournir le motif svp!', 'warning');
        return;
      }
  
      const alert = await this.appserv.alertctrl.create({
        header: 'Validation',
        message: `Validez-vous cette opération ${
          this.transactionform.getRawValue().type === 'deposit'
            ? 'de débit'
            : 'de crédit'
        } ?`,
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
      load.present();
      this.showprogress = true;
      this.transactionform.patchValue({
        transaction_status: 'validated',
      });
    
      this.memberserv.membernewtransaction(this.transactionform.value).subscribe({
        next: (response) => {
          this.showprogress = false;
          load.dismiss();
          console.log('new transaction', response);
          if (
            response.message === 'error' &&
            response.error === 'no account sent'
          ) {
            this.appserv.presentToast(
              `Vous devez sélectionner un compte à ${
                this.transactionform.getRawValue().type === 'deposit'
                  ? 'débiter'
                  : 'créditer'
              }`,
              'warning'
            );
          }
  
          if (response.message === 'success' && response.status === 200) {
            this.appserv.presentToast(
              `Compte  ${response.data.memberaccount_name} ${
                this.transactionform.getRawValue().type === 'deposit'
                  ? 'débité'
                  : 'crédité'
              } avec succès!`,
              'success'
            );
            this.alertprintoperation(response.data);
            this.appserv.modalCtrl.dismiss();
          }
  
          if (
            response.message === 'error' &&
            response.error === 'no account find'
          ) {
            this.appserv.presentToast(
              "Aucun compte trouvé. Verifiez si votre compte existe auprès d'un administrateur.",
              'warning'
            );
          }
  
          if (
            response.message === 'error' &&
            response.error === 'sold not enough'
          ) {
            this.appserv.presentToast(
              'Solde de ce compte est insuffisant. Veuillez contacter votre approvisionner et réessayer plus tard!',
              'warning'
            );
          }
  
          if (
            response.message === 'error' &&
            response.error === 'account disabled'
          ) {
            this.appserv.presentToast(
              'Ce compte est désactivé. Veuillez contacter votre administrateur et réessayer plus tard!',
              'warning'
            );
          }
  
          if (response.message == 'error') {
            this.appserv.presentToast(response.error, 'warning');
          }
        },
        error: (err) => {
          this.showprogress = false;
          load.dismiss();
          console.log('error new transaction', err);
          this.appserv.presentToast(
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
