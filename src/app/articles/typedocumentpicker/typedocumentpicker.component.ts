import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { Typedocument } from 'src/app/interfaces/typedocument';
import { AddnewdocumentComponent } from '../addnewdocument/addnewdocument.component';

@Component({
  selector: 'app-typedocumentpicker',
  templateUrl: './typedocumentpicker.component.html',
  styleUrls: ['./typedocumentpicker.component.scss'],
})
export class TypedocumentpickerComponent implements OnInit {
listdocuments: Typedocument[]=[];
showprogress=false;

  constructor(private appserv: AppservicesService) { }

  ngOnInit() {
    this.getlistdocuments();
  }

  async addnewdocument(){
    const modal = await this.appserv.modalCtrl.create({
      component:AddnewdocumentComponent
    });
    (await modal).present();

    const {data,role}= await modal.onWillDismiss();
      if(role=='added'){
       this.listdocuments.push(data);
      }
  }

  async selected(doc: Typedocument){
    this.appserv.modalCtrl.dismiss(doc,'selected');
  }

  getlistdocuments(){
    this.showprogress=true;
    this.appserv.getalllistdocuments(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.showprogress=false;
        this.listdocuments=data;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast('Erreur lors du chargement de la liste des documents','danger');
      }
    )
  }

}
