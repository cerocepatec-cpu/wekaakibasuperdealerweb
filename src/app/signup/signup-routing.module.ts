import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupPage } from './signup.page';
import { OwnerinfosComponent } from './ownerinfos/ownerinfos.component';
import { EnterpriseinfosComponent } from './enterpriseinfos/enterpriseinfos.component';

const routes: Routes = [
  {
    path: '',
    component: SignupPage
  },
  {
    path:'ownerinfos',
    component:OwnerinfosComponent
  },
  {
    path:'enterprise',
    component:EnterpriseinfosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPageRoutingModule {}
