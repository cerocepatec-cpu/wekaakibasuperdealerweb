import { Component, OnInit, ViewChild } from '@angular/core';
import { Deposits } from 'src/app/interfaces/deposit';
import { AppservicesService } from '../../../services/appservices.service';
import { FormBuilder } from '@angular/forms';
import { Articles } from 'src/app/interfaces/articles';
import { DepositpickerComponent } from 'src/app/articles/depositpicker/depositpicker.component';
import { ServicesviewerComponent } from '../../../deposits/servicesviewer/servicesviewer.component';
import { TransfertService } from 'src/app/services/transfert.service';
import { TransfertStock } from 'src/app/interfaces/transfertstock';
import { DepositsService } from 'src/app/services/deposits.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-newtransfert',
  templateUrl: './newtransfert.component.html',
  styleUrls: ['./newtransfert.component.scss'],
})
export class NewtransfertComponent implements OnInit {
  @ViewChild('mobileinputSearch') mobileinput!: IonInput;
  keptarticles:Articles[]=[];
  depositsender:Deposits;
  depositreceiver:Deposits;
  articles:Articles[]=[];
  showprogress=false;
  note:any;
  transferts:TransfertStock[]=[];
  isModalOpen=false;
  transfertslistarticles:Articles[]=[];
  canPrintProforma=false;

  newtransfert = this.fb.group({
    deposit_sender_id:[],
    deposit_receiver_id:[],
    quantity_sent:[0],
    quantity_received:[],
    note:[],
    reference:[],
    sender_id:[],
    receiver_id:[],
    service_id:[],
    status:[],
    enterprise_id:[],
    done_at:[]
  });

  constructor(private depositserv:DepositsService, public appserv: AppservicesService, private fb:FormBuilder, private transfertserv: TransfertService) { }

  ngOnInit() {}
  BeforeClosingSearchModal($event){
    this.isModalOpen=false;
  }

  aftermodalpresented($event){
    this.mobileinput.setFocus();
  }
  setModalarticlesOpened(isOpen: boolean){
    this.isModalOpen = isOpen;
  }
  async mobilelookupmethod($event){
    if (this.mobileinput.value) {
      if($event.keyCode === 13){
        //looking for codebar
              //if isset deposit
              if(this.depositsender){
                if (!this.appserv.isMyDeviceConnected()) {
                  //offline lookup with codebar
                  const response =this.depositserv.getoffarticlesbydepositcodebar(this.depositsender.id,String(this.mobileinput.value));
                  if (typeof response !== 'undefined' && response !== null && !this.canPrintProforma) {
                      if (response.service.type==="1" && response.service.available_qte>0) {
                        this.addtocart(response);
                        this.appserv.presentToast("Résultat trouvé et ajouté au panier ","primary");
                      }
        
                      if (response.service.type==="2" || this.canPrintProforma) {
                        this.addtocart(response);
                        this.appserv.presentToast("Résultat trouvé et ajouté au panier ","primary");
                      }
                  }else{
                    this.appserv.presentToast("Aucun résultat trouvé","warning");
                  }
                
                  //suite here
                }else{
                    //online
                    this.showprogress=true;
                    this.depositserv.searchbybarcode({deposit_id:this.depositsender.id,word:String(this.mobileinput.value)}).subscribe(
                      data=>{
                        this.showprogress=false;
                        if (typeof data !=='undefined' && data!==null) {
                          if (data.service.type==="1" && data.service.available_qte>0 && !this.canPrintProforma) {
                            this.addtocart(data);
                            this.appserv.presentToast("Résultat trouvé et ajouté au panier ","primary");
                          }
            
                          if (data.service.type==="2" || this.canPrintProforma) {
                            this.addtocart(data);
                            this.appserv.presentToast("Résultat trouvé et ajouté au panier ","primary");
                          }
                        }else{
                          this.appserv.presentToast("Aucun résultat trouvé","warning");
                        }
                      },error=>{
                        this.showprogress=false;
                        this.appserv.presentToast("Une erreur est survenue lors de la recheche d'articles. Veuillez vérifier votre connexion","warning");
                      });
                }
            }else{
              this.appserv.presentToast("Vous n'êtes affecté à aucun dépôt. Contactez votre administrateur pour plus de détails.",'warning');
            }
      }else{
            //if isset deposit
          if(this.depositsender){
            //offline
            if (!this.appserv.isMyDeviceConnected()) {
              this.transfertslistarticles=this.depositserv.getoffarticlesbydepositkeywords(this.depositsender.id,String(this.mobileinput.value));
            }else{
              //online
              this.showprogress=true;
              this.depositserv.searchingservicesfordeposit({deposit_id:this.depositsender.id,word:String(this.mobileinput.value)}).subscribe(
                data=>{
                  this.showprogress=false;
                  this.transfertslistarticles=data;
                },error=>{
                  this.showprogress=false;
                  this.appserv.presentToast("Une erreur est survenue lors de la recheche d'articles. Veuillez vérifier votre connexion","warning");
                });
            }
        }else{
          this.appserv.presentToast("Vous n'êtes affecté à aucun dépôt. Contactez votre administrateur pour plus de détails.",'warning');
        }
      }
    }
  }

    async addtocart(article: Articles, index: number=0){
      const ifexists = this.articles.indexOf(article);
  
      if(ifexists===-1 && this.articles.filter(a=>a.service.id==article.service.id).length==0)
      {
        if(article.service.type==='1'){
          article.done_at=this.appserv.defaultdate();
          this.articles.push(article);
          article.selected=true;
        }
      }else{
       this.articles=this.articles.filter(s=>s!=article);
       article.selected=false;
      }
      this.mobileinput.setFocus();
    }
    removewithdrawarticle(article){

    }
  async servicepicker(){
    const modal = await this.appserv.modalCtrl.create({
      component:ServicesviewerComponent,
      componentProps:{'depositsent':this.depositsender,'multipleselect':true}
    });

    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      this.articles=data;
    }
  }

  async productslookup(){
    this.showprogress=true;
    this.depositserv.searchingservicesfordeposit({deposit_id:this.depositsender.id,word:String(this.mobileinput.value)}).subscribe(
      data=>{
        this.showprogress=false;
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast("Une erreur est survenue lors de la recheche d'articles. Veuillez vérifier votre connexion","warning");
      });
  }

  async depositsenderpicker(){
    const modal = await this.appserv.modalCtrl.create({
      component:DepositpickerComponent
    });

    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      if(this.depositreceiver && data.id==this.depositreceiver.id){
        this.appserv.presentToast(`Sélectiionner un autre dépôt différent du destinataire`,'warning');
      }else{
        if(this.depositsender && data.id!=this.depositsender.id){
          this.articles=[];
        }
        this.depositsender=data;
      }

    }
  }

  deletefromlist(article: Articles){
    this.articles=this.articles.filter(a=>a!=article);
  }

  async depositreceiverpicker(){
    const modal = await this.appserv.modalCtrl.create({
      component:DepositpickerComponent
    });

    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      if(data.id==this.depositsender.id){
        this.appserv.presentToast(`Sélectiionner un autre dépôt différent de l'expediteur`,'warning');
      }else{
        this.depositreceiver=data;
      }
    }
  }

validatetransfert(){
    this.showprogress=true;
    let counter = 0;
    this.articles.forEach(article => {
         counter=counter+1;
        this.newtransfert.patchValue({
            deposit_sender_id:this.depositsender.id,
            deposit_receiver_id:this.depositreceiver.id,
            quantity_sent:article.service.available_qte,
            quantity_received:0,
            note:this.note,
            reference:'',
            sender_id:this.appserv.getactualuser().id,
            service_id:article.service.id,
            status:'pending',
            enterprise_id:this.appserv.getactualuser().enterprise_id,
            done_at:article.done_at
        });
          this.transfertserv.new(this.newtransfert.value).subscribe(
          data=>{
            //console.log(data);
            this.showprogress=false;
            this.transferts.push(data);
            article.selected=false;
            article.status='sent';
            this.articles=this.articles.filter(a=>a!=article);
            if(this.articles.length==0){
              this.appserv.presentToast(`Votre transfert a été effectué avec succès`,'success');
              this.appserv.modalCtrl.dismiss(this.transferts,'added');
            }

          },error=>{
            if(this.articles.length==0){
              this.appserv.presentToast(`Une erreur est survenue lors du transfert des articles`,'danger');
              article.status='unsent';
              //console.log(error);
              this.showprogress=false;
            }
          }
        );
    });
  }
}
