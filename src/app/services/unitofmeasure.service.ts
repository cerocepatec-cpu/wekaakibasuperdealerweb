import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';
import { UnitofMeasure } from '../interfaces/unitofmeasure';

@Injectable({
  providedIn: 'root'
})
export class UnitofmeasureService {

  constructor(public appserv:AppservicesService) { }

  getallunitofmeasure(enterprise_id: any): Observable<UnitofMeasure[]>{
    return this.appserv.http.get<UnitofMeasure[]>(this.appserv.apiUrl +'/unitofmeasures/enterprise/'+ enterprise_id);
  }

  addnewuomapi(data:any): Observable<UnitofMeasure>{
    return this.appserv.http.post<UnitofMeasure>(this.appserv.apiUrl +'/unitofmeasures',data);
  }

  updateuom(data:any,id: any):Observable<UnitofMeasure>{
    return this.appserv.http.patch<UnitofMeasure>(this.appserv.apiUrl + '/unitofmeasures/update/'+id,data);
  }

  //offline methods
  saveoffline(data:any){
    let list :any[]=[];
    const records = localStorage.getItem('unitofmeasures');
    if (records !== null) {
      list= JSON.parse(records);
      list.unshift(data);
      localStorage.setItem('unitofmeasures',JSON.stringify(list));
    }else{
      //save to local storage
      list.push(data);
      localStorage.setItem('unitofmeasures',JSON.stringify(list));
    }
  }

  getofflinelist(){
    let list :any[]=[];
    const records = localStorage.getItem('unitofmeasures');
    if (records !== null) {
      list= JSON.parse(records);
     }
     return list;
  }

  updateoffline(data:any){
    let list :any[]=[];
    const records = localStorage.getItem('unitofmeasures');
    if (records !== null) {
      list= JSON.parse(records);
      let newlist=list.filter(u=>u.id!=data.id);
      newlist.push(data);
      localStorage.setItem('unitofmeasures',JSON.stringify(list));
    }else{
      //save to local storage
      list.push(data);
      localStorage.setItem('unitofmeasures',JSON.stringify(list));
    }
  }
}
