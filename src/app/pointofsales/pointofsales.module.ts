import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PointofsalesPageRoutingModule } from './pointofsales-routing.module';

import { PointofsalesPage } from './pointofsales.page';
import { MatMenuModule } from '@angular/material/menu';
import { NewposComponent } from './newpos/newpos.component';
import { InfosposComponent } from './infospos/infospos.component';
import { EditposComponent } from './editpos/editpos.component';
import { DepositposComponent } from './depositpos/depositpos.component';
import { UsersposComponent } from './userspos/userspos.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PointofsalesPageRoutingModule,
    MatMenuModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule
  ],
  declarations: [
    PointofsalesPage,
    NewposComponent,
    InfosposComponent,
    EditposComponent,
    DepositposComponent,
    UsersposComponent
  ]
})
export class PointofsalesPageModule {}
