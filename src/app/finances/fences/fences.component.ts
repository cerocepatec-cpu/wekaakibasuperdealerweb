import { Component, OnInit, ViewChild } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { Fences } from 'src/app/interfaces/fences';
import { FenceService } from 'src/app/services/fence.service';
import { InfosfenceComponent } from './infosfence/infosfence.component';
import { EditfenceComponent } from './editfence/editfence.component';
import { NewfenceComponent } from './newfence/newfence.component';
import { FundService } from 'src/app/services/funds.service';
import { TipquantityComponent } from 'src/app/tab2/tipquantity/tipquantity.component';
import { IonInput } from '@ionic/angular';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { MoneyService } from 'src/app/services/money.service';
import { UserpickerComponent } from 'src/app/agents/userpicker/userpicker.component';
@Component({
  selector: 'app-fences',
  templateUrl: './fences.component.html',
  styleUrls: ['./fences.component.scss'],
})
export class FencesComponent implements OnInit {
@ViewChild("defaultinput") defaultinput!:IonInput;
closures: any[] = [];
agents:any[]=[];
currencies:any[]=[];
funds:any[]=[];
filters: any = {};
loading = false;
page = 1;
lastPage = 1;
search:any;
showfilterdates=false;
groupedClosures:Record<string, any[]>;

  constructor(
    public appserv: AppservicesService, 
    private Fenceserv: FenceService,
    private moneyserv:MoneyService,
    private fundserv:FundService,
    private authserv:AuthentificationService
  ) { }

  ngOnInit() {
     this.loadClosures();
  }

  ngAfterViewInit(){
    setTimeout(async() => {
      this.defaultinput.setFocus();
      this.getlistTubs();
      this.currencies = await this.moneyserv.getesemoneys();
    }, 200);
  }

  loadClosures(page: number = 1) {
    this.loading = true;
    this.filters.page = page;
    this.Fenceserv.getClosures(this.filters).subscribe(res => {
      // console.log(res);
      this.closures = res.data;
      this.lastPage = res.last_page;
      this.groupClosures();
      this.loading = false;
    });
  }

   groupClosures() {
    this.groupedClosures = {};
    this.closures.forEach(c => {
      const key = c.closed_at.split('T')[0] + '_' + c.user.name;
      if (!this.groupedClosures[key]) this.groupedClosures[key] = [];
      this.groupedClosures[key].push(c);
    });
  }

   nextPage() {
    if(this.page < this.lastPage) {
      this.page++;
      this.loadClosures(this.page);
    }
  }

  prevPage() {
    if(this.page > 1) {
      this.page--;
      this.loadClosures(this.page);
    }
  }

  async pickusers(){
    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerComponent,
      initialBreakpoint:0.50,
      breakpoints:[0.25,0.50,0.75,1],
      mode:'ios',
      cssClass:"modal-border-radius-20",
      componentProps:{multiselect:1}
    });
    await modal.present();
    const {data,role} = await modal.onWillDismiss();
    if(role==="selected" && data.length>0){
      this.filters.agent_id = data.map((u: any) => u.id);
      console.log("Selected agent IDs for filter:", this.filters.agent_id);
      this.loadClosures();
      console.log("selected users",data);
    }else{
      this.appserv.presentToast("Aucun agent sélectionné.","warning");
    }
  }
  async editfence(fence: Fences){
    const modal = await this.appserv.modalCtrl.create({
      component:EditfenceComponent,
      componentProps:{Fencesent:fence}
    });
    modal.present();
  }

  async detailfence(fence:any){
    const modal = await this.appserv.modalCtrl.create({
      component:InfosfenceComponent,
      componentProps:{closure:fence},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role} = await modal.onWillDismiss();
  }

  async validate(closure: any) {
    const pin :any= await this.authserv.callPinModal();
    if (!pin || pin.length<4) {
       this.appserv.presentToast('Aucun ou mauvais Pin fourni svp!', 'warning');
       return;
    }
    const modal = await this.appserv.modalCtrl.create({
      component:TipquantityComponent,
      initialBreakpoint:0.25,
      breakpoints:[0.25,0.50],
      componentProps:{title:"Entrer le montant reçu",numbersent:closure.total_amount},
      cssClass:"modal-border-radius-20"
    });
    modal.present();
    const {data,role}= await modal.onWillDismiss();
    if(data>0 && role==="edited") {
      closure.received_amount=data;
      this.Fenceserv.receiveclosure(closure).subscribe({
        next:(res)=>{
          if (res.status===200 && res.message==="success") {
            this.appserv.presentToast("Clôture réceptionnée avec succes","success");
          }else{
            this.appserv.presentToast(res.error,"warning");
          }
          this.loadClosures();
        },
        error:(err)=>{
          console.log("Error on receiving closure",err);
        }
      });
    }
  }

  async reject(closure: any) {
    const pin :any= await this.authserv.callPinModal();
    if (!pin || pin.length<4) {
       this.appserv.presentToast('Aucun ou mauvais Pin fourni svp!', 'warning');
       return;
    }
     const alert = await this.appserv.alertctrl.create({
      header: 'Ajouter un commentaire',
      message: 'PLACEHOLDER',
      mode: 'ios',
      inputs: [
        {
          name: 'note',
          type: 'textarea',
          placeholder: 'Écris ton commentaire ici...',
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Valider',
          handler: (data) => {
            if (!data.note || data.note.trim().length < 3) {
              this.appserv.presentToast('Veuillez écrire au moins 3 caractères.');
              return false;
            }
            closure.receiver_note = data.note;
            closure.loading=true;
            this.Fenceserv.rejectClosure(closure).subscribe({
              next: (res:any) => {
                console.log("reject closure response",res);
                closure.loading=false;
                if (res.status === 200 && res.message === 'success') {  
                  this.appserv.presentToast('Clôture rejetée avec succès', 'success');
                  this.loadClosures();
                }else{
                  this.appserv.presentToast(res.error, 'warning');
                }
              },
              error: (err) => {
                closure.loading=false;
                console.error('Erreur lors du rejet de la clôture', err);
                this.appserv.presentToast('Erreur lors du rejet de la clôture', 'danger');
              }
            });
            return true;
          },
        },
      ],
      backdropDismiss: false,
    });

    await alert.present();
    const msgEl = alert.querySelector('.alert-message');
    if (msgEl) {
      msgEl.innerHTML = `<small>Appuyez sur <b>Entrée</b> pour valider</small>`;
    }

    setTimeout(() => {
      const textarea = document.querySelector('ion-alert textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();

        textarea.addEventListener('keydown', (event: KeyboardEvent) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const texte = textarea.value.trim();

            if (texte.length < 3) {
              this.shakeTextarea();
              return;
            }

            const buttons = document.querySelectorAll('ion-alert button');
            const validateBtn = Array.from(buttons).find((b) =>
              (b as HTMLButtonElement).innerText.toLowerCase().includes('valider')
            );
            (validateBtn as HTMLButtonElement)?.click();
          }
        });
      }
    }, 300);
  }

   getlistTubs(){
    this.appserv.myTubs(this.appserv.actualUser.id).subscribe({
      next:(res)=>{
         this.funds=res;
      },
      error:(err)=>{
        this.appserv.presentToast('Erreur survenue lors de la recupération de la liste des caisses.','danger');
      }
    });
  }   

  private shakeTextarea() {
    console.log('Shake textarea detected');
    const textarea = document.querySelector('ion-alert textarea') as HTMLElement;
    if (!textarea) return;

    textarea.classList.add('shake');
    setTimeout(() => textarea.classList.remove('shake'), 500);
  }

   downloadPDF(closure:any) {
    closure.loading=true;
    const closureId=closure.id;
    this.Fenceserv.printClosure(closureId).subscribe({
      next: (res: Blob) => {
        closure.loading=false;
          const blob = new Blob([res], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download =`cloture_a4_${closureId}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement du PDF', err);
        closure.loading=false;
      }
    });
  }

  downloadTicket(closure:any) {
    closure.loading=true;
    const closureId=closure.id;
    this.Fenceserv.printClosureTicket(closureId).subscribe({
        next: (res: Blob) => {
          closure.loading=false;
           const blob = new Blob([res], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download =`cloture_ticket_${closureId}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Erreur lors du téléchargement du PDF format ticket', err);
          closure.loading=false;
        }
      });
  }
}
