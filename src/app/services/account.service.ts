import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Accounts } from '../interfaces/accounts';
import { AppservicesService } from './appservices.service';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(public appserv : AppservicesService) { }

  delete(account:any):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl +'/accounts/delete/'+account.id);
  }
  
  new(data: any): Observable<Accounts>{
    return this.appserv.http.post<Accounts>(this.appserv.apiUrl +'/accounts',data);
  } 
  
  importation(data: any): Observable<Accounts>{
    return this.appserv.http.post<Accounts>(this.appserv.apiUrl +'/accounts/importation',data);
  }
  
  edit(data: any): Observable<Accounts>{
    return this.appserv.http.put<Accounts>(this.appserv.apiUrl +'/accounts/update/'+data.id,data);
  } 
  
  getall(enterprise_id: any): Observable<Accounts[]>{
    return this.appserv.http.get<Accounts[]>(this.appserv.apiUrl +'/accounts/enterprise/'+enterprise_id);
  }

  /**
   * Offline Methods
   */
  addToSyncingOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('syncingAccounts');
    if (records !== null) {
      let datagotten= JSON.parse(records);
          datagotten.unshift(data);
          localStorage.setItem('syncingAccounts',JSON.stringify(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('syncingAccounts',JSON.stringify(datas));
    }
  } 
  
  addToOffline(data:any){
    let datas=this.getOfflineData();
    datas.push(data);
    this.setOfflineData(datas);
  }
  
  setOfflineData(data:any){
    try {
      localStorage.setItem('newaccounts',OrbitEncoder.encode(data));
      localStorage.removeItem('accounts');
    } catch (error) {
      this.appserv.presentToast("Erreur d'ajout compte","warning");
    }
  }

  getOfflineData(){

    let data :any[]=[];
    const records = localStorage.getItem('newaccounts');
    if (records !== null) {
      data= OrbitEncoder.decode(records);
     }

     return data;
  }

  getoffaccountsbykeywords(keyword:string){
    let list=this.getOfflineData();
    let response : Accounts[]=[];
 
    response=list.filter(item=>item.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())).slice(0,10);
    return response;
  }

  /**
   * removes offline data
   */
  removesofflinedata(){
    localStorage.removeItem('newaccounts');
  }
}
