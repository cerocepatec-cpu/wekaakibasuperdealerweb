import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { CategoriesArticle } from 'src/app/interfaces/cagoriesarticles';
import { AppservicesService } from 'src/app/services/appservices.service';
import { DepositsService } from 'src/app/services/deposits.service';
import { CategoriepickerComponent } from 'src/app/articles/categoriepicker/categoriepicker.component';
import { Deposits } from 'src/app/interfaces/deposit';

@Component({
  selector: 'app-editposit',
  templateUrl: './editposit.component.html',
  styleUrls: ['./editposit.component.scss'],
})
export class EditpositComponent implements OnInit {
  @Input() depositsent: Deposits={};
  showprogress=false;
  selectedcategories:CategoriesArticle[]=[];
  newdeposit=this.fb.group({
    id:[0],
    name:['',Validators.required],
    description:[''],
    type:[''],
    categories:this.fb.array([]),
    withdrawing_method:['']
  });

    constructor(public appserv: AppservicesService, private depositserv: DepositsService, private fb: FormBuilder) { }

    ngOnInit() {
     this.sycingdata();
    }

    sycingdata(){
      this.newdeposit.patchValue({
        id:this.depositsent.id,
        name:this.depositsent.name,
        description:this.depositsent.description,
        type:this.depositsent.type,
        withdrawing_method:this.depositsent.withdrawing_method
      });

      //console.log('sent',this.depositsent);
      //console.log('transformed',this.newdeposit.value);
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
      this.showprogress=true;
      this.depositserv.update(this.newdeposit.value).subscribe(
        data=>{
          //console.log(data);
          this.showprogress=false;
          this.appserv.presentToast(`Dépôt modifié avec succès`,'success');
          this.appserv.modalCtrl.dismiss(data,'edited');
        },error=>{
          this.showprogress=false;
          this.appserv.presentToast(`Une erreur est survenue lors de la modification du dépôt`,'danger');
        }
      );
    }

    async categoriespicker(){

      const modal = await this.appserv.modalCtrl.create({
        component:CategoriepickerComponent
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
