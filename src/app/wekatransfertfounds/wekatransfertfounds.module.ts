import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { WekatransfertfoundsPageRoutingModule } from './wekatransfertfounds-routing.module';
import { MatInputModule } from '@angular/material/input';
import { WekatransfertfoundsPage } from './wekatransfertfounds.page';
import { SharedModule } from '../shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NewwekatransfertfoundsComponent } from './newwekatransfertfounds/newwekatransfertfounds.component';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { ScrollStrategy,Overlay } from '@angular/cdk/overlay';
import { TagInputModule } from 'ngx-chips';
import { WekamemberaccountpickerComponent } from '../wekamemberaccountpicker/wekamemberaccountpicker.component';

export function autocompleteScrollStrategyFactory(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    WekatransfertfoundsPageRoutingModule,
    MatMenuModule,
    SharedModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    TagInputModule
  ],
  providers:
  [
    {
      provide:MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useFactory:autocompleteScrollStrategyFactory,
      deps:[Overlay]
    }
  ],
  declarations: [
    WekatransfertfoundsPage,
    NewwekatransfertfoundsComponent,
    WekamemberaccountpickerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WekatransfertfoundsPageModule {}
