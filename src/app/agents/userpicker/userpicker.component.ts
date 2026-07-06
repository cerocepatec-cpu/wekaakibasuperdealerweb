import { IonInput} from '@ionic/angular';
import { UsersService } from './../../services/users.service';
import { Component, OnInit,Input,ViewChild} from '@angular/core';
import { UserDeposit } from 'src/app/interfaces/userDeposit';
import { Users } from 'src/app/interfaces/users';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-userpicker',
  templateUrl: './userpicker.component.html',
  styleUrls: ['./userpicker.component.scss'],
})
export class UserpickerComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput:IonInput;
  @Input() multiselect:any;
  @Input() criteria:any;
  @Input() usertype:any;
  @Input() listsent:UserDeposit[]=[];
  listusers: Users[]=[];
  selectedusers: Users[]=[];
  search:any;
  showprogress=false;

  constructor(private Userserv:UsersService, public appserv: AppservicesService,private userserv: UsersService) { }

  ngOnInit() {
    if (this.usertype==='collectors') {
      this.getlistcollectors();
    }else{
      //this.getlistusers();
    }
  }
ionViewDidEnter(){
  this.defaultinput.setFocus();
}

handlesearchchange($event) {
  if (this.search.length > 0) {
    this.showprogress = true;
    this.Userserv.memberslookup({ enterprise_id: this.appserv.actualEse.id, keyword: this.search }).subscribe(
      response => {
        this.showprogress = false;
        this.listusers = response.map((user:any) => {
          const isAlreadySelected = this.selectedusers.some(selected => selected.id === user.id);
          return {
            ...user,
            selected: isAlreadySelected
          };
        });
      },
      error => {
        this.showprogress = false;
        this.appserv.presentToast("Une erreur est survenue. Veuillez réessayer", "danger");
        console.log('error members lookup', error);
      });
  } else {
    this.listusers = [];
  }
}

  sendList(){
    this.sendselecteduser();
  }

  selected(user: Users){
    if(this.multiselect>0 || this.criteria==="multiple"){
      const ifexists = this.selectedusers.find(u => u.id === user.id);
      if(!ifexists){
        this.selectedusers.push(user);
        user.selected=true;
      }else{
        this.selectedusers=this.selectedusers.filter(u=>u!=user);
        user.selected=false;
      }
    }else{
      this.appserv.modalCtrl.dismiss(user,'selected');
    }
  }

  sendselecteduser(){
    this.appserv.modalCtrl.dismiss(this.selectedusers,'selected');
  }

  getlistusers(){
    this.userserv.getlistusers(this.appserv.getactualuser().enterprise_id).subscribe(
      data=>{
        if(this.multiselect>0){
          data.forEach(user => {
             const searchfor=this.listsent.filter(a=>a.user_id===user.id);
             if(searchfor.length==0){
              this.listusers.push(user);
             }
          });
        }else{
          this.listusers=data;
        }
      },
      error=>{
        this.appserv.presentToast(`Erreur lors de la récupération de la liste des agents`,'danger');
      });
  } 
  
  getlistcollectors(){
    this.userserv.getlistusersbytypes({enterprise_id:this.appserv.getactualuser().enterprise_id,usertype:this.usertype}).subscribe(
      data=>{
        if(this.multiselect>0){
          data.forEach(user => {
             const searchfor=this.listsent.filter(a=>a.user_id===user.id);
             if(searchfor.length==0){
              this.listusers.push(user);
             }
          });
        }else{
          this.listusers=data;
        }
      },
      error=>{
        this.appserv.presentToast(`Erreur lors de la récupération de la liste des agents`,'danger');
      }
    )
  }
}
