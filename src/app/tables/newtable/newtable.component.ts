import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-newtable',
  templateUrl: './newtable.component.html',
  styleUrls: ['./newtable.component.scss'],
})
export class NewtableComponent implements OnInit {
  showcreatingprogress=false;
  newform=this.formbuild.group(
    {
      name:['',Validators.required],
      description:[''],
      enterprise_id:[0],
      user_id:[0],
    }
  );
  
  constructor(public appserv: AppservicesService, private formbuild: FormBuilder,private tableserv: TableService) { }

  ngOnInit() {}

  async addnew(){
    this.showcreatingprogress=true;
    
    this.newform.patchValue({
      enterprise_id:this.appserv.getactualuser().enterprise_id,
      user_id:this.appserv.getactualuser().id
    });

    this.tableserv.addnew(this.newform.value).subscribe(
      data=>{
        this.showcreatingprogress=false;
        this.appserv.presentToast(`Table ajoutée avec succès.`,'success');
        this.tableserv.addtoOffline(data);
        this.appserv.modalCtrl.dismiss(data,'added');
      },
      error=>{
        this.showcreatingprogress=false;
        this.appserv.presentToast(`Erreur lors d'enregistrement de la table`,'danger');
      }
    )
  }

}
