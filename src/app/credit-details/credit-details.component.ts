import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditApiService } from '../credit-api.service';

@Component({
  selector: 'app-credit-details',
  templateUrl: './credit-details.component.html',
  styleUrls: ['./credit-details.component.scss'],
})
export class CreditDetailsComponent implements OnInit {
  credit: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private creditApi: CreditApiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.creditApi.show(id).subscribe(res => {
        this.credit = res;
        console.log(this.credit);
        this.loading = false;
      });
    }
  }

  get progress(): number {
    if (!this.credit) return 0;

    const total = Number(this.credit.total_amount || 0);
    const paid  = Number(this.credit.total_paid_amount || 0);

    if (!total) return 0;

    return Math.min((paid / total) * 100, 100);
  }

}
