import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { Users } from '../interfaces/users';
import { UsersService } from '../services/users.service';
import { IonInput } from '@ionic/angular';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-newgroup',
  templateUrl: './newgroup.component.html',
  styleUrls: ['./newgroup.component.scss'],
})
export class NewgroupComponent implements OnInit {
  @Input() groupsent:any;
  @Input() criteria:any;
  @ViewChild('defaultinput') defaultinput :IonInput;
  @ViewChild('groupinput') groupinput :IonInput;
  listusers: Users[]=[];
  selectedusers: any[]=[];
  search:any;
  showprogress=false;
  groupvalidation=false;
  groupname:any;
  grouperror=false;
  defaultgroupnameclass="";

  /**
   * Salaries variables 
   */
  employeesvalidation=false;
  constructor(public appserv:AppservicesService, private Userserv:UsersService,private groupserv:GroupService) { }

  ngOnInit() {}

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }

  /**
   * Salaries codes here
   */
  handlepostenamechange($event){
    console.log($event);
  }

  /**
   * End salaries codes
   */
  async validategroup(){
    if (this.groupname) {
      const load = await this.appserv.loadctrl.create({
        message:"Création groupe en cours...",
        spinner:'circles',
        translucent:true,
        mode:'ios'
      });
      load.present();
      let members=[];
      if (this.selectedusers.length>0) {
        this.selectedusers.forEach(member => {
          members.push({id:member.id});
        });
      }
      this.groupserv.new({name:this.groupname,enterprise_id:this.appserv.actualEse.id,done_by:this.appserv.actualUser.id,members:members}).subscribe(
        response=>{
          load.dismiss();
          if (response.message==="success" && response.status===200) {
              this.appserv.modalCtrl.dismiss(response.data,"created");
          }  
          
          if (response.message==="error" && response.status!==200) {
            this.appserv.presentToast("Création du groupe échouée!","warning");
          }
          console.log(response);
        },error=>{
          load.dismiss();
          this.appserv.presentToast("Création du groupe échouée!","warning");
        });
    }else{
      this.appserv.presentToast("Entrer le nom du groupe svp!","warning");
      this.groupinput.setFocus();
      this.grouperror=true;
    }
  }

  handlegroupenamechange($event){
    if (this.groupname) {
      this.grouperror=false;
      this.defaultgroupnameclass="success-block";
    }else{
      this.grouperror=true;
      this.defaultgroupnameclass="error-block";
    }
  }

  nextstep(){
    if (this.groupsent) {
      this.appserv.modalCtrl.dismiss(this.selectedusers,'selected');
    }else if(this.criteria==='employees'){
      this.groupvalidation=false;
      this.employeesvalidation=true;
    }else{
      this.groupvalidation=true;
      this.groupinput.setFocus();
    }
  }

 handleselectuserchange($event,user){
    if ($event.detail.checked) {
      user.selected=true;
      this.selectedusers.push(user);
    }else{
      user.selected=false;
      this.selectedusers=this.selectedusers.filter(u=>u!==user);
    }
    this.defaultinput.setFocus();
  }

  handlesearchchange($event){
  if (this.search.length>0) {
    this.showprogress=true;
    this.Userserv.memberslookup({enterprise_id:this.appserv.actualEse.id,keyword:this.search}).subscribe(
      response=>{
        this.showprogress=false;
        this.listusers=response;
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast("Une erreur est survenue. Veuillez réesayer","danger");
      }); 
  }else{
    this.listusers=[];
  }
}

removefromlist(user:Users){
  user.selected=false;
  this.selectedusers=this.selectedusers.filter(u=>u!==user);
}

}
