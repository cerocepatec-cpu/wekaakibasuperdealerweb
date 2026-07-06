import { Component, OnInit, ViewChild } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { TableService } from 'src/app/services/table.service';
import { NewtableComponent } from '../newtable/newtable.component';
import { Tables } from '../../interfaces/tables';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-tablepicker',
  templateUrl: './tablepicker.component.html',
  styleUrls: ['./tablepicker.component.scss'],
})
export class TablepickerComponent implements OnInit {
  @ViewChild('inputSearch') input!: IonInput;
  search:any;
  listables : Tables[]=[];
  showprogress=false;

constructor(public appserv: AppservicesService, private tableserv: TableService) { }

  ngOnInit() {
    this.getlist();
  }

  ionViewDidEnter() {
    this.input.setFocus();
  }
  
  getlist(){
    this.tableserv.getlist(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.showprogress=false;
        this.listables=data;
        this.tableserv.setofflinedata(data);
      },
      error=>{
        this.showprogress=false;
        this.listables=this.tableserv.getofflinedata();
      });
  }

  async addnewtable(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewtableComponent
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
      this.listables.unshift(data);
    }
  }

  selected(table: Tables){
    this.appserv.modalCtrl.dismiss(table,'selected');
  }
}
