import { Component, OnInit } from '@angular/core';
import { CreditApiService } from '../credit-api.service';
import { AppservicesService } from '../services/appservices.service';
import { CreditCreateComponent } from '../credit-create/credit-create.component';
import { AuthentificationService } from '../services/authentification.service';
import { CreditDisburseComponent } from '../credit-disburse/credit-disburse.component';
import { CreditApproveModal } from '../credit-approve-modal/credit-approve-modal.component';
import { CreditPayComponent } from '../credit-pay/credit-pay.component';

@Component({
  selector: 'app-credit-dashboard',
  templateUrl: './credit-dashboard.page.html',
  styleUrls: ['./credit-dashboard.page.scss'],
})
export class CreditDashboardPage implements OnInit {
  credits: any[] = [];
  pagination: any = {};
  stats: any = {};
  filters: any = {
    search: '',
    status: '',
    installment_type: '',
    from_date: '',
    to_date: '',
    page: 1,
  };

  constructor(
    private authserv: AuthentificationService,
    private creditApi: CreditApiService,
    public appserv: AppservicesService
  ) {}

  ngOnInit() {
    this.loadCredits();
  }

  ngAfterViewInit() {
    this.loadStats();
  }

  async creditCreate() {
    const modal = await this.appserv.modalCtrl.create({
      component: CreditCreateComponent,
    });
    modal.present();
  }

  applyFilters() {
    this.filters.page = 1;
    this.loadCredits();
  }

  loadCredits() {
    this.creditApi.list(this.filters).subscribe({
      next: (res: any) => {
        this.credits = res.data;
        this.pagination = res.meta;
      },
      error: () => {
        console.error('Erreur chargement crédits');
      },
    });
  }

  private searchTimeout: any;

  debounceSearch() {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  resetFilters() {
    this.filters = {
      search: '',
      status: '',
      installment_type: '',
      from_date: '',
      to_date: '',
      page: 1,
    };

    this.loadCredits();
  }

  async onApprove(credit: any) {
    const modalPin = await this.authserv.callPinModal();
    if (!modalPin) {
      this.appserv.presentToast('Le Pin est incorrect', 'warning');
      return;
    }

    const modal = await this.appserv.modalCtrl.create({
      component: CreditApproveModal,
      componentProps: { credit },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.loadCredits();
    }
  }

  async onDisburse(credit: any) {
    const modalPin = await this.authserv.callPinModal();
    if (!modalPin) {
      this.appserv.presentToast('Le Pin est incorrect', 'warning');
      return;
    }
    const modal = await this.appserv.modalCtrl.create({
      component: CreditDisburseComponent,
      componentProps: { credit: credit, funds: [] },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'success') {
      this.loadCredits();
    }
    // console.log('Disburse credit', credit);
  }

  async activate(credit: any) {
    const modalPin = await this.authserv.callPinModal();
    if (!modalPin) {
      this.appserv.presentToast('Le Pin est incorrect', 'warning');
      return;
    }
    this.creditApi.activate(credit.id).subscribe(() => {
      this.loadCredits();
    });
  }

  async onPay(credit: any) {
    const modalPin = await this.authserv.callPinModal();
    if (!modalPin) {
      this.appserv.presentToast('Le Pin est incorrect', 'warning');
      return;
    }
    const modal = await this.appserv.modalCtrl.create({
      component: CreditPayComponent,
      componentProps: { credit: credit },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'success') {
      this.loadCredits();
    }
    console.log('Pay credit', credit);
  }

  loadStats() {
    this.creditApi.getDashboardStats().subscribe((res) => {
      console.log(res);
      this.stats = res;
    });
  }
}
