import { Component, OnInit } from '@angular/core';
import { Enterprise } from 'src/app/interfaces/enterprise';
import { AppservicesService } from 'src/app/services/appservices.service';

@Component({
  selector: 'app-pickenterprise',
  templateUrl: './pickenterprise.component.html',
  styleUrls: ['./pickenterprise.component.scss'],
})
export class PickenterpriseComponent implements OnInit {

  showprogress=false;
  listenterprises:Enterprise[]=[];
  selectedenterprises:Enterprise[]=[];

  constructor(public appserv:AppservicesService) { }

  ngOnInit() {}

  selected(enterprise: Enterprise){
    const ifselected = this.selectedenterprises.indexOf(enterprise);
    if(ifselected==-1){
      this.selectedenterprises.push(enterprise);
    }else{
      this.selectedenterprises=this.selectedenterprises.filter(r=>r!=enterprise);
    }
  }

  senddata(){
    if(this.selectedenterprises.length>0){
      this.appserv.modalCtrl.dismiss(this.selectedenterprises,'selected');
    }else{
      this.appserv.presentToast(`Vous devez sélectionner au moins un rôle`,'warning');
    }
  }

}
