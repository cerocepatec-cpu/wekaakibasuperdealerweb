import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Users } from '../interfaces/users';
import { Observable } from 'rxjs';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private appserv: AppservicesService) {}
  /**
   *
   * Weka AKIBA
   */

  resetpin(data: any): Observable<any> {
    return this.appserv.http.put(`${this.appserv.apiUrl}/resetpin`, data);
  }

 resetpassword(data: any): Observable<any> {
    return this.appserv.http.put(`${this.appserv.apiUrl}/users/admin/resetpassword`, data);
  }

  updateUser(data: any): Observable<any> {
    return this.appserv.http.put(
      `${this.appserv.apiUrl}/user/update-sensitive-info`,
      data
    );
  }

  changeaccess(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/users/changeaccess/',
      data
    );
  }

  financedashboard(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/financedashboard/' + data.id,
      data
    );
  }
  memberstosuperdealer(data: any): Observable<any> {
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/users/membertosuperdealer', data);
  }

  getlistusersbytypes(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/usersbytypes/enterprise',
      data
    );
  }

  membersactivation(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/members-validation',
      data
    );
  }

  getdisableduserslist(enterpriseid: any): Observable<Users[]> {
    return this.appserv.http.get<Users[]>(
      this.appserv.apiUrl +
        '/weka/members-to-validated/enterprise/' +
        enterpriseid
    );
  }

  new(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/members/newmember',
      data
    );
  }

  importmembers(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/import/members',
      data
    );
  }

  memberslookup(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/members/lookup',
      data
    );
  }  
  
  collectorsAndSuperDealersLookup(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/members/virtualsales',
      data
    );
  }

  memberslookupfornotebooksale(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/members/lookupfornotebooksale',
      data
    );
  }

  lookupmembersnotsponsorised(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/membersnotsponsored/lookup',
      data
    );
  }

  delete(user: any): Observable<any> {
    return this.appserv.http.delete<any>(
      this.appserv.apiUrl + '/users/delete/' + user.id
    );
  }

  getlistusers(enterpriseid: any): Observable<any> {
    return this.appserv.http.get<any>(
      this.appserv.apiUrl + '/weka/users/enterprise/' + enterpriseid
    );
  }

  affectedusers(): Observable<any> {
    return this.appserv.http.get<any>(
      this.appserv.apiUrl + '/weka/affectedusers'
    );
  }

  membersnotsponsorised(data: any): Observable<Users[]> {
    return this.appserv.http.post<Users[]>(
      this.appserv.apiUrl + '/weka/membersnotsponsorised/enterprise',
      data
    );
  }

  getRoleAndPermissions(roleId: any): Observable<any> {
    return this.appserv.http.get<any>(
      this.appserv.apiUrl + '/role/specificroleuser/' + roleId
    );
  }

  edithagentapi(data: any): Observable<any> {
    return this.appserv.http.put<any>(
      this.appserv.apiUrl + '/weka/members/update/' + data.id,
      data
    );
  }

  updatecollectionpercentage(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/weka/member/updatecollectionpercentage',
      data
    );
  }

  membertocollectors(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/users/membertocollectors',
      data
    );
  }

  edithagentstatus(data: any): Observable<Users> {
    return this.appserv.http.post<Users>(
      this.appserv.apiUrl + '/users/updatestatus',
      data
    );
  }

  setAsSuperAdmin(data: any): Observable<Users> {
    return this.appserv.http.post<Users>(
      this.appserv.apiUrl + '/users/makeassuperadmin',
      data
    );
  }

  edithagentpassword(data: any): Observable<Users> {
    return this.appserv.http.post<Users>(
      this.appserv.apiUrl + '/users/updatepassword',
      data
    );
  }

  dashboard(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/users/dashboard/' + data.user_id,
      data
    );
  }

  deleteAgentTopos(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/pointofsales/user/delete',
      data
    );
  }

  getuserbyid(data: any): Observable<any> {
    return this.appserv.http.get<any>(
      this.appserv.apiUrl + '/users/getbyid/' + data
    );
  }

  search(keyword: string) {
    return this.appserv.http.get<any>(this.appserv.apiUrl + '/searchingusers', {
      params: {
        keyword: keyword,
      },
    });
  }

  /**
   *
   * Offline methods
   */
  saveoffline(data: any) {
    let list = this.getofflinelist();
    //save to local storage
    list.push(data);
    this.setOfflineData(list);
  }

  setOfflineData(data: any) {
    try {
      localStorage.setItem('users', OrbitEncoder.encode(data));
      localStorage.removeItem('users');
    } catch (error) {
      this.appserv.presentToast(
        "Impossible d'enregistrer les users en offline",
        'warning'
      );
    }
  }

  getofflinelist() {
    let list: any[] = [];
    const records = localStorage.getItem('users');
    if (typeof records !== 'undefined' && records !== null) {
      list = OrbitEncoder.decode(records);
      let olds :any = localStorage.getItem('users');
      if (typeof olds !== 'undefined' && records !== null) {
        list = list.concat(JSON.parse(olds));
      }
    }
    return list;
  }
}
