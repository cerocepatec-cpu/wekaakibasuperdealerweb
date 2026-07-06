import { Component, HostListener, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OwnerService } from 'src/app/services/owner.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { AppservicesService } from 'src/app/services/appservices.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/services/permission.service';
import { permission } from 'src/app/roles/newrole/permission';
import { SyncingService } from 'src/app/services/syncing.service';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';
import { IonInput } from '@ionic/angular';
@Component({
  selector: 'app-ownerinfos',
  templateUrl: './ownerinfos.component.html',
  styleUrls: ['./ownerinfos.component.scss'],
})
export class OwnerinfosComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!:IonInput
  showprogress=false;
  showredbloc=false;
  permissions: any = permission;

  newagent = this.fb.group({
    user_name:['',Validators.required],
    user_mail:[],
    enterprise_name:['',Validators.required],
    user_phone:['',Validators.required],
    user_password:['',Validators.required],
    password2:['',Validators.required],
    user_type:['super_admin'],
    created_at:[],
    status:['enabled'],
    department_id:[],
    department_name:[],
    selected:[],
    note:[],
    level:[],
    defaultmoney:['CDF']
  });

  newenterprise=this.fb.group({
    name: ['',Validators.required],	
    description: [],
    rccm: [],	
    national_identification:[],
    num_impot:[],	
    autorisation_fct:[],
    adresse:[],	
    phone:[],
    mail:[],	
    website:[],	
    logo:[],	
    category:[],	   
    vat_rate:[],	
    uuid:[],	
    sync_status:[],
    user_id:[0],
    status:['disabled'],
    rules:[],
    defaultmoney:['CDF']
  });

  newroleform=this.fb.group({
    title:['SuperAdmin'],
    description:['toutes les permissions accordées au propriétaire de l\'entreprise']
  });

  constructor( private syncingServ: SyncingService, private permissionService:PermissionService,private route: Router, private fb: FormBuilder, private ownerserv: OwnerService, private enterpriseserv: EnterpriseService, public appserv:AppservicesService, private userserv: UsersService) { }

  ngOnInit() {}
@HostListener('window:keydown',['$event'])
onKewDown($event:KeyboardEvent){
  if ($event.key === 'Enter') {
    this.validation();
  }
}

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }

  keyupvalidation($event){
    if ($event.keyCode === 13){
      this.validation();
    }
  }

  async validation(){

    if(this.newagent.getRawValue().user_password==this.newagent.getRawValue().password2){
      const alert= await this.appserv.loadctrl.create({
        message:'Création du compte en cours....',
        spinner:'circular'
      });
      alert.present();
      this.showprogress=true;
      this.userserv.new(this.newagent.value).subscribe(
        (data:any)=>{
          alert.dismiss();
          this.showprogress=false;
          localStorage.setItem('actualUser',OrbitEncoder.encode(data));
          this.appserv.presentToast(`Félicitations. Votre compte a été crée avec succès.`,'success');
          this.setenterprise();
        },
        error=>{
          console.log('error user creation',error);
          alert.dismiss();
          this.showprogress=false;
          this.appserv.presentToast(`Impossible de terminer la création du compte`,'danger');
        });
    }else{
      this.appserv.presentToast(`Les deux mots de passe ne sont pas identiques`,'warning');
      this.showredbloc=true;
    }
  }

  filterPermissions(): any[]{
    this.permissions.forEach(permission => {
      permission.action.forEach(action => {
        action.value=true;
      });
    });
  
    return this.permissions;
  }

  async setenterprise(){

    const alert2= await this.appserv.loadctrl.create({
      message:`Configuration de l'entreprise en cours...`,
      spinner:'circular'
    });
    alert2.present();
   
    //setting rules for the super admin
    let permissions = this.filterPermissions();
    let role: any  = this.newroleform.value;
        role.permissions = JSON.stringify(permissions);
    const object={ruleSent:role};
    this.newenterprise.patchValue({
      user_id:this.appserv.getactualuser().id,
      rules:object,
      name:this.newagent.getRawValue().enterprise_name,
      phone:this.newagent.getRawValue().user_phone,
      mail:this.newagent.getRawValue().user_mail,
      defaultmoney:this.newagent.getRawValue().defaultmoney
    });
    this.enterpriseserv.new(this.newenterprise.value).subscribe(
      (datareturned: any)=>{
        alert2.dismiss();
        if (datareturned.message==='success') {
          this.appserv.setactualenterprise(datareturned.enterprise);
          localStorage.setItem('TOKEN_KEY',datareturned.user.remember_token);
          localStorage.setItem('permission', datareturned.user.role_permissions);
          this.appserv.SetDefaultPrinterConfig();
          //sycing all data from API
          this.syncingServ.gettingAllDataFromApi();
          this.route.navigateByUrl('/login');
          this.appserv.presentToast(`Configuration de votre entreprise terminée avec succès`,'success');
        }else{
          console.log('error ese creation',datareturned);
          this.appserv.presentToast('Accès refusé. Veuillez réessayer ou contacter votre administrateur','warning');
        }
      },error=>{
        alert2.dismiss();
        console.log('error ese creation',error);
        this.appserv.presentToast(`Impossible de terminer la configuration de votre entreprise`,'danger');
      });
    }

}
