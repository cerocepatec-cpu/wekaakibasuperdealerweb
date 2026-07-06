import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DebtsService {

  constructor(public appserv:AppservicesService) { }

  getlisdebts(enterprise_id:any):Observable<any[]>{
    return this.appserv.http.get<any[]>(this.appserv.apiUrl +'/debts/enterprise/'+enterprise_id);
  }
  getpayments(data:any):Observable<any[]>{
    return this.appserv.http.post<any[]>(this.appserv.apiUrl + '/debts/debt/payments',data);
  }  
  
  searchingbyidoruuid(data:any):Observable<any[]>{
    return this.appserv.http.post<any[]>(this.appserv.apiUrl + '/debts/searchingbyidoruuid',data);
  }
  paydebt(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/debts/payment',data);
  }

  /**
   * OffLines Methods
   */
  
  getSyncingOfflineData(){
    let data :any[]=[];
    const records = localStorage.getItem('syncingDebts');
    if (records !== null) {
      data= JSON.parse(records);
     }
     return data;
   }

   resetToSyncingOffline(){
    return localStorage.removeItem('syncingDebts');
   }
   
  addToSyncingOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('syncingDebts');
    if (records !== null) {
      let datagotten= JSON.parse(records);
          datagotten.unshift(data);
          localStorage.setItem('syncingDebts',JSON.stringify(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('syncingDebts',JSON.stringify(datas));
    }
  } 
  
  addtoDebtsOffline(data:any){
    let debts :any[]=[];
    const records = localStorage.getItem('debts');
    if (records !== null) {
      let invoicesgotten= JSON.parse(records);
          invoicesgotten.unshift(data);
          localStorage.setItem('debts',JSON.stringify(invoicesgotten));
    }else{
      //save to local storage
      debts.push(data);
      localStorage.setItem('debts',JSON.stringify(debts));
    }
  }
  
  setofflinedata(data:any){
    localStorage.setItem('debts',JSON.stringify(data));
  }

  getofflineDebts(){
    let debts :any[]=[];
    const records = localStorage.getItem('debts');
    if (records !== null) {
      debts= JSON.parse(records);
     }
     return debts;
  }
}
