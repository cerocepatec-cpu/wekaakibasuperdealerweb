import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { CategoryCustomers } from '../../interfaces/categoriecustomers';
import { FormBuilder } from '@angular/forms';
import { CustomersService } from '../../services/customers.service';

@Component({
  selector: 'app-editcategory',
  templateUrl: './editcategory.component.html',
  styleUrls: ['./editcategory.component.scss'],
})
export class EditcategoryComponent implements OnInit {
@Input() categorysent: CategoryCustomers={};
@Input() listcategories: CategoryCustomers[]=[];

showcreatingprogress=false;

  newcategoryform=this.formbuild.group({
    parent_id:[0],
    name: [''],
    user_id:[1],
    description:[''],
    discount_applicable:[false]
  });

  constructor(public appserv: AppservicesService, private formbuild: FormBuilder, public customerserv: CustomersService) { }

  ngOnInit() {
    this.sycingdata();
  }

  sycingdata(){
    this.newcategoryform.patchValue({
      parent_id:this.categorysent.parent_id,
      name:this.categorysent.name,
      user_id:this.categorysent.user_id,
      description:this.categorysent.description,
      discount_applicable:this.categorysent.discount_applicable
    })
  }
  async editcategory(){
    this.showcreatingprogress=true;
    this.customerserv.updatecategory(this.newcategoryform.value,this.categorysent.id).subscribe(
      (data:CategoryCustomers)=>{
        this.showcreatingprogress=false;
        this.categorysent.parent_id=data.parent_id;
        this.categorysent.name=data.name;
        this.categorysent.user_id=data.user_id;
        this.categorysent.description=data.description;
        this.categorysent.discount_applicable=data.discount_applicable;
        this.appserv.presentToast(`Catégorie modifiée avec succès`,'success');
        this.appserv.modalCtrl.dismiss(this.categorysent,'edited');
      },
      error=>{
        this.showcreatingprogress=false;
        this.appserv.presentToast(`Impossible de modifier la catégorie`,'danger');
      }
    )
  }
}
