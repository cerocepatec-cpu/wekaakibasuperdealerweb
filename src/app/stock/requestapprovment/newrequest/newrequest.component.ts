import { Component, OnInit } from '@angular/core';
import { Deposits } from 'src/app/interfaces/deposit';
import { AppservicesService } from '../../../services/appservices.service';
import { FormBuilder } from '@angular/forms';
import { Articles } from 'src/app/interfaces/articles';
import { DepositpickerComponent } from 'src/app/articles/depositpicker/depositpicker.component';
import { ServicesviewerComponent } from '../../../deposits/servicesviewer/servicesviewer.component';
import { TransfertService } from 'src/app/services/transfert.service';
import { TransfertStock } from 'src/app/interfaces/transfertstock';

@Component({
  selector: 'app-newrequest',
  templateUrl: './newrequest.component.html',
  styleUrls: ['./newrequest.component.scss'],
})
export class NewrequestComponent implements OnInit {
  keptarticles:Articles[]=[];
  depositsender:Deposits;
  depositreceiver:Deposits;
  articles:Articles[]=[];
  showprogress=false;
  note:any;
  transferts:TransfertStock[]=[];

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
    enterprise_id:[]
  });

  constructor(public appserv: AppservicesService, private fb:FormBuilder, private transfertserv: TransfertService) { }

  ngOnInit() {}

  async servicepicker(){
    const modal = await this.appserv.modalCtrl.create({
      component:ServicesviewerComponent,
      componentProps:{'depositsent':this.depositsender,'multipleselect':true},
      cssClass:'modal-border-radius-20'
    });

    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      this.articles=data;
    }
  }

  async depositsenderpicker(){
    const modal = await this.appserv.modalCtrl.create({
      component:DepositpickerComponent,
      cssClass:'modal-border-radius-20'
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
      component:DepositpickerComponent,
      cssClass:'modal-border-radius-20'
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
            status:'0',
            enterprise_id:this.appserv.getactualuser().enterprise_id
        });
          this.transfertserv.new(this.newtransfert.value).subscribe(
          data=>{
            this.showprogress=false;
            this.transferts.push(data);
            article.selected=false;
            article.status='sent';
            if(counter==this.articles.length){
              this.appserv.presentToast(`Votre transfert a été effectué avec succès`,'success');
              this.appserv.modalCtrl.dismiss(this.transferts,'added');
            }
            
          },error=>{
            if(counter==this.articles.length){
              this.appserv.presentToast(`Une erreur est survenue lors du transfert des articles`,'danger');
              article.status='unsent';
              this.showprogress=false;
            }
          }
        );
    });
  }

}
