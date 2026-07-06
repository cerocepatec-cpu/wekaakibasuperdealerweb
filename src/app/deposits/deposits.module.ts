import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DepositsPageRoutingModule } from './deposits-routing.module';

import { DepositsPage } from './deposits.page';
import { MatMenuModule } from '@angular/material/menu';
import { NewdepositComponent } from './newdeposit/newdeposit.component';
import { EditpositComponent } from './editposit/editposit.component';
import { InfosepositComponent } from './infoseposit/infoseposit.component';
import { InventorydepositComponent } from './inventorydeposit/inventorydeposit.component';
import { StockvalorisationComponent } from './stockvalorisation/stockvalorisation.component';
import { ServicesviewerComponent } from './servicesviewer/servicesviewer.component';
import { UsersviewerComponent } from './usersviewer/usersviewer.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DepositForSpecificUserComponent } from './deposit-for-specific-user/deposit-for-specific-user.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DepositsPageRoutingModule,
    ReactiveFormsModule,
    MatMenuModule,
    Ng2SearchPipeModule
  ],
  declarations: [DepositsPage,
  NewdepositComponent,EditpositComponent,InfosepositComponent,InventorydepositComponent,StockvalorisationComponent,ServicesviewerComponent,UsersviewerComponent,DepositForSpecificUserComponent]
})
export class DepositsPageModule {}
