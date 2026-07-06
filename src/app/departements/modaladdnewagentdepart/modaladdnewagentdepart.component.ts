/* eslint-disable @typescript-eslint/naming-convention */
import { Users } from 'src/app/interfaces/users';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { SwiperOptions } from 'swiper';
import { FormBuilder } from '@angular/forms';
import { Departments } from 'src/app/interfaces/departments';

@Component({
  selector: 'app-modaladdnewagentdepart',
  templateUrl: './modaladdnewagentdepart.component.html',
  styleUrls: ['./modaladdnewagentdepart.component.scss'],
})
export class ModaladdnewagentdepartComponent implements OnInit {
  @Input() departsent: Departments;
  @Input() alreadyaffected: Users[];
  affected: Users[]=[];
  listagents: Users[]=[];
  listaffectations: Users[]=[];
  agentsearch: string;
  isfiltered=false;
  showprogress=false;
  imgUrl=this.appserv.imgUrl;
newaffectation=this.formbuild.group({
  level:[],
  user_id:[],
  department_id:[]
});

  config: SwiperOptions = {
    slidesPerView:5,
    spaceBetween:20,
  };

  constructor(private formbuild: FormBuilder,private modalctrl: ModalController,private appserv: AppservicesService) { }

  ngOnInit() {
    this.getlistagents();
    this.affected=this.alreadyaffected;
  }

  async listfilter(){
    this.isfiltered=!this.isfiltered;
    if(this.isfiltered){
      this.listagents=this.listagents.filter(a=>a.department_id==null);
    }else{
      this.getlistagents();
    }
  }
  async closemodal(){
    // this.modalctrl.dismiss(null,'addsuccessfuly');
    this.modalctrl.dismiss(null,'dismissed');
  }

  async getlistagents(){
    // this.appserv.getlistagentsapi().subscribe(
    //   data=>{
    //     this.listagents=data;
    //   },
    //   error=>{
    //     this.appserv.presentToast(`Erreur lors de la récupération des agents`,'danger');
    //   }
    // );
  }

  async addtolist(agent: Users){
    if(this.listaffectations.indexOf(agent)===-1){
      this.listaffectations.push(agent);
      agent.selected=true;
    }else{
     this.deletefromlist(agent);
    }
  }

  async deletefromlist(user: Users){
    this.listaffectations=this.listaffectations.filter(a=>a.id!==user.id);
      user.selected=false;
  }

  async syncdata(user: Users){
    this.newaffectation.patchValue({
      level:'simple',
      user_id:user.id,
      department_id:this.departsent.id
    });
  }

  async sendpeoples(){
    if(this.listaffectations.length>0){
      this.listaffectations.forEach(affectation => {
        this.syncdata(affectation);
        this.showprogress=true;
        // this.appserv.newaffectationapi(this.newaffectation.value).subscribe(
        //   data=>{
        //     this.showprogress=false;
        //     this.alreadyaffected.push(affectation);
        //     this.departsent.nbrusers +=1;
        //     this.deletefromlist(affectation);
        //     if(this.listaffectations.length===0){
        //       this.appserv.presentToast(`Opération d'affectation terminée avec succès`,'success');
        //       this.modalctrl.dismiss();
        //     };
        //   },
        //   error=>{
        //     this.showprogress=false;
        //     this.appserv.presentToast(`Erreur d'affectation`,'warning');
        //   });
      });
    }else{
      this.appserv.presentToast(`Vous devez au moins sélectionner un agent`,'warning');
    }
  }
}
