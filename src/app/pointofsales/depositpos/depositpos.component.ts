import { Component, Input, OnInit } from '@angular/core';
import { dataTool } from 'echarts';
import { DepositpickerComponent } from 'src/app/articles/depositpicker/depositpicker.component';
import { Deposits } from 'src/app/interfaces/deposit';
import { PointOfSales } from 'src/app/interfaces/pos';
import { AppservicesService } from 'src/app/services/appservices.service';
import { PosService } from 'src/app/services/pos.service';

@Component({
  selector: 'app-depositpos',
  templateUrl: './depositpos.component.html',
  styleUrls: ['./depositpos.component.scss'],
})
export class DepositposComponent implements OnInit {
  @Input() posSent: PointOfSales;
  listdeposits:Deposits[]=[];
  showprogress=false;
  search:any;
  constructor(public appserv: AppservicesService,private posServ: PosService) { }

  ngOnInit() {
    this.getlisdeposits();
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };

  async depositmenu(deposit){}

  async adddeposit(){
    const modal = await this.appserv.modalCtrl.create({
      component:DepositpickerComponent,
      componentProps:{'multiselect':true},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role==='list-selected') {
      const alert = await this.appserv.alertctrl.create({
        header:'Ajout des depots',
        mode:'ios',
        message:`Confirmez-vous l'ajout de ce${data.length>1?'s':''} ${data.length} dépôt${data.length>1?'s':''} au POS?`,
        buttons:[
          {text:'Non',role:'cancel'},
          {text:'Oui',handler:()=>{{
            this.senddeposits(data);
          }}}
        ]
      });
      alert.present();
    }
  }

  senddeposits(data:Deposits[]){
    this.showprogress=true;
    let deposits =[];
    data.forEach(element => {
      const object ={deposit_id:element.id,pos_id:this.posSent.id,user_id:this.appserv.actualUser.id};
      deposits.push(object);
    });
    this.posServ.affectDeposits({deposits:deposits}).subscribe(
      data=>{
        this.showprogress=false;
        data.forEach(element => {
          this.listdeposits.unshift(element);
        });
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast("Une erreur est survenue lors d'affectation des dépôts au POS",'danger');
      });
  }

  getlisdeposits(){
    this.showprogress=true;
    this.posServ.getlistdeposits(this.posSent.id).subscribe(
      data=>{
        this.showprogress=false;
        this.listdeposits=data;
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast('Erreur survenue lors de la recupération des dépôts','danger');
      });
  }

  async deletedeposit(deposit:Deposits){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression dépôt',
      mode:'ios',
      message:'Voulez-vous vraiment supprimer ce dépôt de ce POS?',
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=>{
          this.showprogress=true;
          this.posServ.deletedepositTopos(deposit.pos_affection_id).subscribe(
            data=>{
              this.showprogress=false;
              this.appserv.presentToast('Dépôt rétiré du POS avec succès','success');
              this.listdeposits=this.listdeposits.filter(d=>d!=deposit);
            },error=>{
              this.showprogress=false;
              this.appserv.presentToast(`Erreur survenue. Nous n'avons pas pû rétirer le dépôt`,'danger');
            });
        }}
      ]
    });
    alert.present();
  }
}
