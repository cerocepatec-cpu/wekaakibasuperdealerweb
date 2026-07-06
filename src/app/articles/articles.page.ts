import { StockhistoryComponent } from './stockhistory/stockhistory.component';
import { Component, OnInit } from '@angular/core';
import { Articles } from '../interfaces/articles';
import { AppservicesService } from '../services/appservices.service';
import { CategoriesArticle } from '../interfaces/cagoriesarticles';
import { UnitofMeasure } from '../interfaces/unitofmeasure';
import { ActionSheetController, ModalController, Platform } from '@ionic/angular';
import { NewserviceComponent } from './newservice/newservice.component';
import { NewcategoryComponent } from './newcategory/newcategory.component';
import { NewunitofmeasureComponent } from './newunitofmeasure/newunitofmeasure.component';
import { EditserviceComponent } from './editservice/editservice.component';
import { InfosServiceComponent } from './customerpickers/infos-service/infos-service.component';
import { Users } from '../interfaces/users';
import { ArticlesService } from '../services/articles.service';
import { CategoryserviceService } from '../services/categoryservice.service';
import { UnitofmeasureService } from '../services/unitofmeasure.service';
import { ImportComponent } from '../import/import.component';
import { CatalogueproductsComponent } from './catalogueproducts/catalogueproducts.component';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.page.html',
  styleUrls: ['./articles.page.scss'],
})
export class ArticlesPage implements OnInit {
  search: any;
  keyword:any;
  actualuser:Users={};
  listarticles: any[]=[];
  results:Articles[]=[];
  keptlistarticles: any[]=[];
  listselectedarticles: Articles[]=[];
  listcategories: CategoriesArticle[]=[];
  listunitofmeasure: UnitofMeasure[]=[];
  showdefaultprogress=false;
  showcheckbox=false;
  users:any[]=[];

  constructor(private appserv: AppservicesService,private uomserv: UnitofmeasureService,private articleserv:ArticlesService, private modalctrl: ModalController,private actionSheet: ActionSheetController, private categarticleserv: CategoryserviceService) { }


  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    // this.getlistarticles();
    this.getallArticles();
    this.getlistcategoriesarticles();
    this.getlistUnitofmeausre();
  }

  async scanbarcode(){
    
    const modal =this.appserv.startScan();
    (await modal).present();
  }

  getallArticles(){
    const object={'user_id':this.actualuser.id};
    this.showdefaultprogress=true;
    this.articleserv.serviceslist(object).subscribe(
      data=>{
        this.showdefaultprogress=false;
        this.listarticles=data;
        this.keptlistarticles=data;
        //save to local storage
        localStorage.setItem('depositArticles',JSON.stringify(data));
      },
      error=>{
        this.showdefaultprogress=false;
        this.appserv.presentToast('Nous utilisons vos données hors ligne.','primary');
        // //taking for local storage
        const records = localStorage.getItem('depositArticles');
        if (records !== null) {
          this.listarticles = JSON.parse(records);
          this.keptlistarticles=this.listarticles;
        }
      }
    );
  } 

  async pdfdownload (){
    if(this.listarticles.length>0){
      let services =[['N°','Nom','Description','UOM','Catégorie','Type']]; let index=0;
      this.listarticles.forEach(el => {
        index=index+1;
          const obj=[index,el.service.name,el.service.description,el.service.uom_symbol,el.service.category_name,el.service.type==1?'Article':'Service'];
          services.push(obj);
      });
      const pdfojb=this.appserv.pdftabledownload(services,'LISTE COMPLETE DES PRODUITS ET SERVICES','Cette liste comprend les articles et les services.','portrait','A4');
      this.appserv.pdfaction(pdfojb,'listeproduits');
    }else{
      this.appserv.presentToast(`Liste des articles vide`,'warning');
    }
  }

excelexport(){
  if(this.listarticles.length>0){
    let services =[['N°','Nom','Description','UOM','Catégorie','Type','prix_detail','prix_gros','prix_casse']]; let index=0;
    this.listarticles.forEach(el => {
      index=index+1;
      const obj=[index,el.service.name,el.service.description,el.service.uom_symbol,el.service.category_name,el.service.type==1?'Article':'Service'];
      el.prices.forEach(price => {
        obj.push(price[0],price[1],price[2]);
      });
        
        services.push(obj);
    });

    this.appserv.exportInToExcel(services,'csv','produits');  
  }else{
    this.appserv.presentToast(`Liste des articles vide`,'warning');
  }
}

  filterbyuom(uomid?:any){
    if(uomid){
      this.listarticles=this.listarticles.filter(a=>a.service.uom_id===uomid);
    }else{
      this.listarticles=this.listarticles.filter(a=>a.service.category_id===null);
    }
  }

  filterbycategory(categoryid?: any){
    if(categoryid){
      this.listarticles=this.listarticles.filter(a=>a.service.category_id===categoryid);
    }else{
      this.listarticles=this.listarticles.filter(a=>a.service.category_id===null);
    }
  }
  deletingfilter(){
    this.listarticles=this.keptlistarticles;
  }

  filterbytype(criteria:string){
    this.listarticles=this.listarticles.filter(a=>a.service.type===criteria);
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };
  
async stockhistory(){
  this.listselectedarticles=this.listselectedarticles.filter(a=>a.service.type==='1');
  const modal = await this.appserv.modalCtrl.create({
    component:StockhistoryComponent,
    componentProps:{'listarticles':this.listselectedarticles}
  });
  modal.present();

  const {data,role}= await modal.onWillDismiss();
      if(role=='success'){
        this.listselectedarticles.forEach(article => {
            data.forEach((element:any) => {
              if(element.service_id==article.service.id){
                article.service.available_qte +=element.quantity;
              }
            });
        });
    }
}

async multipledelete(){
  const alert = await this.appserv.alertctrl.create({
    header:'Suppression multiple',
    mode:'ios',
    message:`Voulez-vous supprimer ces ${this.listselectedarticles.length} articles/services? `,
    translucent:true,
    buttons:[
      {text:'Non',role:'cancel'},
      {text:'Oui',handler: async ()=> {
        this.listselectedarticles.forEach(article => {
          this.showdefaultprogress=true;
          this.articleserv.deleteonearticle(article.service).subscribe(
            data=>{
              this.showdefaultprogress=false;
              if(data>0){
                this.listselectedarticles=this.listselectedarticles.filter(a=>a!=article);
                this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
                this.listarticles=this.listarticles.filter(a=>a!=article);
                if(this.listselectedarticles.length==0){
                  this.showcheckbox=false;
                }
              }else{
                this.appserv.presentToast(`Opération  echouée:`,'warning');
              }
            },
            error=>{
              this.showdefaultprogress=false;
              this.appserv.presentToast(`Suppression impossible`,'danger');
            }
          );
        });
      },}
    ]
  });
  alert.present();
}
async stockarticle(article: Articles){}

async editarticle(article : Articles){
  const modal = await this.appserv.modalCtrl.create({
    component:EditserviceComponent,
    componentProps:{'article':article,'listcategories':this.listcategories,'listunitofmeasure':this.listunitofmeasure},
    cssClass:'modal-border-radius-20'
  });
  modal.present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='edited'){
      article.service.name=data.service.name;
      article.service.description=data.service.description;
      article.service.category_name=data.service.category_name;
      article.service.uom_symbol=data.service.uom_symbol;
      article.service.uom_abreviation=data.service.uom_abreviation;
      article.service.available_qte=data.service.available_qte;
      article.service.type=data.service.type;
    }
}

async deletearticle(article: Articles){
  const alert = await this.appserv.alertctrl.create({
    header:'Suppression',
    subHeader:`${article.service.name}`,
    mode:'ios',
    translucent:true,
    buttons:[
      {text:'Non',role:'cancel'},
      {text:'Oui',handler: async ()=> {
        this.showdefaultprogress=true;
        this.articleserv.deleteonearticle(article.service).subscribe(
          data=>{
            this.showdefaultprogress=false;
            if(data>0){
              this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
              this.listarticles=this.listarticles.filter(a=>a!=article);
            }else{
              this.appserv.presentToast(`Opération  echouée:`,'warning');
            }
          },
          error=>{
            this.showdefaultprogress=false;
            this.appserv.presentToast(`Suppression impossible`,'danger');
          }
        );
      },}
    ]
  });
  alert.present();
}
async detailarticle(article: Articles){
  const modal = await this.modalctrl.create(
    {
      component:InfosServiceComponent,
      componentProps:{'servicesent':article,'listcategories':this.listcategories,'listunitofmeasure':this.listunitofmeasure},
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
    if(role=='edited'){
      
    }

    if(role==='deleted'){
      this.listarticles=this.listarticles.filter(ar=>ar!=article);
    }
}

async getusers(){
  this.appserv.getusers().subscribe( (data)=>{
    this.users=data;
  });
}

async articlemenu(article : Articles){

  if(article.service.type==1){
    const menu = await this.actionSheet.create(
      {
        header: `${article.service.name}`,
        cssClass: 'myactionsheet',
        translucent: true,
        mode: 'ios',
        buttons:[
          {
            text:'Annuler',
            role:'cancel'
          },
          {
            text: 'Stock (Entrées/Sorties)',
            handler: () => {
              this.stockarticle(article);
            }
          }
        ]
      });
  
    (await menu).present();
  }
}

async importcsvfile(){
  const modal = await this.modalctrl.create(
    {
      component:ImportComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
    if(role=='added'){
      data.forEach(el => {
        this.listarticles.push(el);
      });
    }
}

async catalogueproducts(){

  const modal = await this.modalctrl.create(
    {
      component:CatalogueproductsComponent,
      componentProps:{'list':this.listarticles},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
}
async newservice(){
    const modal = await this.modalctrl.create(
      {
        component:NewserviceComponent,
        componentProps:{'listcategories':this.listcategories,'listunitofmeasure':this.listunitofmeasure},
        cssClass:'modal-border-radius-20'
      });
      modal.present();

      const {data,role}= await modal.onWillDismiss();
      if(role=='added'){
        this.keptlistarticles.unshift(data);
      }
  }
  
  async newcategory(){
    const modal = await this.modalctrl.create(
      {
        component:NewcategoryComponent,
        componentProps:{'listcategories':this.listcategories},
        cssClass:'modal-border-radius-20'
      });
      modal.present();

      const {data,role}= await modal.onWillDismiss();
      if(role=='added'){
      this.listcategories.unshift(data);
      }
  } 
  
  async newunitofmeasure(){
    const modal = await this.modalctrl.create(
      {
        component:NewunitofmeasureComponent,
        componentProps:{'listunitofmeasures':this.listunitofmeasure},
        cssClass:'modal-border-radius-20'
      });
      modal.present();

      const {data,role}= await modal.onWillDismiss();
      if(role=='added'){
        this.listunitofmeasure.unshift(data);
      }
  }


 
  
  
  getlistarticles(){
    this.showdefaultprogress=true;
    this.articleserv.enterpriseservices(this.actualuser.enterprise_id).subscribe(
      data=>{
        this.showdefaultprogress=false;
        this.listarticles=data;
        this.keptlistarticles=data;
        //save to local storage
        localStorage.setItem('articles',JSON.stringify(data));
      },
      error=>{
        this.showdefaultprogress=false;
        this.appserv.presentToast('Nous utilisons vos données hors ligne.','primary');
        //taking for local storage
        const records = localStorage.getItem('articles');
        if (records !== null) {
          this.listarticles = JSON.parse(records);
          this.keptlistarticles=this.listarticles;
        }
      }
    );
  } 
  
  getlistcategoriesarticles(){

    this.categarticleserv.getallcategoriesarticles(this.actualuser.enterprise_id).subscribe(
      data=>{
        this.listcategories=data;
        //save to local storage
        localStorage.setItem('categoriesartiles',JSON.stringify(data));
      },
      error=>{
        // this.appserv.presentToast(`Impossible de charger les catégories`,'danger');
         //taking for local storage
         const records = localStorage.getItem('categoriesartiles');
         if (records !== null) {
           this.listcategories= JSON.parse(records);
         }
      }
    );
  } 
  
  getlistUnitofmeausre(){
    this.uomserv.getallunitofmeasure(this.actualuser.enterprise_id).subscribe(
      data=>{
        this.listunitofmeasure=data;
        //save to local storage
        localStorage.setItem('unitofmeasures',JSON.stringify(data));
      },
      error=>{
        // this.appserv.presentToast('Impossible de charger les unités de mesure. ','danger');
         //taking for local storage
         const records = localStorage.getItem('unitofmeasures');
         if (records !== null) {
           this.listunitofmeasure= JSON.parse(records);
         }
      }
    );
  }

  getlistmoneys(){
    this.uomserv.getallunitofmeasure(this.actualuser.enterprise_id).subscribe(
      data=>{
        this.listunitofmeasure=data;
        //save to local storage
        localStorage.setItem('unitofmeasures',JSON.stringify(data));
      },
      error=>{
        // this.appserv.presentToast('Impossible de charger les unités de mesure. ','danger');
         //taking for local storage
         const records = localStorage.getItem('unitofmeasures');
         if (records !== null) {
           this.listunitofmeasure= JSON.parse(records);
         }
      }
    );
  }
}
