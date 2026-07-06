import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SycingdataPage } from './sycingdata.page';

const routes: Routes = [
  {
    path: '',
    component: SycingdataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SycingdataPageRoutingModule {}
