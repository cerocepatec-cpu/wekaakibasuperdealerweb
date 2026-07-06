import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestTransfertService {

  constructor(private appserv:AppservicesService) {}

  new(data: any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/requestapprovments',data);
  }

  getall():Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl + '/requestapprovments/enterprise/'+this.appserv.getactualEse().id);
  }
}
