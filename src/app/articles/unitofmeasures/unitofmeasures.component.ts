import { UnitofMeasure } from './../../interfaces/unitofmeasure';
import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { FormBuilder } from '@angular/forms';;
import { Users } from 'src/app/interfaces/users';
import { EdituomComponent } from '../edituom/edituom.component';
import { UnitofmeasureService } from 'src/app/services/unitofmeasure.service';

@Component({
  selector: 'app-unitofmeasures',
  templateUrl: './unitofmeasures.component.html',
  styleUrls: ['./unitofmeasures.component.scss'],
})
export class UnitofmeasuresComponent implements OnInit {
  actualuser:any;
  listunitofmeasures:UnitofMeasure[]=[];
  newuomform=this.formbuild.group({
    name:[],
    symbol:[],
    enterprise_id:[]
  });

  showcreatingprogress=false;
  showlistgroup=false;

  constructor(private uomserv:UnitofmeasureService,private appserv : AppservicesService, private formbuild: FormBuilder) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    this.getlistuom();
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
          this.listunitofmeasures.unshift(data);
          this.newuomform.reset();
        },
        error=>{
          this.showcreatingprogress=false;
          this.appserv.presentToast(`Erreur survenue lors de l'insertion`,'danger');
        }
      );
    }else{
      this.appserv.presentToast(`Veuillez entrer le nom svp!`,'warning');
    }
  }

  async gototoedit(uom: UnitofMeasure){
    const modal = this.appserv.modalCtrl.create({
      component:EdituomComponent,
      componentProps:{'uomsent':uom}
    });
    (await modal).present();
  }

  getlistuom(){
    this.uomserv.getallunitofmeasure(this.actualuser.enterprise_id).subscribe(
      data=>{
        this.listunitofmeasures=data;
      },error=>{
        this.appserv.presentToast(`Erreur lors de la recupération de la liste des Unités de mesure`);
      });
  }
}
