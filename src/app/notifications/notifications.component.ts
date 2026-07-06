import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

}
