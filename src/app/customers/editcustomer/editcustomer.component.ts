import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { CustomersService } from 'src/app/services/customers.service';
import { Customers } from '../../interfaces/customers';
import { CategoryCustomers } from 'src/app/interfaces/categoriecustomers';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-editcustomer',
  templateUrl: './editcustomer.component.html',
  styleUrls: ['./editcustomer.component.scss'],
})
export class EditcustomerComponent implements OnInit {
  @Input() customersent : Customers={}
  showprogress=false;
  listcategories:CategoryCustomers[]=[];

  newcustomer=this.formbuild.group({
    id: [0],
    pos_id : [0],
    created_by_id: [0],
    category_id: [0],
    customerName: [''],
    marital_status: [''],
    other_contact: [''],
    adress: [''],
    phone: [''],
    mail: [''],
    employer: [0],
    type: [''],
    sex: [''],
    created_at: [''],
    updated_at: [''],
    enterprise_id:[0],
    employer_name: [''],
    pos_name: [''],
    category_name: [''],
  });

  constructor(public formbuild:FormBuilder,public appserv:AppservicesService,public customerserv:CustomersService) { }

ngOnInit() {
  this.sycingdata();
  this.getlistcategories();
}

async getlistcategories(){
  this.customerserv.getlistcustomerscategories(this.appserv.getactualuser().enterprise_id).subscribe(
    data=>{
      this.listcategories=data;
    },
    error=>{
      //console.log('erreur lors de loading list customers categories');
    }
  )
}

sycingdata(){
  this.newcustomer.patchValue({
    id:this.customersent.id,
    pos_id :this.customersent.pos_id,
    created_by_id:this.customersent.created_by_id,
    category_id:this.customersent.category_id,
    customerName:this.customersent.customerName,
    marital_status:this.customersent.marital_status,
    other_contact:this.customersent.other_contact,
    adress:this.customersent.adress,
    phone:this.customersent.phone,
    mail:this.customersent.mail,
    employer:this.customersent.employer,
    type:this.customersent.type,
    sex:this.customersent.sex,
    created_at:this.customersent.created_at,
    updated_at:this.customersent.updated_at,
    enterprise_id:this.customersent.enterprise_id,
    employer_name:this.customersent.employer_name,
    pos_name:this.customersent.pos_name,
    category_name:this.customersent.category_name
  });
}

  editType(type: string){
    this.newcustomer.patchValue({
      type:type
    });
  }
  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }

  editcustomer(){
    this.showprogress=true;
    this.customerserv.updatecustomer(this.newcustomer.value).subscribe(
      (data:Customers)=>{
        this.showprogress=false;
        this.customersent.category_id=data.category_id;
        this.customersent.customerName=data.customerName;
        this.customersent.marital_status=data.marital_status;
        this.customersent.other_contact=data.other_contact;
        this.customersent.adress=data.adress;
        this.customersent.phone=data.phone;
        this.customersent.mail=data.mail;
        this.customersent.employer=data.employer;
        this.customersent.type=data.type;
        this.customersent.sex=data.sex;
        this.customersent.updated_at=data.updated_at;
        this.customersent.employer_name=data.employer_name;
        this.customersent.pos_name=data.pos_name;
        this.customersent.category_name=data.category_name;
        this.appserv.modalCtrl.dismiss(this.customersent,'edited');
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de mettre à jour les données du client`,'danger');
      }
    );
  }

}
