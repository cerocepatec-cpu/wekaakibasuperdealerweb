import { Component, OnInit, Input } from '@angular/core';
import { Servant } from '../../interfaces/servants';
import { AppservicesService } from '../../services/appservices.service';
import { FormBuilder,Validators } from '@angular/forms';
import { ServantsService } from 'src/app/services/servants.service';

@Component({
  selector: 'app-editservant',
  templateUrl: './editservant.component.html',
  styleUrls: ['./editservant.component.scss'],
})
export class EditservantComponent implements OnInit {
@Input() servantsent: Servant={};
 showprogress=false;

  newservant=this.formbuild.group({
    id:[0],
    name: ['',Validators.required],
    description: [''],
    address: [''],
    phone: [''],
    email: [''],
    photo:['']
  });

  constructor(public appserv: AppservicesService, private formbuild: FormBuilder, private servantserv: ServantsService) { }

  ngOnInit() {
    this.sycingdata();
  }

  async edit(){
    this.showprogress=true;
    this.servantserv.edit(this.newservant.value).subscribe(
      data=>{
        this.showprogress=false;
        this.changedata(data);
        this.appserv.presentToast(`Serveur modifié avec succès`,'success');
        this.appserv.modalCtrl.dismiss(data,'edited');
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de modifier le serveur. Veuillez verifier votre connexion.`,'danger');
      }
    )
  }

  sycingdata(){
    this.newservant.patchValue({
      id:this.servantsent.id,
      name:this.servantsent.name,
      description:this.servantsent.description,
      address:this.servantsent.address,
      phone:this.servantsent.phone,
      email:this.servantsent.email,
      photo:this.servantsent.phone
    });
  }

  changedata(data: Servant){
      this.servantsent.name=data.name;
      this.servantsent.description=data.description;
      this.servantsent.address=data.address;
      this.servantsent.phone=data.phone;
      this.servantsent.email=data.email;
      this.servantsent.phone=data.photo;
  }
}
