import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';
import { OthersEntries } from '../interfaces/otherentries';

@Injectable({
  providedIn: 'root'
})
export class OthersentriesService {

  constructor(public appserv: AppservicesService) { }

  delete(account: any):Observable<OthersEntries[]>{
    return this.appserv.http.get<OthersEntries[]>(this.appserv.apiUrl +'/otherentries/delete/'+account.id);
  }
  
  edit(account: any):Observable<OthersEntries[]>{
    return this.appserv.http.put<OthersEntries[]>(this.appserv.apiUrl +'/otherentries/update/'+account.id,account);
  }

  new(account: any):Observable<OthersEntries[]>{
    return this.appserv.http.post<OthersEntries[]>(this.appserv.apiUrl +'/otherentries',account);
  }

  getall(enterpriseid: any):Observable<OthersEntries[]>{
    return this.appserv.http.get<OthersEntries[]>(this.appserv.apiUrl +'/otherentries/enterprise/'+enterpriseid);
  } 
  
  foranaccount(account: any):Observable<OthersEntries[]>{
    return this.appserv.http.get<OthersEntries[]>(this.appserv.apiUrl +'/otherentries/account/'+account.id);
  }

  entriesdoneby(data: any):Observable<OthersEntries[]>{
    return this.appserv.http.post<OthersEntries[]>(this.appserv.apiUrl + '/otherentries/dailyreport',data);
  }

  /**
   * OffLine Methods
   */
  getSyncingOfflineData(){
    let data :any[]=[];
    const records = localStorage.getItem('syncingEntries');
    if (records !== null) {
      data= JSON.parse(records);
     }

     return data;
   }

  addToSyncingOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('syncingEntries');
    if (records !== null) {
      let datagotten= JSON.parse(records);
          datagotten.unshift(data);
          localStorage.setItem('syncingEntries',JSON.stringify(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('syncingEntries',JSON.stringify(datas));
    }
  }
  
  resetToSyncingOffline(){
    return localStorage.removeItem('syncingEntries');
  } 
  
  addToOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('entries');
    if (records !== null) {
      let datagotten= JSON.parse(records);
          datagotten.unshift(data);
          localStorage.setItem('entries',JSON.stringify(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('entries',JSON.stringify(datas));
    }
  }
  
  setOfflineData(data:any){
    localStorage.setItem('entries',JSON.stringify(data));
  }

  getOfflineData(){

    let data :any[]=[];
    const records = localStorage.getItem('entries');
    if (records !== null) {
      data= JSON.parse(records);
     }

     return data;
  }
}
