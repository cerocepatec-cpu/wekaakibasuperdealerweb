import { MatMenuModule } from '@angular/material/menu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OthersentriesPageRoutingModule } from './othersentries-routing.module';

import { OthersentriesPage } from './othersentries.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OthersentriesPageRoutingModule,
    MatMenuModule,
    Ng2SearchPipeModule
  ],
  declarations: [OthersentriesPage]
})
export class OthersentriesPageModule {}
