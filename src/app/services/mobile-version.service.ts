import { Injectable } from '@angular/core'
import { HttpClient, HttpEventType } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AppservicesService } from './appservices.service'

@Injectable({
  providedIn: 'root'
})
export class MobileVersionService{

  constructor(
    private appserv: AppservicesService
  ) {}

  uploadVersion(data: FormData): Observable<any> {

    return this.appserv.http.post(
      `${this.appserv.memberApiUrl}/mobile/version/upload`,
      data,
      {
        reportProgress:true,
        observe:'events'
      }
    )

  }

   listVersions(){

    return this.appserv.http.get<any>(
      `${this.appserv.memberApiUrl}/mobile/version/list`
    )

  }

  publishVersion(id:number){

    return this.appserv.http.post(
      `${this.appserv.memberApiUrl}/mobile/version/publish/${id}`,
      {}
    )

  }

}