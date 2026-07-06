import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { AppservicesService } from '../services/appservices.service';
import { Router } from '@angular/router';
import { SyncingService } from '../services/syncing.service';
import { IonInput } from '@ionic/angular';
import { ServersetupComponent } from '../serversetup/serversetup.component';
import { tsParticles } from "tsparticles-engine";
import {loadSlim} from "tsparticles-slim";
import { PermissionsStorageService } from '../services/permissions-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('username') username!: IonInput;
  counter =0;
  showprogress=false;
  credentials = this.fb.group({
    login:['',[Validators.required]],
    password:['',[Validators.required]],
    device_type:['web'],
    rules_not_in_json_format:true
  });

  constructor(
    private fb: FormBuilder,
    private authService : AuthentificationService,
    public appserv :AppservicesService,
    private router : Router,
    private syncingServ: SyncingService,
    private permissionStorageServ:PermissionsStorageService
  ) { }

  ionViewDidEnter(){
   this.username.setFocus();
  }

  async ngAfterViewInit() {
 // Charger la version "slim" dans le moteur
    await loadSlim(tsParticles);

    // Initialiser les particules
    tsParticles.load("particle-bg", {
      background: { color: "transparent" },
      fpsLimit: 60,
      interactivity: {
        events: { onHover: { enable: true, mode: "repulse" } },
        modes: { repulse: { distance: 120, duration: 0.4 } },
      },
      particles: {
        color: { value: "#ffc107" },
        links: { color: "#ffc107", distance: 150, enable: true, opacity: 0.2, width: 1 },
        move: { enable: true, speed: 1.5, outModes: { default: "bounce" } },
        number: { value: 70 },
        opacity: { value: 0.3 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    });
}

  ngOnInit() {
    // this.isanyconnection();
  }
@HostListener('window:keydown',['$event'])
async onKeydown(event:KeyboardEvent){
    const topModal = await this.appserv.modalCtrl.getTop();
  // Si un autre composant/modal que celui-ci est au-dessus
  if (topModal && topModal.component !== this.constructor) {
    return;
  }

  if (event.key === 'Enter') {
    this.login();
  }
}
  loginWithGoogle() { /* connexion Google */ }
forgotPassword() {
  
}
goToRegister() { /* redirection vers la page inscription */ }
  loginchecker($event:any){
    if($event.keyCode === 13){
      this.login();
    }
  }

  async gotosetlocalapi(){
    this.counter=this.counter+1;
   
    if (this.counter>=7) {
      this.appserv.presentToast("Veuillez confirmer le mot de passe administrateur svp!","primary");
      const modal = await this.appserv.modalCtrl.create({
        component:ServersetupComponent,
        cssClass:'modal-border-radius-20',
        componentProps:{title:'Vérification mot de passe administrateur',type:'password'}
      });

      modal.present();
    }

  }

  isanyconnection(){
    if(this.appserv.getactualuser().id){
      this.router.navigateByUrl('/uzisha',{replaceUrl:true});
    }
  }



async login() {

  if (this.credentials.invalid) return;

  this.showprogress = true;

  this.authService.login(this.credentials.value).subscribe({
    next: async (response: any) => {
      console.log('Login response:', response);
      this.showprogress = false;

      if (response.message === 'success' && response.status === 200) {
        if(response.data.user.user_type!=='super_dealer'){
           this.appserv.presentToast("Vous n'avez pas les droits d'accès à cette application","danger");
           return;
        }

        const permissions = response.data.permissions ?? [];
        this.appserv.setactualuser(response.data.user);
        this.appserv.setactualenterprise(response.data.enterprise);
        this.appserv.setDefaultMoney(response.data.enterprise.default_money);
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('expires_in', response.data.expires_in.toString());
        localStorage.setItem('refresh_expires_at', response.data.refresh_expires_at.toString());
        localStorage.setItem('token_created_at', Date.now().toString());

        await this.permissionStorageServ.updatePermissions(permissions);

        this.appserv.navCtrl.navigateRoot('/uzisha'); // 🔥 IMPORTANT

        this.appserv.presentToast('Vous êtes connecté', 'success');
      }else{
        this.appserv.presentToast(response?.error || 'Erreur de connexion', 'danger');
      }
    },
    error: (err) => {
      console.log(err);
      this.appserv.presentToast(err.error?.error || 'Erreur de connexion', 'danger');
      this.showprogress = false;
    }
  });
}

 getingEseInfos(){
      this.authService.getingEseInfos(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        this.appserv.setactualenterprise(data.enterprise);
      },
      error=>{
        this.appserv.presentToast("Aucune entreprise configurée","warning");
      }
    )
  }

  nothing(){}
  get user_name(){
    return this.credentials.get('user_name');
  }

  get user_password(){
    return this.credentials.get('user_password');
  }
}
