import { InvoiceslistComponent } from './invoiceslist/invoiceslist.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomersPageRoutingModule } from './customers-routing.module';

import { CustomersPage } from './customers.page';
import { MatMenuModule } from '@angular/material/menu';
import { EditcustomerComponent } from './editcustomer/editcustomer.component';
import { InfoscustomerComponent } from './infoscustomer/infoscustomer.component';
import { ComptecourantComponent } from './comptecourant/comptecourant.component';
import { BonusclientComponent } from './bonusclient/bonusclient.component';
import { CautionsclientComponent } from './cautionsclient/cautionsclient.component';
import { PointsclientComponent } from './pointsclient/pointsclient.component';
import { NewcautionComponent } from './cautionsclient/newcaution/newcaution.component';
import { EditcategoryComponent } from './editcategory/editcategory.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PrintlistinvoicesComponent } from './invoiceslist/printlistinvoices/printlistinvoices.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomersPageRoutingModule,
    MatMenuModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule
  ],
  declarations: [CustomersPage,EditcustomerComponent,InfoscustomerComponent,InvoiceslistComponent,ComptecourantComponent,BonusclientComponent,CautionsclientComponent,PointsclientComponent,NewcautionComponent,EditcategoryComponent,PrintlistinvoicesComponent]
})
export class CustomersPageModule {}
