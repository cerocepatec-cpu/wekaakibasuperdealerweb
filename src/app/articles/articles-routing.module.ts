import { ServicescategoriesComponent } from './servicescategories/servicescategories.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticlesPage } from './articles.page';
import { UnitofmeasuresComponent } from './unitofmeasures/unitofmeasures.component';
import { CustomerscategoriesComponent } from './customerscategories/customerscategories.component';
import { CatalogueproductsComponent } from './catalogueproducts/catalogueproducts.component';

const routes: Routes = [
  {
    path: '',
    component: ArticlesPage
  },
  {
    path:'services-categories',
    component:ServicescategoriesComponent
  },
  {
    path:'uom',
    component:UnitofmeasuresComponent
  },
  {
    path:'customers-categories',
    component:CustomerscategoriesComponent
  },
  {
    path:'catalogue',
    component:CatalogueproductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesPageRoutingModule {}
