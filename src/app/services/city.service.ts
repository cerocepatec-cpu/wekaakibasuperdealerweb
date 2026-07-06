import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';

// city.service.ts
@Injectable({
  providedIn: 'root',
})
export class CityService {
  private API = `${this.appserv.memberApiUrl}/cities`;
  constructor(private appserv: AppservicesService) {}

  getCities(enterprise_id: number) {
    return this.appserv.http.get(`${this.API}?enterprise_id=${enterprise_id}`);
  }

  createCity(data: any) {
    return this.appserv.http.post(this.API, data);
  }

  updateCity(id: number, data: any) {
    return this.appserv.http.put(`${this.API}/${id}`, data);
  }

  deleteCity(id: number) {
    return this.appserv.http.delete(`${this.API}/${id}`);
  }

  getProvinces() {
    return this.appserv.http.get(`/provinces`);
  }
}
