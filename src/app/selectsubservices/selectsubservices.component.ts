import { Component, OnInit,ViewChild } from '@angular/core';
import { ArticlesService } from '../services/articles.service';
import { AppservicesService } from '../services/appservices.service';
import { IonInput } from '@ionic/angular';
import { Articles } from '../interfaces/articles';

@Component({
  selector: 'app-selectsubservices',
  templateUrl: './selectsubservices.component.html',
  styleUrls: ['./selectsubservices.component.scss'],
})
export class SelectsubservicesComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!: IonInput;
  listarticles: Articles[]=[];
  listselected=[];
  keyword:any;
  constructor(private articleserv: ArticlesService, public appserv:AppservicesService) { }

  ngOnInit() {
    this.getlistsubservices();
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }

  validation(){
    this.appserv.modalCtrl.dismiss(this.listselected,"selected");
  }

  selectitem(article:Articles,$event){
    console.log($event);
  }
  selected(article){
    const index = this.listselected.indexOf(article);
    if (index===-1) {
      this.listselected.unshift(article);
      article.selected=true;
    }else{
     this.listselected =this.listselected.filter(a=>a!==article);
     article.selected=false;
    }
  }
  getlistsubservices(){
    this.articleserv.enterprise_sub_services(this.appserv.actualEse.id).subscribe(
      response=>{
        console.log(response);
        this.listarticles=response;
      },
      error=>{
        console.log(error);
        this.appserv.presentToast("Erreur survenue. Veuillez réessayer","waring");
      });
  }
}
