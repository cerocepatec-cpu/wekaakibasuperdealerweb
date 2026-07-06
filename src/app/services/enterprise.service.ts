import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  constructor(public appserv: AppservicesService) { }

  new(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/enterprises',data);
  }
  
  update(data:any):Observable<any>{
    return this.appserv.http.put<any>(this.appserv.apiUrl + '/enterprises/update/'+data.id,data);
  }
  
  updatestatus(data:any):Observable<any>{
    return this.appserv.http.put<any>(this.appserv.apiUrl + '/enterprises/updatestatus',data);
  }
  
  delete(data:any):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl + '/enterprises/delete/'+data.id);
  }

  invoicesabonnements(enterprise:any):Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl + '/enterprises/myinvoices/'+enterprise);
  } 
  
  newinvoiceabonnement(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/enterprisesinvoices',data);
  }
}
