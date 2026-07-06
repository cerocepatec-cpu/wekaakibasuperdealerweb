import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { Servant } from '../../interfaces/servants';
import { Invoice } from '../../interfaces/invoices';
import { ServantsService } from 'src/app/services/servants.service';

@Component({
  selector: 'app-infoservant',
  templateUrl: './infoservant.component.html',
  styleUrls: ['./infoservant.component.scss'],
})
export class InfoservantComponent implements OnInit {
@Input() servantsent: Servant={};
showprogress=false;
mouvements: Invoice[]=[];
typesale='all';

  constructor(public appserv: AppservicesService, private servantserv: ServantsService) { }

  ngOnInit() {
    this.reportsales();
  }

  gotoedit(){
    this.servantserv.editservant(this.servantsent);
  }

  async deletetable(servant: Servant){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression',
      subHeader:`${servant.name}`,
      mode:'ios',
      translucent:true,
      message:`Voulez-vous vraiment supprimer ce serveur? `,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.showprogress=true;
          this.servantserv.deleteoneservant(servant).subscribe(
            (data:any)=>{
              this.showprogress=false;
              if(data>0){
                this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
                this.appserv.modalCtrl.dismiss(this.servantsent,'deleted');
              }else{
                this.appserv.presentToast(`Opération echouée. Véuillez réssayer.`,'warning');
              }
            },
            error=>{
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
    this.appserv.presentToast(`Les statistiques du serveur en cours de développement.`,`primary`);
  }

  reportsales(){
    this.showprogress=true;
    this.servantserv.getsales(this.servantsent.id).subscribe(
      data=>{
        this.showprogress=false;
        this.mouvements=data;
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Erreur survenue lors du chargement de l'historique des ventes pour le serveur`,`danger`);
      }
    );
  }
}
