import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TubsService {

  constructor(private appserv: AppservicesService) { }

  allTubs(enterprise: any): Observable<any> {
    return this.appserv.http.get<any>(this.appserv.apiUrl + '/tubs/enterprise/'+enterprise);
  }
}