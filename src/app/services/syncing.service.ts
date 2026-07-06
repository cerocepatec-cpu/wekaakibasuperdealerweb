import { Menu } from './../interfaces/menu';
import { AppservicesService } from 'src/app/services/appservices.service';
import { Injectable } from '@angular/core';
import { Users } from 'src/app//interfaces/users';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { MoneyService } from 'src/app/services/money.service';
import { ConversionMoneysService } from 'src/app/services/conversion-moneys.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { DepositsService } from 'src/app/services/deposits.service';
import { UnitofmeasureService } from 'src/app/services/unitofmeasure.service';
import { CategoryserviceService } from 'src/app/services/categoryservice.service';
import { CustomersService } from 'src/app/services/customers.service';
import { AccountService } from 'src/app/services/account.service';
import { TableService } from 'src/app/services/table.service';
import { ServantsService } from 'src/app/services/servants.service';
import { OthersentriesService } from './othersentries.service';
import { ExpendituresService } from './expenditures.service';
import { InvoiceService } from './invoice.service';
import { StockService } from './stock.service';
import { DebtsService } from './debts.service';
import { PaymentsService } from './payments.service';
import { Observable } from 'rxjs';
import { MarginsSettingsService } from './margins-settings.service';

@Injectable({
  providedIn: 'root'
})
export class SyncingService {

  constructor(private marginexpserv: MarginsSettingsService, private paymentServ: PaymentsService, private debtServ: DebtsService, private stockServ: StockService, private invoiceserv: InvoiceService, private customerServ: CustomersService, private expendServ: ExpendituresService, private otherEntrServ: OthersentriesService, private authService:AuthentificationService, private servantserv:ServantsService, private tableserv:TableService, private accountserv:AccountService, private customerserv:CustomersService, private categarticleserv:CategoryserviceService, private uomserv :UnitofmeasureService, private depositserv:DepositsService, private articleserv:ArticlesService, private conversionserv:ConversionMoneysService, private moneyserv:MoneyService,private Userserv:UsersService,public appserv: AppservicesService,private route: Router) {
  }

  /**
   * Send SafeGuards
   */
  sendSafeGuards(data:any):Observable<any[]>{
    return this.appserv.http.post<any[]>(this.appserv.apiUrl +'/safeguards',data);
  }

  safeguardinvoices(data:any):Observable<any>{
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/safeguards/invoices',data);
  }

  /**
  * Getting Offline data for syncing
  */

  getSyncingOffLinePayments(){
    return this.paymentServ.getSyncingOfflineData();
  } 
  
  getSyncingOffLineDebts(){
    return this.debtServ.getSyncingOfflineData();
  }
  
  getSyncingOffLineStockHistories(){
    return this.stockServ.getSyncingOfflineData();
  } 
  
  getSyncingOffLineInvoices(){
    return this.invoiceserv.getSyncingOfflineData();
  }  
  
  getSyncingCustomers(){
    return this.customerServ.getSyncingOfflineData();
  } 
  
  getSyncingExpenditures(){
    return this.expendServ.getSyncingOfflineData();
  }
  
  getSyncingEntries(){
    return this.otherEntrServ.getSyncingOfflineData();
  }

   /**
   * Recuperate all data from the API for allowing user to work with Offline Data
   */
  gettingAllDataFromApi(){
    //Users
    this.getUsersList();

    //Moneys
     this.getMoneysList();

    //Conversions
    this.getConversionsList();

    //Products Categories
    this.getCategoriesArticles()

    //UOM
    this.getUomList();

    //Services
    // this.getProductsList();

    //Customers Categories
    this.getCustomersCategoriesList();

    //Customers
    // this.getCustomersList();

    //Accounts
    // this.getAccountsList();

    //Deposits
    this.getDeposits();

    //Deposits Articles
    // this.getDepositProducts();

    //Tables
    // this.getTablesList();

    //Servants
    // this.getServantsList();

    //Ese
    this.getEseInfos();

    //limit for expenditures
    this.getlimitsexpenditure();
  }

  getCustomersList(){

  }
  
  getlimitsexpenditure(){
    this.marginexpserv.forspecificuser(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        if (data.msg==='find') {
          this.marginexpserv.setofflinedata(data.data); 
        }
        else{
          this.marginexpserv.setofflinedata({});
        }
      }); 
  }

  getEseInfos(){
    this.authService.getingEseInfos(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.appserv.setactualenterprise(data);
      });   
  }

  getServantsList(){
    this.servantserv.getall(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.servantserv.setofflinedata(data);
      });
  }

  getTablesList(){
    this.tableserv.getlist(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.tableserv.setofflinedata(data);
      });
  }

  getAccountsList(){
    this.accountserv.getall(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.accountserv.setOfflineData(data);
      });
  }

  // getCustomersList(){
  //   this.customerserv.getallcustomers(this.appserv.getactualuser().enterprise_id).subscribe(
  //     data=>{
  //       this.customerserv.setofflinedata(data);
  //     });
  // }

  getCustomersCategoriesList(){
    this.customerserv.getlistcustomerscategories(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.customerserv.setOfflineCustomersCategories(data);
      });
  }

  getUsersList(){
    this.Userserv.getlistusers(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.Userserv.setOfflineData(data);
      });
  }
  
  getMoneysList(){
    this.moneyserv.getlistmonnaiesapi(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.moneyserv.setOfflineData(data);
      });
  }

    getConversionsList(){
      this.conversionserv.getListConversionsApi(this.appserv.getactualEse().id).subscribe(
        data => {
          this.conversionserv.setOfflineData(data);
        });
    }

    // getDepositProducts(){
    //   const object={'user_id':this.appserv.getactualuser().id};
    //   this.articleserv.serviceslist(object).subscribe(
    //     data=>{
    //       localStorage.setItem('depositArticles',JSON.stringify(data));
    //     });
    // }

    getDeposits(){
      this.depositserv.getalldepositslist(this.appserv.getactualuser().enterprise_id).subscribe(
        data=>{
          this.depositserv.setOfflineData(data);
        });
    }

    getUomList(){
      this.uomserv.getallunitofmeasure(this.appserv.getactualuser().enterprise_id).subscribe(
        data=>{
          //save to local storage
          localStorage.setItem('unitofmeasures',JSON.stringify(data));
        });
    }

    getProductsList(){
      this.articleserv.enterpriseservices(this.appserv.getactualuser().enterprise_id).subscribe(
        data=>{
          localStorage.setItem('articles',JSON.stringify(data));
        });
    }

    getCategoriesArticles(){
      this.categarticleserv.getallcategoriesarticles(this.appserv.getactualuser().enterprise_id).subscribe(
        data=>{
          localStorage.setItem('categoriesartiles',JSON.stringify(data));
        });
    }

    
}
