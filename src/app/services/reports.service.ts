import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(public appserv: AppservicesService) { }

  /**
   * 
   * Sell reports
   */
  sellsReport(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/invoices/newreportbyuser',request);
  } 
  
  reportfilteredbydatesoperations(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/invoices/reportfilteredbydatesoperations',request);
  }
   
  sellsReportfilteredbytva(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/invoices/reportUserSelling2filteredbytva',request);
  }
   
  sellsReportWithoutDetails(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/invoices/reportUserSellingwithoutdetails',request);
  }  
  
  sellsreportgroupedbydates(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/invoices/sellsreportgroupedbydates',request);
  }   
  
  sellsReportByArticles(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reports/invoices/reportbyarticlesbasedondateoperation',request);
  } 
  
  sellsReportDepositArticles(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reports/invoices/reportbydepositsarticlesbasedonoperation',request);
  }
  
  sellsReportByAgents(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reports/invoices/reportbyagentsbasedondateoperations',request);
  }  
  
  
  groupreportbyprices(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reports/invoices/groupreportbyprices',request);
  } 
  


  /**
   * Stock reports
   * @param request 
   * @returns 
   */
  stockReport(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/stockhistory/byuser/newreportstockhistory',request);
  }
  
  stockReportByDeposits(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/stockhistory/report/bydepositsbasedonoperationdate',request);
  }
  
  stockReportByArticles(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/stockhistory/byuser/byarticlesbasedoperation',request);
  }  
  
  reportstockgroupedbydates(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/stockhistory/report/reportstockgroupedbydates',request);
  } 
  

  /**
   * Cashbook Reports
   */
  cashbook(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reports/cashbook',request);
  }

  /**
   * Credits reports
   * @param request 
   * @returns 
   */
  credits(request:any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reports/credits',request);
  }

  creditsByCutomers(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reports/invoices/creditsByCutomersbasedondate',request);
  }   

  creditsByCutomersByStates(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reports/credits/debtsfilteredbycriteria',request);
  }

  paymentsByCutomers(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reports/invoices/paymentsbycutomersbasedondate',request);
  }  
  
  reportpaymentsbydates(request: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reports/invoices/reportpaymentsbydates',request);
  } 

}
