import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { AppservicesService } from 'src/app/services/appservices.service';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-providerpassword',
  templateUrl: './providerpassword.component.html',
  styleUrls: ['./providerpassword.component.scss'],
})
export class ProviderpasswordComponent implements OnInit {
  @ViewChild('username') username!: IonInput;
 
  showprogress=false;
  credentials = this.fb.group({
    user_name:['',[Validators.required]],
    user_password:['',[Validators.required]]
  });
  constructor(private fb: FormBuilder, private authService: AuthentificationService, public appserv: AppservicesService) { }

  ionViewDidEnter(){
   this.username.setFocus();
  }
  ngOnInit() {}

  senddata(){
    if (this.credentials.getRawValue().user_name.length>0 && this.credentials.getRawValue().user_password.length>0) {
      this.showprogress=true;
      this.authService.login(this.credentials.value).subscribe(
      (data:any)=>{
            this.showprogress=false;
            if (data.message==='success') {
              this.appserv.presentToast(`Agent vérifié avec succès`,'success');
              this.appserv.modalCtrl.dismiss(data,'verified');
            }else{
              this.appserv.presentToast('Accès refusé. Veuillez réessayer ou contacter votre administrateur','warning');
            } 
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast('Vérification échouée. Vérifier votre connexion internet','danger');
        });
    }else{

    }
  }

}
