import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppservicesService } from 'src/app/services/appservices.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { MembersaccountsService } from 'src/app/services/membersaccounts.service';
import { WekamemberaccountpickerComponent } from 'src/app/wekamemberaccountpicker/wekamemberaccountpicker.component';

@Component({
  selector: 'app-newwekatransfertfounds',
  templateUrl: './newwekatransfertfounds.component.html',
  styleUrls: ['./newwekatransfertfounds.component.scss'],
})
export class NewwekatransfertfoundsComponent implements OnInit {
  @Input() shouldReturn: boolean = false;

  form = this.fb.group({
    type: ['deposit', Validators.required],
    nature: ['account_account', Validators.required],
    member_account_id: [null, Validators.required],
    beneficiary_account_id: [null, Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    pin: ['7227', [Validators.minLength(4)]],
    motif: ['', Validators.required],
  });

  senderAccount: any = null;
  receiverAccount: any = null;

  transactionSuccess = false;
  errorMessage = '';

  selectedSourceAccount: any = null;
  collectorAccountNumber = '';
  myAccounts: any[] = [];
  isSuperDealer = false;
  isLookingUpCollector = false;

  constructor(
    private authserv: AuthentificationService,
    private fb: FormBuilder,
    public appserv: AppservicesService,
    private memberaccountserv: MembersaccountsService
  ) {}

  ngOnInit() {
    this.detectRoleAndPrepareAccounts();
  }
  async ngAfterViewInit() {
    const accounts = await this.memberaccountserv.getmemberaccounts(
      this.appserv.getactualuser().id
    );
    this.myAccounts = accounts.data;
    console.log('account for connected user', this.myAccounts);
  }

  detectRoleAndPrepareAccounts() {
    const actualUser = this.appserv.getactualuser?.() || {};
    this.isSuperDealer = actualUser?.user_type === 'super_dealer';

    // adapte ici selon la vraie structure que tu reçois du backend
    this.myAccounts = actualUser?.accounts || [];

    // Si un seul compte, on le sélectionne directement
    if (this.isSuperDealer && this.myAccounts.length === 1) {
      this.selectSourceAccount(this.myAccounts[0]);
    }
  }

  selectSourceAccount(account: any) {
    this.selectedSourceAccount = account;
    this.senderAccount = account;

    this.form.patchValue({
      member_account_id: account?.id || null,
    });
  }

  onCollectorAccountChange(ev: any) {
    const value = ev?.detail?.value ?? ev ?? '';
    this.collectorAccountNumber = (value || '').trim();

    // reset bénéficiaire si le numéro change
    this.receiverAccount = null;
    this.form.patchValue({
      beneficiary_account_id: null,
    });
  }

  async lookupCollectorAccount() {
    if (
      !this.collectorAccountNumber ||
      this.collectorAccountNumber.trim().length < 3
    ) {
      this.appserv.presentToast(
        'Veuillez entrer le numéro du compte collecteur.',
        'warning'
      );
      return;
    }

    this.isLookingUpCollector = true;

    // this.memberaccountserv
    //   .findByAccountNumber(this.collectorAccountNumber.trim())
    //   .subscribe({
    //     next: (response: any) => {
    //       this.isLookingUpCollector = false;

    //       if (
    //         (response?.message === 'success' || response?.status === 200) &&
    //         response?.data
    //       ) {
    //         this.receiverAccount = response.data;
    //         this.form.patchValue({
    //           beneficiary_account_id: response.data.id,
    //         });

    //         this.appserv.presentToast(
    //           'Compte collecteur trouvé avec succès.',
    //           'success'
    //         );
    //       } else {
    //         this.receiverAccount = null;
    //         this.form.patchValue({
    //           beneficiary_account_id: null,
    //         });

    //         this.appserv.presentToast(
    //           response?.error || 'Compte collecteur introuvable.',
    //           'warning'
    //         );
    //       }
    //     },
    //     error: (err) => {
    //       this.isLookingUpCollector = false;
    //       this.receiverAccount = null;
    //       this.form.patchValue({
    //         beneficiary_account_id: null,
    //       });

    //       this.appserv.presentToast(
    //         'Erreur lors de la recherche du compte collecteur.',
    //         'danger'
    //       );
    //       console.log('lookupCollectorAccount error', err);
    //     },
    //   });
  }

  canSubmit(): boolean {
    const raw = this.form.getRawValue();

    return this.form.valid;
  }

  @HostListener('window:keydown', ['$event'])
  async onKeyDownPress(event: KeyboardEvent) {
    const topModal = await this.appserv.modalCtrl.getTop();
    if (topModal && topModal.component !== this.constructor) {
      return;
    }

    if (event.key === 'Enter') {
      this.submit();
    }
  }

  async submit() {
    const raw = this.form.getRawValue();

    if (!raw.member_account_id) {
      this.appserv.presentToast(
        'Veuillez sélectionner un compte source.',
        'warning'
      );
      return;
    }

    if (!raw.beneficiary_account_id) {
      this.appserv.presentToast(
        this.isSuperDealer
          ? 'Veuillez d’abord rechercher et valider le compte du collecteur.'
          : 'Veuillez sélectionner un compte bénéficiaire.',
        'warning'
      );
      return;
    }

    if (!raw.amount || raw.amount <= 0) {
      this.appserv.presentToast(
        'Veuillez entrer un montant supérieur à 0 svp!',
        'warning'
      );
      return;
    }

    if (!raw.motif) {
      this.appserv.presentToast(
        'Veuillez entrer un motif de la transaction svp!',
        'warning'
      );
      return;
    }

    const pin: any = await this.authserv.callPinModal();
    if (!pin || pin.length <= 0) {
      this.appserv.presentToast('Aucun ou mauvais Pin fourni svp!', 'warning');
      return;
    }

    const payload = {
      ...raw,
      pin: pin,
    };

    const load = await this.appserv.loadctrl.create({
      message: 'Transfert en cours...',
      mode: 'ios',
      spinner: 'crescent',
    });

    await load.present();

    this.memberaccountserv.newtransfert(payload).subscribe({
      next: (response) => {
        load.dismiss();

        if (response.message === 'success' || response.status === 200) {
          this.appserv.presentToast(
            'Transfert effectué avec succès.',
            'success'
          );
            this.appserv.modalCtrl.dismiss(response.data, 'added');
        } else {
          this.appserv.presentToast(
            response.error || 'Une erreur est survenue.',
            'warning'
          );
        }

        console.log('response', response);
      },
      error: (err) => {
        load.dismiss();
        this.appserv.presentToast(
          'Une erreur est survenue lors du transfert.',
          'danger'
        );
        console.log('error response', err);
      },
    });
  }

  async pickaccount(criteria: string) {
    const modal = await this.appserv.modalCtrl.create({
      component: WekamemberaccountpickerComponent,
      mode: 'ios',
      cssClass: 'modal-border-radius-20',
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'selected' && data) {
      if (criteria === 'sender') {
        this.senderAccount = data;
        this.selectedSourceAccount = data;

        this.form.patchValue({
          member_account_id: this.senderAccount.id,
        });
      } else {
        this.receiverAccount = data;

        this.form.patchValue({
          beneficiary_account_id: this.receiverAccount.id,
        });

      }
    }
  }

  close() {
    this.appserv.modalCtrl.dismiss();
  }
}