import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirstentriesPageRoutingModule } from './firstentries-routing.module';

import { FirstentriesPage } from './firstentries.page';
import { NewfirstentryComponent } from '../newfirstentry/newfirstentry.component';
import { MatMenuModule } from '@angular/material/menu';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    MatMenuModule,
    FirstentriesPageRoutingModule
  ],
  declarations: [
    FirstentriesPage,
    NewfirstentryComponent
  ]
})
export class FirstentriesPageModule {}
