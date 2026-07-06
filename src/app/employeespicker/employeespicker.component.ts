import { Component, OnInit,Input } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { SalariesService } from '../services/salaries.service';

@Component({
  selector: 'app-employeespicker',
  templateUrl: './employeespicker.component.html',
  styleUrls: ['./employeespicker.component.scss'],
})
export class EmployeespickerComponent implements OnInit {
  @Input() multiselect:any;
  @Input() criteria:any;
  selectedusers:any[]=[];
  listusers:any[]=[];
  search:any;
  constructor(public appserv:AppservicesService,private salaryserv:SalariesService) { }

  ngOnInit() {
    this.employeeslist();
  }

  sendList(){}

  sendselecteduser(){
    this.appserv.modalCtrl.dismiss(this.selectedusers,'selected');
  }

  handlesearchchange($event){}

  selected(user){
    if(this.multiselect>0 || this.criteria==="multiple"){
      const ifexists = this.selectedusers.indexOf(user);
      if(ifexists===-1){
        this.selectedusers.push(user);
        user.selected=true;
      }else{
        this.selectedusers=this.selectedusers.filter(u=>u!=user);
        user.selected=false;
      }
    }else{
      this.appserv.modalCtrl.dismiss(user,'selected');
    }
  }


  async employeeslist(){
    this.salaryserv.employeeslist({user_id:this.appserv.actualUser.id}).subscribe(
      response=>{
        console.log('salaries',response);
        if (response.message==="success" && response.status===200) {
          this.listusers=response.data;
        }
        
        if (response.message==="error" && response.status===400) {
          this.appserv.presentToast("Une erreur est survenue lors de la récupération de la liste des employés!","warning");
        }
      },error=>{
        this.appserv.presentToast("Impossible de récupérer la liste des employés.","danger");
      });
  }
}
