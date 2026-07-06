import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalariesPage } from './salaries.page';

const routes: Routes = [
  {
    path: '',
    component: SalariesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalariesPageRoutingModule {}
