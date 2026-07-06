import { Component, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-othersmenumobile',
  templateUrl: './othersmenumobile.component.html',
  styleUrls: ['./othersmenumobile.component.scss'],
})
export class OthersmenumobileComponent implements OnInit {
  submenu = [];
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

  ionViewDidEnter(){
    const records = localStorage.getItem('permission');
    if (typeof records !== 'undefined' && records !== null) {
      let dataMenu:any[] = JSON.parse(records);
      this.submenu = dataMenu.filter((item)=> item.type === 'submenu');
    }
  }

}
