import { Component, HostListener, OnInit } from '@angular/core';
import { AgentBonusReportService } from '../agent-bonus-report.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MoneyService } from '../services/money.service';
import { AppservicesService } from '../services/appservices.service';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-agent-bonus-report',
  templateUrl: './agent-bonus-report.component.html',
  styleUrls: ['./agent-bonus-report.component.scss'],
})
export class AgentBonusReportComponent implements OnInit {
  public activeTab: 'report' | 'disbursement' = 'report';
  bonuses: any[] = [];
  currencies: any[] = [];
  agents: any[] = [];
  disbursementCollectors: any[] = [];
  collectorFunds: any[] = [];
  selectedFundId: any = '';
  showAdvancedFilters = false;
  showStats = false;
  stats: any;
  groupByAgent = false;
  loading = false;
  disbursementLoading = false;
  payingKey = '';

  filters: any = {
    search: '',
    currency_id: '',
    agent_id: '',
    start_date: '',
    end_date: '',
    period: '',
  };

  pagination: any = {
    current_page: 1,
    last_page: 1,
    total: 0,
  };

  constructor(
    private authserv:AuthentificationService,
    private moneyserv: MoneyService,
    private reportService: AgentBonusReportService,
    public appserv: AppservicesService,
    private overlay: OverlayContainer
  ) {}

  async ngOnInit() {
    this.currencies = await this.moneyserv.getesemoneys();
    this.applyDarkToOverlay();
    this.loadInitialData();
    this.loadReport();
    this.loadDisbursement();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.activeTab === 'report') {
      this.loadReport();
    }
  }

  public switchTab(tab: 'report' | 'disbursement') {
    this.activeTab = tab;

    if (tab === 'disbursement' && this.disbursementCollectors.length === 0) {
      this.loadDisbursement();
    }
  }

  toggleGroupMode() {
    this.groupByAgent = !this.groupByAgent;
    this.bonuses = [];
    this.pagination.total = 0;
    this.pagination.last_page = 1;
    this.loadReport();
  }

  toggleStats() {
    this.showStats = !this.showStats;
  }

  applyDarkToOverlay() {
    const container = this.overlay.getContainerElement();
    if (document.body.classList.contains('dark')) {
      container.classList.add('dark');
    } else {
      container.classList.remove('dark');
    }
  }

  loadInitialData() {
    this.reportService.getFiltersData().subscribe((res: any) => {
      this.agents = res.agents;
    });
  }

  setPeriod(period: string) {
    this.filters.period = period;
    this.filters.start_date = '';
    this.filters.end_date = '';
    this.loadReport();
  }

  getPeriodClass(period: string) {
    return this.filters.period === period
      ? 'bg-emerald-600 text-white'
      : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200';
  }

  loadDisbursement() {
    const enterpriseId =
      this.appserv.getactualEse()?.id || this.appserv.getactualuser()?.enterprise_id;

    if (!enterpriseId) {
      this.appserv.presentToast('Entreprise non identifiee.', 'warning');
      return;
    }

    this.disbursementLoading = true;

    this.reportService.getCollectorsDisbursement(enterpriseId).subscribe({
      next: (res: any) => {
        this.disbursementCollectors = res?.data?.collectors ?? [];
        this.collectorFunds = res?.data?.funds ?? [];

        if (!this.selectedFundId && this.collectorFunds.length > 0) {
          this.selectedFundId = this.collectorFunds[0].id;
        }

        this.disbursementLoading = false;
      },
      error: (err) => {
        this.disbursementLoading = false;
        this.appserv.presentToast(
          err?.error?.error || 'Impossible de charger les decaissements.',
          'danger'
        );
      },
    });
  }

  async payCollectorLine(collector: any, wallet: any) {
    
    const pin = await this.authserv.callPinModal();
    if(!pin){
      this.appserv.presentToast("Pin incorrect ou fenetre fermee","warning");
      return;
    }

    const enterpriseId = this.appserv.getactualEse()?.id || this.appserv.getactualuser()?.enterprise_id;
    const doneBy = this.appserv.getactualuser()?.id;

    if (!enterpriseId || !doneBy) {
      this.appserv.presentToast('Utilisateur ou entreprise non identifie.', 'warning');
      return;
    }

    const key = `${collector.agent_id}-${wallet.currency_id}`;
    this.payingKey = key;

    this.reportService
      .payCollectorDisbursement({
        agent_id: collector.agent_id,
        currency_id: wallet.currency_id,
        enterprise_id: enterpriseId,
        done_by: doneBy,
        amount: wallet.total_balance,
        description: 'Decaissement bonus collecteur',
      })
      .subscribe({
        next: (res: any) => {
          this.payingKey = '';

          if (res?.status === 200) {
            this.appserv.presentToast('Decaissement effectue avec succes.', 'success');
            this.loadDisbursement();
            this.loadReport(this.pagination.current_page);
            return;
          }

          this.appserv.presentToast(res?.error || 'Decaissement impossible.', 'warning');
        },
        error: (err) => {
          this.payingKey = '';
          this.appserv.presentToast(
            err?.error?.error || 'Decaissement impossible.',
            'danger'
          );
        },
      });
  }

  getDisbursementTotal() {
    return this.disbursementCollectors.reduce((total, collector) => {
      return (
        total +
        (collector.wallets || []).reduce(
          (sum:number,wallet:any) => sum + Number(wallet.total_balance || 0),
          0
        )
      );
    }, 0);
  }

  loadReport(page: number = 1) {
    this.loading = true;
    this.pagination.current_page = page;

    const params = {
      ...this.filters,
      page: page,
      group_by: this.groupByAgent ? 'agent' : null,
    };

    this.reportService.getReport(params).subscribe({
      next: (res: any) => {
        if (this.groupByAgent) {
          this.bonuses = res.data;
          this.pagination.total = this.bonuses.length;
          this.pagination.last_page = 1;
        } else {
          this.bonuses = res.data.data;
          this.pagination.last_page = res.data.last_page;
          this.pagination.total = res.data.total;
        }

        this.stats = res.stats ?? [];
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.loading = false;
      },
      error: (err) => {
        console.error('Report error', err);
        this.loading = false;
      },
    });
  }

  getPages(): number[] {
    const totalPages = this.pagination.last_page;
    const current = this.pagination.current_page;
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  resetFilters() {
    this.filters = {
      search: '',
      currency_id: '',
      agent_id: '',
      start_date: '',
      end_date: '',
      period: '',
    };

    this.loadReport();
  }

  nextPage() {
    if (this.pagination.current_page < this.pagination.last_page) {
      this.loadReport(this.pagination.current_page + 1);
    }
  }

  prevPage() {
    if (this.pagination.current_page > 1) {
      this.loadReport(this.pagination.current_page - 1);
    }
  }
}

