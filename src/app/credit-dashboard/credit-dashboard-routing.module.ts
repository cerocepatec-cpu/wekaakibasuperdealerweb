import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditDashboardPage } from './credit-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: CreditDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditDashboardPageRoutingModule {}
