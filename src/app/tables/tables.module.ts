import { EditComponent } from './edit/edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TablesPageRoutingModule } from './tables-routing.module';

import { TablesPage } from './tables.page';
import { MatMenuModule } from '@angular/material/menu';
import { NewtableComponent } from './newtable/newtable.component';
import { InfostableComponent } from './infostable/infostable.component';
import { TablepickerComponent } from './tablepicker/tablepicker.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TablesPageRoutingModule,
    MatMenuModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule
  ],
  declarations: [TablesPage,NewtableComponent, EditComponent, InfostableComponent, TablepickerComponent]
})
export class TablesPageModule {}
