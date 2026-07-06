import { Component, OnInit } from '@angular/core';
import { CreditApiService } from '../credit-api.service';
import { UsersService } from '../services/users.service';
import { MoneyService } from '../services/money.service';

@Component({
  selector: 'app-credit-create',
  templateUrl: './credit-create.component.html',
  styleUrls: ['./credit-create.component.scss'],
})
export class CreditCreateComponent implements OnInit {
  members: any[] = [];
  moneys:any[]=[];
  selectedMember: any;

  loading = false;
  error = '';

  form: any = {
    user_id: null,

    principal_amount_requested: '',
    interest_rate: '',
    duration_days: '',

    installment_type: 'daily',
    grace_period_days: 0,

    note: '',
    money_id: 2, // 👉 idéalement injecté depuis le contexte
  };

  constructor(
    private moneyserv:MoneyService,
    private creditApi: CreditApiService,
    private userServ: UsersService
  ) {}

  async ngOnInit() {
    this.moneys = await this.moneyserv.getesemoneys();
  }

  submit() {
    if (!this.form.user_id) {
      this.error = 'Veuillez sélectionner un membre';
      return;
    }

    this.error = '';
    this.loading = true;

    this.creditApi.create(this.form).subscribe({
      next: () => {
        this.loading = false;
        // navigation ou reset possible
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.message ?? 'Erreur lors de la création du crédit';
      },
    });
  }

  onSearchMember(query: string) {
    this.userServ.search(query).subscribe((res) => {
      this.members = res.data ?? [];
    });
  }

  selectMember(member: any) {
    this.selectedMember = member;
    this.form.user_id = member.id;
  }
}
