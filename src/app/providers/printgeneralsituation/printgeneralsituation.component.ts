import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { Providers } from '../../interfaces/providers';
import { StockHistory } from '../../interfaces/stockhistory';

@Component({
  selector: 'app-printgeneralsituation',
  templateUrl: './printgeneralsituation.component.html',
  styleUrls: ['./printgeneralsituation.component.scss'],
})
export class PrintgeneralsituationComponent implements OnInit {
@Input() providersent: Providers={};
@Input() mouvements: StockHistory[]=[];
totaldebts=0;
totalcash=0;
sold=0;
actualuser=this.appserv.getactualuser();
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

}
