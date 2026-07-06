import { EditservicecategoryComponent } from './editservicecategory/editservicecategory.component';
import { CustomerpickersComponent } from './customerpickers/customerpickers.component';
import { SelectanarticleComponent } from './selectanarticle/selectanarticle.component';
import { StockhistoryComponent } from './stockhistory/stockhistory.component';
import { EditserviceComponent } from './editservice/editservice.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ArticlesPageRoutingModule } from './articles-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ArticlesPage } from './articles.page';
import { NewserviceComponent } from './newservice/newservice.component';
import { NewcategoryComponent } from './newcategory/newcategory.component';
import { NewunitofmeasureComponent } from './newunitofmeasure/newunitofmeasure.component';
import { CalendarpickerComponent } from './calendarpicker/calendarpicker.component';
import { AttachmentsforallpickerComponent } from './attachmentsforallpicker/attachmentsforallpicker.component';
import { DepositpickerComponent } from './depositpicker/depositpicker.component';
import { TypedocumentpickerComponent } from './typedocumentpicker/typedocumentpicker.component';
import { AddnewdocumentComponent } from './addnewdocument/addnewdocument.component';
import { ProviderpickerComponent } from './providerpicker/providerpicker.component';
import { AddnewcustomerComponent } from './addnewcustomer/addnewcustomer.component';
import { AddrefdocumentComponent } from './addrefdocument/addrefdocument.component';
import { NewpricecategorieComponent } from './newpricecategorie/newpricecategorie.component';
import { NewmoneyformComponent } from './newmoneyform/newmoneyform.component';
import { EditpricecategoryComponent } from './editpricecategory/editpricecategory.component';
import { InfosServiceComponent } from './customerpickers/infos-service/infos-service.component';
import { ReportdatesfilterComponent } from './reportdatesfilter/reportdatesfilter.component';
import {MatSelectModule} from '@angular/material/select';
import { EdituomComponent } from './edituom/edituom.component';
import { PrintgeneraldetailsComponent } from './printgeneraldetails/printgeneraldetails.component';
import { CategoriepickerComponent } from './categoriepicker/categoriepicker.component';
import { ReportsalesComponent } from './reportsales/reportsales.component';
import { PickservicesComponent } from './pickservices/pickservices.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ScanbarcodeComponent } from './scanbarcode/scanbarcode.component';
import { CatalogueproductsComponent } from './catalogueproducts/catalogueproducts.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ArticlesPageRoutingModule,
    MatIconModule,
    MatMenuModule,
    HttpClientModule,
    MatSelectModule,
    Ng2SearchPipeModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatTabsModule,
  ],
  declarations: [
    ArticlesPage,
    NewserviceComponent,
    NewcategoryComponent,
    NewunitofmeasureComponent,
    EditserviceComponent,
    StockhistoryComponent,
    SelectanarticleComponent,
    CalendarpickerComponent,
    AttachmentsforallpickerComponent,
    DepositpickerComponent,
    TypedocumentpickerComponent,
    AddnewdocumentComponent,
    ProviderpickerComponent,
    AddnewcustomerComponent,
    AddrefdocumentComponent,
    NewpricecategorieComponent,
    NewmoneyformComponent,
    EditpricecategoryComponent,
    InfosServiceComponent,
    ReportdatesfilterComponent,
    CustomerpickersComponent,
    EditservicecategoryComponent,
    EdituomComponent,
    PrintgeneraldetailsComponent,
    CategoriepickerComponent,
    ReportsalesComponent,
    PickservicesComponent,
    ScanbarcodeComponent,
    CatalogueproductsComponent
  ]
})
export class ArticlesPageModule {}
