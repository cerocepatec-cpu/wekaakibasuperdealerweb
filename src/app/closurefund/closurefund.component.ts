import { Component, OnInit,Input } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { FundService } from '../services/funds.service';
import { AuthentificationService } from '../services/authentification.service';
import { PrintclosureComponent } from '../printclosure/printclosure.component';

interface Bill {
  nominal: number;
  quantity: number;
}

@Component({
  selector: 'app-closurefund',
  templateUrl: './closurefund.component.html',
  styleUrls: ['./closurefund.component.scss'],
})
export class ClosurefundComponent implements OnInit {
@Input() funds: any[] = []; // Chaque “fund” correspond à une caisse
billsOptions: Record<number, Bill[]> = {}; // key = fund_id
totalCalculated: Record<number, number> = {}; // total par caisse
totalDisplayed: Record<number, number> = {}; // total animé par caisse
load=false;
constructor(public appserv:AppservicesService,private funserv:FundService,private authserv:AuthentificationService) { }

  ngOnInit() {
    // Initialisation des billets par caisse
    
  }

   ngAfterViewInit(){
    setTimeout(() => {
      this.getlistTubs();
    }, 200);
  }

  organizedata() {
    this.funds.forEach(fund => {
      let billages: number[] = [];

      if (Array.isArray(fund.billages) && fund.billages.length > 0) {
        billages = fund.billages;
      } else {
        if (fund.abreviation === 'CDF') {
          billages = [20000, 10000,5000,1000,500,200,100,50];
        } else if (fund.abreviation === 'USD') {
          billages = [100, 50, 20, 10, 5,1];
        } else {
          billages = [];
        }
      }
      this.billsOptions[fund.id] = billages.map(nominal => ({
        nominal,
        quantity: 0
      }));
      this.totalCalculated[fund.id] = 0;
      this.totalDisplayed[fund.id] = 0;
    });
  }

   getlistTubs(){
    this.load=true;
    this.appserv.myTubs(this.appserv.actualUser.id).subscribe({
      next:(data)=>{
        console.log(data);
        this.load=false;
        this.funds=data;
        setTimeout(() => {
          this.organizedata();
        }, 100);
      },
      error:(err)=>{
        this.load=false;
        this.appserv.presentToast('Erreur survenue lors de la recupération de la liste des caisses.','danger');
      }
    });
  }

  onBillChange(fundId: number, index: number) {
    const cardEls = document.querySelectorAll(`.bill-card-${fundId}`);
    const cardEl = cardEls[index] as HTMLElement;
    if (cardEl) {
      cardEl.classList.add('modified');
      setTimeout(() => cardEl.classList.remove('modified'), 400);
    }
    this.calculateTotal(fundId);
  }

  calculateTotal(fundId: number) {
    const bills = this.billsOptions[fundId];
    const newTotal = bills.reduce((sum, b) => sum + b.nominal * b.quantity, 0);
    this.animateTotal(fundId, this.totalDisplayed[fundId], newTotal);
    this.totalCalculated[fundId] = newTotal;
  }

  animateTotal(fundId: number, from: number, to: number) {
    const duration = 500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      this.totalDisplayed[fundId] = from + (to - from) * progress;
      if (progress < 1) requestAnimationFrame(animate);
      else this.totalDisplayed[fundId] = to;
    };
    requestAnimationFrame(animate);
  }

  addBill(fundId: number) {
    this.billsOptions[fundId].push({ nominal: 0, quantity: 0 });
  }

  removeBill(fundId: number, index: number) {
    this.billsOptions[fundId].splice(index, 1);
    this.calculateTotal(fundId);
  }

  async validateClosure() {
    const pin :any= await this.authserv.callPinModal();
    if (!pin || pin.length<4) {
       this.appserv.presentToast('Aucun ou mauvais Pin fourni svp!', 'warning');
       return;
    }
    this.submitClosure();
  }

  async verifyPin(pin: string): Promise<boolean> {
    return pin === '1234'; // À remplacer par ta méthode réelle
  }

 async submitClosure() {
  const payload = {
    closures: this.funds.map(fund => ({
      fund_id: fund.id,
      total_amount: fund.sold,
      billages: this.billsOptions[fund.id],
      currency_id: fund.money_id,
      closure_note: fund.closure_note || null
    }))
  };

  this.funserv.savefundclosures(payload).subscribe({
    next: async (res) => {
      if (res.message==="success" && res.status===200) {
        this.appserv.presentToast("Date clôturée avec succès!","success");
        const alert = await this.appserv.alertctrl.create({
          header:"Impression clôture",
          message:"Voulez-vous imprimer cette clôture?",
          animated:true,
          mode:'ios',
          buttons:[
            {text:"Non",role:"cancel"},
            {text:"Oui",handler:()=> {
                this.printClosure(res.data);
            },}
          ]
        });
        alert.present();
      }else{
        this.appserv.presentToast(res.error,"warning");
      }
    },
    error: (err) => {
      // console.log("save closures error", err);
      this.appserv.presentToast(err.error, "danger");
    }
  });
}

  async printClosure(data:any){
    const modal = await this.appserv.modalCtrl.create({
      component:PrintclosureComponent,
      componentProps:{printData:data},
      mode:'ios',
      cssClass:"modal-border-radius-20"
    });
    modal.present();
  }

  dismiss() {
      this.appserv.modalCtrl.dismiss();
    }
  }
