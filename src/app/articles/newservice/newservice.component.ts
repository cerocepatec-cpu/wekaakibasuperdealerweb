import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppservicesService } from '../../services/appservices.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { MoneyService } from 'src/app/services/money.service';
import { Money } from 'src/app/interfaces/money';
import { Users } from '../../interfaces/users';
import { NewunitofmeasureComponent } from '../newunitofmeasure/newunitofmeasure.component';
import { NewcategoryComponent } from '../newcategory/newcategory.component';
import { CategoriesArticle } from 'src/app/interfaces/cagoriesarticles';
import { UnitofMeasure } from 'src/app/interfaces/unitofmeasure';
import { forkJoin } from 'rxjs';
import { SelectmoneyComponent } from 'src/app/selectmoney/selectmoney.component';

@Component({
  selector: 'app-newservice',
  templateUrl: './newservice.component.html',
  styleUrls: ['./newservice.component.scss'],
})
export class NewserviceComponent implements OnInit {
  @Input() listcategories: CategoriesArticle[] = [];
  @Input() listunitofmeasure: UnitofMeasure[] = [];
  @ViewChild('defaultinput') defaultinput: ElementRef;
  @Input() data: any = null;

  actualuser: Users = {};
  listmoney: Money[] = [];
  actualmoney: Money = {};

  isEditMode = false;
  initialFormValue: any;

  deletedPricingStack: any[] = [];
  showUndo = false;
  undoTimeout: any;

  showcreatingprogress = false;

  newserviceform = this.formbuild.group({
    id: [],
    name: ['', Validators.required],
    description: [],
    category_id: [],
    uom_id: [],
    type: [1],
    has_vat: [],
    bonus_applicable: [],
    limits: this.formbuild.array([]),
    expiration_period: [],
    nbr_operations: [],
    enterprise_id: [0],
    user_id: [0],
    pricing: this.formbuild.array([]),
  });

  constructor(
    private formbuild: FormBuilder,
    private appserv: AppservicesService,
    private articleserv: ArticlesService,
    private moneyserv: MoneyService
  ) {}

  ngOnInit() {
    this.actualuser = this.appserv.getactualuser();

    this.gettingmoneys().then(() => {
      // 🔥 attendre monnaies

      if (this.data && this.data.service?.id) {
        this.isEditMode = true;

        this.patchService(this.data.service, this.data.prices);
        this.patchLimits(this.data.limits);
      } else {
        this.addPricingRow();
        this.addLimitRow();
      }

      setTimeout(() => {
        this.initialFormValue = this.newserviceform.value;
      });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.defaultinput.nativeElement.focus();
    }, 300);
  }

  get limits() {
    return this.newserviceform.get('limits') as FormArray;
  }
  createLimitGroup(data?: any) {
    return this.formbuild.group({
      id: [data?.id || null],
      money_id: [data?.money_id || this.actualmoney?.id],
      money_abreviation: [
        data?.money_abreviation || this.actualmoney?.abreviation,
      ],
      min_amount: [data?.min_amount || null],
      max_amount: [data?.max_amount || null],
    });
  }

  addLimitRow() {
    const usedIds = this.limits.value.map((l) => l.money_id);

    const available = this.listmoney.find((m) => !usedIds.includes(m.id));

    if (!available) {
      this.appserv.presentToast(
        'Toutes les monnaies sont déjà utilisées',
        'warning'
      );
      return;
    }

    this.limits.push(
      this.createLimitGroup({
        money_id: available.id,
        money_abreviation: available.abreviation,
      })
    );
  }

  async changemoney(index: number) {
    const modal = await this.appserv.modalCtrl.create({
      component: SelectmoneyComponent,
      componentProps: { listmoney: this.listmoney },
      initialBreakpoint: 0.3,
      breakpoints: [0, 0.25, 0.3, 0.5, 0.75],
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'selected') {
      // 🔥 vérifier doublon monnaie
      const alreadyUsed = this.limits.controls.some((ctrl, i) => {
        return i !== index && ctrl.value.money_id === data.id;
      });

      if (alreadyUsed) {
        this.appserv.presentToast(
          'Cette monnaie est déjà utilisée pour ce service',
          'warning'
        );
        return;
      }

      // 🔥 update ligne ciblée
      this.limits.at(index).patchValue({
        money_id: data.id,
        money_abreviation: data.abreviation,
      });
    }
  }

  patchLimits(limits: any[]) {
    // 🔥 sécurité si pas de données
    if (!limits || !limits.length) {
      this.limits.clear();
      this.addLimitRow();
      return;
    }

    // 🔥 reset avant injection
    this.limits.clear();

    limits.forEach((l) => {
      this.limits.push(
        this.createLimitGroup({
          id: l.id,
          money_id: l.money_id,
          money_abreviation: l.money_abreviation,
          min_amount: l.min_amount,
          max_amount: l.max_amount,
        })
      );
    });
  }

  toggleInfinite(index: number) {
    const ctrl = this.limits.at(index);

    const current = ctrl.value.max_amount;

    if (current === null || current === '') {
      // 🔥 remettre valeur par défaut
      ctrl.patchValue({ max_amount: 0 });
    } else {
      // 🔥 infini
      ctrl.patchValue({ max_amount: null });
    }
  }

  removeLimit(index: number) {
    this.limits.removeAt(index);
  }

  syncLimits(serviceId: number, limits: any[]) {
    const calls = limits.map((l) => {
      const payload = {
        ...l,
        service_id: serviceId,
      };

      return this.articleserv.saveServiceLimit(payload); // updateOrCreate côté backend
    });

    return forkJoin(calls);
  }

  get pricing() {
    return this.newserviceform.get('pricing') as FormArray;
  }
  async newunitofmeasure() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewunitofmeasureComponent,
      componentProps: { listunitofmeasures: this.listunitofmeasure },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'added') {
      this.listunitofmeasure.unshift(data);
    }
  }
  async newcategory() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewcategoryComponent,
      componentProps: { listcategories: this.listcategories },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'added') {
      this.listcategories.unshift(data);
      this.newserviceform.patchValue({
        category_id: data.category.id,
      });
    }
  }

  createPricingGroup(data?: any) {
    return this.formbuild.group({
      id: [data?.id || ''],
      label: [data?.label || '', Validators.required],
      price: [data?.price || '', Validators.required],
      concerns: [data?.concerns || ''],
      money_id: [data?.money_id || this.actualmoney?.id],
      abreviation: [data?.abreviation || this.actualmoney?.abreviation],
      principal: [data?.principal || 0],
    });
  }

  addPricingRow() {
    this.pricing.push(this.createPricingGroup());
  }

  removePricing(index: number) {
    const removed = this.pricing.at(index).value;

    this.deletedPricingStack.push({ data: removed, index });
    this.pricing.removeAt(index);

    this.showUndo = true;

    clearTimeout(this.undoTimeout);
    this.undoTimeout = setTimeout(() => {
      this.showUndo = false;
      this.deletedPricingStack = [];
    }, 5000);
  }

  undoDelete() {
    const last = this.deletedPricingStack.pop();

    if (last) {
      this.pricing.insert(last.index, this.createPricingGroup(last.data));
    }

    if (this.deletedPricingStack.length === 0) {
      this.showUndo = false;
    }
  }

  setPrincipal(index: number) {
    this.pricing.controls.forEach((ctrl, i) => {
      ctrl.patchValue({ principal: i === index ? 1 : 0 });
    });
  }

  updatePrice(p: any) {
    const pricing = p.value;
    console.log(pricing);
    this.showcreatingprogress = true;
    if (pricing.id) {
      this.articleserv.editpricecagoryapi(pricing.id, pricing).subscribe(
        (data) => {
          this.showcreatingprogress = false;
          console.log(data);
        },
        (error) => {
          this.showcreatingprogress = false;
          console.log(error);
          this.appserv.presentToast(error.error, 'danger');
        }
      );
    } else {
      pricing.service_id = this.data.service.id;
      pricing.enterprise_id = this.actualuser.id;
      this.appserv.newpricecategory(pricing).subscribe(
        (datafromapi) => {
          this.showcreatingprogress = false;
          console.log(datafromapi);
        },
        (error) => {
          this.showcreatingprogress = false;
          console.log(error);
          this.appserv.presentToast(
            `Impossible d'enregistrer le prix`,
            'danger'
          );
        }
      );
    }
  }

  patchService(service: any, prices: any[]) {
    this.newserviceform.patchValue({
      id: service.id,
      name: service.name,
      description: service.description,
      category_id: service.category_id,
      uom_id: service.uom_id,
      type: service.type,
      has_vat: service.has_vat,
      bonus_applicable: service.bonus_applicable,
      expiration_period: service.expiration_period,
      nbr_operations: service.nbr_operations,
    });

    // 🔥 PRICES
    if (prices && prices.length) {
      prices.forEach((p: any) => {
        this.pricing.push(
          this.createPricingGroup({
            id: p.id,
            label: p.label,
            price: p.price,
            money_id: p.money_id,
            abreviation: p.abreviation,
            principal: p.principal,
            concerns: p.concerns,
          })
        );
      });
    } else {
      this.addPricingRow();
    }
  }

  isFormDirty(): boolean {
    return (
      JSON.stringify(this.initialFormValue) !==
      JSON.stringify(this.newserviceform.value)
    );
  }

  async closemodal() {
    if (this.isFormDirty()) {
      const alert = await this.appserv.alertctrl.create({
        header: 'Quitter ?',
        message: 'Modifications non enregistrées',
        buttons: [
          { text: 'Annuler', role: 'cancel' },
          {
            text: 'Quitter',
            handler: () => this.appserv.modalCtrl.dismiss(),
          },
        ],
      });
      await alert.present();
    } else {
      this.appserv.modalCtrl.dismiss();
    }
  }

  saveService() {
    this.showcreatingprogress = true;

    const payload = {
      ...this.newserviceform.value,
      enterprise_id: this.actualuser.enterprise_id,
      user_id: this.actualuser.id,
    };

    const limitsPayload = this.limits.value;
    if (this.isEditMode) {
      this.articleserv.editarticleapi(payload).subscribe({
        next: (res) => {
          this.appserv.mergeWithPreservedOrigin(this.data, res);
          this.appserv.presentToast('Modifié', 'success');
          this.appserv.modalCtrl.dismiss();
        },
        error: (err) => {
          this.appserv.presentToast(
            'Erreur survenue. Impossible de mettre à jour le service!',
            'danger'
          );
        },
      });
    } else {
      this.articleserv.addnewserviceapi(payload).subscribe(() => {
        this.appserv.presentToast('Ajouté', 'success');
        this.syncLimits(payload.id, limitsPayload).subscribe(() => {
          this.showcreatingprogress = false;
          this.appserv.presentToast('Service enregistré', 'success');
        });
        this.appserv.modalCtrl.dismiss();
      });
    }
  }

  trackByIndex(index: number) {
    return index;
  }

  gettingmoneys(): Promise<void> {
    return new Promise((resolve) => {
      this.moneyserv
        .getlistmonnaiesapi(this.actualuser.enterprise_id)
        .subscribe((data) => {
          this.listmoney = data;
          this.actualmoney = data.find((m) => m.principal === 1);
          resolve();
        });
    });
  }
}
