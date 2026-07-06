import { Component, OnInit,Input, ElementRef, ViewChild } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { Customers } from 'src/app/interfaces/customers';
import { EditcustomerComponent } from '../editcustomer/editcustomer.component';
import { CustomersService } from 'src/app/services/customers.service';
import { Invoice } from '../../interfaces/invoices';
import { InvoiceService } from 'src/app/services/invoice.service';
import { log } from 'console';
import { InfosdebtComponent } from 'src/app/debts/infosdebt/infosdebt.component';
import { TipquantityComponent } from 'src/app/tab2/tipquantity/tipquantity.component';
import { DebtsService } from 'src/app/services/debts.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { PosPrintingOptions } from 'src/app/interfaces/posprintingoptions';

@Component({
  selector: 'app-infoscustomer',
  templateUrl: './infoscustomer.component.html',
  styleUrls: ['./infoscustomer.component.scss'],
})
export class InfoscustomerComponent implements OnInit {
  @Input() customersent : Customers={}
  listcomptescourant:any[]=[];
  listdebts:any[]=[];
  showprogress=false;
  totaldebts=0;
  alreadypayed=0;
  generalsold=0;
  @ViewChild('payment_content') paymentContent! : ElementRef; 
  debtSent?:any={};
  actualPayment:any={};
  posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();
  constructor(private paymentServ:PaymentsService, private debtserv:DebtsService, public appserv: AppservicesService, public customerserv: CustomersService, private invoiceserv: InvoiceService) { }

  ngOnInit() {
    this.getinvoiceslist(this.customersent);
  }

  refreshlist(){
    this.getinvoiceslist(this.customersent);
  }
  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }

  async calculatetotaldebts(){
    this.totaldebts=0;
    this.listdebts.forEach((debt: any) => {
        this.totaldebts +=debt.debt.sold;
    });

    this.generalsold=this.totaldebts-this.alreadypayed;
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

  async paymentsdebt(debt:any){
    if(debt.debt.sold==0){
      this.appserv.presentToast(`La facture est déjà payée.Merci pour votre bonne foi.`,'secondary');
    }else{
      const modal = await this.appserv.modalCtrl.create({
        component:TipquantityComponent,
        initialBreakpoint:0.25,
        breakpoints:[0, 0.25, 0.5, 0.75,1],
        cssClass:'modal-border-radius-20',
        componentProps:{'title':`Entrer le montant à payer`,'numbersent':debt.debt.sold}
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

  async detaildebt(debt:any){

    const modal = await this.appserv.modalCtrl.create({
     component:InfosdebtComponent,
     componentProps:{'debtsent':debt},
     cssClass:'modal-border-radius-20',
   
   });

   modal.present();
 }

  async gotoedit(){
    const modal = await this.appserv.modalCtrl.create({
      component:EditcustomerComponent,
      componentProps:{'customersent':this.customersent}
    });
    modal.present();
  }

  
    async deletecustomer(customer: Customers){
      const alert = await this.appserv.alertctrl.create({
        header:'Suppression',
        subHeader:`${customer.customerName}`,
        mode:'ios',
        translucent:true,
        message:`Voulez-vous vraiment supprimer ce client? `,
        buttons:[
          {text:'Non',role:'cancel'},
          {text:'Oui',handler: async ()=> {
            this.showprogress=true;
            this.customerserv.deleteonecustomer(customer).subscribe(
              data=>{
                this.showprogress=false;
                if(data>0){
                  this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
                  this.appserv.modalCtrl.dismiss(this.customersent,'deleted');
                }else{
                  this.appserv.presentToast(`Opération echouée:`,'warning');
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

    async getinvoiceslist(customer: Customers){
      this.showprogress=true;
      this.invoiceserv.comptecourant({customer_id:customer.id}).subscribe(
        data=>{
          this.showprogress=false;
          this.listdebts=data;
          this.calculatetotaldebts();
        },error=>{
          this.showprogress=false;
          this.appserv.presentToast(`Impossible de récupérer la situation du compte courant client`,'danger');
        }
      )
    }
}
