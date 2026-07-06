import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Articles } from '../../interfaces/articles';
import { AppservicesService } from '../../services/appservices.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { DepositsService } from 'src/app/services/deposits.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-pickservices',
  templateUrl: './pickservices.component.html',
  styleUrls: ['./pickservices.component.scss'],
})
export class PickservicesComponent implements OnInit {
  @Input() single: boolean;
  @Input() sentlistarticles: Articles[]=[];
  @ViewChild('inputsearch') SearchInput! : IonInput;
  allarticles: Articles[]=[];
  selectedarticles: Articles[]=[];
  showprogress=false;
  showcheckbox=false;
  search : any;

  constructor(public appserv: AppservicesService, private articleserv:ArticlesService, private depositserv: DepositsService) { }
  
    ngOnInit() {
  
    }

    ionViewDidEnter(){
      this.SearchInput.setFocus();
    }
  
    lookuparticles(){
      if (this.SearchInput.value) {
        if (this.appserv.isMyDeviceConnected()) {
          this.showprogress=true;
          this.articleserv.searchbyword({enterprise_id:this.appserv.actualEse.id,word:this.SearchInput.value,type:"stock"}).subscribe(
            data=>{
              this.showprogress=false;
              this.allarticles=data;
            },
            error=>{
              this.showprogress=false;
              this.appserv.presentToast('Impossible de charger la liste des produits','danger');
            });
        }else{
          this.allarticles=this.articleserv.getoffarticlesbykeywords(String(this.SearchInput.value));
        }
      
      }else{
        this.allarticles=[];
      }
    }

    async selected(article: Articles){
      if (this.single) {
        article.done_at=this.appserv.defaultdate();
        this.appserv.modalCtrl.dismiss(article,'selected');
      }else{
        const ifexists=this.selectedarticles.indexOf(article);
        if(ifexists==-1){
          article.done_at=this.appserv.defaultdate();
          this.selectedarticles.push(article);
          article.selected=true;
        }else{
          this.selectedarticles=this.selectedarticles.filter(a=>a!=article);
          article.selected=false;
        }
      }
      
      this.SearchInput.setFocus();
    }
  
    async sendselected(){
      this.appserv.modalCtrl.dismiss(this.selectedarticles,'added');
    }

}
