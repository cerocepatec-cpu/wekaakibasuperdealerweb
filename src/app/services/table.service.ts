import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';
import { Tables } from '../interfaces/tables';
import { EditComponent } from '../tables/edit/edit.component';
import { Invoice } from '../interfaces/invoices';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private appserv: AppservicesService) { }

  async calledit(table: Tables){
     
    const modal = await this.appserv.modalCtrl.create({
      component:EditComponent,
      componentProps:{'tablesent':table}
    });
    modal.present();
  }

  addnew(data: any):Observable<Tables>{
    return this.appserv.http.post<Tables>(this.appserv.apiUrl + '/tables',data);
  }

  getlist(enterprise_id:any):Observable<Tables[]>{
    return this.appserv.http.get<Tables[]>(this.appserv.apiUrl + '/tables/enterprise/'+enterprise_id);
  }

  edit(data: any,id: any):Observable<Tables>{
    return this.appserv.http.put<Tables>(this.appserv.apiUrl + '/tables/update/'+id,data);
  }

  delete(id:any):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl + '/tables/delete/'+id);
  }

  reportsales(tableid: any):Observable<Invoice[]>{
    return this.appserv.http.get<Invoice[]>(this.appserv.apiUrl + '/tables/sales/'+tableid);
  }

  getservants(tableid: any):Observable<Invoice[]>{
    return this.appserv.http.get<Invoice[]>(this.appserv.apiUrl + '/tables/sales/'+tableid);
  }

  /**
   * Offline methods
   */
  addtoSyncingOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('syncingTables');
    if (records !== null) {
      let datagotten= JSON.parse(records);
          datagotten.unshift(data);
          localStorage.setItem('syncingTables',JSON.stringify(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('syncingTables',JSON.stringify(datas));
    }
  } 
  
  addtoOffline(data:any){
    let datas =this.getofflinedata();
    datas.push(data);
    this.setofflinedata(datas);
  }
  
  setofflinedata(data:any){
    try {
      localStorage.setItem('newtables',OrbitEncoder.encode(data));
      localStorage.removeItem('tables');
      return true;
    } catch (error) {
        this.appserv.presentToast("Impossible de sauvegarder les tables","warning");
        return false;
    }
  }

  getofflinedata(){

    let data :any[]=[];
    const records = localStorage.getItem('newtables');
    if (records !== null) {
      data= OrbitEncoder.decode(records);
     }

     return data;
  }

  getofftablesbykeywords(keyword:string){
    let list=this.getofflinedata();
    let response : Tables[]=[];
    response=list.filter(item=>item.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())).slice(0,10);
    return response;
  }

  /**
   * Offline Methods for removing data
   */
  removeofflinedata(){
    localStorage.removeItem('newtables');
  }
}
