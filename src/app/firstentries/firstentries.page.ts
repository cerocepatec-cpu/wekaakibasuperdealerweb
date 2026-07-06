interface MoneyTotal {
  money: string;
  total: number;
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { AppservicesService } from '../services/appservices.service';
import { MemberfirstentriesService } from '../services/memberfirstentries.service';
import { MoneyService } from '../services/money.service';
import { NoSponsorDetailsComponent } from '../no-sponsor-details/no-sponsor-details.component';

@Component({
  selector: 'app-firstentries',
  templateUrl: './firstentries.page.html',
  styleUrls: ['./firstentries.page.scss'],
})
export class FirstentriesPage implements OnInit {
  @ViewChild('defaultinput') defaultinput!: IonInput;

  showprogress = false;

  activeTab: 'reserve' | 'history' | 'commissions' = 'reserve';
  // commissionTab: 'sponsor' | 'collector' | 'no_sponsor' = 'sponsor';
  commissionTab: 'sponsor' | 'collector' | 'no_sponsor' | 'payment_history' =
    'sponsor';
  commissionStatus: 'pending' | 'paid' | 'all' = 'pending';

  from = this.appserv.defaultdate();
  to = this.appserv.defaultdate();

  commissionMonth = this.getMonthKeyFromDate(this.appserv.defaultdate());
  paidMonth = '';
  reservationTree: any[] = [];
  expandedYears: any = {};
  expandedMonths: any = {};
  expandedDates: any = {};
  search = '';
  historysearch = '';
  commissionSearch = '';
  paymentHistorySearch = '';

  moneysList: any[] = [];
  selectedMoneyId: any = '';

  eligibleGroups: any[] = [];
  eligibleAccountsList: any[] = [];
  selectedAccounts: any[] = [];
  selectedTotalsByMoney: any[] = [];

  firstentrieslist: any[] = [];

  commissionsList: any[] = [];
  sponsorCommissions: any[] = [];
  collectorCommissions: any[] = [];
  noSponsorCommissions: any[] = [];

  commissionSummary: any = null;
  groupedByCommissionMonth: any[] = [];
  groupedByPaidMonth: any[] = [];

  paymentHistoryList: any[] = [];
  paymentHistoryGroups: any[] = [];
  paymentGroupedByCommissionMonth: any[] = [];
  paymentGroupedByPaidMonth: any[] = [];
  paymentSummary: any = null;

  eligibleUserGroups: any[] = [];
  historyUserGroups: any[] = [];
  commissionUserGroups: any[] = [];

  filters: any = {
    nature: '',
    money_id: '',
    only_without_retention: true,
    include_blocked: false,
    member_search: '',
    per_page: 100,
  };

  reservation: any = {
    description: 'Première mise réservée virtuellement',
  };

  stats = {
    selectedCount: 0,
    selectedTotal: 0,
    collectorFund: 0,
    generalFund: 0,
  };
  historyTree: any[] = [];
  expandedHistoryYears: any = {};
  expandedHistoryMonths: any = {};
  expandedHistoryDates: any = {};
  commissionTree: any[] = [];
  paymentHistoryTree: any[] = [];

  expandedCommissionYears: any = {};
  expandedCommissionMonths: any = {};
  expandedCommissionDates: any = {};

  expandedPaymentYears: any = {};
  expandedPaymentMonths: any = {};
  expandedPaymentDates: any = {};

  private commissionUsersCache: any = {};
  private paymentUsersCache: any = {};

  constructor(
    public appserv: AppservicesService,
    private firstentriesServ: MemberfirstentriesService,
    private moneyServ: MoneyService
  ) {}

  ngOnInit() {
    this.loadMoneys();
    this.loadEligibleAccounts();
    this.firstentrieshistories();
    this.loadCommissions();
    this.loadPaymentHistory();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.defaultinput?.setFocus();
    }, 300);
  }

  async loadMoneys() {
    this.moneysList = await this.moneyServ.getesemoneys();

    if (!Array.isArray(this.moneysList)) {
      this.moneysList = [];
    }
  }
  getMonthNameFr(monthKey: string): string {
    if (!monthKey) return '-';

    const months: any = {
      '01': 'Janvier',
      '02': 'Février',
      '03': 'Mars',
      '04': 'Avril',
      '05': 'Mai',
      '06': 'Juin',
      '07': 'Juillet',
      '08': 'Août',
      '09': 'Septembre',
      '10': 'Octobre',
      '11': 'Novembre',
      '12': 'Décembre',
    };

    const month = String(monthKey).slice(5, 7);
    return months[month] || monthKey;
  }

  getMonthKeyFromDate(date: string): string {
    if (!date) return '';
    return String(date).slice(0, 7);
  }

  segmentChanged(ev: any) {
    this.activeTab = ev.detail.value;

    if (this.activeTab === 'reserve') {
      this.loadEligibleAccounts();
    }

    if (this.activeTab === 'history') {
      this.firstentrieshistories();
    }

    if (this.activeTab === 'commissions') {
      this.loadCommissions();
      this.loadPaymentHistory();
    }
  }

  setCommissionTab(tab: any) {
    this.commissionTab = tab;

    if (tab === 'payment_history') {
      this.loadPaymentHistory();
    } else {
      this.loadCommissions();
    }
  }
  buildCommissionTree(list: any[]) {
    this.commissionTree = this.buildGenericCommissionTree(list, false);
  }

  buildPaymentHistoryTree(list: any[]) {
    this.paymentHistoryTree = this.buildGenericCommissionTree(list, true);
  }

  buildGenericCommissionTree(list: any[], usePaidDate = false): any[] {
    const grouped: any = {};

    (list || []).forEach((line: any) => {
      const rawDate = usePaidDate
        ? line.paid_at ||
          line.updated_at ||
          line.created_at ||
          this.appserv.defaultdate()
        : line.created_at ||
          line.commission_month ||
          line.first_transaction_month ||
          this.appserv.defaultdate();

      let date = String(rawDate).slice(0, 10);

      if (date.length === 7) {
        date = `${date}-01`;
      }

      const year = date.slice(0, 4);
      const month = date.slice(0, 7);
      const amount = Number(line.amount || 0);

      if (!grouped[year]) {
        grouped[year] = {
          year,
          count: 0,
          total: 0,
          months: {},
        };
      }

      if (!grouped[year].months[month]) {
        grouped[year].months[month] = {
          month,
          label: this.getMonthNameFr(month),
          count: 0,
          total: 0,
          dates: {},
        };
      }

      if (!grouped[year].months[month].dates[date]) {
        grouped[year].months[month].dates[date] = {
          date,
          count: 0,
          total: 0,
          lines: [],
        };
      }

      grouped[year].count += 1;
      grouped[year].total += amount;

      grouped[year].months[month].count += 1;
      grouped[year].months[month].total += amount;

      grouped[year].months[month].dates[date].count += 1;
      grouped[year].months[month].dates[date].total += amount;
      grouped[year].months[month].dates[date].lines.push(line);
    });

    return Object.values(grouped).map((year: any) => ({
      ...year,
      months: Object.values(year.months).map((month: any) => ({
        ...month,
        dates: Object.values(month.dates).map((day: any) => ({
          ...day,
          users: this.groupCommissionsByUser(day.lines || []),
        })),
      })),
    }));
  }

  toggleCommissionYear(year: any) {
    this.expandedCommissionYears[year.year] =
      !this.expandedCommissionYears[year.year];
  }

  toggleCommissionMonth(month: any) {
    this.expandedCommissionMonths[month.month] =
      !this.expandedCommissionMonths[month.month];
  }

  toggleCommissionDate(day: any) {
    this.expandedCommissionDates[day.date] =
      !this.expandedCommissionDates[day.date];
  }

  togglePaymentYear(year: any) {
    this.expandedPaymentYears[year.year] =
      !this.expandedPaymentYears[year.year];
  }

  togglePaymentMonth(month: any) {
    this.expandedPaymentMonths[month.month] =
      !this.expandedPaymentMonths[month.month];
  }

  togglePaymentDate(day: any) {
    this.expandedPaymentDates[day.date] = !this.expandedPaymentDates[day.date];
  }
  setCommissionStatus(status: any) {
    this.commissionStatus = status;
    this.loadCommissions();
    this.loadPaymentHistory();
  }

  onCommissionFilterChange() {
    this.loadCommissions();
    this.loadPaymentHistory();
  }

  onMoneyFilterChange() {
    this.filters.money_id = this.selectedMoneyId || '';
    this.clearSelection();

    if (this.activeTab === 'reserve') {
      this.loadEligibleAccounts();
    }

    if (this.activeTab === 'history') {
      this.firstentrieshistories();
    }

    if (this.activeTab === 'commissions') {
      this.loadCommissions();
      this.loadPaymentHistory();
    }
  }

  async dashboardperiodfilter() {
    const modal = await this.appserv.periodicfilter();
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'selected') {
      this.from = data.from;
      this.to = data.to;
      this.commissionMonth = this.getMonthKeyFromDate(this.from);

      this.loadEligibleAccounts();

      setTimeout(() => {
        this.firstentrieshistories();
      }, 100);

      setTimeout(() => {
        this.loadCommissions();
        this.loadPaymentHistory();
      }, 200);
    }
  }

  groupAccountsByUser(accounts: any[]) {
    const grouped: any = {};

    (accounts || []).forEach((account: any) => {
      const key = account.user_id || account.member_id || account.id;

      if (!grouped[key]) {
        grouped[key] = {
          user_id: account.user_id || account.member_id,
          fullname:
            account.member_fullname ||
            account.member_user_name ||
            account.description ||
            'Utilisateur',
          phone: account.member_phone || account.user_phone || '',
          total_amount: 0,
          total_sold: 0,
          accounts_count: 0,
          moneys: {},
          accounts: [],
        };
      }

      const money = account.abreviation || account.money_abreviation || 'N/A';
      const amount = Number(account.amount || 0);
      const sold = Number(account.sold || 0);

      grouped[key].total_amount += amount;
      grouped[key].total_sold += sold;
      grouped[key].accounts_count += 1;
      grouped[key].accounts.push(account);

      if (!grouped[key].moneys[money]) {
        grouped[key].moneys[money] = {
          money,
          total_amount: 0,
          total_sold: 0,
          count: 0,
        };
      }

      grouped[key].moneys[money].total_amount += amount;
      grouped[key].moneys[money].total_sold += sold;
      grouped[key].moneys[money].count += 1;
    });

    return Object.values(grouped).map((g: any) => ({
      ...g,
      moneys: Object.values(g.moneys),
    }));
  }

  groupHistoryByUser(list: any[]) {
    const grouped: any = {};

    (list || []).forEach((entry: any) => {
      const key = entry.member_id || entry.user_id || entry.account_id;

      if (!grouped[key]) {
        grouped[key] = {
          member_id: entry.member_id,
          fullname: entry.member_fullname || entry.member_user_name || 'Membre',
          total_amount: 0,
          entries_count: 0,
          moneys: {},
          entries: [],
        };
      }

      const money = entry.abreviation || entry.money_abreviation || 'N/A';
      const amount = Number(entry.amount || 0);

      grouped[key].total_amount += amount;
      grouped[key].entries_count += 1;
      grouped[key].entries.push(entry);

      if (!grouped[key].moneys[money]) {
        grouped[key].moneys[money] = {
          money,
          total_amount: 0,
          count: 0,
        };
      }

      grouped[key].moneys[money].total_amount += amount;
      grouped[key].moneys[money].count += 1;
    });

    return Object.values(grouped).map((g: any) => ({
      ...g,
      moneys: Object.values(g.moneys),
    }));
  }
  getCommissionUsersFromDay(day: any): any[] {
    if (!day) return [];

    const key = day.date + '_' + (day.lines?.length || 0);

    if (!this.commissionUsersCache[key]) {
      const lines = Array.isArray(day.lines) ? day.lines : [];
      this.commissionUsersCache[key] = this.groupCommissionsByUser(lines);
    }

    return this.commissionUsersCache[key];
  }

  getPaymentUsersFromDay(day: any): any[] {
    if (!day) return [];

    const key = day.date + '_' + (day.lines?.length || 0);

    if (!this.paymentUsersCache[key]) {
      const lines = Array.isArray(day.lines) ? day.lines : [];
      this.paymentUsersCache[key] = this.groupCommissionsByUser(lines);
    }

    return this.paymentUsersCache[key];
  }
  // getCommissionUsersFromDay(day: any) {
  //   return this.groupCommissionsByUser(day.lines || []);
  // }

  async payCommissionGroup(group: any) {
    if (!['sponsor', 'collector'].includes(group.type)) {
      this.appserv.presentToast(
        'Impossible de payer automatiquement les commissions sans parrain.',
        'warning'
      );
      return;
    }

    const pendingLines = (group.lines || []).filter(
      (line: any) => line.status === 'pending' && line.type !== 'no_sponsor'
    );

    if (pendingLines.length === 0) {
      this.appserv.presentToast(
        'Aucune commission en attente pour cet utilisateur.',
        'warning'
      );
      return;
    }

    const alert = await this.appserv.alertctrl.create({
      header: 'Paiement groupé',
      message: `Confirmer le paiement de ${Number(
        group.total_amount || 0
      ).toLocaleString()} pour ${group.fullname} ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Tout payer',
          role: 'confirm',
          handler: () => this.confirmPayCommissionGroup(group, pendingLines),
        },
      ],
    });

    await alert.present();
  }
downloadPayrollFromApi(group: any) {
  if (!group?.beneficiary_id) {
    this.appserv.presentToast('Bénéficiaire introuvable pour cette fiche.', 'warning');
    return;
  }

  this.showprogress = true;

  this.firstentriesServ.downloadCommissionPayrollPdf({
    enterprise_id: this.appserv.getactualEse().id,
    beneficiary_id: group.beneficiary_id,
    money_id: this.selectedMoneyId || null,
    commission_month: this.commissionMonth || null,
    paid_month: this.paidMonth || null,
  }).subscribe({
    next: (response: any) => {
      this.showprogress = false;

      const blob = response.body;

      if (!blob || blob.size === 0) {
        this.appserv.presentToast('PDF vide ou bloqué.', 'danger');
        return;
      }

      const file = new Blob([blob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(file);

      const a = document.createElement('a');
      a.href = url;
      a.download = `fiche_paie_commission_${group.fullname || 'utilisateur'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    },
    error: () => {
      this.showprogress = false;
      this.appserv.presentToast('Erreur génération fiche de paie', 'danger');
    },
  });
}
  confirmPayCommissionGroup(group: any, lines: any[]) {
    this.showprogress = true;

    this.firstentriesServ
      .payCommissionsBulk({
        line_ids: lines.map((line: any) => line.id),
        done_by_id: this.appserv.getactualuser().id,
        type: group.type,
      })
      .subscribe({
        next: (res) => {
          this.showprogress = false;

          if (res.status === 200) {
            this.appserv.presentToast(
              res.message || 'Commissions payées',
              'success'
            );
            this.loadCommissions();
            this.loadPaymentHistory();
          } else {
            this.appserv.presentToast(
              res.error || 'Erreur paiement groupé',
              'danger'
            );
          }
        },
        error: (err) => {
          this.showprogress = false;
          this.appserv.presentToast(
            err?.error?.error || 'Erreur paiement groupé',
            'danger'
          );
        },
      });
  }

groupCommissionsByUser(list: any[]) {
  const grouped: any = {};

  (list || []).forEach((line: any) => {
    const key =
      line.type === 'no_sponsor'
        ? `member_${line.member_id}`
        : `beneficiary_${line.beneficiary_id}`;

    if (!grouped[key]) {
      grouped[key] = {
        beneficiary_id: line.beneficiary_id,
        member_id: line.member_id,
        type: line.type,
        fullname:
          line.type === 'no_sponsor'
            ? line.member_fullname || line.member_user_name || 'Membre sans parrain'
            : line.beneficiary_fullname || line.beneficiary_user_name || 'Bénéficiaire',

        total_amount: 0,
        total_collection: 0,
        total_sponsor: 0,
        total_no_sponsor: 0,

        collection_count: 0,
        sponsor_count: 0,
        no_sponsor_count: 0,

        total_operations: 0,
        lines_count: 0,
        moneys: {},
        lines: [],
        collection_lines: [],
        sponsor_lines: [],
        no_sponsor_lines: [],
      };
    }

    const money = line.abreviation || line.money_abreviation || 'N/A';
    const amount = Number(line.amount || 0);

    grouped[key].total_amount += amount;
    grouped[key].total_operations += Number(line.operations_count || 0);
    grouped[key].lines_count += 1;
    grouped[key].lines.push(line);

    if (line.type === 'collector') {
      grouped[key].total_collection += amount;
      grouped[key].collection_count += 1;
      grouped[key].collection_lines.push(line);
    }

    if (line.type === 'sponsor') {
      grouped[key].total_sponsor += amount;
      grouped[key].sponsor_count += 1;
      grouped[key].sponsor_lines.push(line);
    }

    if (line.type === 'no_sponsor') {
      grouped[key].total_no_sponsor += amount;
      grouped[key].no_sponsor_count += 1;
      grouped[key].no_sponsor_lines.push(line);
    }

    if (!grouped[key].moneys[money]) {
      grouped[key].moneys[money] = {
        money,
        total_amount: 0,
        total_collection: 0,
        total_sponsor: 0,
        total_no_sponsor: 0,
        count: 0,
      };
    }

    grouped[key].moneys[money].total_amount += amount;
    grouped[key].moneys[money].count += 1;

    if (line.type === 'collector') {
      grouped[key].moneys[money].total_collection += amount;
    }

    if (line.type === 'sponsor') {
      grouped[key].moneys[money].total_sponsor += amount;
    }

    if (line.type === 'no_sponsor') {
      grouped[key].moneys[money].total_no_sponsor += amount;
    }
  });

  return Object.values(grouped).map((g: any) => ({
    ...g,
    moneys: Object.values(g.moneys),
  }));
}
  loadEligibleAccounts() {
    this.showprogress = true;

    const payload = {
      enterprise_id: this.appserv.getactualEse().id,
      nature: this.filters.nature || null,
      money_id: this.selectedMoneyId || null,
      member_search: this.filters.member_search || null,
      only_without_retention: true,
      from: this.from,
      to: this.to,
      include_blocked: false,
    };

    this.firstentriesServ.eligibleReservationTree(payload).subscribe({
      next: (res) => {
        this.showprogress = false;

        if (res.status === 200) {
          this.reservationTree = res.data || [];
          this.eligibleAccountsList = res.flat || [];
          this.syncSelectionAfterReload();
          this.computeStats();
        } else {
          this.appserv.presentToast(res.error || 'Erreur chargement', 'danger');
        }
      },
      error: (err) => {
        this.showprogress = false;
        this.appserv.presentToast(
          err?.error?.error || 'Erreur serveur',
          'danger'
        );
      },
    });
  }

  buildHistoryTree(list: any[]) {
    const grouped: any = {};

    (list || []).forEach((entry: any) => {
      const rawDate =
        entry.done_at ||
        entry.reserved_at ||
        entry.cashed_at ||
        entry.created_at ||
        this.appserv.defaultdate();

      const date = String(rawDate).slice(0, 10);
      const year = date.slice(0, 4);
      const month = date.slice(0, 7);

      if (!grouped[year]) {
        grouped[year] = {
          year,
          count: 0,
          total: 0,
          months: {},
        };
      }

      if (!grouped[year].months[month]) {
        grouped[year].months[month] = {
          month,
          label: this.getMonthNameFr(month),
          count: 0,
          total: 0,
          dates: {},
        };
      }

      if (!grouped[year].months[month].dates[date]) {
        grouped[year].months[month].dates[date] = {
          date,
          count: 0,
          total: 0,
          entries: [],
        };
      }

      const amount = Number(entry.amount || 0);

      grouped[year].count += 1;
      grouped[year].total += amount;

      grouped[year].months[month].count += 1;
      grouped[year].months[month].total += amount;

      grouped[year].months[month].dates[date].count += 1;
      grouped[year].months[month].dates[date].total += amount;
      grouped[year].months[month].dates[date].entries.push(entry);
    });

    this.historyTree = Object.values(grouped).map((year: any) => ({
      ...year,
      months: Object.values(year.months).map((month: any) => ({
        ...month,
        dates: Object.values(month.dates).map((day: any) => ({
          ...day,
          users: this.groupHistoryByUser(day.entries || []),
        })),
      })),
    }));
  }

  toggleHistoryYear(year: any) {
    this.expandedHistoryYears[year.year] =
      !this.expandedHistoryYears[year.year];
  }

  toggleHistoryMonth(month: any) {
    this.expandedHistoryMonths[month.month] =
      !this.expandedHistoryMonths[month.month];
  }

  toggleHistoryDate(day: any) {
    this.expandedHistoryDates[day.date] = !this.expandedHistoryDates[day.date];
  }

  toggleYear(year: any) {
    this.expandedYears[year.year] = !this.expandedYears[year.year];
  }

  toggleMonth(month: any) {
    this.expandedMonths[month.month] = !this.expandedMonths[month.month];
  }

  toggleDate(date: any) {
    this.expandedDates[date.date] = !this.expandedDates[date.date];
  }

  getAccountsFromDate(day: any): any[] {
    if (!day) return [];

    if (Array.isArray(day.accounts) && day.accounts.length > 0) {
      return day.accounts;
    }

    if (Array.isArray(day.users) && day.users.length > 0) {
      return day.users.flatMap((user: any) => user.accounts || []);
    }

    return [];
  }

  getAccountsFromYear(year: any): any[] {
    return (year.months || []).flatMap((month: any) =>
      (month.dates || []).flatMap((day: any) => this.getAccountsFromDate(day))
    );
  }

  getAccountsFromMonth(month: any): any[] {
    return (month.dates || []).flatMap((day: any) =>
      this.getAccountsFromDate(day)
    );
  }

  selectAccountsBulk(accounts: any[]) {
    (accounts || []).forEach((account) => {
      if (!this.isSelected(account)) {
        this.selectedAccounts.push(account);
      }
    });

    this.computeStats();
  }

  reserveYear(year: any) {
    this.selectAccountsBulk(this.getAccountsFromYear(year));
    this.reserveSelectedAccounts();
  }

  reserveMonth(month: any) {
    this.selectAccountsBulk(this.getAccountsFromMonth(month));
    this.reserveSelectedAccounts();
  }

  reserveDate(date: any) {
    this.selectAccountsBulk(this.getAccountsFromDate(date));
    this.reserveSelectedAccounts();
  }

  reserveSingleAccount(account: any) {
    this.selectedAccounts = [account];
    this.computeStats();
    this.reserveSelectedAccounts();
  }

  isYearSelected(year: any): boolean {
    const accounts = this.getAccountsFromYear(year);
    return accounts.length > 0 && accounts.every((a) => this.isSelected(a));
  }

  isMonthSelected(month: any): boolean {
    const accounts = this.getAccountsFromMonth(month);
    return accounts.length > 0 && accounts.every((a) => this.isSelected(a));
  }

  isDateSelected(date: any): boolean {
    const accounts = this.getAccountsFromDate(date);
    return (
      accounts.length > 0 && accounts.every((a: any) => this.isSelected(a))
    );
  }
  // loadEligibleAccounts() {
  //   this.showprogress = true;

  //   const payload = {
  //     enterprise_id: this.appserv.getactualEse().id,
  //     nature: this.filters.nature || null,
  //     money_id: this.selectedMoneyId || null,
  //     member_search: this.filters.member_search || null,
  //     only_without_retention: true,
  //     from: this.from,
  //     to: this.to,
  //     include_blocked: false,
  //     per_page: 100,
  //   };

  //   this.firstentriesServ.eligibleAccounts(payload).subscribe({
  //     next: (res) => {
  //       this.showprogress = false;

  //       if (res.status === 200) {
  //         const groups = res.data || [];
  //         this.eligibleGroups = groups;
  //         this.eligibleAccountsList = [];

  //         groups.forEach((g: any) => {
  //           this.eligibleAccountsList = this.eligibleAccountsList.concat(
  //             g.accounts || []
  //           );
  //         });

  //         this.eligibleUserGroups = this.groupAccountsByUser(
  //           this.eligibleAccountsList
  //         );

  //         this.syncSelectionAfterReload();
  //         this.computeStats();
  //       } else {
  //         this.appserv.presentToast(
  //           res.error || 'Erreur chargement comptes',
  //           'warning'
  //         );
  //       }
  //     },
  //     error: (err) => {
  //       this.showprogress = false;
  //       this.appserv.presentToast(
  //         err?.error?.error || 'Impossible de charger les comptes',
  //         'danger'
  //       );
  //     },
  //   });
  // }

  firstentrieshistories() {
    this.showprogress = true;

    this.firstentriesServ
      .firstentrieshistories({
        from: this.from,
        to: this.to,
        user_id: this.appserv.getactualuser().id,
        enterprise_id: this.appserv.getactualEse().id,
        money_id: this.selectedMoneyId || null,
      })
      .subscribe({
        next: (response) => {
          this.showprogress = false;

          if (response.message === 'success' && response.status === 200) {
            this.firstentrieslist = response.data || [];
            this.historyUserGroups = this.groupHistoryByUser(
              this.firstentrieslist
            );
            this.buildHistoryTree(this.firstentrieslist);
          } else {
            this.appserv.presentToast(
              response.error || 'Erreur historique',
              'warning'
            );
          }
        },
        error: () => {
          this.showprogress = false;
          this.appserv.presentToast('Erreur chargement historique', 'danger');
        },
      });
  }

  loadCommissions() {
    this.showprogress = true;
    this.commissionUsersCache = {};
    this.clearCommissions();

    this.firstentriesServ
      .pendingCommissions({
        enterprise_id: this.appserv.getactualEse().id,
        status: this.commissionStatus,
        type: this.commissionTab,
        money_id: this.selectedMoneyId || null,
        commission_month: this.commissionMonth || null,
        paid_month:
          this.commissionStatus === 'paid' && this.paidMonth
            ? this.paidMonth
            : null,
        per_page: 300,
      })
      .subscribe({
        next: (res) => {
          this.showprogress = false;

          if (res.status === 200) {
            const list = Array.isArray(res.data)
              ? res.data
              : res.data?.data || [];

            this.commissionSummary = res.summary || null;
            this.groupedByCommissionMonth =
              res.grouped_by_commission_month || [];
            this.groupedByPaidMonth = res.grouped_by_paid_month || [];

            if (this.commissionTab === 'sponsor') {
              this.sponsorCommissions = list;
            }

            if (this.commissionTab === 'collector') {
              this.collectorCommissions = list;
            }

            if (this.commissionTab === 'no_sponsor') {
              this.noSponsorCommissions = list;
            }

            this.commissionsList = list;
            this.commissionUserGroups = this.groupCommissionsByUser(list);
            this.buildCommissionTree(list);
          } else {
            this.clearCommissions();
            this.appserv.presentToast(
              res.error || 'Erreur chargement commissions',
              'warning'
            );
          }
        },
        error: (err) => {
          this.showprogress = false;
          this.clearCommissions();
          this.appserv.presentToast(
            err?.error?.error || 'Erreur commissions',
            'danger'
          );
        },
      });
  }

  loadPaymentHistory() {
    this.showprogress = true;
    this.paymentUsersCache = {};
    this.firstentriesServ
      .commissionPaymentHistory({
        enterprise_id: this.appserv.getactualEse().id,
        type: null,
        money_id: this.selectedMoneyId || null,
        commission_month: this.commissionMonth || null,
        paid_month: this.paidMonth || null,
        per_page: 300,
      })
      .subscribe({
        next: (res) => {
          this.showprogress = false;

          if (res.status === 200) {
            const list = Array.isArray(res.data)
              ? res.data
              : res.data?.data || [];

            this.paymentSummary = res.summary || null;
            this.paymentHistoryList = list;
            this.paymentHistoryGroups = this.groupCommissionsByUser(list);
            this.buildPaymentHistoryTree(list);
            this.paymentGroupedByCommissionMonth =
              res.grouped_by_commission_month || [];
            this.paymentGroupedByPaidMonth = res.grouped_by_paid_month || [];
          } else {
            this.clearPaymentHistory();
          }
        },
        error: () => {
          this.showprogress = false;
          this.clearPaymentHistory();
        },
      });
  }

  getTotalsByMoney(list: any[]): MoneyTotal[] {
    const grouped: { [key: string]: MoneyTotal } = {};

    (list || []).forEach((item: any) => {
      const money = item.abreviation || item.money_abreviation || 'N/A';

      if (!grouped[money]) {
        grouped[money] = {
          money,
          total: 0,
        };
      }

      grouped[money].total += Number(item.amount || 0);
    });

    return Object.values(grouped);
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'sponsor':
        return 'Parrain';
      case 'collector':
        return 'Collecteur';
      case 'no_sponsor':
        return 'Sans parrain';
      default:
        return type || '-';
    }
  }

  clearCommissions() {
    this.commissionsList = [];
    this.sponsorCommissions = [];
    this.collectorCommissions = [];
    this.noSponsorCommissions = [];
    this.commissionUserGroups = [];
    this.commissionSummary = null;
    this.groupedByCommissionMonth = [];
    this.groupedByPaidMonth = [];
    this.commissionTree = [];
  }

  clearPaymentHistory() {
    this.paymentSummary = null;
    this.paymentHistoryList = [];
    this.paymentHistoryGroups = [];
    this.paymentGroupedByCommissionMonth = [];
    this.paymentGroupedByPaidMonth = [];
    this.paymentHistoryTree = [];
  }

  toggleAccount(account: any) {
    const exists = this.selectedAccounts.some((a) => a.id === account.id);

    if (exists) {
      this.selectedAccounts = this.selectedAccounts.filter(
        (a) => a.id !== account.id
      );
    } else {
      this.selectedAccounts.push(account);
    }

    this.computeStats();
  }

  isSelected(account: any): boolean {
    return this.selectedAccounts.some((a) => a.id === account.id);
  }

  selectAllVisible() {
    this.eligibleAccountsList.forEach((account) => {
      if (!this.isSelected(account)) {
        this.selectedAccounts.push(account);
      }
    });

    this.computeStats();
  }

  clearSelection() {
    this.selectedAccounts = [];
    this.computeStats();
  }

  syncSelectionAfterReload() {
    this.selectedAccounts = this.selectedAccounts.filter((selected) =>
      this.eligibleAccountsList.some((a) => a.id === selected.id)
    );
  }

  computeStats() {
    const grouped: any = {};

    this.selectedAccounts.forEach((account) => {
      const money = account.abreviation || account.money_abreviation || 'N/A';

      if (!grouped[money]) {
        grouped[money] = {
          money,
          count: 0,
          total: 0,
          collectorFund: 0,
          generalFund: 0,
        };
      }

      const amount = Number(account.amount || 0);

      grouped[money].count += 1;
      grouped[money].total += amount;
      grouped[money].collectorFund += amount * 0.35;
      grouped[money].generalFund += amount * 0.65;
    });

    this.selectedTotalsByMoney = Object.values(grouped);

    const globalTotal = this.selectedTotalsByMoney.reduce(
      (sum: number, item: any) => sum + Number(item.total || 0),
      0
    );

    this.stats = {
      selectedCount: this.selectedAccounts.length,
      selectedTotal: globalTotal,
      collectorFund: globalTotal * 0.35,
      generalFund: globalTotal * 0.65,
    };
  }

  getTotal(list: any[]) {
    return (list || []).reduce((sum: number, item: any) => {
      return sum + Number(item.amount || 0);
    }, 0);
  }

  async reserveSelectedAccounts() {
    if (this.selectedAccounts.length === 0) {
      this.appserv.presentToast(
        'Veuillez sélectionner au moins un compte',
        'warning'
      );
      return;
    }

    const total = this.selectedAccounts.reduce(
      (sum, account) => sum + Number(account.amount || 0),
      0
    );

    if (total <= 0) {
      this.appserv.presentToast(
        'Aucun montant première mise valide dans la sélection',
        'warning'
      );
      return;
    }

    const alert = await this.appserv.alertctrl.create({
      header: 'Confirmer la retenue',
      message: `Vous allez réserver ${
        this.selectedAccounts.length
      } compte(s). Total premières mises : ${total.toLocaleString()}.`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Confirmer',
          role: 'confirm',
          handler: () => this.submitReservation(),
        },
      ],
    });

    await alert.present();
  }

  submitReservation() {
    this.showprogress = true;

    this.firstentriesServ
      .reserveVirtual({
        enterprise_id: this.appserv.getactualEse().id,
        account_ids: this.selectedAccounts.map((a) => a.id),
        excluded_account_ids: [],
        done_by_id: this.appserv.getactualuser().id,
        description:
          this.reservation.description ||
          'Première mise réservée virtuellement',
        done_at: this.appserv.defaultdate(),
      })
      .subscribe({
        next: (res) => {
          this.showprogress = false;

          if (res.status === 200) {
            this.appserv.presentToast(
              `Réservation effectuée : ${
                res.data?.created_count || 0
              } créé(s), ${res.data?.ignored_count || 0} ignoré(s)`,
              'success'
            );

            this.clearSelection();
            this.loadEligibleAccounts();
            this.firstentrieshistories();
            this.loadCommissions();
            this.loadPaymentHistory();
          } else {
            this.appserv.presentToast(
              res.error || 'Erreur réservation',
              'danger'
            );
          }
        },
        error: (err) => {
          this.showprogress = false;
          this.appserv.presentToast(
            err?.error?.error || 'Erreur réservation',
            'danger'
          );
        },
      });
  }

  async cancelFirstEntry(firstentry: any) {
    const alert = await this.appserv.alertctrl.create({
      header: 'Annuler première mise',
      message: `Confirmer l’annulation de ${Number(
        firstentry.amount || 0
      ).toLocaleString()} ${firstentry.abreviation || ''} ?`,
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Motif d’annulation',
        },
      ],
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui, annuler',
          role: 'confirm',
          handler: (data: any) => {
            this.confirmCancelFirstEntry(firstentry, data.reason);
          },
        },
      ],
    });

    await alert.present();
  }

  confirmCancelFirstEntry(firstentry: any, reason: string) {
    this.showprogress = true;

    this.firstentriesServ
      .cancelFirstEntryFlow({
        id: firstentry.id,
        done_by_id: this.appserv.getactualuser().id,
        reason: reason || 'Annulation depuis historique',
      })
      .subscribe({
        next: (res) => {
          this.showprogress = false;

          if (res.status === 200) {
            this.appserv.presentToast(res.message, 'success');
            this.firstentrieshistories();
            this.loadEligibleAccounts();
            this.loadCommissions();
            this.loadPaymentHistory();
          } else {
            this.appserv.presentToast(
              res.error || 'Erreur annulation',
              'danger'
            );
          }
        },
        error: (err) => {
          this.showprogress = false;
          this.appserv.presentToast(
            err?.error?.error || 'Erreur annulation',
            'danger'
          );
        },
      });
  }

  async payCommission(line: any) {
    if (line.type === 'no_sponsor') {
      this.appserv.presentToast(
        'Ce montant est non attribué car le membre n’a pas de parrain.',
        'warning'
      );
      return;
    }

    if (line.status !== 'pending') {
      this.appserv.presentToast(
        'Cette commission est déjà traitée.',
        'warning'
      );
      return;
    }

    const alert = await this.appserv.alertctrl.create({
      header: 'Payer la commission',
      message: `Confirmer le paiement de ${Number(
        line.amount || 0
      ).toLocaleString()} ${line.abreviation || ''} à ${
        line.beneficiary_fullname || line.beneficiary_user_name || ''
      } ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Payer',
          role: 'confirm',
          handler: () => this.confirmPayCommission(line),
        },
      ],
    });

    await alert.present();
  }

  confirmPayCommission(line: any) {
    this.showprogress = true;

    this.firstentriesServ
      .payCommission({
        line_id: line.id,
        done_by_id: this.appserv.getactualuser().id,
      })
      .subscribe({
        next: (res) => {
          this.showprogress = false;

          if (res.status === 200) {
            this.appserv.presentToast(
              'Commission payée avec succès',
              'success'
            );
            this.loadCommissions();
            this.loadPaymentHistory();
          } else {
            this.appserv.presentToast(res.error || 'Erreur paiement', 'danger');
          }
        },
        error: (err) => {
          this.showprogress = false;
          this.appserv.presentToast(
            err?.error?.error || 'Erreur paiement commission',
            'danger'
          );
        },
      });
  }

  async openNoSponsorDetails(line: any) {
    const modal = await this.appserv.modalCtrl.create({
      component: NoSponsorDetailsComponent,
      componentProps: {
        line,
      },
      cssClass: 'no-sponsor-modal',
      backdropDismiss: true,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'assign' && data?.sponsor_id) {
      this.assignSponsorToNoSponsorCommission(line, Number(data.sponsor_id));
    }
  }

  assignSponsorToNoSponsorCommission(line: any, sponsorId: number) {
    this.showprogress = true;

    this.firstentriesServ
      .assignSponsorToNoSponsor({
        commission_line_id: line.id,
        sponsor_id: sponsorId,
        done_by_id: this.appserv.getactualuser().id,
      })
      .subscribe({
        next: (res) => {
          this.showprogress = false;

          if (res.status === 200) {
            this.appserv.presentToast('Parrain affecté avec succès', 'success');
            this.loadCommissions();
            this.loadPaymentHistory();
          } else {
            this.appserv.presentToast(
              res.error || 'Erreur affectation parrain',
              'danger'
            );
          }
        },
        error: (err) => {
          this.showprogress = false;
          this.appserv.presentToast(
            err?.error?.error || 'Erreur affectation parrain',
            'danger'
          );
        },
      });
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'reserved':
        return 'warning';
      case 'cashed':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      default:
        return 'medium';
    }
  }
}
