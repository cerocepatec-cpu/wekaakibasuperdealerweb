import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';
import { PointOfSales } from '../interfaces/pos';
import { Deposits } from '../interfaces/deposit';
import { Users } from '../interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class PosService {

  constructor(private appserv: AppservicesService) { }
  getlistpos(data:any):Observable<PointOfSales[]>{
    return this.appserv.http.get<PointOfSales[]>(this.appserv.apiUrl + '/pointofsales/enterprise_id/'+data);
  }
  
  newpos(data:any):Observable<PointOfSales>{
    return this.appserv.http.post<PointOfSales>(this.appserv.apiUrl + '/pointofsales/',data);
  } 
  
  editpos(data:any):Observable<PointOfSales>{
    return this.appserv.http.patch<PointOfSales>(this.appserv.apiUrl + '/pointofsales/update/'+data.id,data);
  } 
  
  deletepos(data:any):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl + '/pointofsales/delete/'+data.id,data);
  }

  affectDeposits(data:any):Observable<Deposits[]>{
    return this.appserv.http.post<Deposits[]>(this.appserv.apiUrl + '/pointofsales/affectdeposits',data);
  }

  getlistdeposits(data:any):Observable<Deposits[]>{
    return this.appserv.http.get<Deposits[]>(this.appserv.apiUrl + '/pointofsales/deposits/'+data);
  }
   getlistagents(pos:any):Observable<Users[]>{
    return this.appserv.http.get<Users[]>(this.appserv.apiUrl + '/pointofsales/agents/'+pos);
  }

  deletedepositTopos(data:any):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl + '/pointofsales/deposits/delete/'+data);
  }

  affectUsers(data:any):Observable<Users[]>{
    return this.appserv.http.post<Users[]>(this.appserv.apiUrl + '/userspointofsale',data);
  }

    /**
   * POS USERS
   */
    newuseraffectationpos(data:any):Observable<Users>{
      return this.appserv.http.post<Users>(this.appserv.apiUrl + '/pointofsale/users',data);
    } 
    
  deleteuseraffectationpos(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/pointofsale/users/deleting',data);
  } 
}
