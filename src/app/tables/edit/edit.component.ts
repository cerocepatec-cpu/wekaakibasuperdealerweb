import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { AppservicesService } from '../../services/appservices.service';
import { TableService } from '../../services/table.service';
import { Tables } from '../../interfaces/tables';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  @Input() tablesent :Tables={};
  showcreatingprogress=false;

  newform=this.formbuild.group(
    {
      id:[0],
      name:['',Validators.required],
      description:[''],
    }
  );
  constructor(private formbuild: FormBuilder, public appserv: AppservicesService, private tableserv : TableService) { }

  ngOnInit() {
    this.newform.patchValue({
      id:this.tablesent.id,
      name:this.tablesent.name,
      description:this.tablesent.description
    });
  }

  async edit(){
    this.showcreatingprogress=true;
    
    this.tableserv.edit(this.newform.value,this.tablesent.id).subscribe(
      data=>{
        this.showcreatingprogress=false;
        this.appserv.presentToast(`Table modifiée avec succès.`,'success');
        this.tablesent.name=data.name;
        this.tablesent.description=data.description;
        this.tablesent.updated_at=data.updated_at;
        this.tablesent.created_at=data.created_at;
        this.appserv.modalCtrl.dismiss(data,'edited');
      },
      error=>{
        this.showcreatingprogress=false;
        this.appserv.presentToast(`Modification impossible. Veuillez vérifier votre connexion.`,'danger');
      }
    )
  }
}
