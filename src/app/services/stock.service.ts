import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StockHistory } from '../interfaces/stockhistory';
import { AppservicesService } from './appservices.service';
import { ArticlesService } from './articles.service';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';
import { DepositsService } from './deposits.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(public appserv: AppservicesService, private articleServ: ArticlesService,private depositserv:DepositsService) { }
    
    //STOCK HISTORY
    reportstockmultiplearticles(data:any):Observable<any[]>{
      return this.appserv.http.post<any[]>(this.appserv.apiUrl +'/stockhistory/multipleservices',data);
    } 
    
    multiplestores(data:any):Observable<any[]>{
      return this.appserv.http.post<any[]>(this.appserv.apiUrl +'/stockhistory/multiplestore',data);
    }

    newstock(data:any):Observable<StockHistory>{
      return this.appserv.http.post<StockHistory>(this.appserv.apiUrl + '/stockhistory',data);
    }
  
    stockhistoryforaservice(idservice: number): Observable<StockHistory[]>{
      return this.appserv.http.get<StockHistory[]>(this.appserv.apiUrl + '/stockhistory/serviceid/'+idservice);
    } 
    
    stockhistoryforuser(data: any): Observable<StockHistory[]>{
      return this.appserv.http.post<StockHistory[]>(this.appserv.apiUrl + `/stockhistory/byuser`,data);
    }  
    
    stockhistoryforuserbasedondateoperation(data: any): Observable<any>{
      return this.appserv.http.post<any>(this.appserv.apiUrl + `/stockhistory/byuser/getbyuserbasedondateoperation`,data);
    }

    reportstockgroupedbydates(data: any): Observable<any>{
      return this.appserv.http.post<any>(this.appserv.apiUrl + `/stockhistory/report/reportstockgroupedbydates`,data);
    }

   /**
    * 
    * Offline methods
    */
   getSyncingOfflineData(){
    let data :any[]=[];
    const records = localStorage.getItem('syncingStockHistories');
    if (records !== null) {
      data= JSON.parse(records);
     } 
     return data;
   }

   resetToSyncingOffline(){
    return localStorage.removeItem('syncingStockHistories');
   }
   
   addToSyncingOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('syncingStockHistories');
    if (records !== null) {
      let datagotten= JSON.parse(records);
          datagotten.unshift(data);
          localStorage.setItem('syncingStockHistories',JSON.stringify(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('syncingStockHistories',JSON.stringify(datas));
    }
  } 

    saveoffline(data:any){
      let list :any[]=[];
      const records = localStorage.getItem('stockhistories');
      if (records !== null) {
        list= JSON.parse(records);
        list.unshift(data);
        localStorage.setItem('stockhistories',JSON.stringify(list));
      }else{
        //save to local storage
        list.push(data);
        localStorage.setItem('stockhistories',JSON.stringify(list));
      }
    }
  
    setOfflineData(data:any){
      localStorage.setItem('stockhistories',JSON.stringify(data));
    }

    getofflinelist(){
      let list :any[]=[];
      const records = localStorage.getItem('stockhistories');
      if (records !== null) {
        list= JSON.parse(records);
       }
       return list;
    }

    updatingOfflineArticleQuantity(stock:any,depositId:number){

      let depositArticles=this.articleServ.getlisdepositarticles();
      let actualdeposit=depositArticles.filter(d=>d.deposit.id===depositId)[0];
      let newservices=[];
  
      let serviceFunded=actualdeposit.services.filter(s=>s.service.id===stock.service_id)[0];
      if(stock.type=='entry'){
          serviceFunded.service.available_qte=serviceFunded.service.available_qte+stock.quantity;
      }else{
        serviceFunded.service.available_qte=serviceFunded.service.available_qte-stock.quantity;
      }

      let servicesFiltered=actualdeposit.services.filter(s=>s.service.id!=stock.service_id);
      newservices=servicesFiltered;
      newservices.push(serviceFunded);
  
      actualdeposit.services=newservices;
      //removing the deposit in localStorage data
      let FilteredPositArticles=depositArticles.filter(d=>d.deposit.id!=depositId);
      FilteredPositArticles.push(actualdeposit);
      this.articleServ.setdepositarticlesOffline(FilteredPositArticles);
    }

    /**
     * New offline Stock histories methods and variables
     */

      //set new offline data
      newsetOfflineData(data:any){
        //test if there is old data
        const olddata = this.getofflinelist();
        if (olddata.length>0) {
          data=data.concat(olddata);
          localStorage.removeItem('stockhistories');
        }
        localStorage.setItem('newstockhistories',OrbitEncoder.encode(data));
      }

      //getting new offline data
      newgetofflinelist(){
        let list :any[]=[];
        const records = localStorage.getItem('newstockhistories');
        if (typeof records !=='undefined' && records !== null) {
          list= OrbitEncoder.decode(records);
          //test if there is old data
          const olddata = this.getofflinelist();
            if (olddata.length>0) {
              list=list.concat(olddata);
            }
            localStorage.removeItem('stockhistories');
        }
        return list;
      }

    //addnew line
    newsaveoffline(data:any){
      const saved=this.depositserv.depositlinebydepositandservice(data,data.depot_id);
      // if (saved && data.original.service.type==="1") {
      //   this.addToSyncingOffline(data);
      //   //creating a new stock history
      //   data.sync_status=0;        
      //   let list = this.newgetofflinelist();
      //   list=list.concat(data);
      //   this.newsetOfflineData(list);

      //   if (data.type==="entry") {
      //     this.appserv.presentToast(data.original.service.name + " approvisionné avec succès","success");
      //   }
          
      // if (data.type==="withdraw") {
      //   // this.appserv.presentToast(data.original.service.name + " destoqué avec succès","success");
      //  }
      // }   
    }

     /**
     * New offline stock histories syncing methods and variables
     */

     //get offline data
     newgetSyncingOfflineData(){
      let data=this.newgetofflinelist().filter(l=>l.sync_status===0);
      const olddata = this.getSyncingOfflineData();
      if (olddata.length>0) {
          data=data.concat(olddata);
          //deleting old data
          localStorage.removeItem('syncingStockHistories');
      }
       return data;
     }
  
     //reset oflline syncing data
     newresetToSyncingOffline(){
      return localStorage.removeItem(this.appserv.setbytesToBase64('new_syncingStockHistories'));
     }
     
     newsetofflineSyncingData(data:any){
      try {
        localStorage.setItem(this.appserv.setbytesToBase64('new_syncingStockHistories'),OrbitEncoder.encode(data));
        //deleting old data
        localStorage.removeItem('syncingStockHistories');
      } catch (error) {
        this.appserv.presentToast("Impossible d'enregistrer l'historique du stock","warning");
      }
      
     }

     newaddToSyncingOffline(data:any){
      let datas=this.newgetSyncingOfflineData();
      datas.unshift(data);
      this.newsetofflineSyncingData(datas);
    } 

}
