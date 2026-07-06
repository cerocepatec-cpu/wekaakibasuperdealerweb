import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppservicesService } from './services/appservices.service';

@Injectable({
  providedIn: 'root'
})
export class AgentBonusReportService {
  constructor(public appserv: AppservicesService) {}

  getReport(filters: any) {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    return this.appserv.http.get(`${this.appserv.apiUrl}/reports/agent-bonuses`, { params });
  }

  getFiltersData() {
    return this.appserv.http.get(`${this.appserv.apiUrl}/reports/agent-bonuses/filters`);
  }
  getCollectorsDisbursement(enterpriseId: any) {
    return this.appserv.http.post(`${this.appserv.memberApiUrl}/agent-wallets/collectors-summary`, {
      enterprise_id: enterpriseId,
    });
  }

  payCollectorDisbursement(payload: any) {
    return this.appserv.http.post(`${this.appserv.memberApiUrl}/agent-wallets/pay-collector`, payload);
  }
}
