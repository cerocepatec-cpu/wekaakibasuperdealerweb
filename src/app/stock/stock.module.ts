import { InventoryComponent } from './inventory/inventory.component';
import { StockhistoryComponent } from './stockhistory/stockhistory.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockPageRoutingModule } from './stock-routing.module';

import { StockPage } from './stock.page';
import { MatMenuModule } from '@angular/material/menu';
import { ListviewerComponent } from './listviewer/listviewer.component';
import { ExpiredarticlesComponent } from './expiredarticles/expiredarticles.component';
import { ArticlestosupplyComponent } from './articlestosupply/articlestosupply.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DetailmouvementComponent } from './detailmouvement/detailmouvement.component';
import { ImportdataComponent } from './importdata/importdata.component';
import { MultipleproductsviewerstockComponent } from './multipleproductsviewerstock/multipleproductsviewerstock.component';
import { RequestapprovmentComponent } from './requestapprovment/requestapprovment.component';
import { TransfertComponent } from './transfert/transfert.component';
import { NewtransfertComponent } from './transfert/newtransfert/newtransfert.component';
import { NewrequestComponent } from './requestapprovment/newrequest/newrequest.component';
import { DetailtransfertComponent } from './transfert/detailtransfert/detailtransfert.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PrintreportstockComponent } from './printreportstock/printreportstock.component';
import { PrintCarnetsComponent } from '../print-carnets/print-carnets.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockPageRoutingModule,
    MatMenuModule,
    Ng2SearchPipeModule,
    MatTabsModule
  ],
  declarations: [
    StockPage,
    StockhistoryComponent,
    InventoryComponent,
    ListviewerComponent,
    ExpiredarticlesComponent,
    ArticlestosupplyComponent,
    DetailmouvementComponent,
    ImportdataComponent,
    MultipleproductsviewerstockComponent,
    RequestapprovmentComponent,
    TransfertComponent,
    NewtransfertComponent,
    NewrequestComponent,
    DetailtransfertComponent,
    PrintreportstockComponent,
    PrintCarnetsComponent
  ]
})
export class StockPageModule {}
