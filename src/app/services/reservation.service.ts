import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private appserv: AppservicesService) { }
  
  getlist(enterprise:any):Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl + '/reservations/enterprise/'+enterprise);
  } 
  getfilteredlist(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reservations/filtered',data);
  }
  
  newreservation(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reservations',data);
  } 
  
  searchreservation(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reservations/search',data);
  }  
  
  changestatus(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/reservations/changestatus',data);
  }
}
