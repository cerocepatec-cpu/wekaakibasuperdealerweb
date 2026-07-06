import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';
import { TransfertStock } from '../interfaces/transfertstock';

@Injectable({
  providedIn: 'root'
})
export class TransfertService {

  constructor(private appserv:AppservicesService) {}

  validatetransfert (data:any):Observable<TransfertStock>{
    return this.appserv.http.post<TransfertStock>(this.appserv.apiUrl + '/transfertstock/validation',data);
  }
  
  canceltransfert (data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/transfertstock/cancel',data);
  }

  new(data: any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/transfertstock',data);
  } 
  
  forauser(data: any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/transfertstock/forauser',data);
  }

  getall():Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl + '/transfertstock/enterprise/'+this.appserv.getactualEse().id);
  }

  changestatus(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/transfertstock/status',data);
  }
}
