import { ServicepricespickerComponent } from './../servicepricespicker/servicepricespicker.component';
import { VatenterComponent } from './../vatenter/vatenter.component';
import { TablepickerComponent } from './../../tables/tablepicker/tablepicker.component';
import { TipquantityComponent } from './../tipquantity/tipquantity.component';
import { Component, OnInit, Input } from '@angular/core';
import { Articles } from '../../interfaces/articles';
import { AppservicesService } from '../../services/appservices.service';
import { DetailsInvoice } from 'src/app/interfaces/detailsinvoice';
import { Invoice } from '../../interfaces/invoices';
import { CustomerpickersComponent } from 'src/app/articles/customerpickers/customerpickers.component';
import { Customers } from 'src/app/interfaces/customers';
import { PaymentmodeComponent } from '../paymentmode/paymentmode.component';
import { Servant } from 'src/app/interfaces/servants';
import { ServantpickerComponent } from 'src/app/servants/servantpicker/servantpicker.component';
import { Tables } from 'src/app/interfaces/tables';
import { ReductionenterComponent } from '../reductionenter/reductionenter.component';
import { InvoiceService } from 'src/app/services/invoice.service';
import { AchieveinvoiceComponent } from '../achieveinvoice/achieveinvoice.component';
import { PicktypesinvoiceComponent } from '../picktypesinvoice/picktypesinvoice.component';

@Component({
  selector: 'app-cartpreview',
  templateUrl: './cartpreview.component.html',
  styleUrls: ['./cartpreview.component.scss'],
})
export class CartpreviewComponent implements OnInit {
@Input() articles : Articles[]=[];
invoice: any={};
details:DetailsInvoice[]=[];
totalgeneral=0;
vat_amount=0;
reduction=0;
isModalOpen=false;
actualcustomer:Customers={};
actualservant: Servant={};
actualtable: Tables={};
customerclass='';

constructor(public appserv: AppservicesService, private invoiceserv:InvoiceService) { }

  ngOnInit() {
    this.syncingdata();
    this.invoice.type_facture='cash';
    this.invoice.payment_mode='caisse';
  }

  async vatenter(){

    const modal = await this.appserv.modalCtrl.create({
      component:VatenterComponent,
      initialBreakpoint:0.30,
      breakpoints:[0.25,0.30,0.50,0.75,1]
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='changed'){
      this.invoice.vat_percent=data;
      this.vat_amount=(this.totalgeneral*data)/100;
      this.invoice.vat_amount=this.vat_amount;
    }
  }

  async reductionenter(){

    const modal = await this.appserv.modalCtrl.create({
      component:ReductionenterComponent,
      initialBreakpoint:0.30,
      breakpoints:[0.25,0.30,0.50,0.75,1]
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='changed'){
      this.reduction=data;
    }
  }

  async achiveinvoice() {
    const modal = await this.appserv.modalCtrl.create(
      {
        component:AchieveinvoiceComponent,
        componentProps:{'invoicesent':this.invoice}
      });
    (await modal).present();
      const {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        if(data.amount_paid<this.invoice.total && data.after_validation!=='pause' && Object.values(this.actualcustomer).length<1){
          this.appserv.presentToast(`Facture à crédit. Veuillez sélectionner un membre`,'warning');
          this.customerclass='dashed-danger-border-radius';
        }else{
          this.invoice.amount_paid=data.amount_paid;
          if(this.totalgeneral<data.amount_paid){
            this.invoice.back=data.amount_paid-this.totalgeneral;
          }

          if(data.after_validation=='pause'){
             //save to offlines paused
            this.appserv.presentToast(`Facture mise en attente`,'primary');
            this.appserv.modalCtrl.dismiss(this.invoice,'saved');

          }else{
            this.validateinvoice();
          }
        }
      }
  }

  async typechange() {

    const modal = await this.appserv.modalCtrl.create(
      {
        component:PicktypesinvoiceComponent,
        componentProps:{'invoicesent':this.invoice}
      });
    (await modal).present();
      const {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        if(this.totalgeneral<data.amount_paid){
          this.invoice.back=data.amount_paid-this.totalgeneral;
        }
      }
  }

  syncingdata(){
    this.articles.forEach(article => {
        const object = {
          service_name:article.name,
          service_id: article.id,
          invoice_id: 0,
          quantity: 1,
          type_service: article.type,
          qty_article:article.available_qte,
          price: article.price,
          money_id: article.money_id,
          money_abreviation:article.abreviation,
          uom_name: article.uom_name,
          uom_symbol: article.uom_symbol,
          total: article.price
        };
        this.details.push(object);
    });

    this.totalcalculate();
  }

  totalcalculate(){
    this.totalgeneral=0;
    this.details.forEach((detail:any) => {
      this.totalgeneral=this.totalgeneral+(detail.price*detail.quantity);
    });
    this.invoice.total=this.totalgeneral;
  }

  quantitychange(detail: any,criteria: string){
    if(criteria=='remove'){
      detail.quantity=detail.quantity-1;
      detail.total=detail.quantity*detail.price;
      if(detail.quantity==0){
        this.removefromlist(detail);
      }
    }else{
      if(detail.type_service==1){
        if(detail.qty_article>=detail.quantity+1){
          detail.quantity=detail.quantity+1;
          detail.total=detail.quantity*detail.price;
        }
        else{
          this.appserv.presentToast('Quantité insuffisante en stock','warning');
        }
      }else{
        detail.quantity=detail.quantity+1;
        detail.total=detail.quantity*detail.price;
      }
    }
    this.totalcalculate();
  }

  async tipquantity(detail: any){

    const modal = await this.appserv.modalCtrl.create({
      component:TipquantityComponent,
      componentProps:{'detailsent':detail},
      initialBreakpoint:0.30,
      breakpoints:[0.25,0.30,0.50,0.75,1]
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='edited'){
      if(detail.type_service==2){
        detail.quantity=data;
        detail.total=data*detail.price;
        this.totalcalculate();
      }else if(detail.type_service==1){
        if(data<=detail.qty_article){
          detail.quantity=data;
          detail.total=data*detail.price;
          this.totalcalculate();
        }
        else{
          detail.quantity=detail.qty_article;
          this.appserv.presentToast('Quantité supérieure à celle en stock','warning');
        }
      }else{

      }

    }
  }

  removefromlist(detail:any){
    this.details=this.details.filter(d=>d!=detail);
    this.totalcalculate();
  }

  async pickcustomer(){
    const modal = await this.appserv.modalCtrl.create(
      {
        component:CustomerpickersComponent
      });
    (await modal).present();
      const {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        this.actualcustomer=data;
        this.invoice.customer_id=data.id;
        this.customerclass='';
      }
  }

  async pickservant(){

    const modal = await this.appserv.modalCtrl.create(
      {
        component:ServantpickerComponent
      });
    (await modal).present();
      const {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        this.actualservant=data;
        this.invoice.servant_id=data.id;
      }
  }

  async tablepicker(){

    const modal = await this.appserv.modalCtrl.create(
      {
        component:TablepickerComponent
      });
    (await modal).present();
      const {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        this.actualtable=data;
        this.invoice.table_id=data.id;
      }
  }

  async servicepricespicker(article: any){

    const modal = await this.appserv.modalCtrl.create(
      {
        component:ServicepricespickerComponent,
        componentProps:{'serviceidsent':article.service_id}
      });
    (await modal).present();
      const {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        article.price=data;
        article.total=article.quantity*article.price;
      }
  }

  async validateinvoice(){
    if(this.details.length>0){
     const alert = await this.appserv.loadctrl.create({
        message:'Facturation en cours...',
        mode:'ios',
        spinner:'circles'
      });
      alert.present();
      this.invoice.details=this.details;
      this.invoice.edited_by_id=this.appserv.getactualuser().id;
      this.invoice.enterprise_id=this.appserv.getactualuser().enterprise_id;
      this.invoice.discount=this.reduction;

      this.invoiceserv.newinvoice(this.invoice).subscribe(
        data=>{
          alert.dismiss();
          this.appserv.presentToast(`Facture ${data.invoice.type_facture} sauvegardée avec succès`,'success');

          if(this.invoice.type_facture=="cash" || this.invoice.type_facture=="credit"){
            if(this.invoice.after_validation=='sale-print'){
              //printing
              this.appserv.modalCtrl.dismiss(data.details,'created');
            }else if(this.invoice.after_validation=='sale-no-print'){
              //close
              this.appserv.modalCtrl.dismiss(data.details,'created');
            }else if(this.invoice.after_validation=='sale-share'){
              //sharing invoice
              // this.appserv.sharedata();
              this.appserv.modalCtrl.dismiss(data.details,'created');
            }
            else{

            }

          }else{
            this.appserv.modalCtrl.dismiss(data.details,'saved');
          }

        },
        error=>{
          alert.dismiss();
          //console.log(error);
          this.appserv.presentToast(`Impossible d'enregistrer la facture. Veuillez vérifier votre connexion`,'danger');
        });
    }else{
      this.appserv.presentToast(`Liste des details vide`,'warning');
    }
  }
}
