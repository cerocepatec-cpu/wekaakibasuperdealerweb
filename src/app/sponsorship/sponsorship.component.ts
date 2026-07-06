import { Component, OnInit, ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { UsersService } from '../services/users.service';
import { Users } from '../interfaces/users';
import { Router } from '@angular/router';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-sponsorship',
  templateUrl: './sponsorship.component.html',
  styleUrls: ['./sponsorship.component.scss'],
})
export class SponsorshipComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput:IonInput;
  showprogress=false;
  listUsers:Users[]=[];
  keptUsers:Users[]=[];
  constructor(public appserv:AppservicesService, private Userserv:UsersService,private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
       this.defaultinput.setFocus();
    },100);
  }

   handlesearchchange($event){

    if ($event.detail.value.length>0) {
      this.showprogress=true;
      this.Userserv.memberslookup({enterprise_id:this.appserv.actualEse.id,keyword:$event.detail.value}).subscribe(
        response=>{
          this.showprogress=false;
          this.listUsers=response;
          // console.log('members lookup',response);
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast("Une erreur est survenue. Veuillez réesayer","danger");
          console.log('error members lookup',error);
        }); 
    }
  }

  detailsponsoring(user: Users) {
    this.router.navigate(['/uzisha/detailsponsoring'], { state: { agent: user } });
  }

}
