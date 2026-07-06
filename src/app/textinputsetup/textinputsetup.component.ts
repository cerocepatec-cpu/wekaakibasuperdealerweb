import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';

@Component({
  selector: 'app-textinputsetup',
  templateUrl: './textinputsetup.component.html',
  styleUrls: ['./textinputsetup.component.scss'],
})
export class TextinputsetupComponent implements OnInit {
@Input() title:any;
@Input() datatoedit:string;
message='';

  constructor(public appserv: AppservicesService) { }

  ngOnInit() {
    if(this.datatoedit){
      this.message=this.datatoedit;
    }
  }

  sendmsg(){
    if(this.message.length>0){
      this.appserv.modalCtrl.dismiss(this.message,'edited');
    }else{
      this.appserv.presentToast(`Veuillez entrer un contenu`,'warning');
    }
   
  }

}
