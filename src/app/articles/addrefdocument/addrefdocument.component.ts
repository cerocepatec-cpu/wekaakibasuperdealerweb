import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';

@Component({
  selector: 'app-addrefdocument',
  templateUrl: './addrefdocument.component.html',
  styleUrls: ['./addrefdocument.component.scss'],
})
export class AddrefdocumentComponent implements OnInit {
reference="";
  constructor(private appserv: AppservicesService) { }

  ngOnInit() {}

  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }

  async addnew(){
    if(this.reference.length>0){
      this.appserv.modalCtrl.dismiss(this.reference,'added');
    }else{
      this.appserv.presentToast(`Veuillez entrer une référence svp!`,'warning');
    }
  }
}
