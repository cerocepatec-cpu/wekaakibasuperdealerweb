import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoneysPage } from './moneys.page';

const routes: Routes = [
  {
    path: '',
    component: MoneysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoneysPageRoutingModule {}
