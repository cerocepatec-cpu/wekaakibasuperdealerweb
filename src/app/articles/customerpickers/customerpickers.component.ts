import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Customers } from 'src/app/interfaces/customers';
import { AppservicesService } from '../../services/appservices.service';
import { CustomersService } from 'src/app/services/customers.service';
import { AddnewcustomerComponent } from '../addnewcustomer/addnewcustomer.component';
import { articlePaginator } from 'src/app/interfaces/articlespaginator';
import { PageEvent } from '@angular/material/paginator';
import { IonInput } from '@ionic/angular';
import { NewagentComponent } from 'src/app/agents/newagent/newagent.component';

@Component({
  selector: 'app-customerpickers',
  templateUrl: './customerpickers.component.html',
  styleUrls: ['./customerpickers.component.scss'],
})
export class CustomerpickersComponent implements OnInit {
  @ViewChild('inputSearch') input!: IonInput;
  @Input() multiple : boolean;
listcustomers: Customers[]=[];
listcustomerstosend: Customers[]=[];
showprogress=false;
search:any;
   /**
   * pagination options
   */
   paginationOptions : articlePaginator={};

   pageSizeOptions = [];
   hidePageSize = false;
   showPageSizeOptions = false;
   showFirstLastButtons = true;
   disabled = false;
   pageEvent: PageEvent;

constructor(public appserv: AppservicesService, private customerserv: CustomersService) { }

  ngOnInit() {
   this.getanonymous();
  }

  ionViewDidEnter() {
    this.input.setFocus();
  }

  sendata(){
    this.appserv.modalCtrl.dismiss(this.listcustomerstosend,"selected");
  }

  getanonymous(){
    this.showprogress=true;
    this.customerserv.getanonymous(this.appserv.actualEse.id).subscribe(
      data=>{
        if (data) {
          this.listcustomers.unshift(data);
        }
        console.log('anonyme data',data);
        
        this.showprogress=false;
      },error=>{
        this.showprogress=false;
      });
  }

  async lookup(){
    if (this.appserv.isMyDeviceConnected()) {
      this.showprogress=true;
      this.customerserv.lookup({enterpriseid:this.appserv.actualEse.id,word:this.search}).subscribe(
        data=>{
          this.listcustomers=data;
          this.showprogress=false;
        },error=>{
          this.showprogress=false;
        });
    }else{
      this.listcustomers=this.customerserv.getoffcustomersbykeywords(this.search);
    }
  }

  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }

  getcustomerslist(){
    this.showprogress=true;
    this.customerserv.getallcustomers(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.showprogress=false;
        this.listcustomers=data;
      },
      error=>{
        this.showprogress=false;
        this.listcustomers=this.customerserv.getofflineCustomers();
      }
    )
  }

  async selected(customer: Customers){
    if ( this.multiple) {
      const ifexists = this.listcustomerstosend.indexOf(customer);
      if (ifexists===-1) {
        this.listcustomerstosend.push(customer);
        customer.selected=true;
      }else{
        customer.selected=false;
        this.listcustomerstosend=this.listcustomerstosend.filter(c=>c!==customer);
      }
    }else{
      this.appserv.modalCtrl.dismiss(customer,'selected');
    }
  }

  async addnewcustomer(){
    console.log("Search Value",this.search);
    const modal = await this.appserv.modalCtrl.create({
      component:NewagentComponent,
      componentProps:{'search':this.search,returned:'customer'},
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role} = await modal.onWillDismiss();
      if(role=='added'){
        this.listcustomers.unshift(data);
        modal.dismiss();
        this.selected(data);
      }
  }
}
