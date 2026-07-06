import { Component, OnInit,Input } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { InvoicePrintComponent } from '../module/uzisha/home/invoice-print/invoice-print.component';
import { FormBuilder,Validators } from '@angular/forms';
import { MembersaccountsService } from '../services/membersaccounts.service';
import { MemberstransactionsService } from '../services/memberstransactions.service';

@Component({
  selector: 'app-transactionsvalidation',
  templateUrl: './transactionsvalidation.component.html',
  styleUrls: ['./transactionsvalidation.component.scss'],
})
export class TransactionsvalidationComponent implements OnInit {
@Input() transactionsent: any;
accounts:any[]=[];
iseditionactivated:boolean=false;
transactionform = this.formbuild.group({
    id:[],
    amount:[0,Validators.required],
    sold_before:[],
    sold_after:[],
    type:['deposit',Validators.required],
    motif:[],
    user_id:[0,Validators.required],
    member_account_id:[0,Validators.required],
    enterprise_id:[0,Validators.required],
    done_at:[],
    transaction_status:[],
    operation_done_by:[],
    account_id:[],
    phone:[],
    adresse:[]
});
  constructor(public appserv:AppservicesService,private formbuild:FormBuilder, private memberserv:MembersaccountsService,private membertransactionserv:MemberstransactionsService) { }

  ngOnInit() {
    console.log(this.transactionsent);
    if (this.transactionsent) {
      setTimeout(async () => {
        const newformdata = this.membertransactionserv.fillTransactionForm(this.transactionform,this.transactionsent);
         this.appserv.data$.subscribe(updatedData => {
            if (updatedData && updatedData.id === this.transactionsent.id) {
              this.transactionsent = updatedData;
            }
          });
        this.accounts= await this.memberserv.getmemberaccounts(this.transactionsent.member_id);
         if (this.accounts.length) {
            this.transactionform.patchValue({
               member_account_id: this.transactionsent.member_account_id
            });
         }
      }, 50);
    }
  }

  handleAccountChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue &&  parseInt(selectedValue)>0) {
        this.transactionform.patchValue({
          account_id:selectedValue
      });
    }
  }

  async export(criteria){
    const modal = await this.appserv.modalCtrl.create({
      component:InvoicePrintComponent,
      componentProps:{datasent:this.transactionsent,duplicata:true}
    });
    modal.present();
  }

  modeEdition(){
    this.iseditionactivated=!this.iseditionactivated;
  }

  async validateupdate(){
    const load = await this.appserv.loadctrl.create({
      message:"Mise à jour en cours...",
      translucent:true,
      mode:'ios',
    });
    load.present();
   this.membertransactionserv.updatetransaction(this.transactionsent.id,this.transactionform.value).subscribe({
      next: (res) => {
        load.dismiss();
        this.iseditionactivated=false;
        console.log('Transaction mise à jour:', res);
        if (res.message==="success" && res.status===200) {
          this.appserv.presentToast("Transaction mise à jour avec succès!","success");
          // const merged=this.appserv.mergeWithPreservedOrigin(this.transactionsent,res.data);
          this.membertransactionserv.replaceObjectContent(this.transactionsent,res.data);
          // console.log('merged',merged);
          // this.appserv.updateData(merged);
        }
        if (res.message==="error") {
          switch (res.error) {
            case 'can not be updated':
              this.appserv.presentToast("Impossible de mettre à jour la transaction!","warning");
              break;
            case 'not find':
              this.appserv.presentToast("Impossible de mettre à jour la transaction car elle est introuvable!","warning");
              break;
            default:
              this.appserv.presentToast("Une erreur est survenue lors de la mise à jour de la transaction!","warning");
              break;
          }
        }
        
      },
      error: (err) => {
        load.dismiss();
        console.error('Erreur:', err);
      }
    });
  }
}
