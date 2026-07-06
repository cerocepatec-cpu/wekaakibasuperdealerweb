import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MoneyService } from 'src/app/services/money.service';
import { RevenueService } from 'src/app/services/revenue.service';

@Component({
  selector: 'app-rule-form',
  templateUrl: './rule-form.component.html'
})
export class RuleFormComponent implements OnInit {

  @Input() rule: any;

  moneys: any[] = [];
  users: any[] = [];

  form: any = {
    name: '',
    category: '',
    calculation_type: 'percentage',
    fixed_amount: null,
    percentage_rate: null,
    money_id: null,
    user_id: null,
    is_active: true
  };

  constructor(
    private moneyserv:MoneyService,
    private revenueService: RevenueService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadDependencies();

    if (this.rule) {
      this.form = { ...this.rule };
    }
  }

  async loadDependencies() {
    const moneysFromApi = await this.moneyserv.getesemoneys();
    this.moneys = moneysFromApi;
    this.revenueService.getStaffUsers().subscribe(res => this.users = res);
  }

  save() {
    const request = this.rule
      ? this.revenueService.updateRule(this.rule.id, this.form)
      : this.revenueService.createRule(this.form);

    request.subscribe(() => {
      this.modalCtrl.dismiss(true);
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
