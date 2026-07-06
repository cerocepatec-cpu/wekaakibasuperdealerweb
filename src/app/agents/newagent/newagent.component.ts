import { Component, OnInit,Input,ViewChild, HostListener } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DepositpickerComponent } from 'src/app/articles/depositpicker/depositpicker.component';
import { Deposits } from 'src/app/interfaces/deposit';
import { Enterprise } from 'src/app/interfaces/enterprise';
import { Role } from 'src/app/interfaces/role';
import { AppservicesService } from 'src/app/services/appservices.service';
import { UsersService } from 'src/app/services/users.service';
import { PermissionService } from '../../services/permission.service';
import { Users } from 'src/app/interfaces/users';
import { NewroleComponent } from 'src/app/roles/newrole/newrole.component';
import { IonInput } from '@ionic/angular';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-newagent',
  templateUrl: './newagent.component.html',
  styleUrls: ['./newagent.component.scss'],
})
export class NewagentComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!:IonInput;
  @Input() userSent:Users;
  @Input() keyword:any;
  @Input() returned:any;
  showcreatingprogress=false;
  showothersinfosbloc=false;
  actualdeposit:Deposits={};
  listroles:any[];
  actualrole:Role;
  actualenterprise:Enterprise={};

  agentform=this.fb.group(
    {
      id:[0],
      department_id: [0],
      user_name: [''],
      name: ['',Validators.required],
      email: [''],
      email_verified_at: [''],
      user_phone: ['',[Validators.required,
    Validators.pattern(/^\+[1-9]\d{7,14}$/),
    Validators.minLength(9)]],
      user_password: [''],
      user_password2: [''],
      user_type: [''],
      status: [''],
      permissions: [0],
      note: [''],
      avatar: [''],
      address: [''],
      enterprise_id:[0,Validators.required],
      created_by_id:[0,Validators.required],
      level: [''],
      affectation_id:[0],
      deposit_id:[],
      returned:[]
    });

  constructor(
    public appserv: AppservicesService, 
    private fb: FormBuilder, 
    private userserv: UsersService, 
    private permissionService: PermissionService,
    private authserv:AuthentificationService
  ) { }

  ngOnInit() {
    if (this.returned) {
      this.agentform.patchValue({
        returned:this.returned
      });
    }
    if (this.keyword) {
      this.agentform.patchValue({
       name:this.keyword
      });
    }
    if (this.userSent) {
      this.sycingData();
    } else {
      this.agentform.patchValue({
        enterprise_id:this.appserv.getactualuser().enterprise_id,
        created_by_id:this.appserv.getactualuser().id,
        user_type:'member',
        status:'disabled'
      });
    }
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }
  async changestatus(status: string){
    this.agentform.patchValue({
      status:status
    });
  }

  sycingData(){
    this.agentform.patchValue({
      id:this.userSent.id,
      department_id:this.userSent.department_id,
      user_name:this.userSent.user_name,
      name:this.userSent.name,
      email:this.userSent.email,
      email_verified_at:this.userSent.email_verified_at,
      user_phone:this.userSent.user_phone,
      user_password:this.userSent.user_password,
      user_password2:this.userSent.user_password,
      user_type:this.userSent.user_type,
      status:this.userSent.status,
      permissions:this.userSent.permissions,
      note:this.userSent.note,
      avatar:this.userSent.avatar,
      address:this.userSent.adress,
      enterprise_id:this.userSent.enterprise_id,
      level:this.userSent.level,
      affectation_id:this.userSent.affectation_id
    });
  }
  
  reversingData(user: Users){
    this.userSent.id=user.id;
    this.userSent.name=user.name;
    this.userSent.department_id=user.department_id;
    this.userSent.user_name=user.user_name;
    this.userSent.email=user.email;
    this.userSent.email_verified_at=user.email;
    this.userSent.user_phone=user.user_phone;
    this.userSent.user_password=user.user_password;
    this.userSent.user_type=user.user_type;
    this.userSent.status=user.status;
    this.userSent.permissions=user.permissions;
    this.userSent.note=user.note;
    this.userSent.avatar=user.avatar;
    this.userSent.adress=user.adress;
    this.userSent.enterprise_id=user.enterprise_id;
    this.userSent.level=user.level;
    this.userSent.affectation_id=user.affectation_id;
    this.userSent.role_permissions=user.role_permissions;
    this.userSent.role_description=user.role_description;
    this.userSent.role_title=user.role_title
  }
@HostListener('window:keydown', ['$event'])
  async handleKeyDown(event: KeyboardEvent) {
    const topModal = await this.appserv.modalCtrl.getTop();
  
    if (topModal && topModal.component !== this.constructor) {
      return;
    }
  
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addnewagent();
    }
  
  }

  async addnewagent(){
     const pin :any= await this.authserv.callPinModal();
    if (!pin || pin.length<4) {
       this.appserv.presentToast('Aucun ou mauvais Pin fourni svp!', 'warning');
       return;
    }

    if (this.userSent) {
      this.edituser();
    } else {
      const password1=this.agentform.getRawValue().user_password;
      const password2=this.agentform.getRawValue().user_password2;
      const userphone = this.agentform.getRawValue().user_phone;
      if (!userphone || userphone.length<8) {
        this.appserv.presentToast('Le numéro de téléphone est obligatoire et doit contenir au moins 8 chiffres!','warning');
        return;
      }
      if(password1===password2){

        this.showcreatingprogress=true;
        this.userserv.new(this.agentform.value).subscribe({
          next:(data)=>{
            this.showcreatingprogress=false;
            if (data.message==='success' && data.status===200) {
              this.appserv.presentToast(`Membre ajouté avec succès!`,'success');
              this.appserv.modalCtrl.dismiss(data.data,'added');
            }else{
              this.appserv.presentToast(data.error,"warning");
            } 
          },
          error:(err)=>{
             console.log('user added error',err);
              this.showcreatingprogress=false;
            if (err.status === 401 || err.status === 403) {
              this.appserv.presentToast(`${err.error.message}.`,'warning');
              return;
            }
          }
        });
      }else{
        this.appserv.presentToast(`Les deux mots de passe ne sont pas uniformes`,'warning');
      } 
    }
  }

  edituser(){
    this.showcreatingprogress=true;
    this.userserv.edithagentapi(this.agentform.value).subscribe({
      next:(response)=>{
          this.showcreatingprogress=false;
          if(response.status===200 && response.message==="success"){
            this.appserv.presentToast(`Agent modifié avec succès`,'success');
            this.reversingData(response.data);
            this.appserv.modalCtrl.dismiss(response.data,'added');
          }else{
            this.appserv.presentToast(response.error,"warning");
            return ;
          }
      },  
      error:(err)=>{
        console.log("error on updating user",err);
        this.showcreatingprogress=false;
        this.appserv.presentToast(`Impossible de modifier l'agent. Veuillez réessayer plus tard`,'danger');
      }
    });
  }

  async pickroles(){
    const modal = await this.appserv.modalCtrl.create({
      component:NewroleComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role=='added') {
      this.listroles.unshift(data);
      this.actualrole=data;
    }
  }

  async pickdeposit(){
    const modal = await this.appserv.modalCtrl.create({
      component:DepositpickerComponent,
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if (role=='selected') {
      this.actualdeposit=data;
      this.agentform.patchValue({
        deposit_id:this.actualdeposit.id
      });
    }
  }

  roleChange(e) {
    this.actualrole = e.detail.value
    this.agentform.patchValue({
      permissions:this.actualrole.id
    });
  }

  roleCancel() {
  }

  roleDismiss() {
  }
}
