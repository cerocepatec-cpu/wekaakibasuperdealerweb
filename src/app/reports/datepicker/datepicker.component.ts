import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!:IonInput;
from=this.appserv.today.toLocaleDateString();
to=this.appserv.today.toLocaleDateString();
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {
    this.from=this.appserv.defaultdate();
    this.to=this.appserv.defaultdate();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.defaultinput.setFocus();
    }, 100);
  }

  handlevalidated($event){
    if ($event.keyCode===13) {
      this.validate();
    }
  }

  validate(){
    if(this.from && this.to){
      const object={from:this.from,to:this.to};
      this.appserv.modalCtrl.dismiss(object,'selected');
    } 
  }

}
