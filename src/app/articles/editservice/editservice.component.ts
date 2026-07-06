import { Component, OnInit, Input } from '@angular/core';
import { Articles } from '../../interfaces/articles';
import { CategoriesArticle } from 'src/app/interfaces/cagoriesarticles';
import { UnitofMeasure } from 'src/app/interfaces/unitofmeasure';
import { AppservicesService } from '../../services/appservices.service';
import { FormBuilder, Validators,FormArray } from '@angular/forms';
import { NewcategoryComponent } from '../newcategory/newcategory.component';
import { NewunitofmeasureComponent } from '../newunitofmeasure/newunitofmeasure.component';
import { PricesCategories } from 'src/app/interfaces/pricescategories';
import { Money } from 'src/app/interfaces/money';
import { SelectmoneyComponent } from 'src/app/selectmoney/selectmoney.component';
import { Users } from '../../interfaces/users';
import { NewpricecategorieComponent } from '../newpricecategorie/newpricecategorie.component';
import { EditpricecategoryComponent } from '../editpricecategory/editpricecategory.component';
import { ArticlesService } from '../../services/articles.service';
import { MoneyService } from 'src/app/services/money.service';
@Component({
  selector: 'app-editservice',
  templateUrl: './editservice.component.html',
  styleUrls: ['./editservice.component.scss'],
})
export class EditserviceComponent implements OnInit {
  @Input() article: any;
  @Input() servicename='';
  @Input()   listcategories: CategoriesArticle[]=[];
  @Input() listunitofmeasure: UnitofMeasure[]=[];
  listpricing: PricesCategories[]=[];
  listmoney: Money[]=[];
  actualmoney: any;
  actualuser: Users={};
  price=0;
  label='';
  money_id=14;
  showcategorisationbloc=false;

   newserviceform=this.formbuild.group({
    id:[0],
    uom_id: [],
    user_id:[1],
    category_id:[],
    name: ['',Validators.required],
    description:[],
    type:[1],
    codebar:[],
    code_manuel:[],
    photo: [],
    point:[],
    nbrgros:[],
    bonus_applicable:[],
    has_vat: [],
    available_qte:[],
    category_name:[],
    uom_name:[],
    uom_symbo:[],
    pricing:this.formbuild.array([]),
  });

  pricecategoryform= this.formbuild.group({
    id:[0],
    service_id:[0],
    label:[''],
    price:[''],
    money_id:[0],
    abreviation:[''],
  });
    showcreatingprogress=false;
    showpricingbloc=false;
    showothersinfosbloc=false;
    // defaultavatar=this.appserv.defaultavatar;

    constructor(private moneyserv:MoneyService, private appserv : AppservicesService,private articleserv:ArticlesService,private formbuild: FormBuilder, private artiserv: ArticlesService) { }

    ngOnInit() {
      this.gettingmoneys();
      this.sycingdata();
      if(this.article.service.type==2){
        this.servicename='service';
      }
      this.actualuser=this.appserv.getactualuser();
    }

    async removepricingfromapi(price: PricesCategories){

      const alert = await this.appserv.alertctrl.create({
        header:`Suppréssion`,
        message:`Voulez-vous supprimer cette catégorie de prix?`,
        mode:'ios',
        buttons:[
          {text:'Non',role:'cancel'},
          {text:'Oui',handler: async ()=>{
            this.showcreatingprogress=true;
            this.appserv.removepricingfromapi(price.id).subscribe(
              data=>{
                this.showcreatingprogress=false;
                this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
                this.listpricing=this.listpricing.filter(p=>p!=price);
                // this.article.prices=this.article.prices.filter((p:any)=>p!=price);
              },
              error=>{
                this.showcreatingprogress=false;
                this.appserv.presentToast(`Suppression impossible`,'danger');
              }
            );
          }}
        ]
      });
      alert.present();
    }

    async addnewpricecategory(){

      const modal = await this.appserv.modalCtrl.create({
        component:NewpricecategorieComponent,
        cssClass:'modal-border-radius-20'
      });
      modal.present();

      let {data,role}= await modal.onWillDismiss();
      if(role=='added'){
        data.forEach((pricing:PricesCategories)=> {
          //send to API
          this.showcreatingprogress=true;
          pricing.service_id=this.article.service.id;
          pricing.enterprise_id=this.actualuser.id;
          this.appserv.newpricecategory(pricing).subscribe(
            datafromapi=>{
              this.listpricing.push(datafromapi);
              data=data.filter((p:any)=>p!=pricing);
              if(data.length==0){
                this.showcreatingprogress=false;
              }
            },
            error=>{
              this.appserv.presentToast(`Impossible d'enregistrer le prix`,'danger');
              this.listpricing=this.listpricing.filter(p=>p!=pricing);
              if(this.listpricing.length==0){
                this.showcreatingprogress=false;
              }
            }
          );
        });
      }
    }

    get pricing(){
      return this.newserviceform.get('pricing') as FormArray;
    }

  addpricing(data:any){
    this.pricing.push(this.formbuild.control(data));
  }

  async editpricing(pricing: PricesCategories){

    const actionsheet = this.appserv.actionsheetctrl.create({
      header:'Voulez-vous?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Annuler',role:'cancel'},
        {
          text:'Fixer comme prix par défaut?',
          handler:async ()=>{
            this.showcreatingprogress=true;
            pricing.principal=1;
            this.artiserv.editpricecagoryapi(pricing.id,pricing).subscribe(
              data=>{
                this.showcreatingprogress=false;
                this.listpricing.forEach(element => {
                  element.principal=0;
                });
                pricing.principal=1;
              },error=>{
                this.showcreatingprogress=false;
                pricing.principal=0;
                this.appserv.presentToast(`Impossible de terminer cette action. Veuillez vérifier votre connexion`,'danger');
              }
            );
          }
        },
        {
          text:'Modifier',
          handler: async ()=>{
            this.editnewpricing(pricing);
          }
        }
      ]
    });
    (await actionsheet).present();

    }

    async editnewpricing(pricing: PricesCategories){

      const modal = await this.appserv.modalCtrl.create({
        component:EditpricecategoryComponent,
        componentProps:{'pricing':pricing,'direction':'api'},
        initialBreakpoint:0.30,
        breakpoints:[0, 0.25,0.30,0.5, 0.75]
      });
      modal.present();

      const {data,role}= await modal.onWillDismiss();
      if(role=='edited'){
        pricing.label=data.label;
        pricing.abreviation=data.abreviation;
        pricing.price=data.price;
        pricing.principal=data.principal;
        pricing.money_id=data.money_id;
      }

    }

    async sycingdata(){
      this.newserviceform.patchValue({
        id:this.article.service.id,
        uom_id:this.article.service.uom_id,
        user_id:this.article.service.user_id,
        category_id:this.article.service.category_id,
        name:this.article.service.name,
        description:this.article.service.description,
        type:this.article.service.type,
        codebar:this.article.service.codebar,
        code_manuel:this.article.service.code_manuel,
        photo:this.article.service.photo,
        point:this.article.service.point,
        nbrgros:this.article.service.nbrgros,
        bonus_applicable:this.article.service.bonus_applicable,
        has_vat:this.article.service.has_vat,
        available_qte:this.article.service.available_qte,
        category_name:this.article.service.category_name,
        uom_name:this.article.service.uom_name,
        uom_symbo:this.article.service.uom_symbo
      });
      this.listpricing=this.article.prices;
    }

    async sycingpricing(pricing: any){
      this.pricecategoryform.patchValue({
        id:pricing.id,
        label:pricing.label,
        price:pricing.price,
        money_id:pricing.money_id,
        abreviation:pricing.abreviation
      });
    }

    closemodal(){
      this.appserv.closemodal();
    }

    async gettingmoneys(){

      this.moneyserv.getlistmonnaiesapi(this.actualuser.enterprise_id).subscribe(
        data=>{
          this.listmoney=data;
          this.actualmoney=this.listmoney.filter(m=>m.principal===1)[0];
        },
        error=>{
        //  console.log('impossible de charger les monnaies....');
        }
      );
    }

    async changemoney(){

      const modal = await this.appserv.modalCtrl.create({
        component:SelectmoneyComponent,
        componentProps:{'listmoney':this.listmoney},
        initialBreakpoint:0.25,
        breakpoints:[0, 0.25, 0.5, 0.75]
      });
      modal.present();

      const {data,role}= await modal.onWillDismiss();
      if(role=='selected'){
        this.actualmoney=data;
      }
    }

    async newcategory(){
      const modal = await this.appserv.modalCtrl.create(
        {
          component:NewcategoryComponent,
          componentProps:{'listcategories':this.listcategories},
          cssClass:'modal-border-radius-20'
        });
        modal.present();

        const {data,role}= await modal.onWillDismiss();
        if(role=='added'){
        this.listcategories.push(data);
        }
    }

    async newunitofmeasure(){
      const modal = await this.appserv.modalCtrl.create(
        {
          component:NewunitofmeasureComponent,
          componentProps:{'listunitofmeasures':this.listunitofmeasure},
          cssClass:'modal-border-radius-20'
        });
        modal.present();

        const {data,role}= await modal.onWillDismiss();
        if(role=='added'){
          this.listunitofmeasure.push(data);
        }
    }

    async editservice(){
      if (this.appserv.isMyDeviceConnected()) {
        this.showcreatingprogress=true;
        this.articleserv.editarticleapi(this.newserviceform.value).subscribe(
          data=>{
            this.showcreatingprogress=false;
            this.appserv.presentToast(`${this.servicename} modifié avec succès`,'success');
            /**
             * save Offline
             */
            this.articleserv.updateServiceOffLine(data);
            this.appserv.modalCtrl.dismiss(data,'edited');
          },
          error=>{
            this.showcreatingprogress=false;
            this.appserv.presentToast(`Impossible de mettre à jour le produit`,'danger');
          });   
      } else {
        this.appserv.presentToast(`Connexion requise pour cette action.`,'warning');
      }
    }
}
