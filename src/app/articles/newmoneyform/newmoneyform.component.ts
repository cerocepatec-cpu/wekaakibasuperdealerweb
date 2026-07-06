import { Component, OnInit } from '@angular/core';
import { AppservicesService } from '../../services/appservices.service';
import { FormBuilder } from '@angular/forms';
import { MoneyService } from 'src/app/services/money.service';

@Component({
  selector: 'app-newmoneyform',
  templateUrl: './newmoneyform.component.html',
  styleUrls: ['./newmoneyform.component.scss'],
})
export class NewmoneyformComponent implements OnInit {
  showprogress=false;
  newmoneyform=this.formbuild.group({
    money_name:[],
    abreviation:[]
  });
  constructor(private moneyserv: MoneyService, private appserv: AppservicesService,private formbuild: FormBuilder) { }

  ngOnInit() {}

  closemodal(){this.appserv.modalCtrl.dismiss();}

  async addnew(){
    this.moneyserv.newmonyeapi(this.newmoneyform.value).subscribe(
      data=>{
        //save to local storage
        this.appserv.modalCtrl.dismiss(data,'added');
      },
      error=>{
        //save to local storage
        // console.log('Erreur insertion monnaie...' + error);
      }
    );
  }

}
