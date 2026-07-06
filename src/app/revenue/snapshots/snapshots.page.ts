import { Component, OnInit } from '@angular/core';
import { RevenueService } from 'src/app/services/revenue.service';
import { ModalController } from '@ionic/angular';
import { CreateSnapshotComponent } from './create-snapshot/create-snapshot.component';
import { AppservicesService } from 'src/app/services/appservices.service';
import { SnapshotDetailComponent } from './snapshot-detail/snapshot-detail.component';

@Component({
  selector: 'app-snapshots',
  templateUrl: './snapshots.page.html',
})
export class SnapshotsPage implements OnInit {
  snapshots: any[] = [];
  selectedYear = new Date().getFullYear();
  years: number[] = [];

  loading = false;

  constructor(
    private revenueService: RevenueService,
    private modalCtrl: ModalController,
    private appserv: AppservicesService
  ) {}

  ngOnInit() {
    this.initYears();
    this.loadSnapshots();
  }

  initYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 3; i <= currentYear + 2; i++) {
      this.years.push(i);
    }
  }

  loadSnapshots() {
    this.loading = true;

    this.revenueService.getSnapshotsByYear(this.selectedYear).subscribe({
      next: (res) => {
        console.log("snap shots loaded",res);
        this.snapshots = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  async createSnapshot() {
    const modal = await this.modalCtrl.create({
      component: CreateSnapshotComponent,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.loadSnapshots();
    }
  }

async generate(snapshotId: number) {

  const alert = await this.appserv.alertctrl.create({
    header: 'Confirmation',
    message: 'Confirmer la génération de la distribution ?',
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel'
      },
      {
        text: 'Confirmer',
        handler: () => {

          this.revenueService.generateDistribution(snapshotId).subscribe({
            next: async (res) => {
              this.loadSnapshots();
              this.appserv.presentToast(
                'Distribution générée avec succès',
                'success'
              );
            },

            error: (err) => {
              this.appserv.alertctrl.create({
                header: 'Erreur',
                message: err.error?.message || 'Erreur lors de la génération.',
                buttons: ['OK']
              }).then(a => a.present());
            }
          });

        }
      }
    ]
  });

  await alert.present();
}

  async openDetail(snapshoto: any) {
    const modal = await this.appserv.modalCtrl.create({
      component:SnapshotDetailComponent,
      componentProps:{snapshot:snapshoto}
    });
    modal.present();
    // console.log('Open detail', snapshot);
    // Tu peux ouvrir ton modal ici
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'validated':
        return 'Validée';
      case 'executed':
        return 'Exécutée';
      case 'failed':
        return 'Échouée';
      default:
        return status;
    }
  }

  statusClass(status: string): string {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'validated':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'executed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return '';
    }
  }
}
