import { Injectable } from '@angular/core';
import { AppservicesService } from './services/appservices.service';

@Injectable({ providedIn: 'root' })
export class TransactionFeeService {
  private api = this.appserv.apiUrl + '/transaction-fees';
  private http = this.appserv.http;
  constructor(private appserv: AppservicesService) {}

  getAll(params?: any) {
    return this.http.get<any>(this.api, { params });
  }

  create(data: any) {
    return this.http.post(this.api, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
