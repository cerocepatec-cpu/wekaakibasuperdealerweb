import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {

  constructor(private appserv: AppservicesService) {}

  getAll(params: any) {
    return this.appserv.http.get<any>(this.appserv.apiUrl+'/exchange-rates', { params });
  }

  create(data: any) {
    return this.appserv.http.post(this.appserv.apiUrl+'/exchange-rates', data);
  }

  update(id: number, data: any) {
    return this.appserv.http.put(this.appserv.apiUrl+`/exchange-rates/${id}`, data);
  }

  delete(id: number) {
    return this.appserv.http.delete(this.appserv.apiUrl+`/exchange-rates/${id}`);
  }
}
