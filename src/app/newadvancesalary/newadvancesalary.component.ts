import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Money } from '../interfaces/money';
import { MoneyService } from '../services/money.service';
import { IonInput } from '@ionic/angular';
import { SalariesService } from '../services/salaries.service';

@Component({
  selector: 'app-newadvancesalary',
  templateUrl: './newadvancesalary.component.html',
  styleUrls: ['./newadvancesalary.component.scss'],
})
export class NewadvancesalaryComponent implements OnInit {
  @Input() agentsent:any={};
  @Input() advancesent:any={};
  @ViewChild('defaultinput') defaultinput :IonInput;
  listmoney:Money[]=[];
  newadanceform=this.formbuild.group({
    id:[],
    agent_id:[0,Validators.required],
    description: [],
    amount: ['',Validators.required],
    money_id: ['',Validators.required],
    done_by_id: [0,Validators.required],
    enterprise_id:[0,Validators.required],
    done_at:[],
    status:[]
  });
  constructor(public appserv:AppservicesService,private formbuild:FormBuilder,private moneyserv:MoneyService,private salaryserv:SalariesService) { }

  ngOnInit() {
    this.getlistMoney();
    if (this.advancesent.id) {
      console.log('avance envoyee',this.advancesent);
      this.newadanceform.patchValue({
        id:this.advancesent.id,
        agent_id:this.advancesent.agent_id,
        done_by_id:this.advancesent.done_by_id,
        enterprise_id:this.advancesent.enterprise_id,
        amount:this.advancesent.amount,
        description:this.advancesent.description,
        done_at:this.advancesent.done_at,
        money_id:this.advancesent.money_id,
        status:this.advancesent.status
      });
    }else{
      console.log('agent envoye',this.agentsent);
      this.newadanceform.patchValue({
        agent_id:this.agentsent.agent_id,
        done_at:this.appserv.defaultdate(),
        done_by_id:this.appserv.actualUser.id,
        enterprise_id:this.appserv.actualEse.id,
        status:'pending'
      });
    }
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }

  async deleteadvancesent(){
    const load  = await this.appserv.loadctrl.create({
      message:"Suppression en cours...",
      translucent:true,
      spinner:'circles',
      mode:'ios'
    });
    load.present();
    this.salaryserv.deleteadvancesalary(this.newadanceform.value).subscribe(
      response=>{
        if (response.message==="success" && response.status===200) {
          this.appserv.presentToast("Avance sur salaire supprimée avec succès!","success");
          this.advancesent.status=response.data.status;
          this.appserv.modalCtrl.dismiss(response.data,"cancelled");
        }
        
        if (response.message==="error" && response.status===400) {
          switch (response.error) {
            case "enterprise not sent":
              this.appserv.presentToast("Entreprise introuvable.Veuillez réessayer svp!","warning");
              break;
            case "agent not sent":
              this.appserv.presentToast("Agent introuvable.Veuillez réessayer svp!","warning");
              break; 
            case "money not sent":
              this.appserv.presentToast("Monnaie introuvable.Veuillez réessayer svp!","warning");
              break; 
            case "impossible to save":
              this.appserv.presentToast("Impossible de terminer l'opération!","warning");
              break;
            default:
              break;
          }
        }
        console.log('deleting advance salary',response);
        load.dismiss();
      },
      error=>{
        console.log('deleting advance salary',error);
        this.appserv.presentToast("Impossible de supprimer l'opération.Veuillez réessayer svp!","danger");
        load.dismiss();
      });
  }

  async validateoperation(){
    if (this.advancesent.id) {
      this.updateadvance();
    }else{
      const load  = await this.appserv.loadctrl.create({
        message:"Enregistrement en cours...",
        translucent:true,
        spinner:'circles',
        mode:'ios'
      });
      load.present();
      this.salaryserv.newadvancesalary(this.newadanceform.value).subscribe(
        response=>{
          if (response.message==="success" && response.status===200) {
            this.appserv.presentToast("Avance sur salaire enregistrée avec succès!","success");
            this.appserv.modalCtrl.dismiss(response.data,"added");
          }
          
          if (response.message==="error" && response.status===400) {
            switch (response.error) {
              case "enterprise not sent":
                this.appserv.presentToast("Entreprise introuvable.Veuillez réessayer svp!","warning");
                break;
              case "agent not sent":
                this.appserv.presentToast("Agent introuvable.Veuillez réessayer svp!","warning");
                break; 
              case "money not sent":
                this.appserv.presentToast("Monnaie introuvable.Veuillez réessayer svp!","warning");
                break; 
              case "impossible to save":
                this.appserv.presentToast("Impossible d'enregistrer l'opération!","warning");
                break;
              default:
                break;
            }
          }
          console.log('new advance salary',response);
          load.dismiss();
        },
        error=>{
          console.log('new advance salary',error);
          this.appserv.presentToast("Impossible d'enregistrer l'opération.Veuillez réessayer svp!","danger");
          load.dismiss();
        });
    }
    
  }

  async updateadvance(){
    const load  = await this.appserv.loadctrl.create({
      message:"Modification en cours...",
      translucent:true,
      spinner:'circles',
      mode:'ios'
    });
    load.present();
    this.salaryserv.updateadvancesalary(this.newadanceform.value).subscribe(
      response=>{
        console.log('update advance salary',response);
        if (response.message==="success" && response.status===200) {
          this.appserv.presentToast("Avance sur salaire modifiée avec succès!","success");
          this.appserv.modalCtrl.dismiss(response.data,"updated");
        }
        
        if (response.message==="error" && response.status===400) {
          switch (response.error) {
            case "enterprise not sent":
              this.appserv.presentToast("Entreprise introuvable.Veuillez réessayer svp!","warning");
              break;
            case "agent not sent":
              this.appserv.presentToast("Agent introuvable.Veuillez réessayer svp!","warning");
              break; 
            case "money not sent":
              this.appserv.presentToast("Monnaie introuvable.Veuillez réessayer svp!","warning");
              break; 
            case "impossible to save":
              this.appserv.presentToast("Impossible d'enregistrer l'opération!","warning");
              break;
            default:
              break;
          }
        }
        
        load.dismiss();
      },
      error=>{
        console.log('update advance salary',error);
        this.appserv.presentToast("Impossible de modifier l'avance sur salaire.Veuillez réessayer svp!","danger");
        load.dismiss();
      });
  }

  getlistMoney(){
    this.moneyserv.getlistmonnaiesapi(this.appserv.actualEse.id).subscribe(
      data=>{
        this.listmoney=data;
      },
      error=>{
        this.appserv.presentToast('Erreur survenue lors de la recupération de la liste des monnaies.','danger');
      }
    );
  }

}
