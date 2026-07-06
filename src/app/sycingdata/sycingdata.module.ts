import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SycingdataPageRoutingModule } from './sycingdata-routing.module';

import { SycingdataPage } from './sycingdata.page';
import { MatTabsModule} from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SycingdataPageRoutingModule,
    MatTabsModule,
    MatIconModule
  ],
  declarations: [SycingdataPage]
})
export class SycingdataPageModule {}
