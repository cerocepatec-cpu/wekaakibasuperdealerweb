import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { MoneyService } from '../services/money.service';
import { ExchangeRateFormComponent } from './exchange-rate-form/exchange-rate-form.component';
import { AppservicesService } from '../services/appservices.service';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.scss'],
})
export class ExchangeRateComponent implements OnInit {

  rates: any[] = [];
  moneys: any[] = [];

  form!: FormGroup;

  loading = false;
  submitting = false;

  showModal = false;
  isEditMode = false;
  selectedId: number | null = null;

  // Pagination
  currentPage = 1;
  lastPage = 1;
  total = 0;

  enterpriseId = 1; // 🔥 adapte selon ton auth service

  constructor(
    public appserv:AppservicesService,
    private moneyServ:MoneyService,
    private fb: FormBuilder,
    private service: ExchangeRateService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRates();
    this.loadMoneys();
  }

  // ==========================
  // INIT FORM
  // ==========================
  initForm() {
    this.form = this.fb.group({
      from_money_id: [null, Validators.required],
      to_money_id: [null, Validators.required],
      rate: [null, [Validators.required, Validators.min(0.00000001)]],
      valid_from: [new Date().toISOString(), Validators.required],
      valid_until: [null]
    });
  }

  // ==========================
  // LOAD DATA
  // ==========================
  loadRates(page: number = 1) {
    this.loading = true;

    this.service.getAll({
      enterprise_id: this.enterpriseId,
      page: page
    }).subscribe({
      next: (res: any) => {
        console.log("Taux chargés", res);
        this.rates = res.data;
        this.currentPage = res.current_page;
        this.lastPage = res.last_page;
        this.total = res.total;
        this.loading = false;
      },
      error: (err) => {
        console.log("Error lors du chargement des taux",err);
        this.loading = false;
        this.presentToast('Erreur chargement des taux', 'danger');
      }
    });
  }

  async loadMoneys() {
    this.moneys = await this.moneyServ.getesemoneys();
  }

  // ==========================
  // CREATE
  // ==========================
 async openCreate() {
  const modal = await this.appserv.modalCtrl.create({
    component: ExchangeRateFormComponent,
    componentProps: {
      enterpriseId: this.enterpriseId
    },
    cssClass: 'premium-modal',
  });

  modal.onDidDismiss().then(res => {
    if (res.data) {
      this.loadRates(this.currentPage);
    }
  });

  await modal.present();
}


  // ==========================
  // EDIT
  // ==========================
 async edit(rate: any) {
  const modal = await this.appserv.modalCtrl.create({
    component: ExchangeRateFormComponent,
    componentProps: {
      rate: rate,
      enterpriseId: this.enterpriseId
    },
    breakpoints: [0, 0.9],
    initialBreakpoint: 0.9
  });

  modal.onDidDismiss().then(res => {
    if (res.data) {
      this.loadRates(this.currentPage);
    }
  });

  await modal.present();
}

  // ==========================
  // PAGINATION
  // ==========================
  changePage(page: number) {
    if (page < 1 || page > this.lastPage) return;
    this.loadRates(page);
  }

  // ==========================
  // TOAST
  // ==========================
  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'top'
    });
    await toast.present();
  }

  // ==========================
  // CLOSE MODAL
  // ==========================
  closeModal() {
    if (this.submitting) return;
    this.showModal = false;
  }

}
