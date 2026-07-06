import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgentsPageRoutingModule } from './agents-routing.module';
import { AgentsPage } from './agents.page';
import { UserpickerComponent } from './userpicker/userpicker.component';
import { MatMenuModule } from '@angular/material/menu';
import { NewagentComponent } from './newagent/newagent.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { InfosagentComponent } from './infosagent/infosagent.component';
import { MatIconModule } from '@angular/material/icon';
import { SecurityComponent } from './security/security.component';
import { ChangepermissionsComponent } from './changepermissions/changepermissions.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MembersaccountsComponent } from '../membersaccounts/membersaccounts.component';
import { SponsorshipComponent } from '../sponsorship/sponsorship.component';
import { DetailsponsorshipComponent } from '../detailsponsorship/detailsponsorship.component';
import { AddnewponsoredComponent } from '../addnewponsored/addnewponsored.component';
import { DetailmemberaccountComponent } from '../detailmemberaccount/detailmemberaccount.component';
import { SharedModule } from '../shared/shared.module';
import { UserPermissionsComponent } from '../user-permissions/user-permissions.component';
import { EditagentComponent } from './editagent/editagent.component';
import { UserpickerforsaleComponent } from './userpickerforsale/userpickerforsale.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgentsPageRoutingModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    Ng2SearchPipeModule,
    SharedModule
  ],
  declarations: [
    AgentsPage,
    UserpickerComponent,
    UserpickerforsaleComponent,
    NewagentComponent,
    SubscriptionsComponent,
    InfosagentComponent,
    SecurityComponent,
    ChangepermissionsComponent,
    MembersaccountsComponent,
    SponsorshipComponent,
    DetailsponsorshipComponent,
    AddnewponsoredComponent,
    DetailmemberaccountComponent,
    UserPermissionsComponent,
    EditagentComponent
  ]
})
export class AgentsPageModule {}
