import { Component, OnInit, Input } from '@angular/core';
import { UnitofMeasure } from 'src/app/interfaces/unitofmeasure';
import { FormBuilder, Validators } from '@angular/forms';
import { AppservicesService } from '../../services/appservices.service';
import { UnitofmeasureService } from 'src/app/services/unitofmeasure.service';

@Component({
  selector: 'app-edituom',
  templateUrl: './edituom.component.html',
  styleUrls: ['./edituom.component.scss'],
})
export class EdituomComponent implements OnInit {
  @Input() uomsent:UnitofMeasure={};
  showcreatingprogress=false;

  newuomform=this.formbuild.group({
    id:[this.uomsent.id],
    name:['',Validators.required],
    symbol:['',Validators.required],
    enterprise_id:[this.uomsent.enterprise_id],
    updated_at:[this.uomsent.updated_at],
    created_at:[this.uomsent.created_at]
  });

  constructor(private formbuild: FormBuilder,private uomserv: UnitofmeasureService, private appserv:AppservicesService) { }

  ngOnInit() {
    this.syncing();
  }

  syncing(){
    this.newuomform.patchValue({
      id:this.uomsent.id,
      name:this.uomsent.name,
      symbol:this.uomsent.symbol,
      enterprise_id:this.uomsent.enterprise_id,
      created_at:this.uomsent.created_at,
      updated_at:this.uomsent.updated_at
    });
  }

  updateincoming(data:any){
    this.uomsent.name=data.name;
    this.uomsent.symbol=data.symbol;
    this.uomsent.enterprise_id=data.enterprise_id;
    this.uomsent.updated_at=data.updated_at;
  }

  affectformtoincoming(){
    let object={name:this.newuomform.getRawValue().name,symbol:this.newuomform.getRawValue().symbol};
    return object;
  }

  edituom(){
    this.showcreatingprogress=true;
    this.uomserv.updateuom(this.newuomform.value,this.uomsent.id).subscribe(
      (data:UnitofMeasure)=>{
        this.showcreatingprogress=false;
        this.updateincoming(data);
        this.appserv.presentToast(`Unité de mesure modifiée avec succès`,'success');
        //update in local storage
        this.uomserv.updateoffline(data);
        this.appserv.modalCtrl.dismiss(data,'edited');
      },errror=>{
        this.showcreatingprogress=false;
        //update in local storage
        this.uomserv.updateoffline(this.newuomform.value);
        this.appserv.presentToast('Modification hors ligne','primary');
        this.appserv.modalCtrl.dismiss(this.newuomform.value,'edited');
      }
    )
  }

  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }
}
