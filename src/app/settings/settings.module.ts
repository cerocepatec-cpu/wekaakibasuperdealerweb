import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { ProviderpasswordComponent } from './providerpassword/providerpassword.component';
import { CustomersLoyaltyComponent } from './customers-loyalty/customers-loyalty.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SettingsPageRoutingModule,
    Ng2SearchPipeModule,
    MatMenuModule
  ],
  declarations: [SettingsPage,ProviderpasswordComponent,CustomersLoyaltyComponent]
})
export class SettingsPageModule {}
