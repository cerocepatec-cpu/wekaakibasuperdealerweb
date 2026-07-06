import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expenditures } from '../interfaces/expenditures';
import { AppservicesService } from './appservices.service';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';

@Injectable({
  providedIn: 'root'
})
export class ExpendituresService {

  
  constructor(public appserv: AppservicesService) { }

  filterbyaccount(data: any):Observable<Expenditures[]>{
    return this.appserv.http.post<Expenditures[]>(this.appserv.apiUrl + '/expenditures/byaccount',data);
  }

  addew(data: any):Observable<Expenditures[]>{
    return this.appserv.http.post<Expenditures[]>(this.appserv.apiUrl + '/expenditures',data);
  } 
  
  expendituresdoneby(data: any):Observable<Expenditures[]>{
    return this.appserv.http.post<Expenditures[]>(this.appserv.apiUrl + '/expenditures/doneby',data);
  } 
  
  delete(data: any):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl + '/expenditures/delete/'+data.id);
  }

  validateSelected(payload: any) {
  return this.appserv.http.post(`${this.appserv.apiUrl}/expenditures/validate-selected`, payload);
}

validateAllPending(payload: any) {
  return this.appserv.http.post(`${this.appserv.apiUrl}/expenditures/validate-all-pending`, payload);
}
  /**
   * Offline Methods
   */
  getSyncingOfflineData(){
    let data :any[]=[];
    const records = localStorage.getItem('syncingExpenditures');

    if (typeof records !=='undefined' && records !== null) {
      data= JSON.parse(records);
     }

     return data;
   }

   setOfflineSycingData(data:any){
    try {
      localStorage.setItem('syncingExpenditures',JSON.stringify(data));
    } catch (error) {
      this.appserv.presentToast("Une erreur est survenue lors la sauvegarde des dépenses en local. Erreur:"+error,"warning");
    }
  }

   resetToSyncingOffline(){
    return localStorage.removeItem('syncingExpenditures');
   }

  addToSyncingOffline(data:any){
    let datas =this.getSyncingOfflineData();
    console.log('offline expenditures',datas);
    if (datas) {
        datas.unshift(data);
        this.setOfflineSycingData(datas);
    }
  } 
  
  addToOffline(data:any){
    
    let datagotten=this.getOfflineData();
   
    if (typeof datagotten !=='undefined' && datagotten !== null) {
        datagotten.unshift(data);
         this.setOfflineData(datagotten);
    }else{
      this.appserv.presentToast("Une erreur est survenue lors la sauvegarde de la dépense","warning");
    }
  }
  
  setOfflineData(data:any){
    try {
      localStorage.setItem('expenditures',OrbitEncoder.encode(data));
    } catch (error) {
      this.appserv.presentToast("Une erreur est survenue lors la sauvegarde des dépenses en local. Erreur:"+error,"warning");
    }
  }
  
  getOfflineData(){

    let data :any[]=[];
    const records = localStorage.getItem('expenditures');
    if (records !== null) {
      try {
        data= OrbitEncoder.decode(records);
      } catch (error) {
        this.setOfflineData(OrbitEncoder.encode(records));
        setTimeout(() => {
          this.getOfflineData();
        }, 2000);
      }
      
     }

     return data;
  }
}
