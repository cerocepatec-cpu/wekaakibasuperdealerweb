import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from './skeleton-loader/skeleton-loader.component';
import { IonicModule } from '@ionic/angular';
import { PinVerificationComponent } from '../pin-verification/pin-verification.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MembersAutocompleteComponent } from '../members-autocomplete/members-autocomplete.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [SkeletonLoaderComponent,PinVerificationComponent,MembersAutocompleteComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
    Ng2SearchPipeModule
  ],
  exports:[
      SkeletonLoaderComponent,PinVerificationComponent,MembersAutocompleteComponent
  ]
})
export class SharedModule { }
