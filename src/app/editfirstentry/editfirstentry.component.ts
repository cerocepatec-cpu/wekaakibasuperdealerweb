import { Component, OnInit,Input } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { MembersaccountsService } from '../services/membersaccounts.service';

@Component({
  selector: 'app-editfirstentry',
  templateUrl: './editfirstentry.component.html',
  styleUrls: ['./editfirstentry.component.scss'],
})
export class EditfirstentryComponent implements OnInit {
@Input() firstentrysent:any;
  constructor(public appserv:AppservicesService,private firstentryserv:MembersaccountsService) { }

  ngOnInit() {
    console.log('first entry sent',this.firstentrysent);
  }

  async deletefirstentry(){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression',
      mode:'ios',
      translucent:true,
      message:'Cette action est irreversible. Voulez-vous vraimment continuer?',
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:async ()=> {
            const load = await this.appserv.loadctrl.create({
              message:"Suppression en cours...",
              mode:'ios',
              translucent:true
            });
            load.present();
            this.firstentryserv.deletefirstentry(this.firstentrysent).subscribe(
              response=>{
                load.dismiss();
                if (response.message==="success" && response.status===200 && response.data===true) {
                  this.appserv.presentToast("Première mise supprimee avec succès","success");
                  this.appserv.modalCtrl.dismiss(this.firstentrysent,"deleted");
                }
                console.log(response);
              },
              error=>{
                load.dismiss();
                console.log(error);
              });
        },}
      ]
    });
    alert.present();
  }

}
