import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionLimit } from '../interfaces/TransactionLimit';
import { Observable } from 'rxjs';
import { AppservicesService } from './appservices.service';

@Injectable({ providedIn: 'root' })
export class TransactionLimitService {
  private api =this.appserv.memberApiUrl + '/transaction-limits';

  constructor(private http: HttpClient,public appserv:AppservicesService) {}

  getAll(): Observable<any> {
    return this.http.get(this.api);
  }

  getOne(id: number): Observable<TransactionLimit> {
    return this.http.get<TransactionLimit>(`${this.api}/${id}`);
  }

  create(data: TransactionLimit): Observable<any> {
    return this.http.post(this.api, data);
  }

  update(id: number, data: TransactionLimit): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}