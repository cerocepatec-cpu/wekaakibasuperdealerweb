import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { FormBuilder } from '@angular/forms';
import { CategoryCustomers } from 'src/app/interfaces/categoriecustomers';
import { Users } from 'src/app/interfaces/users';
import { CustomersService } from 'src/app/services/customers.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-addnewcustomer',
  templateUrl: './addnewcustomer.component.html',
  styleUrls: ['./addnewcustomer.component.scss'],
})
export class AddnewcustomerComponent implements OnInit {
@ViewChild('defaultinput') defaultinput:IonInput;
@Input() type:string='';
@Input() search:string='';
@Input() listcategories:CategoryCustomers[]=[];
showprogress=false;
typesent='';
actualuser: Users={};
actualCategory:CategoryCustomers={};
  newcustomer=this.formbuild.group({
    id: [],
    pos_id : [],
    created_by_id: [],
    category_id: [],
    customerName: [],
    marital_status: [],
    other_contact: [],
    adress: [],
    phone: [],
    mail: [],
    employer: [],
    type: [''],
    sex: [],
    created_at: [],
    updated_at: [],
    enterprise_id:[0],
    employer_name: [],
    pos_name: [],
    category_name: [],
    uuid:[]
  });
  constructor(private customerserv:CustomersService,private appserv: AppservicesService, private formbuild: FormBuilder) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
   
      this.newcustomer.patchValue({
        enterprise_id:this.appserv.actualEse.id,
        created_by_id:this.appserv.actualUser.id,
        type:'physique',
        customerName:this.search?this.search:''
      });
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }
  editType(type: string){
    this.newcustomer.patchValue({
      type:type
    });
  }
  
  addnew(){
    if (this.appserv.isMyDeviceConnected()) {
      if (this.newcustomer.getRawValue().customerName) {
        this.showprogress=true;
        this.customerserv.addnewcustomer(this.newcustomer.value).subscribe(
          data=>{
            console.log('customer from api',data);
            this.showprogress=false;
            if (data.id) {
               this.appserv.modalCtrl.dismiss(data,'added');
            } 
            
            if (data.message && data.message==='duplicated') {
              this.appserv.presentToast("Le client existe déjà!","warning");
            }
            // this.customerserv.addtoCustomersOffline(data);
          },
          error=>{
            this.showprogress=false;
            this.appserv.presentToast("Une erreur est survenue lors de l'enregistrement du client","danger");
          });
      }else{
        this.appserv.presentToast("Entrer le nom du client svp!","warning");
      }
     
    }else{
          /**
           * Add to Offline data
           */
          let customer ={
            id: 0,
            pos_id:0,
            created_by_id: this.appserv.actualUser.id,
            category_id:this.newcustomer.getRawValue().category_id,
            customerName:this.newcustomer.getRawValue().customerName,
            marital_status:this.newcustomer.getRawValue().marital_status,
            other_contact: this.newcustomer.getRawValue().other_contact,
            adress:this.newcustomer.getRawValue().adress,
            phone:this.newcustomer.getRawValue().phone,
            mail:this.newcustomer.getRawValue().mail,
            employer:this.newcustomer.getRawValue().employer,
            type: this.newcustomer.getRawValue().type,
            sex:this.newcustomer.getRawValue().sex,
            enterprise_id:this.appserv.getactualEse().id,
            created_at:this.appserv.today,
            updated_at: this.appserv.today,
            employer_name:this.newcustomer.getRawValue().employer_name,
            pos_name:'',
            category_name:this.actualCategory.id,
            uuid:this.appserv.getUUID('C'),
            totalbonus:0,
            totalpoints:0,
            totalcautions:0
        };
        this.customerserv.addtoCustomersOffline(customer);
        this.customerserv.addtoSyncingOffline(customer);
        this.appserv.modalCtrl.dismiss(customer,'added');
    }
    this.newcustomer.patchValue({
      enterprise_id:this.actualuser.enterprise_id
    }); 
  }

  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }

}
