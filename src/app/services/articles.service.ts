import { Injectable } from '@angular/core';
import { Articles } from '../interfaces/articles';
import { AppservicesService } from './appservices.service';
import { Observable, observable } from 'rxjs';
import { PricesCategories } from '../interfaces/pricescategories';
import { PrintgeneraldetailsComponent } from '../articles/printgeneraldetails/printgeneraldetails.component';
import { ReportsalesComponent } from '../articles/reportsales/reportsales.component';
import { articlePaginator } from '../interfaces/articlespaginator';
import {OrbitEncoder} from 'orbit-encoder/lib/OrbitEncoder';
import { DepositsService } from './deposits.service';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private appserv: AppservicesService, private depositserv: DepositsService) { }

  reportsales(article: Articles){
    const modal = this.appserv.modalCtrl.create({
      component:ReportsalesComponent,
      componentProps:{'servicesent':article}
    });

    return modal;
  }

  enterpriseservices(enterprise_id: any): Observable<Articles[]>{
    return this.appserv.http.get<Articles[]>(this.appserv.apiUrl +'/services/enterprise/'+enterprise_id);
  }  
  
   removepricingfromapi(price: any): Observable<any> {
    return this.appserv.http.delete<any>(
      this.appserv.apiUrl + '/pricescategories/delete/' + price
    );
  }
  enterprise_sub_services(enterprise_id: any): Observable<Articles[]>{
    return this.appserv.http.get<Articles[]>(this.appserv.apiUrl +'/services/enterprise/subservices/'+enterprise_id);
  } 
  
  enterpriseservicespaginated(enterprise_id: any): Observable<articlePaginator>{
    return this.appserv.http.get<articlePaginator>(this.appserv.apiUrl +'/services/search/enterprise/'+enterprise_id);
  } 
  
  searchbyword(data: any): Observable<Articles[]>{
    return this.appserv.http.post<Articles[]>(this.appserv.apiUrl +'/services/searchbyword/enterprise',data);
  } 
  
  searchbycodebar(data: any): Observable<Articles[]>{
    return this.appserv.http.post<Articles[]>(this.appserv.apiUrl +'/services/searchbycodebar/enterprise',data);
  }
  
  serviceslist(data: any): Observable<any[]>{
    return this.appserv.http.post<any[]>(this.appserv.apiUrl +'/services/list',data);
  } 
  
  paginatedserviceslist(data: any): Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl +'/services/list/'+data);
  }

  addnewserviceapi(data:any): Observable<Articles>{
    return this.appserv.http.post<Articles>(this.appserv.apiUrl +'/services',data);
  }

  importation(data:any):Observable<Articles[]>{
    return this.appserv.http.post<Articles[]>(this.appserv.apiUrl +'/services/importation',data);
  }

  editarticleapi(article: any): Observable<any>{
    return this.appserv.http.put<any>(this.appserv.apiUrl +'/services/update/'+article.id,article);
  }

  deleteonearticle(article: Articles): Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl +'/services/delete/'+article.id);
  }
  
  editpricecagoryapi(pricingid: any,pricing: any): Observable<PricesCategories>{
    return this.appserv.http.patch<PricesCategories>(this.appserv.apiUrl + '/pricescategories/update/'+pricingid,pricing);
  }

  myarticles(userid: any):Observable<Articles[]>{
    return this.appserv.http.get<Articles[]>(this.appserv.apiUrl + '/services/myarticles/'+userid);
  } 
  
  depositarticles(deposit: any):Observable<Articles[]>{
    return this.appserv.http.get<Articles[]>(this.appserv.apiUrl + '/services/depositarticles/'+deposit);
  }

  getallservices(depositid: any): Observable<Articles[]>{
    return this.appserv.http.get<Articles[]>(this.appserv.apiUrl +'/services/depositall/'+depositid);
  } 
  
  deleteallservices(data: any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl +'/services/enterprise/deleteall',data);
  }

  servicesavailability(data:any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/services/availablesunavailablesservices',data);
  } 
  
  servicestoseller(userid:any):Observable<Articles[]>{
    return this.appserv.http.get<Articles[]>(this.appserv.apiUrl + '/servicestosell/'+userid);
  }
   async generaldetail(article: Articles){
    const modal = this.appserv.modalCtrl.create({
      component:PrintgeneraldetailsComponent,
      componentProps:{'article':article}
    });
    (await modal).present();
  }

  getprices(serviceid: any):Observable<PricesCategories[]>{
    return this.appserv.http.get<PricesCategories[]>(this.appserv.apiUrl + '/pricescategories/service/'+serviceid);
  }

  updateallproducts(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/services/updateAll',data);
  }

  saveServiceLimit(data:any){}


  //OFFLINE METHODS
  
  /**
   * liste articles
   */
      //paginated articles

      //list of articles without pagination
            addmultipleToOffllineArticles(data:any){
              let listarticles = this.getOfflineData();
              listarticles=listarticles.concat(data);
              this.setOfflineData(listarticles);
            }

          savearticleoffline(data:any){
            let listarticles=this.getOfflineData();
            listarticles.unshift(data);
            this.setOfflineData(listarticles);
          }

          updateOffline(data:any){
            const list = this.getOfflineData();
            const index = list.indexOf(data,0);
            if (index!==-1) {
              list[data.index]=data;
              this.setOfflineData(list);
            }else{
              this.appserv.presentToast("Article introuvable dans la base.","warning");
            }   
          }

          setOfflineData(data:any){
            try {
                localStorage.setItem('newarticles',OrbitEncoder.encode(data));
                localStorage.removeItem('articles');
                return true;
            } catch (error) {
                this.appserv.presentToast("Impossible de sauvegarder l'article","warning");
                return false;
            }
          }

          getOfflineData(){
            let data :Articles[]=[];
              const records = localStorage.getItem('newarticles');
              if (records !== null) {
                data= OrbitEncoder.decode(records);
              }
            return data;
          }

      //List articles paginated
      setpaginatedofflinearticles(data:any){
          try {
            localStorage.setItem('paginatedarticles',OrbitEncoder.encode(data));
            return true;
          } catch (error) {
              this.appserv.presentToast("Impossible de sauvegarder l'article","warning");
              return false;
          }
      }

      getpaginatedofflinearticles(){
          let data :any[]=[];
          const records = localStorage.getItem('paginatedarticles');
          if (records !== null) {
            data= OrbitEncoder.decode(records);
          }
        return data;
      }

      savearticlepaginatedoffline(data:any){
        let listarticles =this.getpaginatedofflinearticles();
        listarticles.push(data);
        this.setpaginatedofflinearticles(listarticles);
        this.addmultipleToOffllineArticles(data.data)
      }

      getofflinearticlespaginatedbypage(pagenumber: number =1){
        let listarticles = this.getpaginatedofflinearticles();
        let response : articlePaginator={
          current_page:0,
          data: [],
          first_page_url:'',
          from:0,
          last_page:0,
          last_page_url:'',
          links: [],
          next_page_url:'',
          path:'',
          per_page:0,
          prev_page_url:'',
          to:0,
          total:0
        };
        const lookup =listarticles.find((l)=>l.current_page==pagenumber);
        if (lookup) {
          response=listarticles.find((l)=>l.current_page==pagenumber); 
        }
         
         return response;
      }

  
/**
 * 
 * End list articles
 */


/**
 * 
 * Deposit articles
 */
   
    setdepositarticlesOffline(data:any){
      try {
        localStorage.setItem('newdepositArticles',OrbitEncoder.encode(data));
        localStorage.removeItem('depositArticles');
        return true;
      } catch (error) {
          this.appserv.presentToast("Impossible de sauvegarder les articles du dépôt","warning");
          return false;
      }
    }

    getlisdepositarticles(){

      let listarticles=[];
      const records = localStorage.getItem('newdepositArticles');
      if (records !== null) {
        listarticles =OrbitEncoder.decode(records);
      }
  
      return listarticles;
    }

    //paginated
    savedepositarticlespaginatedoffline(data: any){

      let listdeposits=this.getlisdepositarticles();

      if (listdeposits.length>0) {
          try{
            //looking for the actual deposit
            const actualdeposit = listdeposits.find(d=>d.deposit.id===data.deposit.id);
            if (actualdeposit) {
              //getting the products and adding new products sent
              actualdeposit.services=actualdeposit.services.concat(data.services);
              listdeposits= listdeposits.find(d=>d.deposit.id!==data.deposit.id);
              this.setdepositarticlesOffline(listdeposits);
            }else{
              //setting new entry
              listdeposits.push(data);
              this.setdepositarticlesOffline(listdeposits);
            }
        }catch(err){
          this.appserv.presentToast("Une erreur est survenue lors de la sauvegarde des produits des dépôts en local."+ " " + err,"warning");
        }
         
      }else{
        //if not exists set the item
        try{
          this.setdepositarticlesOffline(listdeposits);
          this.savedepositarticlespaginatedoffline(data);
        }catch(err){
          this.appserv.presentToast("Une erreur est survenue lors de la sauvegarde des produits des dépôts en local."+ " " + err,"warning");
        }
      }
    }

    
    updateServiceOffLine(data:any){
      //update catalogue list
      let list =this.getOfflineData();
      const  index=list.findIndex(s=>s.service.id===data.service.id);
      if (index!==-1) {
          // console.log('index finded',index,'data',data);
          list[index]=data;
          console.log('index finded',index,'data',list[index]);
          this.setOfflineData(list);
      }else{
        // console.log('index not finded',index);
      }
     
      

      //update in depositArticles
      // let depositList=this.getlisdepositarticles();
      // let newDepositList=[];
      // depositList.forEach(deposit => {
      //       let servicesFiltered=deposit.services.filter(s=>s.service.id!=data.service.id);
      //       let serviceFunded=deposit.services.filter(s=>s.service.id===data.service.id);
      //       if(serviceFunded.length>0){
      //         const qty=serviceFunded[0].service.available_qte;
      //         serviceFunded[0].prices=data.prices;
      //         serviceFunded[0].service=data.service;
      //         serviceFunded[0].service.available_qte=qty;
      //         servicesFiltered.push(serviceFunded[0]);
      //         deposit.services=servicesFiltered;
      //       }
      //   newDepositList.push(deposit);
      // });

      // this.setdepositarticlesOffline(newDepositList);
    }

/**
 * 
 * End Deposits artiles
 */ 
    
/**
 * begin of deposit articles
 */
  
  getofflinearticleslistbykeywords(keyword: string){
    let listarticles :any[]=[];
    let response : Articles[]=[];
    const records =this.getpaginatedofflinearticles();

    if (records.length>0) {
      response=listarticles.filter(this.articlesbypagesbykeywords(a=>a.data,keyword));
     }
    
     return response;
  }

  articlesbypagesbykeywords(data:any,keyword:string){
    return data.filter(service=>service.service.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()));
  }  
  
  getoffarticlesbykeywords(keyword:string){
    let listarticles=this.getOfflineData();
    let response : Articles[]=[];
   
    response=listarticles.filter(service=>service.service.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())).slice(0,10);
    
    return response;
  }

  resetofflinedata(){
    localStorage.removeItem('depositArticles');
    localStorage.removeItem('articles');
    localStorage.removeItem('stockhistories');
  }
  /**
   * Deposit articles
   */

  updatingOfflineDetailsQuantities(listservices:any,depositId:number,invoiceId?:any){

    let depositArticles=this.getlisdepositarticles();
    let actualdeposit=depositArticles.filter(d=>d.deposit.id===depositId)[0];
    let newservices=[];

    listservices.forEach(element => {
        let servicesfinded=actualdeposit.services.filter(s=>s.service.id!=element.service.id);
        newservices=servicesfinded;
        newservices.push(element);
        this.createOfflineStockHistory(element,invoiceId,actualdeposit.name);
    });
    actualdeposit.services=newservices;
    //removing the deposit in localStorage data
    let newdepositArticles=depositArticles.filter(d=>d.deposit.id!=depositId);
    newdepositArticles.push(actualdeposit);
    this.setdepositarticlesOffline(newdepositArticles);
  }  
  
  newupdatingOfflineDetailsQuantities(listservices:Articles[],invoiceId?:any){
    
    let deposits=this.depositserv.getOfflineData();
    let depositartiles= this.depositserv.getOfflineDepositsArticles();
  
    listservices.forEach(element => {
        let actualdeposit=deposits.find(d=>d.id===element.deposit_id);
        const index =depositartiles.findIndex(service=>service.deposit_id==element.deposit_id && service.service.id==element.service.id);
        if (index!==-1) {
          depositartiles[index].quantity=element.quantity-element.service.selling_qte;
          depositartiles[index].service.available_qte=element.service.available_qte-element.service.selling_qte;
          this.createOfflineStockHistory(element,invoiceId,actualdeposit.name);
        }
    });
   
    this.depositserv.setOffLineDepositsArticles(depositartiles);
  }

  createOfflineStockHistory(element:any,invoiceId?:any,depositName?:any){
    let object ={
      id:0,
      depot_id: element.service.deposit_id,
      service_id: element.service.id,
      user_id: this.appserv.getactualuser().id,
      provider_id: null,
      invoice_id: invoiceId,
      quantity: element.service.selling_qte,
      quantity_before: element.service.available_qte,
      price: element.service.price,
      total: element.service.total,
      expiration_date: null,
      document_type: null,
      document_name: null,
      document_number: null,
      attachment: null,
      motif: "vente",
      code_bar: null,
      note:'vente Offline',
      type: "withdraw",
      type_approvement: "cash",
      status:'offline',
      sync_status:'0',
      uuid: null,
      enterprise_id:this.appserv.getactualEse().id,
      created_at:this.appserv.today,
      updated_at:this.appserv.today,
      service_name: element.service.name,
      uom_symbol:  element.service.uom_symbol,
      deposit_name:depositName,
      done_by_name:this.appserv.getactualuser().user_name
    };

    this.saveStockOffline(object);
  }

  saveStockOffline(data:any){
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

  /** 
   * new methods
  */

 
  //have a specific offline article
  getaspecificofflinearticlebyid(articleId: number){
    return this.getOfflineData().find(a=>a.service.id===articleId);
  }

  /**Offline Removing methods */
  removepaginatedarticles(){
    localStorage.removeItem('paginatedarticles');
  } 
  
  removearticleslist(){
    localStorage.removeItem('newarticles');
  }
}
