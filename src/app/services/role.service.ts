import { Injectable } from '@angular/core';
import { Role } from '../interfaces/role';
import { Observable } from 'rxjs';
import { AppservicesService } from './appservices.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(public appserv: AppservicesService) { }

  getlistRoles(enterprise:any):Observable<Role[]>{
    return this.appserv.http.get<Role[]>(this.appserv.apiUrl +"/roles/enterprise/"+enterprise);
  }
  delete(role:Role):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl +"/roles/delete/"+role.id);
  }
}
