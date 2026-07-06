import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { permission } from 'src/app/roles/newrole/permission';
import { AppservicesService } from 'src/app/services/appservices.service';
import { EnterpriseService } from 'src/app/services/enterprise.service';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-enterpriseinfos',
  templateUrl: './enterpriseinfos.component.html',
  styleUrls: ['./enterpriseinfos.component.scss'],
})
export class EnterpriseinfosComponent implements OnInit {
@Input() owner : any;
@Input() modalincoming : boolean=false;
permissions: any = permission;
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
    rules:[]
  });

  newroleform=this.fb.group({
    title:['SuperAdmin'],
    description:['toutes les permissions accordées au propriétaire de l\'entreprise']
  });
  constructor(private permissionService:PermissionService, private router: Router,private fb: FormBuilder, public enterpriseserv: EnterpriseService, public appserv: AppservicesService) { }

  ngOnInit() {}

  validation(){

  }

  async setenterprise(){

    const alert2= await this.appserv.loadctrl.create({
      message:`Configuration de l'entreprise`,
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
      rules:object
    });
    this.enterpriseserv.new(this.newenterprise.value).subscribe(
      datareturned=>{
        //console.log(datareturned);
        alert2.dismiss();
        this.appserv.presentToast(`Configuration de votre entreprise terminée avec succès`,'success');
        localStorage.setItem('actualEnterprise',JSON.stringify(datareturned));
        if(this.modalincoming){
          this.appserv.modalCtrl.dismiss(datareturned,'created');
        }else{
          //creating roles
          this.router.navigateByUrl('/login',{replaceUrl:true});
        }
      },error=>{
        alert2.dismiss();
        //console.log(error);
        this.appserv.presentToast(`Impossible de terminer la configuration de votre entreprise`,'danger');
      });
    }

    filterPermissions(): any[]{
      this.permissions.forEach(permission => {
        permission.action.forEach(action => {
          action.value=true;
        });
      });
    
      return this.permissions;
    }

    async setRulesAndPermissions(){
      const load = await this.appserv.loadctrl.create({
        message:"Nous procédons à la configuration de votre compte ainsi que votre entreprise...",
        mode:'ios',
        spinner:'circles'
      });
      load.present();
        let permissions = this.filterPermissions();
        let role: any  = this.newroleform.value;
        role.permissions = JSON.stringify(permissions);
        role.user_id = this.appserv.actualUser.id;
        role.enterprise_id = this.appserv.actualUser.enterprise_id
        //console.log('rule sent',role);
        this.permissionService.OwnerNewRule(role).subscribe((resp: any) => {
          load.dismiss();
          this.appserv.presentToast('Configuration terminée avec succès','success');
          this.router.navigateByUrl('/login',{replaceUrl:true});
          //console.log(resp);
        }, (error: any) => {
          load.dismiss();
          this.appserv.presentToast('Nous avons connu un problème.','danger');
        });
    }
}
