import { Component, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { FormBuilder } from '@angular/forms';
import { CategoriesArticle } from 'src/app/interfaces/cagoriesarticles';

@Component({
  selector: 'app-customerscategories',
  templateUrl: './customerscategories.component.html',
  styleUrls: ['./customerscategories.component.scss'],
})
export class CustomerscategoriesComponent implements OnInit {
  listcategories:CategoriesArticle[]=[];

  newcategoryform=this.formbuild.group({
    parent_id:[],
    name: [],
    user_id:[1],
    description:[],
    type_conservation:[],
    has_vat:[]
  });

  servicename='article';
  showcreatingprogress=false;
  showlistgroup=false;

  constructor(private appserv : AppservicesService, private formbuild: FormBuilder) { }

  ngOnInit() {}

  closemodal(){
    this.appserv.closemodal();
    this.getlistcategories();
  }

  addnewcategory(){
    if(this.newcategoryform.get('name')?.value){
      this.showcreatingprogress=true;
      this.appserv.addnewcategoryapi(this.newcategoryform.value).subscribe(
        data=>{
          this.showcreatingprogress=false;
          this.appserv.presentToast(`Catégorie ajoutée avec succès`,'success');
          this.appserv.modalCtrl.dismiss(data,'added');
        },
        error=>{
          this.showcreatingprogress=false;
          this.appserv.presentToast(`Erreur survenue lors de l'insertion`,'danger');
        }
      );
    }else{
      this.appserv.presentToast(`Veuillez entrer le nom svp!`,'warning');
    }
  }

  async getlistcategories(){
    
  }

}
