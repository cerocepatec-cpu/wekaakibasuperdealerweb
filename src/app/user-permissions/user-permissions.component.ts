import { Component, OnInit } from '@angular/core';
import { RolePermissionService } from '../services/role-permission.service';
import { UsersService } from '../services/users.service';
import { AppservicesService } from '../services/appservices.service';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss'],
})
export class UserPermissionsComponent implements OnInit {
  users = [];
  roles = [];
  permissions = [];
  selectedUser: any;
  selectedRole: any;
  selectedPermissions: string[] = [];

  constructor(private rpService: RolePermissionService,private userServ:UsersService,private appserv:AppservicesService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // this.rpService.getUsers().subscribe(data => this.users = data);
    this.rpService.getRoles().subscribe(data => this.roles = data);
    this.rpService.getPermissions().subscribe(data => this.permissions = data);
  }

  onAssignRole() {
    // if (this.selectedUser && this.selectedRole) {
    //   this.rpService.assignRole(this.selectedUser.id, this.selectedRole.id)
    //     .subscribe(res => alert(res.message));
    // }
  }

  onAssignPermissions() {
    if (this.selectedUser && this.selectedPermissions.length > 0) {
      // this.rpService.assignPermissions(this.selectedUser.id, this.selectedPermissions)
      //   .subscribe(res => alert(res.message));
    }
  }

  me(){
    let token=localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    this.appserv.http.get(this.appserv.apiUrl + '/me', { headers }).subscribe({
      next: (data: any) => {
        this.selectedUser=data;
        console.log('User data:', data);
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }
}
