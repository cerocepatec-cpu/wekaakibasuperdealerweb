import { Component, OnInit } from '@angular/core';
import { RevenueService } from 'src/app/services/revenue.service';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { RuleFormComponent } from '../rule-form/rule-form.component';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.page.html'
})
export class RulesPage implements OnInit {

  rules: any[] = [];
  loading = false;

  constructor(
    private revenueService: RevenueService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadRules();
  }

  loadRules() {
    this.loading = true;
    this.revenueService.getRules().subscribe(res => {
      console.log("Règles chargées", res);
      this.rules = res;
      this.loading = false;
    });
  }

  async openForm(rule: any = null) {
    const modal = await this.modalCtrl.create({
      component: RuleFormComponent,
      componentProps: { rule }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) this.loadRules();
  }

  async deleteRule(rule: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: `Supprimer la règle "${rule.name}" ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          handler: () => {
            this.revenueService.deleteRule(rule.id).subscribe(() => {
              this.loadRules();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  toggle(rule: any) {
    this.revenueService.toggleRule(rule.id).subscribe(() => {
      rule.is_active = !rule.is_active;
    });
  }
}
