import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MembersaccountsService {

  constructor(private appserv: AppservicesService) { }

  transfertshistory(data: any): Observable<any>{
    let params = new HttpParams()
      .set('enterprise', data.enterprise)
      .set('user_id', data.user_id)
      .set('page', data.page)
      .set('account', data.account);

    if (data.from) {
      params = params.set('from', data.from);
    }

    if (data.to) {
      params = params.set('to', data.to);
    }

    if (data.perPage) {
      params = params.set('per_page', data.perPage.toString());
    }

    if (data.transaction_status) {
      params = params.set('transfert_status', data.transaction_status);
    }

    if (data.source_currency_id) {
      params = params.set('source_currency_id', data.source_currency_id);
    }
    
      return this.appserv.http.get<any>(this.appserv.apiUrl + '/weka/account/transferts/history', { params });
  }

  newtransfert(data: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/weka/transactions/new',data);
  }

  membersaccounts(member: any): Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl +'/weka/allaccounts/'+member);
  } 
  
  accountTransactions(data: any): Observable<any>{
    let params = new HttpParams()
            .set('user_id', data.user_id)
            .set('page', data.page)
            .set('account',data.account);
    
          if (data.from) {
            params = params.set('from', data.from);
          }
    
          if (data.to) {
            params = params.set('to', data.to);
          }
    
          if (data.perPage) {
            params = params.set('per_page', data.perPage.toString());
          }

          if (data.transaction_status) {
            params = params.set('transaction_status', data.transaction_status);
          }
    
      return this.appserv.http.get<any>(this.appserv.apiUrl + '/weka/account/transactions', { params });
  } 

  searchaccountsbyenterprise(data: any): Observable<any>{
    let params = new HttpParams()
            .set('user_id', data.user_id)
            .set('keyword', data.keyword)
            .set('limit',data.limit);
    
      return this.appserv.http.get<any>(this.appserv.apiUrl + '/weka/searchaccountsbyenterprise', { params });
  }  
  
  membernewtransaction(data: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/weka/transactions/new',data);
  } 
  
  membernewfirstentry(data: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/weka/firstentries/new',data);
  }
  
  newaccount(data: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/weka/newaccount',data);
  }
  
  updateaccount(data: any): Observable<any>{
    return this.appserv.http.put<any>(this.appserv.apiUrl +'/weka/membersaccount/update/'+data.id,data);
  }
  
  updatefirstentry(data: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/weka/firstentries/update',data);
  } 
  
  deletefirstentry(data: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/weka/firstentries/delete',data);
  }  
  
  getsponsorised(data: any): Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl +'/weka/sponsorisedbymember/'+data);
  } 
  
  createsponsoring(data: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/weka/createsponsoring',data);
  }
   
  removesponsoring(data: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/weka/removesponsoring',data);
  } 

  async getmemberaccounts(memberId: any): Promise<any> {
    try {
      const response = await firstValueFrom(this.membersaccounts(memberId));
      return response;
    } catch (err) {
      console.log('Error', err);
      this.appserv.presentToast("Impossible de récupérer les comptes du membre", "danger");
      return [];
    }
  } 
}
