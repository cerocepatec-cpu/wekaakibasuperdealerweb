import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { PricesCategories } from '../../interfaces/pricescategories';
import { NewpricecategorieComponent } from 'src/app/articles/newpricecategorie/newpricecategorie.component';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-servicepricespicker',
  templateUrl: './servicepricespicker.component.html',
  styleUrls: ['./servicepricespicker.component.scss'],
})
export class ServicepricespickerComponent implements OnInit {
@ViewChild('defaultinput') defaultinput!: IonInput;
@Input() serviceidsent:any;
@Input() prices:any;
listprices: PricesCategories[]=[];
showprogress=false;
search:any;
discussed=0;

  constructor(public appserv: AppservicesService, private articleserv: ArticlesService) { }

  ngOnInit() {
    this.listprices=this.prices;
    this.getprices();
  }
    ionViewDidEnter(){
      this.defaultinput.setFocus();
    }

    otherpricevent($event){
      if($event.keyCode === 13){
        this.otherprice();
      }
    }

    otherprice(){
      if (this.discussed && this.discussed>0) {
        const newprice ={
          service_id: this.serviceidsent,
          label:'Prix discuté',
          price:this.discussed,
          enterprise_id:this.appserv.actualEse.id,
          money_id:this.appserv.getDefaultmoney().id,
          service_name:this.appserv.getDefaultmoney().money_name,
          money_name: this.appserv.getDefaultmoney().money_name,
          abreviation:this.appserv.getDefaultmoney().abreviation,
          not_from_api: false,
        };

        this.selected(newprice);
      }else{
        this.appserv.presentToast("Veuillez entrer un prix svp!","warning");
      }
      
    }

  async addnewprice(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewpricecategorieComponent
    });
    modal.present();
    const {data,role}= await modal.onWillDismiss();
    if(role=='added'){
      data.forEach((pricing:any)=> {
        this.appserv.newpricecategory(pricing).subscribe(
          data=>{

          },
          error=>{
            this.appserv.presentToast(`Impossible d'enregistrer le prix dans la base de données`,'warning');
          }
        );
        this.listprices.push(pricing);
      });
    }

  }

  getprices(){
    this.showprogress=true;
    this.articleserv.getprices(this.serviceidsent).subscribe(
      data=>{
        this.listprices=data;
        this.showprogress=false;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de charger les prix. Veuillez verifier votre connexion.`,'danger');
      }
    )
  }

  selected(price: PricesCategories){
      this.appserv.modalCtrl.dismiss(price,'selected');
  }
}
