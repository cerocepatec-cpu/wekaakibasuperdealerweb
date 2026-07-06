import { Route, RouterModule } from '@angular/router';
import { UzishaPage } from './uzisha.page';
import { RapportgeneralComponent } from '../../rapportgeneral/rapportgeneral.component';
import { VerificationComponent } from './verification/verification.component';
import { NgModule } from '@angular/core';
import { MarginexpendituresettingsComponent } from 'src/app/finances/expenditures/marginexpendituresettings/marginexpendituresettings.component';
import { TubsComponent } from 'src/app/tubs/tubs.component';
import { TransactionsComponent } from 'src/app/transactions/transactions.component';
import { MembersactivationComponent } from 'src/app/membersactivation/membersactivation.component';
import { WekagroupsComponent } from 'src/app/wekagroups/wekagroups.component';
import { SalariesPage } from 'src/app/salaries/salaries.page';
import { AdvancesalariesgeneralviewComponent } from 'src/app/advancesalariesgeneralview/advancesalariesgeneralview.component';
import { FichesdepaieComponent } from 'src/app/fichesdepaie/fichesdepaie.component';
import { WekaakibaadmindashboardComponent } from 'src/app/wekaakibaadmindashboard/wekaakibaadmindashboard.component';
import { ExpendituresComponent } from 'src/app/finances/expenditures/expenditures.component';
import { WelcomepageComponent } from 'src/app/welcomepage/welcomepage.component';
import { SponsorshipComponent } from 'src/app/sponsorship/sponsorship.component';
import { DetailsponsorshipComponent } from 'src/app/detailsponsorship/detailsponsorship.component';
import { DepartementsComponent } from 'src/app/departements/departements.component';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { PermissionsComponent } from 'src/app/roles/permissions/permissions.component';
import { ForbiddenComponent } from 'src/app/forbidden/forbidden.component';
import { CreditDetailsComponent } from 'src/app/credit-details/credit-details.component';
import { AgentBonusReportComponent } from 'src/app/agent-bonus-report/agent-bonus-report.component';
import { SnapshotDetailComponent } from 'src/app/revenue/snapshots/snapshot-detail/snapshot-detail.component';
import { ExchangeRateComponent } from 'src/app/exchange-rate/exchange-rate.component';
import { TransactionFeesComponent } from 'src/app/transaction-fees/transaction-fees.component';
import { NotebooksalesComponent } from 'src/app/notebooksales/notebooksales.component';
import { MobileVersionUploadComponent } from 'src/app/mobile-version-upload/mobile-version-upload.component';
import { TransactionlimitconfigComponent } from 'src/app/transactionlimitconfig/transactionlimitconfig.component';
import { CitiesComponent } from 'src/app/cities/cities.component';
import { VirtualsalesComponent } from 'src/app/virtualsales/virtualsales.component';

const uzishaRoutes: Route[] = [
  {
    path: '',
    component: UzishaPage,
    children: [
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full',
      },
      {
        path: 'generalreport',
        component: RapportgeneralComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'transactions', action: 'view' } },
      },
      {
        path: 'welcome',
        component: WelcomepageComponent,
      },
      {
        path: 'accounts',
        loadChildren: () =>
          import('../../accounts/accounts.module').then(
            (m) => m.AccountsPageModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'comptes', action: 'view' } },
      },
      {
        path: 'test',
        component: VerificationComponent,
      },
      {
        path: 'agents',
        loadChildren: () =>
          import('../../agents/agents.module').then((m) => m.AgentsPageModule),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'agents', action: 'view' } },
      },
      {
        path: 'firstentries',
        loadChildren: () =>
          import('../../firstentries/firstentries.module').then(
            (m) => m.FirstentriesPageModule
          ),
        canActivate: [PermissionGuard],
        // data: { permission: { module: 'accounts', action: 'first_entries' } },
      },
      {
        path: 'articles',
        loadChildren: () =>
          import('../../articles/articles.module').then(
            (m) => m.ArticlesPageModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'produits', action: 'view' } },
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('../../customers/customers.module').then(
            (m) => m.CustomersPageModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'clients', action: 'view' } },
      },
      {
        path: 'stock',
        loadChildren: () =>
          import('../../stock/stock.module').then((m) => m.StockPageModule),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'stock', action: 'view' } },
      }, 
      {
        path: 'virtualsales',
       component: VirtualsalesComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'transactions', action: 'salevirtual' } },
      },
      {
        path: 'finances',
        loadChildren: () =>
          import('../../finances/finances.module').then(
            (m) => m.FinancesPageModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'rapports', action: 'finances' } },
      },
      {
        path: 'providers',
        loadChildren: () =>
          import('../../providers/providers.module').then(
            (m) => m.ProvidersPageModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'fournisseurs', action: 'view' } },
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('../../tables/tables.module').then((m) => m.TablesPageModule),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'tables', action: 'view' } },
      },
      {
        path: 'servants',
        loadChildren: () =>
          import('../../servants/servants.module').then(
            (m) => m.ServantsPageModule
          ),
        //canLoad: [AuthGuard]
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('../../orders/orders.module').then((m) => m.OrdersPageModule),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'commandes', action: 'view' } },
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../../reports/reports.module').then(
            (m) => m.ReportsPageModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'rapports', action: 'view' } },
      },
      {
        path: 'tabs',
        loadChildren: () =>
          import('../../tabs/tabs.module').then((m) => m.TabsPageModule),
        //canLoad: [AuthGuard]
      },
      {
        path: 'forbidden',
        component: ForbiddenComponent,
      },
      {
        path: 'othersentries',
        loadChildren: () =>
          import('../../othersentries/othersentries.module').then(
            (m) => m.OthersentriesPageModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'entree_argent', action: 'view' } },
      },
      {
        path: 'deposits',
        loadChildren: () =>
          import('../../deposits/deposits.module').then(
            (m) => m.DepositsPageModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'depots', action: 'view' } },
      },
      {
        path: 'enterprises',
        loadChildren: () =>
          import('../../enterprises/enterprises.module').then(
            (m) => m.EnterprisesPageModule
          ),
        // canLoad: [IntroGuard]
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('../../roles/roles.module').then((m) => m.RolesPageModule),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'roles', action: 'view' } },
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../../settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'entreprise', action: 'edit' } },
      },
      {
        path: 'sycingdata',
        loadChildren: () =>
          import('../../sycingdata/sycingdata.module').then(
            (m) => m.SycingdataPageModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'syncing', action: 'view' } },
      },
      {
        path: 'debts',
        loadChildren: () =>
          import('../../debts/debts.module').then((m) => m.DebtsPageModule),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'debts', action: 'view' } },
      },
      {
        path: 'moneys',
        loadChildren: () =>
          import('../../moneys/moneys.module').then((m) => m.MoneysPageModule),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'moneys', action: 'view' } },
      },
      {
        path: 'pointofsales',
        loadChildren: () =>
          import('../../pointofsales/pointofsales.module').then(
            (m) => m.PointofsalesPageModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'facturation', action: 'view' } },
      },
      {
        path: 'settingmargins',
        component: MarginexpendituresettingsComponent,
      },
      {
        path: 'sponsoring',
        component: SponsorshipComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'sponsoring', action: 'view' } },
      },
      {
        path: 'detailsponsoring',
        component: DetailsponsorshipComponent,
      },
      {
        path: 'expenditures',
        component: ExpendituresComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'depenses', action: 'view' } },
      },
      {
        path: 'tubs',
        component: TubsComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'caisses', action: 'view' } },
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'transactions', action: 'view' } },
      },
      {
        path: 'membersactivation',
        component: MembersactivationComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'agents', action: 'edit' } },
      },
      {
        path: 'groups',
        component: WekagroupsComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'agents', action: 'groups_view' } },
      },
      {
        path: 'salaries',
        component: SalariesPage,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'salaries', action: 'view' } },
      },
      {
        path: 'salariesadvancesview',
        component: AdvancesalariesgeneralviewComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'agents', action: 'advancesalaries' } },
      },
      {
        path: 'fichesalaires',
        component: FichesdepaieComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'agents', action: 'view' } },
      },
      {
        path: 'wekaadmindashboard',
        component: WekaakibaadmindashboardComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'rapports', action: 'finances' } },
      },
      {
        path: 'departements',
        component: DepartementsComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'departements', action: 'view' } },
      },
      {
        path: 'permissions',
        component: PermissionsComponent,
        canActivate: [PermissionGuard],
        data: { permission: { module: 'permissions', action: 'view' } },
      },
      {
        path: 'credits',
        loadChildren: () =>
          import('../../credit-dashboard/credit-dashboard.module').then(
            (m) => m.CreditDashboardPageModule
          ),
      },
      {
        path: 'wekatransfertfound',
        loadChildren: () =>
          import('../../wekatransfertfounds/wekatransfertfounds.module').then(
            (m) => m.WekatransfertfoundsPageModule
          ),
        canActivate: [PermissionGuard],
        data: { permission: { module: 'transactions', action: 'transfert' } },
      },
      {
        path: 'credit-details/:id',
        component: CreditDetailsComponent,
      },
      {
        path: 'agents-bonuses',
        component: AgentBonusReportComponent,
      },
      {
        path: 'revenue/snapshots/:id',
        component: SnapshotDetailComponent,
      },
      {
        path: 'exchanges',
        component: ExchangeRateComponent,
      },
      {
        path: 'transaction-fees',
        component:TransactionFeesComponent,
      }, 
      {
        path: 'notebook-sales',
        component:NotebooksalesComponent,
      },
      {
        path: 'snapshots',
        loadChildren: () =>
          import('../../revenue/snapshots/snapshots.module').then(
            (m) => m.SnapshotsPageModule
          ),
      },
      {
        path: 'rules',
        loadChildren: () =>
          import('../../rules/rules/rules.module').then(
            (m) => m.RulesPageModule
          ),
      },
      {
        path:'apkcdnupload',
        component:MobileVersionUploadComponent
      },
      {
        path:'transactions-limit',
        component:TransactionlimitconfigComponent
      },
      {
        path:'cities',
        component:CitiesComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(uzishaRoutes)],
  exports: [RouterModule],
})
export class UzishaPageRoutingModule {}
