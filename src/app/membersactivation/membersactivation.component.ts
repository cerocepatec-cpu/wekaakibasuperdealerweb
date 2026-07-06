import { Component, OnInit,ViewChild } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { NewagentComponent } from '../agents/newagent/newagent.component';
import { EditagentComponent } from '../agents/editagent/editagent.component';
import { InfosagentComponent } from '../agents/infosagent/infosagent.component'; 
import { Users } from '../interfaces/users';
import { UsersService } from '../services/users.service';
import { PermissionsComponent } from '../roles/permissions/permissions.component';
import { PickrolesComponent } from '../roles/pickroles/pickroles.component';
import { EditroleComponent } from '../roles/editrole/editrole.component';
import { ImportComponent } from '../import/import.component';
import { IonInput } from '@ionic/angular';
import { articlePaginator } from '../interfaces/articlespaginator';
import { MembersaccountsComponent } from '../membersaccounts/membersaccounts.component';
@Component({
  selector: 'app-membersactivation',
  templateUrl: './membersactivation.component.html',
  styleUrls: ['./membersactivation.component.scss'],
})
export class MembersactivationComponent implements OnInit {

  @ViewChild('defaultinput') defaultinput!:IonInput;
  showprogress=false;
  keptUsers: Users[]=[];
  listselectedUsers: Users[]=[];
  listUsers: Users[]=[];
  listUsersKepted: Users[]=[];
  deletedUsers: Users[]=[];
  showcheckbox=false;
  keyword:any;
  paginationOptions : articlePaginator={};

  constructor(public appserv: AppservicesService, private Userserv: UsersService) { }

  ngOnInit() {
    this.getlist();
    if (this.appserv.shouldrefreshlist) {
      this.getlist();
    }
  }

  async activationmembers(criteria:any){
      const alertctrl = await this.appserv.alertctrl.create({
        message:"Validez-vous cette action?",
        mode:'ios',
        translucent:true,
        header:"Activation comptes",
        buttons:[
          {text:'Non',role:'cancel'},
          {text:'Oui',handler:async ()=> {
              const loading = await this.appserv.loadctrl.create({
                message:"Activation en cours...",
                mode:'ios',
                spinner:'circular',
              });
              loading.present();
              this.Userserv.membersactivation({criteria:criteria,enterprise_id:this.appserv.getactualEse().id}).subscribe(
                response=>{
                  loading.dismiss();
                  console.log(response);
                  if (response.message==='success' && response.status===200) {
                    this.appserv.presentToast(`${response.data} comptes activés avec succès!`,"success");
                    this.ngOnInit();
                  }
                },
                error=>{
                  loading.dismiss();
                  console.log(error);
                  this.appserv.presentToast("Une erreur est survenue lors de l'activation des comptes des membres.","danger");
                }
              );
          }}
        ]
      });

      alertctrl.present();
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }

  PageEventHandled(page: string){
    const url =page==="first-page"?this.paginationOptions.first_page_url:page==="previous-page"?this.paginationOptions.prev_page_url:page==="next-page"?this.paginationOptions.next_page_url:page==="last-page"?this.paginationOptions.last_page_url:"";
    if (this.appserv.isMyDeviceConnected()) {
        if (url!=null) {
        this.showprogress=true;
        this.appserv.gotoanypaginationurl(url).subscribe(
          data=>{
            this.paginationOptions=data;
            this.showprogress=false;
            this.listUsers=data.data;
          },error=>{
            this.showprogress=false;
          });
      }else{
        this.appserv.presentToast('Aucune donnée à afficher','warning');
      }
    }else{
      this.PageEventHandledByPage(page);
    }
  }

  
  PageEventHandledByPage(page: string){
    const currentPage =page==="first-page"?1:page==="previous-page"?this.paginationOptions.current_page-1:page==="next-page"?this.paginationOptions.current_page+1:page==="last-page"?this.paginationOptions.last_page:1;
    const data:any=[];
    
    if (typeof data !=="undefined") {
      this.paginationOptions=data;
      this.listUsers=this.paginationOptions.data; 
    }else{
      this.appserv.presentToast("Aucune donnée trouvée","warning");
    }    
  }

  handlesearchchange($event){
    console.log($event);
    if ($event.detail.value.length>0) {
      this.showprogress=true;
      this.Userserv.memberslookup({enterprise_id:this.appserv.actualEse.id,keyword:$event.detail.value}).subscribe(
        response=>{
          this.showprogress=false;
          this.listUsers=response;
          console.log('members lookup',response);
        },
        error=>{
          this.showprogress=false;
          this.appserv.presentToast("Une erreur est survenue. Veuillez réesayer","danger");
          console.log('error members lookup',error);
        }); 
    }else{
      this.listUsers=this.keptUsers;
    }
 
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };

  async importexcelfile(){
    const modal = await this.appserv.modalCtrl.create(
      {
        component:ImportComponent,
        cssClass:'modal-border-radius-20',
        componentProps:{criteria:"users"}
      });
      modal.present();
  
      const {data,role}= await modal.onWillDismiss();
      if(role=='added'){
       this.ngOnInit();
      }
  }

  editAgentStatus(user: Users,status:string){
    if (user.status===status) {
      this.appserv.presentToast('Aucune modification à éffectuer','primary');
    } else {
      user.loading=true;
      let msg =status==='enabled'?'activé':'désactivé';
      this.Userserv.edithagentstatus({user_id:user.id,status:status}).subscribe(
        response =>{
          user.loading=false;
          user.status=response.status;
          this.appserv.presentToast(`Agent ${msg} avec succès!`,'success');
        },
        error=>{
          user.loading=false;
          this.appserv.presentToast('Impossible de terminer le traitement. Veuillez réessayer','danger');
        });
    }
  }  
  
  async makeSuperAdmin(user: any){
    const alert = this.appserv.alertctrl.create({
      header:`Modification Compte`,
      subHeader:`${user.user_name}`,
      mode:'ios',
      message:`Voulez-vous donner accès à toutes les données de votre système au même titre que le propriétaire de l'Entreprise?`,
      buttons:[
        {text:'Annuler',role:'cancel'},
        {text:'Oui',handler:()=> {
          user.loading=true;
          this.Userserv.setAsSuperAdmin(user).subscribe(
            response =>{
              user.loading=false;
              user.user_type=response.user_type;
              if(response.user_type==='super_admin'){
                this.appserv.presentToast(`Agent nommé Super Admin avec succès!`,'success');        
              }else{
                this.appserv.presentToast(`Droit de  Super Admin retiré à l'agent. avec succès!`,'success');
              }
            },
            error=>{
              user.loading=false;
              this.appserv.presentToast(`Impossible de nommer l'utilisateur comme Super Admin`,'danger');
            });
        },}
      ]
    });
    (await alert).present();
   
  }

  async gotopermissions(){
    const modal = await this.appserv.modalCtrl.create({
      component:PermissionsComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async editRole(agent:Users){
    this.showprogress=true;
    this.Userserv.getRoleAndPermissions(agent.permissions).subscribe(
      async (datareturned)=>{
        this.showprogress=false;
          const modal = await this.appserv.modalCtrl.create({
              component:EditroleComponent,
              componentProps:{'actualrole':datareturned},
              cssClass:'modal-border-radius-20'
            });
            modal.present();
            const {data,role} = await modal.onWillDismiss();
            if (role=='updated') {
              agent.role_title=data.title;
              agent.role_description=data.description;
            }
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Erreur survenue lors du chargement des informations sur le rôle`,'warning');
      });
    
  }

  async menuuser(user: Users){

    if(this.showcheckbox){
      const ifexists = this.listselectedUsers.indexOf(user);
      if(ifexists==-1){
        this.listselectedUsers.push(user);
      }else{
        this.listselectedUsers=this.listselectedUsers.filter(r=>r!=user);
      }
    }else{
      let menubuttons = [
        {
          text: 'Annuler',
        role:'cancel'
        },
        {
          text: 'Comptes',
          handler: async () => {
              const modal = await this.appserv.modalCtrl.create({
                component: MembersaccountsComponent,
                componentProps: {'usersent': user},
                cssClass: 'modal-border-radius-20'
              });
              modal.present();
          }
        },
      ];
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('agents', 'edit'),
      {
        text: 'Activer',
        handler: () => {
          this.edituser(user);
        }
      })
     
      const menu = await this.appserv.actionsheetctrl.create(
        {
          header: `${user.user_name}`,
          cssClass: 'myactionsheet',
          translucent: true,
          mode: 'ios',
          buttons: menubuttons
        }
      );

      (await menu).present();
    }
  }

  async deleteuser(user: Users){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression',
      subHeader:`${user.user_name}`,
      message:'Voulez-vous vraiment supprimer cet agent?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.showprogress=true;
          this.Userserv.delete(user).subscribe(
            data=>{
              this.showprogress=false;
              if(data>0){
                this.appserv.presentToast(`Compte supprimé avec succès`,'success');
                this.listUsers=this.listUsers.filter(a=>a!=user);
                this.keptUsers=this.keptUsers.filter(a=>a!=user);
              }else{
                this.appserv.presentToast(`Opération  echouée:`,'warning');
              }
            },
            error=>{
              this.showprogress=false;
              this.appserv.presentToast(`Suppression impossible`,'danger');
            }
          );
        },}
      ]
    });
    alert.present();
  }

  async edituser(user: Users){
    const modal = await this.appserv.modalCtrl.create({
      component:NewagentComponent,
      componentProps:{'userSent':user},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async detailuser(user: Users){
    const modal = await this.appserv.modalCtrl.create({
      component:InfosagentComponent,
      componentProps:{'actualuser':user},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='deleted'){
      this.listUsers=this.listUsers.filter(a=>a!=user);
    }
  }

  getlist(){
    this.showprogress=true;
    this.Userserv.getdisableduserslist(this.appserv.getactualEse().id).subscribe(
      data=>{
        this.showprogress=false;
        console.log('members from API',data);
        data.forEach(element => {
          element.role_permissions =JSON.parse(element.role_permissions);
        });
        this.listUsers=data;
        this.keptUsers=data;
        this.appserv.shouldrefreshlist=false;
      },
      error=>{
        this.showprogress=false;
        this.appserv.shouldrefreshlist=false;
        //use the local storage
        const records = localStorage.getItem('users');
         if (records !== null) {
           this.listUsers= JSON.parse(records);
           this.keptUsers= JSON.parse(records);
         }
        this.appserv.presentToast(`Nous utilisons vos données hors ligne`,'primary');
      }
    )
  }

  async multipledelete(){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression multiple',
      mode:'ios',
      message:`Voulez-vous supprimer ce${this.listselectedUsers.length>1?'s':''} ${this.listselectedUsers.length>1?this.listselectedUsers.length:""} compte${this.listselectedUsers.length>1?'s':''}? `,
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.listselectedUsers.forEach(user => {
            this.showprogress=true;
            this.Userserv.delete(user).subscribe(
              data=>{
                this.showprogress=false;
                if(data>0){
                  this.listselectedUsers=this.listselectedUsers.filter(a=>a!=user);
                  this.deletedUsers.push(user);
                  if(this.listselectedUsers.length==0){
                    this.appserv.presentToast(`${this.deletedUsers.length} suppression${this.deletedUsers.length>1?'s':''} effectuée${this.deletedUsers.length>1?'s':''} avec succès`,'success');
                  }

                  this.listUsers=this.listUsers.filter(a=>a!=user);
                  if(this.listselectedUsers.length==0){
                    this.showcheckbox=false;
                  }
                }else{
                  this.appserv.presentToast(`Opération  echouée:`,'warning');
                }
              },
              error=>{
                this.showprogress=false;
                this.appserv.presentToast(`Suppression impossible`,'danger');
              }
            );
          });
        },}
      ]
    });
    alert.present();
  }

  filterbytype(criteria: string){
    this.listUsers=this.keptUsers.filter(a=>a.status===criteria);
  }

  deletefilter(){
    this.listUsers=this.keptUsers;
  }

   async newuser(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewagentComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
        this.listUsers.unshift(data);
    }
  }

  async pickrules(){
    const modal = await this.appserv.modalCtrl.create({
      component:PickrolesComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.onDidDismiss();
    //this.getlist(this.appserv.getactualuser().enterprise_id);
    modal.present();
  }

}
