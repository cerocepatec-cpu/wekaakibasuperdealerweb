import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Observable } from 'rxjs';
import { CategoriesArticle } from '../interfaces/cagoriesarticles';

@Injectable({
  providedIn: 'root'
})
export class CategoryserviceService {

  constructor(public appserv:AppservicesService) { }

  addnewcategoryapi(data:any): Observable<CategoriesArticle>{
    return this.appserv.http.post<CategoriesArticle>(this.appserv.apiUrl +'/categoriesServices',data);
  }

  updatecatgoryarticle(category:any,id: number): Observable<CategoriesArticle>{
    return this.appserv.http.patch<CategoriesArticle>(this.appserv.apiUrl + '/categoriesServices/update/'+id,category);
  }

  getallcategoriesarticles(enterprise_id: any): Observable<CategoriesArticle[]>{
    return this.appserv.http.get<CategoriesArticle[]>(this.appserv.apiUrl +'/categoriesServices/enterprise/'+ enterprise_id);
  }

  savecatgoryoffline(data:any){
    let listcategories :any[]=[];
    const records = localStorage.getItem('categoriesartiles');
    if (records !== null) {
      let listcategories= JSON.parse(records);
      listcategories.unshift(data);
      localStorage.setItem('categoriesartiles',JSON.stringify(listcategories));
    }else{
      //save to local storage
      listcategories.push(data);
      localStorage.setItem('categoriesartiles',JSON.stringify(listcategories));
    }
  }

  getofflinecategories(){
    let listcategories :any[]=[];
    const records = localStorage.getItem('categoriesartiles');
    if (records !== null) {
      listcategories= JSON.parse(records);
     }

     return listcategories;
  }
}
