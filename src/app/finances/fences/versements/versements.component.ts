import { NewticketingComponent } from './../../../fences/versements/newticketing/newticketing.component';
import { Component, OnInit, Input } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { Fences } from 'src/app/interfaces/fences';
import { FenceService } from 'src/app/services/fence.service';
import { InfosfenceComponent } from 'src/app/finances/fences/infosfence/infosfence.component';
import { EditfenceComponent } from 'src/app/finances/fences/editfence/editfence.component';
import { NewfenceComponent } from 'src/app/finances/fences/newfence/newfence.component';
import { FenceTicketing } from 'src/app/interfaces/fenceticketing';

@Component({
  selector: 'app-versements',
  templateUrl: './versements.component.html',
  styleUrls: ['./versements.component.scss'],
})
export class VersementsComponent implements OnInit {
@Input() fencesent: Fences={};
  showcheckbox=false;
  showprogress=false;
  fencesticketing:FenceTicketing[]=[];
  keptfencesticketing: FenceTicketing[]=[];
  selectedfencesticketing: FenceTicketing[]=[];
  listfencesticketing: FenceTicketing[]=[];
  deletedfences: FenceTicketing[]=[];

  constructor(public appserv: AppservicesService, private Fenceserv: FenceService) { }

  ngOnInit() {
    this.getlistversements();
  }

  getlistversements(){
    this.showprogress=true;
    // this.Fenceserv.show(this.fencesent.fence.id).subscribe(
    //   (data:any)=>{
    //     this.showprogress=false;
    //     this.listfencesticketing=data.ticketings;
    //   },
    //   error=>{
    //     this.showprogress=false;
    //     this.appserv.presentToast(`Erreur survenue lors de chargement des versements`,'danger');
    //   }
    // )
  }

  async menufence(fence: Fences){

    if(this.showcheckbox){
      const ifexists = this.selectedfencesticketing.indexOf(fence);
      if(ifexists==-1){
        this.selectedfencesticketing.push(fence);
      }else{
        this.selectedfencesticketing=this.selectedfencesticketing.filter(r=>r!=fence);
      }
    }else{
      this.detailfence(fence);
    }
  }

  async deletefence(fence: FenceTicketing){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression',
      subHeader:`${fence}`,
      message:'Voulez-vous vraiment supprimer ce compte?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.showprogress=true;
          this.Fenceserv.delete(fence).subscribe(
            data=>{
              this.showprogress=false;
              if(data>0){
                this.appserv.presentToast(`Versement supprimé avec succès`,'success');

                this.listfencesticketing=this.listfencesticketing.filter(a=>a!=fence);
                this.keptfencesticketing=this.keptfencesticketing.filter(a=>a!=fence);
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

  async editfence(fence: Fences){
    const modal = await this.appserv.modalCtrl.create({
      component:EditfenceComponent,
      componentProps:{'Fencesent':fence}
    });
    modal.present();
  }

  async detailfence(fence: FenceTicketing){
    const modal = await this.appserv.modalCtrl.create({
      component:InfosfenceComponent,
      componentProps:{'fencesent':fence}
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='deleted'){
      this.listfencesticketing=this.listfencesticketing.filter(a=>a!=fence);
    }
  }

  getlist(object: any){
    this.showprogress=true;
    this.Fenceserv.getall(object).subscribe(
      data=>{
        //console.log(data);
        this.showprogress=false;
        this.listfencesticketing=data;
        this.keptfencesticketing=data;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Erreur survenue lors du chargement des clôtures. Vérifiez votre connexion`,'danger');
      }
    )
  }

  async multipledelete(){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression multiple',
      mode:'ios',
      message:`Voulez-vous supprimer ${this.selectedfencesticketing.length>1?'ces':'cette'} ${this.selectedfencesticketing.length>1?this.selectedfencesticketing.length:""} clôture${this.selectedfencesticketing.length>1?'s':''}? `,
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler: async ()=> {
          this.selectedfencesticketing.forEach(fence => {
            //console.log(fence);
            this.showprogress=true;
            this.Fenceserv.delete(fence.id).subscribe(
              data=>{
                this.showprogress=false;
                if(data>0){
                  this.selectedfencesticketing=this.selectedfencesticketing.filter(a=>a!=fence);
                  this.deletedfences.push(fence);
                  if(this.selectedfencesticketing.length==0){
                    this.appserv.presentToast(`${this.deletedfences.length} suppression${this.deletedfences.length>1?'s':''} effectuée${this.deletedfences.length>1?'s':''} avec succès`,'success');
                  }

                  this.listfencesticketing=this.listfencesticketing.filter(a=>a!=fence);
                  if(this.selectedfencesticketing.length==0){
                    this.showcheckbox=false;
                  }
                }else{
                  this.appserv.presentToast(`Opération  echouée:`,'warning');
                }
              },
              error=>{
                //console.log(error);
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
    this.listfencesticketing=this.keptfencesticketing.filter(a=>a===criteria);
  }

  deletefilter(){
    this.listfencesticketing=this.keptfencesticketing;
  }

   async newticketing(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewticketingComponent,
      componentProps:{'fencesent':this.fencesent}
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
        this.listfencesticketing.unshift(data);
    }
  }
}
