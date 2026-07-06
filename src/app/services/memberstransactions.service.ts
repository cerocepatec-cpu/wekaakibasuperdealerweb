import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MemberstransactionsService {

  constructor(public appserv: AppservicesService) { }

  validateimputation(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/weka/transactions/validateimputation',data);
  }
  
  transactionshistories(data: any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/weka/transactions',data);
  } 
  
  transactionsHistoriesExcelExport(data: any): Observable<Blob> {
    return this.appserv.http.post(this.appserv.apiUrl + '/weka/transactions/excelexport',data,{ responseType: 'blob' });
  }
  
  transactionsHistoriesPdfExport(data: any): Observable<Blob> {
    return this.appserv.http.post(this.appserv.apiUrl + '/weka/transactions/pdfexport',data,{ responseType: 'blob' });
  }

  transactionshistoriespaginated(data: any): Observable<any> 
  {
      let params = new HttpParams()
        .set('user_id', data.user_id)
        .set('page', data.page);

      if (data.from) {
        params = params.set('from', data.from);
      }

      if (data.to) {
        params = params.set('to', data.to);
      }

      if (data.perPage) {
        params = params.set('per_page', data.perPage.toString());
      }

      if (data.members && Array.isArray(data.members)) {
        data.members.forEach(member => {
          params = params.append('members[]', member); 
        });
      }

      if (data.cashiers && Array.isArray(data.cashiers)) {
        data.cashiers.forEach(cashier => {
          params = params.append('cashiers[]', cashier);
        });
      }
      return this.appserv.http.get<any>(this.appserv.apiUrl + '/weka/transactionspaginated', { params });
    }

  
  transactionstatuschange(data: any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/weka/transactions/update',data);
  } 
  
  updatetransaction(transactionId:number, data: any):Observable<any>{
    return this.appserv.http.put<any>(this.appserv.apiUrl + '/weka/transactions/'+transactionId,data);
  }

   fillTransactionForm(form: FormGroup, data: any): FormGroup 
   {
    form.patchValue({
      id:data.id?? 0,
      amount: data.amount ?? 0,
      sold_before: data.sold_before ?? null,
      sold_after: data.sold_after ?? null,
      type: data.type ?? 'deposit',
      motif: data.motif ?? '',
      user_id: data.user_id ?? 0,
      member_account_id: data.member_account_id ?? 0,
      enterprise_id: data.enterprise_id ?? 0,
      done_at: data.done_at ?? null,
      transaction_status: data.transaction_status ?? '',
      operation_done_by: data.operation_done_by ?? '',
      account_id: data.account_id ?? null,
      phone: data.phone ?? '',
      adresse: data.adresse ?? ''
    });

    return form;
  }

    mergeTransactionData(originTransaction: any, givenTransaction: any): any {
      return {
        ...originTransaction,
        ...givenTransaction
      };
    }

  replaceObjectContent<T>(origin: T, given: Partial<T>): T {
    for (const key in origin) {
      if (Object.prototype.hasOwnProperty.call(origin, key)) {
        origin[key] = given[key] !== undefined ? given[key]! : origin[key];
      }
    }
    return origin;
  }

}
