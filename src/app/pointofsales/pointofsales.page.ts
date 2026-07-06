import { Component, OnInit } from '@angular/core';
import { PointOfSales } from '../interfaces/pos';
import { AppservicesService } from '../services/appservices.service';
import { NewposComponent } from './newpos/newpos.component';
import { PosService } from '../services/pos.service';
import { InfosposComponent } from './infospos/infospos.component';

@Component({
  selector: 'app-pointofsales',
  templateUrl: './pointofsales.page.html',
  styleUrls: ['./pointofsales.page.scss'],
})
export class PointofsalesPage implements OnInit {
  keyword:any;
  listpos: PointOfSales[]=[];
  listselectedpos: PointOfSales[]=[];
  showcheckbox=false;
  showdefaultprogress=false;
  constructor(public appserv: AppservicesService, private posService: PosService) { }

  ngOnInit() {
    this.getlistpos();
  }

  excelexport(){}
  handleRefresh(event:any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };
  deletingfilter(){}
  pdfdownload (){}

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
    this.showdefaultprogress=true;
    this.posService.getlistpos(this.appserv.actualUser.enterprise_id).subscribe(
      data=>{
        this.showdefaultprogress=false;
        this.listpos=data;
      },
      error=>{
        this.showdefaultprogress=false;
        this.appserv.presentToast('Une erreur est survenue lors du chargement de la liste des points des ventes','danger');
      });
  }
  async posmenu(pos:PointOfSales){
    const modal = await this.appserv.modalCtrl.create({
      component:InfosposComponent,
      componentProps:{'posSent':pos},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role=='deleted') {
      this.listpos=this.listpos.filter(p=>p!=pos);
    }
  }

  multipledelete(){}
}
