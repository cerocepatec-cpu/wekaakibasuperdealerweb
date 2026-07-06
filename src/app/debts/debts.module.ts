import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DebtsPageRoutingModule } from './debts-routing.module';

import { DebtsPage } from './debts.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { InfosdebtComponent } from './infosdebt/infosdebt.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebtsPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [DebtsPage,InfosdebtComponent]
})
export class DebtsPageModule {}
