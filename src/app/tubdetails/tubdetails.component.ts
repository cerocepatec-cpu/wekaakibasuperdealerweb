/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { Mouvement } from '../interfaces/mouvement';
import { Tubs } from './../interfaces/tubs';
import { Component, OnInit ,Input} from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Money } from '../interfaces/money';
import { Users } from '../interfaces/users';
import { NewoperationtubComponent } from '../tubs/newoperationtub/newoperationtub.component';
import { ModalListOperationsbyfundsComponent } from '../tubs/modal-list-operationsbyfunds/modal-list-operationsbyfunds.component';
import { FormBuilder,Validators } from '@angular/forms';
import { TransfertfoundComponent } from '../tubs/transfertfound/transfertfound.component';
import { TipquantityComponent } from '../tab2/tipquantity/tipquantity.component';
import { AppservicesService } from '../services/appservices.service';
import { UsersService } from '../services/users.service';
import { MoneyService } from '../services/money.service';

@Component({
  selector: 'app-tubdetails',
  templateUrl: './tubdetails.component.html',
  styleUrls: ['./tubdetails.component.scss'],
})
export class TubdetailsComponent implements OnInit {
  @Input() tubsent: Tubs;
  @Input() listsent: Tubs[]=[];
  showedingmode=false;
  isDescriptionModalOpen=false;
  listrequests: Request[]=[];
  listmouvements: Mouvement[]=[];
  allmouvements: Mouvement[]=[];
  listmoney: Money[]=[];
  listagents: Users[]=[];
  operationsfilter='all';
  edited=false;
  showprogress=false;

  tubinfos = this.formbuild.group({
    id:[],
    description:['',Validators.required],
    user_id:[0,Validators.required],
    sold:[0,Validators.required],
    money_id:[0,Validators.required],
    created_by:[],
    principal:[]
  });
  constructor(private formbuild: FormBuilder,private alertctrl: AlertController,
    private moneyserv:MoneyService, private userserv:UsersService, private modalctr: ModalController, public appserv: AppservicesService) { }

  ngOnInit() {this.getlistAgents();this.getlistMoney();this.getlistmouvements();this.sycingformdata();}

  async gototransfert(){
    const modal = await this.appserv.modalCtrl.create({
      component:TransfertfoundComponent,
      componentProps:{'tubSent':this.tubsent,'mouvementsent':this.listmouvements},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async sycingformdata(){
    this.tubinfos.patchValue({
      id:this.tubsent.id,
      description:this.tubsent.description,
      user_id:this.tubsent.user_id,
      sold:this.tubsent.sold,
      money_id:this.tubsent.money_id,
      created_by:this.tubsent.created_at,
      principal:this.tubsent.principal
    });
  };
  async deletetub(tub: Tubs){

    const alertc=this.alertctrl.create({
      header:'Suppression caisse',
      subHeader:`${tub.description}`,
      mode:'ios',
      message:`Confirmez-vous la suppréssion de cette caisse et toutes 
      ses informations? Noter que toutes les opérations liées à cette caisse vont disparaître.`,
      buttons:[
        {
          text:'Non',
          role:'cancel'
        },
        {
          text:'Oui',
          handler:()=>{
            this.appserv.deleteTubapi(tub.id).subscribe(
              data=>{
                this.appserv.presentToast(`Caisse ${tub.description} supprimée avec succès.`,'success');
                this.modalctr.dismiss(tub,'deleted');
              },
              error=>{
                this.appserv.presentToast(`Error survenue lors de la suppression de la Caisse ${tub.description}`,'danger');
              });
          }
        }
      ]
    });

    (await (alertc)).present();
  }

  async closemodal(){
    if(this.edited){this.modalctr.dismiss(this.tubsent,'edited');}else{
      this.modalctr.dismiss();
    }
  }

  async editTub(){
    this.showprogress=true;
    this.appserv.editTubapi(this.tubinfos.value).subscribe(
      data=>{
        this.showprogress=false;
        if (data.principal) {
          this.listsent.forEach(element => {
            element.principal=0;
          });
        }
        this.tubsent.created_at=data.created_at;
        this.tubsent.description=data.description;
        this.tubsent.money_abreviation=data.money_abreviation;
        this.tubsent.money_id=data.money_id;
        this.tubsent.mouvements=data.mouvements;
        this.tubsent.sold=data.sold;
        this.tubsent.user_id=data.user_id;
        this.tubsent.user_name=data.user_name;
        this.tubsent.principal=data.principal;
        this.edited=true;
        this.appserv.presentToast('Caisse modifiée avec succès','success');
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Impossible de modifier la caisse. Veuillez vérifier la connexion`,'danger');
      }
    );
  }

  async openaddnewoperation(){
    const modal = await this.modalctr.create({
      component:NewoperationtubComponent,
      componentProps:{tubsent:this.tubsent,fundsListSent:this.listsent},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
    const  {data,role} = await modal.onWillDismiss();
    if(role == 'addsuccessfuly'){

    }
  }
  async opensearchoperation(){
    const modal = await this.modalctr.create({
      component:ModalListOperationsbyfundsComponent,
      componentProps:{'listmouvements':this.allmouvements,'tubsent':this.tubsent},
      cssClass:'modal-border-radius-20'
    });
    modal.present();
  }

  async menuoperation(mouvement: Mouvement){
    if (this.appserv.actualUser.id===this.tubsent.user_id) {
      const menuctrl = await this.appserv.actionsheetctrl.create({
        header:`Que voulez-vous faire?`,
        mode:'ios',
        translucent:true,
        buttons:[
          {text:'Rien',role:'cancel'},
          {text:'Annuler opération',handler:()=> {
              this.canceltransfer(mouvement);
          },},
        ]
      });
      menuctrl.present();
    }
  }

  async canceltransfer(mouvement: Mouvement){
    const alert = await this.appserv.alertctrl.create({
      header:'Suppression',
      message:'Confirmez-vous cette action?',
      mode:'ios',
      translucent:true,
      buttons:[
        {text:'Non',role:'cancel'},
        {text:'Oui',handler:()=> {
            this.canceltoapi(mouvement);
        },},
      ]
    });
    alert.present();
  }

  async restetub(tub: Tubs){
    const modal = await this.appserv.modalCtrl.create({
      component:TipquantityComponent,
      componentProps:{'title':"Entrer une balance d'ouverture",'zero_accepted':true},
      initialBreakpoint:0.75,
      breakpoints:[0.25,0.50,0.75,1],
      cssClass: 'modal-500-width modal-border-radius-20'
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role==='edited'){
      this.showprogress=true;
      const object ={user_id:this.appserv.actualUser.id,fund_id:tub.id,amount:data};
        this.appserv.resetTub(object).subscribe(
          datareturn=>{
            this.showprogress=false;
            tub.sold=datareturn.tub.sold;
            this.listmouvements.push(datareturn.history);
            this.appserv.presentToast(`Caisse ${tub.description} "modifiée avec succès!")}`,'success');
          },error=>{
            this.showprogress=false;
            this.appserv.presentToast('Modification échouée',`danger`);
          });
    }
  }

  async canceltoapi(mouvement: Mouvement){
    this.showprogress=true;
    this.appserv.deleterequesthistory(mouvement).subscribe(
      data=>{
        this.showprogress=false;
        if (data.message=='deleted') {
          this.appserv.presentToast('Opération supprimée avec succès!','success');
          if (mouvement.type=='entry') {
            this.tubsent.sold=this.tubsent.sold-mouvement.amount;
          } else {
            this.tubsent.sold=this.tubsent.sold-mouvement.amount;
          }

          this.listmouvements=this.listmouvements.filter(t=>t!=mouvement);
        } else {
          this.appserv.presentToast('Erreur survenue. Réessayez svp!','warning');
        }
      },
      error=>{
        this.showprogress=false;
        this.appserv.presentToast('Erreur survenue. Réessayez svp!','danger');
      });
  }

  async filteroperations(criteria: string){
    if(criteria==='all'){
      this.listmouvements=this.allmouvements;
    }
    else{
      this.listmouvements=this.allmouvements.filter(m=>m.type===criteria);
    }
  }

  async   getlistAgents(){
    this.userserv.affectedusers().subscribe({
      next: (data) => {
        console.log('users list', data);
        this.listagents = data.filter((u) => u.id !== this.appserv.getactualuser().id);
      },
      error: (err) => {
        console.log(err);
        this.appserv.presentToast(
          'Erreur survenue lors de la recupération de la liste des agents. Veuillez réssayer ou vérifier votre connexion svp!',
          'danger'
        );
      },
    });
  }

  async getlistmouvements(){
    this.showprogress=true;
    this.appserv.getlistmouvementsbyfund(this.tubsent.id).subscribe(
      data=>{
        this.showprogress=false;
        this.allmouvements=data;
        this.listmouvements=data;
      },error=>{
        this.showprogress=false;
        this.appserv.presentToast(`Erreur lors de la recuperation de l'historique des opérations`,`danger`);
      }
    );
  }

  async getlistMoney(){
    this.moneyserv.getlistmonnaiesapi(this.appserv.actualEse.id).subscribe(
      data=>{
        this.listmoney=data;
      },
      error=>{
        this.appserv.presentToast('Erreur survenue lors de la recupération de la liste des monnaies.','danger');
      }
    );
  }
}
