import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import {MatIconModule} from '@angular/material/icon';
import { Tab3PageRoutingModule } from './tab3-routing.module';
import { BluetoothdevicesComponent } from './bluetoothdevices/bluetoothdevices.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule,
    MatIconModule
  ],
  declarations: [Tab3Page,BluetoothdevicesComponent]
})
export class Tab3PageModule {

}
