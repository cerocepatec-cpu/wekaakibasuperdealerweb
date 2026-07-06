import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { AppservicesService } from '../services/appservices.service';
import { NewtransactionComponent } from '../newtransaction/newtransaction.component';
import { Users } from '../interfaces/users';
import { UsersService } from '../services/users.service';
import { NewagentComponent } from '../agents/newagent/newagent.component';
import { NewwekatransfertfoundsComponent } from '../wekatransfertfounds/newwekatransfertfounds/newwekatransfertfounds.component';
import { InvoicePrintComponent } from '../module/uzisha/home/invoice-print/invoice-print.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  @ViewChild('defaultinputsearch') defaultinput!: IonInput;
  listUsers: Users[] = [];
  showprogress = false;
  search: any;
  constructor(
    public appserv: AppservicesService,
    private Userserv: UsersService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.defaultinput.setFocus();
    }, 200);
  }

  @HostListener('window:keydown', ['$event'])
  async handleKeyDown(event: KeyboardEvent) {
    const topModal = await this.appserv.modalCtrl.getTop();

    if (topModal && topModal.component !== this.constructor) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.defaultinput.setFocus();
      this.memberlookup();
    }
  }

  async newtransfert() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewwekatransfertfoundsComponent,
      componentProps: { shouldReturn: true },
      mode: 'ios',
      cssClass: 'modal-border-radius',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'added' && data) {
      const alert = await this.appserv.alertctrl.create({
        header: 'Impression',
        message: 'Voulez-vous imprimer la preuve de transfert?',
        mode: 'ios',
        translucent: true,
        buttons: [
          { text: 'Non', role: 'cancel' },
          {
            text: 'Oui',
            handler: () => {
              this.print(data);
            },
          },
        ],
      });
      alert.present();
    }
  }

  async print(data: any) {
    const modal = await this.appserv.modalCtrl.create({
      component: InvoicePrintComponent,
      componentProps: { datasent: data, duplicata: true },
    });
    modal.present();
  }
  async newmember() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewagentComponent,
      componentProps: { keyword: this.search },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'added') {
      this.listUsers.unshift(data);
    }
  }

  memberlookup() {
    if (this.search.length > 0) {
      this.showprogress = true;
      this.Userserv.memberslookup({
        enterprise_id: this.appserv.actualEse.id,
        keyword: this.search,
      }).subscribe({
        next: (response) => {
          this.showprogress = false;
          if (response.message === 'success' && response.status === 200) {
            
          }
          this.listUsers = response;
          console.log('members lookup', response);
        },
        error: (err) => {
          this.showprogress = false;
          this.appserv.presentToast(
            'Une erreur est survenue. Veuillez réesayer',
            'danger'
          );
          console.log('error members lookup', err);
        },
      });
    } else {
      this.listUsers = [];
    }
  }

  async newtransaction(user: Users) {
    const modal = await this.appserv.modalCtrl.create({
      component: NewtransactionComponent,
      componentProps: { usersent: user },
      cssClass: 'modal-border-radius-20',
    });

    if (
      this.appserv.permissionFilter('transactions', 'deposit') ||
      this.appserv.permissionFilter('transactions', 'withdraw')
    ) {
      modal.present();
    } else {
      this.appserv.presentToast(
        "Vous n'êtes pas autorisé à faire les transactions!Veuillez contacter votre administrateur.",
        'warning'
      );
    }
  }
}
