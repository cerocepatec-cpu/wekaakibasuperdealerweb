import { Component, OnInit,Input } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { SalariesService } from '../services/salaries.service';

@Component({
  selector: 'app-editsalary',
  templateUrl: './editsalary.component.html',
  styleUrls: ['./editsalary.component.scss'],
})
export class EditsalaryComponent implements OnInit {
  @Input() agent:any={};
  positionslist:any[]=[];

  constructor(public appserv: AppservicesService,private salaryserv:SalariesService) { }

  ngOnInit() {
    this.getpositionslist();
  }
  
  async getpositionslist(){
    this.salaryserv.getpositionslist({user_id:this.appserv.actualUser.id}).subscribe(
      response=>{
        if (response.message==="success" && response.status===200) {
          this.positionslist=response.data;
        }
        
        if (response.message==="error" && response.status===400) {
          this.appserv.presentToast("Une erreur est survenue lors de la récupération de la liste des postes!","warning");
        }
      },error=>{
        this.appserv.presentToast("Impossible de récupérer la liste des postes.","danger");
      });
  }

  async editsalary(){
    this.salaryserv.update(this.agent).subscribe(
      response=>{
        if (response.message==="success" && response.status===200) {
          this.appserv.presentToast("Employé modifié avec succès!","success");
          this.appserv.modalCtrl.dismiss(response.data,"updated");
        } 
        
        if (response.message==="error" && response.status===400) {
          if (response.error==="no employee find") {
            this.appserv.presentToast("Impossible de modifier la fiche d'employé! Employé non trouvé dans la base de données.","warning");
          }
        }
        console.log('response from api on update salary',response);
      },
      error=>{
        this.appserv.presentToast("Une erreur est survenue lors de la modification.","danger");
      });
  }

}
