import { NewproviderComponent } from './../../providers/newprovider/newprovider.component';
import { CustomersService } from './../../services/customers.service';
import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { Customers } from 'src/app/interfaces/customers';
import { AddnewcustomerComponent } from '../addnewcustomer/addnewcustomer.component';
import { ProvidersService } from 'src/app/services/providers.service';
import { Providers } from 'src/app/interfaces/providers';

@Component({
  selector: 'app-providerpicker',
  templateUrl: './providerpicker.component.html',
  styleUrls: ['./providerpicker.component.scss'],
})
export class ProviderpickerComponent implements OnInit {

  listproviders: Providers[]=[];
  showprogress=false;
  constructor(private appserv: AppservicesService,private providerserv:ProvidersService) { }

  ngOnInit() {
    this.getallproviders();
  }

  noprovider(){
    this.appserv.modalCtrl.dismiss(null,'no_choice');
  }

  async addnewcustomer(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewproviderComponent
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
    if(role=='added'){
     this.listproviders.push(data);
    }
  }
  async selected(provider: Providers){
    this.appserv.modalCtrl.dismiss(provider,'selected');
  }

  getallproviders(){
    this.showprogress=true;
    this.providerserv.getallproviders(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.showprogress=false;
        this.listproviders=data;
      },
      error=>{
        this.showprogress=false;
        // console.log('une erreur est survenue lors du chargement des fournisseurs');
      }
    );
  }

  async closemodal(){
    this.appserv.modalCtrl.dismiss();
  }
}
