import { DepositComponent } from './deposit/deposit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockPage } from './stock.page';
import { StockhistoryComponent } from './stockhistory/stockhistory.component';
import { InventoryComponent } from './inventory/inventory.component';
import { TransfertComponent } from './transfert/transfert.component';
import { RequestapprovmentComponent } from './requestapprovment/requestapprovment.component';
import { PrintCarnetsComponent } from '../print-carnets/print-carnets.component';

const routes: Routes = [
  {
    path: '',
    component: StockPage
  },
  {
    path:'deposits',
    component:DepositComponent
  },
  {
    path:'story',
    component:StockhistoryComponent
  },
  {
    path:'inventory',
    component:InventoryComponent
  },
  {
    path:'transfert',
    component:TransfertComponent
  },
  {
    path:'requestapprovment',
    component:RequestapprovmentComponent
  },
  {
  path:'print-carnets',
  component:PrintCarnetsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockPageRoutingModule {}
