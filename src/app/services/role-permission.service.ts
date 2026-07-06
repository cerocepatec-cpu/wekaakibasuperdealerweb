import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppservicesService } from './appservices.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {

  constructor(private appserv: AppservicesService) {}

  getRoles(): Observable<any> {
    return this.appserv.http.get<any>(`${this.appserv.apiUrl}/roles`);
  }

  getPermissions(): Observable<any> {
    return this.appserv.http.get(`${this.appserv.apiUrl}/permissions`);
  }

  getUsers(): Observable<any> {
    return this.appserv.http.get(`${this.appserv.apiUrl}/users`);
  }

  assignRoleToUser(data:any): Observable<any> {
    return this.appserv.http.post(`${this.appserv.apiUrl}/user/assign-role`,data);
  }

  assignPermissions(data:any): Observable<any> {
    return this.appserv.http.post(`${this.appserv.apiUrl}/give-permission`,data);
  }

  getGroupedPermissions(): Observable<any> {
    return this.appserv.http.get<any>(`${this.appserv.apiUrl}/permissions/grouped`);
  }

  newrole(data:any):Observable<any>{
    return this.appserv.http.post<any>(`${this.appserv.apiUrl}/roles/new`,data);
  }

  addPermissionToRole(data:any):Observable<any>{
    return this.appserv.http.post<any>(`${this.appserv.apiUrl}/roles/new`,data);
  }

  removePermissionFromRole(data):Observable<any>{
    return this.appserv.http.delete<any>(`${this.appserv.apiUrl}/roles/new`,data);
  }

  removeRoleFromUsers(roleId: number, userIds: number[]) {
    const payload = { role_id: roleId, user_ids: userIds };
    return this.appserv.http.post(`${this.appserv.apiUrl}/roles/remove-from-users`, payload);
  }

  toggleRolePermission(roleId: number, permissions: string[], assign: boolean) {
   const url =this.appserv.apiUrl+`/roles/${roleId}/permissions/toggle`;
    return this.appserv.http.post(url, { permissions, assign });
  }
  
   getUsersByRole(roleId: number, page: number = 1, perPage: number =20): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('per_page', perPage);

    return this.appserv.http.get(`${this.appserv.apiUrl}/roles/${roleId}/users`, { params });
  } 
  
  getPermissionUsers(params: { module?: string, permissions?: string[], per_page?: number }) {
    let httpParams = new HttpParams();

    if (params.module) {
      httpParams = httpParams.set('module', params.module);
    }
    if (params.permissions && params.permissions.length > 0) {
      params.permissions.forEach(p => {
        httpParams = httpParams.append('permissions[]', p); // important : permissions[]
      });
    }
    if (params.per_page) {
      httpParams = httpParams.set('per_page', params.per_page.toString());
    }

    return this.appserv.http.get(`${this.appserv.apiUrl}/permissions/users`, { params: httpParams });
  }

  removeUsersFromPermission(data: {
    user_ids: number[];
    module?: string | null;
    permissions?: string[] | null;
  }) {
    return this.appserv.http.post(`${this.appserv.apiUrl}/permissions/users/remove`, data);
  }
  
  getpermissionforuser(data:any):Observable<any>{
    return this.appserv.http.get<any>(`${this.appserv.apiUrl}/permissons/foruser/${data}`);
  }
}
