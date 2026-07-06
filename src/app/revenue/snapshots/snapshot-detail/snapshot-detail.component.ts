import { Component,OnInit, ViewChild} from '@angular/core';
import { IonInput } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AppservicesService } from 'src/app/services/appservices.service';
import { RevenueService } from 'src/app/services/revenue.service';

@Component({
  selector: 'app-snapshot-detail',
  templateUrl: './snapshot-detail.component.html',
})
export class SnapshotDetailComponent implements OnInit {
  @ViewChild('searchinput') searchInput!: IonInput;
  snapshotId!: number;
  snapshot: any;
  snapshotTotals: any = null;
  search:any;
  lines: any[] = [];
  loading = false;
  payingId: number | null = null;
  selectedReserveLine: any = null;
  selectedPayerFundId: number | null = null;
  selectedReserveFundId: number | null = null;
  availableFunds: any[] = []; // charger via API

  constructor(
    private route: ActivatedRoute,
    public appserv: AppservicesService,
    private modalCtrl: ModalController,
    private revenueService: RevenueService
  ) {}

  ngOnInit() {
    this.snapshotId = Number(this.route.snapshot.paramMap.get('id'));
    setTimeout(() => {
      this.showSnapDetails();
    }, 200);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadLines();
      this.getlistTubs();
      this.searchInput.setFocus();
    }, 300);
  }

  handlePayment(line: any) {
    this.selectedReserveLine = line;
  }

  confirmReserveInlinePayment() {
    if (!this.selectedReserveLine) return;

    this.payLine(
      this.selectedReserveLine,
      this.selectedPayerFundId,
      this.selectedReserveFundId
    );

    this.selectedReserveLine = null;
    this.selectedPayerFundId = null;
    this.selectedReserveFundId = null;
  }

  showSnapDetails() {
    this.revenueService.getSnapshotDetail(this.snapshotId).subscribe({
      next: (res) => {
        console.log('snapshot Showing from API', res);
        this.snapshot = res;
        this.snapshotTotals = res.totals;
      },
      error: (err) => {
        console.log('error loading snapshot details', err);
        this.appserv.presentToast(
          'Erreur lors du chargement des détails du snapshot.',
          'danger'
        );
      },
    });
  }
  get canConfirmPayment(): boolean {
    if (!this.selectedReserveLine) return false;

    // 🔹 Si catégorie différente de reserve
    if (this.selectedReserveLine.rule?.category !== 'reserve') {
      return !!this.selectedPayerFundId;
    }

    // 🔹 Si catégorie reserve
    return (
      !!this.selectedPayerFundId &&
      !!this.selectedReserveFundId &&
      this.selectedPayerFundId !== this.selectedReserveFundId
    );
  }

  getlistTubs() {
    this.appserv.myTubs(this.appserv.actualUser.id).subscribe(
      (data) => {
        console.log('list tub from API', data);
        this.availableFunds = data;
      },
      (error) => {
        this.appserv.presentToast(
          'Erreur survenue lors de la recupération de la liste des caisses.',
          'danger'
        );
      }
    );
  }

  loadLines() {
    this.loading = true;
    this.revenueService.getSnapshotLines(this.snapshotId).subscribe({
      next: (res) => {
        this.lines = res;
        console.log('RAW RESPONSE LINES:', res);
        this.lines = res;
        this.loading = false;
      },
      error: (err) => {
        this.appserv.presentToast(
          'Erreur lors du chargement des lignes de distribution.',
          'danger'
        );
        this.loading = false;
      },
    });
  }

  async payLine(
    line: any,
    payerFundId?: number | null,
    reserveFundId?: number | null
  ) {
    if (line.status === 'paid') return;
    const alert = await this.appserv.alertctrl.create({
      header: 'Confirmer le paiement',
      message: 'Confirmer le paiement de cette ligne ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Confirmer',
          handler: () => {
            // 🔒 Si catégorie réserve → validation obligatoire
            if (line.rule?.category === 'reserve') {
              if (!payerFundId || !reserveFundId) {
                this.appserv.presentToast(
                  'Veuillez sélectionner la caisse payeur et la caisse réserve.'
                );
                return;
              }

              if (payerFundId === reserveFundId) {
                this.appserv.presentToast(
                  'La caisse payeur ne peut pas être identique à la caisse réserve.'
                );
                return;
              }
            }
            this.payingId = line.id;

            this.revenueService
              .payDistributionLine(line.id, payerFundId, reserveFundId)
              .subscribe({
                next: (res) => {
                  console.log('Ligne payée avec succès', res);
                  this.loadLines();
                  this.payingId = null;

                  // reset sélection réserve
                  this.selectedReserveLine = null;
                  this.selectedPayerFundId = null;
                  this.selectedReserveFundId = null;
                },
                error: (err) => {
                  console.log('Erreur lors du paiement de la ligne', err);
                  this.appserv.presentToast(
                    err.error?.message || 'Erreur lors du paiement.'
                  );
                  this.payingId = null;
                },
              });
          },
        },
      ],
    });
    await alert.present();
  }

  get totalPaid(): number {
    return Number(this.snapshotTotals?.paid || 0);
  }

  get totalRemaining(): number {
    return Number(this.snapshotTotals?.remaining || 0);
  }

  get totalGlobal(): number {
    return Number(this.snapshotTotals?.total || 0);
  }

  get mainCurrency(): string {
    return this.snapshotTotals?.main_currency_code || '';
  }

  get paidPercentage(): number {
    if (!this.totalGlobal) return 0;
    return Math.min(100, Math.round((this.totalPaid / this.totalGlobal) * 100));
  }

  getTotalByMoney(moneyId: number): number {
    return this.lines
      .filter((l) => l.original_money_id === moneyId)
      .reduce((sum, l) => sum + Number(l.original_amount), 0);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  statusClass(status: string) {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'paid':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  }
}
