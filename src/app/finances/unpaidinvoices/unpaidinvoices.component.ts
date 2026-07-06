import { Component, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-unpaidinvoices',
  templateUrl: './unpaidinvoices.component.html',
  styleUrls: ['./unpaidinvoices.component.scss'],
})
export class UnpaidinvoicesComponent implements OnInit {

  constructor(public appserv:AppservicesService) { }

  ngOnInit() {}

}
