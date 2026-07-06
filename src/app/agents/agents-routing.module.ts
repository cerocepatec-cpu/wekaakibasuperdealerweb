import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgentsPage } from './agents.page';
import { PickrolesComponent } from '../roles/pickroles/pickroles.component';

const routes: Routes = [
  {
    path: '',
    component: AgentsPage
  },
  {
    path: 'roleList',
    component: PickrolesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentsPageRoutingModule {}
