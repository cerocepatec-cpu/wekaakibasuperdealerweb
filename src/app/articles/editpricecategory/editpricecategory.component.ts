import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppservicesService } from '../../services/appservices.service';
import { SelectmoneyComponent } from 'src/app/selectmoney/selectmoney.component';
import { Money } from '../../interfaces/money';
import { PricesCategories } from 'src/app/interfaces/pricescategories';
import { Users } from 'src/app/interfaces/users';
import { ArticlesService } from 'src/app/services/articles.service';
import { MoneyService } from '../../services/money.service';

@Component({
  selector: 'app-editpricecategory',
  templateUrl: './editpricecategory.component.html',
  styleUrls: ['./editpricecategory.component.scss'],
})
export class EditpricecategoryComponent implements OnInit {

  @Input() pricing: PricesCategories={};
  @Input() direction: string='';
  showprogress=false;
  listmoney: Money[]=[];
  actualmoney:Money={};
  listpricing:any[]=[];
  saveandexit=false;
  actualuser:Users={};
  newpricecategory= this.formbuild.group({
    service_id:[0],
    label:['',Validators.required],
    price:[0,Validators.required],
    money_id:[0],
    abreviation:[''],
  });

  constructor(private moneyserv:MoneyService, private appserv: AppservicesService, private formbuild : FormBuilder, private artiserv:ArticlesService) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    this.gettingmoneys();
    this.syncingdata();
  }

  syncingdata(){
    this.newpricecategory.patchValue({
      service_id:this.pricing.service_id,
      label:this.pricing.label,
      money_id:this.pricing.money_id,
      abreviation:this.pricing.abreviation,
      price:this.pricing.price
    });
  }

  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }

  async gettingmoneys(){

    this.moneyserv.getlistmonnaiesapi(this.actualuser.enterprise_id).subscribe(
      data=>{
        this.listmoney=data;
        if(this.direction=='api'){
          this.actualmoney=this.listmoney.filter(m=>m.id===this.pricing.money_id)[0];
        }else{
          this.actualmoney=this.listmoney.filter(m=>m.principal===1)[0];
        }
      },
      error=>{
      //  console.log('impossible de charger les monnaies....');
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

    if(this.direction=='api'){
      this.showprogress=true;
        this.artiserv.editpricecagoryapi(this.pricing.id,this.newpricecategory.value).subscribe(
          data=>{
            this.showprogress=false;
            this.appserv.modalCtrl.dismiss(data,'edited');
          },error=>{
            this.showprogress=false;
            this.appserv.presentToast(`Impossible de terminer cette action. Veuillez vérifier votre connexion`,'danger');
          }
      );
    }else{
      this.appserv.modalCtrl.dismiss(this.newpricecategory.value,'edited');
    }
  }

  async changemoney(){

    const modal = await this.appserv.modalCtrl.create({
      component:SelectmoneyComponent,
      componentProps:{'listmoney':this.listmoney},
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
    if(role=='selected'){
      this.actualmoney=data;
    }
  }
}
