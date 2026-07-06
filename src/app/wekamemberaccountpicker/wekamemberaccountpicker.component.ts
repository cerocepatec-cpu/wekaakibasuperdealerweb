import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { MembersaccountsService } from '../services/membersaccounts.service';
import { IonInput } from '@ionic/angular';
import { Tubs } from '../interfaces/tubs';

@Component({
  selector: 'app-wekamemberaccountpicker',
  templateUrl: './wekamemberaccountpicker.component.html',
  styleUrls: ['./wekamemberaccountpicker.component.scss'],
})
export class WekamemberaccountpickerComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!:IonInput;
  @Input() multiple=false;
  @Input() tubsent:Tubs={};
  accountslist:any[]=[];
  selectedAccounts:any[]=[];
  showprogress=false;
  constructor(public appserv:AppservicesService,private memberaccountserv:MembersaccountsService) { }

  ngOnInit() {}

  ionViewDidEnter(){
    setTimeout(() => {
      this.defaultinput.setFocus();
    }, 100);
  }

  handlesearchChange($event:any) {
    console.log("key word",$event.detail.value);
    this.showprogress = true;

    this.memberaccountserv.searchaccountsbyenterprise({
      keyword: $event.detail.value,
      limit: 20
    }).subscribe({
      next: (response) => {
        console.log('member accounts response=>', response);
        this.showprogress = false;

        if (response && Array.isArray(response)) {
          // 🧠 Si tubsent existe et a un money_id, on filtre
          if (this.tubsent && this.tubsent.money_id) {
            this.accountslist = response.filter(acc => acc.money_id === this.tubsent.money_id);
          } else {
            // Sinon on affiche tout
            this.accountslist = response;
          }
        } else {
          this.accountslist = [];
        }
      },
      error: (err) => {
        console.log("Error chargement...",err);
        this.showprogress = false;
        this.appserv.presentToast("Une erreur est survenue.", "danger");
      }
    });
  }


  select(account:any){
    if (this.multiple) {
      
    }else{
      this.appserv.modalCtrl.dismiss(account,'selected');
    }
  }
}
