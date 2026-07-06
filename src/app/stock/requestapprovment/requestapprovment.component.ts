import { Component, OnInit } from '@angular/core';
import { RequestTransfert } from 'src/app/interfaces/requestTransfert';
import { AppservicesService } from 'src/app/services/appservices.service';
import { NewrequestComponent } from './newrequest/newrequest.component';
import { RequestTransfertService } from 'src/app/services/request-transfert.service';

@Component({
  selector: 'app-requestapprovment',
  templateUrl: './requestapprovment.component.html',
  styleUrls: ['./requestapprovment.component.scss'],
})
export class RequestapprovmentComponent implements OnInit {
  showprogress=false;
  search: any;
  from : any;
  to : any;
  listrequest:RequestTransfert[]=[];

  constructor(public appserv: AppservicesService, private requestserv: RequestTransfertService) { }

  ngOnInit() {
    this.getall();
  }

  async export(criteria:string){

  }

  async periodicfilter(){

    const modal = await this.appserv.periodicfilter();
    modal.present(); 
  
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      const object = {user_id:this.appserv.getactualuser().id,from:data.from,to:data.to};
      this.from=data.from;
      this.to=data.to;
    }
  }

  async newrequest(){

    const modal = await this.appserv.modalCtrl.create({
      component:NewrequestComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
      data.forEach(element => {
        this.listrequest.unshift(element);
      });
    }
  }

  async detail(request: RequestTransfert){

  }

  async getall(){
    this.showprogress=true;
    this.requestserv.getall().subscribe(
      data=>{
        this.listrequest=data;
        this.showprogress=false;
      },error=>{
        this.showprogress=false; 
        this.appserv.presentToast(`Erreur de connexion`,'danger');
      }
    )
  }
}
