import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Money } from '../interfaces/money';
import { Observable } from 'rxjs';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoneyService {

  constructor(private appserv: AppservicesService) { }

  getlistmonnaiesapi(enterprise: any): Observable<Money[]> {
    return this.appserv.http.get<Money[]>(this.appserv.apiUrl + '/money/enterprise/'+enterprise);
  }

  newmonyeapi(money: any): Observable<Money>{
    return this.appserv.http.post<Money>(this.appserv.apiUrl + '/money',money);
  }

   async getesemoneys(): Promise<any[]> {
    try {
      const response = await firstValueFrom(this.getlistmonnaiesapi(this.appserv.getactualEse().id));
      return response;
    } catch (err) {
      console.log('Error', err);
      this.appserv.presentToast("Impossible de récupérer les monnaies de l'entreprise.", "danger");
      return [];
    }
  }

  /**
   * Offline Methods
   */
  addToSyncingOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('syncingMoneys');
    if (records !== null) {
      let datagotten= JSON.parse(records);
          datagotten.unshift(data);
          localStorage.setItem('syncingMoneys',JSON.stringify(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('syncingMoneys',JSON.stringify(datas));
    }
  } 
  
  addToOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('moneys');
    if (records !== null) {
      let datagotten=OrbitEncoder.decode(records);
          datagotten.unshift(data);
          localStorage.setItem('moneys',OrbitEncoder.encode(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('moneys',OrbitEncoder.encode(datas));
    }
  }
  
  setOfflineData(data:any){
    try {
      localStorage.setItem('newmoneys',OrbitEncoder.encode(data));
      localStorage.removeItem('moneys');
    } catch (error) {
      this.appserv.presentToast("Impossible d'enregistrer les monnaies","warning");
    }
  }

  getOfflineData(){

    let data :any[]=[];
    const records = localStorage.getItem('newmoneys');
    if (records !== null) {
      data= OrbitEncoder.decode(records);
     }

     return data;
  }

  getoffmoneysbykeywords(keyword:string){
    let list=this.getOfflineData();
    let response : Money[]=[];
    
      response=list.filter(item=>item.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())).slice(0,10);
    return response;
  }

  /**
   * remove old offline data
   */
  removeoldofflinedata(){
    localStorage.removeItem('newmoneys');
  }
}
