import { Component, OnInit } from '@angular/core';
import { SyncingService } from '../services/syncing.service';
import { AppservicesService } from '../services/appservices.service';
import { SyncingdataviewerComponent } from '../module/uzisha/home/syncingdataviewer/syncingdataviewer.component';
import { DataSyncingOptions } from '../interfaces/datasycing';
import { ArticlesService } from '../services/articles.service';
import { articlePaginator } from '../interfaces/articlespaginator';
import { CustomersService } from '../services/customers.service';
import { TableService } from '../services/table.service';
import { AccountService } from '../services/account.service';
import { ServantsService } from '../services/servants.service';
import { ConversionMoneysService } from '../services/conversion-moneys.service';
import { MoneyService } from '../services/money.service';
import { DepositsService } from '../services/deposits.service';
import { Deposits } from '../interfaces/deposit';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-sycingdata',
  templateUrl: './sycingdata.page.html',
  styleUrls: ['./sycingdata.page.scss'],
})
export class SycingdataPage implements OnInit {
canSync=0;
comment='';
syngingData : DataSyncingOptions ={};
showprogress=false;
paginationOptions : articlePaginator={};
listdeposits: Deposits[]=[];

  constructor(private invoiceServ:InvoiceService, private depositserv:DepositsService, private moneyserv: MoneyService, private conversionserv: ConversionMoneysService, private servantServ:ServantsService, private accountserv:AccountService, private tableServ:TableService, public syncingServ: SyncingService, public appserv: AppservicesService, private articleServ: ArticlesService, private customerServ: CustomersService) { }

  ngOnInit() {
    this.canSync=this.SyncingDataLength();
  }
 
  async getallservicesdatafordeposits(){
    //remove old data
    this.depositserv.removedepositarticles();
    this.syngingData.productsToSellLoading=true;
    this.depositserv.getallservicesfordeposits(this.appserv.actualUser.id).subscribe(
      (data:articlePaginator)=>{
        console.log("data to save in local",data.data);
        this.depositserv.setOffLineDepositsArticles(data.data);
        this.syngingData.productsToSellLoading=false;
        this.syngingData.productsToSellDone=true;
        if (data.next_page_url) {
          this.NextPageDeposit(data.next_page_url);
        }
      },error=>{
        this.appserv.presentToast("Une erreur est survenue lors de la récupération des données des dépôts","danger");
        this.syngingData.productsToSellLoading=false;
      });
  }

  async getlistdeposits(){
     
    this.syngingData.productsToSellLoading=true;
    //set depositArticles locally
    this.depositserv.setOffLineDepositsArticles([]);
    //getting list of deposits on the API
    this.depositserv.forASpecifUser({user_id:this.appserv.actualUser.id}).subscribe(
      async data=>{
        this.syngingData.productsToSellLoading=false;
        this.listdeposits=data;
        if(data.length>0){
          //add all deposits getted in the offline list
          this.depositserv.setOffLineDepositsArticles(data);
          this.settingArticlesToOfflineDeposits();
        }
      },
      error=>{
        this.syngingData.productsToSellLoading=false;
          this.appserv.presentToast("Erreur lors de la récupération de la liste des dépôts","warning");
      });
  }

  getnexpagesdepositartlces = async (url: string) =>{
    let response = await fetch(`${url}`);
    let responseData = await response.json();
    let services =responseData.data;
 
    if (responseData.next_page_url) {
      return services.concat(await this.getnexpagesdepositartlces (responseData.next_page_url));
    }else{
      return services;
    }
  }
   
  async settingArticlesToOfflineDeposits(){
    const listforsaving =[];
    this.syngingData.productsToSellLoading=true;

    this.depositserv

    let listofflinedeposits=this.depositserv.getOfflineDepositsArticles();
    if(listofflinedeposits.length>0){
      //look for all services for each deposit
      listofflinedeposits.forEach(actualDeposit => {
        this.depositserv.articlesdepositpaginate(actualDeposit.id).subscribe(
          async datadeposit=>{
            if (datadeposit.next_page_url) {
              try{
                const url = `${datadeposit.next_page_url}`;
                actualDeposit.services=datadeposit.data.concat( await this.getnexpagesdepositartlces(url));
                this.listdeposits.push(actualDeposit);
              }catch(err){
                console.error(err.message);
              }
            }else{
              actualDeposit.services=datadeposit.data;
            }
          },
          error=>{
            this.appserv.presentToast("Nous avons connu un problème en voulant récupérer les produits du dépôt " + actualDeposit.name,"warning");
          });
          listforsaving.push(actualDeposit);
      });
    }
    this.syngingData.productsToSellLoading=false;
  }

 

  getting(){
    console.log("deposits products saving",this.depositserv.getOfflineDepositsArticles());
  }

  ImportServices(){
    //deleting old data
    this.articleServ.removearticleslist();
    this.articleServ.removepaginatedarticles();

    this.syngingData.articlesLoading=true;
    this.articleServ.enterpriseservicespaginated(this.appserv.actualEse.id).subscribe(
      data=>{
        this.articleServ.savearticlepaginatedoffline(data);
        if (data.next_page_url) {
          this.NextPageArticles(data.next_page_url);
        }else{
          this.syngingData.articlesLoading=false;
          this.syngingData.articlesDone=true;
        }
      },
      error=>{
        this.syngingData.articlesFailed=true;
        this.appserv.presentToast("erreur survenue lors du chargement des donnees","danger");
      });
  }

  NextPageArticles(url: string){
    if (url!=null) {
      this.syngingData.articlesLoading=true;
      this.appserv.gotoanypaginationurl(url).subscribe(
        data=>{
         this.articleServ.savearticlepaginatedoffline(data);
         if (data.next_page_url) {
          this.NextPageArticles(data.next_page_url);
         }else{
          this.syngingData.articlesLoading=false;
          this.syngingData.articlesDone=true;
         }
        },error=>{
          this.appserv.presentToast('Erreur survenue sur le serveur','warning');
        });
    }else{
      this.appserv.presentToast('Aucune donnée à afficher','warning');
    }
  }  
  
  NextPageDeposit(url: string){
    if (url!=null) {
      this.syngingData.productsToSellLoading=true;
      this.appserv.gotoanypaginationurl(url).subscribe(
        (data:articlePaginator)=>{
         this.depositserv.addToOfflineDepositsArticles(data.data);
         if (data.next_page_url) {
          this.NextPageDeposit(data.next_page_url);
         }else{
          this.syngingData.productsToSellLoading=false;
          this.syngingData.productsToSellDone=true;
         }
        },error=>{
          this.appserv.presentToast('Erreur survenue sur le serveur','warning');
        });
    }else{
      this.appserv.presentToast('Aucune donnée à afficher','warning');
    }
  }

  async ImportServicesForSelling(){
    //getting data for each deposit
    this.syngingData.productsToSellLoading=true;
    this.articleServ.serviceslist({user_id:this.appserv.actualUser.id}).subscribe(
      data=>{
        this.syngingData.productsToSellLoading=false;
        this.syngingData.productsToSellDone=true;
        this.articleServ.setdepositarticlesOffline(data);
      },
      error=>{
        this.syngingData.productsToSellLoading=false;
        this.syngingData.productsToSellFailed=true;
        this.appserv.presentToast('Impossible de récupérer les services à vendre sur le serveur','warning');
      });
  }

  async ImportCustomers(){
    //removing old data
    this.customerServ.removeofflinecustomers();
    let listcustomers = [];
    this.syngingData.customersLoading=true;
    this.customerServ.getallcustomerspaginated(this.appserv.actualEse.id).subscribe(
      async data=>{
        this.syngingData.customersLoading=false;
        this.syngingData.customersDone=true;
        if (data.next_page_url) {
          listcustomers = data.data.concat(await this.dynamicgetnexpagesdata(data.next_page_url));
          this.customerServ.setofflinedata(listcustomers);
          this.customerServ.savepaginatedoffline(data);
        }else{
          this.customerServ.setofflinedata(data.data);
          this.customerServ.savepaginatedoffline(data);
        }
      },
      error=>{
        this.syngingData.customersFailed=true;
        this.syngingData.customersLoading=false;
        this.appserv.presentToast('Impossible de récupérer les clients','warning');
      });
  }

  dynamicgetnexpagesdata= async (url: string) =>{
    let response = await fetch(`${url}`);
    let responseData = await response.json();
    let dataToReturn =responseData.data;
 
    if (responseData.next_page_url) {
      this.customerServ.savepaginatedoffline(responseData);
      return dataToReturn.concat(await this.dynamicgetnexpagesdata (responseData.next_page_url));
    }else{
      this.customerServ.savepaginatedoffline(responseData)
      return dataToReturn;
    }
  }

  async ImportTables(){
    //remove old data
    this.tableServ.removeofflinedata();

    this.syngingData.tablesLoading=true;
    this.tableServ.getlist(this.appserv.actualEse.id).subscribe(
      data=>{
        this.syngingData.tablesLoading=false;
        this.syngingData.tablesDone=true;
        this.tableServ.setofflinedata(data);
      },
      error=>{
        this.syngingData.tablesLoading=false;
        this.syngingData.tablesFailed=true;
        this.appserv.presentToast('Impossible de récupérer les tables','warning');
      });
  }

  async ImportServers(){
    //removes old data
    this.servantServ.removeofflinedata();
    this.syngingData.serversLoading=true;
    this.servantServ.getall(this.appserv.actualEse.id).subscribe(
      data=>{
        this.syngingData.serversLoading=false;
        this.syngingData.serversDone=true;
        this.servantServ.setofflinedata(data);
      },
      error=>{
        this.syngingData.serversLoading=false;
        this.syngingData.serversFailed=true;
        this.appserv.presentToast('Impossible de récupérer les serveurs','warning');
      });
  }

  async ImportAccounts(){
    //removes old data
    this.accountserv.removesofflinedata();
    this.syngingData.accountsLoading=true;
    this.accountserv.getall(this.appserv.actualEse.id).subscribe(
      data=>{
        this.syngingData.accountsLoading=false;
        this.syngingData.accountsDone=true;
        this.accountserv.setOfflineData(data);
      },
      error=>{
        this.syngingData.accountsLoading=false;
        this.syngingData.accountsFailed=true;
        this.appserv.presentToast('Impossible de récupérer les comptes','warning');
      });
  }

  async ImportMoneyConversions(){
    //removes offline data
    this.conversionserv.removeofflinedata();
    this.syngingData.conversionMoneyLoading=true;
    this.conversionserv.getListConversionsApi(this.appserv.actualEse.id).subscribe(
      data=>{
        this.syngingData.conversionMoneyLoading=false;
        this.syngingData.conversionMoneyDone=true;
        this.conversionserv.setOfflineData(data);
      },
      error=>{
        this.syngingData.conversionMoneyLoading=false;
        this.syngingData.conversionMoneyFailed=true;
        this.appserv.presentToast('Impossible de récupérer les conversions des monnaies','warning');
      });
  }

  async ImportMoney(){
    //remove old offline data
    this.moneyserv.removeoldofflinedata();
    this.syngingData.moneyLoading=true;
    this.moneyserv.getlistmonnaiesapi(this.appserv.actualEse.id).subscribe(
      data=>{
        this.syngingData.moneyLoading=false;
        this.moneyserv.setOfflineData(data);
        this.syngingData.moneyDone=true;
      },
      error=>{
        this.syngingData.moneyLoading=false;
        this.syngingData.moneyFailed=true;
        this.appserv.presentToast('Impossible de récupérer les monnaies','warning');
      });
  }

  SyncingDataLength(){
    let length = this.syncingServ.getSyncingOffLinePayments().length + this.syncingServ.getSyncingOffLineDebts().length + this.syncingServ.getSyncingOffLineStockHistories().length + this.syncingServ.getSyncingOffLineInvoices().length + this.syncingServ.getSyncingCustomers().length + this.syncingServ.getSyncingExpenditures().length + this.syncingServ.getSyncingEntries().length;
    return length;
  }

  async synchronous(){
    const alert = await this.appserv.alertctrl.create({
      header:`Synchronisation`,
      mode:'ios',
      translucent:true,
      message:`Confirmez-vous cette synchronisation?`,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:async ()=> {
          if (this.SyncingDataLength()>0) {
            let object ={user_id:this.appserv.getactualuser().id,enterprise_id:this.appserv.getactualEse().id, comment:this.comment,payments:this.syncingServ.getSyncingOffLinePayments(),debts:this.syncingServ.getSyncingOffLineDebts(),stockHistories:this.syncingServ.getSyncingOffLineStockHistories(),invoices:this.syncingServ.getSyncingOffLineInvoices(),customers:this.syncingServ.getSyncingCustomers(),expenditures:this.syncingServ.getSyncingExpenditures(),entries:this.syncingServ.getSyncingEntries()};
            console.log("objects to syncing before",object);
            const load = await this.appserv.loadctrl.create({
                message:`Synchronisation en cours. Cette action peut prendre plusieurs minutes, veuillez donc patienter....`,
                spinner:'circular',
                mode:'ios',
                translucent:true
            });
            load.present();
      
            this.syncingServ.sendSafeGuards(object).subscribe(
              data=>{
                console.log('response from syncing ',data);
                load.dismiss();
                this.showprogress=false;
                this.appserv.presentToast(`Synchronisation terminée avec succès`,"success");
                //deleting local data stored
                this.appserv.restOfflineData();
                //getting new data from the server
                // this.importalldata();
              },
              error=>{
                console.log('Erreur from syncing ', error);
                load.dismiss();
                this.showprogress=false;
                this.appserv.presentToast(`La synchronisation a echoué. Veuillez verifier votre connexion puis réssayer`,"danger");
              }
            )
          } else {
            this.appserv.presentToast(`Aucune donnée à synchroniser`,"warning");
          }
        },}
      ]
    });
    alert.present(); 
  }


  async syncinginvoices(){
    if (this.SyncingDataLength()>0) {
            
      const load = await this.appserv.loadctrl.create({
          message:`Synchronisation factures en cours.`,
          spinner:'circular',
          mode:'ios',
          translucent:true
      });
      load.present();

      this.syncingServ.safeguardinvoices({user_id:this.appserv.actualUser.id,invoices:this.syncingServ.getSyncingOffLineInvoices()}).subscribe(
        data=>{
          console.log("request sent",data);
          load.dismiss();
          this.showprogress=false;
          if (data.message==="success") {
            this.appserv.presentToast(`Synchronisation des factures terminée avec succès`,"success");
            this.invoiceServ.resetToSyncingOffline();
          }

        },
        error=>{
          console.log(error);
          load.dismiss();
          this.showprogress=false;
          this.appserv.presentToast(`La synchronisation des factures a echoué. Veuillez verifier votre connexion puis réssayer`,"danger");
        }
      )
    } else {
      this.appserv.presentToast(`Aucune donnée à synchroniser`,"warning");
    }
  }

  async removeSyncingData(){
    const alert = await this.appserv.alertctrl.create({
      header:"Suppression Synchronisation",
      message:"Attention, cette action est irreversible! Voulez-vous vraiment supprimer toutes les données à synchroniser?",
      translucent:true,
      mode:'ios',
      buttons:[
        {text:"Annuler",role:'cancel'},
        {
          text:"Oui",handler:()=> {
              this.appserv.restOfflineData();
          },
        }
      ]
    });
    alert.present();
  }

  async gotosyncingviewer(criteria: string){
    const modal = await this.appserv.modalCtrl.create({
      component:SyncingdataviewerComponent,
      cssClass:'modal-border-radius-20',
      componentProps:{"criteria":criteria}
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();

    if(role=='deleted'){
      if (criteria==='entries') {
        this.syncingServ.getSyncingEntries();
      }
      
      if (criteria==='expenditures') {
        this.syncingServ.getSyncingExpenditures();
      }
      
      if (criteria==='customers') {
        this.syncingServ.getSyncingCustomers();
      }
      
      if (criteria==='invoices') {
        this.syncingServ.getSyncingOffLineInvoices();
      } 
      
      if (criteria==='stock') {
        this.syncingServ.getSyncingOffLineStockHistories();
      }
      
      if (criteria==='debts') {
        this.syncingServ.getSyncingOffLineDebts();
      } 
      
      if (criteria==='payments') {
        this.syncingServ.getSyncingOffLinePayments();
      }
    }
  }

  OptionChange($event){

  }

  async importalldata(){
    this.ImportServices();
    this.getallservicesdatafordeposits()
    this.ImportCustomers();
    this.ImportTables();
    this.ImportServers();
    this.ImportAccounts();
    this.ImportMoneyConversions();
    this.ImportMoney();
  }
}
