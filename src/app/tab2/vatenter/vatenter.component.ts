import { Component, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
@Component({
  selector: 'app-vatenter',
  templateUrl: './vatenter.component.html',
  styleUrls: ['./vatenter.component.scss'],
})
export class VatenterComponent implements OnInit {

  vatgiven=0;
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

  validate(){
    this.appserv.modalCtrl.dismiss(this.vatgiven,'changed');
  }

}
