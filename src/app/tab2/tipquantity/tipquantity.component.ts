import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { DetailsInvoice } from 'src/app/interfaces/detailsinvoice';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-tipquantity',
  templateUrl: './tipquantity.component.html',
  styleUrls: ['./tipquantity.component.scss'],
})
export class TipquantityComponent implements OnInit {
@ViewChild('defaultinput') defaultinput! : IonInput;
@ViewChild('defaultinput2') defaultinput2! : IonInput;
@ViewChild('serverdefaultinput') serverdefaultinput! : IonInput;
@Input() detailsent:DetailsInvoice={};
@Input() title: string='';
@Input() type: string='';
@Input() numbersent: any;
@Input() zero_accepted: boolean;
@Input() showdateinput: boolean;
showsaving=false;
oldpassword='';
passwordconfirmed='';
showsecondpassword=false; 
showserversetup=false;
showpasswordsetup=true;
serveradress='';
date_operation:any;
newquantity=0;

  constructor(public appserv : AppservicesService) {}

  ngOnInit() {
    if(this.detailsent.quantity){
      this.newquantity=this.detailsent.quantity;
    }else{
      this.newquantity=0;
    }

    if(this.numbersent>0){
      this.newquantity=this.numbersent;
    }
  }

  ionViewDidEnter(){
    if (this.type==='password') {
      this.defaultinput2.setFocus();
    }else{
      this.defaultinput.setFocus();
    }
    
    if(this.showdateinput) {
      this.date_operation=this.appserv.defaultdate();
    }
  }

  passwordevent($event){
    if ($event===this.appserv.localpassword) {
      this.showsecondpassword=true;
    }else{
      this.passwordconfirmed='';
      this.showsecondpassword=false;
      this.showsaving=false;
    }
  }

  confirmedpasswordevent($event){
    if ($event===this.oldpassword) {
      this.showsaving=true;
    }else{
      this.showsaving=false;
    }
  }

  validatepassword(){
    if (this.showserversetup) {
        //set the local server
        try {
          localStorage.setItem('apiUrl',JSON.stringify(this.serveradress));
          this.appserv.getapiurl();
          this.appserv.presentToast("Serveur configuré avec succès!","success");
          this.appserv.closemodal();
        } catch (error) {
          this.appserv.presentToast("Une erreur est survenue lors de la configuration du serveur. Veuillez réessayer svp!","warning");
        }
        
    }else{
      if (this.oldpassword===this.passwordconfirmed && this.oldpassword===this.appserv.localpassword) {
        this.title="Configuration du serveur";
        this.showserversetup=true;
        this.showpasswordsetup=false;
      } 
    }
  }
  
  quantityevent($event){
    if($event.keyCode === 13){
      this.changequantity();
    }
  }

  changequantity(){
    if(this.newquantity || this.zero_accepted){
      if (this.showdateinput) {
        this.appserv.modalCtrl.dismiss({date_operation:this.date_operation,amount:this.newquantity},'edited');
      }else{
        this.appserv.modalCtrl.dismiss(this.newquantity,'edited');
      }
    }else{
      this.appserv.presentToast(`Veuillez entrer une valeur`,'danger');
    }
  }

  checkpassword(){
    const setupPassword = this.appserv.localpassword;
    if (setupPassword === this.oldpassword) {
      //give permission to set the localAPI
    }else{
      //make the inputs red
    }
  }
}
