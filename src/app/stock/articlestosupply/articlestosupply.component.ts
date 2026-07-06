import { Component, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-articlestosupply',
  templateUrl: './articlestosupply.component.html',
  styleUrls: ['./articlestosupply.component.scss'],
})
export class ArticlestosupplyComponent implements OnInit {

  constructor(public appserv:AppservicesService) { }

  ngOnInit() {}

}
