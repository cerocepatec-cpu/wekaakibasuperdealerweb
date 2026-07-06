import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { Deposits } from 'src/app/interfaces/deposit';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-dynamicviewer',
  templateUrl: './dynamicviewer.component.html',
  styleUrls: ['./dynamicviewer.component.scss'],
})
export class DynamicviewerComponent implements OnInit {
  @ViewChild('search') search!:IonInput;
@Input() datasent : any;
@Input() criteria : any;
searching: any;
showprogress=false;
removed=false;
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}
  ionViewDidEnter(){
    this.search.setFocus();
  }

  closemodal(){
    this.removed?this.appserv.modalCtrl.dismiss(this.datasent,"removed"):this.appserv.modalCtrl.dismiss();
  }

  removedeposit(deposit: Deposits){
    this.datasent=this.datasent.filter(d=>d!=deposit);
    this.removed=true;
  }

  removearticle(article){
    this.datasent=this.datasent.filter(a=>a!=article);
    this.removed=true;
  }  
  
  removeagent(agent){
    this.datasent=this.datasent.filter(a=>a!=agent);
    this.removed=true;
  }

  removecustomer(customer){
    this.datasent=this.datasent.filter(c=>c!=customer);
    this.removed=true;
  }
}
