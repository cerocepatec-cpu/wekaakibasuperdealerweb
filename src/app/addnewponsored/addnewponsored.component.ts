
import { IonInput } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { Component, OnInit,Input,ViewChild} from '@angular/core';
import { UserDeposit } from 'src/app/interfaces/userDeposit';
import { Users } from 'src/app/interfaces/users';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-addnewponsored',
  templateUrl: './addnewponsored.component.html',
  styleUrls: ['./addnewponsored.component.scss'],
})
export class AddnewponsoredComponent implements OnInit {

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
    this.getlistusers();
  }

  ionViewDidEnter(){
    this.defaultinput.setFocus();
  }

  sendList(){
    this.sendselecteduser();
  }

  selected(user: Users){
    if(this.multiselect>0 || this.criteria==="multiple"){
      const ifexists = this.selectedusers.indexOf(user);
      if(ifexists===-1){
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

 getlistusers() {
  // On récupère les IDs des utilisateurs actuellement sélectionnés
  const selectedIds = new Set(this.listusers?.filter(u => u.selected)?.map(u => u.id));

  this.userserv.membersnotsponsorised({
    enterprise_id: this.appserv.actualEse.id,
    keyword: this.search
  }).subscribe(
    response => {
      // Réinjecte l'état de sélection dans les nouveaux résultats
      this.listusers = response.map((user: any) => ({
        ...user,
        selected: selectedIds.has(user.id)
      }));
      console.log("response from searching", this.listusers);
    },
    error => {
      this.appserv.presentToast(`Erreur lors de la récupération de la liste des agents`, 'danger');
    }
  );
}

}
