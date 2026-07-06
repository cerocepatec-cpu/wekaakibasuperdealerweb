import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { FormBuilder } from '@angular/forms';
import { CategoriesArticle } from 'src/app/interfaces/cagoriesarticles';
import { Users } from '../../interfaces/users';
import { CustomersService } from 'src/app/services/customers.service';
import { CategoryCustomers } from 'src/app/interfaces/categoriecustomers';
import { EditcategoryComponent } from 'src/app/customers/editcategory/editcategory.component';

@Component({
  selector: 'app-customerscategories',
  templateUrl: './customerscategories.component.html',
  styleUrls: ['./customerscategories.component.scss'],
})
export class CustomerscategoriesComponent implements OnInit {
  @Input() listcategories:CategoriesArticle[]=[];
  actualuser:Users=this.appserv.getactualuser();

  newcategoryform=this.formbuild.group({
    parent_id:[],
    name: [],
    user_id:[1],
    description:[],
    type_conservation:[],
    has_vat:[],
    enterprise_id:[0]
  });

  showcreatingprogress=false;
  showlistgroup=false;

  constructor(public appserv : AppservicesService, private formbuild: FormBuilder, private customerserv: CustomersService) { }

  ngOnInit() {}

  closemodal(){
    this.appserv.closemodal();
  }

  addnewcategory(){
    if(this.newcategoryform.get('name')?.value){
      this.showcreatingprogress=true;
      this.newcategoryform.patchValue({
        enterprise_id:this.actualuser.enterprise_id,
        user_id:this.actualuser.id
      });
      this.customerserv.addnewcategoryapi(this.newcategoryform.value).subscribe(
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

  async menucategory(categ: CategoryCustomers){

    const menu = await this.appserv.actionsheetctrl.create(
      {
        header: `${categ.name}`,
        cssClass: 'myactionsheet',
        translucent: true,
        mode: 'ios',
        buttons:[
          {
            text: 'Annuler',
          role:'cancel'
          },
         {
            text: 'Modifier',
            handler: () => {
              this.editcategory(categ);
            }
          }, {
            text: 'Supprimer',
            handler: () => {
              this.deletecategory(categ);
            }
          }
        ]
      }
    );

    (await menu).present(); 
  }

  async editcategory(categ: CategoryCustomers){
    const modal = await this.appserv.modalCtrl.create({
      component:EditcategoryComponent,
      componentProps:{'categorysent':categ}
    });
    modal.present();

    const {data,role} = await modal.onWillDismiss();
    if(role=='edited'){
      // categ=data;
    }
  }

  async deletecategory(categ: CategoryCustomers){
    this.showcreatingprogress=true;
    this.customerserv.deletecategory(categ.id).subscribe(
      data=>{
        this.showcreatingprogress=false;
        this.listcategories=this.listcategories.filter(c=>c!=categ);
        this.appserv.presentToast('Catégorie supprimée avec succès','success');
        this.appserv.modalCtrl.dismiss(categ,'deleted');
      },error=>{
        this.showcreatingprogress=false;
        this.appserv.presentToast('Impossible de supprimer la catégorie','danger');
      }
    );
  }

 }
