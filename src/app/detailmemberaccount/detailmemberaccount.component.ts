import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { MembersaccountsService } from '../services/membersaccounts.service';
import { articlePaginator } from '../interfaces/articlespaginator';
import { IonInput } from '@ionic/angular';
import { FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-detailmemberaccount',
  templateUrl: './detailmemberaccount.component.html',
  styleUrls: ['./detailmemberaccount.component.scss'],
})
export class DetailmemberaccountComponent implements OnInit {
@ViewChild('defaultinput') defaultinput!: IonInput;
@Input() account :any= {};
loaded:boolean=false;
transactions = [];
from:any =this.appserv.firstdayofmonth;
to:any =this.appserv.lastdayofmonth;
search:any;
filteredTransactions = [];
paginationOptions:articlePaginator={};
showadeblocagebloc:boolean=false;
accountForm = this.fb.group({
    id: [0, [Validators.required, Validators.min(1)]],
    type: ['internal', Validators.required],
    account_status: ['enabled', Validators.required],
    blocked_from: [''],
    blocked_to: [''],
    blocked_periocity:['year'],
    blocked_step:[1],
    criteria:['type']
  });

ngOnInit() {
  this.applyFilter();
  setTimeout(() => {
    this.accountForm.patchValue({
      id:this.account.id,
      type:this.account.type,
      account_status:this.account.account_status,
      blocked_from:this.account.blocked_from,
      blocked_to:this.account.blocked_to,
      blocked_periocity:this.account.blocked_periocity?this.account.blocked_periocity:'year',
      blocked_step:this.account.blocked_step?this.account.blocked_step:1,
    });
  }, 50);
}


ngAfterViewInit(){
  setTimeout(() => {
    this.defaultinput.setFocus();
  }, 300);
}
  constructor(private fb:FormBuilder, public appserv:AppservicesService,private memberaccountserv:MembersaccountsService) { }

  async applyFilter(){
    this.loaded=true;
    let objectsent={user_id:this.appserv.getactualuser().id,from:this.from,to:this.to,account:this.account.id,
      per_page:this.paginationOptions.per_page?this.paginationOptions.per_page:20,page:this.paginationOptions.current_page?this.paginationOptions.current_page:1}
      // console.log('before sent',objectsent);
    this.memberaccountserv.accountTransactions(objectsent).subscribe({
      next:(response)=>{
        this.loaded=false;
        // console.log(response);
           if (response.message==="error" && response.error==="user not sent") {
          this.appserv.presentToast("Utilisateur non identifié.","warning");
        }
        
        if (response.message==="error" && response.error==="unknown user") {
          this.appserv.presentToast("Nous n'arrivons pas à vous identifier.","warning");
        }  
        
        if (response.message==="error" && response.error==="unknown enterprise") {
          this.appserv.presentToast("Désolé, votre entreprise n'est pas identifiée!","warning");
        } 
        
        if (response.message==="success" && response.error===null && response.status===200) {
          this.filteredTransactions=response.data.data;
          this.paginationOptions=response.data;
          this.to=response.to;
          this.from=response.from;
        }
      },
      error:(err)=>{
        this.loaded=false;
        // console.log(err);
        this.appserv.presentToast("Une erreur est survenue lors du chargement des transactions.","danger");
      }
    });
  }

  async dashboardperiodfilter(){
    const period = await  this.periodicfilter();
    console.log('dates',period);
    this.from=period.from;
    this.to=period.to;
  }

   async periodicfilter(){
      let dateFrom="";
      let dateTo="";
      const modal = await this.appserv.periodicfilter();
      modal.present(); 
    
      let {data,role} = await modal.onWillDismiss();
      if(role=='selected'){
        if(!data){
            data={from:this.appserv.defaultdate(),to:this.appserv.defaultdate()}
        }
        dateFrom=data.from;
        dateTo=data.to;
      }
      return {from:dateFrom,to:dateTo};
    }
  blockAccount() {
    //this.showadeblocagebloc=!this.showadeblocagebloc;
  }

  disableAccount() {
     this.accountForm.patchValue({
      criteria:'status',
      account_status:'disabled'
    });
    this.confirmupdateaccount();
  }

  transferFunds() {
    // logique vers la page de transfert
  }

  deblocaccount(){
    this.accountForm.patchValue({
      criteria:'type',
      type:'internal'
    });
    this.confirmupdateaccount();
  }

  confirm(){
    this.accountForm.patchValue({
      criteria:'type',
      type:'blocked'
    });
    this.confirmupdateaccount();
  }

  async confirmupdateaccount(){
    console.log("form before sent",this.accountForm.value);
    const alert = await this.appserv.alertctrl.create({
      header: 'Confirmation',
      message:'Confirmez-vous cette opération?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:async()=>{
          const load = await this.appserv.loadctrl.create({
            message:'En cours...',
            mode:'ios',
            translucent:true,
            spinner:'circular'
          });
          load.present();
          this.memberaccountserv.updateaccount(this.accountForm.value).subscribe(
            {
              next:(response)=>{
                console.log('response on update account',response);
                load.dismiss();
                if (response.message==="success") {
                  this.appserv.presentToast("Compte mis à jour avec succès!","warning");
                }

                if(response.message==="error"){
                  switch (response.error) {
                    case 'criteria not sent':
                      this.appserv.presentToast("Aucun critère envoyé! Veuillez réesayer!","warning");
                      break;
                    case 'account not sent':
                      this.appserv.presentToast("Aucun compte envoyé! Veuillez réesayer!","warning");
                      break;
                  
                    default:
                      this.appserv.presentToast("Erreur suvenue.Veuillez réesayer!"+ ' '+response.error,"warning");
                      break;
                  }
                }
                
              },
              error:(error)=>{
                console.log('error on update account',error);
                load.dismiss();
                this.appserv.presentToast("Erreur survenue. Action échouée","danger")
              }
            }
          )
        }}
      ]
    });
    alert.present();
  }

}
