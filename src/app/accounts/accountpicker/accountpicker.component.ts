import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { Customers } from 'src/app/interfaces/customers';
import { AppservicesService } from '../../services/appservices.service';
import { NewaccountComponent } from '../newaccount/newaccount.component';
import { Accounts } from 'src/app/interfaces/accounts';
import { AccountService } from 'src/app/services/account.service';
import { IonInput } from '@ionic/angular';


@Component({
  selector: 'app-accountpicker',
  templateUrl: './accountpicker.component.html',
  styleUrls: ['./accountpicker.component.scss'],
})
export class AccountpickerComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput: IonInput;
  @Input() multiple:boolean;
  listaccounts: Accounts[]=[];
  listaccountsselected: Accounts[]=[];
  showprogress=false;
  search:any;

  constructor( public appserv: AppservicesService, private accountserv: AccountService) { }
  
    ngOnInit() {
      this.getaccountslist();
    }
  
    ionViewDidEnter(){
      this.defaultinput.setFocus();
    }
    closemodal(){
      this.appserv.modalCtrl.dismiss();
    }
  
    getaccountslist(){
      this.showprogress=true;
      if (this.appserv.isMyDeviceConnected()) {
        this.accountserv.getall(this.appserv.getactualuser().enterprise_id).subscribe(
          data=>{
            this.showprogress=false;
            this.listaccounts=data;
          },
          error=>{
            this.showprogress=false;
            this.appserv.presentToast("Impossible de charger les comptes. Veuillez vérifier votre connexion","warning");
          });
      } else {
        //getting offline accounts
        this.listaccounts=this.accountserv.getOfflineData();
        this.showprogress=false;
      }
    
    }
  
   

    sendselected(){
      this.appserv.modalCtrl.dismiss(this.listaccountsselected,'selected');
    }
  
    selectitem(account: any){
      if (this.multiple) {
        const ifexists = this.listaccountsselected.indexOf(account);
        if (ifexists==-1) {
          account.selected=true;
          this.listaccountsselected.push(account);
        }else{
          account.selected=false;
          this.listaccountsselected=this.listaccountsselected.filter(t=>t!==account);
        }
      }else{
        this.appserv.modalCtrl.dismiss(account,'selected');
      }
    }
  
    async addnewaccount(){
      const modal = await this.appserv.modalCtrl.create({
        component:NewaccountComponent,
        cssClass:'modal-border-radius-20'
      });
      modal.present();
  
      const {data,role} = await modal.onWillDismiss();
        if(role=='added'){
          this.listaccounts.unshift(data);
        }
    }

}
