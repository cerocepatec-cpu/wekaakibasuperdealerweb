import { Component, OnInit } from '@angular/core';
import { MarginsSettingsService } from 'src/app/services/margins-settings.service';
import { MarginsSettings } from '../../../interfaces/margins-settings';
import { AppservicesService } from 'src/app/services/appservices.service';
import { NewmarginexpenditureComponent } from '../newmarginexpenditure/newmarginexpenditure.component';
import { InfosmaginexpendituresComponent } from '../infosmaginexpenditures/infosmaginexpenditures.component';

@Component({
  selector: 'app-marginexpendituresettings',
  templateUrl: './marginexpendituresettings.component.html',
  styleUrls: ['./marginexpendituresettings.component.scss'],
})
export class MarginexpendituresettingsComponent implements OnInit {
listmargins:MarginsSettings[]=[];
showcheckbox=false;
showprogress=false;
keyword:any;
  constructor(public marginSetServ: MarginsSettingsService, public appserv: AppservicesService) { }

  ngOnInit() {
    this.gettinglist();
  }

  gettinglist(){
    this.marginSetServ.list(this.appserv.actualEse.id).subscribe(
      data=>{
        this.listmargins=data;
      },error=>{
        this.appserv.presentToast('Erreur survenue lors de la recuperation de la liste des marges','danger');
      });
  }

  async newmargin(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewmarginexpenditureComponent,
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role === 'added') {
      this.listmargins.unshift(data);
    }
  }

  async multipledelete(){}

  async menumargin(margin:MarginsSettings){
    const menu = this.appserv.actionsheetctrl.create({
      header:margin.description,
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Annuler',role:'cancel'},
        {text:'Infos',handler:()=> {
            this.InfosMargin(margin);
        },},
        {text:'Modifier',handler:()=> {
            this.editMargin(margin);
        },},
        {text:'Supprimer',handler:()=> {
            this.deletemargin(margin);
        },}
      ]
    });
    (await menu).present();
  }

  async deletemargin(margin:MarginsSettings){
    const alert = await this.appserv.alertctrl.create({
      header:"Suppression",
      subHeader:margin.description,
      mode:'ios',
      translucent:true,
      message:"Voulez-vous vraiment supprimer cette marge?",
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=> {
            this.showprogress=true;
            this.marginSetServ.delete(margin).subscribe(
              data=>{
                this.showprogress=false;
                if (data.message==='deleted') {
                  this.listmargins=this.listmargins.filter(m=>m!==margin);
                  this.appserv.presentToast("Marge supprimée avec succès",'success');
                }else{
                  this.appserv.presentToast("Impossible de supprimer la marge. Veuillez réssayer.",'warning');
                }
              },error=>{
                this.appserv.presentToast('Erreur survenue lors de la suppression de la marge','danger');
              }
            )
        },}
      ]
    });
    alert.present();
  }

  async editMargin(margin:MarginsSettings){
    const modal = await this.appserv.modalCtrl.create({
      component:NewmarginexpenditureComponent,
      componentProps:{'marginSent':margin},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role === 'updated') {
      //console.log('updated',data);
    }
  } 
  
  async InfosMargin(margin:MarginsSettings){
    const modal = await this.appserv.modalCtrl.create({
      component:InfosmaginexpendituresComponent,
      componentProps:{'marginSent':margin},
      cssClass:"modal-border-radius-20"
    });
    modal.present();  
  }
}
