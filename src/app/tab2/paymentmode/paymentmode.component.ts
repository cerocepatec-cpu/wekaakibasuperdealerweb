import { Component, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-paymentmode',
  templateUrl: './paymentmode.component.html',
  styleUrls: ['./paymentmode.component.scss'],
})
export class PaymentmodeComponent implements OnInit {
note='';
paymentmode='';
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

  selected(modegiven:string){
    this.appserv.modalCtrl.dismiss(modegiven,'selected');
  }

}
