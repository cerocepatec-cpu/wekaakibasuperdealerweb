import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SnapshotsPage } from './snapshots.page';

const routes: Routes = [
  {
    path: '',
    component: SnapshotsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SnapshotsPageRoutingModule {}
