import { Component, OnInit,Input } from '@angular/core';
import { Articles } from '../interfaces/articles';
import { AppservicesService } from '../services/appservices.service';
import { ArticlesService } from '../services/articles.service';
import { CustomerpickersComponent } from '../articles/customerpickers/customerpickers.component';
import { Customers } from '../interfaces/customers';
import { FormBuilder, Validators } from '@angular/forms';
import { PricesCategories } from '../interfaces/pricescategories';
import { CustomersService } from '../services/customers.service';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-newreservation',
  templateUrl: './newreservation.component.html',
  styleUrls: ['./newreservation.component.scss'],
})
export class NewreservationComponent implements OnInit {
showprogress=false;
@Input() article: Articles={};
showvalidation=false;
from:any;
to:any;
actualcustomer:Customers={};
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
  category_name: ['']
});

newreservation = this.formbuild.group({
  service_id:[0,Validators.required],
  from:['',Validators.required],
  to:['',Validators.required],
  price:[0,Validators.required],
  note:[],
  status:[],
  user_id:[],
  customer_id:[0,Validators.required],
  enterprise_id:[],
  done_at:[],
  caution:[0]
});

  constructor(private reservationserv: ReservationService, private formbuild:FormBuilder, public appserv: AppservicesService, private articleserv: ArticlesService, private customerserv: CustomersService) { }

  ngOnInit() {
    console.log(this.article);
    this.newreservation.patchValue({
      from:this.appserv.defaultdate(),
      to:this.appserv.defaultdate()
    });
  }

  selectprice(price:PricesCategories){
    this.article.prices.forEach(element => {
      element.selected=false;
    });
    price.selected=true;
    this.newreservation.patchValue({
      price:price.price
    });
  }

  addcustomer(){
    this.newcustomer.patchValue({
      customerName:this.actualcustomer.customerName,
      phone:this.actualcustomer.phone,
      mail:this.actualcustomer.mail,
      type:this.actualcustomer.type,
      adress:this.actualcustomer.adress,
      enterprise_id:this.appserv.getactualEse().id,
      created_by_id:this.appserv.getactualuser().id,
    });

    if (this.newcustomer.getRawValue().customerName && this.newcustomer.getRawValue().phone && this.newcustomer.getRawValue().type) {
      if (this.appserv.isMyDeviceConnected()) {
        this.showprogress=true;
        this.customerserv.addnewcustomer(this.newcustomer.value).subscribe(
          data=>{
            this.showprogress=false;
            this.customerserv.addtoCustomersOffline(data);
            this.actualcustomer=data;
            this.newreservation.patchValue({
              customer_id:this.actualcustomer.id
            });
          },
          error=>{
            this.showprogress=false;
            this.appserv.presentToast("Une erreur est survenue lors de l'enregistrement du client","danger");
          });
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
        enterprise_id:this.appserv.getactualuser().enterprise_id
      });
    }else{
      this.appserv.presentToast("Veuillez Completer les champs obligatoires svp!","warning");
    }
  }

  sycingdata(){
    this.newcustomer.patchValue({
      id:this.actualcustomer.id,
      pos_id :this.actualcustomer.pos_id,
      created_by_id:this.actualcustomer.created_by_id,
      category_id:this.actualcustomer.category_id,
      customerName:this.actualcustomer.customerName,
      marital_status:this.actualcustomer.marital_status,
      other_contact:this.actualcustomer.other_contact,
      adress:this.actualcustomer.adress,
      phone:this.actualcustomer.phone,
      mail:this.actualcustomer.mail,
      employer:this.actualcustomer.employer,
      type:this.actualcustomer.type,
      sex:this.actualcustomer.sex,
      created_at:this.actualcustomer.created_at,
      updated_at:this.actualcustomer.updated_at,
      enterprise_id:this.actualcustomer.enterprise_id,
      employer_name:this.actualcustomer.employer_name,
      pos_name:this.actualcustomer.pos_name,
      category_name:this.actualcustomer.category_name
    });
  }

  async editcustomer(){
    this.showprogress=true;
    this.sycingdata();
    this.customerserv.updatecustomer(this.newcustomer.value).subscribe(
      (data:Customers)=>{
        this.showprogress=false;
        this.actualcustomer=data;
        this.appserv.presentToast(`Mise à jour terminée avec succès!`,'success');
        this.newreservation.patchValue({
          customer_id:this.actualcustomer.id
        });
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de mettre à jour les données du client`,'danger');
      }
    );
  }

  async periodic(){
    let dateFrom="";
      let dateTo="";
      const modal = await this.appserv.periodicfilter();
      modal.present(); 
    
      const {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        dateFrom=data.from;
        dateTo=data.to;
      }
      return {from:dateFrom,to:dateTo};
  }

  async periodfilter(){
    const period = await  this.periodic();
    this.from=period.from;
    this.to=period.to;
  }

  async customerpick(){
    const modal = await this.appserv.modalCtrl.create(
      {
        component:CustomerpickersComponent,
        cssClass:'modal-border-radius-20'
      });
    (await modal).present();
      const {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        this.actualcustomer=data;
        this.newreservation.patchValue({
          customer_id:this.actualcustomer.id
        });
      }
  }

  validation(){
    if (this.newreservation.valid) {
      this.newreservation.patchValue({
        enterprise_id:this.appserv.getactualEse().id,
        user_id:this.appserv.getactualuser().id,
        service_id:this.article.service.id
      });
      this.showprogress=true;
      this.reservationserv.newreservation(this.newreservation.value).subscribe(
        response=>{
          console.log(response);
          this.showprogress=false;
          if (response.message==='success' && response.status===200) {
            this.appserv.presentToast("Réservation éffectuée avec succès","success");
            this.appserv.modalCtrl.dismiss(response,"success");
          }else{
            this.appserv.presentToast("Veuillez réessayer la réservation!","warning");
          }
        },
        error=>{
          this.showprogress=false;
        }
      )
    }else{
      this.appserv.presentToast("Veuillez sélectionner tous les éléments néccessaires à la réservation!","danger");
    }
  }
}
