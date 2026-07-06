import { NewservantComponent } from './../newservant/newservant.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { ServantsService } from 'src/app/services/servants.service';
import { Servant } from '../../interfaces/servants';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-servantpicker',
  templateUrl: './servantpicker.component.html',
  styleUrls: ['./servantpicker.component.scss'],
})
export class ServantpickerComponent implements OnInit {
  @ViewChild('inputSearch') input!: IonInput;
  @Input() title : String;
  showprogress=false;
  search: any;
  listservants:Servant[]=[];
  constructor(public appserv: AppservicesService, private servantserv: ServantsService) { }

  ngOnInit() {
    this.getall();
  }

  ionViewDidEnter() {
    this.input.setFocus();
  }
  
  async addnewservant(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewservantComponent,
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
      this.listservants.unshift(data);
    }
  }
  getall(){
    this.showprogress=true;
    if (this.appserv.isMyDeviceConnected()) {
      this.servantserv.getall(this.appserv.getactualuser().enterprise_id).subscribe(
        data=>{
          this.showprogress=false;
          this.listservants=data;
          this.servantserv.setofflinedata(data);
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast("Impossible de charger le personnel non utilisateurs. Veuillez vérifier votre connexion","warning");
        });
    } else {
      this.showprogress=false;
      this.listservants=this.servantserv.getofflinedata();
    }

   
  }

  selected(servant: Servant){
    this.appserv.modalCtrl.dismiss(servant,'selected');
  }
}
