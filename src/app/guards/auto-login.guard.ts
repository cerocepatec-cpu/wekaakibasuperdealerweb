import { Injectable } from '@angular/core';
import {CanLoad, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../services/authentification.service';
import { map, take,filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor(private authService: AuthentificationService, private router: Router){}
  
   canLoad():Observable<any>{
      return this.authService.isAuthentificated.pipe(
        filter(val => val !==null),
        take(1),
        map(isAuthentificated=>{ 
          if(isAuthentificated){
            //return true;
            return this.router.navigateByUrl('/home',{replaceUrl:true});
          }else{
            return true;
          }
        })
      )
  }
}
