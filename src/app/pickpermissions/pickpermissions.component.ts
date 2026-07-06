import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { RolePermissionService } from '../services/role-permission.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-pickpermissions',
  templateUrl: './pickpermissions.component.html',
  styleUrls: ['./pickpermissions.component.scss'],
})
export class PickpermissionsComponent implements OnInit {
@ViewChild('defaultinput') defaultinput:IonInput;
@Input() selectMultiple:boolean;
search:any;
groupedPermissions: Record<string, string[]> = {};
selectedPermissions: string[] = [];
permissionsLoader=false;
  constructor(
    public appserv: AppservicesService,
    private permissionService: RolePermissionService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.getAllPermissions();
    }, 200);
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.defaultinput.setFocus();
    },200);
  }

  sentResult(){
    this.appserv.modalCtrl.dismiss(this.selectedPermissions,"selected");
  }

  togglePermission(event: any, permission: string) {
    if (this.selectMultiple) {
      const checked = event.detail.checked;
      if (checked && !this.selectedPermissions.includes(permission)) {
        this.selectedPermissions.push(permission);
      } else if (!checked) {
        this.selectedPermissions = this.selectedPermissions.filter(p => p !== permission);
      }
    }else{
      this.appserv.modalCtrl.dismiss(permission,"selected");
    } 
  }
  
  getAllPermissions(){
    this.permissionsLoader=true;
    this.permissionService.getGroupedPermissions().subscribe({
      next: (data: Record<string, string[]>) => {
        this.permissionsLoader=false;
        this.groupedPermissions = data;
      },
      error: (err) => {
        this.permissionsLoader=false;
        this.appserv.presentToast('Erreur de chargement des permissions', 'danger');
      },
    });
  }
}
