import { EditservantComponent } from './../servants/editservant/editservant.component';
import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';
import { Servant } from '../interfaces/servants';
import { Invoice } from '../interfaces/invoices';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';

@Injectable({
  providedIn: 'root'
})
export class ServantsService {

  constructor(private appserv: AppservicesService) { }

  getall(enterpriseid:any):Observable<Servant[]>{
    return this.appserv.http.get<Servant[]>(this.appserv.apiUrl + '/servants/enterprise/'+enterpriseid);
  }
 getsales(servantid: any):Observable<Invoice[]>{
  return this.appserv.http.get<Invoice[]>(this.appserv.apiUrl + '/servants/sales/'+servantid);
 }
  addnew(data: any):Observable<Servant>{
    return this.appserv.http.post<Servant>(this.appserv.apiUrl + '/servants',data);
  }

  edit(data:any):Observable<Servant>{
    return this.appserv.http.put<Servant>(this.appserv.apiUrl + '/servants/update/'+data.id,data);
  }

  deleteoneservant(servant:any):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl + "/servants/delete/"+servant.id);
  }

  async editservant(servant: Servant){
    const modal = await this.appserv.modalCtrl.create({
      component:EditservantComponent,
      componentProps:{'servantsent':servant},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

   /**
   * Offline methods
   */
   addtoSyncingOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('syncingServants');
    if (records !== null) {
      let datagotten= JSON.parse(records);
          datagotten.unshift(data);
          localStorage.setItem('syncingServants',JSON.stringify(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('syncingServants',JSON.stringify(datas));
    }
  } 
  
  addtoOffline(data:any){
    let datas =this.getofflinedata();
    datas.push(data);
    this.setofflinedata(datas);
  }
  
  setofflinedata(data:any){
    try {
      localStorage.setItem('newservants',OrbitEncoder.encode(data));
      localStorage.removeItem('servants');
    } catch (error) {
      this.appserv.presentToast("Erreur d'ajout du serveur en local","warning");
    }
    
  }

  getofflinedata(){
    let data :any[]=[];
    const records = localStorage.getItem('newservants');
    if (records !== null) {
      data=OrbitEncoder.decode(records);
     }
     return data;
  }

  getoffservantsbykeywords(keyword:string){
    let list=this.getofflinedata();
    let response : Servant[]=[];
      response=list.filter(item=>item.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())).slice(0,10);
    return response;
  }

  /**
   * removes old offline data
   */
  removeofflinedata(){
    localStorage.removeItem('newservants');
  }
}
