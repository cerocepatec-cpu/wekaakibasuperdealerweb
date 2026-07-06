import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { ReportsService } from '../services/reports.service';
import { Money } from '../interfaces/money';
import { PosPrintingOptions } from '../interfaces/posprintingoptions';
import { PickservicesComponent } from '../articles/pickservices/pickservices.component';
import { Articles } from '../interfaces/articles';
import { PrintstockbyarticlesComponent } from './printstockbyarticles/printstockbyarticles.component';
import { DepositForSpecificUserComponent } from '../deposits/deposit-for-specific-user/deposit-for-specific-user.component';
import { Deposits } from '../interfaces/deposit';
import { DynamicviewerComponent } from './dynamicviewer/dynamicviewer.component';
import { Users } from '../interfaces/users';
import { UserpickerComponent } from '../agents/userpicker/userpicker.component';
import { sellReport } from '../interfaces/sellreport';
import { CustomerpickersComponent } from '../articles/customerpickers/customerpickers.component';
import { Customers } from '../interfaces/customers';
import { cumulsellreport } from '../interfaces/cumulsellreportgroupedbydate';
import { StockService } from '../services/stock.service';
import { Mouvement } from '../interfaces/mouvement';
import { FundService } from '../services/funds.service';
import { Tubs } from '../interfaces/tubs';
import { Accounts } from '../interfaces/accounts';
import { PicktubsComponent } from '../tubs/picktubs/picktubs.component';
import { AccountpickerComponent } from '../accounts/accountpicker/accountpicker.component';
import { MemberfirstentriesService } from '../services/memberfirstentries.service';
import { SelectmoneyComponent } from '../selectmoney/selectmoney.component';
import { MemberstransactionsService } from '../services/memberstransactions.service';
import { EditfirstentryComponent } from '../editfirstentry/editfirstentry.component';
import { MembersaccountsService } from '../services/membersaccounts.service';
import { NewfirstentryComponent } from '../newfirstentry/newfirstentry.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  showreportsellgrouped=false;
  showreportsellgroupedbyprices=false;
  showreportcumulative=true;
  showstockdetails=false;
  showreportstockcumul=true;
  showreportstockgroupedbydates=false;
  posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();
  sells:any[]=[];
  sellsgroupedbydates:any[]=[];
  cumuldateoperations:cumulsellreport={};
  sellsgroupedbyprices:any;
  showsellReportwithDetails=false;
  sellsubtot: sellReport={};
  cashBookEntries:any[]=[];
  stockmouvements:any[]=[];
  stockmouvementsdetails:any[]=[];
  stockgroupedbydates:any;
  totalEntriesStock=0;
  totalWithdrawStock=0;
  totalSoldStock=0;
  totalsoldinventory:number=0;
  totalTotalBefore:number=0;
  showprogress=false;
  from:any=this.appserv.defaultdate();
  to:any=this.appserv.defaultdate();
  sell_from:any=this.appserv.defaultdate();
  sell_to:any=this.appserv.defaultdate(); 
  stock_from:any=this.appserv.defaultdate();
  stock_to:any=this.appserv.defaultdate(); 
  cash_book_from:any=this.appserv.defaultdate();
  cash_book_to:any=this.appserv.defaultdate();
  defaultMoney:Money={};
  vatpercent=0;
  criteriafilterwithvat='';
  //sous totaux ventes
  stotventes=0;
  stotcash=0;
  stotcredits=0;
  //cash book
  cashbooklist:any={};
  showheader=false;

  //Credits
  credits:any[]=[];
  credits_from: any=this.appserv.defaultdate();
  credits_to: any=this.appserv.defaultdate();
  totalcredits=0;
  totalcreditspayed=0;
  totalcreditsSold=0;
  totalcreditsSoldnet=0;
  actualcustomers:Customers[]=[];
  creditstates:string="";
  isCreditsModalOpen=true;

  //stock variables
  actualarticles : Articles []=[];
  listdeposits:Deposits[]=[];
  isStockModalOpen=true;

  //sells variables
  actualarticlesSell : Articles []=[];
  listdepositsSell:Deposits[]=[];
  listagentsSell: Users[]=[];
  isSellModalOpen=true;
  sellReportwithDetails=false;

  //fidelity variables
  totalfidelity=0;
  totalEntriesPoints=0;
  totalSellBypoints=0;
  totalEntriesBonus=0;
  totalSellByBonus=0;
  totalEntriesCautions=0;
  totalSellByCautions=0;

  //payments
  paymentcustomers:Customers[]=[];
  payment_from: any=this.appserv.defaultdate();
  payment_to: any=this.appserv.defaultdate();
  payments:any[]=[];
  totalpayments=0;
  subtotaldebts=0;
  subtotalpayments=0;
  subtotalsolds=0;

  //report cashbooks
  listoperations:Mouvement[]=[];
  cashbooktrue_from: any=this.appserv.defaultdate();
  cashbooktrue_to: any=this.appserv.defaultdate();
  actualfundscashbooks: Tubs[]=[];
  listcashbookaccounts: Accounts[]=[];
  listagentsCasbooks: Users[]=[];
  cashbookfilter="default";

  //First entries
  firstentries_from:any=this.appserv.defaultdate(); 
  firstentries_to:any=this.appserv.defaultdate();
  actualfirstentriescollectors: Users[]=[];
  actualfirstentriesmembers: Users[]=[];
  actualfirstentriesmoneys:Money[]=[];
  firstentrieslist:any[]=[];
  firstentriesfilter:any="default";
  firstentriesgroupby:any="";
  firstentriesgroupedbycollectorslist:any[]=[];
  cumulfirstentriesgroupedbycollectorslist:any[]=[];

  //Weka Transactions
  transactions_from:any=this.appserv.defaultdate();
  transactions_to:any=this.appserv.defaultdate();
  actualtransactionsmembers:Users[]=[];
  actualtransactionscashiers:Users[]=[];
  actualtransactionsmoneys:Money[]=[];
  transactionslist:any[]=[];
  transactionsgroupby:any;
  transactionsfilter:any="default";
  cumultransactionsgroupedbycashiers:any[]=[];
  cumultransactionsgroupedbymoneys:any[]=[];

  constructor(private firstentryserv:MembersaccountsService,private transactionserv:MemberstransactionsService, private firstentriesServ:MemberfirstentriesService, private fundserv:FundService, public appserv: AppservicesService, public reportserv: ReportsService,private stockserv:StockService) { }

  ngOnInit() {
    this.sellsReport();
  }

/**
 * Weka Transactions Methods
 */

  async menufirstentry(firstentry:any){
    const menu = await this.appserv.actionsheetctrl.create(
      {
        header: `${firstentry.member_fullname} (${firstentry.amount} ${firstentry.abreviation?firstentry.abreviation:firstentry.money_name}) par ${firstentry.collector_fullname}`,
        cssClass: 'myactionsheet',
        translucent: true,
        mode: 'ios',
        buttons:[
          {text:'Annuler',role:'cancel'},
          {text:'Infos',handler:async()=>{
              this.infosfirstentry(firstentry);
          },}, 
          {text:'Modifier',handler:async()=>{
              this.editfirstentry(firstentry);
          },},
          {text:"Supprimer",handler:async ()=>{
            const alert = await this.appserv.alertctrl.create({
              header:'Suppression',
              mode:'ios',
              translucent:true,
              message:'Voulez-vous vraimment supprimer cette opération?',
              buttons:[
                {text:'Non',role:'cancel'},
                {text:'Oui',handler:async ()=> {
                  const load = await this.appserv.loadctrl.create({
                    message:"Suppression en cours...",
                    mode:'ios',
                    translucent:true
                  });
                  load.present();
                  this.firstentryserv.deletefirstentry(firstentry).subscribe(
                    response=>{
                      load.dismiss();
                      if (response.message==="success" && response.status===200 && response.data===true) {
                        this.appserv.presentToast("Première mise supprimée avec succès","success");
                        this.firstentrieslist=this.firstentrieslist.filter(f=>f!==firstentry);
                      }
                      console.log(response);
                    },
                    error=>{
                      load.dismiss();
                      console.log(error);
                    });
                },}
              ]
            });
            alert.present();
          }}
        ]
      });
    if(this.appserv.permissionFilter("comptes","edit_first_entry")){
      (await menu).present();
    }
  }

  async editfirstentry(firstentry:any){
    const modal = await this.appserv.modalCtrl.create({
      component:NewfirstentryComponent,
      componentProps:{firstentrysent:firstentry},
      cssClass:"modal-border-radius-20"
    });
    modal.present(); 
    const {data,role} = await modal.onWillDismiss();
    if(role==="updated"){
      this.getdailyfirstentries();
    }
  }
  
  async infosfirstentry(firstentry:any){
    const modal = await this.appserv.modalCtrl.create({
      component:EditfirstentryComponent,
      componentProps:{firstentrysent:firstentry},
      cssClass:"modal-border-radius-20"
    });
    modal.present(); 
    const {data,role} = await modal.onWillDismiss();
    if(role==="deleted"){
      this.firstentrieslist=this.firstentrieslist.filter(f=>f!==firstentry);
    }
  }

transactionsgroupedby(criteria:string){
  this.showprogress=true;
   
    this.transactionserv.transactionshistories({criteria:criteria,enterprise_id:this.appserv.getactualEse().id,from:this.transactions_from,to:this.transactions_to,user_id:this.appserv.getactualuser().id}).subscribe(
      response=>{
        this.showprogress=false;
        console.log('transactions by'+criteria,response);
        if (response.message==="error" && response.error==="user not sent") {
          this.appserv.presentToast("Utilisateur non identifié.","warning");
        }
        
        if (response.message==="error" && response.error==="unknown user") {
          this.appserv.presentToast("Nous n'arrivons pas à vous identifier.","warning");
        }  
        
        if (response.message==="error" && response.error==="unknown enterprise") {
          this.appserv.presentToast("Désolé, votre entreprise n'est pas identifiée!","warning");
        } 
        
        if (response.message==="success" && response.error===null && response.status===200) {
          switch (criteria) {
            case 'cashiers':
              this.cumultransactionsgroupedbycashiers=response.data;
              break; 
            case 'moneys':
              this.cumultransactionsgroupedbymoneys=response.data;
              break;
          
            default:
              break;
          }
        }
      },error=>{
        console.log(error);
        this.showprogress=false;
        this.appserv.presentToast("Erreur survenue lors du chargement des transactions.","danger");
      });
}

transactionsSubtotalsviewer(criteria:string){
  console.log('cashier transaction filter',criteria);
  this.transactionsfilter=criteria;
 switch (criteria) {
  case 'default':
    this.getdailytransactions();
    break; 
  case 'cashiers':
    this.transactionsgroupedby(criteria);
    break; 
  case 'moneys':
    this.transactionsgroupedby(criteria);
    break;
 
  default:
    this.transactionsgroupby="";
    this.getdailytransactions();
    break;
 }
}

reportTransactionsbymoneys(){

}

resetactualtransactionsmoneys(){
  this.actualtransactionsmoneys=[];
}

async actualtransactionsmoneysfilter(){
  const modal = await this.appserv.modalCtrl.create({
    component:SelectmoneyComponent,
    componentProps:{multiselect:true},
    cssClass:"modal-border-radius-20"
  });
  modal.present();
  const {data,role} = await modal.onWillDismiss();
  if (role==='selected') {
    this.actualtransactionsmoneys=data;
    if (this.actualtransactionsmoneys.length>0) {
      this.getdailytransactions();
    }
  } 
}

transactionsbycashiers(){
  this.getdailytransactions();
}
resetactualtransactionscashiers(){
  this.actualtransactionscashiers=[];
}

async transactionscashierspicker(){
  const modal = await this.appserv.modalCtrl.create({
    component:UserpickerComponent,
    componentProps:{criteria:"multiple"},
    cssClass:"modal-border-radius-20"
  });
  modal.present();
  const {data,role} = await modal.onWillDismiss();
  if (role==="selected") {
    this.actualtransactionscashiers=data;
    if (this.actualtransactionscashiers.length>0) {
      this.getdailytransactions();
    }
  }
}

reportactualtransactionsmembers(){
  this.getdailytransactions();
}

resetactualtransactionsmembers(){
  this.actualtransactionsmembers=[];
}

async transactionsdatefilter(){
  const period = await  this.periodic();
  this.transactions_from=period.from;
  this.transactions_to=period.to;
}

getdailytransactions(){
  this.showprogress=true;
    let members=[];
    let cashiers=[];
    let moneys=[];
  
    if (this.actualtransactionsmoneys.length>0) {
      this.actualtransactionsmoneys.forEach(money => {
        moneys.push(money.id);
      });
    } 
    
    if (this.actualtransactionsmembers.length>0) {
      this.actualtransactionsmembers.forEach(member => {
        members.push(member.id);
      });
    } 
    
    if (this.actualtransactionscashiers.length>0) {
      this.actualtransactionscashiers.forEach(cashier => {
        cashiers.push(cashier.id);
      });
    }

    this.transactionserv.transactionshistories({enterprise_id:this.appserv.getactualEse().id,from:this.transactions_from,to:this.transactions_to,user_id:this.appserv.getactualuser().id,members:members,cashiers:cashiers}).subscribe(
      response=>{
        this.showprogress=false;
        console.log('transactions',response);
        if (response.message==="error" && response.error==="user not sent") {
          this.appserv.presentToast("Utilisateur non identifié.","warning");
        }
        
        if (response.message==="error" && response.error==="unknown user") {
          this.appserv.presentToast("Nous n'arrivons pas à vous identifier.","warning");
        }  
        
        if (response.message==="error" && response.error==="unknown enterprise") {
          this.appserv.presentToast("Désolé, votre entreprise n'est pas identifiée!","warning");
        } 
        
        if (response.message==="success" && response.error===null && response.status===200) {
          this.transactionslist=response.data;
          console.log('list',this.transactionslist);
          // this.keptTransactionslist=this.transactionslist;
          // this.total_transactions_pending=this.transactionslist.filter(trans=>trans.transaction_status==='pending').length;
          // this.total_transactions_validated=this.transactionslist.filter(trans=>trans.transaction_status==='validated').length;
        }
      },error=>{
        console.log(error);
        this.showprogress=false;
        this.appserv.presentToast("Erreur survenue lors du chargement des transactions.","danger");
      });
}

async transactionsmemberspicker(){
  const modal = await this.appserv.modalCtrl.create({
    component:UserpickerComponent,
    componentProps:{criteria:"multiple"},
    cssClass:"modal-border-radius-20"
  });
  modal.present();
  const {data,role} = await modal.onWillDismiss();
  if (role==="selected") {
    this.actualtransactionsmembers=data;
    if (this.actualtransactionsmembers.length>0) {
      this.getdailytransactions();
    }
  }
}

  /**
   * First entries methods
   */

  subtotalsviewer(criteria:string){
    this.firstentriesgroupby=criteria;
   switch (this.firstentriesfilter) {
    case 'default':
      this.getdailyfirstentries();
      break;
   
    default:
      this.firstentriesgroupby="";
      this.getdailyfirstentries();
      break;
   }
  }

  async firstentriesdatefilter(){
    const period = await  this.periodic();
    this.firstentries_from=period.from;
    this.firstentries_to=period.to;
  }

  getdailyfirstentries(){
    console.log(this.from,this.to);
    this.showprogress=true;
    this.firstentriesfilter="default";
    this.firstentriesServ.firstentrieshistories({from:this.firstentries_from,to:this.firstentries_to,user_id:this.appserv.getactualuser().id,enterprise_id:this.appserv.getactualEse().id,groupby:this.firstentriesgroupby}).subscribe(
      response=>{
        this.showprogress=false;
        console.log('first entries',response);
        if (response.message==="success" && response.status===200) {
          switch (this.firstentriesgroupby) {
            case 'collectors':
              this.firstentriesgroupedbycollectorslist=response.data;
              this.cumulfirstentriesgroupedbycollectorslist=response.cumul;
              break;
            case '':
              this.firstentrieslist=response.data;
              break;
          
            default:
              break;
          }
          
        }   
        
        if (response.message==="error" && response.error==="unknown enterprise") {
          this.appserv.presentToast("Entreprise inconnue. Nous sommes désolé!","warning");
        } 
        
        if (response.message==="error" && response.error==="unknown user") {
          this.appserv.presentToast("Aucun membre trouvé. Nous sommes désolé!","warning");
        } 
        
        if (response.message==="error" && response.error==="user not sent") {
          this.appserv.presentToast("Aucun membre envoyé. Nous sommes désolé!","warning");
        }
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast("Aucun membre envoyé. Nous sommes désolé!","warning");
      });
  }

  async firstentriescollectorspicker(){
    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{criteria:"multiple",usertype:'collectors'},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="selected") {
      this.actualfirstentriescollectors=data;
    }
  }

  resetactualfirstentriescollectors(){
    this.actualfirstentriescollectors=[];
  }

  firstentriesbycollectors(){
    this.showprogress=true;
    this.firstentriesfilter="collectors";
    let collectorsids=[];
    this.actualfirstentriescollectors.forEach(element => {
      collectorsids.push(element.id);
    });
    this.firstentriesServ.firstentrieshistories({from:this.firstentries_from,to:this.firstentries_to,user_id:this.appserv.getactualuser().id,enterprise_id:this.appserv.getactualEse().id,collectors:collectorsids}).subscribe(
      response=>{
        console.log('first entries by collectors',response);
        this.showprogress=false;
        if (response.message==="success" && response.status===200) {
          this.firstentrieslist=response.data;
        }   
        
        if (response.message==="error" && response.error==="unknown enterprise") {
          this.appserv.presentToast("Entreprise inconnue. Nous sommes désolé!","warning");
        } 
        
        if (response.message==="error" && response.error==="unknown user") {
          this.appserv.presentToast("Aucun membre trouvé. Nous sommes désolé!","warning");
        } 
        
        if (response.message==="error" && response.error==="user not sent") {
          this.appserv.presentToast("Aucun membre envoyé. Nous sommes désolé!","warning");
        }
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast("Erreur survenue lors du chargement des premières mises.","danger");
      });
  }

  async firstentriesmemberspicker(){
    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{criteria:"multiple"},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="selected") {
      this.actualfirstentriesmembers=data;
    }
  }

  resetactualfirstentriesmembers(){
    this.actualfirstentriesmembers=[];
  }

  reportactualfirstentriesmembers(){
    this.showprogress=true;
    this.firstentriesfilter="members";
    let membersids=[];
    this.actualfirstentriesmembers.forEach(element => {
      membersids.push(element.id);
    });

    this.firstentriesServ.firstentrieshistories({from:this.firstentries_from,to:this.firstentries_to,user_id:this.appserv.getactualuser().id,enterprise_id:this.appserv.getactualEse().id,members:membersids}).subscribe(
      response=>{
        console.log('first entries by members',response);
        this.showprogress=false;
        if (response.message==="success" && response.status===200) {
          this.firstentrieslist=response.data;
        }   
        
        if (response.message==="error" && response.error==="unknown enterprise") {
          this.appserv.presentToast("Entreprise inconnue. Nous sommes désolé!","warning");
        } 
        
        if (response.message==="error" && response.error==="unknown user") {
          this.appserv.presentToast("Aucun membre trouvé. Nous sommes désolé!","warning");
        } 
        
        if (response.message==="error" && response.error==="user not sent") {
          this.appserv.presentToast("Aucun membre envoyé. Nous sommes désolé!","warning");
        }
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast("Erreur survenue lors du chargement des premières mises.","danger");
      });
  }

  async actualfirstentriesmoneysfilter(){
    const modal = await this.appserv.modalCtrl.create({
      component:SelectmoneyComponent,
      componentProps:{multiselect:true},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==='selected') {
      this.actualfirstentriesmoneys=data;
    } 
  }

  resetactualfirstentriesmoneys(){
    this.actualfirstentriesmoneys=[];
    this.firstentriesfilter="";
  }

  reportfirstentriesbymoneys(){
    this.showprogress=true;
    this.firstentriesfilter="moneys";
    let moneysids=[];
    this.actualfirstentriesmoneys.forEach(element => {
      moneysids.push(element.id);
    });

    this.firstentriesServ.firstentrieshistories({from:this.firstentries_from,to:this.firstentries_to,user_id:this.appserv.getactualuser().id,enterprise_id:this.appserv.getactualEse().id,moneys:moneysids}).subscribe(
      response=>{
        console.log('first entries by moneys',response);
        this.showprogress=false;
        if (response.message==="success" && response.status===200) {
          this.firstentrieslist=response.data;
        }   
        
        if (response.message==="error" && response.error==="unknown enterprise") {
          this.appserv.presentToast("Entreprise inconnue. Nous sommes désolé!","warning");
        } 
        
        if (response.message==="error" && response.error==="unknown user") {
          this.appserv.presentToast("Aucun membre trouvé. Nous sommes désolé!","warning");
        } 
        
        if (response.message==="error" && response.error==="user not sent") {
          this.appserv.presentToast("Aucun membre envoyé. Nous sommes désolé!","warning");
        }
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast("Erreur survenue lors du chargement des premières mises.","danger");
      });
  }
  /**
   * Cashbooks true methods
   */
  async cashbooksagentsfilter(){
    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{criteria:"multiple"},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="selected") {
      this.listagentsCasbooks=data;
    }
  }

  resetcashbooksagentslist(){
    this.listagentsCasbooks=[];
  }
  resetlistcashbookaccounts(){
    this.listcashbookaccounts=[];
  }

  async casbooktruedatefilter(){
    const period = await  this.periodic();
    this.cashbooktrue_from=period.from;
    this.cashbooktrue_to=period.to;
  }

  async reportcashbooksaccounts(){
    this.cashbookfilter="accounts";
    let accountsids = [];
    this.listcashbookaccounts.forEach(el => {
      accountsids.push(el.id);  
    });

    this.showprogress=true;
    this.fundserv.getdailyoperations({user_id:this.appserv.actualUser.id,from:this.cashbooktrue_from,to:this.cashbooktrue_to,accounts:accountsids}).subscribe(
      response=>{
        this.showprogress=false;
        console.log('request histories by funds',response);
        if (response.status===200 && response.message==="success") {
          this.listoperations=response.data;
        }
        // this.listagents=data;
      },
      error=>{
        this.showprogress=false;
        console.log(error);
        this.appserv.presentToast('Erreur survenue lors des opérations du livre des caisses.','danger');
      }
    );
  }


  resetTubslist(){
    this.actualfundscashbooks=[];
  }

  async cashbookbytubs(){
    this.cashbookfilter="funds";
    let fundsids = [];
    this.actualfundscashbooks.forEach(el => {
      fundsids.push(el.id);  
    });

    this.showprogress=true;
    this.fundserv.getdailyoperations({user_id:this.appserv.actualUser.id,from:this.cashbooktrue_from,to:this.cashbooktrue_to,funds:fundsids}).subscribe(
      response=>{
        this.showprogress=false;
        console.log('request histories by funds',response);
        if (response.status===200 && response.message==="success") {
          this.listoperations=response.data;
        }
        // this.listagents=data;
      },
      error=>{
        this.showprogress=false;
        console.log(error);
        this.appserv.presentToast('Erreur survenue lors des opérations du livre des caisses.','danger');
      }
    );
  }

  async cashbookspickaccounts(){
    const modal = await this.appserv.modalCtrl.create({
      component:AccountpickerComponent,
      componentProps:{multiple:true},
      cssClass:"modal-border-radius-20"
    });

    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="selected") {
      this.listcashbookaccounts=data;
    }

  }

  async cashbooksReportbyAgents(){
    this.cashbookfilter="agents";
    let agentids =[];
    this.listagentsCasbooks.forEach(el => {
      agentids.push(el.id);  
    });

    this.showprogress=true;
    this.fundserv.getdailyoperations({user_id:this.appserv.actualUser.id,from:this.cashbooktrue_from,to:this.cashbooktrue_to,agents:agentids}).subscribe(
      response=>{
        this.showprogress=false;
        console.log('request histories',response);
        if (response.status===200 && response.message==="success") {
          this.listoperations=response.data;
        }
      },
      error=>{
        this.showprogress=false;
        console.log(error);
        this.appserv.presentToast('Erreur survenue lors de la recupération des opérations du livre de caisse.','danger');
      });
  }

  async gotocashbooksfundspicker(){
    const modal = await this.appserv.modalCtrl.create({
      component:PicktubsComponent,
      cssClass:"modal-border-radius-20",
      componentProps:{multiple:true}
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==='selected') {
      this.actualfundscashbooks=data;
    }
  }

  getdailyoperations(){
    this.cashbookfilter="default";
    this.showprogress=true;
    this.fundserv.getdailyoperations({user_id:this.appserv.actualUser.id,from:this.cashbooktrue_from,to:this.cashbooktrue_to}).subscribe(
      response=>{
        this.showprogress=false;
        console.log('request histories',response);
        if (response.status===200 && response.message==="success") {
          this.listoperations=response.data;
        }
      },
      error=>{
        this.showprogress=false;
        console.log(error);
        this.appserv.presentToast('Erreur survenue lors de la recupération des opérations du livre de caisse.','danger');
      });
  }

  handletabchanged($event){
    switch ($event.index) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        this.getdailyoperations();
        break;
      case 6:
        this.getdailyfirstentries();
        break; 
      case 7:
        this.getdailytransactions();
        break;
      default:
        break;
    }
    console.log('event',$event);
  }

  testingbutton(){
    console.log('suis clik...');
  }
  
  /**
   * STOCK METHODS
   */

  BeforeClosingStockModal($event){
    this.isStockModalOpen=false;
  }

  afterStockFiltermodalpresented($event){

  }

  setStockFilterModalOpened(isOpen: boolean){
    this.isStockModalOpen = isOpen;
  }
  /**
   * END STOCK METHODS
   */


  /**
   * SELL METHODS
   */

  setSellFilterModalOpened(isOpen: boolean){
    this.isSellModalOpen = isOpen;
  }

  BeforeClosingSellModal($event){
    this.isSellModalOpen=false;
  }

  afterSellFiltermodalpresented($event){

  }
  /**
   * END SELL METHODS
   */


  /**
   * CREDITS METHODS
   * 
   */
  setCreditsFilterModalOpened(isOpen: boolean){
    this.isCreditsModalOpen = isOpen;
  }

  BeforeClosingCreditsModal($event){
    this.isCreditsModalOpen = false;
  }

    afterCreditsFiltermodalpresented($event){
      
    }
  /**
   * END CREDITS METHODS
   */
  async reportcreditsbystates(){
    if (this.creditstates.length>0) {
      const load = await this.appserv.loadctrl.create({
        message:"Chargement du rapport en cours...",
        spinner:"circular",
        mode:"ios"
      });
      load.present();
    
      this.reportserv.creditsByCutomers({enterprise_id:this.appserv.actualEse.id,user_id:this.appserv.actualUser.id,criteria:this.creditstates,from:this.credits_from,to:this.credits_to}).subscribe(
        data=>{
          load.dismiss();
          this.gotoprintstockbyarticlesview(data,"creditsFilteredByState");
          if (this.isCreditsModalOpen) {
            this.setCreditsFilterModalOpened(false);
          }
        },error=>{
          load.dismiss();
          this.appserv.presentToast("Impossible de charger le rapport filtré","warning");
        });
    }else{
      this.appserv.presentToast("Veuillez selectionner au moins un état à filtrer svp!","warning");
    }

  }

  async reportcreditsbycustomers(){
    if (this.actualcustomers.length>0) {
      const load = await this.appserv.loadctrl.create({
        message:"Chargement du rapport en cours...",
        spinner:"circular",
        mode:"ios"
      });
      load.present();
      let customers=[];
    
      this.actualcustomers.forEach(customer => {
        customers.push(customer.id);
      });
  
      this.reportserv.creditsByCutomers({enterprise_id:this.appserv.actualEse.id,user_id:this.appserv.actualUser.id,customers:customers,from:this.credits_from,to:this.credits_to}).subscribe(
        data=>{
          // console.log('report credits by customers',data);
          load.dismiss();
          // if (this.isCreditsModalOpen) {
          //   this.setCreditsFilterModalOpened(false);
          // }
          this.gotoprintstockbyarticlesview(data,"specificCustomers");
        },error=>{
          load.dismiss();
          this.appserv.presentToast("Impossible de charger le rapport filtré","warning");
        });
    }else{
      this.appserv.presentToast("Veuillez selectionner au moins un client svp!","warning");
    }
  }
  
  async paymentsreport(){
   
      const load = await this.appserv.loadctrl.create({
        message:"Chargement du rapport en cours...",
        spinner:"circular",
        mode:"ios"
      });
      load.present();
      let customers=[];
    
      this.reportserv.reportpaymentsbydates({enterprise_id:this.appserv.actualEse.id,user_id:this.appserv.actualUser.id,from:this.payment_from,to:this.payment_to}).subscribe(
        response=>{
          load.dismiss();
          console.log(response);
          this.payments=response.data;
          this.subtotaldebts=response.subtotaldebts;
          this.subtotalpayments=response.subtotalpayments;
          this.subtotalsolds=response.subtotalsolds;
        },error=>{
          load.dismiss();
          this.appserv.presentToast("Impossible de charger le rapport filtré","warning");
        });
  }

  async reportpaymentbycustomers(){
    if (this.paymentcustomers.length>0) {
      const load = await this.appserv.loadctrl.create({
        message:"Chargement du rapport en cours...",
        spinner:"circular",
        mode:"ios"
      });
      load.present();
      let customers=[];
    
      this.paymentcustomers.forEach(customer => {
        customers.push(customer.id);
      });
  
      this.reportserv.paymentsByCutomers({enterprise_id:this.appserv.actualEse.id,user_id:this.appserv.actualUser.id,customers:customers,from:this.payment_from,to:this.payment_to}).subscribe(
        response=>{
          load.dismiss();
          console.log(response);
          this.payments=response.data;
          this.subtotaldebts=response.subtotaldebts;
          this.subtotalpayments=response.subtotalpayments;
          this.subtotalsolds=response.subtotalsolds;
        },error=>{
          load.dismiss();
          this.appserv.presentToast("Impossible de charger le rapport filtré","warning");
        });
    }else{
      this.appserv.presentToast("Veuillez selectionner au moins un client svp!","warning");
    }
  }

  async creditscustomersfilter(){
    const modal = await this.appserv.modalCtrl.create({
      component:CustomerpickersComponent,
      componentProps:{"multiple":true},
      cssClass:'modal-border-radius-20',
      initialBreakpoint:0.75,
      breakpoints:[0.25,0.50,0.75,1]
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      if(data.length>0){
        this.actualcustomers=data;
      }
    }
  } 
  
  async paymentcustomersfilter(){
    const modal = await this.appserv.modalCtrl.create({
      component:CustomerpickersComponent,
      componentProps:{"multiple":true},
      cssClass:'modal-border-radius-20',
      initialBreakpoint:0.75,
      breakpoints:[0.25,0.50,0.75,1]
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      if(data.length>0){
        this.paymentcustomers=data;
      }
    }
  }

  resetcreditscustomerslist(){
    this.actualcustomers=[];
  } 
  
  resetpaymentscustomerslist(){
    this.paymentcustomers=[];
  }

  async reportdepositsandarticles(){
    const load = await this.appserv.loadctrl.create({
      message:"Chargement du rapport en cours...",
      spinner:"circular",
      mode:"ios"
    });
    load.present();
    let deposits=[];
    let articles=[];
    this.listdeposits.forEach(deposit => {
      deposits.push(deposit.id);
    });

    this.actualarticles.forEach(article =>{
      articles.push(article.service.id);
    });

    this.reportserv.stockReportByDeposits({user_id:this.appserv.actualUser.id,deposits:deposits,services:articles,from:this.stock_from,to:this.stock_to}).subscribe(
      data=>{
        load.dismiss();
        console.log('grouped by deposits',data);
        this.gotoprintstockbyarticlesview(data,"deposits");
      },error=>{
        load.dismiss();
        this.appserv.presentToast("Impossible de charger le rapport filtre par dépôts","warning");
      });

      if (this.isStockModalOpen) {
        this.setStockFilterModalOpened(false);
      }
  }

  async periodic(){
    let dateFrom="";
      let dateTo="";
      const modal = await this.appserv.periodicfilter();
      modal.present(); 
    
      const {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        dateFrom=data.from;
        dateTo=data.to;
      }
      return {from:dateFrom,to:dateTo};
  }

  async gotosellarticlepicker(){
    const modal = await this.appserv.modalCtrl.create({
      component:PickservicesComponent,
      cssClass:'modal-border-radius-20',
      initialBreakpoint:0.75,
      breakpoints:[0.25,0.50,0.75,1]
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
      if(data.length>0){
        this.actualarticlesSell=data;
      }
    }
  }

  resetsellarticleslist(){
    this.actualarticlesSell=[];
  }

  async stockdatefilter(){
    const period = await  this.periodic();
    this.stock_from=period.from;
    this.stock_to=period.to;
  }

  async cashboodatefilter(){
    const period = await  this.periodic();
    this.cash_book_from=period.from;
    this.cash_book_to=period.to;
    this.cashbookreport();
  }

  async selldatefilter(){
    const period = await  this.periodic();
    this.sell_from=period.from;
    this.sell_to=period.to;
    // this.sellsReport();
  }

  export(criteria :string){

    if (criteria==='stock') {
      let data =[['N°','Désignation','Catégorie','Unité de mésure','Tot.Entrées','Tot.Sorties','Solde']];
      let index = 0;
      this.stockmouvements.forEach(el => {
          index=index+1;
          const obj =[
            index,
            el.service.name,
            el.service.category_name,
            el.service.uom_symbol,
            el.totalEntries?el.totalEntries:0,
            el.totalWithdraw?el.totalWithdraw:0,
            el.sold?el.sold:0
          ];
          data.push(obj);
      });
      this.appserv.exportInToExcel(data,'csv','rapportstock');
    }

    if (criteria==='sell') {
      let data =[['N°','Vendeur','Total vendu','Total Cash','Total Crédit','Solde']];
      let index = 0;
      this.sells.forEach(el => {
          index=index+1;
          const obj =[
            index,
            el.user.user_name,
            (el.cash?el.cash:0) + (el.credits?el.credits:0),
            el.cash?el.cash:0,
            el.credits?el.credits:0,
            el.cash?el.cash:0?el.credits?el.credits:0:0
          ];
          data.push(obj);
      });
      const objStot=['Sous totaux ventes',`${this.stotventes}`];
      const objStot1=['Sous totaux Cash',`${this.stotcash}`];
      const objStot2=['Sous totaux Crédit',`${this.stotcredits }`];
      const objStot3=['Sous totaux Soldes',`${this.stotcash }`];
      data.push(objStot,objStot1,objStot2,objStot3,['DETAILS PAR VENDEUR']);
      this.sells.forEach(el => {
        data.push([el.user.user_name]);
        const objlist=['N°','Produit','Quantité','Total'];
        data.push(objlist);
        let compter =0;
        el.details.forEach(detail => {
          compter=compter+1;
          const obj =[
            compter,
            detail.name,
            (detail.quantity?detail.quantity:0),
            detail.total?detail.total:0
          ];
          data.push(obj);
        });
      });
      this.appserv.exportInToExcel(data,'csv','rapportventes');
    }
    
    if (criteria==='cashbook') {
      let data =[['ENTREES']];
      data.push(['N°','Date','Libellé','Imputation','Montant']);
      let index = 0;
      this.cashbooklist.entries.forEach(el => {
          index=index+1;
          const obj =[
            index,
            el.created_at,
            el.motif,
            el.name,
            el.amount
          ];
          data.push(obj);
      });
      const objStotE0=['Sous Total entrées',`${this.cashbooklist?.sum_entries}`];
      data.push(objStotE0,[]);
      data.push(['SORTIES']);
      data.push(['N°','Date','Libellé','Imputation','Montant']);
      let index2 = 0;
      this.cashbooklist.withdraw.forEach(el => {
          index2=index2+1;
          const obj =[
            index2,
            el.created_at,
            el.motif,
            el.name,
            el.amount
          ];
          data.push(obj);
      });

      const objStot0=['Sous Total sorties',`${this.cashbooklist.sum_withdraw}`];
      const objStot=['Total entrées',`${this.cashbooklist.sum_entries}`];
      const objStot1=['Total sorties',`${this.cashbooklist.total}`];
      const objStot2=['Total général',`${this.cashbooklist.total }`];
      const objStot3=['Solde',`${this.cashbooklist.sum_entries-this.cashbooklist.sum_withdraw}`];
      data.push(objStot0,[],objStot,objStot1,objStot2,objStot3);
      this.appserv.exportInToExcel(data,'csv','rapportlivrecaisse');
    }
  }

  gettingstockreport(){
    this.showprogress=true;
    this.showstockdetails=false;
    this.stockmouvementsdetails=[];
    this.showreportstockgroupedbydates=false;
    this.showreportstockcumul=true;
    this.reportserv.stockReport({'user_id':this.appserv.actualUser.id,from:this.stock_from,to:this.stock_to}).subscribe(
      (data:any)=>{
        console.log("stock report by date op",data);
        this.showprogress=false;
        this.stockmouvements=data.data;
        this.stock_from=data.from;
        this.stock_to=data.to;
        this.stockTotCalculation();
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast('Erreur survenue lors de la récuperation du rapport de stock.','danger');
      }
    );

    if (this.isStockModalOpen) {
      this.setStockFilterModalOpened(false);
    }
  }

  async gettingstockreportwithdetails(){
    this.showstockdetails=true;
    this.showreportstockcumul=true;
    this.showreportstockgroupedbydates=false;
    const load = await this.appserv.loadctrl.create({
      message:"Chargement du rapport en cours...",
      mode:'ios',
      showBackdrop:true,
      spinner:'circular'
    });
    load.present();
    this.stockserv.stockhistoryforuserbasedondateoperation({user_id:this.appserv.actualUser.id,from:this.stock_from,to:this.stock_to}).subscribe(
      response=>{
        load.dismiss();
        this.stockmouvementsdetails=response.data;
      },
      error=>{
        load.dismiss();
        this.appserv.presentToast('Erreur survenue lors de la récuperation du rapport de stock.','danger');
      });
  }

  async stockreportgroupedbydates(){
   this.showstockdetails=false;
    this.showreportstockcumul=false;
    this.showreportstockgroupedbydates=true;
    const load = await this.appserv.loadctrl.create({
      message:"Chargement du rapport en cours...",
      mode:'ios',
      showBackdrop:true,
      spinner:'circular'
    });
    load.present();
    this.stockserv.reportstockgroupedbydates({user_id:this.appserv.actualUser.id,from:this.stock_from,to:this.stock_to}).subscribe(
      response=>{
        load.dismiss();
        this.stockgroupedbydates=response;
      },
      error=>{
        load.dismiss();
        this.appserv.presentToast('Erreur survenue lors de la récuperation du rapport de stock.','danger');
      });
  }

  stockTotCalculation(){
    this.totalEntriesStock =0;
    this.totalWithdrawStock=0;
    this.totalSoldStock=0;
    this.totalsoldinventory=0;
    this.totalTotalBefore=0;
    if (this.stockmouvements.length>0) {
      this.stockmouvements.forEach(stock => {
        this.totalEntriesStock = this.totalEntriesStock + stock.totalEntries;
        this.totalWithdrawStock=this.totalWithdrawStock +stock.totalWithdraw;
        this.totalSoldStock=this.totalSoldStock + stock.sold;
        this.totalsoldinventory=this.totalsoldinventory + (parseFloat(stock.soldinventory));
        this.totalTotalBefore=this.totalTotalBefore + (parseFloat(stock.totalBefore));
      });
    }
  }

  async groupreportbyprices(){
    this.showreportcumulative=false;
    this.showreportsellgrouped=false;
    this.showreportsellgroupedbyprices=true;
    const load = await this.appserv.loadctrl.create({
      message:"Chargement du rapport en cours...",
      mode:'ios',
      showBackdrop:true,
      spinner:'circular'
    });
    load.present();
    this.reportserv.groupreportbyprices({'user_id':this.appserv.actualUser.id,from:this.sell_from,to:this.sell_to}).subscribe(
      data=>{
        load.dismiss();
        this.sellsgroupedbyprices=data;
      },
      error=>{
        load.dismiss();
        this.appserv.presentToast('Erreur survenue lors de la récuperation du rapport des ventes.','danger');
      });
  }

  sellsReport(){
    this.showreportsellgrouped=false;
    this.showreportsellgroupedbyprices=false;
    this.showreportcumulative=true;
    
    if (!this.sellReportwithDetails) {
      this.gotosellsReportWithoutDetails();
    } else {
      this.showprogress=true;
      this.reportserv.reportfilteredbydatesoperations({'user_id':this.appserv.actualUser.id,from:this.sell_from,to:this.sell_to}).subscribe(
        (data:any)=>{
          this.showprogress=false;
          this.sells=data.data;
          this.sell_from=data.from;
          this.sell_to=data.to;
          this.defaultMoney=data.money;
          this.sellsubtot.subtot_cash=data.subtot_cash;
          this.sellsubtot.subtot_credits=data.subtot_credits;
          this.sellsubtot.subtot_ht=data.subtot_ht;
          this.sellsubtot.subtot_ttc=data.subtot_ttc;
          this.sellsubtot.subtot_sold=data.subtot_sold;
          this.sellsubtot.subtot_ttc=data.subtot_ttc;
          this.sellsubtot.subtot_tva=data.subtot_tva;
        },
        error=>{
          console.log(error);
          this.showprogress=false;
          this.appserv.presentToast('Erreur survenue lors de la récuperation du rapport des ventes.','danger');
        });

        // if (this.isSellModalOpen) {
        //   this.setSellFilterModalOpened(false);
        // }
    }
  }

  sellsReportwithvat(){

    if (!this.sellReportwithDetails) {
      this.gotosellsReportWithoutDetailswithvat();
    } else {
          this.sellsubtot.subtot_cash=0;
          this.sellsubtot.subtot_credits=0;
          this.sellsubtot.subtot_ht=0;
          this.sellsubtot.subtot_ttc=0;
          this.sellsubtot.subtot_sold=0;
          this.sellsubtot.subtot_ttc=0;
          this.sellsubtot.subtot_tva=0;
      this.showprogress=true;
      this.reportserv.sellsReport({'user_id':this.appserv.actualUser.id,from:this.sell_from,to:this.sell_to}).subscribe(
        (data:any)=>{
          data.data.forEach(agent => {
              agent.sold=agent.sold-((agent.sold*this.vatpercent)/100);
              agent.cash=agent.cash-((agent.cash*this.vatpercent)/100);
              agent.credits=agent.credits-((agent.credits*this.vatpercent)/100);
              agent.totalVatAmount=agent.totalVatAmount-((agent.totalVatAmount*this.vatpercent)/100);
              agent.total_ht=agent.total_ht-((agent.total_ht*this.vatpercent)/100);
              agent.total_ttc=agent.total_ttc-((agent.total_ttc*this.vatpercent)/100);

              //subtotals calculation
              this.sellsubtot.subtot_cash=this.sellsubtot.subtot_cash+agent.cash;
              this.sellsubtot.subtot_credits=this.sellsubtot.subtot_credits+ agent.credits;
              this.sellsubtot.subtot_ht=this.sellsubtot.subtot_ht+ agent.total_ht;
              this.sellsubtot.subtot_ttc=this.sellsubtot.subtot_ttc+agent.total_ttc;
              this.sellsubtot.subtot_sold=this.sellsubtot.subtot_sold+agent.sold;
              this.sellsubtot.subtot_tva=this.sellsubtot.subtot_tva+agent.totalVatAmount;
             

              //details calculation
              agent.details.forEach(detail => {
                detail.total_sell=detail.total_sell-((detail.total_sell*this.vatpercent)/100);
                detail.total_quantity=detail.total_quantity-((detail.total_quantity*this.vatpercent)/100);
              });
          });
          this.showprogress=false;
          this.sells=data.data;
          this.sell_from=data.from;
          this.sell_to=data.to;
          this.defaultMoney=data.money;
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast('Erreur survenue lors de la récuperation du rapport des ventes.','danger');
        });

        // if (this.isSellModalOpen) {
        //   this.setSellFilterModalOpened(false);
        // }
    }
  }

  async gotosellsReportWithoutDetailswithvat(){
    this.showprogress=true;
    this.sellsubtot.subtot_cash=0;
    this.sellsubtot.subtot_credits=0;
    this.sellsubtot.subtot_ht=0;
    this.sellsubtot.subtot_ttc=0;
    this.sellsubtot.subtot_sold=0;
    this.sellsubtot.subtot_ttc=0;
    this.sellsubtot.subtot_tva=0;
    this.reportserv.sellsReportWithoutDetails({'user_id':this.appserv.actualUser.id,from:this.sell_from,to:this.sell_to}).subscribe(
      (data:any)=>{
     
        data.data.forEach(agent => {
           
            agent.cash=agent.cash-((agent.cash*this.vatpercent)/100);
            agent.credits=agent.credits-((agent.credits*this.vatpercent)/100);
            agent.totalVatAmount=agent.totalVatAmount-((agent.totalVatAmount*this.vatpercent)/100);
            agent.total_ht=agent.total_ht-((agent.total_ht*this.vatpercent)/100);
            agent.total_ttc=(agent.total_ttc-((agent.total_ttc*this.vatpercent)/100));
            agent.sold=(agent.sold-((agent.sold*this.vatpercent)/100));

            //subtotals calculation
            this.sellsubtot.subtot_cash=this.sellsubtot.subtot_cash+agent.cash;
            this.sellsubtot.subtot_credits=this.sellsubtot.subtot_credits+ agent.credits;
            this.sellsubtot.subtot_ht=this.sellsubtot.subtot_ht+ agent.total_ht;
            this.sellsubtot.subtot_tva=this.sellsubtot.subtot_tva+agent.totalVatAmount;
            this.sellsubtot.subtot_ttc=(this.sellsubtot.subtot_ttc+agent.total_ttc);
            this.sellsubtot.subtot_sold=(this.sellsubtot.subtot_sold+agent.sold);

        });

        this.showprogress=false;
        this.sells=data.data;
        this.sell_from=data.from;
        this.sell_to=data.to;
        this.defaultMoney=data.money;
    
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast('Erreur survenue lors de la récuperation du rapport des ventes.','danger');
      });

      // if (this.isSellModalOpen) {
      //   this.setSellFilterModalOpened(false);
      // }
  }
  
  tvafilter(criteria:string){
    this.sellReportwithDetails=true;
    switch (criteria) {
      case 'yes':
        this.criteriafilterwithvat='vat';
       
        this.filteredbytva('vat');
        
        break; 
      case 'not':
        this.criteriafilterwithvat='not vat';
        this.filteredbytva('not vat');
        break;
      case 'all':
        this.criteriafilterwithvat='';
        this.sellsReportwithvat();
        break;
    
      default:
        break;
    }
  }

  async filteredbytva(criteria:string){
      this.sellsubtot.subtot_cash=0;
      this.sellsubtot.subtot_credits=0;
      this.sellsubtot.subtot_ht=0;
      this.sellsubtot.subtot_ttc=0;
      this.sellsubtot.subtot_sold=0;
      this.sellsubtot.subtot_ttc=0;
      this.sellsubtot.subtot_tva=0;
    this.reportserv.sellsReportfilteredbytva({filter:criteria,'user_id':this.appserv.actualUser.id,from:this.sell_from,to:this.sell_to}).subscribe(
      (data:any)=>{
        data.data.forEach(agent => {
          agent.sold=agent.sold-((agent.sold*this.vatpercent)/100);
          agent.cash=agent.cash-((agent.cash*this.vatpercent)/100);
          agent.credits=agent.credits-((agent.credits*this.vatpercent)/100);
          agent.totalVatAmount=agent.totalVatAmount-((agent.totalVatAmount*this.vatpercent)/100);
          agent.total_ht=agent.total_ht-((agent.total_ht*this.vatpercent)/100);
          agent.total_ttc=agent.total_ttc-((agent.total_ttc*this.vatpercent)/100);

          //subtotals calculation
          this.sellsubtot.subtot_cash=this.sellsubtot.subtot_cash+agent.cash;
          this.sellsubtot.subtot_credits=this.sellsubtot.subtot_credits+ agent.credits;
          this.sellsubtot.subtot_ht=this.sellsubtot.subtot_ht+ agent.total_ht;
          this.sellsubtot.subtot_ttc=this.sellsubtot.subtot_ttc+agent.total_ttc;
          this.sellsubtot.subtot_sold=this.sellsubtot.subtot_sold+agent.sold;
          this.sellsubtot.subtot_tva=this.sellsubtot.subtot_tva+agent.totalVatAmount;
         

          //details calculation
          agent.details.forEach(detail => {
            detail.total_sell=detail.total_sell-((detail.total_sell*this.vatpercent)/100);
            detail.total_quantity=detail.total_quantity-((detail.total_quantity*this.vatpercent)/100);
          });
      });
        this.showprogress=false;
        this.sells=data.data;
        this.sell_from=data.from;
        this.sell_to=data.to;
        this.defaultMoney=data.money;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast('Erreur survenue lors du filtre par TVA.','danger');
      });
  }

  async sellreportgroupedbydates(){
    this.showreportcumulative=false;
    this.showreportsellgroupedbyprices=false;
    this.showreportsellgrouped=true;
    const load = await this.appserv.loadctrl.create({
      message:"Chargement du rapport en cours...",
      mode:'ios',
      showBackdrop:true,
      spinner:'circular'
    });
    load.present();
    this.reportserv.sellsreportgroupedbydates({'user_id':this.appserv.actualUser.id,from:this.sell_from,to:this.sell_to}).subscribe(
      data=>{
        this.sellsgroupedbydates=data.details;
        this.cumuldateoperations=data.cumul;
        load.dismiss();
      },
      error=>{
        this.appserv.presentToast('Erreur survenue lors du groupage du rapport par date.','danger');
        load.dismiss();
      });
  }

  async gotosellsReportWithoutDetails(){
    this.showprogress=true;
    this.reportserv.sellsReportWithoutDetails({'user_id':this.appserv.actualUser.id,from:this.sell_from,to:this.sell_to}).subscribe(
      (data:any)=>{
        console.log('sell report by dates from api',data);
        this.showprogress=false;
        this.sells=data.data;
        this.sell_from=data.from;
        this.sell_to=data.to;
        this.defaultMoney=data.money;
        this.sellsubtot.subtot_cash=data.subtot_cash;
        this.sellsubtot.subtot_credits=data.subtot_credits;
        this.sellsubtot.subtot_ht=data.subtot_ht;
        this.sellsubtot.subtot_ttc=data.subtot_ttc;
        this.sellsubtot.subtot_sold=data.subtot_sold;
        this.sellsubtot.subtot_ttc=data.subtot_ttc;
        this.sellsubtot.subtot_tva=data.subtot_tva;

        this.totalEntriesPoints=data.fidelityreport?.totalEntriesPoints;
        this.totalSellBypoints=data.fidelityreport?.totalSellBypoints;
        this.totalEntriesBonus=data.fidelityreport?.totalEntriesBonus;
        this.totalSellByBonus=data.fidelityreport?.totalSellByBonus;
        this.totalEntriesCautions=data.fidelityreport?.totalEntriesCautions;
        this.totalSellByCautions=data.fidelityreport?.totalSellByCautions;
        this.totalfidelity=this.totalEntriesCautions+this.totalSellByCautions+this.totalEntriesBonus+this.totalSellByBonus+ this.totalEntriesPoints+this.totalSellBypoints;
      },
      error=>{
        console.log(error);
        this.showprogress=false;
        this.appserv.presentToast('Erreur survenue lors de la récuperation du rapport des ventes.','danger');
      });

      // if (this.isSellModalOpen) {
      //   this.setSellFilterModalOpened(false);
      // }
  }
  
  async stockbyarticle(){

  }

  async gotostockarticlepicker(){
    const modal = await this.appserv.modalCtrl.create({
      component:PickservicesComponent,
      cssClass:'modal-border-radius-20',
      initialBreakpoint:0.75,
      breakpoints:[0.25,0.50,0.75,1]
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
      if(data.length>0){
        this.actualarticles=data;
      }
    }
  }

  async reportstockbyarticles(){
    let object =[];
    this.actualarticles.forEach(element => {
      object.push(element.service.id)
    });
    this.showprogress=true;
    this.reportserv.stockReportByArticles({user_id:this.appserv.actualUser.id,from:this.stock_from,to:this.stock_to,services:object}).subscribe(
      (data:any)=>{
        this.showprogress=false;
        console.log("gotton by articles",data);
        this.gotoprintstockbyarticlesview(data,"stockbyarticles");
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast('Erreur survenue lors du filtre des articles.','danger');
      });

      if (this.isStockModalOpen) {
        this.setStockFilterModalOpened(false);
      }
  }

  async gotoprintstockbyarticlesview(data: any,criteria: string){
    const modal = await this.appserv.modalCtrl.create({
      component:PrintstockbyarticlesComponent,
      componentProps:{"datasent":data,"criteria":criteria},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
  }

  async pickdeposits(){
    const modal = await this.appserv.modalCtrl.create({
      component:DepositForSpecificUserComponent,
      componentProps:{"criteria":"multiple"},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {role, data} = await modal.onWillDismiss();
    if (role==="selected") {
      this.listdeposits=data; 
    }
  } 
  
  async sellpickdeposits(){
    const modal = await this.appserv.modalCtrl.create({
      component:DepositForSpecificUserComponent,
      componentProps:{"criteria":"multiple"},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {role, data} = await modal.onWillDismiss();
    if (role==="selected") {
      this.listdepositsSell=data; 
    }
  }

  async reportdepositsandarticlesSell(){
    const load = await this.appserv.loadctrl.create({
      message:"Chargement rapport en cours...",
      spinner:"circular",
      mode:'ios',
      translucent:true
    });
    load.present();
    const services = [];
    const deposits = [];
    this.actualarticlesSell.forEach(article => {
      services.push(article.service.id);
    });

    this.listdepositsSell.forEach(deposit => {
      deposits.push(deposit.id);
    });
    const datatosend={from:this.sell_from,to:this.sell_to,user_id:this.appserv.actualUser.id,services:services,deposits:deposits};
    this.reportserv.sellsReportDepositArticles(datatosend).subscribe(
      data=>{
        load.dismiss();
        this.gotoprintstockbyarticlesview(data,"sellreportdepositsarticles");
      },error=>{
        load.dismiss();
        this.appserv.presentToast("Erreur de récupération de données sur le serveur.","warning")
      });

      // if (this.isSellModalOpen) {
      //   this.setSellFilterModalOpened(false);
      // }
  }

  async SellReportByArticles(){
    const load = await this.appserv.loadctrl.create({
      message:"Chargement rapport en cours...",
      spinner:"circular",
      mode:'ios',
      translucent:true
    });
    load.present();
    const object = [];
    this.actualarticlesSell.forEach(article => {
      object.push(article.service.id);
    });

    this.reportserv.sellsReportByArticles({from:this.sell_from,to:this.sell_to,user_id:this.appserv.actualUser.id,services:object}).subscribe(
      data=>{
        load.dismiss();
        this.gotoprintstockbyarticlesview(data,"sellreportbyarticles")
      },error=>{
        load.dismiss();
        this.appserv.presentToast("Erreur de récupération de données sur le serveur.","warning")
      });

   
      // if (this.isSellModalOpen) {
      //   this.setSellFilterModalOpened(false);
      // }
  }

  async sellagentsfilter(){
    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{"criteria":"multiple"},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="selected") {
      this.listagentsSell=data;
    }
  }

  async sellsReportbyAgents(){
    if (this.listagentsSell.length>0) {
      const load = await this.appserv.loadctrl.create({
        message:"Chargement rapport en cours...",
        spinner:"circular",
        mode:'ios',
        translucent:true
      });
      // load.present();
      const agents = [];
  
      this.listagentsSell.forEach(agent => {
        agents.push(agent.id);
      });
      const datatosend={from:this.sell_from,to:this.sell_to,user_id:this.appserv.actualUser.id,agents:agents};
      this.reportserv.sellsReportByAgents(datatosend).subscribe(
        data=>{
          load.dismiss();
          this.gotoprintstockbyarticlesview(data,"sellreportagents")
        },error=>{
          load.dismiss();
          this.appserv.presentToast("Erreur de récupération de données sur le serveur.","warning")
        });
  
        // if (this.isSellModalOpen) {
        //   this.setSellFilterModalOpened(false);
        // }
  
    } else {
      this.appserv.presentToast("Veuillez sélectionner au moins un agent","warning");
    }
  }

  resetsellagentslist(){
    this.listagentsSell=[];
  }
  async viewselecteddeposits(){
    const modal = await this.appserv.modalCtrl.create({
      component:DynamicviewerComponent,
      componentProps:{"criteria":"deposits","listdeposits":this.listdeposits},
      cssClass:"modal-border-radius-20",
      initialBreakpoint:0.75,
      breakpoints:[0.25,0.50,0.75,1]
    });
    modal.present();
  }
  resetarticleslist(){
    this.actualarticles=[];
  }
  async dynamiviewer(criteria: string, datasent: any){

    const modal = await this.appserv.modalCtrl.create({
      component:DynamicviewerComponent,
      componentProps:{"criteria":criteria,"datasent":datasent},
      cssClass:"modal-border-radius-20",
      initialBreakpoint:0.75,
      breakpoints:[0.25,0.50,0.75,1]
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="removed") {
      criteria==="articles"?this.actualarticles=data:criteria==="deposits"?this.listdeposits=data:"";
    }
  } 
  
  async selldynamiviewer(criteria: string, datasent: any){

    const modal = await this.appserv.modalCtrl.create({
      component:DynamicviewerComponent,
      componentProps:{"criteria":criteria,"datasent":datasent},
      cssClass:"modal-border-radius-20",
      initialBreakpoint:0.75,
      breakpoints:[0.25,0.50,0.75,1]
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="removed") {
      switch (criteria) {
        case "articles":
          this.actualarticlesSell=data
          break; 
        case "deposits":
          this.listdepositsSell=data
          break; 
        case "agents":
          this.listagentsSell=data
          break; 
        case "customers":
          this.actualcustomers=data
          break;
        case "funds":
          this.actualfundscashbooks=data
          break; 
        case "accounts":
          this.listcashbookaccounts=data
          break;
        case "agents_cashbooks":
          this.listagentsCasbooks=data
          break;  
        case "collectors":
          this.actualfirstentriescollectors=data
          break; 
        case "members":
          this.actualfirstentriesmembers=data
          break; 
        case "moneys":
          this.actualfirstentriesmoneys=data
          break; 
        case "transactionmoneys":
          this.actualtransactionsmoneys=data
          break; 
        case "memberstransactions":
          this.actualtransactionsmembers=data
          break; 
        case "cashiers":
          this.actualtransactionscashiers=data
          break;
      
        default:
          break;
      }
      // criteria==="articles"?this.actualarticlesSell=data:criteria==="deposits"?this.listdepositsSell=data:criteria==="agents"?this.listagentsSell=data:criteria==="customers"?this.actualcustomers=data:criteria==="funds"?this.actualfundscashbooks=data:criteria==="accounts"?this.listcashbookaccounts=data:criteria==="agents_cashbooks"?this.listagentsCasbooks=data:"";
    }
  }  
  
  stotsellescalculation(){
    this.stotcash=0;
    this.stotcredits=0;
    this.stotventes=0;
    this.sells.forEach(element => {
      this.stotcash=this.stotcash+(element.cash?element.cash:0);
      this.stotcredits=this.stotcredits+(element.credits?element.credits:0);
      this.stotventes=this.stotcash+this.stotcredits;
    });
  }

 async  creditsdatefilter(){
    const period = await  this.periodic();
    this.credits_from=period.from;
    this.credits_to=period.to;
  } 
  
  async  paymentsdatefilter(){
    const period = await  this.periodic();
    this.payment_from=period.from;
    this.payment_to=period.to;
  }

  async creditsreport(){
    this.showprogress=true;
    this.reportserv.credits({enterprise_id:this.appserv.actualEse.id,user_id:this.appserv.actualUser.id,from:this.credits_from,to:this.credits_to}).subscribe(
      (response:any)=>{
        console.log('credits report',response);
        this.showprogress=false;
        this.credits=response.data;
        this.credits_from=response.from;
        this.credits_to=response.to;
        this.defaultMoney=response.money;
        this.totalcredits=response.totalgeneralcredit;
        this.totalcreditspayed=response.totalgeneralpayed;
        this.totalcreditsSold=response.totalgeneralsold;
        this.totalcreditsSoldnet=response.totalgeneralsoldnet;
        if (this.isCreditsModalOpen) {
          this.setCreditsFilterModalOpened(false);
        }
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast('Erreur survenue lors de la récuperation du rapport des credits.','danger');
      }
    );
  }

  cashbookreport(){
    this.showprogress=true;
    this.reportserv.cashbook({'user_id':this.appserv.actualUser.id,from:this.cash_book_from,to:this.cash_book_to}).subscribe(
      (data:any)=>{
        this.showprogress=false;
        this.cashbooklist=data.data;
        this.cash_book_from=data.from;
        this.cash_book_to=data.to;
        this.defaultMoney=data.money;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast('Erreur survenue lors de la récuperation du livre de caisse.','danger');
      }
    );
  }

  async print(bloc:string){
    var win = window.open('','_blank','popup=1');
    win.document.write(`<html><head><title>Impression</title><style>
     body {
       font-size: x-small;
       font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
     }
     table{
           width: 100%;
           border-collapse: collapse;
       }
       .header{
           border-style: none none dashed none;
           border-width: 1px;
       }

       .suheader{
           border-style: none none dashed none;
           border-width: 1px;
       }
       thead{
         font-size:11!important;
       }
       table tbody{
           border-style: none none dashed none;
           border-width: 1px;
           font-size:11!important;
       }

       tfoot{
           font-size:11!important;
       }
     .text-wrapped{
       word-wrap: break-word;
     }
     .text-right{
       text-align: right;
     }
     .font-size-10{
       font-size: 10px !important;
     }   
     .font-size-14{
       font-size: 14px !important;
     }
     .font-size-15{
      font-size: 15!important;
     } 
     .font-size-16{
       font-size: 16px !important;
     }
     .font-size-20{
      font-size:20px !important;
     }
     .font-bold-600{
       font-weight: 600;
     }  
     .bg-medium-clean{
      background: #c0c1c2;
      }
     .text-italic{
       font-style: italic;
     }
     .font-bold-500{
      font-weight: 500;
      }
     .text-left{
       text-align:left;
     }
     .details-invoice{
      display: table;
      border-collapse: collapse;
      width: 100%;
  }
  .details-invoice > * {
      display: table-row;
      // border: 1px solid black;
      padding: 5px;
      .details-invoice-tr{
          span{
              display: table-cell;
              margin-right: 10px;
              border: 0.5px solid black;
          }
      }
    }
 </style></head><body>`);
     win.document.write(document.getElementById('header-bloc').innerHTML);
     win.document.write(document.getElementById(bloc).innerHTML);
     win.document.write('</body></html>');
     win.print();
     win.close();
  }

}
