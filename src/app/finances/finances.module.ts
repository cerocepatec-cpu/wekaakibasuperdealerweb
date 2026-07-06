
import { FencesComponent } from './fences/fences.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinancesPageRoutingModule } from './finances-routing.module';

import { FinancesPage } from './finances.page';
import { InvoicesComponent } from './invoices/invoices.component';
import { MatMenuModule } from '@angular/material/menu';
import { DetailinvoiceComponent } from './invoices/detailinvoice/detailinvoice.component';
import { ExpendituresComponent } from './expenditures/expenditures.component';
import { NewexpenditureComponent } from './expenditures/newexpenditure/newexpenditure.component';
import { NewfenceComponent } from './fences/newfence/newfence.component';
import { InfosfenceComponent } from './fences/infosfence/infosfence.component';
import { VersementsComponent } from './fences/versements/versements.component';
import { NewticketingComponent } from '../fences/versements/newticketing/newticketing.component';
import { UnpaidinvoicesComponent } from './unpaidinvoices/unpaidinvoices.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SavedinvoicesComponent } from './invoices/savedinvoices/savedinvoices.component';
import { MarginexpendituresettingsComponent } from './expenditures/marginexpendituresettings/marginexpendituresettings.component';
import { NewmarginexpenditureComponent } from './expenditures/newmarginexpenditure/newmarginexpenditure.component';
import { InfosmaginexpendituresComponent } from './expenditures/infosmaginexpenditures/infosmaginexpenditures.component';
import { DetailexpenditureComponent } from './expenditures/detailexpenditure/detailexpenditure.component';
import { PrintexpenditureandentryComponent } from './printexpenditureandentry/printexpenditureandentry.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ClosureDashboardAdvancedComponent } from '../closure-dashboard-advanced/closure-dashboard-advanced.component';
import { PrintclosureComponent } from '../printclosure/printclosure.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinancesPageRoutingModule,
    MatMenuModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    MatTabsModule,
    SharedModule
  ],
  declarations: [
    FinancesPage, 
    InvoicesComponent, 
    DetailinvoiceComponent,
    ExpendituresComponent,
    NewexpenditureComponent,
    FencesComponent,
    NewfenceComponent,
    InfosfenceComponent,
    VersementsComponent,
    NewticketingComponent,
    UnpaidinvoicesComponent,
    SavedinvoicesComponent,
    MarginexpendituresettingsComponent,
    NewmarginexpenditureComponent,
    InfosmaginexpendituresComponent,
    DetailexpenditureComponent,
    PrintexpenditureandentryComponent,
    ClosureDashboardAdvancedComponent,
    PrintclosureComponent
  ]
})
export class FinancesPageModule {}
