import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { DebtsService } from '../services/debts.service';
import { TipquantityComponent } from '../tab2/tipquantity/tipquantity.component';
import { InfosdebtComponent } from './infosdebt/infosdebt.component';
import { PosPrintingOptions } from '../interfaces/posprintingoptions';
import { PaymentsService } from '../services/payments.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.page.html',
  styleUrls: ['./debts.page.scss'],
})
export class DebtsPage implements OnInit {
  @ViewChild('defaultinput') defaultinput! : IonInput;
 @Input() ismodal:boolean;
 
 @ViewChild('payment_content') paymentContent! : ElementRef; 
showcheckbox=false;
showprogress=false;
listdebts:any[]=[];
keyword:any;
posprintoptions:PosPrintingOptions=this.appserv.getDefaultPrinterConfig();
debtSent?:any={};
actualPayment:any={};

  constructor(public appserv: AppservicesService, private debtserv: DebtsService, private paymentServ: PaymentsService) { }

  ngOnInit() {
    this.getlisdebts();
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }
  
  getlisdebts(){
    if (this.appserv.isMyDeviceConnected()) {
      this.showprogress=true;
      this.debtserv.getlisdebts(this.appserv.getactualEse().id).subscribe(
        data=>{
          this.showprogress=false;
          this.listdebts=data;
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast("Impossible de récupérer les dettes","warning");
        });
    } else {
      this.listdebts=this.debtserv.getofflineDebts();
      console.log(this.listdebts);
    }
   
  }

  async menudebt(debt:any){
    let menubuttons=[
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
    ]; 

    menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('factures', 'edit'), {
      text: 'Payer la dette',
      handler: () => {
        this.paymentsdebt(debt);
      }
    });

    const menu = await this.appserv.actionsheetctrl.create(
      {
        header: `${debt.debt.invoiceUuid?debt.debt.invoiceUuid:debt.debt.customerName}`,
        cssClass: 'myactionsheet',
        translucent: true,
        mode: 'ios',
        buttons:menubuttons
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

  invoicelookup($event){
    if ($event.keyCode===13) {
      //looking for invoice for debt
      this.debtserv.searchingbyidoruuid({keyword:this.keyword,enterprise_id:this.appserv.actualEse.id}).subscribe(
        response=>{
          this.listdebts=response;
          console.log(response);
        },
        error=>{
          this.appserv.presentToast("Erreur survenue sur le serveur.","warning");
        });
    } 
  }

  async paymentsdebt(debt:any){
    //console.log('debt sent',debt);
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
  
      if(role=='edited' && data.amount && data.amount>0){
        if(data.amount>debt.debt.sold){
          this.appserv.presentToast(`Montant payé supérieur au solde de la dette`,'warning');
        }else{
          if (this.appserv.isMyDeviceConnected()) {
                //send payment to the API
          const object ={done_by_id:this.appserv.getactualuser().id,debt_id:debt.debt.id,amount_payed:data.amount,uuid:'',sync_status:'',done_at:data.date_operation};
          this.showprogress=true;
          //console.log('debt before sent',debt);
          this.debtserv.paydebt(object).subscribe(
            (datareturned:any)=>{
              //console.log(datareturned);
              this.showprogress=false;
              this.appserv.presentToast(`Paiement facture de ${data.amount} ${debt.debt.abreviation} effectué avec succès`,'success');
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
                amount_payed: data.amount,
                uuid:this.appserv.getUUID('P'),
                sync_status: 0,
                created_at: this.appserv.today,
                updated_at: this.appserv.today,
                debtUuid:debt.debt.uuid,
                done_at:data.date_operation
              };
              this.actualPayment=payment;
              this.debtSent=debt.debt;
              this.printPayment(debt,payment);
            },
            error=>{
              this.showprogress=false;
              this.appserv.presentToast("Une erreur est survenue lors du paiement de la dette","warning");
            });
          }else{
              /**
               * Save payment Offline
               */
              let payment={
                user_name:this.appserv.getactualuser().user_name,
                id: 0,
                done_by_id: this.appserv.getactualuser().id,
                debt_id: debt.debt.id,
                amount_payed: data.amount,
                uuid:this.appserv.getUUID('P'),
                sync_status: 0,
                created_at: this.appserv.today,
                updated_at: this.appserv.today,
                done_at:data.date_operation,
                debtUuid:debt.debt.uuid,
                abreviation:debt.debt.abreviation,
                customerName:debt.debt.customerName
              };
              debt.payments.push(payment);
              debt.debt.sold=debt.debt.sold-data.amount;
              if(debt.debt.sold<=0){
                debt.debt.status='1';
              }
              this.actualPayment=payment;
              this.debtSent=debt.debt;
              this.appserv.presentToast(`Paiement facture de ${data.amount} ${debt.debt.abreviation} effectué avec succès`,'success');
              this.paymentServ.addToSyncingOffline(payment);
              this.updateOfflineDebts(debt);
              this.printPayment(debt,payment);
          }
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
}
