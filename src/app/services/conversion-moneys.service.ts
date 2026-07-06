import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';
import { ConversionMoney } from '../interfaces/conversionmoneys';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';

@Injectable({
  providedIn: 'root'
})
export class ConversionMoneysService {

  constructor(private appserv: AppservicesService) { }

  getListConversionsApi(enterprise: any): Observable<ConversionMoney[]> {
    return this.appserv.http.get<ConversionMoney[]>(this.appserv.apiUrl + '/money_conversion/enterprise/'+enterprise);
  }

  newConversionApi(conversion: any): Observable<ConversionMoney>{
    return this.appserv.http.post<ConversionMoney>(this.appserv.apiUrl + '/money_conversion',conversion);
  }  
  
  editConversionApi(conversion: any): Observable<ConversionMoney>{
    return this.appserv.http.post<ConversionMoney>(this.appserv.apiUrl + '/money_conversion/update',conversion);
  }

  /**
   * Offline Methods
   */
  addToSyncingOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('syncingConversions');
    if (records !== null) {
      let datagotten= JSON.parse(records);
          datagotten.unshift(data);
          localStorage.setItem('syncingConversions',JSON.stringify(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('syncingConversions',JSON.stringify(datas));
    }
  } 
  
  addToOffline(data:any){
    let datas=this.getOfflineData();
    datas.push(data);
    this.setOfflineData(datas);
  }
  
  setOfflineData(data:any){
    try {
      localStorage.setItem('newconversions',OrbitEncoder.encode(data));
      localStorage.removeItem('conversions');
    } catch (error) {
      this.appserv.presentToast("Impossible d'enregistrer les conversions","warning");
    }
  }

  getOfflineData(){

    let data :any[]=[];
    const records = localStorage.getItem('newconversions');
    if (records !== null) {
      data=OrbitEncoder.decode(records);
     }

     return data;
  }

  getoffmoneysbykeywords(keyword:string){
    let list=this.getOfflineData();
    let response : ConversionMoney[]=[];
    
    response=list.filter(item=>item.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())).slice(0,10);
    return response;
  }

  /**
   * removes old offline data
   */
  removeofflinedata(){
    localStorage.removeItem('newconversions');
  }
}
