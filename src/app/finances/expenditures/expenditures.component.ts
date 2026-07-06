import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

import { UserpickerComponent } from 'src/app/agents/userpicker/userpicker.component';
import { Users } from 'src/app/interfaces/users';
import { AppservicesService } from 'src/app/services/appservices.service';
import { DatepickerComponent } from 'src/app/reports/datepicker/datepicker.component';
import { Expenditures } from 'src/app/interfaces/expenditures';
import { ExpendituresService } from 'src/app/services/expenditures.service';
import { DetailexpenditureComponent } from './detailexpenditure/detailexpenditure.component';
import { AccountpickerComponent } from 'src/app/accounts/accountpicker/accountpicker.component';
import { Accounts } from 'src/app/interfaces/accounts';
import { NewexpenditureComponent } from './newexpenditure/newexpenditure.component';
import { PrintexpenditureandentryComponent } from '../printexpenditureandentry/printexpenditureandentry.component';

/**
 * Adapte cet import au vrai nom de ton service auth si besoin.
 */
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-expenditures',
  templateUrl: './expenditures.component.html',
  styleUrls: ['./expenditures.component.scss'],
})
export class ExpendituresComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!: IonInput;

  showcheckbox = false;
  showprogress = false;

  keptexpenditures: Expenditures[] = [];
  listselectedexpenditures: Expenditures[] = [];
  listexpenditures: Expenditures[] = [];

  totalgeneral = 0;
  keyword: any = '';

  stats: any = {
    total: 0,
    count_all: 0,
    count_validated: 0,
    count_pending: 0,
    total_validated: 0,
    total_pending: 0,
  };

  pagination: any = {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  };

  filters: any = {
    status: 'all',
    from: null,
    to: null,
    agent_id: null,
    account_id: null,
    per_page: 20,
  };

  constructor(
    public appserv: AppservicesService,
    private expenditureserv: ExpendituresService,
    private authserv: AuthentificationService
  ) {}

  ngOnInit() {
    this.loadExpenditures(1);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.defaultinput) {
        this.defaultinput.setFocus();
      }
    }, 300);
  }

  isValidated(expenditure: any): boolean {
    return (
      expenditure?.is_validate === true ||
      expenditure?.is_validate === 1 ||
      expenditure?.is_validate === '1' ||
      expenditure?.status === 'validated'
    );
  }

  canAdd(): boolean {
    return this.appserv.permissionFilter('depenses', 'add');
  }

  canEdit(): boolean {
    return this.appserv.permissionFilter('depenses', 'edit');
  }

  canDelete(): boolean {
    return this.appserv.permissionFilter('depenses', 'delete');
  }

  canValidate(): boolean {
    return this.canEdit();
  }

  setStatus(status: 'all' | 'validated' | 'pending') {
    this.filters.status = status;
    this.loadExpenditures(1);
  }

  private async requestPin(): Promise<boolean> {
    const pin = await this.authserv.callPinModal();

    if (!pin) {
      this.appserv.presentToast('Pin incorrect ou fenêtre clôturée', 'warning');
      return false;
    }

    return true;
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
        return messages.join('\n');
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

  private buildRequestObject(page: number = 1): any {
    const object: any = {
      user_id: this.appserv.getactualuser().id,
      page,
      per_page: this.filters.per_page || 20,
      status: this.filters.status || 'all',
      keyword: this.keyword || '',
    };

    const enterprise = this.appserv.getactualEse()
      ? this.appserv.getactualEse()
      : null;

    if (enterprise?.id) {
      object.enterprise_id = enterprise.id;
    }

    if (this.filters.from) {
      object.from = this.filters.from;
    }

    if (this.filters.to) {
      object.to = this.filters.to;
    }

    if (this.filters.agent_id) {
      object.agent_id = this.filters.agent_id;
    }

    if (this.filters.account_id) {
      object.account_id = this.filters.account_id;
    }

    return object;
  }

  private resetStats() {
    this.stats = {
      total: 0,
      count_all: 0,
      count_validated: 0,
      count_pending: 0,
      total_validated: 0,
      total_pending: 0,
    };

    this.totalgeneral = 0;
  }

  private computeLocalStats(list: any[]) {
    const stats = {
      total: 0,
      count_all: list.length,
      count_validated: 0,
      count_pending: 0,
      total_validated: 0,
      total_pending: 0,
    };

    list.forEach((expenditure: any) => {
      const amount = Number(expenditure?.amount || 0);

      stats.total += amount;

      if (this.isValidated(expenditure)) {
        stats.count_validated++;
        stats.total_validated += amount;
      } else {
        stats.count_pending++;
        stats.total_pending += amount;
      }
    });

    this.stats = stats;
    this.totalgeneral = stats.total;
  }

  private applyListResponse(res: any) {
    if (Array.isArray(res)) {
      this.listexpenditures = res;
      this.keptexpenditures = res;
      this.computeLocalStats(res);
      return;
    }

    this.listexpenditures = res?.data || [];
    this.keptexpenditures = this.listexpenditures;

    if (res?.stats) {
      this.stats = res.stats;
      this.totalgeneral = Number(this.stats?.total || 0);
    } else {
      this.computeLocalStats(this.listexpenditures);
    }

    if (res?.pagination) {
      this.pagination = res.pagination;
    } else {
      this.pagination = {
        current_page: res?.current_page || 1,
        last_page: res?.last_page || 1,
        per_page: res?.per_page || this.filters.per_page || 20,
        total: res?.total || this.listexpenditures.length,
      };
    }

    this.listselectedexpenditures = [];
  }

  loadExpenditures(page: number = 1) {
    if (!this.appserv.isMyDeviceConnected()) {
      this.listexpenditures = this.expenditureserv.getOfflineData();
      this.keptexpenditures = this.listexpenditures;
      this.computeLocalStats(this.listexpenditures);
      return;
    }

    this.showprogress = true;

    const object = this.buildRequestObject(page);

    this.expenditureserv.expendituresdoneby(object).subscribe(
      (res: any) => {
        this.showprogress = false;
        this.applyListResponse(res);
      },
      (err) => {
        this.showprogress = false;
        this.resetStats();

        this.appserv.presentToast(
          'Impossible de charger la liste des dépenses. ' + this.getApiErrorMessage(err),
          'warning'
        );
      }
    );
  }

  getlist(object: any) {
    this.showprogress = true;

    this.expenditureserv.expendituresdoneby(object).subscribe(
      (res: any) => {
        this.showprogress = false;
        this.applyListResponse(res);
      },
      (err) => {
        this.showprogress = false;

        this.appserv.presentToast(
          'Impossible de charger la liste des dépenses. ' + this.getApiErrorMessage(err),
          'warning'
        );
      }
    );
  }

  totalcalculate() {
    this.computeLocalStats(this.listexpenditures as any[]);
  }

  async menuexpenditure(expenditure: Expenditures) {
    if (this.showcheckbox) {
      this.toggleSelection(expenditure);
      return;
    }

    let menubuttons: any[] = [
      {
        text: 'Fermer',
        role: 'cancel',
      },
      {
        text: 'Infos',
        handler: () => {
          this.detailexpenditure(expenditure);
        },
      },
      {
        text: 'Imprimer',
        handler: () => {
          this.printexpenditure(expenditure);
        },
      },
    ];

    if (!this.isValidated(expenditure)) {
      menubuttons = this.appserv.actionVerificationByPermission(
        menubuttons,
        this.canValidate(),
        {
          text: 'Valider dépense',
          handler: () => {
            this.validateOne(expenditure);
          },
        }
      );

      menubuttons = this.appserv.actionVerificationByPermission(
        menubuttons,
        this.canDelete(),
        {
          text: 'Supprimer dépense',
          handler: () => {
            this.cancelexpenditure(expenditure);
          },
        }
      );
    }

    const menu = await this.appserv.actionsheetctrl.create({
      header: `${(expenditure as any).account_name ? (expenditure as any).account_name : (expenditure as any).uuid}`,
      cssClass: 'myactionsheet',
      translucent: true,
      mode: 'ios',
      buttons: menubuttons,
    });

    await menu.present();
  }

  toggleSelection(expenditure: Expenditures, event?: any) {
    if (event) {
      event.stopPropagation();
    }

    const index = this.listselectedexpenditures.findIndex(
      (x: any) => x.id === (expenditure as any).id
    );

    if (index >= 0) {
      this.listselectedexpenditures.splice(index, 1);
    } else {
      this.listselectedexpenditures.push(expenditure);
    }
  }

  isSelected(expenditure: Expenditures): boolean {
    return this.listselectedexpenditures.some(
      (x: any) => x.id === (expenditure as any).id
    );
  }

  async validateOne(expenditure: Expenditures, event?: any) {
    if (event) {
      event.stopPropagation();
    }

    if (!this.canValidate()) {
      this.appserv.presentToast(
        "Vous n'avez pas la permission de valider les dépenses.",
        'warning'
      );
      return;
    }

    if (this.isValidated(expenditure)) {
      this.appserv.presentToast('Cette dépense est déjà validée.', 'warning');
      return;
    }

    const alert = await this.appserv.alertctrl.create({
      header: 'Valider dépense',
      message: `Voulez-vous valider cette dépense de ${(expenditure as any).amount} ${(expenditure as any).abreviation || ''} ?`,
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Oui',
          handler: async () => {
            const pinOk = await this.requestPin();

            if (!pinOk) {
              return;
            }

            this.validateIds([(expenditure as any).id]);
          },
        },
      ],
    });

    await alert.present();
  }

  validateSelected() {
    if (!this.canValidate()) {
      this.appserv.presentToast(
        "Vous n'avez pas la permission de valider les dépenses.",
        'warning'
      );
      return;
    }

    const ids = this.listselectedexpenditures
      .filter((x: any) => !this.isValidated(x))
      .map((x: any) => x.id);

    if (ids.length === 0) {
      this.appserv.presentToast('Aucune dépense non validée sélectionnée.', 'warning');
      return;
    }

    this.validateSelectedWithPin(ids);
  }

  private async validateSelectedWithPin(ids: number[]) {
    const pinOk = await this.requestPin();

    if (!pinOk) {
      return;
    }

    this.validateIds(ids);
  }

  validateIds(ids: number[]) {
    this.showprogress = true;

    const payload = {
      ids,
      validated_by: this.appserv.getactualuser().id,
    };

    this.expenditureserv.validateSelected(payload).subscribe(
      (res: any) => {
        this.showprogress = false;
        this.showcheckbox = false;
        this.listselectedexpenditures = [];

        this.appserv.presentToast(
          res?.message || 'Dépense(s) validée(s).',
          'success'
        );

        this.loadExpenditures(this.pagination.current_page || 1);
      },
      (err) => {
        this.showprogress = false;

        this.appserv.presentToast(
          'Erreur lors de la validation. ' + this.getApiErrorMessage(err),
          'danger'
        );
      }
    );
  }

  async validateAllPending() {
    if (!this.canValidate()) {
      this.appserv.presentToast(
        "Vous n'avez pas la permission de valider les dépenses.",
        'warning'
      );
      return;
    }

    const alert = await this.appserv.alertctrl.create({
      header: 'Valider toutes les dépenses',
      message: 'Voulez-vous valider toutes les dépenses non validées selon les filtres actuels ?',
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Oui',
          handler: async () => {
            const pinOk = await this.requestPin();

            if (!pinOk) {
              return;
            }

            this.confirmValidateAllPending();
          },
        },
      ],
    });

    await alert.present();
  }

  confirmValidateAllPending() {
    this.showprogress = true;

    const payload = this.buildRequestObject(1);

    this.expenditureserv.validateAllPending(payload).subscribe(
      (res: any) => {
        this.showprogress = false;
        this.showcheckbox = false;
        this.listselectedexpenditures = [];

        this.appserv.presentToast(
          res?.message || 'Dépenses validées.',
          'success'
        );

        this.loadExpenditures(1);
      },
      (err) => {
        this.showprogress = false;

        this.appserv.presentToast(
          'Erreur lors de la validation globale. ' + this.getApiErrorMessage(err),
          'danger'
        );
      }
    );
  }

  async cancelexpenditure(expenditure: Expenditures) {
    if (!this.canDelete()) {
      this.appserv.presentToast(
        "Vous n'avez pas la permission de supprimer les dépenses.",
        'warning'
      );
      return;
    }

    if (this.isValidated(expenditure)) {
      this.appserv.presentToast(
        'Impossible de supprimer une dépense déjà validée.',
        'warning'
      );
      return;
    }

    const alert = await this.appserv.alertctrl.create({
      header: 'Supprimer dépense',
      subHeader: (expenditure as any).amount + ' ' + ((expenditure as any).abreviation || ''),
      mode: 'ios',
      message: 'Voulez-vous vraiment supprimer cette dépense non validée ?',
      translucent: true,
      buttons: [
        {
          text: 'Non',
          cssClass: 'cancel-button',
          role: 'cancel',
        },
        {
          text: 'Oui',
          cssClass: 'yes-button',
          handler: async () => {
            const pinOk = await this.requestPin();

            if (!pinOk) {
              return;
            }

            this.deleteExpenditure(expenditure);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteExpenditure(expenditure: Expenditures) {
    if (this.isValidated(expenditure)) {
      this.appserv.presentToast(
        'Impossible de supprimer une dépense déjà validée.',
        'warning'
      );
      return;
    }

    this.showprogress = true;

    this.expenditureserv.delete(expenditure).subscribe(
      () => {
        this.showprogress = false;

        this.appserv.presentToast(
          'Opération supprimée avec succès.',
          'success'
        );

        this.loadExpenditures(this.pagination.current_page || 1);
      },
      (err) => {
        this.showprogress = false;

        this.appserv.presentToast(
          'Impossible de supprimer cette opération. ' + this.getApiErrorMessage(err),
          'warning'
        );
      }
    );
  }

  async multipledelete() {
    if (!this.canDelete()) {
      this.appserv.presentToast(
        "Vous n'avez pas la permission de supprimer les dépenses.",
        'warning'
      );
      return;
    }

    const deletable = this.listselectedexpenditures.filter(
      (x: any) => !this.isValidated(x)
    );

    if (deletable.length === 0) {
      this.appserv.presentToast(
        'Aucune dépense non validée sélectionnée.',
        'warning'
      );
      return;
    }

    const alert = await this.appserv.alertctrl.create({
      header: 'Supprimer les dépenses',
      message: `Voulez-vous supprimer ${deletable.length} dépense(s) non validée(s) ? Les dépenses déjà validées seront ignorées.`,
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Oui',
          handler: async () => {
            const pinOk = await this.requestPin();

            if (!pinOk) {
              return;
            }

            this.showprogress = true;

            try {
              for (const expenditure of deletable) {
                await this.expenditureserv.delete(expenditure).toPromise();
              }

              this.showprogress = false;
              this.appserv.presentToast(
                'Dépenses non validées supprimées avec succès.',
                'success'
              );

              this.showcheckbox = false;
              this.listselectedexpenditures = [];

              this.loadExpenditures(this.pagination.current_page || 1);
            } catch (e) {
              this.showprogress = false;

              this.appserv.presentToast(
                'Impossible de supprimer certaines dépenses.',
                'warning'
              );
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async printexpenditure(expenditure: Expenditures) {
    const modal = await this.appserv.modalCtrl.create({
      component: PrintexpenditureandentryComponent,
      componentProps: {
        typesent: 'withdraw',
        expendituresent: expenditure,
      },
      cssClass: 'modal-border-radius-20',
    });

    await modal.present();
  }

  async share(expenditure: Expenditures) {}

  async detailexpenditure(expenditure: Expenditures) {
    const modal = await this.appserv.modalCtrl.create({
      component: DetailexpenditureComponent,
      componentProps: {
        expendituresent: expenditure,
        typesent: 'withdraw',
      },
      cssClass: 'modal-border-radius-20',
    });

    await modal.present();
  }

  filterbytype(criteria: string) {
    this.listexpenditures = this.keptexpenditures.filter(
      (e: any) => e.type === criteria
    );

    this.computeLocalStats(this.listexpenditures as any[]);
  }

  deletefilter() {
    this.filters = {
      status: 'all',
      from: null,
      to: null,
      agent_id: null,
      account_id: null,
      per_page: 20,
    };

    this.keyword = '';
    this.showcheckbox = false;
    this.listselectedexpenditures = [];

    this.loadExpenditures(1);
  }

  filterbyuser(user: Users) {
    this.filters.agent_id = user.id;
    this.loadExpenditures(1);
  }

  async userpicker() {
    const modal = await this.appserv.modalCtrl.create({
      component: UserpickerComponent,
      cssClass: 'modal-border-radius-20',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'selected') {
      this.filterbyuser(data);
    }
  }

  async newexpenditure() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewexpenditureComponent,
      cssClass: 'modal-border-radius-20',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'added') {
      this.loadExpenditures(1);

      const alert = await this.appserv.alertctrl.create({
        header: 'Impression',
        message: 'Voulez-vous imprimer un bon de sortie ?',
        mode: 'ios',
        translucent: true,
        buttons: [
          {
            text: 'Non',
            role: 'cancel',
          },
          {
            text: 'Oui',
            handler: () => {
              this.printexpenditure(data);
            },
          },
        ],
      });

      await alert.present();
    }
  }

  async accountpicker() {
    const modal = await this.appserv.modalCtrl.create({
      component: AccountpickerComponent,
      cssClass: 'modal-border-radius-20',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'selected') {
      this.filterbyaccount(data);
    }
  }

  filterbyaccount(account: Accounts) {
    this.filters.account_id = account.id;
    this.loadExpenditures(1);
  }

  anonyaccount() {
    this.filters.account_id = 'null';
    this.loadExpenditures(1);
  }

  async periodfilter() {
    const modal = await this.appserv.modalCtrl.create({
      component: DatepickerComponent,
      cssClass: 'modal-border-radius-20',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'selected') {
      this.filters.from = data.from;
      this.filters.to = data.to;
      this.loadExpenditures(1);
    }
  }

  onKeywordChange() {
    this.loadExpenditures(1);
  }

  onStatusChange() {
    this.loadExpenditures(1);
  }

  nextPage() {
    if (this.pagination.current_page < this.pagination.last_page) {
      this.loadExpenditures(this.pagination.current_page + 1);
    }
  }

  previousPage() {
    if (this.pagination.current_page > 1) {
      this.loadExpenditures(this.pagination.current_page - 1);
    }
  }
}