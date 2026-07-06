import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Accounts } from 'src/app/interfaces/accounts';
import { AccountService } from 'src/app/services/account.service';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-editaccount',
  templateUrl: './editaccount.component.html',
  styleUrls: ['./editaccount.component.scss'],
})
export class EditaccountComponent implements OnInit {
@Input() accountsent: Accounts={};
  showprogress=false;

  newaccount=this.fb.group({
    id:[0],
    name:[''],
    description:[''],
    type:[''],
    user_id:[0],
    enterprise_id:[0]
  });

  constructor(public appserv: AppservicesService, private fb: FormBuilder, private accountserv: AccountService) { }

  ngOnInit() {
    this.syncingdata();
  }

  syncingdata(){
    this.newaccount.patchValue({
      id:this.accountsent.id,
      name:this.accountsent.name,
      description:this.accountsent.description,
      type:this.accountsent.type,
      user_id:this.accountsent.user_id,
      enterprise_id:this.accountsent.enterprise_id
    });
  }
  editType(type: string){
    this.newaccount.patchValue({
      type:type
    });
  }

  addnew(){
    this.showprogress=true;
    this.accountserv.edit(this.newaccount.value).subscribe(
      data=>{
        this.showprogress=false;
        this.appserv.presentToast(`Compte modifié avec succès`,'success');
        this.accountsent.name=data.name;
        this.accountsent.description=data.description;
        this.accountsent.type=data.type;
        this.accountsent.updated_at=data.updated_at;
        
        this.appserv.modalCtrl.dismiss(data,'added');
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de modifier le compte`,'danger');
      }
    )
  }

}
