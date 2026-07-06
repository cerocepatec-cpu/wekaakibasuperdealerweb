import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppservicesService } from './appservices.service';
import { Role } from '../interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  actualrole: any={}
   private permissions: string[] = [];
  constructor(public appserv : AppservicesService) { }

  setPermissions(perms: string[]) {
    this.permissions = perms;
  }

  has(permission?: string | null): boolean {
    if (!permission) return true; // public
    return (
      this.permissions.includes(permission) ||
      this.permissions.includes(permission.split('.')[0] + '.all')
    );
  }
  delete(role:any):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl +'/role/delete/'+role.id);
  }

  new(data: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/role',data);
  }
  
  OwnerNewRule(data: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/role/owner',data);
  }

  edit(data: any): Observable<any>{
    return this.appserv.http.put<any>(this.appserv.apiUrl +'/role/'+data.id,data);
  }

  getall(enterprise_id: any): Observable<any[]>{
    return this.appserv.http.get<any[]>(this.appserv.apiUrl +'/role/enterprise/'+enterprise_id);
  }

  rolePermissions(role:Role):Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl +'/role/permissions/'+role.id);
  }

  ungroupedPermissionsForUser(user:number):Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl + '/permissons/ungrouped/foruser/'+user);
  }

}
