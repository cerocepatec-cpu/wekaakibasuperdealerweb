import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsPageRoutingModule } from './reports-routing.module';

import { ReportsPage } from './reports.page';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PrintstockbyarticlesComponent } from './printstockbyarticles/printstockbyarticles.component';
import { DynamicviewerComponent } from './dynamicviewer/dynamicviewer.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsPageRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    Ng2SearchPipeModule
  ],
  declarations: [ReportsPage,DatepickerComponent, PrintstockbyarticlesComponent,DynamicviewerComponent]
})
export class ReportsPageModule {}
