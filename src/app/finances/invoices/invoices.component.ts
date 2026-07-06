import { Invoice } from './../../interfaces/invoices';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserpickerComponent } from 'src/app/agents/userpicker/userpicker.component';
import { CustomerpickersComponent } from 'src/app/articles/customerpickers/customerpickers.component';
import { Customers } from 'src/app/interfaces/customers';
import { Users } from 'src/app/interfaces/users';
import { AppservicesService } from 'src/app/services/appservices.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { DetailinvoiceComponent } from './detailinvoice/detailinvoice.component';
import { DuplicataposComponent } from 'src/app/module/uzisha/home/duplicatapos/duplicatapos.component';
import { Duplicataa4Component } from 'src/app/module/uzisha/home/duplicataa4/duplicataa4.component';
import { IonInput } from '@ionic/angular';
import { InvoicePrintComponent } from 'src/app/module/uzisha/home/invoice-print/invoice-print.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput: IonInput;
  @Input() ismodal:boolean;
  showcheckbox=false;
  showprogress=false;
  keptinvoices: Invoice[]=[];
  listselectedinvoices:Invoice[]=[];
  listinvoices:Invoice[]=[];
  totalgeneral=0;
  keyword:any;

  constructor(public appserv: AppservicesService, private invoiceserv: InvoiceService) { }

  ngOnInit() {
    const object = {user_id:this.appserv.getactualuser().id};
    this.getlist(object);
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }

  totalcalculate(){
    this.totalgeneral=0;
    this.listinvoices.forEach(invoice => {
        this.totalgeneral +=invoice.invoice.netToPay?invoice.invoice.netToPay:invoice.invoice.total;
    });
  }
  async menuinvoice(invoice: Invoice){

    if(this.showcheckbox){
      const ifexists = this.listselectedinvoices.indexOf(invoice);
      if(ifexists==-1){
        this.listselectedinvoices.push(invoice);
      }else{
        this.listselectedinvoices=this.listselectedinvoices.filter(r=>r!=invoice);
      }
    }else{
      let menubuttons = [
        {
          text: 'Annuler',
        role:'cancel'
        },
        {
          text: 'Infos',
          handler: () => {
            this.detailinvoice(invoice);
          }
        },
      ];
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('Facturation', 'can sell'), {
        text: 'Annuler Facture',
        handler: () => {
          this.cancelinvoice(invoice);
        }
      });
      // menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('Facturation', 'partager'), {
      //   text: 'Partager',
      //   handler: () => {
      //     this.shareinvoice(invoice);
      //   }
      // });
      menubuttons.push({
        text: 'Duplicata A4',
        handler: () => {
          this.printinvoice(invoice);
        }
      },
      {
        text: 'Duplicata POS',
        handler: () => {
          this.printDuplicataPOS(invoice);
        }  
      });
      const menu = await this.appserv.actionsheetctrl.create(
        {
          header: `${invoice.invoice.customer_name?invoice.invoice.customer_name:invoice.invoice.uuid}`,
          cssClass: 'myactionsheet',
          translucent: true,
          mode: 'ios',
          buttons: menubuttons
        }
      );

      (await menu).present();
    }
  }

  async printDuplicataPOS(invoice: Invoice){
    console.log(invoice);
    const modal = await this.appserv.modalCtrl.create({
      component:InvoicePrintComponent,
      componentProps:{'invoice':invoice,mode:'duplicata'},
      cssClass: 'modal-border-radius-20'
    });
    modal.present();
  }

  async cancelinvoice(invoice: Invoice){
    const alert = await this.appserv.alertctrl.create({
      header:`Suppression facture`,
      subHeader:invoice.invoice.uuid,
      message:`Voulez-vous vraiment supprimer cette facture?`,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=> {
          this.showprogress=true;
          this.invoiceserv.cancel(invoice).subscribe(
            (response:any)=>{
              this.showprogress=false;
              if (response===1) {
                this.listinvoices=this.listinvoices.filter(i=>i!==invoice);
                this.appserv.presentToast(`Annulation facture terminée avec succès`,'success');
                this.totalcalculate();
              }else{
                this.appserv.presentToast(`Opération échouée. Veuillez réessayer s'il vous plaît`,'warning');
              }
            },
            error=>{
              this.showprogress=false;
              this.appserv.presentToast(`Une erreur est survenue lors de l'opération d'annulation facture`,'danger');
            });
        },}
      ]
    });
    alert.present();
  }

  async printinvoice(invoice: Invoice){
    const modal = await this.appserv.modalCtrl.create({
      component:Duplicataa4Component,
      componentProps:{'invoice':invoice,'typeInvoice':'model1'},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async shareinvoice(invoice: Invoice){

  }

  

  async detailinvoice(invoice: Invoice){
    const modal = await this.appserv.modalCtrl.create({
      component:DetailinvoiceComponent,
      componentProps:{'invoicesent':invoice},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  getlist(object: any){
    if (this.appserv.isMyDeviceConnected()) {
      this.showprogress=true;
      this.invoiceserv.invoicesdoneby(object).subscribe(
        data=>{
          this.showprogress=false;
          this.listinvoices=data;
          this.keptinvoices=data;
          this.totalcalculate();
          this.invoiceserv.setofflinedata(data);
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast("Une erreur est survenue lors de la recuperatino des factures","warning");
        });
    } else {
      this.listinvoices=this.invoiceserv.getofflineInvoices();
    }
  }

  multipledelete(){}

  filterbytype(criteria: string){
    this.listinvoices=this.keptinvoices.filter(i=>i.invoice.type_facture===criteria);
    this.totalcalculate();
  }

  deletefilter(){
    this.listinvoices=this.keptinvoices;
    this.totalcalculate();
  }

  filterbyuser(user: Users){
    this.listinvoices=this.keptinvoices.filter(i=>i.invoice.edited_by_id===user.id);
    this.totalcalculate();
  }

  filterbycustomer(customer: Customers){
    this.listinvoices=this.keptinvoices.filter(i=>i.invoice.customer_id===customer.id);
    this.totalcalculate();
  }

  async userpicker(){
    const modal = await this.appserv.modalCtrl.create({
        component:UserpickerComponent,
        cssClass:'modal-border-radius-20'
      });
      modal.present();
      const {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        this.filterbyuser(data);
      }
  }

  async customerpicker(){
    const modal = await this.appserv.modalCtrl.create({
      component:CustomerpickersComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      this.filterbycustomer(data);
    }
  }

  anonymascustomer(){
    this.listinvoices=this.keptinvoices.filter(i=>i.invoice.customer_id===null);
    this.totalcalculate();
  }

  async periodfilter(){
    const modal = await this.appserv.periodicfilter();
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      const object = {user_id:this.appserv.getactualuser().id,from:data.from,to:data.to};
      this.getlist(object);
    }
  }
}
