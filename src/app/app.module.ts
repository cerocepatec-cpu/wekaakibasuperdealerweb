import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { GlobalErrorHandler } from './core/error-handler/global-error-handler';
import { HashLocationStrategy,LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SelectmoneyComponent } from './selectmoney/selectmoney.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ServicescategoriesComponent } from './articles/servicescategories/servicescategories.component';
import { UnitofmeasuresComponent } from './articles/unitofmeasures/unitofmeasures.component';
import { CustomerscategoriesComponent } from './articles/customerscategories/customerscategories.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ConnectionServiceModule } from 'ng-connection-service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ImportComponent } from './import/import.component';
import { TopmenuComponent } from './topmenu/topmenu.component';
import { LeftmenuComponent } from './leftmenu/leftmenu.component';
import { RightmenuComponent } from './rightmenu/rightmenu.component';
import { PosSettingsComponent } from './pos-settings/pos-settings.component';
import { PrintinvoiceposComponent } from './printinvoicepos/printinvoicepos.component';
import { TextinputsetupComponent } from './textinputsetup/textinputsetup.component';
import { RapportgeneralComponent } from './rapportgeneral/rapportgeneral.component';
import { MatTabsModule } from '@angular/material/tabs';
import {BarcodeGeneratorAllModule} from '@syncfusion/ej2-angular-barcode-generator';
import { QRCodeGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';
import { DataMatrixGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';
import { TubdetailsComponent } from './tubdetails/tubdetails.component';
import { NewtransfertfoundComponent } from './tubs/transfertfound/newtransfertfound/newtransfertfound.component';
import { ModalListOperationsbyfundsComponent } from './tubs/modal-list-operationsbyfunds/modal-list-operationsbyfunds.component';
import { NewoperationtubComponent } from './tubs/newoperationtub/newoperationtub.component';
import { PicktubsComponent } from './tubs/picktubs/picktubs.component';
import { TransfertfoundComponent } from './tubs/transfertfound/transfertfound.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectCashAccountSheetComponent } from './select-cash-account-sheet/select-cash-account-sheet.component';
import { SharedModule } from './shared/shared.module';
import { NotificationsCenterComponent } from './notificationscenter/notificationscenter.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

const routerConfig: ExtraOptions={
  preloadingStrategy:PreloadAllModules,
  scrollPositionRestoration:'enabled',
  useHash:true
}
@NgModule({
  declarations: [
    AppComponent,
    SelectmoneyComponent,
    ServicescategoriesComponent,
    UnitofmeasuresComponent,
    CustomerscategoriesComponent,
    NotificationsComponent,
    ImportComponent,
    TopmenuComponent,
    LeftmenuComponent,
    RightmenuComponent,
    PosSettingsComponent,
    PrintinvoiceposComponent,
    TextinputsetupComponent,
    RapportgeneralComponent,
    TubdetailsComponent,
    ModalListOperationsbyfundsComponent,
    NewoperationtubComponent,
    PicktubsComponent,
    TransfertfoundComponent,
    SelectCashAccountSheetComponent,
    TransfertfoundComponent,
    NewtransfertfoundComponent,
    NotificationsCenterComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    MatIconModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    ConnectionServiceModule,
    Ng2SearchPipeModule,
    BarcodeGeneratorAllModule,
    QRCodeGeneratorAllModule,
    DataMatrixGeneratorAllModule,
    SharedModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {provide:ErrorHandler,useClass:GlobalErrorHandler},
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide:LocationStrategy,useClass:HashLocationStrategy},
    {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
