import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { MoneyService } from 'src/app/services/money.service';

@Component({
  selector: 'app-exchange-rate-form',
  templateUrl: './exchange-rate-form.component.html',
})
export class ExchangeRateFormComponent implements OnInit {
  @Input() rate: any | null = null;
  @Input() enterpriseId!: number;
  inverseRate: number | null = null;
  fromLabel: string | null = null;
  toLabel: string | null = null;

  form!: FormGroup;
  submitting = false;
  moneys: any[] = [];

  constructor(
    private moneyserv: MoneyService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private service: ExchangeRateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMoneys();

    if (this.rate) {
      this.patchForm();
    }
  }

  initForm() {
    this.form = this.fb.group({
      from_money_id: [null, Validators.required],
      to_money_id: [null, Validators.required],
      rate: [null, [Validators.required, Validators.min(0.00000001)]],
      valid_from: [new Date().toISOString(), Validators.required],
      valid_until: [null],
    });

    this.form.valueChanges.subscribe((value) => {
      this.computeInverseRate();
    });
  }

  patchForm() {
    this.form.patchValue({
      from_money_id: this.rate.from_money_id,
      to_money_id: this.rate.to_money_id,
      rate: this.rate.rate,
      valid_from: this.rate.valid_from,
      valid_until: this.rate.valid_until,
    });
  }

  async loadMoneys() {
    this.moneys = await this.moneyserv.getesemoneys();
  }

  async submit() {
    if (this.form.invalid) {
      this.presentToast('Formulaire invalide', 'warning');
      return;
    }

    if (this.submitting) return;

    this.submitting = true;

    const payload = {
      ...this.form.value,
      enterprise_id: this.enterpriseId,
    };

    const request = this.rate
      ? this.service.update(this.rate.id, payload)
      : this.service.create(payload);

    request.subscribe({
      next: async (res) => {
        console.log("Success ....",res);
        this.submitting = false;
        await this.presentToast('Taux enregistré', 'success');
        this.modalCtrl.dismiss(true);
      },
      error: async (err) => {
        console.log("Error lors ....",err);
        this.submitting = false;
        const message =
          err?.error?.message ?? 'Erreur lors de l’enregistrement';
        await this.presentToast(message, 'danger');
      },
    });
  }

  close() {
    if (this.submitting) return;
    this.modalCtrl.dismiss();
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'top',
    });
    await toast.present();
  }

  computeInverseRate() {
    const rate = parseFloat(this.form.get('rate')?.value);
    const fromId = this.form.get('from_money_id')?.value;
    const toId = this.form.get('to_money_id')?.value;

    if (!rate || rate <= 0 || !fromId || !toId) {
      this.inverseRate = null;
      return;
    }

    const fromMoney = this.moneys.find((m) => m.id == fromId);
    const toMoney = this.moneys.find((m) => m.id == toId);

    if (!fromMoney || !toMoney) return;

    this.fromLabel = fromMoney.abreviation;
    this.toLabel = toMoney.abreviation;

    this.inverseRate = 1 / rate;
  }
}
