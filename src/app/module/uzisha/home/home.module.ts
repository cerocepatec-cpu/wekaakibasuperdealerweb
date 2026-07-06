import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip'
import { HomePageRoutingModule } from './home-routing.module';
import {NgxPrintModule} from 'ngx-print';

import { HomePage } from './home.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatMenuModule } from '@angular/material/menu';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { InvoicePrintComponent } from './invoice-print/invoice-print.component';
import { PrintproformaComponent } from './printproforma/printproforma.component';
import { SyncingdataviewerComponent } from './syncingdataviewer/syncingdataviewer.component';
import { Duplicataa4Component } from './duplicataa4/duplicataa4.component';
import { DuplicataposComponent } from './duplicatapos/duplicatapos.component';
import { PrintinventoryComponent } from '../stock/inventory/printinventory/printinventory.component';
import { MenuMobileInvoiceComponent } from './menu-mobile-invoice/menu-mobile-invoice.component';
import { MatTabsModule } from '@angular/material/tabs';
import { OthersmenumobileComponent } from './othersmenumobile/othersmenumobile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    Ng2SearchPipeModule,
    MatIconModule,
    MatTooltipModule,
    MatBadgeModule,
    MatMenuModule,
    MatTabsModule,
    NgxExtendedPdfViewerModule,
    NgxPrintModule
  ],
  declarations: [HomePage,
                 InvoicePrintComponent, 
                 PrintproformaComponent, 
                 SyncingdataviewerComponent, 
                 Duplicataa4Component, 
                 DuplicataposComponent,
                 PrintinventoryComponent,
                 MenuMobileInvoiceComponent,
                 OthersmenumobileComponent
                ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
