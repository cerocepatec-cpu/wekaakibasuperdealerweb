import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OthersentriesPage } from './othersentries.page';

const routes: Routes = [
  {
    path: '',
    component: OthersentriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OthersentriesPageRoutingModule {}
