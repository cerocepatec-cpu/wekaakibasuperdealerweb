import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirstentriesPage } from './firstentries.page';

const routes: Routes = [
  {
    path: '',
    component: FirstentriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FirstentriesPageRoutingModule {}
