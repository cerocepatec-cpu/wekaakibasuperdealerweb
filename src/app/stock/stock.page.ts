import { Component, OnInit, ViewChild } from '@angular/core';
import { AppservicesService } from '../services/appservices.service';
import { StockHistory } from 'src/app/interfaces/stockhistory';
import { Users } from '../interfaces/users';
import { StockService } from '../services/stock.service';
import { Articles } from '../interfaces/articles';
import { Deposits } from '../interfaces/deposit';
import { Providers } from '../interfaces/providers';
import { PickservicesComponent } from '../articles/pickservices/pickservices.component';
import { DepositsService } from '../services/deposits.service';
import { ProvidersService } from '../services/providers.service';
import { IonInput } from '@ionic/angular';
import { NewtransfertComponent } from './transfert/newtransfert/newtransfert.component';
import { TransfertService } from '../services/transfert.service';
import { DetailtransfertComponent } from './transfert/detailtransfert/detailtransfert.component';
import { TransfertvalidationComponent } from '../transfertvalidation/transfertvalidation.component';
import { TipquantityComponent } from '../tab2/tipquantity/tipquantity.component';
import { NewproviderComponent } from '../providers/newprovider/newprovider.component';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
})
export class StockPage implements OnInit {
  @ViewChild('mobileinputSearch') mobileinput!: IonInput;
  actualuser: Users = {};
  showprogress = false;
  articlesfromapi: Articles[] = [];
  labelprice = 'Prix';
  showcheckbox = false;
  listdeposits: Deposits[] = [];
  providers: Providers[] = [];
  entriesliststockstories: StockHistory[] = [];

  //Withdraw variables
  withdrawarticles: Articles[] = [];
  isModalOpen = false;
  depositarticles: Articles[] = [];
  actualdeposit: Deposits = {};
  withdrawlistarticles: Articles[] = [];
  defaultmoney = this.appserv.getDefaultmoney();
  canPrintProforma = false;
  withdrawliststockstories: StockHistory[] = [];

  //Transferts
  listransferts: any;
  constructor(
    private authserv: AuthentificationService,
    private transfertserv: TransfertService,
    private depositserv: DepositsService,
    public providerserv: ProvidersService,
    public depositServ: DepositsService,
    public appserv: AppservicesService,
    private stockserv: StockService
  ) {}

  ngOnInit() {
    this.actualuser = this.appserv.getactualuser();
    this.getaDeposit();
    this.getallproviders();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  }

  /**
   * Transferts methods
   */
  async newtransfert() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewtransfertComponent,
      mode: 'ios',
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
  }

  async validatetransfert(transfert) {
    const modal = await this.appserv.modalCtrl.create({
      component: TipquantityComponent,
      initialBreakpoint: 0.25,
      breakpoints: [0, 0.25, 0.5, 0.75, 1],
      cssClass: 'modal-border-radius-20',
      componentProps: {
        title: `Confirmer la quantité réçue`,
        numbersent: transfert.quantity_sent,
        zero_accepted: true,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'edited') {
      if (data >= 0) {
        const alert = this.appserv.alertctrl.create({
          header: 'Validation transfert',
          message: `Validez-vous vraiment ce transfert de ${data} ${transfert.uom_symbol}?`,
          mode: 'ios',
          translucent: true,
          buttons: [
            { text: 'Non', role: 'cancel' },
            {
              text: 'Oui',
              handler: () => {
                this.showprogress = true;
                transfert.quantity_received = data;
                transfert.comment = '';
                transfert.receiver_id = this.appserv.getactualuser().id;
                transfert.user_id = this.appserv.getactualuser().id;
                this.transfertserv.validatetransfert(transfert).subscribe(
                  (response) => {
                    this.showprogress = false;
                    transfert = response;
                    this.appserv.presentToast(
                      `Transfert validé avec succès`,
                      'success'
                    );
                    console.log('transfert validated', response);
                    // this.appserv.modalCtrl.dismiss(data,'edited');
                  },
                  (error) => {
                    console.log('error transfert validated', error);
                    this.showprogress = false;
                    this.appserv.presentToast(
                      `Une erreur est survenue lors de la validation du transfert`,
                      'danger'
                    );
                  }
                );
              },
            },
          ],
        });
        (await alert).present();
      }
    }
  }

  async detailtransfert(transfert) {
    const modal = await this.appserv.modalCtrl.create({
      component: DetailtransfertComponent,
      componentProps: { transfertsent: transfert },
      cssClass: 'modal-border-radius-20',
    });

    modal.present();
  }

  /**
   *End transferts methods
   */

  /**
   * WITHDRAW METHODS
   */

  async withdrawpushinlistosend() {
    this.withdrawliststockstories = [];
    this.depositarticles.forEach((article) => {
      const newline = {
        service_name: article.service.name,
        description: article.service.description,
        uom_name: article.service.uom_name,
        uom_symbol: article.service.uom_symbol,
        depot_id: this.actualdeposit.id,
        deposit_name: this.actualdeposit.name,
        service_id: article.service.id,
        user_id: this.appserv.actualUser.id,
        done_by_name: this.appserv.actualUser.user_name,
        quantity: article.quantity,
        quantity_before: 0,
        price: article.service.price,
        expiration_date: article.expiration_date,
        bon_livraison: '',
        motif: article.motif,
        invoice_id: 0,
        code_bar: '',
        note: article.note,
        type: 'withdraw',
        total: article.service.price * article.quantity,
        customer_id: 0,
        provider_id: 0,
        providerName: '',
        document_type: 0,
        document_name: '',
        document_number: '',
        type_approvement: 'cash',
        attachment: '',
        status: '',
        uuid: '',
        showWithdraw: false,
        showbarcode: false,
        showpu: true,
        showtotal: true,
        showcalendar: true,
        created_at: '',
        selected: false,
        read: false,
        enterprise_id: this.appserv.actualEse.id,
        sync_status: '',
        done_at: article.done_at,
        original: article,
      };
      this.withdrawliststockstories.push(newline);
    });
  }

  async entriespushinlistosend() {
    this.entriesliststockstories = [];
    this.articlesfromapi.forEach((article) => {
      if (article.deposit_id && article.quantity > 0 && article.price > 0) {
        const newline = {
          service_name: article.service.name,
          description: article.service.description,
          uom_name: article.service.uom_name,
          uom_symbol: article.service.uom_symbol,
          depot_id: article.deposit_id,
          deposit_name: this.getdepositbyId(article.deposit_id).name,
          service_id: article.service.id,
          user_id: this.appserv.actualUser.id,
          done_by_name: this.appserv.actualUser.user_name,
          quantity: article.quantity,
          quantity_before: 0,
          price: article.price,
          expiration_date: article.expiration_date,
          bon_livraison: '',
          motif: article.motif,
          invoice_id: 0,
          code_bar: '',
          note: article.note,
          type: 'entry',
          total: article.service.price * article.quantity,
          customer_id: 0,
          provider_id: article.provider_id,
          providerName: article.provider_id
            ? this.getproviderbyId(article.provider_id).providerName
            : '',
          document_type: 0,
          document_name: '',
          document_number: '',
          type_approvement: 'cash',
          attachment: '',
          status: '',
          uuid: '',
          showWithdraw: false,
          showbarcode: false,
          showpu: true,
          showtotal: true,
          showcalendar: true,
          created_at: this.appserv.getDateTime(),
          selected: false,
          read: false,
          enterprise_id: this.appserv.actualEse.id,
          sync_status: '',
          done_at: article.done_at,
          index: article.index,
          original: article,
        };
        this.entriesliststockstories.push(newline);
      } else {
        if (!article.quantity) {
          article.quantity_mistaken = true;
        }

        if (!article.deposit_id) {
          article.deposit_mistaken = true;
        }

        if (!article.price || article.price <= 0) {
          article.price_mistaken = true;
        }
      }
    });
  }

  getdepositbyId(deposit_id: number) {
    return this.listdeposits.find((d) => d.id === deposit_id);
  }

  getproviderbyId(providerId: number) {
    return this.providers.find((p) => p.id === providerId);
  }

  async changedefaultdeposit($event) {
    if (this.depositarticles.length > 0) {
      const alert = await this.appserv.alertctrl.create({
        header: `Changement dépôt`,
        message:
          'Vous avez un travail en cours. Le changement du dépôt entrainera la perte de votre travail. Continuer malgré tout?',
        mode: 'ios',
        translucent: true,
        buttons: [
          { text: 'Non', role: 'cancel' },
          {
            text: 'Oui',
            handler: () => {
              this.actualdeposit = this.listdeposits.find(
                (d) => d.id === $event.detail.value
              );
              this.depositarticles = [];
              this.appserv.presentToast('Dépôt modifier', 'primary');
            },
          },
        ],
      });
      alert.present();
    } else {
      this.actualdeposit = this.listdeposits.find(
        (d) => d.id === $event.detail.value
      );
      this.depositarticles = [];
      this.appserv.presentToast('Dépôt modifier', 'primary');
    }
  }

  async removewithdrawarticle(article: Articles) {
    const alert = await this.appserv.alertctrl.create({
      header: `Suppression ${article.service.name}`,
      message: 'Voulez-vous annuler cette sortie?',
      mode: 'ios',
      translucent: true,
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui',
          handler: () => {
            this.depositarticles = this.depositarticles.filter(
              (p) => p !== article
            );
          },
        },
      ],
    });
    alert.present();
  }

  setModalarticlesOpened(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async saveWithdraw() {
    if (this.actualdeposit) {
      if (this.depositarticles.length > 0) {
        //transforming data to send
        this.withdrawpushinlistosend();
        const alert = await this.appserv.alertctrl.create({
          header: 'Validation déstockage',
          message:
            'Confirmez-vous le déstockage de ' +
            ' ' +
            this.depositarticles.length +
            (this.depositarticles.length > 1 ? ' articles' : ' article'),
          mode: 'ios',
          translucent: true,
          buttons: [
            { text: 'Non', role: 'cancel' },
            {
              text: 'Oui',
              handler: async () => {
                if (this.appserv.isMyDeviceConnected()) {
                  this.saveonlinewithdraw();
                } else {
                  //save offline withdraw
                  this.withdrawliststockstories.map((a) => {
                    this.stockserv.newsaveoffline(a);
                  });
                  this.depositarticles = [];
                  this.withdrawliststockstories = [];
                }
              },
            },
          ],
        });
        alert.present();
      } else {
        this.appserv.presentToast(
          `Vous devez sélectionner au moins un article à approvisionner`,
          'warning'
        );
      }
    } else {
      this.appserv.presentToast(`Vous devez sélectionner un dépôt`, 'warning');
    }
  }

  async newprovider() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewproviderComponent,
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'added') {
      this.providers.unshift(data);
    }
  }

  async saveonlinewithdraw() {
    const load = await this.appserv.loadctrl.create({
      message: 'Destockage en cours...',
      mode: 'ios',
      spinner: 'circles',
    });
    load.present();
    //send data the the server
    this.stockserv
      .multiplestores({ data: this.withdrawliststockstories })
      .subscribe(
        (data) => {
          load.dismiss();
          this.depositarticles = [];
          this.withdrawliststockstories = [];
          this.appserv.presentToast('Destockage fait avec succès.', 'success');
        },
        (error) => {
          load.dismiss();
          this.appserv.presentToast(
            'Erreur survenue lors du déstockage des produits.',
            'warning'
          );
        }
      );
  }

  BeforeClosingSearchModal($event) {
    this.isModalOpen = false;
  }

  aftermodalpresented($event) {
    this.mobileinput.setFocus();
  }

  async addtocart(article: Articles, index: number = 0) {
    const ifexists = this.depositarticles.indexOf(article);

    if (
      ifexists === -1 &&
      this.depositarticles.filter((a) => a.service.id == article.service.id)
        .length == 0
    ) {
      article.service.selling_qte = 1;
      article.service.price = article.prices.filter(
        (p) => p.money_id === this.defaultmoney.id
      )[0].price;
      article.service.abreviation = article.prices.filter(
        (p) => p.money_id === this.defaultmoney.id
      )[0].abreviation;
      article.service.money_id = article.prices.filter(
        (p) => p.money_id === this.defaultmoney.id
      )[0].money_id;
      if (article.service.type == '1') {
        if (article.service.available_qte > 0) {
          article.selected = true;
          article.service.total = article.price * article.service.selling_qte;
          article.index = index;
          article.done_at = this.appserv.defaultdate();
          this.depositarticles.push(article);
        } else {
          if (this.canPrintProforma) {
            article.selected = true;
            article.service.total = article.price * article.service.selling_qte;
            article.index = index;
            this.appserv.defaultdate();
            this.depositarticles.push(article);
          } else {
            this.appserv.presentToast(
              'Quantité insuffisante. Veuillez approvisionner le produit',
              'warning'
            );
          }
        }
      } else {
        article.selected = true;
        article.service.total = article.price * article.service.selling_qte;
        article.index = index;
        this.appserv.defaultdate();
        this.depositarticles.push(article);
      }
    } else {
      this.depositarticles = this.depositarticles.filter((s) => s != article);
      article.selected = false;
      // // this.depositarticles=this.depositarticles.filter(a=>a!=article);
    }
    this.setfocustosearch();
  }

  setfocustosearch() {
    // this.input.setFocus();
  }

  async mobilelookupmethod($event) {
    if (this.mobileinput.value) {
      if ($event.keyCode === 13) {
        //looking for codebar
        //if isset deposit
        if (this.actualdeposit) {
          if (!this.appserv.isMyDeviceConnected()) {
            //offline lookup with codebar
            const response = this.depositserv.getoffarticlesbydepositcodebar(
              this.actualdeposit.id,
              String(this.mobileinput.value)
            );
            if (
              typeof response !== 'undefined' &&
              response !== null &&
              !this.canPrintProforma
            ) {
              if (
                response.service.type === '1' &&
                response.service.available_qte > 0
              ) {
                this.addtocart(response);
                this.appserv.presentToast(
                  'Résultat trouvé et ajouté au panier ',
                  'primary'
                );
              }

              if (response.service.type === '2' || this.canPrintProforma) {
                this.addtocart(response);
                this.appserv.presentToast(
                  'Résultat trouvé et ajouté au panier ',
                  'primary'
                );
              }
            } else {
              this.appserv.presentToast('Aucun résultat trouvé', 'warning');
            }

            //suite here
          } else {
            //online
            this.showprogress = true;
            this.depositserv
              .searchbybarcode({
                deposit_id: this.actualdeposit.id,
                word: String(this.mobileinput.value),
              })
              .subscribe(
                (data) => {
                  this.showprogress = false;
                  if (typeof data !== 'undefined' && data !== null) {
                    if (
                      data.service.type === '1' &&
                      data.service.available_qte > 0 &&
                      !this.canPrintProforma
                    ) {
                      this.addtocart(data);
                      this.appserv.presentToast(
                        'Résultat trouvé et ajouté au panier ',
                        'primary'
                      );
                    }

                    if (data.service.type === '2' || this.canPrintProforma) {
                      this.addtocart(data);
                      this.appserv.presentToast(
                        'Résultat trouvé et ajouté au panier ',
                        'primary'
                      );
                    }
                  } else {
                    this.appserv.presentToast(
                      'Aucun résultat trouvé',
                      'warning'
                    );
                  }
                },
                (error) => {
                  this.showprogress = false;
                  this.appserv.presentToast(
                    "Une erreur est survenue lors de la recheche d'articles. Veuillez vérifier votre connexion",
                    'warning'
                  );
                }
              );
          }
        } else {
          this.appserv.presentToast(
            "Vous n'êtes affecté à aucun dépôt. Contactez votre administrateur pour plus de détails.",
            'warning'
          );
        }
      } else {
        //if isset deposit
        if (this.actualdeposit) {
          //offline
          if (!this.appserv.isMyDeviceConnected()) {
            this.withdrawlistarticles =
              this.depositserv.getoffarticlesbydepositkeywords(
                this.actualdeposit.id,
                String(this.mobileinput.value)
              );
          } else {
            //online
            this.showprogress = true;
            this.depositserv
              .searchingservicesfordeposit({
                deposit_id: this.actualdeposit.id,
                word: String(this.mobileinput.value),
              })
              .subscribe(
                (data) => {
                  this.showprogress = false;
                  this.withdrawlistarticles = data;
                },
                (error) => {
                  this.showprogress = false;
                  this.appserv.presentToast(
                    "Une erreur est survenue lors de la recheche d'articles. Veuillez vérifier votre connexion",
                    'warning'
                  );
                }
              );
          }
        } else {
          this.appserv.presentToast(
            "Vous n'êtes affecté à aucun dépôt. Contactez votre administrateur pour plus de détails.",
            'warning'
          );
        }
      }
    }
  }
  /**
   * END WITHDRAW METHODS
   */

  async getTransfertslist() {
    this.showprogress = true;
    this.transfertserv
      .forauser({ user_id: this.appserv.actualUser.id })
      .subscribe(
        (response) => {
          this.showprogress = false;
          console.log(response);
          this.listransferts = response;
          this.appserv.presentToast('Transferts recus', 'success');
        },
        (error) => {
          this.showprogress = false;
          console.log(error);
          this.appserv.presentToast(
            'Erreur lors de la recuperation des transferts',
            'danger'
          );
        }
      );
  }
  /**
   * Entries methods
   */
  async totalcalculate2(article: Articles) {
    article.total = article.price * article.quantity;
    if (article.quantity && article.quantity > 0) {
      article.quantity_mistaken = false;
    } else {
      article.quantity_mistaken = true;
    }
  }

  ifexistsdeposit(article: Articles) {
    if (article.deposit_id) {
      article.deposit_mistaken = false;
    } else {
      article.deposit_mistaken = true;
    }
  }

  async gotostockarticlepicker() {
    const modal = await this.appserv.modalCtrl.create({
      component: PickservicesComponent,
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'added') {
      if (data.length > 0) {
        this.articlesfromapi = this.articlesfromapi.concat(data);
        data.forEach((element) => {
          element.deposit_id =
            this.listdeposits.length > 0 ? this.listdeposits[0].id : 0;
        });
      }
    }
  }

  async replacearticle(article: Articles, index: number) {
    const modal = await this.appserv.modalCtrl.create({
      component: PickservicesComponent,
      componentProps: { single: true },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'selected') {
      this.articlesfromapi[index] = data;
    }
  }

  async removearticle(article: Articles) {
    const alert = await this.appserv.alertctrl.create({
      header: 'Suppression',
      message: 'Voulez-vous supprimer cette ligne?',
      mode: 'ios',
      translucent: true,
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui',
          handler: () => {
            this.articlesfromapi = this.articlesfromapi.filter(
              (p) => p !== article
            );
          },
        },
      ],
    });
    alert.present();
  }

  showstocksyncing() {}
  showhistory() {}

  async saveEntries() {
    //transforming data to send
    this.entriespushinlistosend();

    const pin = await this.authserv.callPinModal();
    if (!pin) {
      this.appserv.presentToast(
        'Pin incorrect ou fenêtre fermée brusquement',
        'warning'
      );
      return;
    }
    if (this.entriesliststockstories.length > 0) {
      const alert = await this.appserv.alertctrl.create({
        header: 'Approvisionnement',
        message:
          "Confirmez-vous l'approvisionnement de " +
          ' ' +
          this.articlesfromapi.length +
          (this.articlesfromapi.length > 1 ? ' articles' : ' article'),
        mode: 'ios',
        translucent: true,
        buttons: [
          { text: 'Non', role: 'cancel' },
          {
            text: 'Oui',
            handler: async () => {
              this.saveonlineEntries();
            },
          },
        ],
      });
      alert.present();
    } else {
      this.appserv.presentToast(
        `Vous devez sélectionner au moins un article à approvisionner ou compléter les informations necessaires.`,
        'warning'
      );
    }
  }

  async saveonlineEntries() {
    const loading = await this.appserv.loadctrl.create({
      message: 'Approvisionnement en cours...',
      mode: 'ios',
      spinner: 'circles',
    });
    loading.present();
    console.log('before sending', this.entriesliststockstories);
    //send data the the server
    this.stockserv
      .multiplestores({ data: this.entriesliststockstories })
      .subscribe(
        async (data: any) => {
          console.log(data);
          loading.dismiss();
          this.articlesfromapi = [];
          this.entriesliststockstories = [];
          this.appserv.presentToast(
            'Approvisionnement fait avec succès.',
            'success'
          );
        },
        (error) => {
          console.log(error);
          loading.dismiss();
          this.appserv.presentToast(
            "Erreur survenue lors de l'approvisionnement des produits.",
            'warning'
          );
        }
      );
  }
  /**
   * END OF ENTRIES METHODS
   */

  /**
   * GENERAL METHODS
   */
  getaDeposit() {
    if (this.appserv.isMyDeviceConnected()) {
      //searching online
      const object = { user_id: this.appserv.getactualuser().id };
      this.depositServ.forASpecifUser(object).subscribe(
        (data) => {
          this.listdeposits = data;
          if (this.listdeposits.length > 0) {
            this.actualdeposit = this.listdeposits[0];
          }
        },
        (error) => {
          this.appserv.presentToast(
            'Impossible de charger la liste des dépôts',
            'warnging'
          );
        }
      );
    } else {
      //if offline
      this.listdeposits = this.depositServ.getOfflineData();
      if (this.listdeposits.length > 0) {
        this.actualdeposit = this.listdeposits[0];
      }
    }
  }

  getallproviders() {
    if (this.appserv.isMyDeviceConnected()) {
      //searching online
      this.providerserv
        .getallproviders(this.appserv.getactualuser().enterprise_id)
        .subscribe(
          (data) => {
            this.providers = data;
          },
          (error) => {
            this.appserv.presentToast(
              'une erreur est survenue lors du chargement des fournisseurs',
              'warning'
            );
          }
        );
    } else {
      //searching offline
      this.providers = this.providerserv.getofflinelist();
    }
  }
}
