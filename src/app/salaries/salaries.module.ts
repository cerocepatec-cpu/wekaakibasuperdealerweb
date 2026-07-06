import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalariesPageRoutingModule } from './salaries-routing.module';

import { SalariesPage } from './salaries.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NewposteComponent } from '../newposte/newposte.component';
import { NewpositionComponent } from '../newposition/newposition.component';
import { EditsalaryComponent } from '../editsalary/editsalary.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SalariesPageRoutingModule,
    Ng2SearchPipeModule,
    MatMenuModule
  ],
  declarations: [SalariesPage,NewposteComponent,NewpositionComponent,EditsalaryComponent]
})
export class SalariesPageModule {}
