import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { CategoriesArticle } from 'src/app/interfaces/cagoriesarticles';
import { AppservicesService } from 'src/app/services/appservices.service';
import { DepositsService } from 'src/app/services/deposits.service';
import { CategoriepickerComponent } from 'src/app/articles/categoriepicker/categoriepicker.component';

@Component({
  selector: 'app-newdeposit',
  templateUrl: './newdeposit.component.html',
  styleUrls: ['./newdeposit.component.scss'],
})
export class NewdepositComponent implements OnInit {
showprogress=false;
selectedcategories:CategoriesArticle[]=[];
newdeposit=this.fb.group({
  name:['',Validators.required],
  description:[''],
  type:['group'],
  categories:this.fb.array([]),
  user_id:[0,Validators.required],
  enterprise_id:[0,Validators.required]
});

  constructor(public appserv: AppservicesService, private depositserv: DepositsService, private fb: FormBuilder) { }

  ngOnInit() {
    this.newdeposit.patchValue({
      user_id:this.appserv.getactualuser().id,
      enterprise_id:this.appserv.getactualuser().enterprise_id
    });
  }
get categories(){
  return this.newdeposit.get('categories') as FormArray;
}

addcategory(data:any){
  this.categories.push(this.fb.control(data));
}

removetocategory(data:any){
  this.categories.removeAt(data);
}

  deletecategory(categ:CategoriesArticle){
    this.selectedcategories=this.selectedcategories.filter(cat=>cat!=categ);
  }

  changetype(criteria: string){
    this.newdeposit.patchValue({
      type:criteria
    });

    if(criteria=='category'){
      this.categoriespicker();
    }
  }

  validate(){
    // console.log(this.newdeposit);
    this.showprogress=true;
    this.depositserv.new(this.newdeposit.value).subscribe(
      data=>{
        this.showprogress=false;
        this.depositserv.addToOffline(data);
        this.appserv.presentToast(`Dépôt ajouté avec succès`,'success');
        this.appserv.modalCtrl.dismiss(data,'added');
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Une erreur est survenue lors de l'ajout du dépôt`,'danger');
      }
    );
  }

  async categoriespicker(){

    const modal = await this.appserv.modalCtrl.create({
      component:CategoriepickerComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      this.selectedcategories=data;
      data.forEach((categ:any) => {
        const object ={id:categ.category.id};
          this.addcategory(object);
      });
    }
  }
}
