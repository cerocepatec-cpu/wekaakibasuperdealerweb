import { Component, Input, OnInit } from '@angular/core';
import { Users } from 'src/app/interfaces/users';
// import { Users } from 'old src/app/interfaces/users';
import { PointOfSales } from 'src/app/interfaces/pos';
import { AppComponent } from 'src/app/app.component';
// import { AppComponent } from '../../../../old src/app/app.component';
import { AppservicesService } from 'src/app/services/appservices.service';
import { UsersService } from 'src/app/services/users.service';
import { UserpickerComponent } from 'src/app/agents/userpicker/userpicker.component';
import { PosService } from 'src/app/services/pos.service';

@Component({
  selector: 'app-userspos',
  templateUrl: './userspos.component.html',
  styleUrls: ['./userspos.component.scss'],
})
export class UsersposComponent implements OnInit {
@Input() posSent: PointOfSales;
showprogress=false;
search:any;
listUsers:Users[]=[];
imgUrl=this.appserv.imgUrl;
  constructor(public appserv: AppservicesService, private userServ: UsersService, private posServ: PosService) { }

  ngOnInit() {
    this.getlistagents();
  }

  handleRefresh($event){}

  usermenu(user: Users){}

  async adduser(){
    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      componentProps:{'multiselect':true},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role}= await modal.onWillDismiss();
    if (role==='selected') {
      this.affectUsers(data);
    }
  }

  async deleteuser(user: Users){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression agent',
      mode:'ios',
      message:'Voulez-vous vraiment désaffecter cet agent de ce POS?',
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=>{
          this.showprogress=true;
          this.userServ.deleteAgentTopos({user_id:user.id,pos_id:this.posSent.id}).subscribe(
            data=>{
              this.showprogress=false;
              //console.log(data);
              this.appserv.presentToast('Agent rétiré du POS avec succès','success');
              this.listUsers=this.listUsers.filter(d=>d!=user);
            },error=>{
              this.showprogress=false;
              this.appserv.presentToast(`Erreur survenue. Nous n'avons pas pû rétirer l'agent`,'danger');
            });
        }}
      ]
    });
    alert.present();
  }
  
  async affectUsers(list: Users[]){
    const load = await this.appserv.loadctrl.create({
      mode:'ios',
      translucent:true,
      message:'Affectation en cours...',
      spinner:'dots'
    });
    load.present();
    let object =[];
    list.forEach(el => {
      object.push({user_id:el.id,pos_id:this.posSent.id});
    });
    this.posServ.affectUsers({users:object}).subscribe(
      data=>{
        load.dismiss();
        this.listUsers=this.listUsers.concat(data);
        //console.log(data);
        this.appserv.presentToast(`Affectation terminée avec succès`,'success');
      },
      error=>{
        load.dismiss();
        this.appserv.presentToast(`Une erreur est survenue lors de l'affectation des agents au POS`,'danger');
      });
  }

  getlistagents(){
    this.showprogress=true;
    this.posServ.getlistagents(this.posSent.id).subscribe(
      data=>{
        this.showprogress=false;
        this.listUsers=data;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Erreur survenue lors de la receuperation de la liste des agents du POS`,'danger');
      });
  }
}
