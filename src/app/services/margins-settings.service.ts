import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';
import { MarginsSettings } from '../interfaces/margins-settings';

@Injectable({
  providedIn: 'root'
})
export class MarginsSettingsService {

  constructor(public appserv: AppservicesService) { }

  list(enterprise:any):Observable<MarginsSettings[]>{
    return this.appserv.http.get<MarginsSettings[]>(this.appserv.apiUrl + '/limitsexpenditures/enterprise/'+enterprise);
  } 
  
  forspecificuser(user:any):Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl + '/limitsexpenditures/user/'+user);
  }

  new(request:any):Observable<MarginsSettings>{
    return this.appserv.http.post<MarginsSettings>(this.appserv.apiUrl + '/limitsexpenditures',request);
  } 
  
  update(request:any):Observable<MarginsSettings>{
    return this.appserv.http.put<MarginsSettings>(this.appserv.apiUrl + '/limitsexpenditures/update/'+request.id,request);
  } 
  
  delete(request:any):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl + '/limitsexpenditures/delete/'+request.id,request);
  }

  //offline methods
    getofflinedata(){
      let data :any={};
      const records = localStorage.getItem('limitexpenditures');
      if (typeof  records !=='undefined' && records !== null) {
        data=JSON.parse(records);
       }
       return data;
    }

    setofflinedata(data: any){
      localStorage.setItem('limitexpenditures',JSON.stringify(data));
    }
}