import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FundService {

  constructor(private appserv: AppservicesService) { }


  getdailyoperations(data: any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/funds/requesthistories',data);
  }

  savemultiples(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl+'/funds/savemultiples',data);
  }

  getbalances(user:any):Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl + '/funds/balances/byuser/'+user);
  }

  savefundclosures(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/closures/new',data);
  }
}
