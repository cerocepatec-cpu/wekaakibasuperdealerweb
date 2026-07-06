import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { Enterprise } from '../interfaces/enterprise';
import { EditenterpriseComponent } from './editenterprise/editenterprise.component';
import { EnterpriseService } from '../services/enterprise.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-enterprises',
  templateUrl: './enterprises.page.html',
  styleUrls: ['./enterprises.page.scss'],
})
export class EnterprisesPage implements OnInit {
  showsecurityprogress=false;
  showpermissionprogress=false;
  actualEse:Enterprise=this.appserv.getactualEse();
  datafromapi:any[]=[];
  bonusdata:any[]=[];
  pointsdata:any[]=[];
  isSellModalOpen=false;
  modaltitle="";
  operationtype="";
  from:any;
  to:any;
  amountdu=0;
  duration=0;
  actualinvoice:any={ nbrmonth:0,amount:0,nbrpersons:0,unite_price:0,checked:false};
  fidelityinvoices=[
    {
      nbrmonth:3,amount:9,checked:false,nbrpersons:2,unite_price:3
    }, 
    {
      nbrmonth:6,amount:18,checked:false,nbrpersons:4,unite_price:3
    } 
    ,{
      nbrmonth:12,amount:36,checked:false,nbrpersons:6,unite_price:3
    }
  ];
  newfidelity=this.formbuild.group({
    enterprise_id:[],
    status:[],
    user_id:[],
    from:[],
    to:[],
    type:[],
    amount_due:[],
    payed:[],
    nbrmonth:[],
    nbrpersons:[],
    unite_price:[]
  });
  constructor(private formbuild:FormBuilder, public appserv: AppservicesService, private enterpriseServ: EnterpriseService) { }

  ngOnInit() {
    this.getinvoicesfromapi();
  }
  activeEse(){}
  disactiveEse(){}
  openeditprofil(){
  
  }

  selected(item:any,criteria:string){
    this.fidelityinvoices.forEach(element => {
      element.checked=false;
    });
    item.checked=!item.checked;
    console.log(item);
    switch (criteria) {
      case 'bonus':
          if(item.checked){
            this.newfidelity.patchValue({
              nbrmonth:item.nbrmonth,
              type:criteria,
              amount_due:item.amount,
              enterprise_id:this.appserv.actualEse.id,
              user_id:this.appserv.actualUser.id,
              payed:false,
              status:"pending",
              unite_price:item.unite_price,
              nbrpersons:item.nbrpersons
            });
            this.actualinvoice=item;
          }else{
            this.actualinvoice={};
          }
        break; 
      case 'point':
       
        break;
    
      default:
        break;
    }
  }

  openmodal(criteria:string){
    this.isSellModalOpen=true;
    switch (criteria) {
      case 'bonus':
          this.modaltitle="Abonnement système de bonus";
          this.operationtype="bonus";
        break; 
      case 'point':
          this.modaltitle="Abonnement système points"
          this.operationtype="point";
        break;
    
      default:
        break;
    }
  }
  BeforeClosingSellModal($event){
    this.isSellModalOpen=false;
  }
  async openeditEse(){
    const modal = await this.appserv.modalCtrl.create({
      component:EditenterpriseComponent,
      componentProps:{'enterpriseSent':this.actualEse},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async getinvoicesfromapi(){
    this.showpermissionprogress=true;
    this.enterpriseServ.invoicesabonnements(this.actualEse.id).subscribe(
      data=>{
        this.showpermissionprogress=false;
        console.log(data);
        data.data.forEach(element => {
          if (element.type==='soft') {
            this.datafromapi.push(element);
          }  
          
          if (element.type==='point') {
            this.pointsdata.push(element);
          } 
          
          if (element.type==='bonus') {
            this.bonusdata.push(element);
          }

        });
    
      },
      error=>{
        console.log(error);
        this.appserv.presentToast("Impossible d'actualiser la santé de votre entreprise!","danger");
        this.showpermissionprogress=false;
      });
  }

  async validationoperation(){
    this.showpermissionprogress=true;
    this.enterpriseServ.newinvoiceabonnement(this.newfidelity.value).subscribe(
      data=>{
        this.showpermissionprogress=false;
        console.log(data);
        if (data.error) {
          this.appserv.presentToast("Action non terminée. Une erreur est survenue","warning");
        }else{
          this.appserv.closemodal();
          if (data.message==="success") {
            this.appserv.presentToast("Paiement effectué avec succès.","success");
            if (data.data.type==='soft') {
              this.datafromapi.push(data.data);
            }  
            
            if (data.data.type==='point') {
              this.pointsdata.push(data.data);
            } 
            
            if (data.data.type==='bonus') {
              this.bonusdata.push(data.data);
            }
          }
         
        }
          
      },
      error=>{
        console.log(error);
        this.appserv.presentToast("Impossible de terminer le paiement. Vérifiez votre connexion et recommencez.","danger");
        this.showpermissionprogress=false;
      });
  }
}
