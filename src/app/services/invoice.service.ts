import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Invoice } from '../interfaces/invoices';
import { Customers } from '../interfaces/customers';
import { AppservicesService } from './appservices.service';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private appserv: AppservicesService) { }
confirmInvoiceOtp(invoiceId: number, otp: string) {
  return this.appserv.http.post(
    `${this.appserv.apiUrl}/invoices/${invoiceId}/confirm-otp`,
    { otp }
  );
}
  invoicesforenterprise(enterprise_id: any):Observable<Invoice[]>{
    return this.appserv.http.get<Invoice[]>(this.appserv.apiUrl + '/invoices/enterprise/'+enterprise_id);
  }

  invoicesdoneby(data: any ):Observable<Invoice[]>{
    return this.appserv.http.post<Invoice[]>(this.appserv.apiUrl + '/invoices/users',data);
  }

  FilteredForACustomer(object: any):Observable<Invoice[]>{
    return this.appserv.http.post<Invoice[]>(this.appserv.apiUrl + '/invoices/filteredcustomer',object);
  }
  
  FilteredCompteCourantCustomer(object: any):Observable<any[]>{
    return this.appserv.http.post<any[]>(this.appserv.apiUrl + '/debts/customer/filteredcomptecourantcustomer',object);
  }

  comptecourant(data: any):Observable<any[]>{
    return this.appserv.http.post<any[]>(this.appserv.apiUrl +'/debts/customer',data);
  }

  ordersforenterprise(enterpriseid: any):Observable<Invoice[]>{
    return this.appserv.http.get<Invoice[]>(this.appserv.apiUrl + '/orders/enterprise/'+enterpriseid);
  }

  ordersdoneby(userid: any):Observable<Invoice[]>{
    return this.appserv.http.get<Invoice[]>(this.appserv.apiUrl + '/orders/users/'+userid);
  }

  newinvoice(data: any):Observable<Invoice>{
    return this.appserv.http.post<Invoice>(this.appserv.apiUrl + '/invoices',data);
  }

  newinvoicePromis(data: any):Promise<Invoice>{
    return this.appserv.http.post<Invoice>(this.appserv.apiUrl + '/invoices',data).toPromise();
  }

  cancel(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/invoices/cancel',data);
  }

  /**
   * Offline methods
   */
  addtoOffline(data:any){
    let invoices :any[]=[];
    const records = localStorage.getItem('invoices');
    if (records !== null) {
      let invoicesgotten= JSON.parse(records);
          invoicesgotten.unshift(data);
          this.addtoSyncingOffline(data);
          localStorage.setItem('invoices',JSON.stringify(invoicesgotten));
    }else{
      //save to local storage
      invoices.push(data);
      this.addtoSyncingOffline(data);
      localStorage.setItem('invoices',JSON.stringify(invoices));
    }
  }

  getSyncingOfflineData(){
    let data :any[]=[];
    const records = localStorage.getItem('syncingInvoices');
    if (records !== null) {
      data= JSON.parse(records);
     }
     data = data.concat(this.getNewSyncingOfflineData());
     return data;
   }

   getNewSyncingOfflineData(){
    let data :any[]=[];
    const records = localStorage.getItem('newsyncingInvoices');
    if (typeof records !='undefined' && records !== null) {
      data= OrbitEncoder.decode(records);
     }
     return data;
   }

   resetToSyncingOffline(){
    return localStorage.removeItem('syncingInvoices');
   }
  //invoices kept for syncing whene the connection will be ready
  addtoSyncingOffline(data:any){
    let invoices :any[]=[];
    const records = localStorage.getItem('syncingInvoices');
    if (records !== null) {
      let invoicesgotten= JSON.parse(records);
          invoicesgotten.unshift(data);
          localStorage.setItem('syncingInvoices',JSON.stringify(invoicesgotten));
    }else{
      //save to local storage
      invoices.push(data);
      localStorage.setItem('syncingInvoices',JSON.stringify(invoices));
    }
  }

  addtoDebtsOffline(data:any){
    let invoices :any[]=[];
    const records = localStorage.getItem('debts');
    if (records !== null) {
      let invoicesgotten= JSON.parse(records);
          invoicesgotten.unshift(data);
          localStorage.setItem('debts',JSON.stringify(invoicesgotten));
    }else{
      //save to local storage
      invoices.push(data);
      localStorage.setItem('debts',JSON.stringify(invoices));
    }
  }

  setDebtsofflinedata(data:any){
    localStorage.setItem('debts',JSON.stringify(data));
  }

  setofflinedata(data:any){
    localStorage.setItem('invoices',JSON.stringify(data));
  }

  getofflineInvoices(){
    let invoices :any[]=[];
    const records = localStorage.getItem('invoices');
    if (records !== null) {
      invoices= JSON.parse(records);
     }

     return invoices;
  }

  isExceededNumber(){
    return this.getofflineInvoices().length>=100?true:false;
  }
}
