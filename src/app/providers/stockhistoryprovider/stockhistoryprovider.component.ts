import { Component, OnInit, Input } from '@angular/core';
import { StockHistory } from 'src/app/interfaces/stockhistory';
import { AppservicesService } from '../../services/appservices.service';

@Component({
  selector: 'app-stockhistoryprovider',
  templateUrl: './stockhistoryprovider.component.html',
  styleUrls: ['./stockhistoryprovider.component.scss'],
})
export class StockhistoryproviderComponent implements OnInit {
  @Input() mouvements : StockHistory[]=[];
  filtercriteria="all";

  constructor(public appserv: AppservicesService) { }

  ngOnInit() {}

}
