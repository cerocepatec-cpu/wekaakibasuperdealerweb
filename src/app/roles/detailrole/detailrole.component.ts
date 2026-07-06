import { Component, OnInit, Input } from '@angular/core';
import { Role } from 'src/app/interfaces/role';
import { AppservicesService } from 'src/app/services/appservices.service';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-detailrole',
  templateUrl: './detailrole.component.html',
  styleUrls: ['./detailrole.component.scss'],
})
export class DetailroleComponent implements OnInit {
@Input() roleSent: Role;
showprogress=false;
  constructor(public appserv: AppservicesService, private permissionService: PermissionService) { }

  ngOnInit() {
    this.getpermissions();
  }

  getpermissions(){
    this.showprogress=true;
    this.permissionService.rolePermissions(this.roleSent).subscribe(
      (data:any)=>{
        this.showprogress=false;
        this.roleSent.permissions=JSON.parse(data.permissions);
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast('Erreur survenue sur le serveur.','danger');
      });
  }
}
