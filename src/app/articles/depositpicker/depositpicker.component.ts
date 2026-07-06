import { DepositsService } from 'src/app/services/deposits.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Deposits } from 'src/app/interfaces/deposit';
import { AppservicesService } from '../../services/appservices.service';
import { Users } from '../../interfaces/users';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-depositpicker',
  templateUrl: './depositpicker.component.html',
  styleUrls: ['./depositpicker.component.scss'],
})
export class DepositpickerComponent implements OnInit {
@ViewChild('searchinput') searchinput : IonInput;
  @Input() listSent:Deposits[];
  listdeposits:Deposits[]=[];
  actualuser: Users={};
  showprogress=false;
  search:any;

  constructor(public appserv: AppservicesService, private depositserv: DepositsService) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();

    if(this.listSent && this.listSent.length>0){
      this.listdeposits=this.listSent;
    }else{
      this.getlistdeposits();
    }
  }

  ionViewDidEnter(){
    this.searchinput.setFocus();
  }

  async selected(deposit: Deposits){
    this.appserv.modalCtrl.dismiss(deposit,'selected');
  }

  getlistdeposits(){
    if (this.appserv.isMyDeviceConnected()) {
      this.showprogress=true;
      this.depositserv.forASpecifUser({user_id:this.actualuser.id}).subscribe(
        data=>{
          this.showprogress=false;
          this.listdeposits=data;
          this.depositserv.setOfflineData(data);
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast("Impossible de récupérer les dépôts","warning");
        });
    }else{
      this.listdeposits=this.depositserv.getOfflineData();
    }
  }
}
