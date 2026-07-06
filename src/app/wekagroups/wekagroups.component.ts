import { Component, OnInit,ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { UsersService } from '../services/users.service';
import { Fences } from '../interfaces/fences';
import { OthersentriesPage } from '../othersentries/othersentries.page';
import { ExpendituresComponent } from '../finances/expenditures/expenditures.component';
import { InvoicesComponent } from '../finances/invoices/invoices.component';
import { DebtsPage } from '../debts/debts.page';
import { FenceService } from '../services/fence.service';
import { InfosfenceComponent } from '../finances/fences/infosfence/infosfence.component';
import { VersementsComponent } from '../finances/fences/versements/versements.component';
import { MemberstransactionsService } from '../services/memberstransactions.service';
import { IonAccordionGroup, IonInput } from '@ionic/angular';
import { UserpickerComponent } from '../agents/userpicker/userpicker.component';
import { Users } from '../interfaces/users';
import { TransactionsvalidationComponent } from '../transactionsvalidation/transactionsvalidation.component';
import { NewgroupComponent } from '../newgroup/newgroup.component';
import { GroupService } from '../services/group.service';
import { EditwekagroupComponent } from '../editwekagroup/editwekagroup.component';
import { DynamicprintComponent } from '../dynamicprint/dynamicprint.component';

@Component({
  selector: 'app-wekagroups',
  templateUrl: './wekagroups.component.html',
  styleUrls: ['./wekagroups.component.scss'],
})
export class WekagroupsComponent implements OnInit {
  @ViewChild('defaultsearchinput') defaultsearchinput :IonInput;
  @ViewChild('accordionGroup',{static:true}) accordionGroup :IonAccordionGroup;
  groupslist:any[]=[];
  selectedmembers:Users[]=[];
  search:any;
  keptgroupslist:any[]=[];
  selectedgroupslist:any[]=[];
  buttonselectallgroups=false;
  generalfiltrer="date";
  loaded=false;
  
  monthtotalentries=0;
  showprogress=false;
  accountsegment="all";
  from=this.appserv.defaultdate();
  to=this.appserv.defaultdate();

  actualuser:any;
  defaultMoney=this.appserv.getDefaultmoney();

  public actionSheetButtons = [
    {
      text: 'Annuler',
      role:'cancel'
    },
    { 
      text: 'Imprimer la liste',
      icon:'print-outline',
      handler:()=>{
        this.printgroups();
      }
    },
    {
      text: 'Exporter en Excel',
      icon:'download-outline',
      handler:()=>{
        this.exportallgroupsinexcel();
      }
    },
    {
      text: 'Exporter en PDF',
      icon:'download-outline',
      handler:()=>{
        this.exportallgroupsinpdf();
      }
    },
  ];
  
  constructor(private groupserv:GroupService, public appserv: AppservicesService,private userServ: UsersService,private transactionserv: MemberstransactionsService, private Fenceserv: FenceService) { }
  
    ngOnInit() {
      this.actualuser=this.appserv.getactualuser();
      this.dashboard();
    }
    ionViewDidEnter(){
      this.defaultsearchinput.setFocus();
    }

    async editgroup(group){
      const modal = await this.appserv.modalCtrl.create({
        component:EditwekagroupComponent,
        componentProps:{groupsent:group},
        cssClass:"modal-border-radius-20",
        initialBreakpoint:0.5,
        breakpoints:[0.25,0.50,0.75,1]
      });
      modal.present();
      const {data,role} = await modal.onWillDismiss();
      if (role==="updated") {
        group.name=data.name;
        group.description=data.description;
        group.totalmembers=data.totalmembers;
      }
    }

    toggleAccordion = (valuesent:any) => {
      const nativeEl = this.accordionGroup;
      if (nativeEl.value ===valuesent.id) {
        nativeEl.value = undefined;
      } else {
        nativeEl.value =valuesent.id;
        valuesent.activated=true;
        this.handleopenaccordion(valuesent);
        console.log('accordion opened',valuesent);
      }
    };

    async addmembers(group){
      const modal = await this.appserv.modalCtrl.create({
        component:NewgroupComponent,
        componentProps:{groupsent:group},
        cssClass:"modal-border-radius-20"
      });
      modal.present();
      const {data,role} = await modal.onWillDismiss();
      if (role==="selected") {
        const load = await this.appserv.loadctrl.create({
          message:'Affectation en cours...',
          mode:'ios',
          spinner:'circular',
          translucent:true
        });
        load.present();
        this.groupserv.addmembers({group_id:group.id,members:data}).subscribe(
          response=>{
            load.dismiss();
            if (response.message==="success" && response.status===200) {
              group.members=response.data;
              group.totalmembers=response.data.length;
            }

            if (response.message==="error" && response.status===400) {
              if (response.error==="no group find") {
                this.appserv.presentToast("Groupe introuvable.","warning");
              } 
              
              if (response.error==="no group sent") {
                this.appserv.presentToast("Aucun groupe envoyé.","warning");
              }
            }
          },
          error=>{
            load.dismiss();
            this.appserv.presentToast("Impossible d'ajouter les membres.","danger");
          });
      }
    }

    handleopenaccordion(group:any){
      if (group.activated) {
        this.groupserv.members(group).subscribe(
          response=>{
            console.log('group members',response);
            group.members=response;
            group.totalmembers=group.members.length;
          },
          error=>{
            this.appserv.presentToast("Impossible de recuperer la liste des membres.","danger");
          });
      }
    }

  async menumember(user:any,group:any){
 
      let menubuttons = [
        {
          text: 'Annuler',
          role:'cancel'
        },
        {
          text:user.level==='admin'?"Révoquer le droit d'admin ":'Nommer admin du groupe?',
          handler: () => {
            if (user.level==="member") {
              if (user.collector) {
                this.updatelevel(group,user,user.level==='admin'?'member':'admin');
              }else{
                this.appserv.presentToast("L'agent doit être collecteur pour devenir admin du groupe!","warning");
              }
            }else{
              this.updatelevel(group,user,user.level==='admin'?'member':'admin');
            } 
          }
        },
        {
          text:'Retirer du groupe',
          handler: () => {
            let list =[];
            list.push(user.id);
            this.removemembers(group,list);
          }}
      ];
    
      const menu = await this.appserv.actionsheetctrl.create(
        {
          header: `${user.full_name?user.full_name:user.user_name}`,
          cssClass: 'myactionsheet',
          translucent: true,
          mode: 'ios',
          buttons: menubuttons
        }
      );
      if (this.appserv.permissionFilter('agents', 'edit_group')) {
        (await menu).present(); 
      }
  }

  async removemembers(group:any,list:any[]){
    if(list.length>0 && group.id){
      const load = await this.appserv.loadctrl.create({
        message:'Retrait des membres en cours...',
        mode:'ios',
        spinner:'circular',
        translucent:true
      });
      load.present();
    this.groupserv.removemembers({group_id:group.id,members:list}).subscribe(
      response=>{
        load.dismiss();
        if (response.message==="success" && response.status===200) {
          list.forEach(member => {
            group.members=group.members.filter(m=>m.id!==member);
          });
          group.totalmembers=group.members.length;
        } 
        
        if (response.message==="error" && response.status!==200) {
          this.appserv.presentToast('Une erreur est survenue lors du retrait des membres du groupe!','warning');
        }
      },
      error=>{
        load.dismiss();
      });
    }else{
      this.appserv.presentToast('Vous devez sélectionner au moins un membre à supprimer!','warning');
    }
  }  
  
async updatelevel(group:any,member:any,level:string){
    if(member.id && group.id && level){
      const load = await this.appserv.loadctrl.create({
        message:'Mise à jour membre...',
        mode:'ios',
        spinner:'circular',
        translucent:true
      });
      load.present();
    this.groupserv.memberslevel({group_id:group.id,member_id:member.id,level:level}).subscribe(
      response=>{
        load.dismiss();
        if (response.message==="success" && response.status===200) {
          if (level==='admin') {
            group.members.map((m)=>m.level='member');
          }
          //looking for the index
          const index = group.members.findIndex(m=>m.id===member.id);
          group.members[index]=response.data;
        } 
        
        if (response.message==="error" && response.status!==200) {
          this.appserv.presentToast('Une erreur est survenue lors de la mise à jour du membre!','warning');
        }
      },
      error=>{
        load.dismiss();
      });
    }else{
      this.appserv.presentToast('Vous devez fournir des informations suffisantes!','warning');
    }
  }

  handlesearchmembersingroup($event,group){
    if ($event.detail.value.length>0) {
        this.groupserv.memberslookup({group_id:group.id,keyword:$event.detail.value}).subscribe(
          response=>{
            this.showprogress=false;
            group.members=response;
            group.totalmembers=group.members.length;
            console.log('members lookup',response);
          },
          error=>{
            this.showprogress=false;
            this.appserv.presentToast("Une erreur est survenue. Veuillez réesayer","danger");
            console.log('error members lookup',error);
          }); 
    }
  }
    async newgroup(){
      const modal = await this.appserv.modalCtrl.create({
        component:NewgroupComponent,
        cssClass:"modal-border-radius-20"
      });
      modal.present();
      const {data,role} = await modal.onWillDismiss();
      if (role==="created") {
        this.groupslist.unshift(data);
      }
    }

    dashboard(){
      this.showprogress=true;
      this.loaded=true;
      if (this.appserv.isMyDeviceConnected()) {
        this.groupserv.getallgroups({user_id:this.appserv.actualUser.id}).subscribe(
          (response:any)=>{
            this.showprogress=false;
            this.loaded=false;
            if (response.message==="success" && response.status===200) {
              this.groupslist=response.data;
              this.groupslist.map((group)=>{
                group.activated=false;
              });
            } 
            
            if (response.message==="error" && response.status===400) {
              if (response.error==="not authorized") {
                this.appserv.presentToast("Vous n'êtes pas autorisé à acceder aux groupes!Veuillez contacter votre administrateur.","warning");
              }
              
              if (response.error==="no enterprise find") {
                this.appserv.presentToast("Vous ne faites partie d'aucune entreprise!Veuillez contacter votre administrateur.","warning");
              } 
              
              if (response.error==="no user find") {
                this.appserv.presentToast("Vous n'êtes pas identifié!Veuillez contacter votre administrateur.","warning");
              } 
              
              if (response.error==="no user sent") {
                this.appserv.presentToast("Nous ne sommes pas en mesure de traiter votre requête.!Veuillez contacter votre administrateur.","warning");
              }
            }
            console.log('dashboard data',response);
            
          },
          error=>{
            this.loaded=false;
          this.showprogress=false;
            this.appserv.presentToast('Une erreur est survenue lors de la récupération des groupes.','danger');
          });
      }
    }

    filterbygroups(){

    }
    
    handletransactionchange($event,transaction:any){
      if ($event.detail.checked) {
        transaction.selected=true;
        this.selectedgroupslist.push(transaction);
      }else{
        transaction.selected=false;
        this.selectedgroupslist=this.selectedgroupslist.filter(t=>t!==transaction);
      }
      console.log(this.selectedgroupslist.length,this.groupslist.length);
      if (this.selectedgroupslist.length===this.groupslist.length) {
        this.buttonselectallgroups=true;
      }else{
        this.buttonselectallgroups=false;
      }
    }

    selectalltransactions($event){
      if ($event.detail.checked) {
        this.groupslist.map((transaction)=>{
          transaction.selected=true;
        });
        this.selectedgroupslist=this.groupslist;
      }else{
        this.selectedgroupslist=[];
        this.groupslist.map((transaction)=>{
          transaction.selected=false;
        });
      }
      // console.log($event); 
    }
  
    async handleselectedtransactionschanged($event){
      if (this.selectedgroupslist.length>0) {
        let canapply=false;
        this.selectedgroupslist.map((transaction)=>{
          if (transaction.transaction_status==='pending') {
            canapply=true;
          }else{
            canapply=false;
          }
        });
  
        if (canapply) {
          const load = await this.appserv.loadctrl.create({
            message:$event.detail.value==='cancel'?'Annulation en cours...':'Validation en cours...',
            mode:'ios',
            translucent:true,
            spinner:'circular'
          });
          load.present();
          this.transactionserv.transactionstatuschange({user:this.appserv.actualUser,data:this.selectedgroupslist}).subscribe(
            response=>{
              load.dismiss();
              switch (response.message) {
                case "success":
                  this.appserv.presentToast($event.detail.value==='cancel'?`Annulation des transactions terminée avec succès.`:`Validation des transactions terminée avec succès.`,'success');
                  this.alltransactions();
                  break;
                case "error":
                  if (response.error==="unknown user") {
                    this.appserv.presentToast(`Utilisateur inconnu. Nous sommes désolé!`,'warning');
                  } 
                  
                  else if (response.error==="unauthorized user") {
                    this.appserv.presentToast(`Utilisateur non autorisé à faire cette action!. Nous sommes désolé!`,'warning');
                  } 
                  
                  else if (response.error==="unauthorized user") {
                    this.appserv.presentToast(`Utilisateur non autorisé à faire cette action!. Nous sommes désolé!`,'warning');
                  }
  
                  else{
                    this.appserv.presentToast(`Action non terminée. Veuillez réessayer plus tard!. Nous sommes désolé!`,'warning');
                  }
                  break;
                default:
                  break;
              }
              console.log(response);
              
            },error=>{
              load.dismiss();
              this.appserv.presentToast($event.detail.value==='cancel'?`Erreur lors de l'annulation des transactions.`:`Erreur lors de la validation des transactions.`,'danger');
            });
         
        }else{
          this.appserv.presentToast("Veuillez sélectionner seulement les opérations en attente s'il vous plaît!","warning");
        }
      }else{
        this.appserv.presentToast("Veuillez sélectionner au moins une transaction s'il vous plaît!","warning");
      }
      console.log($event);
    }
    handletypechanged($event){
      if ($event.detail.value==='all') {
        this.groupslist=this.keptgroupslist;
      }else{
        this.groupslist=this.keptgroupslist.filter(t=>t.type===$event.detail.value);
      }
    }
  
    transactionsfilter(criteria:any){
      if (criteria==='all') {
        this.search="";
        this.selectedmembers=[];
        this.groupslist=this.keptgroupslist;
      }else{
        this.groupslist=this.keptgroupslist.filter(t=>t.transaction_status===criteria);
      }
    }
  
    handleRefresh(event:any) {
      setTimeout(() => {
        this.ngOnInit();
        event.target.complete();
      }, 2000);
    };
  
   
  
    async agentsfilter(){
      const modal = await this.appserv.modalCtrl.create({
        component:UserpickerComponent,
        componentProps:{"criteria":"multiple"},
        cssClass:"modal-border-radius-20"
      });
      modal.present();
      const {data,role} = await modal.onWillDismiss();
      if (role==="selected") {
        this.selectedmembers=data;
        this.alltransactions();
      }
    }

    async PdfExportGroup(group:any){
     
        let data =[['N°','Noms','Phone','Email','UUID','Niveau','Observation']]; 
        let index=0;

        group.members.forEach(el => {
          index=index+1;
            const obj =[
              index,
              el.full_name,
              el.user_phone,
              el.user_mail,
              el.uuid,
              el.level,
              ""
            ];
            data.push(obj);
        });
        const pdfojb=this.appserv.pdftabledownload(data,'GROUPE: '+group.name.replace(" "," "),'Liste exhaustive des membres du groupe.','portrait','A4');
        this.appserv.pdfaction(pdfojb,'Groupe'+group.name);
    }

    async ExcelexportGroup(group:any){
     
        let data =[['Groupe', group.name.replace(" "," ")]];
        // data.push();
        data.push(['Total membres',group.totalmembers]);
        data.push(['N°','Noms','Phone','Email','UUID','Niveau','Observation'])
        
        let index = 0;
        group.members.forEach(el => {
            index=index+1;
            const obj =[
              index,
              el.full_name,
              el.user_phone,
              el.user_mail,
              el.uuid,
              el.level,
              ""
            ];
            data.push(obj);
        });
        this.appserv.exportInToExcel(data,'csv','Groupe'+group.name);
  
    }
    

    async printgroups(){
      this.groupserv.getallgroupswithmembers({enterprise_id:this.appserv.getactualEse().id}).subscribe(
        async response=>{
            if (response.length>0) {
              const modal = await this.appserv.modalCtrl.create({
                component:DynamicprintComponent,
                componentProps:{groupsSent:response,criteria:"groups"},
                cssClass:"modal-border-radius-20"
              });
              modal.present();
            }else{
              this.appserv.presentToast("Aucun groupe disponible.","warning");
            }
        },
        error=>{
          this.appserv.presentToast("Impossible de recuperer la liste des groupes","danger");
        });
    }

    exportallgroupsinexcel(){

      this.groupserv.getallgroupswithmembers({enterprise_id:this.appserv.getactualEse().id}).subscribe(
        response=>{
            // console.log("all groupes",response);
            if (response.length>0) {
              let data =[["GROUPES DISPONIBLES",response.length]];
            
              data.push(['N°','Groupe','Membre','Phone','Email','UUID','Niveau','Observation']);
              let index = 0;
              response.forEach(element => {
                element.members.forEach(el => {
                  index=index+1;
                  const obj =[
                    index,
                    element.name,
                    el.full_name,
                    el.user_phone,
                    el.user_mail,
                    el.uuid,
                    el.level,
                    ""
                  ];
                  data.push(obj);
              });
              });
                this.appserv.exportInToExcel(data,'csv','Groupes');
            }else{
              this.appserv.presentToast("Aucun groupe disponible.","warning");
            }
        },
        error=>{
          this.appserv.presentToast("Impossible de recuperer la liste des groupes","danger");
        });

    }

    exportallgroupsinpdf(){

      this.groupserv.getallgroupswithmembers({enterprise_id:this.appserv.getactualEse().id}).subscribe(
        response=>{
            // console.log("all groupes",response);
            if (response.length>0) {
              let data =[['N°','Groupe','Membre','Phone','Email','UUID','Niveau','Observation']];
              let index = 0;
                response.forEach(element => {
                  element.members.forEach(el => {
                    index=index+1;
                    const obj =[
                      index,
                      element.name,
                      el.full_name,
                      el.user_phone,
                      el.user_mail,
                      el.uuid,
                      el.level,
                      ""
                    ];
                    data.push(obj);
                });
              });
              const pdfojb=this.appserv.pdftabledownload(data,'NOMBRE TOTAL DES GROUPES: '+response.length,'Liste des groupes avec leurs membres.','portrait','A4');
              this.appserv.pdfaction(pdfojb,'Groupes');
            }else{
              this.appserv.presentToast("Aucun groupe disponible.","warning");
            }
        },
        error=>{
          this.appserv.presentToast("Impossible de recuperer la liste des groupes","danger");
        });
    }

    async alltransactions(){
      this.groupslist=[];
      this.selectedgroupslist=[];
      this.showprogress=true;
      this.loaded=true;
      let members=[];
      if (this.selectedmembers.length>0) {
        this.selectedmembers.forEach(member => {
          members.push(member.id);
        });
      }
      this.transactionserv.transactionshistories({enterprise_id:this.appserv.getactualEse().id,from:this.from,to:this.to,user_id:this.appserv.getactualuser().id,members:members}).subscribe(
        response=>{
          this.loaded=false;
          this.showprogress=false;
          // console.log('transactions',response);
          if (response.message==="error" && response.error==="user not sent") {
            this.appserv.presentToast("Utilisateur non identifié.","warning");
          }
          
          if (response.message==="error" && response.error==="unknown user") {
            this.appserv.presentToast("Nous n'arrivons pas à vous identifier.","warning");
          }  
          
          if (response.message==="error" && response.error==="unknown enterprise") {
            this.appserv.presentToast("Désolé, votre entreprise n'est pas identifiée!","warning");
          } 
          
          if (response.message==="success" && response.error===null && response.status===200) {
            this.groupslist=response.data;
            this.keptgroupslist=this.groupslist;
          }
        },error=>{
          // console.log(error);
          this.loaded=false;
          this.showprogress=false;
          this.appserv.presentToast("Erreur survenue lors du chargement des transactions.","danger");
        });
    }
  
    async menutransaction(transaction:any){
      const modal = await this.appserv.modalCtrl.create({
        component:TransactionsvalidationComponent,
        componentProps:{transactionsent:transaction},
        cssClass:"modal-border-radius-20"
      });
      modal.present();
    }
  
    async menufence(fence:Fences){
      if (this.appserv.actualUser.user_type==="super_admin" && this.appserv.permissionFilter('clôtures', 'delete')) {
        const sheet = await this.appserv.actionsheetctrl.create({
          header:`${fence.user_name} (${fence.amount_due} ${this.defaultMoney.abreviation})`,
          translucent:true,
          mode:'ios',
          buttons:[
            {text:"Annuler",role:"cancel"},
            {text:"Détail",handler:()=>{
              this.detailfence(fence);
            }},
            {text:"Réceptionner",handler:()=>{
              this.vertsement(fence);
            }},
            {text:"Supprimer",handler:()=>{
              this.deletefence(fence);
            }}
          ]
          });
          sheet.present();
      }
    }
  
    async detailfence(fence: Fences){
      const modal = await this.appserv.modalCtrl.create({
        component:InfosfenceComponent,
        componentProps:{'fencesent':{fence:fence}},
        cssClass:"modal-border-radius-20"
      });
      modal.present();
      const {data,role} = await modal.onWillDismiss();
      if(role=='deleted'){
      
      }
    }
  
    async vertsement(fence: Fences){
  
      const modal =await  this.appserv.modalCtrl.create({
        component:VersementsComponent,
        componentProps:{'fencesent':{fence:fence}},
        cssClass:"modal-border-radius-20"
      });
      (await modal).present();
      await modal.onWillDismiss();
      this.ngOnInit();
    }
  
    async deletefence(fence: Fences){
      const alert = await this.appserv.alertctrl.create({
        header:'Suppression',
        subHeader:`${fence.user_name}`,
        message:'Voulez-vous vraiment supprimer cette clôture?',
        mode:'ios',
        translucent:true,
        buttons:[
          {text:'Non',role:'cancel'},
          {text:'Oui',handler: async ()=> {
            this.showprogress=true;
            this.Fenceserv.delete(fence.id).subscribe(
              data=>{
                this.showprogress=false;
                if(data>0){
                  this.appserv.presentToast(`Clôture supprimée avec succès`,'success');
                  
                }else{
                  this.appserv.presentToast(`Opération  echouée:`,'warning');
                }
              },
              error=>{
                this.showprogress=false;
                this.appserv.presentToast(`Suppression impossible`,'danger');
              }
            );
          },}
        ]
      });
      alert.present();
    }
  
    /** fences methods */
      deletefilterfences(){}
      async fencesfilterbyagent(){}
      async fencesfilterPOS(){}
      async fencesperiodicfilter(){
       const period = await this.periodicfilter();
      }
    
      async gotoentries(){
        const modal = await this.appserv.modalCtrl.create({
          component:OthersentriesPage,
          cssClass:"modal-border-radius-20"
        });
        modal.present();
        await modal.onWillDismiss();
        this.ngOnInit();
      }  
      
      async gotodebts(){
        const modal = await this.appserv.modalCtrl.create({
          component:DebtsPage,
          componentProps:{"ismodal":true},
          cssClass:"modal-border-radius-20"
        });
        modal.present();
        await modal.onWillDismiss();
        this.ngOnInit();
      }   
      
      async gotoinvoices(){
        const modal = await this.appserv.modalCtrl.create({
          component:InvoicesComponent,
          cssClass:"modal-border-radius-20"
        });
        modal.present();
        await modal.onWillDismiss();
        this.ngOnInit();
      }  
      
      async gotoexpenditures(){
        const modal = await this.appserv.modalCtrl.create({
          component:ExpendituresComponent,
          cssClass:"modal-border-radius-20"
        });
        modal.present();
        await modal.onWillDismiss();
        this.ngOnInit();
      }
      /**
       * Balance methods
       */
      deletefilterbalance(){}
    
      async balanceperiodicfilter(){
        const period = await this.periodicfilter();
      }
      
      async filterbalancePOS(){}
    
      
    
      /**
       * Accounts methods
       */
      async deletefilteraccount(){}
    
      async accountperiodicfilter(){
        const period = await this.periodicfilter();
      }
    
      async accountsfilterbyagent(){}
    
      async accountAccountfilter(){}
    
      async accountPOSfilter(){}
    
      /**
       * Debts methods
       */
      async deletefilterDebts(){}
      
      async debtfilterbyagent(){}
    
      async debtperiodicfilter(){
        const period = await this.periodicfilter();
      }
    
      async debtfilterbyCustomer(){}
      async debtfilterbyPOS(){}
      /**
       * Expenditures methods
       */
      async deletefilterExpenditures(){}
      async ExpendituresFilterbyAgent(){}
      async ExpendituresPeriodicFilter(){
        const period = await this.periodicfilter();
      }
      async ExpendituresFilterbyAccount(){}
      async ExpendituresFilterbyPOS(){}
    
      /**
       * Entries
       */
      async deletefilterEntries(){}
      async EntriesFilterbyAgent(){}
      async EntriesPeriodicFilter(){
        const period = await this.periodicfilter();
      }
      async EntriesFilterbyAccount(){}
      async EntriesFilterbyPos(){}
    
      /**
       * general methods
       */
      async periodicfilter(){
        let dateFrom="";
        let dateTo="";
        const modal = await this.appserv.periodicfilter();
        modal.present(); 
      
        const {data,role} = await modal.onWillDismiss();
        if(role=='selected'){
          dateFrom=data.from;
          dateTo=data.to;
        }
        return {from:dateFrom,to:dateTo};
      }
    
      async dashboardperiodfilter(){
        this.generalfiltrer="date";
        const period = await  this.periodicfilter();
        this.from=period.from;
        this.to=period.to;
        this.alltransactions();
      }
      async generalPOSfilter(){} 
}
