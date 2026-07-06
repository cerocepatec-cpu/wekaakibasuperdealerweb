import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';

@Component({
  selector: 'app-calendarpicker',
  templateUrl: './calendarpicker.component.html',
  styleUrls: ['./calendarpicker.component.scss'],
})
export class CalendarpickerComponent implements OnInit {
calendar='';
constructor(private appserv: AppservicesService) { }

  ngOnInit() {}
  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }
  async sendcalendar(){
    this.appserv.modalCtrl.dismiss(this.calendar,'selected');
  }

}
