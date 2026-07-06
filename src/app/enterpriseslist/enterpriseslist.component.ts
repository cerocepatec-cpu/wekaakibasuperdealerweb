import { Component, OnInit,ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import Chart from 'chart.js/auto';
import { UsersService } from '../services/users.service';
import { Debts } from '../interfaces/debts';
import { Fences } from '../interfaces/fences';
import { OthersEntries } from '../interfaces/otherentries';
import { Expenditures } from '../interfaces/expenditures';
import { Invoice } from '../interfaces/invoices';
import { OthersentriesPage } from '../othersentries/othersentries.page';
import { ExpendituresComponent } from '../finances/expenditures/expenditures.component';
import { InvoicesComponent } from '../finances/invoices/invoices.component';
import { DebtsPage } from '../debts/debts.page';
import { MemberstransactionsService } from '../services/memberstransactions.service';
import { IonInput } from '@ionic/angular';
import { UserpickerComponent } from '../agents/userpicker/userpicker.component';
import { Users } from '../interfaces/users';
import { TransactionsvalidationComponent } from '../transactionsvalidation/transactionsvalidation.component';
import { Enterprise } from '../interfaces/enterprise';
import { EnterpriseService } from '../services/enterprise.service';

@Component({
  selector: 'app-enterpriseslist',
  templateUrl: './enterpriseslist.component.html',
  styleUrls: ['./enterpriseslist.component.scss'],
})
export class EnterpriseslistComponent implements OnInit {
  showprogress=false;
  @ViewChild('defaultinput') defaultinput :IonInput;
  enterpriseslist:any[]=[];
  transactionslist:any[]=[];
  total_transactions=0;
  total_transactions_pending=0;
  total_transactions_validated=0;
  selectedmembers:Users[]=[];
  search:any;
  keptTransactionslist:any[]=[];
  selectedtransactionslist:any[]=[];
  buttonselectalltransactions=false;
  generalfiltrer="date";
  loaded=false;
  nbrfirstentries=0;
  nbrmembersaccountstovalidate=0;
  
  total_cash=0;
  total_credits=0;
  total_entries=0;
  total_expenditures=0;
  total_fences=0;
  total_debts=0;
  sold_fund=0;
  totalGeneralEntries=0;
  totalGeneralExpenditures=0;
  
  totalfidelity=0;
  totalEntriesCautions=0;
  totalSellByCautions=0;
  totalSellByBonus=0;
  totalEntriesBonus=0;
  totalSellBypoints=0;
  totalEntriesPoints=0;
  
  cash:Invoice[]=[];
  credits:Invoice[]=[];
  expenditures:Expenditures[]=[];
  entries:OthersEntries[]=[];
  fences:Fences[]=[];
  debts:Debts[]=[];
  monthtotalentries=0;
  accountsegment="all";
  from=this.appserv.defaultdate();
  to=this.appserv.defaultdate();
  accounts:any;
  accountsFiltered:any;
  maxAccount:any;
  minAccount:any;
  actualuser:any;
  showaccountentry=true;
  showaccountexp=true;
  defaultMoney=this.appserv.getDefaultmoney();
  totalaccounts=0;
  chart: any;
  soldChart: any;
  labelChart:string[]=[];
  ChartData:string[]=[];
  
  
    constructor(public appserv: AppservicesService,private transactionserv: MemberstransactionsService, private enterpriseserv: EnterpriseService) { }
  
    ngOnInit() {
      this.actualuser=this.appserv.getactualuser();
      this.dashboard();
    }
  
    async menuenterprise(enterprise:Enterprise){
     let menubuttons=[];
     menubuttons.unshift({text: 'Annuler',role:'cancel'});
     if (enterprise.status==="disabled") {
      menubuttons.push( {text:'Activer',handler:()=>{this.changeEnterpriseStatus(enterprise,"enabled");}});
     } 
     
     if (enterprise.status==="enabled") {
      menubuttons.push({text:'Désactiver',handler:()=>{this.changeEnterpriseStatus(enterprise,"disabled");}});
     }

      const menu = await this.appserv.actionsheetctrl.create({
        header:enterprise.name,
        animated:true,
        mode:'ios',
        translucent:true,
        buttons:menubuttons
      });
      menu.present();
    }

    async changeEnterpriseStatus(enterprise:any,status:string){
      const load = await this.appserv.loadctrl.create({
        message:status==="enabled"?"Activation en cours...":"Désactivation en cours...",
        mode:'ios',
        translucent:true,
        spinner:'circular'
      });
      load.present();
      let enterprisesent=[];
      enterprise.status_sent=status;
      enterprisesent.push(enterprise);
      this.enterpriseserv.updatestatus({done_by:this.appserv.actualUser.id,enterprises:enterprisesent}).subscribe(
        response=>{
          console.log('ese status from api',response);
          load.dismiss();
        },
        error=>{
          load.dismiss();
        });
    }

    handletransactionchange($event,transaction:any){
      if ($event.detail.checked) {
        transaction.selected=true;
        this.selectedtransactionslist.push(transaction);
      }else{
        transaction.selected=false;
        this.selectedtransactionslist=this.selectedtransactionslist.filter(t=>t!==transaction);
      }
      console.log(this.selectedtransactionslist.length,this.transactionslist.length);
      if (this.selectedtransactionslist.length===this.transactionslist.length) {
        this.buttonselectalltransactions=true;
      }else{
        this.buttonselectalltransactions=false;
      }
    }
    selectalltransactions($event){
      if ($event.detail.checked) {
        this.transactionslist.map((transaction)=>{
          transaction.selected=true;
        });
        this.selectedtransactionslist=this.transactionslist;
      }else{
        this.selectedtransactionslist=[];
        this.transactionslist.map((transaction)=>{
          transaction.selected=false;
        });
      }
      // console.log($event); 
    }
  
   
    handletypechanged($event){
      if ($event.detail.value==='all') {
        this.transactionslist=this.keptTransactionslist;
      }else{
        this.transactionslist=this.keptTransactionslist.filter(t=>t.type===$event.detail.value);
      }
    }
  
    transactionsfilter(criteria:any){
      if (criteria==='all') {
        this.search="";
        this.selectedmembers=[];
        this.transactionslist=this.keptTransactionslist;
      }else{
        this.transactionslist=this.keptTransactionslist.filter(t=>t.transaction_status===criteria);
      }
      
    }
  
    handleRefresh(event:any) {
      setTimeout(() => {
        this.ngOnInit();
        event.target.complete();
      }, 2000);
    };
  
    ionViewDidEnter(){
      this.defaultinput.setFocus();
    }
  
    async agentsfilter(){
      const modal = await this.appserv.modalCtrl.create({
        component:UserpickerComponent,
        componentProps:{"criteria":"multiple"},
        cssClass:"modal-border-radius-20"
      });
      modal.present();
      const {data,role} = await modal.onWillDismiss();
      if (role==="selected") {
        this.selectedmembers=data;
        this.alltransactions();
      }
    }
    async alltransactions(){
      this.transactionslist=[];
      this.selectedtransactionslist=[];
      this.showprogress=true;
      this.loaded=true;
      let members=[];
      if (this.selectedmembers.length>0) {
        this.selectedmembers.forEach(member => {
          members.push(member.id);
        });
      }
      this.transactionserv.transactionshistories({enterprise_id:this.appserv.getactualEse().id,from:this.from,to:this.to,user_id:this.appserv.getactualuser().id,members:members}).subscribe(
        response=>{
          this.loaded=false;
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
            this.keptTransactionslist=this.transactionslist;
            this.total_transactions_pending=this.transactionslist.filter(trans=>trans.transaction_status==='pending').length;
            this.total_transactions_validated=this.transactionslist.filter(trans=>trans.transaction_status==='validated').length;
          }
        },error=>{
          console.log(error);
          this.loaded=false;
          this.showprogress=false;
          this.appserv.presentToast("Erreur survenue lors du chargement des transactions.","danger");
        });
    }
  
    async menutransaction(transaction:any){
      const modal = await this.appserv.modalCtrl.create({
        component:TransactionsvalidationComponent,
        componentProps:{transactionsent:transaction},
        cssClass:"modal-border-radius-20"
      });
      modal.present();
    }
    
     filteraccounts(){
      if (this.accounts && this.accounts.length>0) {
        let accoutslist = this.accounts;
     
        if (this.accountsegment==='all') {
          const maxAcc = Math.max(...accoutslist.map(ac=>ac.expenditures_amount+ac.entries_amount));
          let listmax = accoutslist.filter(a=>a.expenditures_amount+a.entries_amount === maxAcc);
          this.maxAccount=listmax;
            
          const minAcc = Math.min(...accoutslist.map(ac=>(ac.expenditures_amount+ac.entries_amount)>0));
          let listmin = accoutslist.filter(a=>a.expenditures_amount+a.entries_amount === minAcc);
          this.minAccount=listmin;
        }
      
        if(this.accountsegment==='entries'){
          const maxAcc = Math.max(...accoutslist.map(ac=>ac.entries_amount));
          let listmax = accoutslist.filter(a=>a.entries_amount === maxAcc);
          this.maxAccount=listmax;
           
          const minAcc = Math.min(...accoutslist.map(ac=>ac.entries_amount));
          let listmin = accoutslist.filter(a=>a.entries_amount === minAcc);
          this.minAccount=listmin;
        }
        
        if(this.accountsegment==='withdraw'){
          const maxAcc = Math.max(...accoutslist.map(ac=>ac.expenditures_amount));
          let listmax = accoutslist.filter(a=>a.expenditures_amount=== maxAcc);
          this.maxAccount=listmax;
          
          const minAcc = Math.min(...accoutslist.map(ac=>ac.expenditures_amount));
          let listmin = accoutslist.filter(a=>a.expenditures_amount === minAcc);
          this.minAccount=listmin;
        } 
      }
     }
      dashboard(){
        this.showprogress=true;
        // const object ={'from':this.from,'to':this.to,'user_id':this.appserv.getactualuser().id};
        if (this.appserv.isMyDeviceConnected()) {
          this.appserv.enterpriseslist().subscribe(
            (data:any)=>{
              console.log('dashboard data',data);
              this.showprogress=false;
              this.enterpriseslist=data;
            },
            error=>{
            this.showprogress=false;
              this.appserv.presentToast('Une erreur est survenue lors de la récupération des données','danger');
            });
    
        }else{
          this.showprogress=false;
          this.total_cash=0;
          this.total_credits=0;
          this.total_entries=0;
          this.total_expenditures=0;
          this.total_fences=0;
          this.total_debts=0;
          this.cash=[];
          this.credits=[];
          this.expenditures=[];
          this.entries=[];
          this.fences=[];
          this.debts=[];
          this.accounts=[];
          this.sold_fund=0;
          this.defaultMoney=this.appserv.defaultmoney;
          this.totalaccounts=0;
          this.totalGeneralEntries=0;
          this.totalGeneralExpenditures=0;
        } 
    }
    
    /** fences methods */
      deletefilterfences(){}
      async fencesfilterbyagent(){}
      async fencesfilterPOS(){}
      async fencesperiodicfilter(){
       const period = await this.periodicfilter();
      }
    
      async gotoentries(){
        const modal = await this.appserv.modalCtrl.create({
          component:OthersentriesPage,
          cssClass:"modal-border-radius-20"
        });
        modal.present();
        await modal.onWillDismiss();
        this.ngOnInit();
      }  
      
      async gotodebts(){
        const modal = await this.appserv.modalCtrl.create({
          component:DebtsPage,
          componentProps:{"ismodal":true},
          cssClass:"modal-border-radius-20"
        });
        modal.present();
        await modal.onWillDismiss();
        this.ngOnInit();
      }   
      
      async gotoinvoices(){
        const modal = await this.appserv.modalCtrl.create({
          component:InvoicesComponent,
          cssClass:"modal-border-radius-20"
        });
        modal.present();
        await modal.onWillDismiss();
        this.ngOnInit();
      }  
      
      async gotoexpenditures(){
        const modal = await this.appserv.modalCtrl.create({
          component:ExpendituresComponent,
          cssClass:"modal-border-radius-20"
        });
        modal.present();
        await modal.onWillDismiss();
        this.ngOnInit();
      }
      /**
       * Balance methods
       */
      deletefilterbalance(){}
    
      async balanceperiodicfilter(){
        const period = await this.periodicfilter();
      }
      
      async filterbalancePOS(){}
    
      
    
      /**
       * Accounts methods
       */
      async deletefilteraccount(){}
    
      async accountperiodicfilter(){
        const period = await this.periodicfilter();
      }
    
      async accountsfilterbyagent(){}
    
      async accountAccountfilter(){}
    
      async accountPOSfilter(){}
    
      accountsegmentfilter(){
        if (this.accountsegment==='all') {
          this.showaccountentry=true;
          this.showaccountexp=true;
        }
    
        if(this.accountsegment==='entries'){
          this.showaccountentry=true;
          this.showaccountexp=false;
        }
        
        if(this.accountsegment==='withdraw'){
          this.showaccountentry=false;
          this.showaccountexp=true;
        }
      }
    
      /**
       * Debts methods
       */
      async deletefilterDebts(){}
      
      async debtfilterbyagent(){}
    
      async debtperiodicfilter(){
        const period = await this.periodicfilter();
      }
    
      async debtfilterbyCustomer(){}
      async debtfilterbyPOS(){}
      /**
       * Expenditures methods
       */
      async deletefilterExpenditures(){}
      async ExpendituresFilterbyAgent(){}
      async ExpendituresPeriodicFilter(){
        const period = await this.periodicfilter();
      }
      async ExpendituresFilterbyAccount(){}
      async ExpendituresFilterbyPOS(){}
    
      /**
       * Entries
       */
      async deletefilterEntries(){}
      async EntriesFilterbyAgent(){}
      async EntriesPeriodicFilter(){
        const period = await this.periodicfilter();
      }
      async EntriesFilterbyAccount(){}
      async EntriesFilterbyPos(){}
    
      /**
       * general methods
       */
      async periodicfilter(){
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
    
      async dashboardperiodfilter(){
        this.generalfiltrer="date";
        const period = await  this.periodicfilter();
        this.from=period.from;
        this.to=period.to;
        this.alltransactions();
      }
      async generalPOSfilter(){}
  
    barchart(){
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: this.labelChart,
          datasets: [
            {
              label:`Montant en ${this.appserv.getDefaultmoney().abreviation}`,
              data: this.ChartData,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }  
    
    SoldBarChart(){
      if(this.soldChart){
        this.soldChart.destroy();
      }
      this.soldChart = new Chart('soldcanvas', {
        type:'doughnut',
        data:{
        labels: [
          'Sorties',
          'Entrées'
        ],
        datasets: [{
          label:`Montant en ${this.defaultMoney.abreviation}`,
          data: [this.totalGeneralExpenditures,this.totalGeneralEntries],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)'
          ],
          hoverOffset: 2
        }]
      },
    options:{
      animation:{
        animateRotate:true
      }
    }});
    }  
    
    MobileSoldBarChart(){
      if(this.soldChart){
        this.soldChart.destroy();
      }
      this.soldChart = new Chart('soldcanvas2', {
        type:'doughnut',
        data:{
        labels: [
          'Sorties',
          'Entrées'
        ],
        datasets: [{
          label:`Montant en ${this.defaultMoney.abreviation}`,
          data: [this.totalGeneralExpenditures,this.totalGeneralEntries],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)'
          ],
          hoverOffset: 2
        }]
      },
    options:{
      animation:{
        animateRotate:true
      }
    }});
    }
}
