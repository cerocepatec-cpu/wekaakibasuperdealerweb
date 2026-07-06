import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Deposits } from 'src/app/interfaces/deposit';
import { StockhistoryComponent } from 'src/app/stock/stockhistory/stockhistory.component';
import { Articles } from 'src/app/interfaces/articles';
import { AppservicesService } from 'src/app/services/appservices.service';
import { CategoriesArticle } from 'src/app/interfaces/cagoriesarticles';
import { UnitofMeasure } from 'src/app/interfaces/unitofmeasure';
import { ActionSheetController, IonInput, ModalController } from '@ionic/angular';
import { NewcategoryComponent } from 'src/app/articles/newcategory/newcategory.component';
import { NewunitofmeasureComponent } from 'src/app/articles/newunitofmeasure/newunitofmeasure.component';
import { InfosServiceComponent } from 'src/app/articles/customerpickers/infos-service/infos-service.component';
import { Users } from 'src/app/interfaces/users';
import { ArticlesService } from 'src/app/services/articles.service';
import { PickservicesComponent } from 'src/app/articles/pickservices/pickservices.component';
import { CategoryserviceService } from 'src/app/services/categoryservice.service';
import { UnitofmeasureService } from '../../services/unitofmeasure.service';
import { DepositsService } from 'src/app/services/deposits.service';

@Component({
  selector: 'app-servicesviewer',
  templateUrl: './servicesviewer.component.html',
  styleUrls: ['./servicesviewer.component.scss'],
})
export class ServicesviewerComponent implements OnInit {
@ViewChild('defaultinput') defaultinput!: IonInput;
@Input() depositsent : Deposits={};
@Input() multipleselect : boolean;

search: any;
actualuser:Users={};
listarticles: Articles[]=[];
keptlistarticles: Articles[]=[];
listselectedarticles: Articles[]=[];
listcategories: CategoriesArticle[]=[];
listunitofmeasure: UnitofMeasure[]=[];
showdefaultprogress=false;
showcheckbox=false;
showprogress=false;
users:any[]=[];


constructor(private depositserv:DepositsService, public appserv: AppservicesService,private modalctrl: ModalController,private actionSheet: ActionSheetController, private serviceserv: ArticlesService,private uomserv: UnitofmeasureService, private categserv:CategoryserviceService) { }

ngOnInit() {
  this.actualuser=this.appserv.getactualuser();
  this.getlistarticles();
  this.getlistcategoriesarticles();
  this.getlistUnitofmeausre();
}

ionViewDidEnter(){
  this.defaultinput.setFocus();
}

sendselected(){
  this.appserv.modalCtrl.dismiss(this.listselectedarticles,'selected');
}

filterbyuom(uomid?:any){
  if(uomid){
    this.listarticles=this.listarticles.filter(a=>a.uom_id===uomid);
  }else{
    this.listarticles=this.listarticles.filter(a=>a.category_id===null);
  }
}

filterbycategory(categoryid?: any){
  if(categoryid){
    this.listarticles=this.listarticles.filter(a=>a.category_id===categoryid);
  }else{
    this.listarticles=this.listarticles.filter(a=>a.category_id===null);
  }
}
deletingfilter(){
  this.listarticles=this.keptlistarticles;
}

filterbytype(criteria:string){
  this.listarticles=this.listarticles.filter(a=>a.type===criteria);
}

handleRefresh(event:any) {
  setTimeout(() => {
    this.ngOnInit();
    event.target.complete();
  }, 2000);
};

async stockhistory(){
this.listselectedarticles=this.listselectedarticles.filter(a=>a.type==='1');
const modal = await this.appserv.modalCtrl.create({
  component:StockhistoryComponent,
  componentProps:{'articlesSent':this.listselectedarticles,'modal_used':true,'depositSent':this.depositsent},
  cssClass:"modal-border-radius-20"
});
modal.present();

const {data,role}= await modal.onWillDismiss();
    if(role=='success'){
      this.listselectedarticles.forEach(article => {
          data.forEach((element:any) => {
            if(element.service_id==article.id){
              article.available_qte +=element.quantity;
            }
          });
      });
  }
}

async multipledelete(){
const alert = await this.appserv.alertctrl.create({
  header:'Suppression multiple',
  mode:'ios',
  message:`Voulez-vous retirer ces ${this.listselectedarticles.length} produits? `,
  translucent:true,
  buttons:[
    {text:'Non',role:'cancel'},
    {text:'Oui',handler: async ()=> {
      let object = [];
      this.listselectedarticles.forEach(element => {
        object.push({service_id:element.id,deposit_id:this.depositsent.id});
      });
      this.deletearticles(object);
    },}
  ]
});
  alert.present();
}

async stockarticle(article: Articles){}


selectionChange($event){
  
  if($event.target.checked){
    this.multipleselect=true;
    this.listarticles.forEach(element => {
      element.selected=true;
    });
    this.listselectedarticles=this.listarticles;
  }else{
    this.multipleselect=false;
    this.listarticles.forEach(element => {
      element.selected=false;
    });
    this.listselectedarticles=[];
  }
}

async deletearticles(dataSent: any){
  //console.log('selected and to send',dataSent);
  this.showdefaultprogress=true;
  this.depositserv.withdrawServicestodeposit({services:dataSent}).subscribe(
    data=>{
      this.showdefaultprogress=false;
        this.appserv.presentToast(`${data.number} produit${data.number>1?'s':''} retiré${data.number>1?'s':''} de la liste`,'success');
        data.services.forEach(element => {
          this.listarticles=this.listarticles.filter(a=>a.id!=element.service_id);
        });
        this.listselectedarticles=[];
        this.multipleselect=false;
    },
    error=>{
      //console.log(error);
      this.showdefaultprogress=false;
      this.appserv.presentToast(`Suppression impossible`,'danger');
    }
  );
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
    if(this.multipleselect){
      const ifexists = this.listselectedarticles.indexOf(article);
      if(ifexists==-1){
        this.listselectedarticles.push(article);
        article.selected=true;
        article.status='selected';
      }else{
        this.listselectedarticles=this.listselectedarticles.filter(r=>r!=article);
        article.selected=false;
      }
    }else{
    let menubuttons=[
      {
        text: 'Annuler',
      role:'cancel'
      },
      {
        text: 'Rétirer de la liste',
        handler: () => {
          let object =[{service_id:article.id,deposit_id:this.depositsent.id}];
          this.deletearticles(object);
        }
      }
    ];

    if(article.type==='1'){
      menubuttons.push( {
        text: 'Stock (Entrées/Sorties)',
        handler: () => {
          this.stockarticle(article);
        }
    });
    }

    const menu = await this.actionSheet.create(
      {
        header: `${article.name}`,
        cssClass: 'myactionsheet',
        translucent: true,
        mode: 'ios',
        buttons:menubuttons
      }

    );

    (await menu).present();

  }
}
async newservice(){
  const modal = await this.modalctrl.create(
    {
      component:PickservicesComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
    if(role=='added'){
    let object ={depositId:this.depositsent.id,services:data};
        this.showdefaultprogress=true;
        //send to api
        this.depositserv.addservicestodeposit(object).subscribe(
          (data:any)=>{
            console.log('articles coming over there',data);
            this.showdefaultprogress=false;
            this.appserv.presentToast(`Les articles ont été ajoutés avec succès`,'success');
            data.forEach((element:any) => {
              let service={
                available_qte:element.service.available_qte,
                category_name: element.service.category_name,
                uom_name:element.service.uom_name,
                uom_symbol:element.service.uom_symbol,
                id:element.service.id,
                uom_id:element.service.uom_id,
                user_id:element.service.user_id,
                category_id:element.service.category_id,
                name:element.service.name,
                description:element.service.description,
                type:element.service.type,
                codebar: element.service.codebar,
                code_manuel: element.service.code_manuel,
                photo:element.service.photo,
                point: element.service.point,
                nbrgros: element.service.nbrgros,
                bonus_applicable: element.service.bonus_application,
                has_vat: element.service.has_vat,
                tva: element.service.tva,
                enterprise_id: element.service.enterprise_id,
                created_at: element.service.created_at,
                updated_at: element.service.updated_at,
                prices:element.prices
            };
              this.listarticles.push(service);
            });
          },error=>{
            this.showdefaultprogress=false;
            this.appserv.presentToast(`Une erreur est survenue lors de l'ajout des services au dépôt`,'danger');
          }
        );
    }
}

async newcategory(){
  const modal = await this.modalctrl.create(
    {
      component:NewcategoryComponent,
      componentProps:{'listcategories':this.listcategories},
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
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
    if(role=='added'){
    this.listunitofmeasure.unshift(data);
    }
}


getlistarticles(){
  this.showprogress=true;
  this.depositserv.articlesdepositpaginate(this.depositsent.id).subscribe(
    async datadeposit=>{
      this.listarticles=datadeposit.data;
      if (datadeposit.next_page_url) {
          this.showprogress=true;
        try{
          const url = `${datadeposit.next_page_url}`;
          this.listarticles=datadeposit.data.concat( await this.getnexpagesdepositartlces(url));
        }catch(err){
          console.error(err.message);
        }
      }else{
        this.listarticles=datadeposit.data;
        this.showprogress=false;
      }
    },
    error=>{
      this.appserv.presentToast("Nous avons connu un problème en voulant récupérer les produits du dépôt " + this.depositsent.name,"warning");
    });
 }

 getnexpagesdepositartlces = async (url: string) =>{
  let response = await fetch(`${url}`);
  let responseData = await response.json();
  let services =responseData.data;

  if (responseData.next_page_url) {
    this.showprogress=true;
    return services.concat(await this.getnexpagesdepositartlces (responseData.next_page_url));
  }else{
    this.showprogress=false;
    return services;
  }
}

getlistcategoriesarticles(){

  this.categserv.getallcategoriesarticles(this.actualuser.enterprise_id).subscribe(
    data=>{
      this.listcategories=data;
    },
    error=>{
      this.appserv.presentToast(`Impossible de charger les catégories`,'danger');
    }
  );
}

getlistUnitofmeausre(){
  this.uomserv.getallunitofmeasure(this.actualuser.enterprise_id).subscribe(
    data=>{
      this.listunitofmeasure=data;
    },
    error=>{
      this.appserv.presentToast('Impossible de charger les unités de mesure','danger');
    }
  );
}

}
