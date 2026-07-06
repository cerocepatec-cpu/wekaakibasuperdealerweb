import { Component, OnInit,Input } from '@angular/core';
import { CategoriesArticle } from 'src/app/interfaces/cagoriesarticles';
import { AppservicesService } from '../../services/appservices.service';
import { FormBuilder } from '@angular/forms';
import { Users } from '../../interfaces/users';
import { EditservicecategoryComponent } from '../editservicecategory/editservicecategory.component';
import { CategoryserviceService } from 'src/app/services/categoryservice.service';

@Component({
  selector: 'app-newcategory',
  templateUrl: './newcategory.component.html',
  styleUrls: ['./newcategory.component.scss'],
})
export class NewcategoryComponent implements OnInit {
@Input()  listcategories: CategoriesArticle[]=[];
actualuser:Users={};
  newcategoryform=this.formbuild.group({
    parent_id:[],
    name: [],
    user_id:[1],
    description:[],
    type_conservation:[],
    has_vat:[],
    enterprise_id:[0]
  });
  servicename='article';
  showcreatingprogress=false;
  showlistgroup=false;

  constructor(private appserv : AppservicesService, private formbuild: FormBuilder, private categserv:CategoryserviceService) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
  }

  closemodal(){
    this.appserv.closemodal();
  }

  addnewcategory(){
    if(this.newcategoryform.get('name')?.value){
      this.showcreatingprogress=true;
      this.newcategoryform.patchValue({
        enterprise_id:this.actualuser.enterprise_id
      });
      this.categserv.addnewcategoryapi(this.newcategoryform.value).subscribe(
        data=>{
          this.showcreatingprogress=false;
          this.appserv.presentToast(`Catégorie ajoutée avec succès`,'success');
          this.appserv.modalCtrl.dismiss(data,'added');
          this.categserv.savecatgoryoffline(data);
        },
        error=>{
          this.showcreatingprogress=false;
          this.appserv.presentToast(`Enregistrement hors ligne`,'primary');
          const object ={
              category: {
                  id:this.categserv.getofflinecategories().length+1,
                  parent_id:this.newcategoryform.getRawValue().parent_id,
                  name:this.newcategoryform.getRawValue().name,
                  user_id: this.newcategoryform.getRawValue().user_id,
                  description:this.newcategoryform.getRawValue().description,
                  type_conservation:this.newcategoryform.getRawValue().type_conservation,
                  has_vat:this.newcategoryform.getRawValue().has_vat,
                  enterprise_id:this.newcategoryform.getRawValue().enterprise_id,
                  created_at:Date(),
                  updated_at:Date(),
                  sync_status:'0'
              },
              subcategories: []
          };
          this.categserv.savecatgoryoffline(object);
          this.appserv.modalCtrl.dismiss(object,'added');
        }
      );
    }else{
      this.appserv.presentToast(`Veuillez entrer le nom svp!`,'warning');
    }
  }

  async gotoedit(categ: CategoriesArticle){
    const modal = await this.appserv.modalCtrl.create({
      component:EditservicecategoryComponent,
      componentProps:{'categorysent':categ}
    });
    modal.present();
  }
}
