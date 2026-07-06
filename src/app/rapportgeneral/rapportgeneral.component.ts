import { Component, Input, OnInit,ViewChild } from '@angular/core';
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
import { FenceService } from '../services/fence.service';
import { InfosfenceComponent } from '../finances/fences/infosfence/infosfence.component';
import { VersementsComponent } from '../finances/fences/versements/versements.component';
import { MemberstransactionsService } from '../services/memberstransactions.service';
import { IonInput } from '@ionic/angular';
import { UserpickerComponent } from '../agents/userpicker/userpicker.component';
import { Users } from '../interfaces/users';
import { TransactionsvalidationComponent } from '../transactionsvalidation/transactionsvalidation.component';
import { articlePaginator } from '../interfaces/articlespaginator';
import {trigger,state,style,transition,animate} from '@angular/animations';
import { SelectCashAccountSheetComponent } from '../select-cash-account-sheet/select-cash-account-sheet.component';
 
@Component({
  selector: 'app-rapportgeneral',
  templateUrl: './rapportgeneral.component.html',
  styleUrls: ['./rapportgeneral.component.scss'],
  animations: [
    trigger('toggleSubtotals', [
      state('hidden', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden',
        padding: '0',
        margin: '0',
      })),
      state('visible', style({
        height: '*',
        opacity: 1,
        overflow: 'auto',
      })),
      transition('hidden <=> visible', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class RapportgeneralComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput! :IonInput;
  @ViewChild('filterpopover') filterpopover!: HTMLIonPopoverElement;
  @Input() ismodal:boolean;
  paginationOptions:articlePaginator={};
  isAllDataSelected:boolean = false;
  allSelected: boolean = false;
  defaultview:string='table';
  isFilterPopoverOpened=false;
  transactionscashiers:Users[]=[];
  subtotalsbymoney:any[]=[];
  showsubtotals:boolean=false;
  showSubtotalsToggle =false;
  listtubs:any[]=[];
  isModalFundsOpen:boolean = false;
  
transactionslist:any[]=[];
total_transactions=0;
total_transactions_pending=0;
total_transactions_validated=0;
selectedmembers:Users[]=[];
search:any;
keptTransactionslist:any[]=[];
listselecteddata:any[]=[];
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
showprogress=false;
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

  constructor(public appserv: AppservicesService,private userServ: UsersService,private transactionserv: MemberstransactionsService, private Fenceserv: FenceService) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
      this.from=this.appserv.defaultdate();
    this.to=this.appserv.defaultdate();
    this.alltransactions();
  }

   ngAfterViewInit(){
    setTimeout(() => { this.defaultinput.setFocus(); }, 100);
  }

  closemodaltubs(value:boolean){
    this.isModalFundsOpen=value;
    this.appserv.modalCtrl.dismiss();
  }

  async validateimputations(fund:any){
    const alert = await this.appserv.alertctrl.create({
      header:"Validation imputation",
      mode:'ios',
      translucent:true,
      message:"Voulez-vous vraiment valider cette imputation?",
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:async ()=>{
          const load = await this.appserv.loadctrl.create({
            message:"Imputation en cours...",
            mode:'ios',
            spinner:'circular',
            translucent:true,
          });
          load.present();
          this.transactionserv.validateimputation({user_id:this.appserv.getactualuser().id,tub:fund,data:this.listselecteddata}).subscribe({
            next:(response)=> {
                load.dismiss();
                if (response.message==="success") {
                  this.appserv.presentToast("Toutes les transactions ont été imputées avec succès.","success");
                }
                //console.log('validation imputation from api',response);
            },
            error:(err)=>{
               load.dismiss();
              console.log('error on validation imputation from api',err);
            }
          });
        }}
      ]
    });
    alert.present();
  }

  async imputetransactions(moneyId: number) {

    const allUnimputed = this.listselecteddata.every(
      item => item.imputed_by === null && item.imputed_to === null
    );

    if (!allUnimputed) {
      this.appserv.presentToast("❌ Certaines transactions sont déjà imputées.","warning");
      return;
    }

    const sameMoneyId = this.listselecteddata.every(
      item => item.money_id === this.listselecteddata[0].money_id
    );

    if (!sameMoneyId) {
    this.appserv.presentToast("⚠️ Les transactions sélectionnées ont des monnaies différentes.","warning");
      return;
    }

     const allInPending = this.listselecteddata.some(
      item => item.transaction_status === 'pending'
    );

    if (allInPending) {
      this.appserv.presentToast("⚠️ Seules les transactions en attente peuvent être imputées!","warning");
      return;
    }

    const modal = await this.appserv.modalCtrl.create({
      component: SelectCashAccountSheetComponent,
      componentProps: {
        accounts: this.listtubs,
        moneyIdSent: this.listselecteddata[0].money_id
      },
      breakpoints: [0.25, 0.50, 0.75, 0.90],
      initialBreakpoint: 0.50,
      cssClass: 'modal-border-radius-20'
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data) {
      //console.log('✅ Caisse sélectionnée :', data);
      this.validateimputations(data);
    }
}


  async getlistTubs(){
    const allSameMoneyId = this.listselecteddata.every(
      item => item.money_id === this.listselecteddata[0].money_id
    );

    if (allSameMoneyId) {
        const moneyId = this.listselecteddata[0].money_id;
        const load = await this.appserv.loadctrl.create({
        message: 'Chargement des caisses...',
        mode: 'ios',
        translucent: true,
        spinner: 'circular'
      });
      load.present();
      this.appserv.myTubs(this.appserv.getactualuser().id).subscribe(
        data=>{
          load.dismiss();
          //console.log('listtubs',data);
          this.listtubs=data;
          this.imputetransactions(moneyId);
        },
        error=>{
          load.dismiss();
          this.appserv.presentToast('Erreur survenue lors de la recupération de la liste des caisses.','danger');
        });
    } else {
      this.appserv.presentToast('Vous devez sélectionner les opérations avec une monnaie unique pour procéder à l\'imputation svp!.','warning');
    } 
  }

  async excelexport(format:string){
    if(this.listselecteddata.length>0){
      if (this.isAllDataSelected) {
        if (this.isAllDataSelected) {
            let members = this.selectedmembers.map(m => m.id);
            let cashiers = this.transactionscashiers.map(c => c.id);

            let objectsent = {
              user_id: this.appserv.getactualuser().id,
              from: this.from,
              to: this.to,
              members: members,
              cashiers: cashiers,
              format: format,
            };

            const load = await this.appserv.loadctrl.create({
              message: 'Exportation Excel en cours...',
              mode: 'ios',
              translucent: true,
              spinner: 'circular'
            });
            load.present();

            this.transactionserv.transactionsHistoriesExcelExport(objectsent).subscribe({
              next: (response: Blob) => {
                load.dismiss();
                const mimeType = format === 'xlsx'
                  ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  : 'text/csv;charset=utf-8;';

                const blob = new Blob([response], { type: mimeType });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `transactions.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              },
              error: () => {
                load.dismiss();
                this.appserv.presentToast(`Erreur lors de l'exportation des transactions!`, 'danger');
              }
            });
          }
      }else{
        let services =[['N°','ID','Date','Faite par','Membre','Type','Montant','Monnaie','Statut']]; 
        let index=0;
        this.listselecteddata.forEach(transaction => {
          index=index+1;
          const obj=[index,transaction.uuid,transaction.done_at,transaction.done_by_name,transaction.member_fullname,transaction.type,transaction.amount,transaction.abreviation,transaction.transaction_status];
            services.push(obj);
        });
  
        this.appserv.exportInToExcel(services,'csv','transactions');  
      }
    }else{
      this.appserv.presentToast(`Aucune transaction sélectionnée!`,'warning');
    }
  }

  async exportpdf(){
    if(this.listselecteddata.length>0){
    
        let members = this.selectedmembers.map(member => member.id);
        let cashiers = this.transactionscashiers.map(cashier => cashier.id);

        let objectsent = {
          user_id: this.appserv.getactualuser().id,
          from: this.from,
          to: this.to,
          members: members,
          cashiers: cashiers
        };

        const load = await this.appserv.loadctrl.create({
          message: 'Génération du PDF en cours...',
          mode: 'ios',
          translucent: true,
          spinner: 'circular'
        });
        load.present();

        this.transactionserv.transactionsHistoriesPdfExport(objectsent).subscribe({
          next: (response: Blob) => {
            load.dismiss();

            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transactions.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: () => {
            load.dismiss();
            this.appserv.presentToast('Erreur lors de l’exportation en PDF!', 'danger');
          }
        });  
    }else{
      this.appserv.presentToast(`Aucune transaction sélectionnée!`,'warning');
  }
}

  toggleSubtotals() {
    this.showSubtotalsToggle = !this.showSubtotalsToggle;
  }
  toggleSelection(transaction:any,ev:Event){
    if (transaction.selected) {
      this.listselecteddata.push(transaction);
      if (this.transactionslist.length==this.listselecteddata.length) {
        this.allSelected=true;
      }else{
        this.allSelected=false;
      }
    }else{
      this.listselecteddata = this.listselecteddata.filter(item => item !== transaction);
      if (this.transactionslist.length==this.listselecteddata.length) {
        this.allSelected=true;
      }else{
        this.allSelected=false;
      }
    }
  }

   selectallData(){
    this.isAllDataSelected=true;
    this.allSelected=true;
    this.toggleAllSelection();
  }

  toggleAllSelection() {
    this.transactionslist.forEach(invoice => {
      invoice.selected = this.allSelected;
      this.listselecteddata.push(invoice);
    });
    if (!this.allSelected) {
      this.closeselectionmode();
    }
  }

   closeselectionmode(){
    this.transactionslist.forEach(invoice => {
      invoice.selected =false;
    });
    this.allSelected=false;
    this.listselecteddata=[];
    this.isAllDataSelected=false;
    setTimeout(() => {
      this.movecursorin(this.defaultinput);
    }, 100);  
  }

   movecursorin(input:IonInput){
    setTimeout(()=>{
      input.setFocus();
    },200);
  }

  onViewChange(criteria:string){
    this.defaultview=criteria;
  }
   onPageChange(newPage:number){
    this.paginationOptions.current_page=newPage;
    this.alltransactions();
  }

  handletransactionchange($event,transaction:any){
    if ($event.detail.checked) {
      transaction.selected=true;
      this.listselecteddata.push(transaction);
    }else{
      transaction.selected=false;
      this.listselecteddata=this.listselecteddata.filter(t=>t!==transaction);
    }
    //console.log(this.listselecteddata.length,this.transactionslist.length);
    if (this.listselecteddata.length===this.transactionslist.length) {
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
      this.listselecteddata=this.transactionslist;
    }else{
      this.listselecteddata=[];
      this.transactionslist.map((transaction)=>{
        transaction.selected=false;
      });
    }
    // console.log($event); 
  }

  async handleselectedtransactionschanged(criteria:any){
    if (this.listselecteddata.length>0) {
      let canapply=false;
      this.listselecteddata.map((transaction)=>{
        if (transaction.transaction_status==='pending') {
          canapply=true;
        }else{
          canapply=false;
        }
      });

      if (canapply) {
        const load = await this.appserv.loadctrl.create({
          message:criteria==='cancelled'?'Annulation en cours...':'Validation en cours...',
          mode:'ios',
          translucent:true,
          spinner:'circular'
        });
        load.present();
        this.transactionserv.transactionstatuschange({user:this.appserv.actualUser,data:this.listselecteddata,statusSent:criteria}).subscribe(
          response=>{
            load.dismiss();
            switch (response.message) {
              case "success":
                this.appserv.presentToast(criteria==='cancelled'?`Annulation des transactions terminée avec succès.`:`Validation des transactions terminée avec succès.`,'success');
                this.alltransactions();
                break;
              case "error":
                if (response.error==="unknown user") {
                  this.appserv.presentToast(`Utilisateur inconnu. Nous sommes désolé!`,'warning');
                } 
                
                else if (response.error==="unauthorized user") {
                  this.appserv.presentToast(`Utilisateur non autorisé à faire cette action!. Nous sommes désolé!`,'warning');
                } 
                
                else if (response.error==="unauthorized user") {
                  this.appserv.presentToast(`Utilisateur non autorisé à faire cette action!. Nous sommes désolé!`,'warning');
                }

                else{
                  this.appserv.presentToast(`Action non terminée. Veuillez réessayer plus tard!. Nous sommes désolé!`,'warning');
                }
                break;
              default:
                break;
            }
            //console.log(response);
            
          },error=>{
            load.dismiss();
            this.appserv.presentToast(criteria==='cancelled'?`Erreur lors de l'annulation des transactions.`:`Erreur lors de la validation des transactions.`,'danger');
          });
       
      }else{
        this.appserv.presentToast("Veuillez sélectionner seulement les opérations en attente s'il vous plaît!","warning");
      }
    }else{
      this.appserv.presentToast("Veuillez sélectionner au moins une transaction s'il vous plaît!","warning");
    }
  }

  handletypechanged($event){
    switch ($event.detail.value) {
      case 'all':
        this.transactionslist=this.keptTransactionslist;
        break;
      case 'entry':
        this.transactionslist=this.keptTransactionslist.filter(t=>t.type===$event.detail.value);
      break;
      case 'withdraw':
        this.transactionslist=this.keptTransactionslist.filter(t=>t.type===$event.detail.value);
      break;
      case 'pending':
        this.transactionslist=this.keptTransactionslist.filter(t=>t.transaction_status===$event.detail.value);
      break;
      case 'validated':
        this.transactionslist=this.keptTransactionslist.filter(t=>t.transaction_status===$event.detail.value);
      break;
      case 'cancelled':
        this.transactionslist=this.keptTransactionslist.filter(t=>t.transaction_status===$event.detail.value);
      break;
      case 'imputed':
        this.transactionslist=this.keptTransactionslist.filter(t=>t.imputed_to>0);
      break; 
      case 'unimputed':
        this.transactionslist=this.keptTransactionslist.filter(t=>t.imputed_to===null);
      break;
      default:
        break;
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

  async agentsfilter(){
    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{criteria:"multiple"},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="selected") {
      if(data.length>0){
        this.transactionscashiers=data;
        this.alltransactions();
      }
      
    }
  } 
  
  async membersfilter(){
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
    this.listselecteddata=[];
    this.showprogress=true;
    this.loaded=true;
    let members=[];
    let cashiers=[];
    if (this.selectedmembers.length>0) {
      this.selectedmembers.forEach(member => {
        members.push(member.id);
      });
    }
    if (this.transactionscashiers.length>0) {
      this.transactionscashiers.forEach(cashier => {
        cashiers.push(cashier.id);
      });
    }
     let objectsent={user_id:this.appserv.getactualuser().id,from:this.from,to:this.to,per_page:this.paginationOptions.per_page?this.paginationOptions.per_page:20,page:this.paginationOptions.current_page?this.paginationOptions.current_page:1,members:members,cashiers:cashiers}
    this.transactionserv.transactionshistoriespaginated(objectsent).subscribe(
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
          this.transactionslist=response.data.data;
          this.keptTransactionslist=this.transactionslist;
          this.paginationOptions=response.data;
          this.subtotalsbymoney=response.totals_by_money;
          this.to=response.to;
          this.from=response.from;
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

  async menufence(fence:Fences){
    if (this.appserv.actualUser.user_type==="super_admin" && this.appserv.permissionFilter('clôtures', 'delete')) {
      const sheet = await this.appserv.actionsheetctrl.create({
        header:`${fence.user_name} (${fence.amount_due} ${this.defaultMoney.abreviation})`,
        translucent:true,
        mode:'ios',
        buttons:[
          {text:"Annuler",role:"cancel"},
          {text:"Détail",handler:()=>{
            this.detailfence(fence);
          }},
          {text:"Réceptionner",handler:()=>{
            this.vertsement(fence);
          }},
          {text:"Supprimer",handler:()=>{
            this.deletefence(fence);
          }}
        ]
        });
        sheet.present();
    }
  }

  async detailfence(fence: Fences){
    const modal = await this.appserv.modalCtrl.create({
      component:InfosfenceComponent,
      componentProps:{'fencesent':{fence:fence}},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='deleted'){
      this.fences=this.fences.filter(a=>a!=fence);
    }
  }

  async vertsement(fence: Fences){

    const modal =await  this.appserv.modalCtrl.create({
      component:VersementsComponent,
      componentProps:{'fencesent':{fence:fence}},
      cssClass:"modal-border-radius-20"
    });
    (await modal).present();
    await modal.onWillDismiss();
    this.ngOnInit();
  }

  async deletefence(fence: Fences){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression',
      subHeader:`${fence.user_name}`,
      message:'Voulez-vous vraiment supprimer cette clôture?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.showprogress=true;
          this.Fenceserv.delete(fence.id).subscribe(
            data=>{
              this.showprogress=false;
              if(data>0){
                this.appserv.presentToast(`Clôture supprimée avec succès`,'success');
                this.fences=this.fences.filter(a=>a!=fence);
              }else{
                this.appserv.presentToast(`Opération  echouée:`,'warning');
              }
            },
            error=>{
              this.showprogress=false;
              this.appserv.presentToast(`Suppression impossible`,'danger');
            }
          );
        },}
      ]
    });
    alert.present();
  }

  updateAccountTotal(){
    this.totalaccounts=0;
    this.labelChart=[];
    this.ChartData=[];
    if (this.accountsegment==='all') {
      this.showaccountentry=true;
      this.showaccountexp=true;
      if (this.accounts && this.accounts.length>0) {
        this.accounts.forEach(element => {
          this.totalaccounts=this.totalaccounts+(element.expenditures_amount+element.entries_amount);
          this.labelChart.push(element.account.name);
          this.ChartData.push(element.expenditures_amount+element.entries_amount);
        });
      }
    }
  
    if(this.accountsegment==='entries'){
      this.showaccountentry=true;
      this.showaccountexp=false;
      this.accounts.forEach(element => {
        this.totalaccounts=this.totalaccounts+element.entries_amount;
        this.ChartData.push(element.entries_amount);
      });
    }
    
    if(this.accountsegment==='withdraw'){
      this.showaccountentry=false;
      this.showaccountexp=true;
      this.accounts.forEach(element => {
        this.totalaccounts=this.totalaccounts+element.expenditures_amount;
        this.ChartData.push(element.expenditures_amount);
      });
    }
   
    this.filteraccounts();
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
      const object ={'from':this.from,'to':this.to,'user_id':this.appserv.getactualuser().id};
      if (this.appserv.isMyDeviceConnected()) {
        this.userServ.dashboard(object).subscribe(
          (data:any)=>{
            //console.log('dashboard data',data);
            this.showprogress=false;
            this.total_cash=data.total_cash;
            this.total_credits=data.total_credits;
            this.total_entries=data.total_entries;
            this.total_expenditures=data.total_expenditures;
            this.total_fences=data.total_fences;
            this.total_debts=data.total_debts;
            this.cash=data.cash;
            this.credits=data.credits;
            this.expenditures=data.expenditures;
            this.entries=data.entries;
            this.fences=data.fences;
            this.debts=data.debts;
            this.accounts=data.accounts;
            this.sold_fund=(this.total_cash+this.total_entries)-(this.total_expenditures);
            this.defaultMoney=data.default_money;
            this.totalaccounts=0;
            this.from=data.from;
            this.to=data.to;
            this.totalGeneralEntries=(this.total_cash+this.total_entries);
            this.totalGeneralExpenditures=(this.total_credits+this.total_expenditures);
              //fidelity variables
            this.totalEntriesCautions=data.totalEntriesCautions;
            this.totalSellByCautions=data.totalSellByCautions;

            this.totalEntriesBonus=data.totalEntriesBonus;
            this.totalSellByBonus=data.totalSellByBonus;

            this.totalEntriesPoints=data.totalEntriesPoints;
            this.totalSellBypoints=data.totalSellBypoints;

            this.totalfidelity=this.totalEntriesCautions+this.totalSellByCautions+this.totalEntriesBonus+this.totalSellByBonus+ this.totalEntriesPoints+this.totalSellBypoints;
            
            this.nbrmembersaccountstovalidate=data.nbrmembersaccountstovalidate;
            this.nbrfirstentries=data.nbrfirstentries;
            
            // this.barchart();
            this.updateAccountTotal();
            //this.SoldBarChart();
            // this.MobileSoldBarChart();
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
        this.from=object.from;
        this.to=object.to;
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
      this.updateAccountTotal();
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
    
      let {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        if(!data){
            data={from:this.appserv.defaultdate(),to:this.appserv.defaultdate()}
        }
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
    this.updateAccountTotal();
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
