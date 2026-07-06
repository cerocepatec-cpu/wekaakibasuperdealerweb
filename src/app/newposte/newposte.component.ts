import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { Users } from '../interfaces/users';
import { UsersService } from '../services/users.service';
import { IonInput } from '@ionic/angular';
import { SalariesService } from '../services/salaries.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-newposte',
  templateUrl: './newposte.component.html',
  styleUrls: ['./newposte.component.scss'],
})
export class NewposteComponent implements OnInit {
  @Input() groupsent:any;
  @Input() criteria:any;
  @ViewChild('defaultinput') defaultinput :IonInput;
  @ViewChild('groupinput') groupinput :IonInput;
  listusers: Users[]=[];
  selectedusers: any[]=[];
  positionslist:any[]=[];
  search:any;
  showprogress=false;
  groupvalidation=false;

  employeeform=this.fb.group({
    position_id:[],
    agent_id:[],
    affected_by:[],
    enterprise_id:[],
    description:[] 
  });

  grouperror=false;
  defaultgroupnameclass="";

  /**
   * Salaries variables 
   */
  employeesvalidation=false;
  constructor(public appserv:AppservicesService, private Userserv:UsersService,private salaryserv:SalariesService,private fb:FormBuilder) { }

  ngOnInit() {
    this.employeeform.patchValue({
      enterprise_id:this.appserv.actualEse.id,
      affected_by:this.appserv.actualUser.id
    });
    this.getpositionslist();
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }

  async getpositionslist(){
    this.salaryserv.getpositionslist({user_id:this.appserv.actualUser.id}).subscribe(
      response=>{
        if (response.message==="success" && response.status===200) {
          this.positionslist=response.data;
        }
        
        if (response.message==="error" && response.status===400) {
          this.appserv.presentToast("Une erreur est survenue lors de la récupération de la liste des postes!","warning");
        }
      },error=>{
        this.appserv.presentToast("Impossible de récupérer la liste des postes.","danger");
      });
  }

  /**
   * Salaries codes here
   */
  handlepostenamechange($event){
    console.log($event);
  }

  handlepositionchanged($event){
    console.log($event.detail.value);
  }
  /**
   * End salaries codes
   */

  nextstep(){
    if (this.groupsent) {
      this.appserv.modalCtrl.dismiss(this.selectedusers,'selected');
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

  async validatejobsnames(){
    if (this.selectedusers.length>0) {
      let erroroccured=false;
    
      let members=[];
    
        this.selectedusers.forEach(member => {
          if (!member.position_id || !member.id) {
            erroroccured=true;
            member.error=true;
          }else{
            member.agent_id=member.id;
            member.affected_by=this.appserv.actualUser.id;
            member.enterprise_id=this.appserv.actualEse.id;
            members.push(member);
          }
        });
      
        if (!erroroccured) {
          const load = await this.appserv.loadctrl.create({
            message:"Création des postes en cours...",
            spinner:'circles',
            translucent:true,
            mode:'ios'
          });
          load.present();
          this.salaryserv.new({enterprise_id:this.appserv.actualEse.id,done_by:this.appserv.actualUser.id,members:members}).subscribe(
            response=>{
              load.dismiss();
              if (response.message==="success" && response.status===200) {
                  this.appserv.modalCtrl.dismiss(response.data,"created");
              }  
              
              if (response.message==="error" && response.status!==200) {
                this.appserv.presentToast("Erreur du groupe échouée!","warning");
              }
              console.log(response);
            },error=>{
              load.dismiss();
              this.appserv.presentToast("Erreur du groupe échouée!","warning");
            });
        }else{
          this.appserv.presentToast("Vous avez une erreur dans votre encodage. Veuillez vérifier vos données!","warning");
        }
    
    }else{
      this.appserv.presentToast("Veuillez sélectionner les employés!","warning");
    }
  }

}

