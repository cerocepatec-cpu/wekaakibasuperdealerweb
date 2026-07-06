import { Component, OnInit, Input } from '@angular/core';
import { Articles } from '../../interfaces/articles';
import { AppservicesService } from '../../services/appservices.service';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-selectanarticle',
  templateUrl: './selectanarticle.component.html',
  styleUrls: ['./selectanarticle.component.scss'],
})
export class SelectanarticleComponent implements OnInit {
@Input() listarticles: any[]=[];
@Input() multiselect: any;

result :any[]=[];
search :any;
showdefaultprogress=false;
selectedarticles: Articles[]=[];

constructor(public appserv: AppservicesService, private articleserv:ArticlesService) { }

  ngOnInit() {
    if(!this.listarticles){
      this.getarticleslist();
    }
  }

  async selected(article: Articles){
    const ifexists=this.selectedarticles.indexOf(article);
    if(ifexists==-1){
      this.selectedarticles.push(article);
      article.selected=true;
    }else{
      this.selectedarticles=this.selectedarticles.filter(a=>a!=article);
      article.selected=false;
    }
  }

  async sendselected(){
    this.appserv.modalCtrl.dismiss(this.selectedarticles,'added');
  }

  getarticleslist(){
    this.showdefaultprogress=true;
    this.articleserv.enterpriseservices(this.appserv.getactualEse().id).subscribe(
      data=>{
        this.showdefaultprogress=false;
        this.listarticles=data;
      },
      error=>{
        this.showdefaultprogress=false;
        this.appserv.presentToast('Nous utilisons vos données hors ligne.','primary');
        //taking for local storage
          this.listarticles =this.articleserv.getOfflineData();
      }
    );
  }
}
