import { Component, OnInit, Input } from '@angular/core';
import { UserpickerComponent } from 'src/app/agents/userpicker/userpicker.component';
import { MarginsSettings } from 'src/app/interfaces/margins-settings';
import { Users } from 'src/app/interfaces/users';
import { AppservicesService } from 'src/app/services/appservices.service';
import { MarginUsersService } from 'src/app/services/margin-users.service';

@Component({
  selector: 'app-infosmaginexpenditures',
  templateUrl: './infosmaginexpenditures.component.html',
  styleUrls: ['./infosmaginexpenditures.component.scss'],
})
export class InfosmaginexpendituresComponent implements OnInit {
@Input() marginSent:MarginsSettings;
listusers:Users[]=[];
showprogress=false;
constructor(public appserv: AppservicesService, private marginUserServ: MarginUsersService) { }
  search:any;
  ngOnInit() {
    this.getlist();
  }

  getlist(){
    this.showprogress=true;
    this.marginUserServ.list(this.marginSent.id).subscribe(
      data=>{
        this.showprogress=false;
        this.listusers=data;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Erreur lors de la recuperation de la liste des agents affectés à cette marge!`,'danger');
      });
  }

  async pickusers(){
    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{'multiselect':1,'listsent':this.listusers},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      //send users affectation to the API
      const object =[];
      this.showprogress=true;
      data.forEach(user => {
        const toadd = {limit_id:this.marginSent.id,user_id:user.id};
        object.push(toadd);
      });
      
      this.marginUserServ.new({list:object}).subscribe(
            (datasent:any)=>{
              this.showprogress=false;
              this.appserv.presentToast(`Affectation effectuée avec succès!`,'success');
              this.listusers=datasent;    
            },
            error=>{
                this.appserv.presentToast(`Erreur. L'affectation ne s'est pas terminée avec succès!`,'warning');
            });
    }
  }

  async menuparticipant(user: Users){
    const actionSheet = await this.appserv.actionsheetctrl.create({
      header:user.user_name,
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Annuler',role:'cancel'},
        {text:'Infos',handler:()=> {
            this.InfosUser(user);
        },},
        {text:'Supprimer',handler:()=> {
            this.deleteAffectation(user);
        },}
      ]
    });

    actionSheet.present();
  }

  async deleteAffectation(user:Users){
    const alert = await this.appserv.alertctrl.create({
      header:"Suppression",
      subHeader:user.user_name,
      mode:'ios',
      translucent:true,
      message:"Voulez-vous vraiment supprimer cet agent?",
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=> {
            this.showprogress=true;
            this.marginUserServ.delete(user).subscribe(
              data=>{
                this.showprogress=false;
                if (data.message==='deleted') {
                  this.listusers=this.listusers.filter(m=>m!==user);
                  this.appserv.presentToast("Utiisateur supprimé avec succès",'success');
                }else{
                  this.appserv.presentToast("Impossible de supprimer l'agent. Veuillez réssayer.",'warning');
                }
              },error=>{
                this.appserv.presentToast("Erreur survenue lors de la suppression de l'agent",'danger');
              }
            )
        },}
      ]
    });
    alert.present();
  }

  InfosUser(user:Users){}
}
