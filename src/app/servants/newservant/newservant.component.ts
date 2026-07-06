import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ServantsService } from '../../services/servants.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-newservant',
  templateUrl: './newservant.component.html',
  styleUrls: ['./newservant.component.scss'],
})
export class NewservantComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput: IonInput;
  showprogress=false;
  newservant=this.formbuild.group({
    user_id:[0],
    name: ['',Validators.required],
    description: [],
    address: [''],
    phone: [''],
    email: [''],
    enterprise_id:[0],
    photo:['']
  });
  constructor(public appserv: AppservicesService, private formbuild: FormBuilder, private servantserv: ServantsService) { }

  ngOnInit() {}

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }
  addnew(){
    this.showprogress=true;
    
    this.newservant.patchValue({
      enterprise_id:this.appserv.getactualuser().enterprise_id,
      user_id:this.appserv.getactualuser().id
    });

    this.servantserv.addnew(this.newservant.value).subscribe(
      data=>{
        this.showprogress=false;
        this.appserv.presentToast(`Serveur ajouté avec succès`,'success');
        this.servantserv.addtoOffline(data);
        this.appserv.modalCtrl.dismiss(data,'added');
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible d'ajouter le serveur. Vérifiez votre connexion`,'danger');
      }
    )
  }

}
