import { Component, OnInit, Input } from '@angular/core';
import { Users } from 'src/app/interfaces/users';
import { AppservicesService } from '../services/appservices.service';
import { MembersaccountsService } from '../services/membersaccounts.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MoneyService } from '../services/money.service';
import { DetailmemberaccountComponent } from '../detailmemberaccount/detailmemberaccount.component';

@Component({
  selector: 'app-membersaccounts',
  templateUrl: './membersaccounts.component.html',
  styleUrls: ['./membersaccounts.component.scss'],
})
export class MembersaccountsComponent implements OnInit {
  @Input() usersent: Users = {};
  moneys: any[] = [];
  accountslist: any[] = [];
  showprogress = false;
  editionmode = false;
  accountForm = this.fb.group({
    sold: [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    type: ['internal', Validators.required],
    account_status: ['enabled', Validators.required],
    money_id: [0, Validators.required],
    user_id: [0, Validators.required],
    account_number: ['', Validators.required],
    enterprise_id: [0, Validators.required],
    blocked_from: [''],
    blocked_to: [''],
    blocked_periocity: ['year'],
    blocked_step: [1],
  });
  constructor(
    public appserv: AppservicesService,
    private memberserv: MembersaccountsService,
    private fb: FormBuilder,
    private moneyserv: MoneyService
  ) {}

  ngOnInit() {
    this.getmemberaccounts();
    setTimeout(async () => {
      this.moneys = await this.moneyserv.getesemoneys();
      if (this.moneys.length > 0) {
        this.accountForm.patchValue({
          user_id: this.usersent.id,
          enterprise_id: this.appserv.getactualEse().id,
          money_id: this.moneys[0].id,
          description: this.usersent.full_name
            ? this.usersent.full_name +
              ' ' +
              this.moneys[0].abreviation +
              (this.accountslist.length + 1)
            : this.usersent.user_name +
              ' ' +
              this.moneys[0].abreviation +
              (this.accountslist.length + 1),
          account_number: this.appserv.getUUID('AC'),
        });
      }
      console.log('moneys', this.moneys);
    }, 100);
  }

  newmemberaccount() {
    this.editionmode = !this.editionmode;
  }

  async onSubmit() {
    if (this.accountForm.valid) {
      console.log(this.accountForm.value);
      const load = await this.appserv.loadctrl.create({
        message: 'Création compte en cours...',
        mode: 'ios',
        translucent: true,
        spinner: 'circular',
      });
      load.present();
      this.memberserv.newaccount(this.accountForm.value).subscribe({
        next: (response) => {
          load.dismiss();
          this.accountslist.unshift(response);
          console.log('new account', response);
          this.appserv.presentToast(
            'Compte enregistré avec suucès!',
            'success'
          );
          this.accountForm.reset();
          this.editionmode = false;
        },
        error: (err) => {
          load.dismiss();
          console.log('error', err);
          this.appserv.presentToast(
            "Echec d'enregistrement du compte!",
            'danger'
          );
        },
      });
    }
  }
  getmemberaccounts() {
    this.showprogress = true;
    this.memberserv.membersaccounts(this.usersent.id).subscribe({
      next: (res) => {
        if (res.message === 'error' && res.error === 'user not sent') {
          this.appserv.presentToast('Utilisateur non identifié.', 'warning');
          return;
        }

        if (res.message === 'error' && res.error === 'unknown user') {
          this.appserv.presentToast(
            "Nous n'arrivons pas à vous identifier.",
            'warning'
          );
          return;
        }

        if (res.message === 'error' && res.error === 'unknown enterprise') {
          this.appserv.presentToast(
            "Désolé, votre entreprise n'est pas identifiée!",
            'warning'
          );
          return;
        }
        this.accountslist = res.data;
        this.showprogress = false;
      },
      error: (err) => {
        this.showprogress = false;
        this.appserv.presentToast(
          'Impossible de récupérer les comptes du membre',
          'danger'
        );
      },
    });
  }

  async detailaccount(account: any) {
    console.log(account);
    const modal = await this.appserv.modalCtrl.create({
      component: DetailmemberaccountComponent,
      componentProps: { account: account, ismodal: true },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
  }
}
