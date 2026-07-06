import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppservicesService } from '../../services/appservices.service';

@Component({
  selector: 'app-addnewdocument',
  templateUrl: './addnewdocument.component.html',
  styleUrls: ['./addnewdocument.component.scss'],
})
export class AddnewdocumentComponent implements OnInit {
showprogress =false;
newdoc= this.formbuild.group({
  name:[],
  description:[],
  user_id:[0],
  enterprise_id:[0]
});

  constructor(private formbuild : FormBuilder, private appserv: AppservicesService) { }

  ngOnInit() {}

  async addnew(){
    this.showprogress=true;
    this.newdoc.patchValue({
      enterprise_id:this.appserv.getactualuser().enterprise_id,
      user_id:this.appserv.getactualuser().id
    });
    this.appserv.addnewdocument(this.newdoc.value).subscribe(
      data=>{
        this.showprogress=false;
        this.appserv.modalCtrl.dismiss(data,'added');
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Document ajouté avec succès`,'danger');
      }
    )
  }

  async closemodal(){
    this.appserv.modalCtrl.dismiss();
  }
}
