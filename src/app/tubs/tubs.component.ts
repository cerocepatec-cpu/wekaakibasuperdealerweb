/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  IonInput,
  ModalController,
} from '@ionic/angular';
import { Money } from '../interfaces/money';
import { Tubs } from '../interfaces/tubs';
import { Users } from '../interfaces/users';
import { TubdetailsComponent } from '../tubdetails/tubdetails.component';
import { TipquantityComponent } from '../tab2/tipquantity/tipquantity.component';
import { AppservicesService } from '../services/appservices.service';
import { UsersService } from '../services/users.service';
import { MoneyService } from '../services/money.service';
import { Mouvement } from '../interfaces/mouvement';
import { FundService } from '../services/funds.service';
import { Accounts } from '../interfaces/accounts';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-tubs',
  templateUrl: './tubs.component.html',
  styleUrls: ['./tubs.component.scss'],
})
export class TubsComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!: IonInput;
  searchtub: any;
  accounts: Accounts[] = [];
  listtubs: Tubs[] = [];
  agentlisttubs: Tubs[] = [];
  listtubselected: Tubs[] = [];
  listmoney: Money[] = [];
  listagents: Users[] = [];
  listoperations: Mouvement[] = [];
  operationstosend: Mouvement[] = [];
  showprogress = false;
  showsaveprogress = false;
  newtub = this.form.group({
    description: ['', Validators.required],
    user_id: [0, Validators.required],
    sold: [0, Validators.required],
    money_id: [0, Validators.required],
    enterprise_id: [],
    principal: [],
    created_by: [],
    type: ['internal', Validators.required],
  });
  load: boolean = false;
  cansave = false;
  constructor(
    private route: Router,
    private form: FormBuilder,
    private alertCtrl: AlertController,
    private accountserv: AccountService,
    private fundserv: FundService,
    private moneyserv: MoneyService,
    public appserv: AppservicesService,
    private actionsheet: ActionSheetController,
    private modalctrl: ModalController,
    private userserv: UsersService
  ) {}

  ngOnInit() {
    const olduser = this.appserv.getactualuser();

    if (olduser) {
      setTimeout(() => {
        this.getlistTubs();
        this.getlistAgents();
        this.getlistMoney();
        this.getdailyoperations();
        //this.getlistAccounts();
      }, 100);
    } else {
      this.route.navigateByUrl('/login');
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.defaultinput.setFocus();
    }, 200);
  }

  fundhandlechange($event) {
    const idfund = $event.detail.value;
    const actualfund = this.listtubs.filter((f) => f.id === idfund)[0];
    if (actualfund) {
      if (actualfund.user_id !== this.appserv.actualUser.id) {
        this.appserv.presentToast(
          "Vous n'avez pas l'autorisation d'effectuer les operations sur cette caisse",
          'warning'
        );
        $event.detail.value = null;
      }
    }
  }

  resetfundsfilter() {
    this.listtubselected.forEach((el) => {
      el.selected = false;
    });

    this.listtubselected = [];
    this.getdailyoperations();
  }

  filterCashiers() {
    this.listagents = this.listagents.filter((a) => a.user_type === 'cashier');
  }

  async refreshingdata($event) {
    setTimeout(() => {
      this.ngOnInit();
      $event.target.complete();
    }, 2000);
  }

  async filterbyfunds() {
    let fundsids = [];
    this.listtubselected.forEach((element) => {
      fundsids.push(element.id);
    });
    this.showprogress = true;
    this.fundserv
      .getdailyoperations({
        user_id: this.appserv.actualUser.id,
        funds: fundsids,
      })
      .subscribe(
        (response) => {
          this.showprogress = false;
          if (response.status === 200 && response.message === 'success') {
            this.listoperations = response.data;
          }
        },
        (error) => {
          console.log(error);
          this.showprogress = false;
          this.appserv.presentToast(
            'Erreur survenue lors de la recupération du livre des caisses.',
            'danger'
          );
        }
      );
  }

  selectitem(fund: Tubs) {
    fund.selected === true ? (fund.selected = false) : (fund.selected = true);
    const ifexists = this.listtubselected.indexOf(fund);
    if (ifexists === -1) {
      this.listtubselected.push(fund);
    } else {
      this.listtubselected = this.listtubselected.filter((f) => f !== fund);
    }
  }

  additem() {
    let item: Mouvement = {};
    item.done_at = this.appserv.defaultdate();
    item.type = this.appserv.permissionFilter('Caisses', 'entry')
      ? 'entry'
      : this.appserv.permissionFilter('Caisses', 'withdraw')
      ? 'withdraw'
      : '';
    item.fund_id = this.agentlisttubs[0].id;
    this.operationstosend.unshift(item);
  }

  async removeallitems() {
    const alert = await this.appserv.alertctrl.create({
      header: 'Annulation opérations',
      subHeader: `${this.operationstosend.length} ligne${
        this.operationstosend.length > 1 ? 's' : ''
      }`,
      mode: 'ios',
      translucent: true,
      message: 'Confirmez-vous cette annulation?',
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui',
          handler: () => {
            this.operationstosend = [];
          },
        },
      ],
    });
    alert.present();
  }
  removeitem(newline: Mouvement) {
    this.operationstosend = this.operationstosend.filter(
      (op) => op !== newline
    );
  }

  async saveoperations() {
    this.operationstosend.forEach((element) => {
      element.user_id = this.appserv.getactualuser().id;
      element.enterprise_id = this.appserv.getactualEse().id;
      element.nature = 'other';
      if (!element.fund_id) {
        element.fund_mistaken = true;
        this.cansave = false;
      } else {
        this.cansave = true;
        element.fund_mistaken = false;
      }

      if (!element.type) {
        element.type_mistaken = true;
        this.cansave = false;
      } else {
        element.type_mistaken = false;
        this.cansave = true;
      }

      if (!element.motif) {
        element.motif_mistaken = true;
        this.cansave = false;
      } else {
        element.motif_mistaken = false;
        this.cansave = true;
      }

      if (!element.amount) {
        element.amount_mistaken = true;
        this.cansave = false;
      } else {
        element.amount_mistaken = false;
        this.cansave = true;
      }
    });

    if (this.cansave) {
      const alert = await this.appserv.alertctrl.create({
        header: 'Confirmation',
        message: `Confirmez-vous l'enregistrement de ${
          this.operationstosend.length
        } opération${this.operationstosend.length > 1 ? 's' : ''}?`,
        mode: 'ios',
        translucent: true,
        buttons: [
          { text: 'Non', role: 'cancel' },
          {
            text: 'Oui',
            handler: () => {
              this.sentoperationstoserver();
            },
          },
        ],
      });
      alert.present();
    }
  }

  async sentoperationstoserver() {
    console.log('operations to send', this.operationstosend);
    const load = await this.appserv.loadctrl.create({
      message: 'Enregistrement en cours...',
      mode: 'ios',
      spinner: 'dots',
      translucent: true,
    });
    load.present();

    this.fundserv.savemultiples({ data: this.operationstosend }).subscribe(
      (response) => {
        console.log('response from multiple save', response);
        load.dismiss();
        if (response.status === 200 && response.message === 'success') {
          this.listoperations = this.listoperations.concat(response.data);
          //update accounts
          response.data.forEach((element) => {
            //looking for all funds
            let actualtub = this.listtubs.filter(
              (t) => t.id === element.fund_id
            )[0];
            if (element.type === 'entry') {
              actualtub.sold = actualtub.sold + element.amount;
            } else {
              actualtub.sold = actualtub.sold - element.amount;
            }
          });

          this.operationstosend = [];
          this.cansave = false;
        } else {
          this.appserv.presentToast(
            "Erreur survenue lors d'enregistrement des opérations. Veuillez réssayer ou vérifier votre connexion svp!",
            'danger'
          );
        }
        // console.log('operations from api',response);
      },
      (error) => {
        load.dismiss();
        console.log('Error from api', error);
        this.appserv.presentToast(
          "Erreur survenue lors d'enregistrement des opérations. Veuillez réssayer ou vérifier votre connexion svp!",
          'danger'
        );
      }
    );
  }

  getlistAgents() {
    if (!this.appserv.getactualEse()?.id) {
      this.appserv.presentToast("Entreprise introuvable...","warning");
      return;
    }

    this.userserv.affectedusers().subscribe({
      next: (data) => {
        console.log('affected users', data);
        this.listagents = data.filter((u) => u.id !== this.appserv.getactualuser().id);
      },
      error: (err) => {
        console.log(err);
        this.appserv.presentToast(
          'Erreur survenue lors de la recupération de la liste des agents. Veuillez réssayer ou vérifier votre connexion svp!',
          'danger'
        );
      },
    });
  }

  getlistAccounts() {
    this.accountserv.getall(this.appserv.getactualEse().id).subscribe(
      (data) => {
        this.accounts = data;
      },
      (error) => {
        console.log(error);
        this.appserv.presentToast(
          'Erreur survenue lors de la recupération des comptes.',
          'danger'
        );
      }
    );
  }

  getdailyoperations() {
    this.fundserv
      .getdailyoperations({ user_id: this.appserv.actualUser.id })
      .subscribe(
        (response) => {
          console.log('request histories', response);
          if (response.status === 200 && response.message === 'success') {
            if (response.data.length > 0) {
              this.listoperations = response.data;
            }
          }
        },
        (error) => {
          console.log(error);
          this.appserv.presentToast(
            'Erreur survenue lors de la recupération du livre des caisses.',
            'danger'
          );
        }
      );
  }

  getlistMoney() {
    this.moneyserv.getlistmonnaiesapi(this.appserv.actualEse.id).subscribe(
      (data) => {
        this.listmoney = data;
      },
      (error) => {
        this.appserv.presentToast(
          'Erreur survenue lors de la recupération de la liste des monnaies.',
          'danger'
        );
      }
    );
  }

  getlistMouvements() {
    this.moneyserv.getlistmonnaiesapi(this.appserv.actualEse.id).subscribe(
      (data) => {
        this.listmoney = data;
      },
      (error) => {
        this.appserv.presentToast(
          'Erreur survenue lors de la recupération de la liste des monnaies.',
          'danger'
        );
      }
    );
  }

  getlistTubs() {
    this.load = true;
    this.appserv.myTubs(this.appserv.actualUser.id).subscribe(
      (data) => {
        this.load = false;
        this.listtubs = data;
        this.agentlisttubs = this.listtubs.filter(
          (f) => f.user_id === this.appserv.actualUser.id
        );
      },
      (error) => {
        this.load = false;
        this.appserv.presentToast(
          'Erreur survenue lors de la recupération de la liste des caisses.',
          'danger'
        );
      }
    );
  }

  async opentubdetails(tub: Tubs) {
    const modal = this.modalctrl.create({
      component: TubdetailsComponent,
      componentProps: { tubsent: tub, listsent: this.listtubs },
      cssClass: 'modal-border-radius-20',
      mode: 'ios',
    });
    (await modal).present();
    const { data, role } = await (await modal).onWillDismiss();
    if (role === 'deleted') {
      this.listtubs = this.listtubs.filter((t) => t !== tub);
    } else if (role === 'edited') {
      tub = data;
    } else {
    }
  }

  async menutub(tub: Tubs) {
    const actionButtons = [];
    actionButtons.push({ text: 'Annuler', role: 'cancel' });
    actionButtons.push({
      text: 'Détails',
      handler: async () => {},
    });
    if (this.appserv.actualUser.user_type === 'super_admin') {
      actionButtons.push({
        text:
          tub.principal === 1 ? 'Pas comme principale' : 'Caisse principale?',
        handler: () => {
          if (tub.principal === 1) {
            this.makeprincipalmoney(tub, false);
          } else {
            this.makeprincipalmoney(tub, true);
          }
        },
      });
      actionButtons.push({
        text: 'Supprimer',
        handler: () => {
          this.deletetub(tub);
        },
      });
    }

    // actionButtons.push( {
    //   text:"Balance d'ouverture",
    //   handler:()=>{this.restetub(tub);}
    // });

    const menu = await this.actionsheet.create({
      header: `${tub.description} en ${
        tub.money_abreviation ? tub.money_abreviation : ''
      }`,
      translucent: true,
      mode: 'ios',
      buttons: actionButtons,
    });
    (await menu).present();
  }

  async makeprincipalmoney(tubsent: Tubs, criteria: boolean) {
    this.showprogress = true;
    if (criteria) {
      tubsent.principal = true;
    } else {
      tubsent.principal = false;
    }
    this.appserv.editTubapi(tubsent).subscribe(
      (data) => {
        this.showprogress = false;
        tubsent.created_at = data.created_at;
        tubsent.description = data.description;
        tubsent.money_abreviation = data.money_abreviation;
        tubsent.money_id = data.money_id;
        tubsent.mouvements = data.mouvements;
        tubsent.sold = data.sold;
        tubsent.user_id = data.user_id;
        tubsent.user_name = data.user_name;
        tubsent.principal = data.principal;
        this.appserv.presentToast('Caisse modifiée avec succès', 'success');
      },
      (error) => {
        if (criteria) {
          tubsent.principal = false;
        } else {
          tubsent.principal = true;
        }
        this.showprogress = false;
        this.appserv.presentToast(
          `Impossible de modifier la caisse. Veuillez vérifier la connexion`,
          'danger'
        );
      }
    );
  }

  async restetub(tub: Tubs) {
    const modal = await this.appserv.modalCtrl.create({
      component: TipquantityComponent,
      componentProps: {
        title: 'Enter an opening balance',
        zero_accepted: true,
      },
      initialBreakpoint: 0.75,
      breakpoints: [0.25, 0.5, 0.75, 1],
      cssClass: 'modal-500-width modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'edited') {
      this.showprogress = true;
      const object = {
        user_id: this.appserv.actualUser.id,
        fund_id: tub.id,
        amount: data,
      };
      this.appserv.resetTub(object).subscribe(
        (datareturn) => {
          this.showprogress = false;
          tub.sold = datareturn.tub.sold;
          this.appserv.presentToast(
            `Caisse ${tub.description} modifiée avec succès`,
            'success'
          );
        },
        (error) => {
          this.showprogress = false;
          this.appserv.presentToast('Modification échouée', `danger`);
        }
      );
    }
  }

  async deletetub(tub: Tubs) {
    const alertc = this.alertCtrl.create({
      header: 'Suppression caisse',
      subHeader: `${tub.description}`,
      mode: 'ios',
      message: `Confirmez-vous la suppréssion de cette caisse et toutes 
      ses informations? Noter que toutes les opérations liées à cette caisse vont disparaître. 
      En l'occurence les entrées et sorties.`,
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Oui',
          handler: () => {
            this.appserv.deleteTubapi(tub.id).subscribe(
              (data) => {
                this.listtubs = this.listtubs.filter((t) => t !== tub);
                this.appserv.presentToast(
                  `Caisse ${tub.description} supprimée avec succès.`,
                  'success'
                );
              },
              (error) => {
                this.appserv.presentToast(
                  `Error survenue lors de la suppression de la Caisse ${tub.description}`,
                  'danger'
                );
              }
            );
          },
        },
      ],
    });

    (await alertc).present();
  }

  async savenewtub() {
    if (this.newtub.get('description').value) {
      if (this.newtub.get('money_id').value) {
        if (this.newtub.get('user_id').value) {
          this.showprogress = true;
          this.newtub.patchValue({
            created_by: this.appserv.actualUser.id,
            enterprise_id: this.appserv.actualUser.enterprise_id,
          });
          this.appserv.newtubapi(this.newtub.value).subscribe(
            (response) => {
              console.log('new tub from api', response);
              this.showprogress = false;
              if (response.message === 'success') {
                this.appserv.presentToast(
                  'Caisse ajoutée avec succès',
                  'success'
                );
                if (response.data.principal) {
                  this.listtubs.forEach((element) => {
                    element.principal = 0;
                  });
                }

                if (response.data.user_id === this.appserv.actualUser.id) {
                  this.agentlisttubs.push(response.data);
                }
                this.listtubs.unshift(response.data);
                this.newtub.reset();
              } else if (response.message === 'automatic fund duplicated') {
                this.appserv.presentToast(
                  'Une caisse automatique avec la même monnaie existe déjà. Veuillez en choisir une autre.',
                  'warning'
                );
              } else if (response.message === 'duplicated') {
                this.appserv.presentToast(
                  'Une caisse avec cette description existe déjà. Veuillez en choisir une autre.',
                  'warning'
                );
              } else {
                this.appserv.presentToast(
                  `Erreur survenue lors de l'enregistrement de la nouvelle caisse`,
                  'warning'
                );
              }
            },
            (error) => {
              this.showprogress = false;
              this.appserv.presentToast(
                `Erreur survenue lors de l'enregistrement de la nouvelle caisse`,
                'warning'
              );
            }
          );
        } else {
          this.appserv.presentToast(
            `Vous devez sélectionner un caissier.ère`,
            'warning'
          );
        }
      } else {
        this.appserv.presentToast(`Vous devez choisir une monnaie`, 'warning');
      }
    } else {
      this.appserv.presentToast(`Vous devez entrer une description`, 'warning');
    }
  }
}
