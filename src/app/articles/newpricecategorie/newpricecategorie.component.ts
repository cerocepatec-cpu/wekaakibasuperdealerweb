import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { SelectmoneyComponent } from 'src/app/selectmoney/selectmoney.component';
import { Money } from '../../interfaces/money';
import { PricesCategories } from 'src/app/interfaces/pricescategories';
import { Users } from '../../interfaces/users';
import { MoneyService } from 'src/app/services/money.service';

@Component({
  selector: 'app-newpricecategorie',
  templateUrl: './newpricecategorie.component.html',
  styleUrls: ['./newpricecategorie.component.scss'],
})
export class NewpricecategorieComponent implements OnInit {
  showprogress=false;
  listmoney: Money[]=[];
  actualmoney: Money={};
  actualuser: Users={};
  listpricing: any[]=[];
  saveandexit=false;

  
  newpricecategory= this.formbuild.group({
    service_id:[0],
    label:['',Validators.required],
    price:['',Validators.required],
    money_id:[0],
    abreviation:[''],
    concerns:[]
  });

  constructor(private appserv: AppservicesService,private moneyserv: MoneyService, private formbuild : FormBuilder) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    this.gettingmoneys();
  }

  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }

  async gettingmoneys(){
  
    this.moneyserv.getlistmonnaiesapi(this.actualuser.enterprise_id).subscribe(
      data=>{
        this.listmoney=data;
        this.actualmoney=this.listmoney.filter(m=>m.principal===1)[0];
      },
      error=>{
       this.appserv.presentToast('impossible de charger les monnaies....','danger');
      }
    );
  }
  async addnew(){

    if(this.actualmoney){
      this.newpricecategory.patchValue({
        money_id:this.actualmoney.id,
        abreviation:this.actualmoney.abreviation
      });
    }
   
    if(this.saveandexit){
      this.listpricing.push(this.newpricecategory.value);
      this.appserv.modalCtrl.dismiss(this.listpricing,'added');
    }else{
      this.listpricing.push(this.newpricecategory.value);
      this.newpricecategory.reset();
    }
    
  }

  async changemoney(){

    const modal = await this.appserv.modalCtrl.create({
      component:SelectmoneyComponent,
      componentProps:{'listmoney':this.listmoney},
      initialBreakpoint:0.25,
      breakpoints:[0, 0.25, 0.5, 0.75]
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
    if(role=='selected'){
      this.actualmoney=data;
    }
  }

}
