import { Component, OnInit,Input, ViewChild} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { Users } from 'src/app/interfaces/users';
import { AppservicesService } from 'src/app/services/appservices.service';
import { PermissionService } from 'src/app/services/permission.service';
import { RolePermissionService } from 'src/app/services/role-permission.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-changepermissions',
  templateUrl: './changepermissions.component.html',
  styleUrls: ['./changepermissions.component.scss'],
})
export class ChangepermissionsComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!:IonInput;
@Input() usersent: Users={};
search:any;
showprogress=false;
groupedPermissions: Record<string, string[]> = {};
selectedPermissions: string[] = [];
permissionsLoader=false;
  constructor(
    public appserv:AppservicesService, 
    private permissionserv:RolePermissionService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.loadpermissions();
    setTimeout(() => {
      this.defaultinput.setFocus();
    }, 200);
  }

  async togglePermission(event: any, permission:any) {
      const checked = event.detail.checked;
      if (!checked) {
        const loader = await this.appserv.loadctrl.create({
          message:"Desactivation en cours...",
          mode:"ios",
          translucent:true,
          spinner:"crescent"
        });
        loader.present();
            const payload = {
              user_ids: [this.usersent.id],
              permissions:[permission]
            };
            console.log("before sent",payload);
            this.permissionserv.removeUsersFromPermission(payload).subscribe({
              next: async (res: any) => {
                console.log('deleted ',res);
                await loader.dismiss();
                this.appserv.presentToast(`✅ ${res.message}`, 'success');
                this.loadpermissions();
              },
              error: async (err) => {
                console.log(err);
                await loader.dismiss();
                this.appserv.presentToast(`Erreur: ${err.error?.message || 'Échec'}`, 'danger');
              }
            });
      } 
  }

  async loadpermissions(){
    const load = await this.appserv.loadctrl.create({
      message:"Chargement en cours...",
      spinner:"crescent",
      mode:"ios",
      translucent:true
    });
    load.present();
    this.permissionserv.getpermissionforuser(this.usersent.id).subscribe({
      next:(res)=>{
         load.dismiss();
        if (res.message==="success" && res.status===200) {
          this.groupedPermissions=res.data;
        }
      },
      error:(err)=>{
        load.dismiss();
        console.log("error resultat",err);
      }
    });
  }
}
