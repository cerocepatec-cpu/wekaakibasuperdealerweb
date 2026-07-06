import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoneysPageRoutingModule } from './moneys-routing.module';

import { MoneysPage } from './moneys.page';
import { ConversioneditionComponent } from './conversionedition/conversionedition.component';
import { ConversionsComponent } from './conversions/conversions.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewconversionComponent } from './conversions/newconversion/newconversion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatFormFieldModule,
    IonicModule,
    MoneysPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [MoneysPage,ConversioneditionComponent,ConversionsComponent,NewconversionComponent]
})
export class MoneysPageModule {}
