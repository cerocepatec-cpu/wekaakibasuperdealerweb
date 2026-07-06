import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { Users } from '../interfaces/users';
import { Articles } from '../interfaces/articles';
import { CategoriesArticle } from '../interfaces/cagoriesarticles';
import { CartpreviewComponent } from './cartpreview/cartpreview.component';
import { ArticlesService } from '../services/articles.service';
import { Invoice } from '../interfaces/invoices';
import { StockHistory } from '../interfaces/stockhistory';
import { TipquantityComponent } from './tipquantity/tipquantity.component';
import { NewserviceComponent } from '../articles/newservice/newservice.component';
import { UnitofMeasure } from '../interfaces/unitofmeasure';
import { CategoryserviceService } from '../services/categoryservice.service';
import { UnitofmeasureService } from '../services/unitofmeasure.service';
import { StockService } from '../services/stock.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  search: any;
  actualuser:Users={};
  listarticles: Articles[]=[];
  keptlistarticles: Articles[]=[];
  listselectedarticles: Articles[]=[];
  command: Invoice[]=[];
  listcategories: CategoriesArticle[]=[];
  listunitofmeasure: UnitofMeasure[]=[];
  showdefaultprogress=false;
  showsearch=false;
  savedInvoices:Invoice[]=[];
  
  constructor(private stockserv: StockService,private uomserv: UnitofmeasureService, public appserv: AppservicesService, private articleserv: ArticlesService, private cateserv: CategoryserviceService) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    this.getlistarticles();
    this.getlistcategoriesarticles();
    this.getlistUnitofmeausre();
    this.getsavedinvoices();
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };

  getsavedinvoices(){
    const records = localStorage.getItem('invoicesSaved');
    if (records !== null) {
      this.savedInvoices = JSON.parse(records);
    }
  }
  resetchart(){
    if(this.listselectedarticles.length>=1){
      this.listselectedarticles=[];
      this.appserv.presentToast(`Panier réinitialisé`,'medium');
    }else{
      this.appserv.presentToast(`Panier vide`,'warning');
    }
  }

  cliconsearchicon(){

  }

  async cartpreview(){
    const modal = await this.appserv.modalCtrl.create({
      component:CartpreviewComponent,
      componentProps:{'articles':this.listselectedarticles}
    });
    (await modal).present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='created'){
      this.listarticles.forEach((article: any) => {
        data.forEach((detail: any) => {
          if(article.id===detail.service_id){
            article.available_qte=article.available_qte-detail.quantity;
          }
        });
      });
      this.listselectedarticles=[];
    }

    if(role=="saved"){
      this.listselectedarticles=[];
      const records = localStorage.getItem('invoicesSaved');
      if (records !== null) {
        this.savedInvoices = JSON.parse(records);
        this.savedInvoices.unshift(data);
      }else{
        localStorage.setItem('invoicesSaved',JSON.stringify(this.savedInvoices));
      }
    }
  }

  async newproduct(){

    const modal = await this.appserv.modalCtrl.create(
      {
        component:NewserviceComponent,
        componentProps:{'listcategories':this.listcategories,'listunitofmeasure':this.listunitofmeasure},
      });
      modal.present();

      const {data,role}= await modal.onWillDismiss();
      if(role=='added'){
        const object ={
                          available_qte:data.service.available_qte,
                          bonus_applicable:data.service.bonus_applicable,
                          category_id:data.service.category_id,
                          category_name:data.service.category_name,
                          code_manuel:data.service.code_manuel,
                          codebar:data.service.codebar,
                          created_at:data.service.created_at,
                          description:data.service.description,
                          enterprise_id:data.service.enterprise_id,
                          has_vat:data.service.has_vat,
                          id:data.service.id,
                          name:data.service.name,
                          nbrgros:data.service.nbrgros,
                          photo:data.service.photo,
                          point:data.service.point,
                          price:data.prices[0].price,
                          tva:data.service.tva,
                          type:data.service.type,
                          uom_id:data.service.uom_id,
                          uom_name:data.service.uom_name,
                          uom_symbol:data.service.uom_symbol,
                          updated_at:data.service.updated_at,
                          user_id:data.service.user_id,
                          abreviation:data.prices[0].abreviation}
            this.listarticles.unshift(object);
        }

  }
  async addtocart(article: any){
   
    const ifexists = this.listselectedarticles.indexOf(article);
    if(ifexists==-1){
      if(article.type=='1'){
        if(article.available_qte>0){
          this.listselectedarticles.push(article);
        }else{
          const alert = await this.appserv.alertctrl.create({
            header:'Stock insuffisant',
            message:`Quantité insuffisante. Voulez-vous approvisionner l'article?`,
            mode:'ios',
            buttons:[
              {text:'Non',role:'cancel'},
              {text:'Oui',handler:async ()=>{
                this.addstockhistory(article);
              }}
            ]
          });
          alert.present();
        }
      }else{
        this.listselectedarticles.push(article);
      }
      
    }else{
      
    }
  }

  getlistarticles(){
    this.showdefaultprogress=true;
    this.articleserv.servicestoseller(this.appserv.getactualuser().id).subscribe(
      data=>{
        this.showdefaultprogress=false;
        this.listarticles=data;
        this.keptlistarticles=data;
      },
      error=>{
        this.showdefaultprogress=false;
         //taking for local storage
         const records = localStorage.getItem('articles');
         if (records !== null) {
           this.listarticles = JSON.parse(records);
           this.keptlistarticles=this.listarticles;
         }
      }
    );
  }

  getlistUnitofmeausre(){
    this.uomserv.getallunitofmeasure(this.actualuser.enterprise_id).subscribe(
      data=>{
        this.listunitofmeasure=data;
      },
      error=>{
        //taking for local storage
         const records = localStorage.getItem('unitofmeasures');
         if (records !== null) {
           this.listunitofmeasure= JSON.parse(records);
         }
      }
    );
  }

  getlistcategoriesarticles(){
    this.cateserv.getallcategoriesarticles(this.actualuser.enterprise_id).subscribe(
      data=>{
        this.listcategories=data;
      },
      error=>{
        //taking for local storage
         const records = localStorage.getItem('categoriesartiles');
         if (records !== null) {
           this.listcategories= JSON.parse(records);
         }
      }
    );
  }

  async addstockhistory(article: any){

    const modal = await this.appserv.modalCtrl.create({
      component:TipquantityComponent,
      cssClass:'modal-border-radius-20',
      initialBreakpoint:0.30,
      breakpoints:[0.25,0.30,0.50,0.75,1]
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='edited'){
      //send stock history
      let stock : StockHistory={};
      stock.user_id=this.appserv.getactualuser().id;
      stock.service_id=article.id;
      stock.quantity=data;
      stock.type='entry';
      stock.type_approvement='entry';
      stock.note='approvisionnement direct guichet';
      stock.enterprise_id=this.appserv.getactualuser().enterprise_id;

    const alert = await this.appserv.loadctrl.create({
      message:'Approvisionnement en cours...',
      spinner:'circles',
      mode:'ios'
    });
    alert.present();
     this.stockserv.newstock(stock).subscribe(
      (data: any)=>{
        alert.dismiss();
        article.available_qte +=data.quantity;
        article.available_quantity +=data.quantity;
      },
      error=>{
        alert.dismiss();
        this.appserv.presentToast(`Impossible d'approvisionner l'article. Verifiez votre connexion`,'warning');
      });
    }
  }
}
