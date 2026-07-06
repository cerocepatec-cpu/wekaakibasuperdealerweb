import { Component, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { FormBuilder } from '@angular/forms';
import { CategoriesArticle } from 'src/app/interfaces/cagoriesarticles';
import { EditservicecategoryComponent } from '../editservicecategory/editservicecategory.component';
import { CategoryserviceService } from '../../services/categoryservice.service';

@Component({
  selector: 'app-servicescategories',
  templateUrl: './servicescategories.component.html',
  styleUrls: ['./servicescategories.component.scss'],
})
export class ServicescategoriesComponent implements OnInit {
  actualuser:any;
  listcategories:CategoriesArticle[]=[];

  newcategoryform=this.formbuild.group({
    parent_id:[],
    name: [],
    user_id:[],
    enterprise_id:[],
    description:[],
    type_conservation:[],
    has_vat:[]
  });

  servicename='article';
  showcreatingprogress=false;
  showlistgroup=false;

  constructor(public appserv : AppservicesService, private formbuild: FormBuilder, private categserv: CategoryserviceService) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    this.getlistcategories();
  }

  closemodal(){
    this.appserv.closemodal();
  }

  async gotoedit(categ: CategoriesArticle){

      const modal = this.appserv.modalCtrl.create({
        component:EditservicecategoryComponent,
        componentProps:{'categorysent':categ}
      });
      (await modal).present();
  }

  async deletecategory(category: CategoriesArticle){

  }

  addnewcategory(){
    if(this.newcategoryform.get('name')?.value){
      this.showcreatingprogress=true;

      this.newcategoryform.patchValue({
        enterprise_id:this.actualuser.enterprise_id,
        user_id:this.actualuser.id
      });

      this.categserv.addnewcategoryapi(this.newcategoryform.value).subscribe(
        data=>{
          this.showcreatingprogress=false;
          this.appserv.presentToast(`Catégorie ajoutée avec succès`,'success');
         this.listcategories.push(data);
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
    this.categserv.getallcategoriesarticles(this.actualuser.enterprise_id).subscribe(
      data=>{
          this.listcategories=data;
      },
      error=>{
        this.appserv.presentToast(`Erreur lors du chargement de la liste categories`,`danger`);
      }
    );
  }
}
