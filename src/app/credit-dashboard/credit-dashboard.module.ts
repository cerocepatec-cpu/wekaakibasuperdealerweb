import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreditDashboardPageRoutingModule } from './credit-dashboard-routing.module';

import { CreditDashboardPage } from './credit-dashboard.page';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { CreditTableComponent } from '../credit-table/credit-table.component';
import { CreditDetailsComponent } from '../credit-details/credit-details.component';
import { CreditCreateComponent } from '../credit-create/credit-create.component';
import { SharedModule } from '../shared/shared.module';
import { CreditDisburseComponent } from '../credit-disburse/credit-disburse.component';
import { CreditApproveModal } from '../credit-approve-modal/credit-approve-modal.component';
import { CreditPayComponent } from '../credit-pay/credit-pay.component';
import { AgentBonusReportComponent } from '../agent-bonus-report/agent-bonus-report.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CreditDashboardPageRoutingModule
  ],
  declarations: [
    CreditDashboardPage,
    StatCardComponent,
    CreditTableComponent,
    CreditDetailsComponent,
    CreditCreateComponent,
    CreditDisburseComponent,
    CreditApproveModal,
    CreditPayComponent,
    AgentBonusReportComponent
  ]
})
export class CreditDashboardPageModule {}
