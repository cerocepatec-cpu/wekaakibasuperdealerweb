import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Money } from '../interfaces/money';
import { AppservicesService } from '../services/appservices.service';
import { NewmoneyformComponent } from '../articles/newmoneyform/newmoneyform.component';
import { MoneyService } from '../services/money.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-selectmoney',
  templateUrl: './selectmoney.component.html',
  styleUrls: ['./selectmoney.component.scss'],
})
export class SelectmoneyComponent implements OnInit {
@ViewChild('defaultinput') defaultinput : IonInput;
search: any;
@Input() listmoney : Money[]=[];
@Input() multiselect:boolean;
showprogress=false;
selectedmoneys:Money[]=[];
constructor(public appserv: AppservicesService, private moneyserv: MoneyService) { }

  ngOnInit() {
    if(this.listmoney.length==0){
      this.getting();
    }
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }

  sendList(){
    if (this.multiselect) {
      this.appserv.modalCtrl.dismiss(this.selectedmoneys,'selected');
    }
  }

  selected(money: Money){
    if(this.multiselect){
      const ifexists = this.selectedmoneys.indexOf(money);
      if(ifexists===-1){
        this.selectedmoneys.push(money);
        money.selected=true;
      }else{
        this.selectedmoneys=this.selectedmoneys.filter(u=>u!=money);
        money.selected=false;
      }
    }else{
      this.appserv.modalCtrl.dismiss(money,'selected');
    }
  }

  async changemoney(money: Money){
    this.appserv.modalCtrl.dismiss(money,'selected');
  }

  async addnewmoney(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewmoneyformComponent
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
    if(role=='added'){
        this.listmoney.push(data);
    }
  }

  getting(){
    this.showprogress=true;
    this.moneyserv.getlistmonnaiesapi(this.appserv.getactualEse().id).subscribe(
      data=>{
        this.showprogress=false;
        this.listmoney=data;
        this.moneyserv.setOfflineData(data);
      },
      error=>{
        this.showprogress=false;
       //get offline money
        this.listmoney=this.moneyserv.getOfflineData();
      }
    );
  }
}
