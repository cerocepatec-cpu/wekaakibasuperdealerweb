import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionFeeService } from '../transaction-fee-service.service';
import { finalize } from 'rxjs/operators';
import { MoneyService } from '../services/money.service';
import { AppservicesService } from '../services/appservices.service';

export interface TransactionFee {
  id: number;
  money_id: number;
  min_amount: number;
  max_amount: number | null;
  withdraw_percent: number;
  send_percent: number;
  money?: {
    id: number;
    abreviation: string;
  };
}

@Component({
  selector: 'app-transaction-fees',
  templateUrl: './transaction-fees.component.html',
})
export class TransactionFeesComponent implements OnInit {
  @ViewChild('searchInput') searchInput!:ElementRef;
  fees: any[] = [];
  loading = false;
  moneys: any[] = [];
   activeFiltersCount = 0;
  // Pagination
  currentPage = 1;
  lastPage = 1;
  total = 0;
  search = '';
  filters: any = {};
  // Modal state
  showModal = false;
  editing: any = null;
  showFilters = false;
  form!: FormGroup;

  constructor(
    public appserv:AppservicesService,
    private moneyserv: MoneyService,
    private feeService: TransactionFeeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFees();
    this.loadmoneys();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 200);
  }
  initForm() {
    this.form = this.fb.group({
      money_id: [null, Validators.required],
      min_amount: [0, [Validators.required, Validators.min(0)]],
      max_amount: [null],
      withdraw_percent: [0, [Validators.required, Validators.min(0)]],
      send_percent: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSearch(ev: any) {
    this.search = ev.detail.value;
    this.loadFees();
  }

onMoneyFilter(event: any) {
 
  const value = event.target.value;
  if (!value) {
    this.resetFilters();
    return;
  }
  this.filters.money_id = value || null;
  this.loadFees(1);
}

onMinFilter(event: any) {
  const value = event.target.value;
  this.filters.min_amount = value || null;
  this.loadFees(1);
}

onMaxFilter(event: any) {
  const value = event.target.value;
  this.filters.max_amount = value || null;
  this.loadFees(1);
}

resetFilters() {
  this.search = '';
  this.filters = {};
  this.loadFees(1);
}

updateActiveFiltersCount() {
  this.activeFiltersCount =
    Object.values(this.filters).filter(v => v !== null && v !== '' && v !== undefined).length;
}
  async loadmoneys() {
    this.moneys = await this.moneyserv.getesemoneys();
  }
  // 🔹 LOAD LIST
loadFees(page: number = 1) {
  this.loading = true;

  const params = {
    page,
    search: this.search,
    ...this.filters,
  };

  this.feeService
    .getAll(params)
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: (res: any) => {
        this.fees = res.data;
        this.currentPage = res.current_page;
        this.lastPage = res.last_page;
        this.total = res.total;
      },
      error: (err) => {
        console.error('Erreur chargement frais', err);
      },
    });
}

  // 🔹 OPEN CREATE
  openCreate() {
    this.editing = null;
    this.form.reset({
      min_amount: 0,
      withdraw_percent: 0,
      send_percent: 0,
    });
    this.showModal = true;
  }

  // 🔹 EDIT
  edit(fee: any) {
    this.editing = fee;
    this.form.patchValue(fee);
    this.showModal = true;
  }

  // 🔹 SAVE (CREATE / UPDATE)
  save() {
    if (this.form.invalid) return;

    const data = this.form.value;

    if (this.editing) {
      this.feeService.update(this.editing.id, data).subscribe({
        next: () => {
          this.showModal = false;
          this.loadFees(this.currentPage);
        },
         error:(err)=> {
            this.appserv.presentToast(err?.error?.message || "Erreur pendant la mise à jour des frais.","danger");
        },
      });
    } else {
      this.feeService.create(data).subscribe({
        next: () => {
          this.showModal = false;
          this.loadFees();
        },
        error:(err)=> {
            this.appserv.presentToast(err?.error?.message || "Erreur pendant l'enregistrement des frais.","danger");
        },
      });
    }
  }

  // 🔹 DELETE
  delete(id: number) {
    if (!confirm('Supprimer cette tranche ?')) return;

    this.feeService.delete(id).subscribe({
      next: () => {
        this.loadFees(this.currentPage);
      },
    });
  }

  // 🔹 PAGINATION
  changePage(page: number) {
    if (page < 1 || page > this.lastPage) return;
    this.loadFees(page);
  }
}
