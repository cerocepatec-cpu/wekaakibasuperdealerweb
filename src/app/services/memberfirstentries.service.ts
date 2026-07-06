import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberfirstentriesService {
  constructor(private appserv: AppservicesService) {}

  firstentrieshistories(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/firstentries',
      data
    );
  }
  downloadCommissionPayrollPdf(payload: any) {
  return this.appserv.http.post(
    this.appserv.apiUrl+'/first-entry-commission-payroll-pdf',
    payload,
    {
      responseType: 'blob',
      observe: 'response',
    }
  );
}
  payCommissionsBulk(payload: any) {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/first-entry-commission-pay-bulk',
      payload
    );
  }
  eligibleReservationTree(payload: any) {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/firstentries/first-entry-reservation-tree',
      payload
    );
  }
  assignSponsorToNoSponsor(data: any) {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/firstentries/commissions/assign-sponsor',
      data
    );
  }
  private url(path: string) {
    return `${this.appserv.apiUrl}/weka/firstentries/${path}`;
  }

  eligibleAccounts(data: any) {
    return this.appserv.http.post<any>(this.url('eligible-accounts'), data);
  }

  reserveVirtual(data: any) {
    return this.appserv.http.post<any>(this.url('reserve-virtual'), data);
  }

  pendingCommissions(data: any) {
    // return this.appserv.http.post<any>(this.url('commissions/pending'), data);
    return this.appserv.http.post<any>(
      this.url('first-entry-commissions'),
      data
    );
  }
  commissionPaymentHistory(data: any) {
    // return this.appserv.http.post<any>(this.url('commissions/pending'), data);
    return this.appserv.http.post<any>(
      this.url('first-entry-commission-payment-history'),
      data
    );
  }

  payCommission(data: any) {
    return this.appserv.http.post<any>(this.url('commissions/pay'), data);
  }
  cancelFirstEntryFlow(data: any) {
    return this.appserv.http.post<any>(this.url('cancel-flow'), data);
  }
}
