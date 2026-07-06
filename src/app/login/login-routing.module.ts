import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { ForgetpasswordComponent } from '../forgetpassword/forgetpassword.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
  // },
  // {
  //   path: 'forgetpassword',
  //   component:ForgetpasswordComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
