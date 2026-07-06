import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {UzishaPageRoutingModule } from './uzisha-routing.module';
import { UzishaPage } from './uzisha.page';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ConnectionServiceModule } from 'ng-connection-service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatBadgeModule } from '@angular/material/badge';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { VerificationComponent } from './verification/verification.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SelectsubservicesComponent } from 'src/app/selectsubservices/selectsubservices.component';
import { NewreservationComponent } from 'src/app/newreservation/newreservation.component';
import { TubsComponent } from 'src/app/tubs/tubs.component';
import { TransactionsComponent } from 'src/app/transactions/transactions.component';
import { NewtransactionComponent } from 'src/app/newtransaction/newtransaction.component';
import { MembersactivationComponent } from 'src/app/membersactivation/membersactivation.component';
import { TransactionsvalidationComponent } from 'src/app/transactionsvalidation/transactionsvalidation.component';
import { SalaryadvancesComponent } from 'src/app/salaryadvances/salaryadvances.component';
import { EnterpriseslistComponent } from 'src/app/enterpriseslist/enterpriseslist.component';
import { WekagroupsComponent } from 'src/app/wekagroups/wekagroups.component';
import { NewgroupComponent } from 'src/app/newgroup/newgroup.component';
import { EditwekagroupComponent } from 'src/app/editwekagroup/editwekagroup.component';
import { NewadvancesalaryComponent } from 'src/app/newadvancesalary/newadvancesalary.component';
import { AdvancesalariesgeneralviewComponent } from 'src/app/advancesalariesgeneralview/advancesalariesgeneralview.component';
import { EmployeespickerComponent } from 'src/app/employeespicker/employeespicker.component';
import { PayslipsComponent } from 'src/app/payslips/payslips.component';
import { FichesdepaieComponent } from 'src/app/fichesdepaie/fichesdepaie.component';
import { EditfirstentryComponent } from 'src/app/editfirstentry/editfirstentry.component';
import { DynamicprintComponent } from 'src/app/dynamicprint/dynamicprint.component';
import { WekaakibaadmindashboardComponent } from 'src/app/wekaakibaadmindashboard/wekaakibaadmindashboard.component';
import { WelcomepageComponent } from 'src/app/welcomepage/welcomepage.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DepartementsComponent } from 'src/app/departements/departements.component';
import { DetaildepartmentComponent } from 'src/app/departements/detaildepartment/detaildepartment.component';
import { ModaldepartsearchagentsComponent } from 'src/app/departements/modaldepartsearchagents/modaldepartsearchagents.component';
import { ModaladdnewagentdepartComponent } from 'src/app/departements/modaladdnewagentdepart/modaladdnewagentdepart.component';
import { ClosurefundComponent } from 'src/app/closurefund/closurefund.component';
import { ForbiddenComponent } from 'src/app/forbidden/forbidden.component';
import { TransactionFeesComponent } from 'src/app/transaction-fees/transaction-fees.component';
import { ChangePinComponent } from 'src/app/changepin/changepin.component';
import { NotebooksalesComponent } from 'src/app/notebooksales/notebooksales.component';
import { MobileVersionUploadComponent } from 'src/app/mobile-version-upload/mobile-version-upload.component';
import { TransactionlimitconfigComponent } from 'src/app/transactionlimitconfig/transactionlimitconfig.component';
import { CitiesComponent } from 'src/app/cities/cities.component';
import { VirtualsalesComponent } from 'src/app/virtualsales/virtualsales.component';
import { NewvirtualsaleComponent } from 'src/app/newvirtualsale/newvirtualsale.component';
import { NoSponsorDetailsComponent } from 'src/app/no-sponsor-details/no-sponsor-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UzishaPageRoutingModule,
    MatIconModule,
    HttpClientModule,
    MatMenuModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ConnectionServiceModule,
    Ng2SearchPipeModule,
    MatBadgeModule,
    NgxExtendedPdfViewerModule,
    MatTabsModule,
    SharedModule
  ],
  declarations: [
    UzishaPage, 
    VerificationComponent,
    SelectsubservicesComponent,
    NewreservationComponent,
    TubsComponent,
    TransactionsComponent,
    NewtransactionComponent,
    MembersactivationComponent,
    TransactionsvalidationComponent,
    SalaryadvancesComponent,
    EnterpriseslistComponent,
    WekagroupsComponent,
    NewgroupComponent,
    EditwekagroupComponent,
    NewadvancesalaryComponent,
    AdvancesalariesgeneralviewComponent,
    EmployeespickerComponent,
    PayslipsComponent,
    FichesdepaieComponent,
    EditfirstentryComponent,
    DynamicprintComponent,
    WekaakibaadmindashboardComponent,
    WelcomepageComponent,
    DepartementsComponent,
    DetaildepartmentComponent,
    ModaldepartsearchagentsComponent,
    ModaladdnewagentdepartComponent,
    ClosurefundComponent,
    ForbiddenComponent,
    TransactionFeesComponent,
    ChangePinComponent,
    NotebooksalesComponent,
    MobileVersionUploadComponent,
    TransactionlimitconfigComponent,
    CitiesComponent,
    VirtualsalesComponent,
    NewvirtualsaleComponent,
    NoSponsorDetailsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UzishaPageModule {}
