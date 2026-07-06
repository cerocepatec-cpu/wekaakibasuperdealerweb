import { Injectable } from '@angular/core';
import { CanLoad, Route, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {

  constructor(private router: Router){}

  async canLoad():Promise<boolean> {
      const hasSeenIntro = await localStorage.getItem('INTRO_KEY');
      if(hasSeenIntro!=null && hasSeenIntro=='true' ){
       return true;
      }else{
        this.router.navigateByUrl('/intro',{replaceUrl:true});
        return true;
      }
  }
}
