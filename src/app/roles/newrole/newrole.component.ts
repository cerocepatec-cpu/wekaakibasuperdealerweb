import { permission } from './permission';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppservicesService } from 'src/app/services/appservices.service';
import { PermissionService } from '../../services/permission.service';
import { Users } from 'src/app/interfaces/users';

@Component({
  selector: 'app-newrole',
  templateUrl: './newrole.component.html',
  styleUrls: ['./newrole.component.scss'],
})
export class NewroleComponent implements OnInit {
search: any;
title: string;
showprogress=false;
description: string;
  newroleform=this.fb.group({
    title:['',Validators.required],
    description:['']
  });
  permissions: any = permission;
  actualuser: Users;

  constructor(private fb: FormBuilder, public appserv: AppservicesService, private permissionService: PermissionService) {
    this.actualuser=this.appserv.getactualuser();

  }

  ngOnInit() {}
  permissionChenge(event, permission, action){
    const ev = event.detail.checked;
    this.permissions.filter(el => el.name === permission.name);
    if (action.action === 'all') {
      permission.action.forEach(element => {
        element.value = ev;
      });

    }else{
      permission.action.forEach(perm => {
        if (perm.action === action.action) {
          perm.value = ev;
        }
      });
    }
  }
  permissionChengeAll(event){
    const ev = event.detail.checked;
    this.permissions.forEach(element => {
      element.action.forEach(act => {
        act.value = ev;
      });});
  }

  filterPermissions(): any[]{
    let permissions:any[] = [];
    this.permissions.forEach(element => {
      element.action.forEach(action => {
        if(action.value === true){
          if (permissions.find(per=> per === element)) {

          }else{
            permissions.push(element);
          }
        }
      });
    });
    return permissions;
  }

  sendDataToApi(){
   
    let permissions = this.filterPermissions();
    if (permissions.length > 0 && this.title.length>2) {
      this.showprogress=true;
      this.newroleform.patchValue({
        title:this.title,
        description:this.description
      });
      let role: any  = this.newroleform.value;
      role.permissions = JSON.stringify(permissions);
      role.user_id = this.appserv.actualUser.id;
      role.enterprise_id = this.appserv.actualUser.enterprise_id
      this.permissionService.new(role).subscribe((resp: any) => {
        this.showprogress=false;
        this.appserv.modalCtrl.dismiss(resp,'added');
        this.appserv.presentToast('Rôle créée avec succès','success');
        //console.log(resp);
      }, (error: any) => {
        this.showprogress=false;
        //console.log(error);

      })
    }else{
      this.appserv.presentToast(`Prière compléter le titre ou sélectionner les permissions s'il vous plaît`,'warning');
    }

  }

}
