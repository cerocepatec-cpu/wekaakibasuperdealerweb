import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AppservicesService } from 'src/app/services/appservices.service';
import { PermissionService } from 'src/app/services/permission.service';
import { permission } from '../newrole/permission';
import { Role } from 'src/app/interfaces/role';

@Component({
  selector: 'app-editrole',
  templateUrl: './editrole.component.html',
  styleUrls: ['./editrole.component.scss'],
})
export class EditroleComponent implements OnInit {
@Input() actualrole:Role={};
search: any;
title: string = this.actualrole.title??'';
showprogress=false;
description: string = this.actualrole.description??'';
  newroleform=this.fb.group({
    title:['',Validators.required],
    description:['']
  });
  permissions: any[];
  allPermissions: any[] = permission;
  allPermissionsUpdate: any[]= []

  constructor(private fb: FormBuilder, public appserv: AppservicesService, private permissionService: PermissionService) {
  }

  ngOnInit() {  
    this.title=this.actualrole.title;
    this.description=this.actualrole.description;
    this.getpermissions();
  }

  duplicaterule(){
    if (this.title === this.actualrole.title) {
      this.appserv.presentToast("Veuillez modifier le nom du rôle svp!","warning");
    }else{
      let permissions = this.filterPermissions();
      if (permissions.length > 0) {
        this.showprogress=true;
        let role: any = this.actualrole;
        role.permissions = JSON.stringify(permissions);
        role.title=this.title;
        role.description=this.description;
        this.permissionService.new(role).subscribe((resp: any) => {
          this.showprogress=false;
          this.appserv.modalCtrl.dismiss(resp,'added');
          this.appserv.presentToast('Rôle ajouté avec succès','success');
        }, (error: any) => {
          this.showprogress=false;
        })
      }else{
        this.appserv.presentToast(`Prière compléter le titre ou sélectionner les permissions s'il vous plaît`,'warning');
      }
    }
  }

  syncpermissions(){
  this.allPermissions.forEach(element => {
    const getIfExist = this.permissions.find(el => el.name === element.name)
    if(getIfExist){
      this.allPermissionsUpdate.push(getIfExist)
    }else{
      this.allPermissionsUpdate.push(element)
    }
  });
}
  getpermissions(){
    this.showprogress=true;
    this.permissionService.rolePermissions(this.actualrole).subscribe(
      (data:any)=>{
        this.showprogress=false;
        this.actualrole.permissions=JSON.parse(data.permissions);
        this.permissions =this.actualrole.permissions;
        this.syncpermissions();
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast('Erreur survenue sur le serveur.','danger');
      });
  }
  permissionChenge(event, permission, action){
    const ev = event.detail.checked;
    this.allPermissionsUpdate.filter(el => el.name === permission.name);
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
    this.allPermissionsUpdate.forEach(element => {
      element.action.forEach(act => {
        act.value = ev;
      });});
  }

  filterPermissions(): any[]{
    let permissions:any[] = [];
    this.allPermissionsUpdate.forEach(element => {
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
    if (permissions.length > 0) {
      this.showprogress=true;
      let role: any = this.actualrole;
      role.permissions = JSON.stringify(permissions);
      role.title=this.title;
      role.description=this.description;
      this.permissionService.edit(role).subscribe((resp: any) => {
        this.showprogress=false;
        this.appserv.modalCtrl.dismiss(resp,'updated');
        this.appserv.presentToast('Rôle modifié avec succès','success');
      }, (error: any) => {
        this.showprogress=false;
      })
    }else{
      this.appserv.presentToast(`Prière compléter le titre ou sélectionner les permissions s'il vous plaît`,'warning');
    }
  }

}
