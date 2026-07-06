import { PrintgeneraldetailsComponent } from './../articles/printgeneraldetails/printgeneraldetails.component';
import { StockhistoryproviderComponent } from './stockhistoryprovider/stockhistoryprovider.component';
import { EditproviderComponent } from './editprovider/editprovider.component';
import { InforsproviderComponent } from './inforsprovider/inforsprovider.component';
import { NewproviderComponent } from './newprovider/newprovider.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProvidersPageRoutingModule } from './providers-routing.module';

import { ProvidersPage } from './providers.page';
import { MatMenuModule } from '@angular/material/menu';
import { PrintgeneralsituationComponent } from './printgeneralsituation/printgeneralsituation.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProvidersPageRoutingModule,
    MatMenuModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule
  ],
  declarations: [ProvidersPage,NewproviderComponent,InforsproviderComponent,EditproviderComponent,StockhistoryproviderComponent,PrintgeneralsituationComponent]
})
export class ProvidersPageModule {}
