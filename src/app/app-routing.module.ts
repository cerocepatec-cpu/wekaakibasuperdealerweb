import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes} from '@angular/router';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [

  {
    path:'',
    redirectTo:'/splash',
    pathMatch:'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canLoad: [IntroGuard]
  },
  {
    path: 'logout',
    loadChildren:  () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./intro/intro.module').then( m => m.IntroPageModule)
  },

  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule),
    canLoad: [IntroGuard]
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./module/uzisha/home/home.module').then( m => m.HomePageModule),
  },
  {
    path: 'uzisha',
    loadChildren: () => import('./module/uzisha/uzisha.module').then( m => m.UzishaPageModule),
  },
  {
    path: 'firstentries',
    loadChildren: () => import('./firstentries/firstentries.module').then( m => m.FirstentriesPageModule)
  },
  {
    path: 'salaries',
    loadChildren: () => import('./salaries/salaries.module').then( m => m.SalariesPageModule)
  },
  {
    path: 'wekatransfertfounds',
    loadChildren: () => import('./wekatransfertfounds/wekatransfertfounds.module').then( m => m.WekatransfertfoundsPageModule)
  },
  {
    path: 'credit-dashboard',
    loadChildren: () => import('./credit-dashboard/credit-dashboard.module').then( m => m.CreditDashboardPageModule)
  },
  {
    path: 'rules',
    loadChildren: () => import('./rules/rules/rules.module').then( m => m.RulesPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
