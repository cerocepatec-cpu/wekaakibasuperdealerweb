import { Component, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-expiredarticles',
  templateUrl: './expiredarticles.component.html',
  styleUrls: ['./expiredarticles.component.scss'],
})
export class ExpiredarticlesComponent implements OnInit {

  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

}
