import { Component, OnInit,ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { SalariesService } from '../services/salaries.service';

@Component({
  selector: 'app-newposition',
  templateUrl: './newposition.component.html',
  styleUrls: ['./newposition.component.scss'],
})
export class NewpositionComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!: IonInput;
  showcreatingprogress=false;
  newpositionform=this.fb.group({
    name:['',Validators.required],
    description:[],
    salary_percentage:[],
    participation_rate:[100],
    salary_amount:[],
    method_of_calculation:['',Validators.required],
    done_by:[],
    enterprise_id:[]
  });
  constructor(public appserv: AppservicesService,private fb:FormBuilder,private salaryserv: SalariesService) { }

  ngOnInit() {
    this.newpositionform.patchValue({
      method_of_calculation:'percentage',
      done_by:this.appserv.actualUser.id,
      enterprise_id:this.appserv.actualEse.id
    });
  }
  
  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }

  async addnewposition(){
    if (this.newpositionform.getRawValue().enterprise_id && this.newpositionform.getRawValue().done_by) {
      if (this.newpositionform.getRawValue().name && this.newpositionform.getRawValue().method_of_calculation) {
        if (this.newpositionform.getRawValue().method_of_calculation==="percentage") {
          if (this.newpositionform.getRawValue().salary_percentage>0) {
              this.sentpositiontoserver();
          }else{
            this.appserv.presentToast("Le pourcentage doit être supérieur à Zéro!","warning");
          }
        }else if (this.newpositionform.getRawValue().method_of_calculation==="amount") {
          if (this.newpositionform.getRawValue().salary_amount>0) {
            this.sentpositiontoserver();
          }else{
            this.appserv.presentToast("Le montant du salaire doit être supérieur à Zéro!","warning");
          }
        }else{
          this.appserv.presentToast("Vous devez sélectionner une méthode de calcule par défaut.","warning");
        }
      }
    }else{
      this.appserv.presentToast("Nous n'arrivons pas à vous identifier! Veuillez vous reconnecter svp!","warning");
    }
  }

  async sentpositiontoserver(){
    const load = await this.appserv.loadctrl.create({
      message:"Creation poste en cours...",
      spinner:'circular',
      mode:'ios',
      translucent:true
    });
    load.present();
    this.salaryserv.newposition(this.newpositionform.value).subscribe(
      response=>{
        load.dismiss();
        console.log(response);
        if (response.message==="success" && response.status===200) {
          this.appserv.presentToast("Poste ajouté avec succès.","success");
          this.appserv.modalCtrl.dismiss(response.data,"created");

        }
        
        if (response.message==="error" && response.status===400) {
          if (response.error==="duplicated") {
            this.appserv.presentToast("Veuillez modifier le nom du poste car il en existe un autre portant le même nom svp!","warning");
          } 
          
          if (response.error==="unauthorized") {
            this.appserv.presentToast("Vous n'êtes pas autorisé à créer le poste!","warning");
          }
        }
      },
      error=>{
        load.dismiss();
        this.appserv.presentToast("Impossible d'enregistrer le poste.","danger");
      });
  }
}
