import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Fences } from '../interfaces/fences';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FenceService {

  constructor(private appserv: AppservicesService) { }

  saveticketing(data: any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/fenceticketing',data);
  }

 
  async show(fence:any): Promise<any> {
      try {
        const response = await firstValueFrom(this.showClosure(fence.id));
        return response;
      } catch (err) {
        console.log('Error', err);
        this.appserv.presentToast("Impossible de récupérer les informations de la cloture", "danger");
        return {};
      }
    }

  dataforfencing(data: any):Observable<any[]>{
    return this.appserv.http.post<any[]>(this.appserv.apiUrl +'/fences/dataforfencingbasedondate',data);
  }
  
  delete(fenceid: any):Observable<any>{
    return  this.appserv.http.delete<any>(this.appserv.apiUrl + '/fences/delete/'+fenceid);
  }

  getall(enterpriseid: any):Observable<Fences[]>{
    return this.appserv.http.get<Fences[]>(this.appserv.apiUrl+'/fences/enterprise/'+enterpriseid);
  }

  new(data:any):Observable<any>{
    return this.appserv.http.post<Fences>(this.appserv.apiUrl +'/fences',data);
  }

  getClosures(filters?: any) {
    let params = new HttpParams();
    if(filters){
      Object.keys(filters).forEach(k => {
        if(filters[k] != null) params = params.set(k, filters[k]);
      });
    }
    return this.appserv.http.get<any>(this.appserv.apiUrl+ '/closures', { params });
  }

  getDashboardStats(filters?: any) {
    let params = new HttpParams();
    if(filters){
      Object.keys(filters).forEach(k => {
        if(filters[k] != null) params = params.set(k, filters[k]);
      });
    }
    return this.appserv.http.get<any>('/closures/dashboard-stats', { params });
  }

  getKPI(filters?: any) {
    let params = new HttpParams();
    if(filters){
      Object.keys(filters).forEach(k => {
        if(filters[k] != null) params = params.set(k, filters[k]);
      });
    }
    return this.appserv.http.get('/closures/dashboard-kpi', { params });
  }

  receiveclosure(closure:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + `/closures/${closure.id}/receive`,closure);
  }
  
  showClosure(closureId:any):Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl + `/closures/show/${closureId}`);
  } 
  
  rejectClosure(closure:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + `/closures/${closure.id}/reject`,closure);
  }

  printClosure(closureId: number):Observable<Blob> {
    const url = this.appserv.apiUrl + `/closures/${closureId}/print`;
    return this.appserv.http.get(url, { responseType: 'blob' }); // blob pour PDF
  }

    printClosureTicket(closureId: number):Observable<Blob> {
    const url = this.appserv.apiUrl +`/closures/${closureId}/print-ticket`;
    return this.appserv.http.get(url, { responseType: 'blob' });
  }
}
