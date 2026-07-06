import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppservicesService } from './appservices.service';
import { Users } from '../interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class MarginUsersService {

  constructor(private appserv:AppservicesService) { }

  list(marginId:any):Observable<Users[]>{
    return this.appserv.http.get<Users[]>(this.appserv.apiUrl + '/limitsexpenditures/users/'+marginId);
  }

  new(user:any):Observable<Users>{
    return this.appserv.http.post<Users>(this.appserv.apiUrl + '/limitsusers',user);
  }
  delete(user:any):Observable<any>{
   return this.appserv.http.delete<any>(this.appserv.apiUrl + '/limitsusers/delete/'+user.id);
  }
}
