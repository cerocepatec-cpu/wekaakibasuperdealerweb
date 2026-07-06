import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountpickerComponent } from 'src/app/accounts/accountpicker/accountpicker.component';
import { Accounts } from 'src/app/interfaces/accounts';
import { AppservicesService } from 'src/app/services/appservices.service';
import { ExpendituresService } from 'src/app/services/expenditures.service';
import { OthersentriesService } from '../../../services/othersentries.service';
import { Money } from 'src/app/interfaces/money';
import { SelectmoneyComponent } from 'src/app/selectmoney/selectmoney.component';
import { IonInput } from '@ionic/angular';
import { ServantsService } from 'src/app/services/servants.service';
import { Servant } from 'src/app/interfaces/servants';
import { ServantpickerComponent } from 'src/app/servants/servantpicker/servantpicker.component';
import { Expenditures } from 'src/app/interfaces/expenditures';
import { PicktubsComponent } from 'src/app/tubs/picktubs/picktubs.component';
import { Tubs } from 'src/app/interfaces/tubs';
import { AuthentificationService } from 'src/app/services/authentification.service';
@Component({
  selector: 'app-newexpenditure',
  templateUrl: './newexpenditure.component.html',
  styleUrls: ['./newexpenditure.component.scss'],
})
export class NewexpenditureComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!: IonInput;
  @Input() title: string = '';
  @Input() isentry: boolean = false;
  actualservant: Servant = {};
  actualaccount: Accounts = {};
  actualMoney: Money = {};
  actualfund: Tubs = {};
  showprogress = false;
  newservant = this.fb.group({
    user_id: [0],
    name: ['', Validators.required],
    description: [],
    address: [''],
    phone: [''],
    email: [''],
    enterprise_id: [0],
    photo: [''],
  });

  newexpenditure = this.fb.group({
    user_id: [this.appserv.getactualuser().id],
    money_id: [0],
    money_abreviation: [],
    ticket_office_id: [0],
    fund_id: [0],
    amount: [Validators.required],
    motif: [''],
    beneficiary: [0],
    account_name: [''],
    account_id: [0],
    is_validate: [false],
    done_at: [this.appserv.defaultdate()],
    uuid: [''],
    sync_status: [],
    enterprise_id: [this.appserv.getactualuser().enterprise_id],
  });

  constructor(
    private servantserv: ServantsService,
    public appserv: AppservicesService,
    private expenditureserv: ExpendituresService,
    private fb: FormBuilder,
    private entryserv: OthersentriesService,
    private authserv: AuthentificationService
  ) {}

  ngOnInit() {
    this.actualMoney = this.appserv.getDefaultmoney();
  }

  ionViewDidEnter() {
    this.defaultinput.setFocus();
  }

  async pickservant() {
    const modal = await this.appserv.modalCtrl.create({
      component: ServantpickerComponent,
      cssClass: 'modal-border-radius-20',
      componentProps: { title: this.isentry ? 'Provenance' : 'Bénéficiaire' },
    });
    (await modal).present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'selected') {
      this.actualservant = data;
      this.newexpenditure.patchValue({
        beneficiary: data.id,
      });
    }
  }

  addnewservant() {
    this.showprogress = true;

    this.newservant.patchValue({
      enterprise_id: this.appserv.getactualuser().enterprise_id,
      user_id: this.appserv.getactualuser().id,
    });

    this.servantserv.addnew(this.newservant.value).subscribe(
      (data) => {
        this.showprogress = false;
        this.appserv.presentToast(`Information ajoutée avec succès`, 'success');
        this.servantserv.addtoOffline(data);
        this.actualservant = data;
      },
      (error) => {
        this.showprogress = false;
        this.appserv.presentToast(
          `Impossible d'ajouter l'information`,
          'danger'
        );
      }
    );
  }

  addnew() {
    const amount = this.newexpenditure.getRawValue().amount;
    if (amount && amount > 0) {
      this.showprogress = true;

      this.newexpenditure.patchValue({
        money_id: this.actualMoney.id,
        account_id: this.actualaccount.id,
        user_id: this.appserv.getactualuser().id,
        beneficiary: this.actualservant.id,
      });

      if (this.isentry) {
        //entry method here
        this.savenewentry();
      } else {
        //expenditure method here
        this.savenewexpenditure();
      }
    } else {
      this.appserv.presentToast(
        'Entrer au moins un montant supérieur à 0',
        'warning'
      );
      this.defaultinput.setFocus();
    }
  }

  async savenewentry() {
    const pin = await this.authserv.callPinModal();
    if (!pin) {
      this.appserv.presentToast('Pin incorrect ou fenetre cloturee', 'warning');
      return;
    }
    this.entryserv.new(this.newexpenditure.value).subscribe(
      (data) => {
        this.showprogress = false;
        this.appserv.presentToast(
          `Entrée argent effectuée avec succès.`,
          'success'
        );
        this.entryserv.addToOffline(data);
        this.appserv.modalCtrl.dismiss(data, 'added');
      },
      (error) => {
        this.showprogress = false;
        this.appserv.presentToast(
          `Entrée argent échouée. Veuillez vérifier votre connexion internet.`,
          'success'
        );
      }
    );
  }

  async savenewexpenditure() {
    if (this.newexpenditure.invalid) {
      this.newexpenditure.markAllAsTouched();

      this.appserv.presentToast(
        'Veuillez corriger les champs du formulaire.',
        'warning'
      );

      return;
    }

    const pin = await this.authserv.callPinModal();
    if (!pin) {
      this.appserv.presentToast('Pin incorrect ou fenetre cloturee', 'warning');
      return;
    }

    this.showprogress = true;

    this.expenditureserv.addew(this.newexpenditure.value).subscribe({
      next: (data: any) => {
        this.showprogress = false;

        if (data.message === 'success' && data.status === 200) {
          this.appserv.presentToast(
            'Dépense argent effectuée avec succès',
            'success'
          );

          this.expenditureserv.addToOffline(data);
          this.appserv.modalCtrl.dismiss(data, 'added');
        } else {
          const message =
            data?.error || data?.message || 'Dépense argent échouée.';

          this.appserv.presentToast(
            `Dépense argent échouée. ${message}`,
            'warning'
          );
        }
      },

      error: (err) => {
        this.showprogress = false;

        const message = this.getApiErrorMessage(err);

        this.appserv.presentToast(
          `Sortie argent échouée. ${message}`,
          'warning'
        );
      },
    });
  }

  private getApiErrorMessage(err: any): string {
    const error = err?.error;

    if (!error) {
      return 'Erreur inconnue.';
    }

    if (error.errors && typeof error.errors === 'object') {
      const messages: string[] = [];

      Object.keys(error.errors).forEach((key) => {
        const value = error.errors[key];

        if (Array.isArray(value)) {
          value.forEach((msg) => messages.push(msg));
        } else if (value) {
          messages.push(value);
        }
      });

      if (messages.length > 0) {
        return messages.join(' ');
      }
    }

    if (typeof error.error === 'string') {
      return error.error;
    }

    if (error.error?.message) {
      return error.error.message;
    }

    if (typeof error.message === 'string') {
      return error.message;
    }

    if (typeof err.message === 'string') {
      return err.message;
    }

    return 'Une erreur est survenue.';
  }
  saveofflineExpenditure() {
    let expend: Expenditures = {
      money_name: this.actualMoney.money_name,
      abreviation: this.actualMoney.abreviation,
      account_name: this.actualaccount.name,
      user_name: this.appserv.getactualuser().user_name,
      id: 0,
      user_id: this.appserv.getactualuser().id,
      money_id: this.actualMoney.id,
      ticket_office_id: 0,
      amount: this.newexpenditure.getRawValue().amount,
      motif: this.newexpenditure.getRawValue().motif,
      account_id: this.actualaccount.id,
      is_validate: false,
      uuid: this.appserv.getUUID('E'),
      sync_status: '0',
      enterprise_id: this.appserv.getactualEse().id,
      created_at: this.appserv.getDateTime(),
      updated_at: this.appserv.getDateTime(),
      done_at: this.appserv.defaultdate(),
    };

    this.newexpenditure.patchValue({
      account_name: this.actualaccount.name,
      money_abreviation: this.actualMoney.abreviation,
      uuid: this.appserv.getUUID('EX'),
    });
    this.expenditureserv.addToSyncingOffline(this.newexpenditure.value);
    this.appserv.presentToast(
      'Dépense argent effectuée avec succès',
      'success'
    );
    this.showprogress = false;
    this.expenditureserv.addToOffline(expend);
    this.appserv.modalCtrl.dismiss(expend, 'added');
  }

  async moneypicker() {
    const modal = await this.appserv.modalCtrl.create({
      component: SelectmoneyComponent,
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'selected') {
      this.actualMoney = data;
      this.newexpenditure.patchValue({
        money_id: data.id,
      });
    }
  }

  async accountpicker() {
    const modal = await this.appserv.modalCtrl.create({
      component: AccountpickerComponent,
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'selected') {
      this.actualaccount = data;
      this.newexpenditure.patchValue({
        account_id: data.id,
      });
      this.defaultinput.setFocus();
    }
  }

  async picktubs() {
    const modal = await this.appserv.modalCtrl.create({
      component: PicktubsComponent,
      cssClass: 'modal-border-radius-20',
    });

    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'selected') {
      console.log(data);
      this.actualfund = data;
      this.newexpenditure.patchValue({
        fund_id: data.id,
      });
    }
  }
}
