import { InfoservantComponent } from './infoservant/infoservant.component';
import { EditservantComponent } from './editservant/editservant.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServantsPageRoutingModule } from './servants-routing.module';

import { ServantsPage } from './servants.page';
import { MatMenuModule } from '@angular/material/menu';
import { NewservantComponent } from './newservant/newservant.component';
import { ServantpickerComponent } from './servantpicker/servantpicker.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ServantsPageRoutingModule,
    MatMenuModule,
    Ng2SearchPipeModule
  ],
  declarations: [ServantsPage,NewservantComponent,EditservantComponent, InfoservantComponent,ServantpickerComponent]
})
export class ServantsPageModule {}
