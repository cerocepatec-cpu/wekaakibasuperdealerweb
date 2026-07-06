import { AchieveinvoiceComponent } from './achieveinvoice/achieveinvoice.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { CartpreviewComponent } from './cartpreview/cartpreview.component';
import { TipquantityComponent } from './tipquantity/tipquantity.component';
import { PaymentmodeComponent } from './paymentmode/paymentmode.component';
import { ReductionenterComponent } from './reductionenter/reductionenter.component';
import { VatenterComponent } from './vatenter/vatenter.component';
import { ServicepricespickerComponent } from './servicepricespicker/servicepricespicker.component';
import { PicktypesinvoiceComponent } from './picktypesinvoice/picktypesinvoice.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    MatSlideToggleModule,
    MatIconModule,
    Ng2SearchPipeModule
  ],
  declarations: [Tab2Page,CartpreviewComponent,TipquantityComponent,PaymentmodeComponent,ReductionenterComponent,VatenterComponent, ServicepricespickerComponent,AchieveinvoiceComponent,PicktypesinvoiceComponent]
})
export class Tab2PageModule {}
