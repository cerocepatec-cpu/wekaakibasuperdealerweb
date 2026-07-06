import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CategoriesArticle } from '../../interfaces/cagoriesarticles';
import { AppservicesService } from '../../services/appservices.service';
import { CategoryserviceService } from 'src/app/services/categoryservice.service';

@Component({
  selector: 'app-editservicecategory',
  templateUrl: './editservicecategory.component.html',
  styleUrls: ['./editservicecategory.component.scss'],
})
export class EditservicecategoryComponent implements OnInit {
  actualuser:any;
  @Input() categorysent:CategoriesArticle={};

  showcreatingprogress=false;
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

  async syncingdata(){
    this.newcategoryform.patchValue({
      parent_id:this.categorysent.category.parent_id,
      name:this.categorysent.category.name,
      user_id:this.categorysent.category.user_id,
      enterprise_id:this.categorysent.category.enterprise_id,
      description:this.categorysent.category.description,
      type_conservation:this.categorysent.category.type_conservation,
      has_vat:this.categorysent.category.has_Vat
    });
  }
  constructor(private formbuild:FormBuilder, private appserv:AppservicesService, private categarticleserv:CategoryserviceService) { }

  ngOnInit() {
    this.syncingdata();
    this.actualuser=this.appserv.getactualuser();
    this.getlistcategories();
  }

  async closemodal(){
    this.appserv.modalCtrl.dismiss();
  }
  async getlistcategories(){
    this.categarticleserv.getallcategoriesarticles(this.actualuser.enterprise_id).subscribe(
      data=>{
          this.listcategories=data;
      },
      error=>{
        this.appserv.presentToast(`Erreur lors du chargement de la liste categories`,`danger`);
      }
    );
  }

  editcategory(){

    this.categarticleserv.updatecatgoryarticle(this.newcategoryform.value,this.categorysent.category.id).subscribe(
      (data: any)=>{
        this.categorysent.category.id=data.category.id;
        this.categorysent.category.name=data.category.name;
        this.categorysent.category.user_id=data.category.user_id;
        this.categorysent.category.enterprise_id=data.category.enterprise_id;
        this.categorysent.category.description=data.category.description;
        this.categorysent.category.type_conservation=data.category.type_conservation;
        this.categorysent.category.has_Vat=data.category.has_Vat;
        this.appserv.presentToast(`Catégorie modifiée avec succès`,'success');
        this.appserv.modalCtrl.dismiss(data,'edited');
      },
      error=>{
        this.appserv.presentToast(`Erreur lors de la mise à jour!`)
      }
    );
  }

}
