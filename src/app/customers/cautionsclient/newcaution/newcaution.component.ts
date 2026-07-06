import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Cautions } from 'src/app/interfaces/cautions';
import { Customers } from 'src/app/interfaces/customers';
import { AppservicesService } from '../../../services/appservices.service';
import { CustomersService } from 'src/app/services/customers.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-newcaution',
  templateUrl: './newcaution.component.html',
  styleUrls: ['./newcaution.component.scss'],
})
export class NewcautionComponent implements OnInit {
 @ViewChild('defaultinput') defaultinput:IonInput;
@Input() customersent: Customers={};
newcaution:Cautions={};
showprogress=false;
actualuser=this.appserv.getactualuser();

constructor(public appserv: AppservicesService, private customerserv:CustomersService) { }

  ngOnInit() {}

  ionViewDidEnter() {
    this.newcaution.done_at=this.appserv.defaultdate();
    this.defaultinput.setFocus();
  }

  async addnew(){

    if(this.newcaution.amount && this.newcaution.amount>0){
      this.showprogress=true;
      this.newcaution.enterprise_id=this.actualuser.enterprise_id;
      this.newcaution.customer_id=this.customersent.id;
      this.newcaution.user_id=this.actualuser.id;
      this.customerserv.newcaution(this.newcaution).subscribe(
        data=>{
          this.showprogress=false;
          this.appserv.presentToast(`Caution enregistrée avec succès`,'success');
          //console.log(data);
          this.appserv.modalCtrl.dismiss(data,'added');
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast(`Erreur d'enregistrement de la caution`,'danger');
        }
      )
    }else{
      this.appserv.presentToast(`Veuillez entrer le montant`,'warning');
    }

  }

}
