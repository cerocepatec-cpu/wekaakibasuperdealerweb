import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { AccountService } from 'src/app/services/account.service';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-newaccount',
  templateUrl: './newaccount.component.html',
  styleUrls: ['./newaccount.component.scss'],
})
export class NewaccountComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput : IonInput;
  showprogress=false;
  newaccount=this.fb.group({
    name:['',Validators.required],
    description:[''],
    type:['gestion'],
    user_id:[this.appserv.getactualuser().id],
    enterprise_id:[this.appserv.getactualuser().enterprise_id]
  });

  constructor(public appserv: AppservicesService, private fb: FormBuilder, private accountserv: AccountService) { }

  ngOnInit() {}

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }
  
  editType(type: string){
    this.newaccount.patchValue({
      type:type
    });
  }

  addnew(){
    this.showprogress=true;
    this.accountserv.new(this.newaccount.value).subscribe(
      data=>{
        this.showprogress=false;
        this.appserv.presentToast(`Compte enregistré avec succès`,'success');
        this.accountserv.addToOffline(data);
        this.appserv.modalCtrl.dismiss(data,'added');
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible d'enregistrer le compte`,'danger');
      }
    )
  }

}
