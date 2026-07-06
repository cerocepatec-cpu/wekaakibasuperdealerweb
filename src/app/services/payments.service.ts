import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor() { }



  /**
   * Offline methods
   */

  getSyncingOfflineData(){
    let data :any[]=[];
    const records = localStorage.getItem('syncingPayments');
    if (records !== null) {
      data= JSON.parse(records);
     }
     return data;
   }

   resetToSyncingOffline(){
    return localStorage.removeItem('syncingPayments')
   }

  addToSyncingOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('syncingPayments');
    if (records !== null) {
      let datagotten= JSON.parse(records);
          datagotten.unshift(data);
          localStorage.setItem('syncingPayments',JSON.stringify(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('syncingPayments',JSON.stringify(datas));
    }
  } 
}
