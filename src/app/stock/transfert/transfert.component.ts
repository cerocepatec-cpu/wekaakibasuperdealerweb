import { Component, OnInit } from '@angular/core';
import { TransfertStock } from 'src/app/interfaces/transfertstock';
import { AppservicesService } from 'src/app/services/appservices.service';
import { NewtransfertComponent } from './newtransfert/newtransfert.component';
import { TransfertService } from 'src/app/services/transfert.service';
import { DetailtransfertComponent } from './detailtransfert/detailtransfert.component';
import { RequestTransfert } from 'src/app/interfaces/requestTransfert';
@Component({
  selector: 'app-transfert',
  templateUrl: './transfert.component.html',
  styleUrls: ['./transfert.component.scss'],
})
export class TransfertComponent implements OnInit {
  search:any;
  showprogress=false;
  from : any;
  to : any;
  transfertslist: TransfertStock[]=[];

  constructor(public appserv: AppservicesService, private transfertserv: TransfertService) { }

  ngOnInit() {
    this.getall();
  }

  async export(criteria:string){

  }

  handleRefresh(event:any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };
  async periodicfilter(){

    const modal = await this.appserv.periodicfilter();
    modal.present();

    const {data,role} = await modal.onWillDismiss();
    if(role=='selected'){
      const object = {user_id:this.appserv.getactualuser().id,from:data.from,to:data.to};
      this.from=data.from;
      this.to=data.to;
    }
  }

  async newtransfert(){

    const modal = await this.appserv.modalCtrl.create({
      component:NewtransfertComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role=='added'){
      data.forEach(element => {
        this.transfertslist.unshift(element);
      });
    }
  }


  async detail(transfert: TransfertStock){
    const modal = this.appserv.modalCtrl.create({
      component:DetailtransfertComponent,
      componentProps:{'transfertsent':transfert},
      cssClass:'modal-border-radius-20'
    });
    (await modal).present();
  }

  async validatetransfert(criteria: string,transfert: TransfertStock){
    const crit = criteria==='1'?"valider":"invalider";
    const alert = await this.appserv.alertctrl.create({
      header:`Voulez-vous vraiment ${crit} ce transfert?`,
      mode:'ios',
      translucent:true,
      buttons:[
        {text:"Non",role:'cancel'},
        {text:"Oui",handler:()=>{
          this.validate(criteria,transfert);
        }}
      ]
    });
    alert.present();
  }

  async getall(){
    this.showprogress=true;
    this.transfertserv.getall().subscribe(
      data=>{
        this.transfertslist=data;
        this.showprogress=false;
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Erreur de connexion`,'danger');
      }
    )
  }

  async validate(criteria: any,transfert: TransfertStock){
    const crit = criteria==='1'?"validé":"invalidé";
    transfert.selected=true;
    transfert.validate_by=this.appserv.actualUser.id;
    transfert.status=criteria;
    if (criteria==='1') {
      transfert.validate=criteria;
    } else {
      transfert.validate=criteria;
    }

    this.transfertserv.changestatus(transfert).subscribe(
      data=>{
        transfert.selected=false;
        //console.log(data);
        this.appserv.presentToast(`Transfert ${crit} avec succès`,'success');
      },
      error=>{
        transfert.selected=false;
        this.appserv.presentToast('une erreur est survenue.','warning');
      }
    )
  }
}
