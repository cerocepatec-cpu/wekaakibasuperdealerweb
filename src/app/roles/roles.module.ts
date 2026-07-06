import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RolesPageRoutingModule } from './roles-routing.module';

import { RolesPage } from './roles.page';
import { PickrolesComponent } from './pickroles/pickroles.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { MatMenuModule } from '@angular/material/menu';
import { NewroleComponent } from './newrole/newrole.component';
import { EditroleComponent } from './editrole/editrole.component';
import { DetailroleComponent } from './detailrole/detailrole.component';
import { SharedModule } from "src/app/shared/shared.module";
import { MatTabsModule } from '@angular/material/tabs';
import { PickpermissionsComponent } from '../pickpermissions/pickpermissions.component';
import { RoleparticipantsComponent } from '../roleparticipants/roleparticipants.component';
import { PermissionparticipantsComponent } from '../permissionparticipants/permissionparticipants.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RolesPageRoutingModule,
    MatMenuModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    SharedModule,
    MatTabsModule,
    MatMenuModule
],
  declarations: [
    RolesPage,
    PickrolesComponent,
    PermissionsComponent,
    NewroleComponent, 
    EditroleComponent,
    DetailroleComponent,
    PickpermissionsComponent,
    RoleparticipantsComponent,
    PermissionparticipantsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RolesPageModule {}
