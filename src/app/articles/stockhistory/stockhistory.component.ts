import { SelectanarticleComponent } from './../selectanarticle/selectanarticle.component';
import { Articles } from './../../interfaces/articles';
import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { CalendarpickerComponent } from '../calendarpicker/calendarpicker.component';
import { TypedocumentpickerComponent } from '../typedocumentpicker/typedocumentpicker.component';
import { DepositpickerComponent } from '../depositpicker/depositpicker.component';
import { ProviderpickerComponent } from '../providerpicker/providerpicker.component';
import { AttachmentsforallpickerComponent } from '../attachmentsforallpicker/attachmentsforallpicker.component';
import { StockHistory } from 'src/app/interfaces/stockhistory';
import { FormBuilder } from '@angular/forms';
import { AddrefdocumentComponent } from '../addrefdocument/addrefdocument.component';
import { ArticlesService } from 'src/app/services/articles.service';
import { StockService } from 'src/app/services/stock.service';
import { DepositsService } from 'src/app/services/deposits.service';

@Component({
  selector: 'app-stockhistory',
  templateUrl: './stockhistory.component.html',
  styleUrls: ['./stockhistory.component.scss'],
})
export class StockhistoryComponent implements OnInit {


  @Input() listarticles: any[]=[];
  listarticlesall: Articles[]=[];
  liststockstories: StockHistory[]=[];
  stockreturned: StockHistory[]=[];
  showcreatingprogress=false;
  showcheckbox=false;
  selectedarticles: Articles[]=[];
  actualdeposit: any;
  actualdocumenttype: any;
  actualcustomer: any;
  documentnumber="";
  mouvementmode=false;
  typemouvement=false;
  iscashmode=true;
  actualuser:any;

  constructor(private appserv: AppservicesService,private stockserv: StockService, private articleserv: ArticlesService,private depositServ: DepositsService, private formbuild : FormBuilder) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    this.getlistarticles();
    this.articlestostockhistory();
  }

  async articlestostockhistory(){
    this.listarticles.forEach(article => {
      const newobject ={
        name:article.service.name,
        description:article.service.description,
        uom_name:article.service.uom_name,
        uom_symbol:article.service.uom_symbol,
        service_id:article.service.id,
        type:'entry',
        user_id:1,
        type_approvement:'cash',
        showWithdraw:false,
        showbarcode:true,
        showpu:true,
        showtotal:true,
        showcalendar:true
      };

      this.liststockstories.push(newobject);
    });
  }

  async changealltypeapprovement(){
    if(this.typemouvement){
      this.liststockstories.forEach(stock => {
        stock.type_approvement='debt';
      });
    }else{
      this.liststockstories.forEach(stock => {
        stock.type_approvement='cash';
      });
    }
  }

  async selectitem(article: Articles){
    const ifexists=this.selectedarticles.indexOf(article);
    if(ifexists==-1){
      this.selectedarticles.push(article);
      article.selected=true;
    }else{
      this.selectedarticles=this.selectedarticles.filter(a=>a!=article);
      article.selected=false;
    }
  }

  async multipledelete(){
    this.selectedarticles.forEach(article => {
      this.deletefromlist(article);
    });
  }

  async deletefromlist(article: Articles){
    this.listarticles=this.listarticles.filter(a=>a!=article);
    article.selected=false;
    const ifexists=this.listarticlesall.indexOf(article);
    if(ifexists==-1){
      this.listarticlesall.push(article);
    }else{
      this.listarticlesall=this.listarticlesall.filter(a=>a.service.id!=article.service.id);
    }
  }

  getlistarticles(){
    this.articleserv.enterpriseservices(this.actualuser.enterprise_id).subscribe(
      data=>{
        this.listarticlesall=data;
      },
      error=>{
        // console.log('impossible to get articles list');
      }
    );
  }

  async attachmentspickerforall(){

    const modal = await this.appserv.modalCtrl.create({
      component:AttachmentsforallpickerComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='selected'){
      //  console.log(data);
      }
  }

  async providerpickerforall(stock? : StockHistory){
    const modal = await this.appserv.modalCtrl.create({
      component:ProviderpickerComponent,
      initialBreakpoint:0.25,
      breakpoints:[0, 0.25, 0.5, 0.75,1],
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='selected'){
        if(stock){
          stock.customer_id=data.id;
        }else{
          this.actualcustomer=data;
          this.liststockstories.forEach(stock => {
             stock.customer_id=data.id;
          });
        }
      }
  }

  async alldocumentref(){

    const modal = await this.appserv.modalCtrl.create({
      component:AddrefdocumentComponent,
      initialBreakpoint:0.25,
      breakpoints:[0, 0.25, 0.5, 0.75,1],
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='added'){
       this.documentnumber=data;
       this.liststockstories.forEach(stock => {
          stock.document_number=data;
       });
      }
  }

  async depositpickerforall(stock? : StockHistory){
    let list =[];

    this.depositServ.forASpecifUser(this.appserv.getactualuser().id).subscribe(
      data=>{
        list=data;
      },
      error=>{
          /**
           * get from offline
           */
          list=this.depositServ.getOfflineDeposits();
      });

      this.goToDepositPicker(stock,list);
  }

  async goToDepositPicker(stock:any,list:any){
    const modal = await this.appserv.modalCtrl.create({
      component:DepositpickerComponent,
      componentProps:{'listSent':list},
      initialBreakpoint:0.25,
      breakpoints:[0, 0.25, 0.5, 0.75,1],
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='selected'){
        if(stock){
          stock.depot_id=data.id;
        }else{
          this.actualdeposit=data;
          this.liststockstories.forEach(stock => {
              stock.depot_id=data.id;
          });
        }
      }
  }

  async alltypedocumentpicker(stock?: StockHistory){

    const modal = await this.appserv.modalCtrl.create({
      component:TypedocumentpickerComponent,
      initialBreakpoint:0.25,
      breakpoints:[0, 0.25, 0.5, 0.75,1],
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='selected'){
       this.actualdocumenttype=data;
       this.liststockstories.forEach(stock => {
          stock.document_type=data.id;
       });
      }
  }

  async calendarpicker(article: StockHistory){

    const modal = await this.appserv.modalCtrl.create({
      component:CalendarpickerComponent,
      componentProps:{'article':article},
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='selected'){
       article.expiration_date=data;
      }
  }

  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }
  async changeallmouvementmode(stock?: StockHistory){
    if(stock){
      stock.type='withdraw';
      stock.type_approvement='';
      stock.customer_id=0;
      stock.showWithdraw=true;
      stock.showbarcode=false;
      stock.showpu=false;
      stock.showtotal=false;
      stock.showcalendar=false;
    }else{
      if(this.mouvementmode){
        this.typemouvement=false;
        this.iscashmode=false;
        this.actualcustomer=null;
        this.liststockstories.forEach(stock => {
          stock.type='withdraw';
          stock.type_approvement='';
          stock.customer_id=0;
          stock.showWithdraw=true;
          stock.showbarcode=false;
          stock.showpu=false;
          stock.showtotal=false;
          stock.showcalendar=false;
        });
      }else{
        this.iscashmode=true;
        this.liststockstories.forEach(stock => {
          stock.type='entry';
          stock.showWithdraw=false;
          stock.showbarcode=true;
          stock.showpu=true;
          stock.showtotal=true;
          stock.showcalendar=true;
        });
      }
    }
  }

  async selectotherarticles(){

    this.listarticles.forEach(art => {
        this.listarticlesall=this.listarticlesall.filter(a=>a.service.id!=art.service.id);
    });

    this.listarticlesall=this.listarticlesall.filter(a=>a.service.type!='2');
    const modal = await this.appserv.modalCtrl.create({
      component:SelectanarticleComponent,
      componentProps:{'listarticles':this.listarticlesall},
      initialBreakpoint:0.25,
      breakpoints:[0, 0.25, 0.5, 0.75,1],
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='added'){
        data.forEach((el:any) => {
          if(this.listarticles.filter(a=>a.service.id==el.service.id)[0]){

          }else{
            this.listarticles.push(el);
          }
        });
      }
  }

  async totalcalculate(stock: StockHistory){
    const qty=stock.quantity;
    const price=stock.price;
    //stock.total=qty*price;
  }

  async sendhistorystock(){
   const load = await this.appserv.loadctrl.create({
    message:'Traitement en cours...',
    mode:'ios',
    spinner:'circles'
   });
   load.present();

    this.liststockstories.forEach(element => {
      this.stockserv.newstock(element).subscribe(
        data=>{
          this.stockreturned.push(data);
          this.liststockstories=this.liststockstories.filter(s=>s!=element);
          if(this.liststockstories.length===0){
            load.dismiss();
            this.appserv.modalCtrl.dismiss(this.stockreturned,'success');
          }
        },
        error=>{
          //console.log(error);
        }
      );
    });
  }

  async changemouvementmode(article: Articles){}
}
