import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinancesPage } from './finances.page';
import { InvoicesComponent } from './invoices/invoices.component';
import { ExpendituresComponent } from './expenditures/expenditures.component';
import { FencesComponent } from './fences/fences.component';
import { MarginexpendituresettingsComponent } from './expenditures/marginexpendituresettings/marginexpendituresettings.component';
import { PermissionGuard } from '../guards/permission.guard';
const routes: Routes = [
  {
    path: '',
    component: FinancesPage
  },
  {
    path:'invoices',
    component:InvoicesComponent,
    canActivate:[PermissionGuard],
    data:{permission: { module: 'factures', action: 'view' }}
  },
  {
    path:'expenditures',
    component:ExpendituresComponent,
    canActivate:[PermissionGuard],
    data:{permission: { module: 'depenses', action: 'view' }}
  },
  {
    path:'fences',
    component:FencesComponent,
    canActivate:[PermissionGuard],
    data:{permission: { module: 'clotures', action: 'view' }}
  }
  // ,
  // {
  //   path:'margins-settings',
  //   component:MarginexpendituresettingsComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancesPageRoutingModule {}
