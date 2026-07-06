import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SnapshotsPageRoutingModule } from './snapshots-routing.module';

import { SnapshotsPage } from './snapshots.page';
import { SnapshotDetailComponent } from './snapshot-detail/snapshot-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateSnapshotComponent } from './create-snapshot/create-snapshot.component';
import { ExchangeRateComponent } from 'src/app/exchange-rate/exchange-rate.component';
import { ExchangeRateFormComponent } from 'src/app/exchange-rate/exchange-rate-form/exchange-rate-form.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    Ng2SearchPipeModule,
    SnapshotsPageRoutingModule,
  ],
  declarations: [
    SnapshotsPage,
    SnapshotDetailComponent,
    CreateSnapshotComponent,
    ExchangeRateComponent,
    ExchangeRateFormComponent
  ],
})
export class SnapshotsPageModule {}
