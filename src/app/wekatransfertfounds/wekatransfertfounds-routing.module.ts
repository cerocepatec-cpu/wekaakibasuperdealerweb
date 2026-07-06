import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WekatransfertfoundsPage } from './wekatransfertfounds.page';

const routes: Routes = [
  {
    path: '',
    component: WekatransfertfoundsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WekatransfertfoundsPageRoutingModule {}
