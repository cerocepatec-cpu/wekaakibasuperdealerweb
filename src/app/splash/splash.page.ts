import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppservicesService } from '../services/appservices.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  showlogin=false;
  constructor(public router:Router, public appserv: AppservicesService) {
    setTimeout(()=>{
      this.isanyconnection()
      this.showlogin=true;
    },2000);
  }

  ngOnInit() {
  }
  isanyconnection(){

      if(this.appserv.getactualuser().id){
        // this.router.navigateByUrl('/home',{replaceUrl:true});
        this.router.navigateByUrl('/uzisha');
      }else {
        this.router.navigateByUrl('/login');
      }

  }

}
