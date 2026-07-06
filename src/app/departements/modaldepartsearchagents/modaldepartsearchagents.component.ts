import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { Users } from 'src/app/interfaces/users';
import { AppservicesService } from 'src/app/services/appservices.service';


@Component({
  selector: 'app-modaldepartsearchagents',
  templateUrl: './modaldepartsearchagents.component.html',
  styleUrls: ['./modaldepartsearchagents.component.scss'],
})
export class ModaldepartsearchagentsComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!:IonInput;
  @Input() listagentsent: Users[];
  listagents: Users[]=[];
  search: any;
  imgUrl=this.appserv.imgUrl;
  constructor(private modalctrl: ModalController, private appserv: AppservicesService) { }

  ngOnInit() {
    this.listagents=this.listagentsent;
  }

  ionViewDidEnter(){
    setTimeout(() => {
      this.defaultinput.setFocus();
    }, 100);
  }
  async closemodal(){
    this.modalctrl.dismiss();
  }
}
