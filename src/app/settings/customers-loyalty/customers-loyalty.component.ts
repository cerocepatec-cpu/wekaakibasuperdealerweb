import { Component, OnInit } from '@angular/core';
import { UserpickerComponent } from 'src/app/agents/userpicker/userpicker.component';
import { Enterprise } from 'src/app/interfaces/enterprise';
import { PointOfSales } from 'src/app/interfaces/pos';
import { Users } from 'src/app/interfaces/users';
import { NewposComponent } from 'src/app/pointofsales/newpos/newpos.component';
import { AppservicesService } from 'src/app/services/appservices.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { PosService } from 'src/app/services/pos.service';

@Component({
  selector: 'app-customers-loyalty',
  templateUrl: './customers-loyalty.component.html',
  styleUrls: ['./customers-loyalty.component.scss'],
})
export class CustomersLoyaltyComponent implements OnInit {
actualEse:Enterprise={};
listUsers:Users[]=[];
search:any;
listpos: PointOfSales[]=[];
showprogress=false;
  constructor(private posServ:PosService, private authService:AuthentificationService, public appserv: AppservicesService, private eseserv: EnterpriseService) { }

  ngOnInit() {
    this.getingEseInfos();
    this.getlistpos();
  }


  deleteuser(user:Users,pos:PointOfSales){
    this.posServ.deleteuseraffectationpos({user_id:user.id,pos_id:pos.id}).subscribe(
      response=>{
        console.log(response);
        pos.users=pos.users.filter(u=>u!==user);
        this.appserv.presentToast(`Utilisateur rétiré avec succès`,'success');
      },
      error=>{
        console.log(error);
        this.appserv.presentToast('Une erreur est survenue. Vous pouvez réessayer!','danger');
      });
  }

  usermenu(user:Users){

  }

  updatepos(pos:PointOfSales){
    this.posServ.editpos(pos).subscribe(
      data=>{
        pos=data;
        this.appserv.presentToast(`Groupe mis à jour avec succès`,'success');
      },
      error=>{
        this.appserv.presentToast('Une erreur est survenue lors de la mise à jour du groupe','danger');
      });
  }

  async newPos(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewposComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const{data,role} = await modal.onWillDismiss();
    if (role==='added') {
      this.listpos.unshift(data);
    }
  }
  getlistpos(){
  
    this.posServ.getlistpos(this.appserv.actualUser.enterprise_id).subscribe(
      data=>{
        this.listpos=data;
        console.log(data);
      },
      error=>{
        this.appserv.presentToast('Une erreur est survenue lors du chargement de la liste des points des ventes','danger');
      });
  }

  async pickusers(pos:PointOfSales){

    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{'multiselect':1,'listsent':this.listUsers},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      //send users affectation to the API
      this.showprogress=true;
      data.forEach(agent => {
        this.posServ.newuseraffectationpos({user_id:agent.id,pos_id:pos.id}).subscribe(
          (response:any)=>{
            if (response.message==="success") {
              pos.users.push(response.data);
            }else if(response.message==="already affected"){
              this.appserv.presentToast(`Utilisateur ${agent.user_name} déjà affecté.`,"warning");
            }
          },
          error=>{
            this.appserv.presentToast(`Impossible d'affecter ${agent.user_name}`,"danger");
          });
      });

      if(data.length===0){
        this.showprogress=false;
        // this.appserv.presentToast(`Affectation terminée!`,'primary');
      }
    }
  }

  getingEseInfos(){
    this.authService.getingEseInfos(this.appserv.getactualuser().enterprise_id).subscribe(
    data=>{
      console.log(data);
      this.actualEse=data;
    },
    error=>{
      this.appserv.presentToast("Aucune entreprise configurée","warning");
    });
  }

  async updatefidelitypointvalue($event){
    console.log($event.detail.value);
    this.actualEse.fidelitypointvalue=$event.detail.value;
    await this.updateEse("point");
  }

  async updateEse(criteria: string){
    console.log(criteria);
    this.actualEse.fidelitydefaultmode=criteria;
    this.eseserv.update(this.actualEse).subscribe(
      response=>{
        if (response.message && response.message==='updated') {
          this.appserv.presentToast('Entreprise mise à jour avec succès.','success');
          this.appserv.setactualenterprise(response.enterprise);
          this.actualEse=response.enterprise;
        }else{
          this.appserv.presentToast('Mise à jour échouée. Veuillez réssayer.','primary');
        }
        console.log(response);
        
      },
      error=>{
        this.appserv.presentToast("Une erreur s'est produite lors de l'enregistrement de la fidelisation","danger");
      });
  }
}
