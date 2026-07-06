import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { Invoice } from '../interfaces/invoices';
import { Articles } from '../interfaces/articles';

@Component({
  selector: 'app-printinvoicepos',
  templateUrl: './printinvoicepos.component.html',
  styleUrls: ['./printinvoicepos.component.scss'],
})
export class PrintinvoiceposComponent implements OnInit {
  @Input() invoice:Invoice={};
  @Input() listselectedarticles :Articles[]=[];

  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

  ngAfterViewInit(){
    window.print();
  }

}
