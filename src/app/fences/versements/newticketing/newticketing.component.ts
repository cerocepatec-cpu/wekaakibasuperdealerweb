import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Fences } from 'src/app/interfaces/fences';
import { AppservicesService } from 'src/app/services/appservices.service';
import { FenceService } from 'src/app/services/fence.service';

@Component({
  selector: 'app-newticketing',
  templateUrl: './newticketing.component.html',
  styleUrls: ['./newticketing.component.scss'],
})
export class NewticketingComponent implements OnInit {
  @Input() fencesent : Fences={};
  showprogress=false;
  newticketing=this.fb.group({
    user_id: [0,Validators.required],
    fence_id: [0,Validators.required],
    money_id: [0],
    amount: ['',Validators.required],
    ticketing: [''],
    note: ['']
  });

  constructor(public appserv: AppservicesService,private fb: FormBuilder,private fenceserv: FenceService) { }

  ngOnInit() {
    this.sycingdata();
  }

  sycingdata(){
    this.newticketing.patchValue({
      user_id:this.appserv.getactualuser().id,
      fence_id:this.fencesent.fence.id,
      amount:this.fencesent.fence.sold
    });
  }

  saveticketing(){
    this.showprogress=true;
    this.fenceserv.saveticketing(this.newticketing.value).subscribe(
      data=>{
        //console.log(data);
        this.showprogress=false;
        this.appserv.presentToast(`Versement enregistré avec succès`,'success');
        this.appserv.modalCtrl.dismiss(data,'added');
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Enregistrement impossible`,'danger');
      }
    )
  }

}
