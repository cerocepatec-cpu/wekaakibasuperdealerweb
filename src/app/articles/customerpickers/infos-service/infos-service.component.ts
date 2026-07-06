import { Component, OnInit, Input } from '@angular/core';
import { Articles } from '../../../interfaces/articles';
import { AppservicesService } from '../../../services/appservices.service';
import { PricesCategories } from 'src/app/interfaces/pricescategories';
import { StockHistory } from 'src/app/interfaces/stockhistory';
import { ArticlesService } from 'src/app/services/articles.service';
import { EditserviceComponent } from 'src/app/articles/editservice/editservice.component';
import { CategoriesArticle } from 'src/app/interfaces/cagoriesarticles';
import { UnitofMeasure } from '../../../interfaces/unitofmeasure';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-infos-service',
  templateUrl: './infos-service.component.html',
  styleUrls: ['./infos-service.component.scss'],
})
export class InfosServiceComponent implements OnInit {
@Input() servicesent: Articles={};
@Input() listcategories: CategoriesArticle[]=[];
@Input() listunitofmeasure: UnitofMeasure[]=[];
listpricing: PricesCategories[]=[];
servicename="article";
showprogress=false;
mouvements:StockHistory[]=[];
  constructor(public appserv: AppservicesService, private articleserv: ArticlesService,private stockserv: StockService) { }

  ngOnInit() {
    if(this.servicesent.service.type===2){
      this.servicename='service';
    }
    this.listpricing=this.servicesent.prices;
    this.getmouvements();
    console.log('service sent',this.servicesent);
  }

  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }

  getmouvements(){
    this.stockserv.stockhistoryforaservice(this.servicesent.service.id).subscribe(
      data=>{
        this.mouvements=data;
      },
      error=>{
        //console.log(error);
        this.appserv.presentToast(`Erreur lors de la recuperation de l'historique des mouvements stock`,'warning');
      }
    );
  }

  async reportsales(){
    const modal=this.articleserv.reportsales(this.servicesent);
    (await modal).present();
  }
  async printgeneraldetail(){
    this.articleserv.generaldetail(this.servicesent);
  }

  async deleteproduct(){
    const alert = this.appserv.alertctrl.create({
      header:'Suppresion',
      message:'Confirmez-vous cette suppression?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:"Non",role:'cancel'},
        {text:"Oui",handler:async ()=>{
          this.showprogress=true;
          this.articleserv.deleteonearticle(this.servicesent.service).subscribe(
            data=>{
              this.showprogress=false;
              this.appserv.presentToast(`${this.servicename} ${this.servicesent.service.name} supprimé avec succès`,'success');
              this.appserv.modalCtrl.dismiss(this.servicesent,'deleted');
            },error=>{
              this.showprogress=false;
              this.appserv.presentToast(`Impossible de supprimer ${this.servicename==='article'?'l\''+this.servicename:'le '+this.servicename}`,'danger');
            }
          )
        }}
      ]
    });

    (await alert).present();
  }

  async gotoedit(){
     const modal = await this.appserv.modalCtrl.create({
      component:EditserviceComponent,
      componentProps:{'article':this.servicesent,'listcategories':this.listcategories,'listunitofmeasure':this.listunitofmeasure}
     });
     modal.present();

     const {data,role}= await modal.onWillDismiss();
      if(role=='edited'){
      this.servicesent.service.name=data.service.name;
      this.servicesent.service.description=data.service.description;
      this.servicesent.service.category_name=data.service.category_name;
      this.servicesent.service.uom_symbol=data.service.uom_symbol;
      this.servicesent.service.uom_abreviation=data.service.uom_abreviation;
      this.servicesent.service.available_qte=data.service.available_qte;
      this.servicesent.service.type=data.service.type;
    }
  }
}
