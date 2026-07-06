import { ArticlesService } from 'src/app/services/articles.service';
import { Articles } from './../../interfaces/articles';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { Deposits } from 'src/app/interfaces/deposit';
import { DepositsService } from 'src/app/services/deposits.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-inventorydeposit',
  templateUrl: './inventorydeposit.component.html',
  styleUrls: ['./inventorydeposit.component.scss'],
})
export class InventorydepositComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!: IonInput;
  @Input() depositsent: Deposits={};
  showprogress=false;
  inventory: Articles []=[];
  search:any;
  constructor(public appserv: AppservicesService, private depositserv: DepositsService, private depositServ: DepositsService) { }

  ngOnInit() {
    this.getlistarticles();
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }
  
  getlistarticles(){
    this.showprogress=true;
    this.depositserv.articlesdepositpaginate(this.depositsent.id).subscribe(
      async datadeposit=>{
        console.log(datadeposit);
        this.inventory=datadeposit.data;
        if (datadeposit.next_page_url) {
            this.showprogress=true;
          try{
            const url = `${datadeposit.next_page_url}`;
            this.inventory=datadeposit.data.concat( await this.getnexpagesdepositartlces(url));
          }catch(err){
            console.error(err.message);
          }
        }else{
          this.inventory=datadeposit.data;
          this.showprogress=false;
        }
      },
      error=>{
        this.appserv.presentToast("Nous avons connu un problème en voulant récupérer les produits du dépôt " + this.depositsent.name,"warning");
      });
   }

   getnexpagesdepositartlces = async (url: string) =>{
    let response = await fetch(`${url}`);
    let responseData = await response.json();
    let services =responseData.data;
 
    if (responseData.next_page_url) {
      return services.concat(await this.getnexpagesdepositartlces (responseData.next_page_url));
    }else{
      this.showprogress=false;
      return services;
    }
  }

  async resetdeposit(){
    const alert = this.appserv.alertctrl.create({
      header:"Réinitialiser dépôt",
      subHeader:this.depositsent.name,
      mode:'ios',
      message:"Voulez-vous vraiment réinitialiser ce dépôt? Il est à noter que cette action va remettre tout votre inventaire à Zéro pour ce dépôt et que cette action est irreversible une fois passée.",
      translucent:true,
      buttons:[
        {text:'Non',cssClass:'cancel-button',role:'cancel'},
        {text:'Oui',cssClass:'yes-button',handler:()=>{
          this.reset();
        }}
      ]});
    (await alert).present();
  }

  async reset(){
    const load = await this.appserv.loadctrl.create({
      message:"Réinitialisation en cours... Cette action peut prendre plusieurs minutes.",
      mode:"ios",
      translucent:true
    });

    load.present();
    this.depositServ.resetDeposit({user_id:this.appserv.actualUser.id,deposit_id:this.depositsent.id,motif:""}).subscribe(
      data=>{
        load.dismiss();
        if(data.updated>0){
          this.appserv.presentToast(`${data.updated} sur ${data.all} réinitialisés.`,'success');
          this.ngOnInit();
        }
      },error=>{
        load.dismiss();
        this.appserv.presentToast("Une erreur est survenue. Opération non terminée","warning");
      });
  }
}
