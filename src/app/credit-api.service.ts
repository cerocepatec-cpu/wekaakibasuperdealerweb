import { Injectable } from '@angular/core';
import { AppservicesService } from './services/appservices.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CreditApiService {
  constructor(private appserv: AppservicesService) {}

  list(filters: any) {
    return this.appserv.http.get(this.appserv.apiUrl + '/credits', {
      params: filters,
    });
  }

  show(id: string | null) {
    return this.appserv.http.get(this.appserv.apiUrl + `/credits/${id}`);
  }

  approve(creditId: number, payload: { approved_amount: number }) {
    return this.appserv.http.post(
      this.appserv.apiUrl + `/credits/${creditId}/approve`,
      payload
    );
  }

  activate(credit: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + `/credits/${credit}/activate`,
      credit
    );
  }
  create(data: any) {
    return this.appserv.http.post(this.appserv.apiUrl + '/credits', data);
  }

  disburse(creditId: number, payload: { fund_id: number; amount: number }) {
    return this.appserv.http.post(
      this.appserv.apiUrl + `/credits/${creditId}/disburse`,
      payload
    );
  }

  initiatePayment(payload: {
    credit_id: number;
    member_account_id: number;
    amount: number;
  }): Observable<any> {
    return this.appserv.http.post(
      `${this.appserv.apiUrl}/credit-payments`,
      payload
    );
  }

  receivePayment(
    paymentId: number,
    payload: { fund_id: number }
  ): Observable<any> {
    return this.appserv.http.post(
      `${this.appserv.apiUrl}/credit-payments/${paymentId}/receive`,
      payload
    );
  }

  confirmPayment(paymentId: number): Observable<any> {
    return this.appserv.http.post(
      `${this.appserv.apiUrl}/credit-payments/${paymentId}/confirm`,
      {}
    );
  }

  getDashboardStats() {
    return this.appserv.http.get<any>(
      `${this.appserv.apiUrl}/credits/dashboard-stats`
    );
  }
}
