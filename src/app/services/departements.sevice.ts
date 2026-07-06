import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(public appserv:AppservicesService) { }

  delete(id: number): Observable<any> {
    return this.appserv.http.delete<any>(`${this.appserv.apiUrl}/department/delete/${id}`);
  }

  deleteaffectation(id: number): Observable<any> {
    return this.appserv.http.delete<any>(`${this.appserv.apiUrl}/affectation/delete/${id}`);
  }

  updateaffectationapi(data:any):Observable<any>{
    return this.appserv.http.put<any>(this.appserv.apiUrl + '/affectation_users/'+data.id,data);
  }

  getaffectedusers(data:any):Observable<any>{
    return this.appserv.http.get<any>(
        `${this.appserv.apiUrl}/affectation_users`,
        { params: {departement_id: data.id } }
    ).pipe(
        catchError(error => {
        console.error('Erreur lors de la récupération des affectations:', error);
        return throwError(() => error.error?.message || 'Impossible de charger la liste des affectés');
        })
    );
  }

  usersAffectation(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/affectation_users',data);
  }

  update(data:any):Observable<any>{
    return this.appserv.http.put<any>(this.appserv.apiUrl + '/departments/update/'+data.id,data);
  } 
  
  new(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/departments',data);
  }

  listdepartments(data: any): Observable<any> {
    return this.appserv.http.get<any>(
        `${this.appserv.apiUrl}/departments`,
        { params: {enterprise_id: data.id } }
    ).pipe(
        catchError(error => {
        console.error('Erreur lors de la récupération des départements:', error);
        return throwError(() => error.error?.message || 'Impossible de charger les départements');
        })
    );
  }

  /**
   * OffLines Methods
   */
  
  getSyncingOfflineData(){
    let data :any[]=[];
    const records = localStorage.getItem('syncingDebts');
    if (records !== null) {
      data= JSON.parse(records);
     }
     return data;
   }

   resetToSyncingOffline(){
    return localStorage.removeItem('syncingDebts');
   }
   
  addToSyncingOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('syncingDebts');
    if (records !== null) {
      let datagotten= JSON.parse(records);
          datagotten.unshift(data);
          localStorage.setItem('syncingDebts',JSON.stringify(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('syncingDebts',JSON.stringify(datas));
    }
  } 
  
  addtoDebtsOffline(data:any){
    let debts :any[]=[];
    const records = localStorage.getItem('debts');
    if (records !== null) {
      let invoicesgotten= JSON.parse(records);
          invoicesgotten.unshift(data);
          localStorage.setItem('debts',JSON.stringify(invoicesgotten));
    }else{
      //save to local storage
      debts.push(data);
      localStorage.setItem('debts',JSON.stringify(debts));
    }
  }
  
  setofflinedata(data:any){
    localStorage.setItem('debts',JSON.stringify(data));
  }

  getofflineDebts(){
    let debts :any[]=[];
    const records = localStorage.getItem('debts');
    if (records !== null) {
      debts= JSON.parse(records);
     }
     return debts;
  }
}
