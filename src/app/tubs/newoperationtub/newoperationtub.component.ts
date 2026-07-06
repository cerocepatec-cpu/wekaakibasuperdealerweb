/* eslint-disable @typescript-eslint/naming-convention */
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Mouvement } from 'src/app/interfaces/mouvement';
import { IonInput, ModalController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AppservicesService } from 'src/app/services/appservices.service';
import { Tubs } from 'src/app/interfaces/tubs';
import { PinVerificationComponent } from 'src/app/pin-verification/pin-verification.component';
import { TubsService } from 'src/app/services/tubs.service';
import { WekamemberaccountpickerComponent } from 'src/app/wekamemberaccountpicker/wekamemberaccountpicker.component';
import { MemberAccounts } from 'src/app/interfaces/memberaccounts';

@Component({
  selector: 'app-newoperationtub',
  templateUrl: './newoperationtub.component.html',
  styleUrls: ['./newoperationtub.component.scss'],
})
export class NewoperationtubComponent implements OnInit {
  @ViewChild('amountInput', { static: false }) amountInput!: IonInput;
  @Input() tubsent: Tubs;
  @Input() lastmouvments: Mouvement[];
  @Input() fundsListSent: any[] = [];
  actualAccount:MemberAccounts={};
  showentriesbloc=true;
  showwithdrawsbloc=false;
  canDoEntry=false;
  listmouvements: Mouvement[]=[];
  entries: Mouvement[]=[];
  withdraws: Mouvement[]=[];
  recents: Mouvement[]=[];
  availableFunds:any[]=[];
  memberAccounts: any[] = []; 
  newoperation = this.formbuild.group({
    type:['entry',Validators.required],
    amount:[0,Validators.required],
    user_id:[],
    motif:['',Validators.required],
    fund_id:[],
    date_operation:[],
    enterprise_id:[],
    nature: ['other',Validators.required],
    fund_receiver_id: [null],
    member_account_id: [null],
    pin:''
  });
  constructor(public appserv: AppservicesService,private modalctrl: ModalController,private formbuild: FormBuilder,private tubserv:TubsService) { }

  ngOnInit() {
    if (this.tubsent.type!=="automatic") {
      this.newoperation.patchValue({
        type:'withdraw'
      });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.amountInput.setFocus();
      this.getAvailableFunds();
    }, 300);
  }
  async closemodal(){this.modalctrl.dismiss();}

@HostListener('window:keydown', ['$event'])
async handleKeyDown(event: KeyboardEvent) {
  const topModal = await this.appserv.modalCtrl.getTop();

  if (topModal && topModal.component !== this.constructor) {
    return;
  }

  switch (event.key) {
    case 'Escape':
      this.closemodal();
      break;
    case 'Enter':
      this.openPinModal();
      break;
  }
}
removeaccount(){
  this.actualAccount={};
  this.newoperation.patchValue({
    member_account_id:null
  });
}

async pickaccount(){
  const modal = await this.appserv.modalCtrl.create({
    component:WekamemberaccountpickerComponent,
    componentProps:{tubsent:this.tubsent},
    mode:'ios',
    cssClass:"modal-border-radius-20",
  });
  modal.present();
  const {role,data}= await modal.onWillDismiss();
  if (role==="selected") {
    if (data) {
      this.actualAccount=data;
      this.newoperation.patchValue({
        member_account_id:data.id
      });
    }
  }
}
  async resetform(){
    this.newoperation.patchValue({
      amount:0,
      motif:''
    });
  }

  async openPinModal() {
    if (this.newoperation.valid) {
       const modal = await this.appserv.modalCtrl.create({
        component: PinVerificationComponent,
        cssClass: 'modal-border-radius-20'
      });

      modal.onDidDismiss().then(async (res) => {
        if (res.role ==='success' && res.data.length === 4) {
          // ✅ PIN correct → on valide l’opération
          this.addnewoperation(res.data);
        }
      });
      await modal.present();
    }else{
      this.appserv.presentToast('Veuillez remplir tous les champs svp!','warning');
    }
}
  async updatetubsent(){
    if(this.newoperation.get('type').value==='entry'){
      this.tubsent.sold +=this.newoperation.get('amount').value;
    }else if(this.newoperation.get('type').value==='withdraw'){
      this.tubsent.sold -=this.newoperation.get('amount').value;
    }
  }

  async addnewoperation(pin:string){
      if(this.newoperation.get('amount').value){
        if(this.newoperation.get('type').value){
          this.newoperation.patchValue({
            user_id:this.appserv.actualUser.id,
            fund_id:this.tubsent.id,
            enterprise_id:this.appserv.actualUser.enterprise_id,
            pin: pin
          });
          const load = await this.appserv.loadctrl.create({
            message:'Opération en cours...',
            spinner:'circles',
            translucent:true,
            mode:'ios'
          });
          load.present();
          this.appserv.newoperation(this.newoperation.value).subscribe({
             next:(response)=>{
                if (response.message==="success" && response.status===200) {
                load.dismiss();
                this.appserv.presentToast(`Opération effectuée avec succès!`);
                this.updatetubsent();
                switch (response.data.nature) {
                  case 'transfert':
                    const receiverTub = this.fundsListSent.find(f=>f.id===response.data.fund_receiver_id);
                    if (receiverTub) {
                      receiverTub.sold=receiverTub.sold+response.data.amount;
                    }
                    break;
                
                  default:
                    break;
                }
                this.resetform();
                this.appserv.modalCtrl.dismiss();
              }else{
                load.dismiss();
                this.appserv.presentToast(response.error,"warning");
              }
            },
            error:(err)=>{
              load.dismiss();
              this.appserv.presentToast(`Impossible de passer l'opération. Vérifier le solde de votre caisse`,'danger');
            }
          });
        }else{
          this.appserv.presentToast(`Veuillez cocher un type d'opération`,'warning');
        }
      }else{
        this.appserv.presentToast(`Veuillez entrer montant svp!`,'warning');
      }
  }

  getAvailableFunds(){
    this.tubserv.allTubs(this.appserv.getactualEse().id).subscribe({
      next:(response)=>{
        console.log('All tubs loaded',response);
        if (response.message==="success" && response.status===200) {
          this.availableFunds = response.data.filter(
              fund => fund.id !== this.tubsent.id && fund.money_id === this.tubsent.money_id
            );
          console.log('Available funds',this.availableFunds);
        }else{
          this.appserv.presentToast(response.error,'warning');
        }
      },error:(err)=>{
        console.log('Error loading tubs',err);
        this.appserv.presentToast('Erreur de connexion au serveur. Vérifier votre connexion internet','danger');
      }
    });
  }
}
