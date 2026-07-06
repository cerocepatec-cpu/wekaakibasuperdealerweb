import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { IonInput } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-editwekagroup',
  templateUrl: './editwekagroup.component.html',
  styleUrls: ['./editwekagroup.component.scss'],
})
export class EditwekagroupComponent implements OnInit {
  @ViewChild('groupinput') groupinput! : IonInput; 
  @Input() groupsent:any;
  groupform=this.fb.group(
    {
      id:[0],
      name: [''],
      description: [''],
    });
  constructor(public appserv:AppservicesService,private fb:FormBuilder,private groupserv:GroupService) { }

  ngOnInit() {
    this.groupform.patchValue({
      id:this.groupsent.id,
      name:this.groupsent.name,
      description:this.groupsent.description
    });
  }

  nextstep(){
    if (this.groupsent.name===this.groupform.getRawValue().name) {
      this.appserv.presentToast("Aucune modification faite.","warning");
    }
    else if(!this.groupform.getRawValue().name){
      this.appserv.presentToast("Veuillez compléter le nom du groupe svp!","warning");
    }else{
      this.groupserv.update(this.groupform.value).subscribe(
        response=>{
          this.appserv.modalCtrl.dismiss(response,'updated');
          console.log('group updated',response);
        },error=>{
          this.appserv.presentToast("Impossible de modifier le groupe!","danger");
        }
      );
    }
  }

  ionViewDidEnter(){
    this.groupinput.setFocus();
  }
  handlegroupenamechange($event){}
}
