import { NewproviderComponent } from './newprovider/newprovider.component';
import { Component, OnInit} from '@angular/core';
import { EditproviderComponent } from './editprovider/editprovider.component';
import { ProvidersService } from './../services/providers.service';
import { AppservicesService } from 'src/app/services/appservices.service';
import { Users } from '../interfaces/users';
import { Providers } from '../interfaces/providers';
import { InforsproviderComponent } from './inforsprovider/inforsprovider.component';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.page.html',
  styleUrls: ['./providers.page.scss'],
})
export class ProvidersPage implements OnInit {
  actualuser:Users={};
  listproviders: Providers[]=[];
  keptproviders: Providers[]=[];
  listselectedproviders: Providers[]=[];
  search: any;
  keyword: any;
  showdefaultprogress=false;
  showcheckbox=false;

  constructor(private providerserv: ProvidersService, public appserv: AppservicesService) { }

  ngOnInit() {
    this.actualuser=this.appserv.getactualuser();
    this.getproviderslist();
  }

  closemodal(){
    this.appserv.modalCtrl.dismiss();
  }

async newprovider(){
  const modal = await this.appserv.modalCtrl.create({
    component:NewproviderComponent,
    cssClass:'modal-border-radius-20'
  });
  (await modal).present();

  const {data,role} = await modal.onWillDismiss();
  if(role=='added'){
    this.listproviders.unshift(data);
  }
}

  getproviderslist(){
    this.showdefaultprogress=true;
    this.providerserv.getallproviders(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.showdefaultprogress=false;
        //Save in local storage
        this.listproviders=data;
        this.keptproviders=data;
        localStorage.setItem('providers',JSON.stringify(data));
      },
      error=>{
        this.showdefaultprogress=false;
        //use the local storage
        const records = localStorage.getItem('providers');
         if (records !== null) {
           this.listproviders= JSON.parse(records);
           this.keptproviders= JSON.parse(records);
         }
        this.appserv.presentToast(`Nous utilisons vos données hors ligne`,'primary');
      }
    )
  }

async multipledelete(){

  const alert = await this.appserv.alertctrl.create({
    header:'Suppression multiple',
    mode:'ios',
    message:`Voulez-vous supprimer ce${this.listselectedproviders.length>1?'s':''} ${this.listselectedproviders.length} client${this.listselectedproviders.length>1?'s':''}? `,
    translucent:true,
    buttons:[
      {text:'Non',role:'cancel'},
      {text:'Oui',handler: async ()=> {
        this.listselectedproviders.forEach(customer => {
          this.showdefaultprogress=true;
          this.providerserv.deleteoneprovider(customer).subscribe(
            (data:any)=>{
              this.showdefaultprogress=false;
              if(data>0){
                this.listselectedproviders=this.listselectedproviders.filter(a=>a!=customer);
                this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
                this.listproviders=this.listproviders.filter(a=>a!=customer);
                if(this.listselectedproviders.length==0){
                  this.showcheckbox=false;
                }
              }else{
                this.appserv.presentToast(`Opération  echouée:`,'warning');
              }
            },
            error=>{
              //console.log(error);
              this.showdefaultprogress=false;
              this.appserv.presentToast(`Suppression impossible`,'danger');
            }
          );
        });
      },}
    ]
  });
  alert.present();
}

async deleteprovider(provider: Providers){
  const alert = await this.appserv.alertctrl.create({
    header:'Suppression',
    subHeader:`${provider.providerName}`,
    mode:'ios',
    translucent:true,
    message:`Voulez-vous vraiment supprimer ce fournisseur? `,
    buttons:[
      {text:'Non',role:'cancel'},
      {text:'Oui',handler: async ()=> {
        this.showdefaultprogress=true;
        this.providerserv.deleteoneprovider(provider).subscribe(
          (data:any)=>{
            this.showdefaultprogress=false;
            if(data>0){
              this.appserv.presentToast(`Suppression effectuée avec succès`,'success');
              this.listproviders=this.listproviders.filter(a=>a!=provider);
            }else{
              this.appserv.presentToast(`Opération echouée:`,'warning');
            }
          },
          error=>{
            //console.log(error);
            this.showdefaultprogress=false;
            this.appserv.presentToast(`Suppression impossible`,'danger');
          }
        );
      },}
    ]
  });
  alert.present();
}

async detailprovider(provider: Providers){
  const modal = await this.appserv.modalCtrl.create(
    {
      component:InforsproviderComponent,
      componentProps:{'providersent':provider},
      cssClass:'modal-border-radius-20'
    });
    modal.present();

    const {data,role}= await modal.onWillDismiss();
    if(role=='edited'){

    }

    if(role=='deleted'){
        this.listproviders=this.listproviders.filter(c=>c!=provider);
    }
}

async providermenu(provider : Providers){

    if(this.showcheckbox){
      const ifexists = this.listselectedproviders.indexOf(provider);
      if(ifexists==-1){
        this.listselectedproviders.push(provider);
      }else{
        this.listselectedproviders=this.listselectedproviders.filter(r=>r!=provider);
      }
    }else{
      let menubuttons = [
        {
          text: 'Annuler',
        role:'cancel'
        },
        {
          text: 'Infos',
          handler: () => {
            this.detailprovider(provider);
          }
        },
      ];
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('comptes', 'edit'), {
        text: 'Modifier',
        handler: () => {
          this.editprovider(provider);
        }
      });
      menubuttons = this.appserv.actionVerificationByPermission(menubuttons, this.appserv.permissionFilter('comptes', 'delete'), {
        text: 'Supprimer',
        handler: () => {
          this.deleteprovider(provider);
        }
      });
      const menu = await this.appserv.actionsheetctrl.create(
        {
          header: `${provider.providerName}`,
          cssClass: 'myactionsheet',
          translucent: true,
          mode: 'ios',
          buttons: menubuttons
        }
      );

      (await menu).present();
    }
  }


  async editprovider(provider: Providers){
    const modal = await this.appserv.modalCtrl.create({
      component:EditproviderComponent,
      componentProps:{'providersent':provider},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  searchprovider(event: any){
    const key = event.target.value.toLowerCase();
    this.listproviders=this.keptproviders.filter((p:any)=>p.providerName.toLowerCase().indexOf(key) > -1);
  }
}
