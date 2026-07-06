import { Component, OnInit, Input } from '@angular/core';
import { Tables } from '../../interfaces/tables';
import { AppservicesService } from '../../services/appservices.service';
import { TableService } from 'src/app/services/table.service';
import { ServantInvoice } from '../../interfaces/servantinvoice';

@Component({
  selector: 'app-infostable',
  templateUrl: './infostable.component.html',
  styleUrls: ['./infostable.component.scss'],
})
export class InfostableComponent implements OnInit {
@Input() tablesent : Tables={};
showprogress=false;
mouvements:any[]=[];
listservants: ServantInvoice[]=[];
typesale='all';

constructor(public appserv: AppservicesService, private tableserv: TableService) { }

  ngOnInit() {
    this.reportsales();
    this.getservants();
  }

  gotoedit(){
    this.tableserv.calledit(this.tablesent);
  }

  async deletetable(table: Tables){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression',
      subHeader:`${table.name}`,
      message:`Voulez-vous vraiment supprimer cette table?`,
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.showprogress=true;
          this.tableserv.delete(table.id).subscribe(
            data=>{
              this.showprogress=false;
              if(data==1){
                this.appserv.presentToast('Table supprimée avec succès','success');
                this.appserv.modalCtrl.dismiss(this.tablesent,'deleted');
              }
            },
            error=>{
              this.showprogress=false;
              this.appserv.presentToast(`Impossible de supprimer la table`,'danger');
            }
          )

        },}
      ]
    });
    alert.present(); 
  }

  printgeneraldetail(){}

  reportsales(){
    this.showprogress=true;
    this.tableserv.reportsales(this.tablesent.id).subscribe(
      data=>{
        this.showprogress=false;
        this.mouvements=data;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Erreur lors de chargement de l'historique des ventes pour cette table`,`danger`);
      }
    );
  }

  getservants(){

    this.tableserv.getservants(this.tablesent.id).subscribe(
      data=>{
        this.listservants=data;
      },
      error=>{
        this.appserv.presentToast(`Erreur lors de chargement de la liste des serveurs`,`danger`);
      }
    );
  }

}
