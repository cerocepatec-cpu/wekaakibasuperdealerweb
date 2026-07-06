import { Component, OnInit, ViewChild } from '@angular/core';
import { Users } from '../interfaces/users';
import { Router } from '@angular/router';
import { MembersaccountsService } from '../services/membersaccounts.service';
import { AppservicesService } from '../services/appservices.service';
import { AddnewponsoredComponent } from '../addnewponsored/addnewponsored.component';
import { IonInput } from '@ionic/angular';
import { articlePaginator } from '../interfaces/articlespaginator';

@Component({
  selector: 'app-detailsponsorship',
  templateUrl: './detailsponsorship.component.html',
  styleUrls: ['./detailsponsorship.component.scss'],
})
export class DetailsponsorshipComponent implements OnInit {
@ViewChild('defaultinput') defaultinput!:IonInput;
paginationOptions : articlePaginator={};
 agent: Users | null = null;
  members: Users[] = [];
  filteredMembers: Users[] = [];
  searchTerm = '';
  showdefaultprogress=false;
  currentPage = 1;
  pageSize = 5;

   constructor(private router: Router,private memberacountserv:MembersaccountsService, public appserv:AppservicesService) {
    const nav = this.router.getCurrentNavigation();
    this.agent = (nav?.extras?.state?.['agent'] as Users) || null;
  }

  ngOnInit() {
    if (!this.agent) {
      this.router.navigate(['/uzisha/sponsoring']);
    }else{
      this.agent = history.state.agent;
      this.getsponsorised();
    }
  }

  ionViewDidEnter(){
    setTimeout(() => {
        this.defaultinput.setFocus();
      },100);
  }

  async memberspicquer(){
    const modal = await this.appserv.modalCtrl.create({
      component:AddnewponsoredComponent,
      componentProps:{multiselect:1},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==="selected") {
      if (data.length>0) {
        this.addMember(data);
      }
    }
  }

  async getsponsorised(){
     const load = await this.appserv.loadctrl.create({
        message:"Chargement en cours...",
        mode:'ios',
        translucent:true,
        spinner:'circles'
      });
      load.present();
       this.showdefaultprogress=true;
    this.memberacountserv.getsponsorised(this.agent.id).subscribe(
      response=>{
        load.dismiss();
         this.showdefaultprogress=false;
        console.log('sponsorised members',response);
        if (response.message==='success' && response.data) {
           this.paginationOptions=response.data;
           console.log('pagination data',response);
          this.members=response.data.data;
        }
      },
      error=>{
         this.showdefaultprogress=false;
        load.dismiss();
        this.appserv.presentToast("Erreur lors du chargement des membres parrainés!","danger");
      });
  }

  
  PageEventHandled(page: string){
    const url =page==="first-page"?this.paginationOptions.first_page_url:page==="previous-page"?this.paginationOptions.prev_page_url:page==="next-page"?this.paginationOptions.next_page_url:page==="last-page"?this.paginationOptions.last_page_url:"";
    this.members=[];
      if (url!=null) {
        this.showdefaultprogress=true;
        this.appserv.gotoanypaginationurl(url).subscribe(
          response=>{
            this.showdefaultprogress=false;
              if (response.message==='success' && response.data) {
                this.paginationOptions=response.data;
                this.members=response.data.data;
              }
          },error=>{
            this.showdefaultprogress=false;
          });
      }else{
        this.appserv.presentToast('Aucune donnée à afficher','warning');
      }
    
  } 

  async addMember(data:Users[]) {
    if (data.length>0) {
      const load = await this.appserv.loadctrl.create({
        message:"Parrainage en cours...",
        mode:'ios',
        translucent:true,
        spinner:'circles'
      });
      load.present();
      this.memberacountserv.createsponsoring({user:this.agent.id,members:data}).subscribe({
        next:(response)=>{
          load.dismiss();
          if (response.message==="success" && response.status===200) {
            this.appserv.presentToast("Parrainage terminé avec succès!","success");
            this.members=this.members.concat(response.data);
          }

          if (response.message==="error" && response.status!==200) {
            this.appserv.presentToast("Parrainage échoué!","warning");
          }
        },
        error:(err)=>{
          load.dismiss();
          this.appserv.presentToast("Parrainage échoué! Une erreur est survenue.","danger");
        },
        complete:()=>{}
      });
    }else{
      this.appserv.presentToast("Vous devez séléctionner au moins un membre!","warning");
    }
  }

  async removeMember(member: Users) {
    const members =[];
    members.push(member);
    const load = await this.appserv.loadctrl.create({
      message:"Retrait de la liste...",
      mode:'ios',
      translucent:true,
      spinner:'circles'
    });
    load.present();
    this.memberacountserv.removesponsoring({user:this.agent.id,members:members}).subscribe(
      {
        next:(response)=>{
          load.dismiss();
          if (response.message==="success" && response.status===200) {
            this.members = this.members.filter(m => m.id !== member.id);
            this.appserv.presentToast("Parrainage supprimé avec succès!","success");
          }
        },
        error:(err)=>{
          console.log(err);
          load.dismiss();
          this.appserv.presentToast("Erreur de suppression!","danger");
        },
        complete:()=>{}
      });
  }

}
