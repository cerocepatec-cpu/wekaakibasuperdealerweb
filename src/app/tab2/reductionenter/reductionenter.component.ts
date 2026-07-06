import { Component, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-reductionenter',
  templateUrl: './reductionenter.component.html',
  styleUrls: ['./reductionenter.component.scss'],
})
export class ReductionenterComponent implements OnInit {
reduction=0;
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

  validate(){
    this.appserv.modalCtrl.dismiss(this.reduction,'changed');
  }

}
