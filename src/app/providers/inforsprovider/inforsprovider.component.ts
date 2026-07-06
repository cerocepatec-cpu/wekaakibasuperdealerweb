import { PrintgeneralsituationComponent } from './../printgeneralsituation/printgeneralsituation.component';
import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { Providers } from 'src/app/interfaces/providers';
import { EditproviderComponent } from '../editprovider/editprovider.component';
import { ProvidersService } from 'src/app/services/providers.service';
import { StockHistory } from '../../interfaces/stockhistory';
import { StockhistoryproviderComponent } from '../stockhistoryprovider/stockhistoryprovider.component';

@Component({
  selector: 'app-inforsprovider',
  templateUrl: './inforsprovider.component.html',
  styleUrls: ['./inforsprovider.component.scss'],
})
export class InforsproviderComponent implements OnInit {
@Input() providersent:Providers={};
mouvements:StockHistory[]=[];
showprogress=false;
filtercriteria='all';

constructor(public appserv: AppservicesService, private providerserv: ProvidersService) { }

  ngOnInit() {
    this.getallmouvements();
  }

  async gotoedit(){
    const modal = await this.appserv.modalCtrl.create({
      component:EditproviderComponent,
      componentProps:{'providersent':this.providersent}
    });
    modal.present();
  }

  getallmouvements(){
    this.showprogress=true;
    this.providerserv.stockhistory(this.providersent).subscribe(
      data=>{
        this.showprogress=false;
        this.mouvements=data;
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de charger l'historique des mouvements de stock pour le fournisseur`,'danger');
      }
    );
  }
  async deleteprvider(){
      const alert = await this.appserv.alertctrl.create({
        header:'Suppression',
        subHeader:`${this.providersent.providerName}`,
        mode:'ios',
        translucent:true,
        message:`Voulez-vous vraiment supprimer ce fournisseur? `,
        buttons:[
          {text:'Non',role:'cancel'},
          {text:'Oui',handler: async ()=> {
            this.showprogress=true;
            this.providerserv.deleteoneprovider(this.providersent).subscribe(
              (data:any)=>{
                this.showprogress=false;
                if(data>0){
                  this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
                  this.appserv.modalCtrl.dismiss(this.providersent,'deleted');
                }else{
                  this.appserv.presentToast(`Opération echouée:`,'warning');
                }
              },
              error=>{
                //console.log(error);
                this.showprogress=false;
                this.appserv.presentToast(`Suppression impossible`,'danger');
              }
            );
          },}
        ]
      });
      alert.present();
  }

  async printgeneraldetail(){
    const modal = await this.appserv.modalCtrl.create({
      component:PrintgeneralsituationComponent,
      componentProps:{'providersent':this.providersent}
    });
    modal.present();
  }

  async debts(){
    let datatosend=this.mouvements.filter(m=>m.type=='debt');
    this.modalstockhistory(datatosend);
  }

  async modalstockhistory(datatosend: any){
    const modal = await this.appserv.modalCtrl.create({
      component:StockhistoryproviderComponent,
      componentProps:{'mouvements':datatosend}
    });
    modal.present();
  }

  async gotostockhistory(){
    this.modalstockhistory(this.mouvements);
  }
}
