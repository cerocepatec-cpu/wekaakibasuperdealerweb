import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { Deposits } from 'src/app/interfaces/deposit';
import { AppservicesService } from 'src/app/services/appservices.service';
import { DepositsService } from 'src/app/services/deposits.service';
@Component({
  selector: 'app-listviewer',
  templateUrl: './listviewer.component.html',
  styleUrls: ['./listviewer.component.scss'],
})
export class ListviewerComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput! : IonInput;
  @Input() depositsent: Deposits={};
  @Input() listsent: any;
  stockhistories: any[]=[];
  keptstockhistories: any[]=[];
  showprogress=false;
  invoicetypefilter='all';
  search:any;
  showentries=true;
  showWithdraw=true;
  totalgeneral=0;

  constructor(public appserv: AppservicesService, private depositserv: DepositsService) { }

  ngOnInit() {
    this.stockhistories=this.listsent;
    this.keptstockhistories=this.listsent;
  }

  ionViewDidEnter(){
    this.totalcalculate();
    this.defaultinput.setFocus();
  }

  totalcalculate(){
    if (this.showWithdraw && this.showentries) {
      this.totalgeneral=0;
      this.stockhistories.forEach(element => {
        this.totalgeneral +=element.sold;
      });
    }

    if(!this.showWithdraw && this.showentries){
      this.totalgeneral=0;
      this.stockhistories.forEach(element => {
        this.totalgeneral +=element.total_entries;
      });
    }  
    
    if(this.showWithdraw && !this.showentries){
      this.totalgeneral=0;
      this.stockhistories.forEach(element => {
        this.totalgeneral +=element.total_withdraw;
      });
    }
  }

  gotoedit(){}

  deletedeposit(deposit: Deposits){}

  printgeneralreport(deposit: Deposits){

  }

  filter(criteria: string){
    switch (criteria) {
      case 'entry':
        this.showentries=true;
        this.showWithdraw=false;
        this.totalcalculate();
        break;
      case 'withdraw':
        this.showentries=false;
        this.showWithdraw=true;
        this.totalcalculate(); 
        break;
      default:
        this.showWithdraw=true;
        this.showentries=true;
        this.totalcalculate();
        break;
    }
  }
 }
