import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { FormBuilder } from '@angular/forms';
import { CategoryCustomers } from 'src/app/interfaces/categoriecustomers';
import { Users } from 'src/app/interfaces/users';
import { ProvidersService } from 'src/app/services/providers.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-newprovider',
  templateUrl: './newprovider.component.html',
  styleUrls: ['./newprovider.component.scss'],
})
export class NewproviderComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!: IonInput;
  @Input() type:string='';
  @Input() listcategories:CategoryCustomers[]=[];
  showprogress=false;
  typesent='';
  actualuser: Users={};
  
    newprovider=this.formbuild.group({
      id: [],
      created_by_id:[0],
      user_name: [],
      providerName: [],
      adress: [''],
      phone: [''],
      type: [''],
      mail: [''],
      enterprise_id:[0],
      photo:['']
    });

    constructor(private providerserv: ProvidersService,private appserv: AppservicesService, private formbuild: FormBuilder) { }
  
    ngOnInit() {
      this.actualuser=this.appserv.getactualuser();
        this.newprovider.patchValue({
          type:'physique'
        });
    }
  
    ionViewDidEnter(){
      this.defaultinput.setFocus();
    }
    editType(type: string){
      this.newprovider.patchValue({
        type:type
      });
    }
    
    addnew(){
      this.newprovider.patchValue({
        enterprise_id:this.actualuser.enterprise_id,
        created_by_id:this.actualuser.id
      });
      this.showprogress=true;
      this.providerserv.addnewprovider(this.newprovider.value).subscribe(
        data=>{
          this.showprogress=false;
          this.appserv.modalCtrl.dismiss(data,'added');
          this.appserv.presentToast(`Fournisseur ajouté avec succès.`,'success');
          //add to local list
          // this.providerserv.saveoffline(data);
        },
        error=>{
          this.showprogress=false;
          // let object=
          //   {
          //       id:this.providerserv.getofflinelist().length+1,
          //       created_by_id:this.appserv.getactualuser().id,
          //       providerName:this.newprovider.getRawValue().providerName,
          //       adress:this.newprovider.getRawValue().adress,
          //       phone:this.newprovider.getRawValue().phone ,
          //       photo:this.newprovider.getRawValue().photo ,
          //       type:this.newprovider.getRawValue().type ,
          //       mail:this.newprovider.getRawValue().mail ,
          //       enterprise_id:this.appserv.getactualuser().enterprise_id,
          //       created_at:Date(),
          //       updated_at:Date(),
          //       user_name:this.appserv.getactualuser().user_name,
          //       sync_status:'0'
          //   };
        
          // this.providerserv.saveoffline(object);
          this.appserv.presentToast(`Erreur survenue lors de l'enregistrement. veuillez réssayer svp!.`,'warning');
          // this.appserv.modalCtrl.dismiss(object,'added');
        }
      )
    }
  
    closemodal(){
      this.appserv.modalCtrl.dismiss();
    }
}
