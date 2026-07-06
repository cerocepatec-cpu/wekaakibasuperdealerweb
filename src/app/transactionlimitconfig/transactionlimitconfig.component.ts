import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { TransactionLimitService } from '../services/TransactionLimitService';

@Component({
  selector: 'app-transactionlimitconfig',
  templateUrl: './transactionlimitconfig.component.html',
  styleUrls: ['./transactionlimitconfig.component.scss'],
})
export class TransactionlimitconfigComponent implements OnInit {

  
form!: FormGroup;
  limits: any[] = [];
  loading = false;
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: TransactionLimitService
  ) {}

  ngOnInit(): void {
    this.initForm();
    setTimeout(() => {
      // this.loadLimits();
    }, 200);
  }

  initForm() {
    this.form = this.fb.group({
      enterprise_id: [1, Validators.required],
      money_id: [1, Validators.required],
      transaction_type: ['entry', Validators.required],
      scope: ['national', Validators.required],
      min_amount: [0, Validators.required],
      max_amount: [0, Validators.required],
      daily_limit: [null],
      monthly_limit: [null],
      kyc_level_required: ['basic', Validators.required],
      is_active: [true],
      is_for_collector: [false],
    });
  }

  loadLimits() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (res: any) => {
        console.log("on loading limits",res);
        this.limits = res.data || res;
        this.loading = false;
      },
      error: (err) =>{console.log("Erreur on loading",err); this.loading = false;} 
    });
  }

  submit() {
    if (this.form.invalid) return;

    const action = this.editingId
      ? this.service.update(this.editingId, this.form.value)
      : this.service.create(this.form.value);

    action.subscribe(() => {
      this.resetForm();
      this.loadLimits();
    });
  }

  edit(item: any) {
    this.editingId = item.id;
    this.form.patchValue(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  delete(id: number) {
    if (!confirm('Supprimer cette limite ?')) return;

    this.service.delete(id).subscribe(() => this.loadLimits());
  }

  resetForm() {
    this.editingId = null;
    this.form.reset({
      enterprise_id: 1,
      money_id: 1,
      transaction_type: 'entry',
      scope: 'national',
      is_active: true,
      is_for_collector: false,
      kyc_level_required: 'basic'
    });
  }

}
