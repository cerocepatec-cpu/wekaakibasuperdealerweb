import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnterprisesPage } from './enterprises.page';

const routes: Routes = [
  {
    path: '',
    component: EnterprisesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterprisesPageRoutingModule {}
