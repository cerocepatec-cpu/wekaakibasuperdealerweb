import { ArticlesService } from 'src/app/services/articles.service';
import { Articles } from './../../interfaces/articles';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { Deposits } from 'src/app/interfaces/deposit';
import { DepositsService } from 'src/app/services/deposits.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-stockvalorisation',
  templateUrl: './stockvalorisation.component.html',
  styleUrls: ['./stockvalorisation.component.scss'],
})
export class StockvalorisationComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput! : IonInput;
  @Input() depositsent: Deposits={};
  showprogress=false;
  inventory: any []=[];
  totalgeneral=0;
  search:any;

  constructor(public appserv: AppservicesService, private depositserv: DepositsService) { }
  ngOnInit() {
    this.getlistarticles();
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }
  totalgenerate(){
    this.totalgeneral=0;
    this.inventory.forEach(article => {
      this.totalgeneral +=article.prices[0].price * article.service.available_qte;
    });
  }

  getlistarticles(){
    this.showprogress=true;
    this.depositserv.articlesdepositpaginate(this.depositsent.id).subscribe(
      async datadeposit=>{
        this.inventory=datadeposit.data;
        if (datadeposit.next_page_url) {
            this.showprogress=true;
          try{
            const url = `${datadeposit.next_page_url}`;
            this.inventory=datadeposit.data.concat( await this.getnexpagesdepositartlces(url));
            this.totalgenerate();
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
      
      this.totalgenerate();
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

}
