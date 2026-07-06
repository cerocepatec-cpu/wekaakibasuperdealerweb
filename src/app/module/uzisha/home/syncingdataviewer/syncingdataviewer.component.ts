import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { CustomersService } from 'src/app/services/customers.service';
import { DebtsService } from 'src/app/services/debts.service';
import { ExpendituresService } from 'src/app/services/expenditures.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { OthersentriesService } from 'src/app/services/othersentries.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-syncingdataviewer',
  templateUrl: './syncingdataviewer.component.html',
  styleUrls: ['./syncingdataviewer.component.scss'],
})
export class SyncingdataviewerComponent implements OnInit {
@Input() criteria: string;
listentries: any;
showentrycheckbox=false;
showcustomercheckbox=false;
showinvoicecheckbox=false;
showdebtcheckbox=false;
keyword:any;
dataLength=0;
listcustomers: any;
listinvoices:any;
liststockstories: any;
listdebts: any;
payments: any;
  constructor(public appserv: AppservicesService, private entryServ: OthersentriesService,private expenditureServ:ExpendituresService, 
    private customerServ: CustomersService, private invoiceServ: InvoiceService, private stockServ: StockService, private debtServ: DebtsService, private paymentServ: PaymentsService) { }

  ngOnInit() {
    this.gettingData();
  }

  async delete(){
    const alert = await this.appserv.alertctrl.create({
      header:"Suppression",
      message:"Attention, cette action est irreversible! Voulez-vous vraiment supprimer cette partie de synchronisation?",
      translucent:true,
      mode:'ios',
      buttons:[
        {text:"Annuler",role:'cancel'},
        {
          text:"Oui",handler:()=> {
            if(this.criteria==='entries'){
              this.entryServ.resetToSyncingOffline();
              this.listentries=[];
                this.appserv.modalCtrl.dismiss(null,'deleted');
            }
            
            if(this.criteria==='expenditures'){
              this.expenditureServ.resetToSyncingOffline();
              this.listentries=[];
                this.appserv.modalCtrl.dismiss(null,'deleted');
            } 
            
            if(this.criteria==='customers'){
              this.customerServ.resetToSyncingOffline();
              this.listcustomers=[];
              this.appserv.modalCtrl.dismiss(null,'deleted');
            }
            
            if(this.criteria==='invoices'){
              this.invoiceServ.resetToSyncingOffline();
              this.listcustomers=[];
              this.appserv.modalCtrl.dismiss(null,'deleted');
            }
            
            if(this.criteria==='stock'){
              this.stockServ.resetToSyncingOffline();
              this.liststockstories=[];
              this.appserv.modalCtrl.dismiss(null,'deleted');
            }
            
            if(this.criteria==='debts'){
              this.debtServ.resetToSyncingOffline();
              this.listdebts=[];
              this.appserv.modalCtrl.dismiss(null,'deleted');
            }
            
            if(this.criteria==='payments'){
              this.paymentServ.resetToSyncingOffline();
              this.payments=[];
              this.appserv.modalCtrl.dismiss(null,'deleted');
            }
          },
        }
      ]
    });
    alert.present();
  }

  gettingData(){
    if(this.criteria==='entries'){
      this.listentries=this.entryServ.getSyncingOfflineData();
      this.dataLength=this.entryServ.getSyncingOfflineData().length;
    } 
    
    if(this.criteria==='expenditures'){
      this.listentries=this.expenditureServ.getSyncingOfflineData();
      this.dataLength=this.expenditureServ.getSyncingOfflineData().length;
    }
    
    if(this.criteria==='customers'){
      this.listcustomers=this.customerServ.getSyncingOfflineData();
      this.dataLength=this.customerServ.getSyncingOfflineData().length;
    }
    
    if(this.criteria==='invoices'){
      this.listinvoices=this.invoiceServ.getSyncingOfflineData();
      this.dataLength=this.invoiceServ.getSyncingOfflineData().length;
    } 
    
    if(this.criteria==='stock'){
      this.liststockstories=this.stockServ.getSyncingOfflineData();
      this.dataLength=this.stockServ.getSyncingOfflineData().length;
    } 
    
    if(this.criteria==='debts'){
      this.listdebts=this.debtServ.getSyncingOfflineData();
      this.dataLength=this.debtServ.getSyncingOfflineData().length;
      console.log('debts before syncing',this.listdebts);
    }
    
    if(this.criteria==='payments'){
      this.payments=this.paymentServ.getSyncingOfflineData();
      this.dataLength=this.paymentServ.getSyncingOfflineData().length;
      console.log('payments before syncing',this.payments);
    }
  }

}
