import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { Deposits } from 'src/app/interfaces/deposit';
import { Users } from 'src/app/interfaces/users';
import { AppservicesService } from 'src/app/services/appservices.service';
import { DepositsService } from 'src/app/services/deposits.service';

@Component({
  selector: 'app-deposit-for-specific-user',
  templateUrl: './deposit-for-specific-user.component.html',
  styleUrls: ['./deposit-for-specific-user.component.scss'],
})
export class DepositForSpecificUserComponent implements OnInit {
  @Input() criteria : any;
  @ViewChild('search') inputsearch! : IonInput;
  listdeposits:Deposits[]=[];
  actualuser: Users={};
  showprogress=false;
  searching: any;
  listToSend : Deposits[]=[];

  constructor(public appserv: AppservicesService, private depositServ: DepositsService) { }

  ionViewDidEnter(){
    this.inputsearch.setFocus();
  }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    this.getlistdeposits();
  }

  async selected(deposit: Deposits){
    if (this.criteria && this.criteria==="multiple") {
      let ifexists = this.listToSend.indexOf(deposit);
      if (ifexists===-1) {
        deposit.selected=true;
        this.listToSend.push(deposit);
      }else{
        deposit.selected=false;
        this.listToSend=this.listToSend.filter(d=>d!==deposit);
      }
    }else{
      this.appserv.modalCtrl.dismiss(deposit,'selected');
    }
  }

  sendList(){
    this.appserv.modalCtrl.dismiss(this.listToSend,'selected');
  }
  getlistdeposits(){
    if (this.appserv.isMyDeviceConnected()) {
      const object ={user_id:this.appserv.getactualuser().id};
      this.depositServ.forASpecifUser(object).subscribe(
        data=>{
          this.listdeposits=data;
        },
        error=>{
           this.appserv.presentToast("Erreur survenue lors de la récupération des dépôts.","warning");
        });
    } else {
      this.listdeposits=this.depositServ.getOfflineDeposits();
    }
  
  }

}
