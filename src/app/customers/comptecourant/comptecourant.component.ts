import { Component, OnInit,Input, ViewChild, ElementRef } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { CustomersService } from '../../services/customers.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { Customers } from '../../interfaces/customers';
import { PosPrintingOptions } from 'src/app/interfaces/posprintingoptions';
import { InfosdebtComponent } from 'src/app/debts/infosdebt/infosdebt.component';
import { TipquantityComponent } from 'src/app/tab2/tipquantity/tipquantity.component';
import { DebtsService } from 'src/app/services/debts.service';
import { PaymentsService } from 'src/app/services/payments.service';
@Component({
  selector: 'app-comptecourant',
  templateUrl: './comptecourant.component.html',
  styleUrls: ['./comptecourant.component.scss'],
})
export class ComptecourantComponent implements OnInit {
  @ViewChild('printer_content') printerContent! : ElementRef; 
  @ViewChild('payment_content') paymentContent! : ElementRef; 
  @Input() customersent: Customers={};
  listdebts:any[]=[];
  keptlistdebts:any[]=[];
  generalsold=0;
  totaldebts=0;
  totalGeneral=0;
  showprogress=false;
  alreadypayed=0;
  from:any;
  to:any;
  search:any;
  defaultmoney=this.appserv.getDefaultmoney();
  posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();
  debtSent?:any={};
  actualPayment:any={};

  constructor(private paymentServ:PaymentsService, private debtserv:DebtsService, public appserv: AppservicesService, public customerserv: CustomersService, public invoiceserv: InvoiceService) { }

  ngOnInit() {
    this.getinvoiceslist();
  }

  async getdatesfilter(){
      const period = await  this.appserv.getDatesForm();
      this.from=period.from;
      this.to=period.to;
      this.getinvoiceslist();
  }

  async filterByType(criteria: string){
    this.listdebts=this.listdebts.filter(i=>i.invoice.type_facture===criteria);
  }

  DeleteFilterByType(){
    this.listdebts=this.keptlistdebts;
  }
  
  async calculatetotaldebts(){
    this.totaldebts=0;
    this.listdebts.forEach((debt: any) => {
        this.totaldebts +=debt.debt.sold;
    });

    this.generalsold=this.totaldebts-this.alreadypayed;
  }

  async getinvoiceslist(){
    this.showprogress=true;
    this.invoiceserv.FilteredCompteCourantCustomer({customer_id:this.customersent.id,from:this.from,to:this.to}).subscribe(
      (data:any)=>{
        this.showprogress=false;
        this.listdebts=data.debts;
        this.keptlistdebts=data.debts;
        this.from=data.from;
        this.to=data.to;
        this.calculatetotaldebts();
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de récupérer la situation du compte courant client`,'danger');
      }
    )
  }

  async menudebt(debt:any){

    const menu = await this.appserv.actionsheetctrl.create(
      {
        header: `${debt.debt.invoiceUuid?debt.debt.invoiceUuid:debt.debt.customerName}`,
        cssClass: 'myactionsheet',
        translucent: true,
        mode: 'ios',
        buttons:[
          {
            text: 'Annuler',
            role:'cancel'
          },
          {
            text: 'Infos',
            handler: () => {
              this.detaildebt(debt);
            }
          },
          {
            text: 'Payer la dette',
            handler: () => {
              this.paymentsdebt(debt);
            }
          }
        ]
      }
    );

    menu.present();
  }

  async detaildebt(debt:any){

    const modal = await this.appserv.modalCtrl.create({
     component:InfosdebtComponent,
     componentProps:{'debtsent':debt},
     cssClass:'modal-border-radius-20',
   
   });

   modal.present();
 }
  async paymentsdebt(debt:any){
    if(debt.debt.sold==0){
      this.appserv.presentToast(`La facture est déjà payée.Merci pour votre bonne foi.`,'secondary');
    }else{
      const modal = await this.appserv.modalCtrl.create({
        component:TipquantityComponent,
        initialBreakpoint:0.25,
        breakpoints:[0, 0.25, 0.5, 0.75,1],
        cssClass:'modal-border-radius-20',
        componentProps:{'title':`Entrer le montant à payer`,'numbersent':debt.debt.sold,showdateinput:true}
      });
  
      modal.present();
  
      const {data,role} = await modal.onWillDismiss();
  
      if(role=='edited' && data && data>0){
        if(data>debt.debt.sold){
          this.appserv.presentToast(`Montant payé supérieur au solde de la dette`,'warning');
        }else{
           //send payment to the API
          const object ={done_by_id:this.appserv.getactualuser().id,debt_id:debt.debt.id,amount_payed:data,uuid:'',sync_status:''};
          this.showprogress=true;
          //console.log('debt before sent',debt);
          this.debtserv.paydebt(object).subscribe(
            (datareturned:any)=>{
              this.showprogress=false;
              this.appserv.presentToast(`Paiement facture de ${data} ${debt.debt.abreviation} effectué avec succès`,'success');
              debt.payments=datareturned.data.payments;
              debt.debt.sold=datareturned.data.debt.sold;
              if(debt.debt.sold<=0){
                debt.debt.status='1';
              }
              let payment={
                user_name:this.appserv.getactualuser().user_name,
                id: 0,
                done_by_id: this.appserv.getactualuser().id,
                debt_id: debt.debt.id,
                amount_payed: data,
                uuid:this.appserv.getUUID('P'),
                sync_status: 0,
                created_at: this.appserv.today,
                updated_at: this.appserv.today,
                debtUuid:debt.debt.uuid
              };
              this.actualPayment=payment;
              this.debtSent=debt.debt;
              this.printPayment(debt,payment);
              this.calculatetotaldebts();
            },
            error=>{
              this.showprogress=false;
              /**
               * Save payment Offline
               */
              let payment={
                user_name:this.appserv.getactualuser().user_name,
                id: 0,
                done_by_id: this.appserv.getactualuser().id,
                debt_id: debt.debt.id,
                amount_payed: data,
                uuid:this.appserv.getUUID('P'),
                sync_status: 0,
                created_at: this.appserv.today,
                updated_at: this.appserv.today,
                debtUuid:debt.debt.uuid
              };
              debt.payments.push(payment);
              debt.debt.sold=debt.debt.sold-data;
              if(debt.debt.sold<=0){
                debt.debt.status='1';
              }
              this.actualPayment=payment;
              this.debtSent=debt.debt;
              this.appserv.presentToast(`Paiement facture de ${data} ${debt.debt.abreviation} effectué avec succès`,'success');
              this.paymentServ.addToSyncingOffline(payment);
              this.updateOfflineDebts(debt);
              this.printPayment(debt,payment);
              this.calculatetotaldebts();
            }
          );
        }
      }
    }
   
  }

  updateOfflineDebts(debt:any){
    let list = this.debtserv.getofflineDebts();
    let filteredList=list.filter(d=>d.debt.uuid!=debt.debt.uuid);
    filteredList.unshift(debt);
    this.debtserv.setofflinedata(filteredList);
  }

  async printPayment(debt: any,payment: any){
    const alert = await this.appserv.alertctrl.create({
      header:`Impréssion`,
      subHeader:`Preuve de paiement`,
      mode:'ios',
      translucent:true,
      message:'Voulez-vous imprimer une preuve de paiement?',
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=> {
          this.printPaymentContent();
        },}
      ]
    });
    alert.present();
  }

  printPaymentContent(){
    var win = window.open('','_blank','popup=1');
    win.document.write(`<html><head><title>Payment Print</title><style>
    body {
      font-size: x-small;
      font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
    }
    table{
          table-layout: fixed;
          width: 100%;
          border-collapse: collapse;
          thead th:nth-child(1){
                  width: 50%;
                  text-align: left;
          } 
          thead th:nth-child(2){
                  width: 15%;
                  text-align: right;
          } 
          thead th:nth-child(3){
                  width: 15%;
                  text-align: right;
          } 
          thead th:nth-child(4){
                  width: 20%;
                  text-align: right;
          }
      }
      .header{
          border-style: none none dashed none;
          border-width: 1px;
      } 
      
      .suheader{
          border-style: none none dashed none;
          border-width: 1px;
      }
  
      table tbody{
          border-style: none none dashed none;  
          border-width: 1px;
      }
  
      tfoot{
          
      }
      tr.border-bottom-dashed{
        border-style:none none dashed none ;
        border-width: 1px;
        font-weight: 600;
    }
    
    .border-bottom-dashed{
        border-style:none none dashed none ;
        border-width: 1px;
        font-weight: 600;
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
    .font-size-20{
      font-size:20;
    }
    .font-size-30{
      font-size:30;
    }
    .font-bold-600{
      font-weight: 600;
    }
    
    .text-italic{
      font-style: italic;
    }
    .text-left{
      text-align:left;
    }
</style></head><body>`);
    win.document.write(this.paymentContent.nativeElement.innerHTML);
    win.document.write('</body></html>');
    win.print();
    win.close();
}
  printlist(){
    var win = window.open('','_blank','popup=1');
      win.document.write(`<html><head><title>Impression factures client</title><style>
       body {
         font-size: x-small;
         font-family:"Yu Gothic Medium","Yu Gothic",Verdana,"Berlin Sans FB","Gill Sans MT",system-ui;
       }
       table{
             width: 100%;
             border-collapse: collapse;
             thead th:nth-child(1){
                     width: 2%;
             }
             thead th:nth-child(2){
                     width: 26.8%;
             }
             thead th:nth-child(3){
                width: 14.2%;
             }
             thead th:nth-child(4){
                width: 14.2%;
             }
             thead th:nth-child(5){
                 width: 14.2%;
             }
             thead th:nth-child(6){
              width: 14.2%;
            }
            thead th:nth-child(7){
              width: 14.2%;
            }
         }
         .header{
             border-style: none none none none;
             border-width: 1px;
         }
  
         .suheader{
             border-style: none none none none;
             border-width: 1px;
         }
         thead{
           font-size:11!important;
         }
         table tbody{
             border-style: none none none none;
             border-width: 1px;
             font-size:11!important;
         }
  
         tfoot{
             font-size:11!important;
         }
         tr.border-bottom-dashed{
           border-style:none none none none ;
           border-width: 1px;
       }
  
       .border-bottom-dashed{
           border-style:none none none none ;
           border-width: 1px;
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
       .font-size-16{
         font-size: 16px !important;
       }
       .font-size-20{
        font-size: 20px !important;
      }
       .font-bold-600{
         font-weight: 600;
       }
       .text-italic{
         font-style: italic;
       }
       .text-left{
         text-align:left;
       }
   </style></head><body>`);
       win.document.write(this.printerContent.nativeElement.innerHTML);
       win.document.write('</body></html>');
       win.print();
       win.close();
  }
}
