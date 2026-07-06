import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Owners } from '../interfaces/owner';
import { AppservicesService } from './appservices.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor(public appserv: AppservicesService) { }

  new(data:any):Observable<Owners>{
    return this.appserv.http.post<Owners>(this.appserv.apiUrl + '/owners',data);
  }
  
  update(data:any):Observable<Owners>{
    return this.appserv.http.put<Owners>(this.appserv.apiUrl + '/owners/update/'+data.id,data);
  }
  
  delete(data:any):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl + '/owners/delete/'+data.id);
  }
}
