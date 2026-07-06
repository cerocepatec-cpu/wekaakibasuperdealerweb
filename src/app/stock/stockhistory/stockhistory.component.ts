
import { SelectanarticleComponent } from '../../articles/selectanarticle/selectanarticle.component';

import { Articles } from '../../interfaces/articles';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { CalendarpickerComponent } from '../../articles/calendarpicker/calendarpicker.component';
import { TypedocumentpickerComponent } from '../../articles/typedocumentpicker/typedocumentpicker.component';
import { DepositpickerComponent } from '../../articles/depositpicker/depositpicker.component';
import { ProviderpickerComponent } from '../../articles/providerpicker/providerpicker.component';
import { AttachmentsforallpickerComponent } from '../../articles/attachmentsforallpicker/attachmentsforallpicker.component';
import { StockHistory } from 'src/app/interfaces/stockhistory';
import { AddrefdocumentComponent } from '../../articles/addrefdocument/addrefdocument.component';
import { Users } from '../../interfaces/users';
import { Providers } from '../../interfaces/providers';
import { ArticlesService } from '../../services/articles.service';
import { StockService } from 'src/app/services/stock.service';
import { DepositsService } from 'src/app/services/deposits.service';
import { DepositForSpecificUserComponent } from 'src/app/deposits/deposit-for-specific-user/deposit-for-specific-user.component';
import { Deposits } from 'src/app/interfaces/deposit';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-stockhistory',
  templateUrl: './stockhistory.component.html',
  styleUrls: ['./stockhistory.component.scss'],
})
export class StockhistoryComponent implements OnInit {
@ViewChild('inputsearch') search! : IonInput;
@Input() modal_used:boolean=false;
@Input() criteria:string;
@Input() articlesSent: Articles[];
@Input() depositSent: Deposits;
modesearch=true;
articlesfromapi: Articles[]=[];
activitytype='entry';
faildoperations: StockHistory[]=[];
listarticlesall: Articles[]=[];
liststockstories: StockHistory[]=[];
stockreturned: any[]=[];
showprovider=true;
showcreatingprogress=false;
showcheckbox=false;
selectedarticles: StockHistory[]=[];
actualdeposit: any;
actualdocumenttype: any;
actualcustomer: Providers={};
documentnumber="";
mouvementmode=false;
typemouvement=false;
iscashmode=true;
showcreditmode=false;
showfaildoperations=false;
actualuser:Users={};
actualProvider:Providers={};
labelprice: any;

  ionViewDidEnter(){
    this.search.setFocus();
  }
  constructor(private depositServ:DepositsService, public appserv: AppservicesService, private articleserv : ArticlesService, private stockserv:StockService) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    this.activitytype=this.criteria;
    this.criteria==='entry'?this.showprovider===true:this.showprovider=false;
    this.criteria==="entry"?this.labelprice="Coût d'achat":this.labelprice="Sortir au prix de";
    if (this.articlesSent) {
      if (this.articlesSent.length>0 && this.depositSent) {
        //console.log('list from depot detail',this.articlesSent);
        this.articlesSent.forEach(element => {
          this.liststockstories.push({
            service_name: element.name,
            description: element.description,
            uom_name: element.uom_name,
            uom_symbol: element.uom_symbol,
            depot_id: this.depositSent.id,
            deposit_name: this.depositSent.name,	
            service_id: element.id,
            user_id:this.appserv.actualUser.id,
            done_by_name: this.appserv.actualUser.user_name,
            quantity:1,
            quantity_before:0,
            price:0,
            expiration_date:'',
            bon_livraison: '',
            motif: '',
            invoice_id: 0,
            code_bar:'',
            note: '',
            type:'',
            total:0,
            customer_id:0,
            provider_id: 0,
            providerName:'',
            document_type:0,
            document_name:'',
            document_number: '',
            type_approvement: 'cash',
            attachment:'',
            status: '',
            uuid:'',
            showWithdraw :false,
            showbarcode: false,
            showpu: true,
            showtotal:true,
            showcalendar:true,
            created_at:'',
            selected:false,
            read:false,
            enterprise_id:this.appserv.actualEse.id,
            sync_status: ''
          });
        });
        // this.liststockstories=this.articlesSent;
        this.actualdeposit=this.depositSent;
      }
    }else{
      this.getaDeposit();
      // this.getarticleslist();
    }
    
  }

  lookuparticles(){
    if (this.search.value) {
      if (this.criteria==="entry") {
        if (this.appserv.isMyDeviceConnected()) {
          //go to look for articles in all the DB
           this.showcreatingprogress=true;
          this.articleserv.searchbyword({enterprise_id:this.appserv.actualEse.id,word:this.search.value,type:"stock"}).subscribe(
          data=>{
            this.showcreatingprogress=false;
            this.articlesfromapi=data;
          },
          error=>{
            this.showcreatingprogress=false;
          });
        }else{
            //offline searching
            this.articlesfromapi=this.articleserv. getoffarticlesbykeywords(String(this.search.value));
        }
      }
      if (this.criteria==="withdraw") {
        //looking for articles in actual deposit
        if(this.actualdeposit && this.actualdeposit.id){
          this.showcreatingprogress=true;
          this.depositServ.searchingservicesfordeposit({deposit_id:this.actualdeposit.id,word:this.search.value,type:"stock"}).subscribe(
            data=>{
              console.log("deposits articles",data);
              this.articlesfromapi=data;
              this.showcreatingprogress=false;
            },error=>{
              this.appserv.presentToast("Une erreur est survenue!",'warning');
            }
          )
        }else{
          this.appserv.presentToast("Veuillez sélectionner un dépôt svp!",'warning');
        }
      } 
    }
  }
resetsearchbar(){
  this.search.value="";
  this.ionViewDidEnter();
}
  lookuparticlebybarcode(){
    if (this.search.value) {
      if (this.criteria==="entry") {
        //go to look for articles in all the DB
        this.showcreatingprogress=true;
        this.articleserv.searchbycodebar({enterprise_id:this.appserv.actualEse.id,word:this.search.value,type:"stock"}).subscribe(
          data=>{
            console.log('result by codebar',data);
            this.showcreatingprogress=false;
            this.articlesfromapi=data;
          },
          error=>{
            this.showcreatingprogress=false;
          });
      }
      if (this.criteria==="withdraw") {
        //looking for articles in actual deposit
        if(this.actualdeposit){
          if (this.search.value) {
            this.showcreatingprogress=true;
            this.depositServ.searchbybarcode({deposit_id:this.actualdeposit.id,word:this.search,type:"stock"}).subscribe(
              data=>{
                this.showcreatingprogress=false;
                if (data) {
                  if (data.service.type==="1" && data.service.available_qte>0) {
                    this.articlesfromapi.push(data);
                  }
                }
              },error=>{
                this.showcreatingprogress=false;
              });
          }
        }else{
          this.appserv.presentToast(`Il semble que vous n'avez aucun dépôt. Veuillez contacter votre administrateur.`,'warning');
        }
      } 
    }
  }

  async addtolist(article: Articles){
    const ifexists = this.liststockstories.filter(s=>s.service_id===article.service.id).length;
    if (ifexists>0) {
      const alert = await this.appserv.alertctrl.create({
        header:'Doublon observé',
        message:`L'article est déjà sélectionné. Que voulez-vous faire?`,
        mode:'ios',
        translucent:true,
        buttons:[
          {text:'Rien',role:'cancel'},
          {text:'Supprimer de la liste',handler:()=>{
            this.liststockstories=this.liststockstories.filter(s=>s.service_id!==article.service.id);
            article.selected=false;
          }},
          {text:'Mettre à jour',handler:()=>{
            this.liststockstories=this.liststockstories.filter(s=>s.service_id!==article.service.id);
            this.pushinlistosend(article);
          }}
        ]
      });
      alert.present();
    }else{
      this.pushinlistosend(article);
    }
      
  }

  async pushinlistosend(article:Articles){
    article.selected=true;
    this.liststockstories.push({
      service_name: article.service.name,
      description: article.service.description,
      uom_name: article.service.uom_name,
      uom_symbol: article.service.uom_symbol,
      depot_id: this.actualdeposit.id,
      deposit_name: this.actualdeposit.name,	
      service_id: article.service.id,
      user_id:this.appserv.actualUser.id,
      done_by_name: this.appserv.actualUser.user_name,
      quantity:article.quantity,
      quantity_before:0,
      price:article.price,
      expiration_date:article.expiration_date,
      bon_livraison: '',
      motif:article.motif,
      invoice_id: 0,
      code_bar:'',
      note:article.note,
      type:this.criteria,
      total:article.total,
      customer_id:0,
      provider_id:this.actualProvider.id,
      providerName:this.actualProvider.providerName,
      document_type:this.actualdocumenttype,
      document_name:'',
      document_number: '',
      type_approvement: 'cash',
      attachment:'',
      status: '',
      uuid:'',
      showWithdraw :false,
      showbarcode: false,
      showpu: true,
      showtotal:true,
      showcalendar:true,
      created_at:'',
      selected:false,
      read:false,
      enterprise_id:this.appserv.actualEse.id,
      sync_status: ''
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

  async selectitem(article: any){
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
      this.liststockstories=this.liststockstories.filter(s=>s!=article);
    });
  }

  getarticleslist(){
    this.showcreatingprogress=true;
    this.articleserv.enterpriseservices(this.appserv.getactualEse().id).subscribe(
      data=>{
        this.showcreatingprogress=false;
        this.listarticlesall=data;
      },
      error=>{
        this.showcreatingprogress=false;
        this.appserv.presentToast('Nous utilisons vos données hors ligne.','primary');
        //taking local storage
          this.listarticlesall =this.articleserv.getOfflineData();
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
       //console.log(data);
      }
  }

  async providerpickerforall(stock? : StockHistory){
    const modal = await this.appserv.modalCtrl.create({
      component:ProviderpickerComponent,
      initialBreakpoint:0.5,
      breakpoints:[0, 0.25, 0.5, 0.75,1]
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='selected'){
        if(stock){
          stock.provider_id=data.id;
        }
        else{
          this.showcreditmode=true;
          this.actualcustomer=data;
          this.liststockstories.forEach(stock => {
             stock.provider_id=data.id;
          });
        }
      }

      if(role=='no_choice'){
        this.liststockstories.forEach(stock => {
          stock.provider_id=0;
       });
      }
  }

  async alldocumentref(){

    const modal = await this.appserv.modalCtrl.create({
      component:AddrefdocumentComponent,
      initialBreakpoint:0.25,
      breakpoints:[0, 0.25, 0.5, 0.75,1]
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

    getaDeposit(){
      const object ={user_id:this.appserv.getactualuser().id};
      this.depositServ.forASpecifUser(object).subscribe(
        data=>{
          this.actualdeposit=data[0];
        },
        error=>{
            /**
             * get from offline
             */
            this.actualdeposit=this.depositServ.getOfflineDeposits()[0];
        });
    }

  async depositpickerforall(stock? : StockHistory){

    const modal = await this.appserv.modalCtrl.create({
      component:DepositForSpecificUserComponent,
      initialBreakpoint:0.75,
      breakpoints:[0, 0.25,0.30, 0.5, 0.75,1],
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='selected'){
        //console.log('deposit selected',data);
        this.actualdeposit=data;
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

  async goToDepositPicker(stock:any,list:any){
   
  }

  async alltypedocumentpicker(stock?: StockHistory){

    const modal = await this.appserv.modalCtrl.create({
      component:TypedocumentpickerComponent,
      initialBreakpoint:0.5,
      breakpoints:[0, 0.25, 0.5, 0.75,1]
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

  async changeallmouvementmode(typesent: any,stock?: StockHistory){
    if(stock){
      if(typesent=='withdraw'){
        stock.type=typesent;
        stock.customer_id=0;
        stock.showWithdraw=true;
        stock.showbarcode=false;
        stock.showpu=false;
        stock.showtotal=false;
        stock.showcalendar=false;
      }else{
        stock.type=typesent;
        stock.customer_id=0;
        stock.showWithdraw=false;
        stock.showbarcode=true;
        stock.showpu=true;
        stock.showtotal=true;
        stock.showcalendar=true;
      }    
    }else{
      if(typesent=='withdraw'){
        this.liststockstories.forEach(stock => {
          stock.type=typesent;
          stock.customer_id=0;
          stock.showWithdraw=true;
          stock.showbarcode=false;
          stock.showpu=false;
          stock.showtotal=false;
          stock.showcalendar=false;
        });
      }else{
        this.liststockstories.forEach(stock => {
          stock.type=typesent;
          stock.customer_id=0;
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

    const modal = await this.appserv.modalCtrl.create({
      component:SelectanarticleComponent,
      componentProps:{'listarticles':this.listarticlesall},
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='added'){

        data.forEach((el:any) => {
          if(this.liststockstories.filter(a=>a.service_id==el.id)[0]){
           
          }else{
            const newobject ={
              depot_id:0,
              service_id:el.service.id,
              provider_id:0,
              user_id:this.actualuser.id,
              invoice_id:0,
              quantity:0,
              quantity_before:0,
              price:0,
              total:0,
              expiration_date:'',
              document_type:0,
              document_name:'',
              attachment:'',
              motif:'',
              code_bar:'',
              note:'',
              type:this.activitytype,
              type_approvement:'cash',
              status:'',
              uuid:'',
              enterprise_id:this.actualuser.enterprise_id,
              service_name:el.service.name,
              description:el.service.description,
              uom_name:el.service.uom_name,
              uom_symbol:el.service.uom_symbol,
              showWithdraw:false,
              showbarcode:true,
              showpu:true,
              showtotal:true,
              showcalendar:true
            };
            this.liststockstories.push(newobject);
          }
        }); 
      }
  }

  async totalcalculate2(article: Articles){
    article.total=article.price*article.quantity;
  } 
  
  async totalcalculate(stock: StockHistory){
    const qty=stock.quantity;
    const price=stock.price;
    //stock.total=qty*price;
  }

  async sendhistorystock(){
    
    if(this.actualdeposit){
      if(this.liststockstories.length>0){
        const alert = await this.appserv.alertctrl.create({
          header:"Validation opération",
          subHeader:this.criteria=='entry'?"Approvisionnement de " + " " + this.liststockstories.length +  (this.liststockstories.length>1?" articles":" article"):"Destockage de " + " "+this.liststockstories.length + (this.liststockstories.length>1?"articles":"article"),
          message:"Validez-vous cette opération?",
          mode:'ios',
          translucent:true,
          buttons:[
            {text:"Non",role:'cancel'},
            {text:"Oui",handler:async ()=>{
              const load = await this.appserv.loadctrl.create({
                message:'Traitement en cours...',
                mode:'ios',
                spinner:'circles'
               });
               load.present();
            
                this.liststockstories.forEach(element => {
                  element.depot_id=this.actualdeposit.id;
                  this.stockserv.newstock(element).subscribe(
                    (data:any)=>{
                      if(data.message && data.message=='fail'){
                        this.faildoperations.push(element);
                        if(this.liststockstories.length===0){
                          load.dismiss();
                          if(this.faildoperations.length>0){
                            this.appserv.alertctrl.create({
                              header:'Opérations echouées',
                              message:'certaines opérations ont echouées.',
                              buttons:[
                                {text:'Afficher?',handler:async ()=>{
                                  this.showfaildoperations=true;
                                }},
                                {text:'Fermer la page',handler:async ()=>{
                                  this.appserv.modalCtrl.dismiss(this.stockreturned,'updated');
                                }}
                              ]
                            })
                          }
                        }
                      }else{
                        this.stockreturned.push(data);
                        //add to offline
                        this.stockserv.saveoffline(data);
                        this.liststockstories=this.liststockstories.filter(s=>s!=element);
                        if(this.liststockstories.length===0){
                          load.dismiss();
                          this.appserv.modalCtrl.dismiss(this.stockreturned,'updated');
                        }
                      }
                    },
                    error=>{
                      /**
                       * save the stock Oflline
                       */
                      const detail=this.creatingofflinestockhistories(element);
                      this.stockreturned.push(detail);
                      this.liststockstories=this.liststockstories.filter(s=>s!=element);
                      if(this.liststockstories.length===0){
                        load.dismiss();
                        this.appserv.modalCtrl.dismiss(this.stockreturned,'updated');
                      }
                    }
                  );
                });
            }},
          ]
        });
        alert.present();
     
      }else{
        this.appserv.presentToast(`Vous devez sélectionner au moins un article à approvisionner`,'warning');
      }
    }else{
      this.appserv.presentToast(`Vous devez sélectionner un dépôt`,'warning');
    }
  }

  removefromlist(article:any){
     this.liststockstories=this.liststockstories.filter(s=>s!=article);
  }
  async changemouvementmode(article: Articles){}

  creatingofflinestockhistories(element:any){
      let detail ={
          id:0,
          depot_id:this.actualdeposit.id,
          service_id: element.service_id,
          user_id:this.appserv.getactualuser().id,
          provider_id:this.actualProvider.id,
          invoice_id:0,
          quantity: element.quantity,
          quantity_before:element.quantity_before,
          price: element.price,
          total: element.price*element.quantity,
          expiration_date:element.expiration_date,
          document_type:element.document_type,
          document_name:element.document_name,
          document_number:element.document_number,
          attachment:element.attachment,
          motif: element.motif,
          code_bar: element.code_bar,
          note: element.note,
          type: element.type,
          type_approvement: element.type_approvement,
          status: 'offline',
          uuid: this.appserv.getUUID('S'),
          enterprise_id:this.appserv.getactualuser().id,
          created_at:this.appserv.today,
          updated_at:this.appserv.today,
          service_name: element.service_name,
          uom_symbol:element.uom_symbol,
          uom_name:element.uom_name,
          deposit_name: this.actualdeposit.name,
          done_by_name: this.appserv.getactualuser().user_name
      };

      //add to syncingStockStories
      this.stockserv.addToSyncingOffline(detail);
      //save the stockHistory Offline
      this.stockserv.saveoffline(detail);
      //Update the Qty of the article in DepositArticles List
      this.stockserv.updatingOfflineArticleQuantity(detail,detail.depot_id);
     return detail;
  }

}
