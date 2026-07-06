import { Component, OnInit, Input } from '@angular/core';
import { error } from 'console';
import { TransfertStock } from 'src/app/interfaces/transfertstock';
import { AppservicesService } from 'src/app/services/appservices.service';
import { TransfertService } from 'src/app/services/transfert.service';

@Component({
  selector: 'app-detailtransfert',
  templateUrl: './detailtransfert.component.html',
  styleUrls: ['./detailtransfert.component.scss'],
})
export class DetailtransfertComponent implements OnInit {

@Input() transfertsent: TransfertStock={};
showprogress=false;
quantity_received=0;
comment:any;

  constructor(public appserv: AppservicesService, private transfertserv: TransfertService) { }

  ngOnInit() {
    this.quantity_received=this.transfertsent.quantity_received>0?this.transfertsent.quantity_received:this.transfertsent.quantity_sent;
  }

  async validatetransfert(){
    const alert = this.appserv.alertctrl.create({
      header:'Validation transfert',
      message:'Voulez-vous vraiment valider ce transfert?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=>{
            this.showprogress=true;
            this.transfertsent.quantity_received=this.quantity_received;
            this.transfertsent.comment=this.comment;
            this.transfertsent.user_id=this.appserv.getactualuser().id;
            this.transfertserv.validatetransfert(this.transfertsent).subscribe(
              data=>{
                this.showprogress=false;
                this.transfertsent=data;
                this.appserv.presentToast(`Transfert validé avec succès`,'success');
                this.appserv.modalCtrl.dismiss(data,'edited');
              },
              error=>{
                this.showprogress=false;
                this.appserv.presentToast(`Une erreur est survenue lors de la validation du transfert`,'danger');
              }
            )
        }}
      ]
    });
    (await alert).present();
  }

  async canceltransfert(){

    const alert = this.appserv.alertctrl.create({
      header:'Annuler transfert',
      message:'Voulez-vous vraiment annuler ce transfert?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=>{
            this.showprogress=true;
            this.transfertsent.quantity_received=this.quantity_received;
            this.transfertsent.comment=this.comment;
            this.transfertsent.user_id=this.appserv.getactualuser().id;
            this.transfertserv.canceltransfert(this.transfertsent).subscribe(
              data=>{
                this.showprogress=false;
                if(data.message=='canceled'){
                  this.appserv.presentToast(`Transfert annulé avec succès`,'success');
                }else if(data.message=='received'){
                  this.appserv.presentToast(`Nous pouvons pas annuler ce transfert car il est déjà reçu par le destinataire`,'warning');
                }else{

                }
                this.transfertsent=data.data;
               
                this.appserv.modalCtrl.dismiss(data,'edited');
              },
              error=>{
                this.showprogress=false;
                this.appserv.presentToast(`Une erreur est survenue lors de l'annulation du transfert`,'danger');
              }
            )
        }}
      ]
    });
    (await alert).present();
  }
}
