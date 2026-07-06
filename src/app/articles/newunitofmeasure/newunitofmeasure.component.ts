import { UnitofMeasure } from './../../interfaces/unitofmeasure';
import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { FormBuilder } from '@angular/forms';
import { Users } from '../../interfaces/users';
import { EdituomComponent } from '../edituom/edituom.component';
import { UnitofmeasureService } from '../../services/unitofmeasure.service';

@Component({
  selector: 'app-newunitofmeasure',
  templateUrl: './newunitofmeasure.component.html',
  styleUrls: ['./newunitofmeasure.component.scss'],
})
export class NewunitofmeasureComponent implements OnInit {
  @Input()  listunitofmeasures: UnitofMeasure[]=[];
  
  keptlist: UnitofMeasure[]=[];
  actualuser:Users={};
  newuomform=this.formbuild.group({
    name:[],
    symbol:[],
    enterprise_id:[0]
  });

  showcreatingprogress=false;
  showlistgroup=false;

  constructor(private appserv : AppservicesService,private uomserv:UnitofmeasureService, private formbuild: FormBuilder) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    this.keptlist=this.listunitofmeasures;
  }

  closemodal(){
    this.appserv.closemodal();
  }

  addnewuom(){
    if(this.newuomform.get('name')?.value){
      this.showcreatingprogress=true;
      this.newuomform.patchValue({
        enterprise_id:this.actualuser.enterprise_id
      });
      this.uomserv.addnewuomapi(this.newuomform.value).subscribe(
        data=>{
          this.showcreatingprogress=false;
          this.appserv.presentToast(`Unité de mesure ajoutée avec succès`,'success');
          this.appserv.modalCtrl.dismiss(data,'added');
          //add to local storage
          this.uomserv.saveoffline(data);
        },
        error=>{
          this.showcreatingprogress=false;
          let object =
            {
                id:this.uomserv.getofflinelist().length+1,
                name:this.newuomform.getRawValue().name,
                symbol: this.newuomform.getRawValue().symbol,
                enterprise_id:this.newuomform.getRawValue().enterprise_id,
                created_at:Date(),
                updated_at:Date()
            };
          this.uomserv.saveoffline(object);
          this.appserv.presentToast(`Enregistrement hors ligne`,'primary');
          this.appserv.modalCtrl.dismiss(object,'added');
        }
      );
    }else{
      this.appserv.presentToast(`Veuillez entrer le nom svp!`,'warning');
    }
  }

  async gotoedit(uom: UnitofMeasure){
    const modal = await this.appserv.modalCtrl.create({
      component:EdituomComponent,
      componentProps:{"uomsent":uom}
    });
    modal.present();
  }

  async search(event: any){
    const key = event.target.value.toLowerCase();
    this.listunitofmeasures=this.keptlist.filter((u:any)=>u.name.toLowerCase().indexOf(key) > -1);
  }
}
