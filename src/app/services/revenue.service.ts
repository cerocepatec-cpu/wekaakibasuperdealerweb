import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppservicesService } from './appservices.service';

@Injectable({
  providedIn: 'root',
})
export class RevenueService {
  constructor(private appserv: AppservicesService) {}

  // ===============================
  // SNAPSHOTS
  // ===============================
  getSnapshotsByYear(year: number): Observable<any[]> {
    return this.appserv.http.get<any[]>(
      `${this.appserv.apiUrl}/revenue/snapshots`,
      { params: { year: year.toString() } }
    );
  }

  getSnapshots(): Observable<any> {
    return this.appserv.http.get<any>(
      `${this.appserv.apiUrl}/revenue/snapshots`
    );
  }

  createSnapshot(month: number, year: number): Observable<any> {
    return this.appserv.http.post(`${this.appserv.apiUrl}/revenue/snapshots`, {
      month,
      year,
    });
  }

  generateDistribution(snapshotId: number): Observable<any> {
    return this.appserv.http.post(
      `${this.appserv.apiUrl}/revenue/snapshots/${snapshotId}/generate`,
      {}
    );
  }

  previewSnapshot(month: number, year: number) {
    return this.appserv.http.get<any[]>(
      `${this.appserv.apiUrl}/revenue/snapshots/preview`,
      { params: { month, year } }
    );
  }

  // ===============================
  // DISTRIBUTION LINES
  // ===============================

  getSnapshotLines(snapshotId: number): Observable<any> {
    return this.appserv.http.get<any>(
      `${this.appserv.apiUrl}/revenue/snapshots/${snapshotId}/lines`
    );
  }

payDistributionLine(
  lineId: number,
  payerFundId?: number | null,
  reserveFundId?: number | null
): Observable<any> {

  const payload: any = {};

  if (payerFundId) {
    payload.payer_fund_id = payerFundId;
  }

  if (reserveFundId) {
    payload.reserve_fund_id = reserveFundId;
  }

  return this.appserv.http.post(
    `${this.appserv.apiUrl}/revenue/distribution-lines/${lineId}/pay`,
    payload
  );
}


  /**
   * RULES
   */
  getRules() {
    return this.appserv.http.get<any[]>(`${this.appserv.apiUrl}/revenue/rules`);
  }

  createRule(data: any) {
    return this.appserv.http.post(`${this.appserv.apiUrl}/revenue/rules`, data);
  }

  updateRule(ruleId: number, data: any) {
    return this.appserv.http.put(
      `${this.appserv.apiUrl}/revenue/rules/${ruleId}`,
      data
    );
  }

  deleteRule(ruleId: number) {
    return this.appserv.http.delete(
      `${this.appserv.apiUrl}/revenue/rules/${ruleId}`
    );
  }

  toggleRule(ruleId: number) {
    return this.appserv.http.patch(
      `${this.appserv.apiUrl}/revenue/rules/${ruleId}/toggle`,
      {}
    );
  }

  getStaffUsers() {
    return this.appserv.http.get<any[]>(
      `${this.appserv.apiUrl}/revenue/staff-users`
    );
  }

  getSnapshotDetail(snapshotId: number) {
    return this.appserv.http.get<any>(
      `${this.appserv.apiUrl}/revenue/snapshots/${snapshotId}`
    );
  }

  payLine(lineId: number) {
    return this.appserv.http.post(
      `${this.appserv.apiUrl}/revenue/lines/${lineId}/pay`,
      {}
    );
  }
}
