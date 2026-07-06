import { Component, OnInit } from '@angular/core';
import { CategoriesArticle } from 'src/app/interfaces/cagoriesarticles';
import { AppservicesService } from 'src/app/services/appservices.service';
import { NewcategoryComponent } from '../newcategory/newcategory.component';
import { CategoryserviceService } from 'src/app/services/categoryservice.service';
@Component({
  selector: 'app-categoriepicker',
  templateUrl: './categoriepicker.component.html',
  styleUrls: ['./categoriepicker.component.scss'],
})
export class CategoriepickerComponent implements OnInit {
  listcategories:CategoriesArticle[]=[];
  listselectedcategories: CategoriesArticle[]=[];
  showprogress=false;
  constructor(public appserv: AppservicesService, private categserv:CategoryserviceService) { }

  ngOnInit() {
    this.getlistcategories();
  }

  getlistcategories(){
    this.categserv.getallcategoriesarticles(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.listcategories=data;
      },error=>{
        this.appserv.presentToast(`Erreur lors de la recupération des catégories. Veuillez vérifier`,'danger');
      }
    );
  }

  valide(){

    if(this.listselectedcategories.length>0){
      this.appserv.modalCtrl.dismiss(this.listselectedcategories,'selected');
    }else{
      this.appserv.presentToast(`Veuillez sélectionner au moins une catégorie.`,'warning');
    }
  }

  async addnewcategorie(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewcategoryComponent,
      cssClass:'modal-border-radius-20'
    });
    (await modal).present();
    const {data,role}= await modal.onWillDismiss();
    if(role=='added'){
      this.listcategories.unshift(data);
      this.listselectedcategories.unshift(data);
      data.selected=true;
    }
  }

  selected(categ: CategoriesArticle){
   
    const ifexists = this.listselectedcategories.indexOf(categ);
    if(ifexists==-1){
      categ.selected=true;
      this.listselectedcategories.push(categ);
    }else{
      this.listselectedcategories=this.listselectedcategories.filter(r=>r!=categ);
      categ.selected=false;
    }
  }
}
