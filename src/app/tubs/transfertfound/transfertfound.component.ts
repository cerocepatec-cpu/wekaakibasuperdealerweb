/* eslint-disable eqeqeq */
/* eslint-disable quote-props */
import { Component, OnInit, Input } from '@angular/core';
import { Tubs } from 'src/app/interfaces/tubs';
import { AppservicesService } from 'src/app/services/appservices.service';
import { TransfertFound } from 'src/app/interfaces/transfert';
import { NewtransfertfoundComponent } from './newtransfertfound/newtransfertfound.component';
import { Mouvement } from 'src/app/interfaces/mouvement';

@Component({
  selector: 'app-transfertfound',
  templateUrl: './transfertfound.component.html',
  styleUrls: ['./transfertfound.component.scss'],
})
export class TransfertfoundComponent implements OnInit {
@Input() tubSent: Tubs={};
@Input() mouvementsent: Mouvement[]=[];
search: any;
listTransferts: TransfertFound[]=[];
showconvertedamount=false;
showprogress=false;
title='';
  constructor(public appserv: AppservicesService) { }

  ngOnInit() {
    this.title='sortants';
    const object ={criteria:'done',fundId:this.tubSent.id};
    this.getlistoperations(object);
  }

  async openaddnewtransfert(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewtransfertfoundComponent,
      componentProps:{'tubSent':this.tubSent},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role =='added'){
      this.listTransferts.unshift(data.data);
      this.mouvementsent.unshift(data.history);
    }
  }

  getlistoperations(datasent: any){
    this.showprogress=true;
    this.appserv.getTransfertForaTub(datasent).subscribe(
      data=>{
        this.showprogress=false;
        this.listTransferts=data;
        console.log(data);
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Une erreur est survenue lors de la recuperation de l'historique des transferts`,'danger');
      });
  }

  async menuoperation(mouvement: Mouvement){
    const menuctrl = await this.appserv.actionsheetctrl.create({
      header:`Que voulez-vous faire?`,
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Rien',role:'cancel'},
        {text:'Annuler transfert',handler:()=> {
            this.canceltransfer(mouvement);
        },},
      ]
    });
    menuctrl.present();
  }

  async canceltransfer(mouvement: Mouvement){
    const alert = await this.appserv.alertctrl.create({
      header:'SUppression',
      message:'Confirmez-vous cette action?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=> {
            this.canceltoapi(mouvement);
        },},
      ]
    });
    alert.present();
  }

  async canceltoapi(mouvement: Mouvement){
    this.showprogress=true;
    this.appserv.deletetransfer(mouvement).subscribe(
      data=>{
        this.showprogress=false;
        if (data.message=='deleted') {
          this.appserv.presentToast('Opération supprimée avec succès','success');
          this.listTransferts=this.listTransferts.filter(t=>t!=mouvement);
        } else {
          this.appserv.presentToast('Erreur survenue. Réessayez svp!','warning');
        }
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast('Erreur survenue. Réessayez svp!','danger');
      });
  }

  filterbyincoming(){
    this.title='entants';
    const object ={criteria:'incoming',fundId:this.tubSent.id};
    this.getlistoperations(object);
  }

  filterbyout(){
    this.title='sortants';
    const object ={criteria:'done',fundId:this.tubSent.id};
    this.getlistoperations(object);
  }

  async actionstoperation(mouvement){}

  async opensearchoperation(){}
}
