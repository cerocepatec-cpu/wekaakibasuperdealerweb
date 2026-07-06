import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private appserv: AppservicesService) { }
  getallgroups(data: any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/groups',data);
  } 
  
  getallgroupswithmembers(data: any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/groupswithmembers',data);
  }

  new(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/groupes/new',data);
  }  
  
  update(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/groups/update/'+data.id,data);
  } 
  
  members(group:any):Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl+'/weka/groups/members/'+group.id);
  } 
  
  addmembers(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/groups/addmembers',data);
  } 
  
  removemembers(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/groups/removemembers',data);
  } 
  
  memberslevel(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/groups/memberslevel',data);
  } 
  
  memberslookup(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/weka/groups/memberslookup',data);
  }
}
