import { AccountpickerComponent } from 'src/app/accounts/accountpicker/accountpicker.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountsPageRoutingModule } from './accounts-routing.module';

import { AccountsPage } from './accounts.page';
import { NewaccountComponent } from './newaccount/newaccount.component';
import { MatMenuModule } from '@angular/material/menu';
import { EditaccountComponent } from './editaccount/editaccount.component';
import { InfosaccountComponent } from './infosaccount/infosaccount.component';
import { GeneralreportComponent } from './generalreport/generalreport.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatMenuModule,
    AccountsPageRoutingModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule
  ],
  declarations: [AccountsPage,AccountpickerComponent,NewaccountComponent,EditaccountComponent,InfosaccountComponent,GeneralreportComponent]
})
export class AccountsPageModule {}
