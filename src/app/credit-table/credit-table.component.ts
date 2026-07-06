import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-credit-table',
  templateUrl: './credit-table.component.html',
  styleUrls: ['./credit-table.component.scss'],
})
export class CreditTableComponent {

  
  @Input() credits: any[] = [];

  @Output() approve = new EventEmitter<any>();
  @Output() disburse = new EventEmitter<any>();
  @Output() pay = new EventEmitter<any>();
  @Output() activate = new EventEmitter<any>();

  statusClass(status: string) {
    return {
      'bg-yellow-100 text-yellow-800': status === 'pending',
      'bg-blue-100 text-blue-800': status === 'approved',
      'bg-green-100 text-green-800': status === 'active',
      'bg-red-100 text-red-800': status === 'late',
      'bg-gray-200 text-gray-700': status === 'completed',
    };
  }

  
}
