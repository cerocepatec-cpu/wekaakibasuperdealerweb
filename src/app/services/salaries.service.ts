import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppservicesService } from './appservices.service';

@Injectable({
  providedIn: 'root'
})
export class SalariesService {

  constructor(private appserv:AppservicesService) { }
  new(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/salaries/new',data);
  }

  update(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/salaries/update/'+data.id,data);
  } 
  
  employeeslist(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/salaries/list',data);
  }
  
  employeespayslips(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/salaries/employeespayslips',data);
  } 
  
  newposition(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/positions/new',data);
  }  
  
  getpositionslist(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/positions/list',data);
  }

  deletesalary(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/salaries/delete',data);
  } 
  
  /**
   * Advances salaries
   */
  newadvancesalary(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/advancesalaries/new',data);
  } 
  
  deleteadvancesalary(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/advancesalaries/delete',data);
  } 
  
  updateadvancesalary(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/advancesalaries/update',data);
  }

  advancesbyagent(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/weka/advancesalaries/byagent',data);
  }
}
