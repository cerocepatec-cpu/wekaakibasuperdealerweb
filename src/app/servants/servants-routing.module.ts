import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServantsPage } from './servants.page';

const routes: Routes = [
  {
    path: '',
    component: ServantsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServantsPageRoutingModule {}
