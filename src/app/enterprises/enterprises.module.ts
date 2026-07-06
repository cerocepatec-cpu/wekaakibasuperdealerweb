import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnterprisesPageRoutingModule } from './enterprises-routing.module';

import { EnterprisesPage } from './enterprises.page';
import { PickenterpriseComponent } from 'src/app/enterprises/pickenterprise/pickenterprise.component';
import { EditenterpriseComponent } from './editenterprise/editenterprise.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnterprisesPageRoutingModule,
    MatTabsModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  declarations: [EnterprisesPage,PickenterpriseComponent, EditenterpriseComponent]
})
export class EnterprisesPageModule {}
