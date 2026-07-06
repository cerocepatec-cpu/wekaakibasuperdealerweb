import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';

@Component({
  selector: 'app-attachmentsforallpicker',
  templateUrl: './attachmentsforallpicker.component.html',
  styleUrls: ['./attachmentsforallpicker.component.scss'],
})
export class AttachmentsforallpickerComponent implements OnInit {

  constructor(private appserv: AppservicesService) { }

  ngOnInit() {}

  async closemoal(){
    this.appserv.modalCtrl.dismiss();
  }

}
