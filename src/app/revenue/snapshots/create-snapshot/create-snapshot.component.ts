import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RevenueService } from 'src/app/services/revenue.service';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-create-snapshot',
  templateUrl: './create-snapshot.component.html',
})
export class CreateSnapshotComponent {
  selectedMonth: number | null = null;
  selectedYear: number = new Date().getFullYear();
  hasRevenue = false;
  previewData: any = {};
  loadingPreview = false;
  currentDate = new Date();
  existingMonths: number[] = [];
  loading = false;

  months = [
    { id: 1, label: 'Jan' },
    { id: 2, label: 'Feb' },
    { id: 3, label: 'Mar' },
    { id: 4, label: 'Apr' },
    { id: 5, label: 'May' },
    { id: 6, label: 'Jun' },
    { id: 7, label: 'Jul' },
    { id: 8, label: 'Aug' },
    { id: 9, label: 'Sep' },
    { id: 10, label: 'Oct' },
    { id: 11, label: 'Nov' },
    { id: 12, label: 'Dec' },
  ];

  constructor(
    public appserv: AppservicesService,
    private modalCtrl: ModalController,
    private revenueService: RevenueService
  ) {}

  ngOnInit() {
    this.loadExistingMonths();
  }

  selectMonth(month: number) {
    if (this.isFutureMonth(month)) return;

    if (this.existingMonths.includes(month)) return;

    this.selectedMonth = month;

    this.loadingPreview = true;

    this.revenueService.previewSnapshot(month, this.selectedYear).subscribe({
      next: (res: any) => {
        console.log('Preview data', res);
        this.previewData = res;

        this.hasRevenue = res?.totals?.length > 0;

        this.loadingPreview = false;
      },

      error: () => {
        this.loadingPreview = false;

        this.previewData = {};

        this.hasRevenue = false;
      },
    });
  }
  loadExistingMonths() {
    this.revenueService
      .getSnapshotsByYear(this.selectedYear)
      .subscribe((res) => {
        this.existingMonths = res.map((s: any) => s.period_month);
      });
  }

  previousYear() {
    this.selectedYear--;
    this.loadExistingMonths();
  }

  nextYear() {
    this.selectedYear++;
    this.loadExistingMonths();
  }

  isFutureMonth(month: number): boolean {
    if (this.selectedYear > this.currentDate.getFullYear()) return true;
    if (this.selectedYear === this.currentDate.getFullYear()) {
      return month > this.currentDate.getMonth() + 1;
    }
    return false;
  }

  getAmount(collection: any[], moneyId: number): number {
    if (!collection) return 0;

    const found = collection.find((x) => x.money_id === moneyId);

    return Number(found?.amount || 0);
  }
  
  async create() {
    if (!this.selectedMonth) return;

    const confirm = await this.appserv.alertctrl.create({
      header: 'Confirmer la clôture',
      message: `Créer la clôture pour ${this.selectedMonth}/${this.selectedYear} ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Confirmer',
          handler: () => this.executeCreation(),
        },
      ],
    });

    await confirm.present();
  }

  async executeCreation() {
    this.loading = true;

    this.revenueService
      .createSnapshot(this.selectedMonth!, this.selectedYear)
      .subscribe({
        next: async () => {
          this.loading = false;
          this.appserv.presentToast('Clôture créée avec succès', 'success');
          this.modalCtrl.dismiss(true);
        },
        error: async (err) => {
          console.log('Error creating snapshot', err);
          this.loading = false;
          const toast = await this.appserv.presentToast(
            err.error?.message || 'Erreur lors de la création',
            'danger'
          );
        },
      });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
