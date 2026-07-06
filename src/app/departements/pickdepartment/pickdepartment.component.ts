import { Component, OnInit, Input } from '@angular/core';
import { Departments } from '../../interfaces/departments';
import { AppServicesService } from '../../services/app-services.service';

@Component({
  selector: 'app-pickdepartment',
  templateUrl: './pickdepartment.component.html',
  styleUrls: ['./pickdepartment.component.scss'],
})
export class PickdepartmentComponent implements OnInit {
@Input() selectedoption: any;
listdeparts: Departments[]=[];
listselected: Departments[]=[];
showprogress=false;
search: any;
  constructor(public appserv: AppServicesService) { }

  ngOnInit() {
    this.getlistdeparts();
  }

  getlistdeparts(){
    const object ={userid:this.appserv.actualUser.id};
    this.showprogress=true;
    this.appserv.getdepartmentuser(object).subscribe(
      data=>{
        this.showprogress=false;
        this.listdeparts=data;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`${this.appserv.translate.instant('unable to load list of departments')}`,'danger');
      }
    );}

    addtolist(depart: Departments){
      if(this.selectedoption==='multiple'){
        const ifexists = this.listselected.indexOf(depart);
        if(ifexists===-1){
          this.listselected.push(depart);
        }else{
          this.listselected=this.listselected.filter(r=>r!==depart);
        }
      }else{
        depart.selected=true;
        this.appserv.modalCtrl.dismiss(depart,'selected');
      }
    }

    senddata(){
      if (this.listselected.length>0) {
         this.appserv.modalCtrl.dismiss(this.listselected,'selected');
      }else{
        this.appserv.presentToast(`${this.appserv.translate.instant('please select at least one department')}`,'warning');
      }
    }

}
