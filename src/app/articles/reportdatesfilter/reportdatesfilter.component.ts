import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';

@Component({
  selector: 'app-reportdatesfilter',
  templateUrl: './reportdatesfilter.component.html',
  styleUrls: ['./reportdatesfilter.component.scss'],
})
export class ReportdatesfilterComponent implements OnInit {
  open_customized_modal=false;
 
  constructor(private appserv: AppservicesService) { }

  ngOnInit() {}

  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }

  setOpen(isOpen: boolean){
    this.open_customized_modal= isOpen;
  }
}
