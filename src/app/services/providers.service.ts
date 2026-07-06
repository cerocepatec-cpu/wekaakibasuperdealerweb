import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Providers } from '../interfaces/providers';
import { AppservicesService } from './appservices.service';
import { StockHistory } from '../interfaces/stockhistory';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {

  constructor(private appserv: AppservicesService) { }

  getallproviders(enterpriseid: any):Observable<Providers[]>{
    return this.appserv.http.get<Providers[]>(this.appserv.apiUrl + '/providers/enterprise/'+enterpriseid);
  }
  addnewprovider(newprovider: any):Observable<Providers>{
    return this.appserv.http.post<Providers>(this.appserv.apiUrl +'/providers',newprovider);
  }

  updateprovider(newprovider: any,providerid: any):Observable<Providers>{
    return this.appserv.http.put<Providers>(this.appserv.apiUrl +'/providers/update/'+providerid,newprovider);
  }
  deleteoneprovider(provider: Providers):Observable<Providers>{
    return this.appserv.http.delete<Providers>(this.appserv.apiUrl + '/providers/delete/'+provider.id);
  }

  stockhistory(provider: Providers):Observable<StockHistory[]>{
    return this.appserv.http.get<StockHistory[]>(this.appserv.apiUrl + '/providers/stockhistory/'+provider.id);
  }
  
  debtstockhistory(provider: Providers):Observable<StockHistory[]>{
    return this.appserv.http.get<StockHistory[]>(this.appserv.apiUrl + '/providers/stockhistory/debt/'+provider.id);
  } 
  
  cashstockhistory(provider: Providers):Observable<StockHistory[]>{
    return this.appserv.http.get<StockHistory[]>(this.appserv.apiUrl + '/providers/stockhistory/cash/'+provider.id);
  }

  //offline methods
  saveoffline(data:any){
    let list :any[]=[];
    const records = localStorage.getItem('providers');
    if (records !== null) {
      list= JSON.parse(records);
      list.unshift(data);
      localStorage.setItem('providers',JSON.stringify(list));
    }else{
      //save to local storage
      list.push(data);
      localStorage.setItem('providers',JSON.stringify(list));
    }
  }

  getofflinelist(){
    let list :any[]=[];
    const records = localStorage.getItem('providers');
    if (records !== null) {
      list= JSON.parse(records);
     }
     return list;
  }

  updateoffline(data:any){
    let list :any[]=[];
    const records = localStorage.getItem('providers');
    if (records !== null) {
      list= JSON.parse(records);
      let newlist=list.filter(u=>u.id!=data.id);
      newlist.push(data);
      localStorage.setItem('providers',JSON.stringify(list));
    }else{
      //save to local storage
      list.push(data);
      localStorage.setItem('providers',JSON.stringify(list));
    }
  }

  getaspecificofflineprovider(providerId:number){
    return this.getofflinelist().find(p=>p.id===providerId);
  }
}
