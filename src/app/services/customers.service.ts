import { Bonus } from './../interfaces/bonus';
import { CustomerpickersComponent } from './../articles/customerpickers/customerpickers.component';
import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { ProviderpickerComponent } from '../articles/providerpicker/providerpicker.component';
import { Observable } from 'rxjs';
import { Customers } from '../interfaces/customers';
import { CategoryCustomers } from '../interfaces/categoriecustomers';
import { InvoiceslistComponent } from '../customers/invoiceslist/invoiceslist.component';
import { ComptecourantComponent } from '../customers/comptecourant/comptecourant.component';
import { BonusclientComponent } from '../customers/bonusclient/bonusclient.component';
import { CautionsclientComponent } from '../customers/cautionsclient/cautionsclient.component';
import { PointsclientComponent } from '../customers/pointsclient/pointsclient.component';
import { Cautions } from '../interfaces/cautions';
import { Points } from '../interfaces/points';
import { articlePaginator } from '../interfaces/articlespaginator';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private appserv:AppservicesService) { }

  async pickallproviders(){
   const modal = this.appserv.modalCtrl.create(
      {
        component:ProviderpickerComponent,
        initialBreakpoint:0.30,
        breakpoints:[0, 0.25,0.30,0.5, 0.75,1]
      }
    );
    (await modal).present();
  }

  async pickallcustomers(){
    const modal = this.appserv.modalCtrl.create({
      component:CustomerpickersComponent,
      initialBreakpoint:0.30,
      breakpoints:[0, 0.25,0.30,0.5, 0.75,1]
    });
    (await modal).present();
  }

  lookup(data: any): Observable<Customers[]>{
    return this.appserv.http.post<Customers[]>(this.appserv.apiUrl + "/customers/search-words",data);
  }

  deleteonecustomer(customer:Customers):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl + "/customers/delete/"+customer.id);
  }

  getlistcustomerscategories(enterpriseid: any):Observable<CategoryCustomers[]>{
    return this.appserv.http.get<CategoryCustomers[]>(this.appserv.apiUrl + '/categoriescustomers/enterprise/'+enterpriseid);
  }

  getallcustomers(enterpriseid: any): Observable<Customers[]>{
    return this.appserv.http.get<Customers[]>(this.appserv.apiUrl + '/customers/enterprise/'+enterpriseid);
  } 
  
  getanonymous(enterpriseid: any): Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl + '/anonymous/customers/enterprise/'+enterpriseid);
  } 
  
  getallcustomerspaginated(enterpriseid: any): Observable<articlePaginator>{
    return this.appserv.http.get<articlePaginator>(this.appserv.apiUrl + '/customers/search/enterprise/'+enterpriseid);
  }
  
  getallproviders(enterpriseid: any): Observable<Customers[]>{
    return this.appserv.http.get<Customers[]>(this.appserv.apiUrl + '/providers/enterprise/'+enterpriseid);
  }

  addnewcustomer(data:any): Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/customers',data);
  }

  updatecustomer(customer:any):Observable<Customers>{
    return this.appserv.http.put<Customers>(this.appserv.apiUrl + '/customers/update/'+customer.id,customer)
  }

  async invoicesview(customer: Customers){
    const modal = await this.appserv.modalCtrl.create({
      component:InvoiceslistComponent,
      componentProps:{'customersent':customer},
      cssClass:'modal-border-radius-20'
    });

    modal.present();
  }

  async comptecourant(customer: Customers){
    const modal = await this.appserv.modalCtrl.create({
      component:ComptecourantComponent,
      componentProps:{'customersent':customer},
      cssClass:'modal-border-radius-20'
    });

    modal.present();
  }

  async bonuslist(customer: Customers){
    const modal = await this.appserv.modalCtrl.create({
      component:BonusclientComponent,
      componentProps:{'customersent':customer},
      cssClass:'modal-border-radius-20'
    });

    modal.present();
  }

  async cautionslist(customer: Customers){
    const modal = await this.appserv.modalCtrl.create({
      component:CautionsclientComponent,
      componentProps:{'customersent':customer},
      cssClass:'modal-border-radius-20'
    });

    modal.present();
  }

  async pointscustomer(customer: Customers){
    const modal = await this.appserv.modalCtrl.create({
      component:PointsclientComponent,
      componentProps:{'customersent':customer},
      cssClass:'modal-border-radius-20'
    });

    modal.present();
  }

  bonusforacustomer(customer: Customers):Observable<Bonus[]>{
    return this.appserv.http.get<Bonus[]>(this.appserv.apiUrl + '/bonus/customer/'+customer.id);
  }

  cautionsforacustomer(customer: Customers):Observable<Cautions[]>{
    return this.appserv.http.get<Cautions[]>(this.appserv.apiUrl + '/cautions/customer/'+customer.id);
  } 
  
  FilteredCautionsForACustomer(object:any):Observable<Cautions[]>{
    return this.appserv.http.post<Cautions[]>(this.appserv.apiUrl + '/cautions/customer/filtered',object);
  }

  newcaution(caution: Cautions):Observable<Cautions>{
    return this.appserv.http.post<Cautions>(this.appserv.apiUrl +'/cautions',caution);
  }

  pointsforacustomer(customer: Customers):Observable<Points[]>{
    return this.appserv.http.get<Points[]>(this.appserv.apiUrl + '/points/customer/'+customer.id);
  }

  addnewcategoryapi(data:any): Observable<CategoryCustomers>{
    return this.appserv.http.post<CategoryCustomers>(this.appserv.apiUrl +'/categoriescustomers',data);
  }

  deletecategory(categoryid:any):Observable<any>{
    return this.appserv.http.delete<any>(this.appserv.apiUrl +'/categoriescustomers/delete/'+ categoryid);
  }

  updatecategory(data: any,categid : any):Observable<CategoryCustomers>{
    return this.appserv.http.put<CategoryCustomers>(this.appserv.apiUrl + '/categoriescustomers/update/'+categid,data);
  }

  
  importlist(data:any): Observable<Customers[]>{
    return this.appserv.http.post<Customers[]>(this.appserv.apiUrl +'/customers/importation',data);
  }

  /**
   * Off lines methods
   */
   getSyncingOfflineData(){
    let data :any[]=[];
    const records = localStorage.getItem('syncingCustomers');
    if (records !== null) {
      data= JSON.parse(records);
     }

     return data;
   }

   resetToSyncingOffline(){
    return localStorage.removeItem('syncingCustomers');
   }
   addtoSyncingOffline(data:any){
    let datas :any[]=[];
    const records = localStorage.getItem('syncingCustomers');
    if (records !== null) {
      let datagotten= JSON.parse(records);
          datagotten.unshift(data);
          localStorage.setItem('syncingCustomers',JSON.stringify(datagotten));
    }else{
      //save to local storage
      datas.push(data);
      localStorage.setItem('syncingCustomers',JSON.stringify(datas));
    }
  } 
  
  addtoCustomersOffline(data:any){
    let datas = this.getofflineCustomers();
    datas.push(data);
    this.setofflinedata(datas);
  }
  
  setofflinedata(data:any){
    try {
      localStorage.setItem('newcustomers',OrbitEncoder.encode(data));
      localStorage.removeItem('customers');
      return true;
    } catch (error) {
        this.appserv.presentToast("Impossible de sauvegarder les articles du dépôt groupes","warning");
        return false;
    }
  }

  getofflineCustomers(){
    let data :any[]=[];
    const records = localStorage.getItem('newcustomers');
    if (typeof records !=='undefined' && records !== null) {
      data= OrbitEncoder.decode(records);
     }
     return data;
  }
  
  /**
   * categories customers
   */
  setOfflineCustomersCategories(data:any){
    localStorage.setItem('categoriesCustomers',JSON.stringify(data));
  }

  getoffcustomersbykeywords(keyword:string){
    let list :any[]=[];
    let response : Customers[]=[];
    const records =localStorage.getItem('newcustomers');
    if (typeof records !== 'undefined' && records !== null) {
      list=OrbitEncoder.decode(records);;
      response=list.filter(item=>item.customerName.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())).slice(0,10);
     }
    return response;
  }

  /**
   * keep paginated customers list
   */
  savepaginatedoffline(data:any){
    let list =this.getpaginatedoffline();
    list.push(data);
    this.setpaginatedoffline(list);
  }

  getpaginatedoffline(){
    let data :any[]=[];
    const records = localStorage.getItem('paginatedcustomers');
      if (records !== null) {
        data= OrbitEncoder.decode(records);
      }
    return data;
  }

  setpaginatedoffline(data:any){
    try {
      localStorage.setItem('paginatedcustomers',OrbitEncoder.encode(data));
      return true;
    } catch (error) {
        this.appserv.presentToast("Impossible de sauvegarder les groupes clients","warning");
        return false;
    }
  }

  getofflinepaginatedbypage(pagenumber: number =1){
    let list = this.getpaginatedoffline();
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
    const lookup =list.find((l)=>l.current_page==pagenumber);
    if (lookup) {
      response=list.find((l)=>l.current_page==pagenumber); 
    }
     
     return response;
  }

  /**
   * Removes old data saved
   */
  removeofflinecustomers(){
    localStorage.removeItem('paginatedcustomers');
    localStorage.removeItem('newcustomers');
  }
}
