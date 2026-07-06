import { Component, OnInit , Input } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { FormBuilder } from '@angular/forms';
import { CategoryCustomers } from 'src/app/interfaces/categoriecustomers';
import { Users } from 'src/app/interfaces/users';
import { ProvidersService } from 'src/app/services/providers.service';
import { Providers } from '../../interfaces/providers';

@Component({
  selector: 'app-editprovider',
  templateUrl: './editprovider.component.html',
  styleUrls: ['./editprovider.component.scss'],
})
export class EditproviderComponent implements OnInit {
  @Input() providersent:Providers={};
  @Input() listcategories:CategoryCustomers[]=[];
  showprogress=false;
  typesent='';
  actualuser: Users={};
  
    newprovider=this.formbuild.group({
      id: [0],
      providerName: [''],
      adress: [''],
      phone: [''],
      type: [''],
      mail: ['']
    });

    constructor(private providerserv: ProvidersService,private appserv: AppservicesService, private formbuild: FormBuilder) { }
  
    ngOnInit() {
      this.actualuser=this.appserv.getactualuser();
     this.sycingdata();
    }
  
    sycingdata(){
      this.newprovider.patchValue({
        id: this.providersent.id,
        providerName: this.providersent.providerName,
        adress: this.providersent.adress,
        phone: this.providersent.phone,
        type: this.providersent.type,
        mail: this.providersent.mail
      });
    }

    editType(type: string){
      this.newprovider.patchValue({
        type:type
      });
    }
    
    editprovider(){
    
      this.showprogress=true;
      this.providerserv.updateprovider(this.newprovider.value,this.providersent.id).subscribe(
        data=>{
          this.showprogress=false;
          this.providersent.providerName=data.providerName;
          this.providersent.adress=data.adress;
          this.providersent.phone=data.phone;
          this.providersent.type=data.type;
          this.providersent.mail=data.mail;
          this.appserv.presentToast(`Fournisseur modifié avec succès`,'success');
          this.appserv.modalCtrl.dismiss(data,'edited');
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast(`Modification impossible. veuillez vérifier votre connexion.`,'danger');
        }
      )
    }
  
    closemodal(){
      this.appserv.modalCtrl.dismiss();
    }

}
