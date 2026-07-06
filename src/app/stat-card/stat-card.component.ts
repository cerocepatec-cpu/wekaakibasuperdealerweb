import { Component, OnInit,Input } from '@angular/core';
export interface CurrencyStat {
  count: number;
  amount: string;
}

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
})

export class StatCardComponent implements OnInit {
@Input() title!: string;
@Input() icon!: string;
@Input() data!: Record<string, CurrencyStat>;

  constructor() { }

  ngOnInit() {}

  get totalCount(): number {
  if (!this.data) return 0;

  return Object.values(this.data as Record<string, CurrencyStat>)
    .reduce((sum, item) => sum + Number(item.count), 0);
}


}
