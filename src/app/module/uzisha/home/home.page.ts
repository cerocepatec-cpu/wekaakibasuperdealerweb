import { TipquantityComponent } from '../../../tab2/tipquantity/tipquantity.component';
import { CartpreviewComponent } from '../../../tab2/cartpreview/cartpreview.component';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { AppservicesService } from '../../../services/appservices.service';
import { Users } from '../../../interfaces/users';
import { Articles } from '../../../interfaces/articles';
import { CategoriesArticle } from '../../../interfaces/cagoriesarticles';
import { ArticlesService } from '../../../services/articles.service';
import { Invoice } from '../../../interfaces/invoices';
import { StockHistory } from '../../../interfaces/stockhistory';
import { NewserviceComponent } from '../../../articles/newservice/newservice.component';
import { UnitofMeasure } from '../../../interfaces/unitofmeasure';
import { CategoryserviceService } from '../../../services/categoryservice.service';
import { UnitofmeasureService } from '../../../services/unitofmeasure.service';
import { StockService } from '../../../services/stock.service';
import { DetailsInvoice } from '../../../interfaces/detailsinvoice';
import { Customers } from '../../../interfaces/customers';
import { Servant } from '../../../interfaces/servants';
import { Tables } from '../../../interfaces/tables';
import { ServicepricespickerComponent } from '../../../tab2/servicepricespicker/servicepricespicker.component';
import { VatenterComponent } from '../../../tab2/vatenter/vatenter.component';
import { ReductionenterComponent } from '../../../tab2/reductionenter/reductionenter.component';
import { CustomerpickersComponent } from '../../../articles/customerpickers/customerpickers.component';
import { ServantpickerComponent } from '../../../servants/servantpicker/servantpicker.component';
import { TablepickerComponent } from '../../../tables/tablepicker/tablepicker.component';
import { InvoiceService } from '../../../services/invoice.service';
import { SavedinvoicesComponent } from '../../../finances/invoices/savedinvoices/savedinvoices.component';
import { DepositpickerComponent } from '../../../articles/depositpicker/depositpicker.component';
import { PosSettingsComponent } from '../../../pos-settings/pos-settings.component';
import { PosPrintingOptions } from '../../../interfaces/posprintingoptions';
import { Money } from '../../../interfaces/money';
import { Enterprise } from '../../../interfaces/enterprise';
import { NewexpenditureComponent } from '../../../finances/expenditures/newexpenditure/newexpenditure.component';
import { DebtsPage } from '../../../debts/debts.page';
import { InvoicesComponent } from '../../../finances/invoices/invoices.component';
import { DebtsService } from '../../../services/debts.service';
import { ConversionMoney } from '../../../interfaces/conversionmoneys';
import { ConversionMoneysService } from '../../../services/conversion-moneys.service';
import { InvoicePrintComponent } from './invoice-print/invoice-print.component';
import { InfoscustomerComponent } from 'src/app/customers/infoscustomer/infoscustomer.component';
import { PrintproformaComponent } from './printproforma/printproforma.component';
import { IonInput } from '@ionic/angular';
import { DepositsService } from 'src/app/services/deposits.service';
import { Deposits } from 'src/app/interfaces/deposit';
import { PrintexpenditureandentryComponent } from 'src/app/finances/printexpenditureandentry/printexpenditureandentry.component';
import { MenuMobileInvoiceComponent } from './menu-mobile-invoice/menu-mobile-invoice.component';
import { NewfenceComponent } from 'src/app/finances/fences/newfence/newfence.component';
import { SelectsubservicesComponent } from 'src/app/selectsubservices/selectsubservices.component';
import { DynamicviewerComponent } from 'src/app/reports/dynamicviewer/dynamicviewer.component';
import { UserpickerComponent } from 'src/app/agents/userpicker/userpicker.component';
import { FundService } from 'src/app/services/funds.service';
import { MembersaccountsService } from 'src/app/services/membersaccounts.service';
import { UserpickerforsaleComponent } from 'src/app/agents/userpickerforsale/userpickerforsale.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('inputSearch') inputSearch!: ElementRef;
  @ViewChild('inputSearch') input!: IonInput;
  @ViewChild('mobileinputSearch') mobileinput!: IonInput;
  printedUuid: any;
  oldmoneyId = 0;
  showprintingtype = false;
  invoiceUuid: any = null;
  printingtype = '';
  search: string;
  actualuser: Users = {};
  listarticles: any[] = [];
  keptlistarticles: any[] = [];
  listselectedarticles: Articles[] = [];
  command: Invoice[] = [];
  listcategories: CategoriesArticle[] = [];
  listunitofmeasure: UnitofMeasure[] = [];
  showdefaultprogress = false;
  showsearch = false;
  actualEse: Enterprise = {};
  savedInvoices: Invoice[] = [];
  numberarticle = 1;
  actualarticle: any;
  actualdeposit: Deposits = {};
  actualcollector: any = {};

  tva_rate = 0;
  listdeposits: Deposits[] = [];
  total_discount = 0;
  total_return = 0;
  totalespeces = 0;
  totalcreditcard = 0;
  totalmobilemoney = 0;
  cardshown = true;
  net_to_paye = 0;
  total_received = 0;
  canPrintProforma = false;
  posprintoptions: PosPrintingOptions = this.appserv.getDefaultPrinterConfig();
  posprinterformat: any = this.appserv.getDefaultFormatPrinter();
  invoicefooter = this.appserv.getactualEse().invoicefooter;
  showpaymentmode = false;
  listconversions: ConversionMoney[] = [];
  //cart preview data
  details: DetailsInvoice[] = [];
  invoice: any = {};
  totalgeneral = 0;
  netToPay = 0;
  vat_amount = 0;
  reduction = 0;
  isModalOpen = false;
  isActionsModalOpen = false;
  isOthersPaymentsModalOpen = false;
  actualcustomer: Users = {};
  actualservant: Servant = {};
  actualtable: Tables = {};
  customerclass = '';
  focusedon = null;
  searchingmode = true;
  today = this.appserv.today;
  defaultmoney: Money = {};
  memberAccounts: any[] = [];
  userFunds: any[] = [];
  selectedAccount: any = null;

  constructor(
    private accountserv: MembersaccountsService,
    private fundserv: FundService,
    private conversionserv: ConversionMoneysService,
    private invoiceserv: InvoiceService,
    private stockserv: StockService,
    private uomserv: UnitofmeasureService,
    public appserv: AppservicesService,
    private articleserv: ArticlesService,
    private cateserv: CategoryserviceService,
    private debtserv: DebtsService,
    private depositserv: DepositsService
  ) {}

  ngOnInit() {
    this.actualuser = this.appserv.getactualuser();
    this.getlistdeposits();
    this.getsavedinvoices();
    this.invoice.totalespeces = 0;
    this.invoice.totalcreditcard = 0;
    this.invoice.totalmobilemoney = 0;
    this.invoice.back = 0;
    this.tva_rate = this.appserv.getactualEse().vat_rate
      ? this.appserv.getactualEse().vat_rate
      : 0;
  }

  ionViewDidEnter() {
    this.input.setFocus();
    this.invoice.date_operation = this.appserv.defaultdate();
    this.tva_rate = this.appserv.getactualEse().vat_rate
      ? this.appserv.getactualEse().vat_rate
      : 0;
  }

  async selectsubservices(article: Articles) {
    const modal = await this.appserv.modalCtrl.create({
      component: SelectsubservicesComponent,
      componentProps: { isModal: true, service: article },
      cssClass: 'modal-border-radius-20',
      initialBreakpoint: 1,
      breakpoints: [0.5, 0.75, 0.8, 1],
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'selected') {
      article.subservices = data;
    }
  }

  async presenteFencePage() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewfenceComponent,
      componentProps: { isModal: true },
      cssClass: 'modal-border-radius-20',
      initialBreakpoint: 1,
      breakpoints: [0.5, 0.75, 0.8, 1],
    });
    modal.present();
  }

  aftermodalActionspresented($event) {}

  BeforeClosingActionsModal($event) {
    this.isActionsModalOpen = false;
  }

  BeforeClosingSearchModal($event) {
    this.isModalOpen = false;
  }

  setModalarticlesOpened(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  aftermodalpresented($event) {
    this.mobileinput.setFocus();
  }
  afterOthersPaymentspresented($event) {}

  selectotherpayment(criteria: string) {
    switch (criteria) {
      case 'point':
        break;
      case 'bonus':
        break;
      case 'caution':
        break;
      default:
        break;
    }
    this.isOthersPaymentsModalOpen = false;
  }

  BeforeClosingOthersPaymentsModal($event) {
    this.isOthersPaymentsModalOpen = false;
  }
  setModalOthersPaymentsOpened(isOpen: boolean) {
    this.isOthersPaymentsModalOpen = isOpen;
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
            this.showdefaultprogress = true;
            this.depositserv
              .searchbybarcode({
                deposit_id: this.actualdeposit.id,
                word: String(this.mobileinput.value),
              })
              .subscribe(
                (data) => {
                  this.showdefaultprogress = false;
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
                  this.showdefaultprogress = false;
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
            this.listarticles =
              this.depositserv.getoffarticlesbydepositkeywords(
                this.actualdeposit.id,
                String(this.mobileinput.value)
              );
          } else {
            //online
            this.showdefaultprogress = true;
            this.depositserv
              .searchingservicesfordeposit({
                deposit_id: this.actualdeposit.id,
                word: String(this.mobileinput.value),
              })
              .subscribe(
                (data) => {
                  this.showdefaultprogress = false;
                  this.listarticles = data;
                },
                (error) => {
                  this.showdefaultprogress = false;
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

  async largedevicelookupmethod($event) {
    if (this.input.value) {
      if ($event.keyCode === 13) {
        if (this.actualdeposit) {
          if (!this.appserv.isMyDeviceConnected()) {
            //offline lookup with codebar

            const response = this.depositserv.getoffarticlesbydepositcodebar(
              this.actualdeposit.id,
              String(this.input.value)
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
            this.showdefaultprogress = true;
            this.depositserv
              .searchbybarcode({
                deposit_id: this.actualdeposit.id,
                word: String(this.input.value),
              })
              .subscribe(
                (data) => {
                  this.showdefaultprogress = false;
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
                  this.showdefaultprogress = false;
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
            this.listarticles =
              this.depositserv.getoffarticlesbydepositkeywords(
                this.actualdeposit.id,
                String(this.input.value)
              );
          } else {
            //online
            this.showdefaultprogress = true;
            this.depositserv
              .searchingservicesfordeposit({
                deposit_id: this.actualdeposit.id,
                word: String(this.input.value),
              })
              .subscribe(
                (data) => {
                  this.showdefaultprogress = false;
                  this.listarticles = data;
                },
                (error) => {
                  this.showdefaultprogress = false;
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

  async openactionsheet() {
    const modal = await this.appserv.modalCtrl.create({
      component: MenuMobileInvoiceComponent,
      breakpoints: [0.5, 0.7, 1],
      initialBreakpoint: 0.5,
      handle: false,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'selected') {
      switch (data.value) {
        case 'deposit':
          this.filterbydeposit();
          break;
        case 'product':
          this.newproduct();
          break;
        case 'entry':
          this.newmoneyentry();
          break;
        case 'expenditure':
          this.newexpenditure();
          break;
        case 'debt':
          this.debtsviewer();
          break;
        case 'sells':
          this.gotoinvoicesviewer();
          break;
        case 'fence':
          this.presenteFencePage();
          break;
        default:
          break;
      }
    }
  }

  mode(criteria: string) {}
  setfocustosearch() {
    this.input.setFocus();
  }

  ngAfterViewInit() {
    // this.setfocus(this.searchinput);
    this.loadDefaultSettings();
  }

  lookuparticles() {
    if (this.actualdeposit) {
      if (this.search.length > 0) {
        this.showdefaultprogress = true;
        this.depositserv
          .searchingservicesfordeposit({
            deposit_id: this.actualdeposit.id,
            word: this.search,
          })
          .subscribe(
            (data) => {
              this.showdefaultprogress = false;
              this.listarticles = data;
            },
            (error) => {
              this.showdefaultprogress = false;
            }
          );
      }
    } else {
      this.appserv.presentToast(
        `Il semble que vous n'avez aucun dépôt. Veuillez contacter votre administrateur.`,
        'warning'
      );
    }
  }

  lookuparticlebybarcode() {
    if (this.actualdeposit) {
      if (this.search.length > 0) {
        this.showdefaultprogress = true;
        this.depositserv
          .searchbybarcode({
            deposit_id: this.actualdeposit.id,
            word: this.search,
          })
          .subscribe(
            (data) => {
              this.showdefaultprogress = false;
              if (data) {
                if (
                  data.service.type === '1' &&
                  data.service.available_qte > 0
                ) {
                  this.addtocart(data);
                }

                if (data.service.type === '2') {
                  this.addtocart(data);
                }
              }
            },
            (error) => {
              this.showdefaultprogress = false;
            }
          );
      }
    } else {
      this.appserv.presentToast(
        `Il semble que vous n'avez aucun dépôt. Veuillez contacter votre administrateur.`,
        'warning'
      );
    }
  }

  getlistconversion() {
    this.conversionserv
      .getListConversionsApi(this.appserv.getactualEse().id)
      .subscribe(
        (data) => {
          this.listconversions = data;
          this.conversionserv.setOfflineData(data);
        },
        (error) => {
          this.listconversions = this.conversionserv.getOfflineData();
        }
      );
  }

  ConvertingPricesInDefaultMoney() {
    this.updateselectedarticles();
  }

  updateselectedarticles() {
    //updating selected list

    if (this.listselectedarticles.length > 0) {
      this.listselectedarticles.forEach((item) => {
        if (item.service.money_id != this.defaultmoney.id) {
          let rate = this.listconversions.filter(
            (c) =>
              c.money_id2 == this.defaultmoney.id &&
              c.money_id1 == item.service.money_id
          )[0].rate;
          item.service.price = item.service.price * rate;
          item.service.abreviation = this.defaultmoney.abreviation;
          item.service.money_id = this.defaultmoney.id;
        }

        item.prices.forEach((price) => {
          if (price.money_id != this.defaultmoney.id) {
            let rate = this.listconversions.filter(
              (c) =>
                c.money_id2 == this.defaultmoney.id &&
                c.money_id1 == price.money_id
            )[0].rate;
            price.price = price.price * rate;
            price.abreviation = this.defaultmoney.abreviation;
            price.money_id = this.defaultmoney.id;
          }
        });
      });
      //update reduction
      if (this.reduction > 0) {
        if (this.oldmoneyId != this.defaultmoney.id) {
          let rate = this.listconversions.filter(
            (c) =>
              c.money_id2 == this.defaultmoney.id &&
              c.money_id1 == this.oldmoneyId
          )[0].rate;
          this.reduction = this.reduction * rate;
        }
      }
      this.totalcalculate();
    }
  }

  async gotoinvoicesviewer() {
    const modal = await this.appserv.modalCtrl.create({
      component: InvoicesComponent,
      componentProps: { ismodal: true },
      cssClass: 'modal-border-radius-20',
    });

    modal.present();
  }

  async debtsviewer() {
    const modal = await this.appserv.modalCtrl.create({
      component: DebtsPage,
      componentProps: { ismodal: true },
      cssClass: 'modal-border-radius-20',
    });

    modal.present();
  }

  async printexpenditure(operation: any, criteria: string) {
    const modal = await this.appserv.modalCtrl.create({
      component: PrintexpenditureandentryComponent,
      componentProps: { typesent: criteria, expendituresent: operation },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
  }

  async newexpenditure() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewexpenditureComponent,
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'added') {
      const alert = await this.appserv.alertctrl.create({
        header: 'Impréssion',
        message: 'Voulez-vous imprimer un bon de sortie?',
        mode: 'ios',
        translucent: true,
        buttons: [
          { text: 'Non', role: 'cancel' },
          {
            text: 'Oui',
            handler: () => {
              this.printexpenditure(data, 'withdraw');
            },
          },
        ],
      });
      alert.present();
    }
  }

  async newmoneyentry() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewexpenditureComponent,
      componentProps: { title: 'Nouvelle entrée argent', isentry: true },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'added') {
      const alert = await this.appserv.alertctrl.create({
        header: 'Impréssion',
        message: "Voulez-vous imprimer un bon d'entrée?",
        mode: 'ios',
        translucent: true,
        buttons: [
          { text: 'Non', role: 'cancel' },
          {
            text: 'Oui',
            handler: () => {
              this.printexpenditure(data, 'entry');
            },
          },
        ],
      });
      alert.present();
    }
  }

  loadDefaultSettings() {
    this.defaultmoney = this.appserv.getDefaultmoney();
    this.posprinterformat = this.appserv.getDefaultFormatPrinter();
    this.posprintoptions = this.appserv.getDefaultPrinterConfig();
    this.actualEse = this.appserv.getactualEse();
    this.invoice.money_id = this.defaultmoney.id;
    this.ConvertingPricesInDefaultMoney();
  }

  changingdefaultprices() {
    this.listarticles.forEach((article) => {
      article.prices[0] = article.prices.filter(
        (p) => p.money_id === this.defaultmoney.id
      );
    });
  }

  async possettings() {
    this.oldmoneyId = this.defaultmoney.id;
    const modal = await this.appserv.modalCtrl.create({
      component: PosSettingsComponent,
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'edited') {
      this.loadDefaultSettings();
    }
  }

  async subservicesviewer(article) {
    if (article.subservices.length > 0) {
      const modal = await this.appserv.modalCtrl.create({
        component: DynamicviewerComponent,
        componentProps: { criteria: 'articles', datasent: article.subservices },
        cssClass: 'modal-border-radius-20',
        initialBreakpoint: 0.5,
        breakpoints: [0.25, 0.5, 0.75, 1],
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (role === 'removed') {
        article.subservices = data;
      }
    } else {
    }
  }

  filterbycategorie(categ: CategoriesArticle) {
    this.search = categ.name;
    this.showdefaultprogress = true;
    this.depositserv
      .searchbycategorieandeposit({
        deposit_id: this.actualdeposit.id,
        category_id: categ.id,
      })
      .subscribe(
        (response) => {
          this.showdefaultprogress = false;
          if (response.message === 'success' && response.status === 200) {
            this.listarticles = response.data;
          } else {
            this.appserv.presentToast(
              'Erreur survenue lors du filtre des produits par categorie',
              'danger'
            );
          }
          console.log(response);
        },
        (error) => {
          this.showdefaultprogress = false;
          console.log(error);
          this.appserv.presentToast(
            'Erreur survenue lors du filtre des produits par categorie',
            'danger'
          );
        }
      );
  }

  async filterbydeposit() {
    const modal = await this.appserv.modalCtrl.create({
      component: DepositpickerComponent,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75, 1],
      cssClass: 'modal-border-radius-20',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'selected') {
      if (data.id != this.actualdeposit.id) {
        this.resetchart();
        this.actualdeposit = data;
        this.listcategories = data.categories;
        this.listarticles = [];
        this.input.setFocus();
      } else {
      }
    }
  }

  printduplicata() {
    if (this.invoice) {
      this.showprintingtype = true;
      this.printingtype = 'Duplicata';
      if (this.posprinterformat == 'pos') {
        // this.printposinvoice(this.invoiceUuid);
      } else {
        this.printa4invoice();
      }
    } else {
      this.appserv.presentToast(
        `Vous devez au moins sélectionner une facture`,
        'warning'
      );
      this.showprintingtype = false;
      this.printingtype = '';
    }
  }

  async cashmode() {
    if (this.listselectedarticles.length > 0) {
      this.invoice.type_facture = 'cash';
      this.validateinvoice();
    } else {
      this.msganyfacture();
    }
  }

  async proformat() {
    if (this.actualcustomer.id) {
      if (this.listselectedarticles.length > 0) {
        this.invoice.type_facture = 'proforma';
        this.validateinvoice();
      } else {
        this.msganyfacture();
      }
    } else {
      this.appserv.presentToast(
        `Veuillez séléctionner un client pour la facture proforma`,
        'warning'
      );
    }
  }

  cancelProformat() {
    this.canPrintProforma = false;
    this.invoice.type_facture = '';
    this.resetchart();
  }

  goingInProformatMode() {
    this.invoice.type_facture = 'proforma';
    this.canPrintProforma = true;
  }

  async validateinvoice() {
    this.details = [];

    if (this.listselectedarticles.length > 0) {
      if (!this.appserv.isMyDeviceConnected()) {
        this.appserv.presentToast(
          `Vous êtes en mode hors ligne. La facture sera synchronisée dès que la connexion sera rétablie`,
          'warning'
        );
      } else {
        this.showdefaultprogress = true;
        this.listselectedarticles.forEach((element) => {
          this.syncingdata(element);
        });
        const load = await this.appserv.loadctrl.create({
          message: 'Facturation en cours...',
          mode: 'ios',
          spinner: 'circles',
        });
        load.present();
        this.invoice.details = this.details;
        this.invoice.edited_by_id = this.appserv.getactualuser().id;
        this.invoice.enterprise_id = this.appserv.getactualuser().enterprise_id;
        this.invoice.discount = this.reduction;
        this.invoice.money_id = this.defaultmoney.id;
        this.invoice.netToPay = this.netToPay;
        this.invoice.total_received = this.total_received;
        this.invoice.total_ht = this.totalgeneral;
        this.invoice.sync_status = 1;

        if (
          this.invoice.totalcreditcard == 0 &&
          this.invoice.totalmobilemoney == 0
        ) {
          this.invoice.totalespeces = this.netToPay;
        }

        if (this.actualcollector) {
          this.invoice.collector_id = this.actualcollector.id;
        }
        console.log(this.invoice);
        this.invoiceserv.newinvoice(this.invoice).subscribe(
          (data: any) => {
            this.showdefaultprogress = false;
            load.dismiss();
            this.actualcollector = {};
            if (data.message === 'invoices number exceeded') {
              this.invoiceNumberExceeded();
            } else if (data.message === 'can make invoice') {
              this.invoice.uuid = data.data.invoice.uuid;
              this.invoice.created_at = data.data.invoice.created_at;
              this.invoice.totalpoints = data.data.invoice.totalpoints;
              this.invoice.totalbonus = data.data.invoice.totalbonus;
              this.invoice.totalcautions = data.data.invoice.totalcautions;
              this.invoice.customer_name = data.data.invoice.customer_name;
              this.invoice.total_ht = data.data.invoice.total_ht;
              this.invoice.vat_percent = data.data.invoice.vat_percent;
              this.invoice.vat_amount = data.data.invoice.vat_amount;
              this.invoice.vat_amount = data.data.invoice.vat_amount;
              if (data.data.invoice.type_facture !== 'proforma') {
                this.appserv.presentToast(
                  `Vente effectuée avec succès`,
                  'success'
                );
                this.MayPrint2(data.data);
              }

              if (data.data.invoice.type_facture === 'proforma') {
                this.appserv.presentToast(
                  `Facture proforma  créée avec succès`,
                  'success'
                );
                this.invoice.created_at = data.data.invoice.created_at;
                this.printproforma();
              }
            } else if (data.message === 'user unknown') {
              this.appserv.presentToast(
                `Nous n'arrivons pas à vous identifier!`,
                'warning'
              );
            } else {
            }
          },
          (error) => {
            load.dismiss();
            this.showdefaultprogress = false;
            this.appserv.presentToast(
              'Impossible de créer la facture',
              'warning'
            );
          }
        );
      }
    } else {
      this.appserv.presentToast(`Liste des détails vide`, 'warning');
    }
  }

  async invoiceNumberExceeded() {
    this.resetchart();
    const alert = await this.appserv.alertctrl.create({
      header: 'Quota factures test',
      subHeader: 'Nombre factures gratuites atteint',
      message: `Cher partenaire! Merci pour votre confiance et la volonté manifestées à l'égard de notre application de Gestion. Vous avez atteint le nombre des factures autorisées (100) en mode test. Nous vous prions de bien vouloir payer votre licence pour une année ou à vie afin de continuer à utiliser cette application et profiter de toutes les fonctionnalités alléchantes qui vous sont reservées. Merci de contacter le service client sur +243812058849 ou écrire à contact@cerocepa.com pour d'autres informations y afférentes. Nous espérons continuer travailler avec vous. Que Dieu vous bénisse!`,
      mode: 'ios',
      translucent: true,
      cssClass: 'modal-border-radius',
    });
    alert.present();
  }

  async MayPrint() {
    const modal = await this.appserv.modalCtrl.create({
      component: InvoicePrintComponent,
      componentProps: {
        invoice: this.invoice,
        tva_rate: this.tva_rate,
        posprintoptions: this.posprintoptions,
        today: this.today,
        listselectedarticles: this.listselectedarticles,
        vat_amount: this.vat_amount,
        reduction: this.reduction,
        netToPay: this.netToPay,
        defaultmoney: this.defaultmoney,
        total_received: this.total_received,
        actualcustomer: this.actualcustomer,
        actualEse: this.actualEse,
        totalgeneral: this.totalgeneral,
      },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'printed') {
      this.resetchart();
      this.search = '';
      this.setfocustosearch();
    } else {
      this.search = '';
      this.setfocustosearch();
    }
  }

  async MayPrint2(invoice: any) {
    const modal = await this.appserv.modalCtrl.create({
      component: InvoicePrintComponent,
      componentProps: { invoice: invoice, isinvoice: true },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'printed') {
      this.resetchart();
      this.search = '';
      this.setfocustosearch();
    } else {
      this.search = '';
      this.setfocustosearch();
    }
  }

  async printproforma() {
    const modal = await this.appserv.modalCtrl.create({
      component: PrintproformaComponent,
      cssClass: 'modal-border-radius-20',
      componentProps: {
        invoice: this.invoice,
        typeInvoice: 'model1',
        tva_rate: this.tva_rate,
        posprintoptions: this.posprintoptions,
        today: this.today,
        listselectedarticles: this.listselectedarticles,
        vat_amount: this.vat_amount,
        reduction: this.reduction,
        netToPay: this.netToPay,
        defaultmoney: this.defaultmoney,
        total_received: this.total_received,
        actualcustomer: this.actualcustomer,
        actualEse: this.actualEse,
        totalgeneral: this.totalgeneral,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'printed') {
      this.resetchart();
    }
  }

  async olvalidateinvoice() {
    this.details = [];
    let invoiceNumber: any = null;

    if (this.listselectedarticles.length > 0) {
      this.showdefaultprogress = true;
      this.listselectedarticles.forEach((element) => {
        this.syncingdata(element);
      });
      const load = await this.appserv.loadctrl.create({
        message: 'Facturation en cours...',
        mode: 'ios',
        spinner: 'circles',
      });
      load.present();
      this.invoice.details = this.details;
      this.invoice.edited_by_id = this.appserv.getactualuser().id;
      this.invoice.enterprise_id = this.appserv.getactualuser().enterprise_id;
      this.invoice.discount = this.reduction;
      this.invoice.money_id = this.defaultmoney.id;
      this.invoice.netToPay = this.netToPay;
      this.invoice.total_received = this.total_received;
      this.invoice.total_ht = this.totalgeneral;

      if (
        this.invoice.totalcreditcard == 0 &&
        this.invoice.totalcreditcard == 0
      ) {
        this.invoice.totalespeces = this.netToPay;
      }

      let response: Promise<any> = this.invoiceserv.newinvoicePromis(
        this.invoice
      );
      response
        .then((dataEle) => {
          invoiceNumber = dataEle.data.invoice.uuid;
          this.invoice.uuid = invoiceNumber;
          this.invoiceserv.addtoOffline(data.data.invoice);
          this.appserv.presentToast(`Vente effectuée avec succès`, 'success');
          this.updatingdetailsquantities();
        })
        .catch((response) => {
          load.dismiss();
          this.showdefaultprogress = false;
        });

      const modal = await this.appserv.modalCtrl.create({
        component: InvoicePrintComponent,
        componentProps: {
          title: `Entrer le montant reçu`,
          invoice: this.invoice,
          tva_rate: this.tva_rate,
          posprintoptions: this.posprintoptions,
          today: this.today,
          listselectedarticles: this.listselectedarticles,
          vat_amount: this.vat_amount,
          reduction: this.reduction,
          netToPay: this.netToPay,
          defaultmoney: this.defaultmoney,
          total_received: this.total_received,
          actualcustomer: this.actualcustomer,
          actualEse: this.actualEse,
          totalgeneral: this.totalgeneral,
        },
        cssClass: 'modal-border-radius-20',
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (role === 'printed') {
        this.resetchart();
      }
    } else {
      this.appserv.presentToast(`Liste des détails vide`, 'warning');
    }
  }

  updatingdetailsquantities() {
    this.listselectedarticles.forEach((element) => {
      element.service.available_qte =
        element.service.available_qte - element.service.selling_qte;
    });
    this.articleserv.newupdatingOfflineDetailsQuantities(
      this.listselectedarticles,
      this.invoice.id
    );
  }

  creatingofflinestockhistories(invoice: any) {
    this.listselectedarticles.forEach((element) => {
      if (
        element.deposit_id &&
        element.quantity > 0 &&
        element.service.type === '1'
      ) {
        const newline = {
          service_name: element.service.name,
          description: element.service.description,
          uom_name: element.service.uom_name,
          uom_symbol: element.service.uom_symbol,
          depot_id: element.deposit_id,
          deposit_name: this.actualdeposit.name,
          service_id: element.service.id,
          user_id: this.appserv.actualUser.id,
          done_by_name: this.appserv.actualUser.user_name,
          expiration_date: element.expiration_date,
          bon_livraison: '',
          motif: 'vente',
          invoice_id: invoice.id,
          invoice_uuid: invoice.uuid,
          code_bar: '',
          note: invoice.note,
          type: 'withdraw',
          quantity: element.service.selling_qte,
          quantity_before: element.service.available_qte,
          price: element.service.price,
          total: element.service.price * element.service.selling_qte,
          customer_id: 0,
          provider_id: element.provider_id,
          providerName: ' ',
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
          done_at: invoice.date_operation,
          index: element.index,
          original: element,
        };
        element.service.available_qte =
          element.service.available_qte - element.service.selling_qte;
        this.stockserv.newsaveoffline(newline);
      } else {
        if (!element.quantity) {
          element.quantity_mistaken = true;
        }

        if (!element.deposit_id) {
          element.deposit_mistaken = true;
        }
      }
    });
  }

  printinvoice(invoicesent: Invoice) {
    let services = [['N°', 'Nom', 'Description', 'UOM', 'Catégorie', 'Type']];
    let index = 0;
    this.listselectedarticles.forEach((el) => {
      index = index + 1;
      const obj: any = [
        index,
        el.name,
        el.description,
        el.uom_symbol,
        el.category_name,
        el.type == '1' ? 'Article' : 'Service',
      ];
      services.push(obj);
    });

    const pdfojb = this.appserv.pdftabledownload(
      services,
      'Facture',
      'Test Impression Facture.',
      'portrait',
      'A4'
    );
    this.appserv.pdfaction(pdfojb, 'factures');
  }

  async printa4invoice() {
    let services = [];
    let index = 0;
    this.listselectedarticles.forEach((el) => {
      index = index + 1;
      const obj: any = [
        index,
        el.name,
        el.selling_qte,
        el.price,
        el.price * el.selling_qte,
      ];
      services.push(obj);
    });
    let invoicereturned = this.appserv.printA4invoice(this.invoice, services);
    this.appserv.pdfaction(invoicereturned, 'invoice');
  }
  setfocus(inputElement: ElementRef) {
    // this.renderer.selectRootElement(inputElement).focus();
  }

  async creditmode() {
    if (this.listselectedarticles.length > 0) {
      if (this.actualcustomer && this.actualcustomer.uuid) {
        const modal = await this.appserv.modalCtrl.create({
          component: TipquantityComponent,
          initialBreakpoint: 0.25,
          breakpoints: [0, 0.25, 0.5, 0.75, 1],
          cssClass: 'modal-border-radius-20, modal-invoice',
          componentProps: {
            title: `Entrer l'avance s'il y en a`,
            numbersent: 0,
            zero_accepted: true,
          },
        });

        modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (role == 'edited') {
          if (data >= 0) {
            if (data == this.netToPay) {
              this.appserv.presentToast(
                `Il me semble que votre facture n'est plus à crédit car le montant avancé est égal à celui de la facture`,
                'warning'
              );
            } else if (data > this.netToPay) {
              this.appserv.presentToast(
                `Il me semble que votre facture n'est plus à crédit car le montant avancé est superieur à celui de la facture`,
                'warning'
              );
            } else {
              this.invoice.amount_paid = data;
              this.total_received = data;
              this.invoice.type_facture = 'credit';
              this.validateinvoice();
            }
          } else {
            this.appserv.presentToast(
              `Nombre inférieur à 0 non permis`,
              'warning'
            );
          }
        }
      } else {
        this.pickmember();
      }
    } else {
      this.appserv.presentToast(
        `Aucune facture en cours. Crééez en une`,
        'warning'
      );
    }
  }

  saveinvoice() {
    if (this.listselectedarticles.length > 0) {
      //what can be changed
      this.invoice.details = this.listselectedarticles;
      this.invoice.customer = this.actualcustomer;
      this.invoice.table = this.actualtable;
      this.invoice.servant = this.actualservant;
      this.invoice.customer_id = this.actualcustomer.id;
      this.invoice.customer_name = this.actualcustomer.name
        ? this.actualcustomer.name
        : this.actualcustomer.user_name;
      this.invoice.table_id = this.actualtable.id;
      this.invoice.table_name = this.actualtable.name;
      this.invoice.servant_id = this.actualservant.id;
      this.invoice.servant_name = this.actualservant.name;
      this.invoice.discount = this.reduction;
      this.invoice.total = this.totalgeneral;
      this.invoice.netToPay = this.netToPay;
      this.invoice.money = this.defaultmoney;
      this.invoice.vat_amount = this.vat_amount;
      this.invoice.deposit = this.actualdeposit;

      if (this.invoice.type == 'draft') {
        const records = localStorage.getItem('invoicesSaved');
        if (records !== null) {
          let saved: Invoice[] = JSON.parse(records);
          let reduced = saved.filter((i) => i.id != this.invoice.id);
          reduced.push(this.invoice);
          localStorage.setItem('invoicesSaved', JSON.stringify(reduced));
          this.savedInvoices = reduced;
        }
        this.appserv.presentToast(
          `Facture brouillon modifiée avec succès`,
          'primary'
        );
        this.resetchart();
      } else {
        this.invoice.type = 'draft';

        this.invoice.created_at = this.appserv.today;
        this.invoice.sync_status = 0;
        this.invoice.deposit = this.actualdeposit;
        this.invoice.uuid = this.appserv.getUUID('IS');
        this.invoice.edited_by_id = this.appserv.getactualuser().id;
        this.invoice.enterprise_id = this.appserv.getactualuser().enterprise_id;

        const records = localStorage.getItem('invoicesSaved');
        if (records !== null) {
          let saved: Invoice[] = JSON.parse(records);
          this.invoice.id = saved.length + 10;
          saved.push(this.invoice);
          localStorage.setItem('invoicesSaved', JSON.stringify(saved));
          this.savedInvoices = saved;
        } else {
          let saved: Invoice[] = [];
          saved.push(this.invoice);
          localStorage.setItem('invoicesSaved', JSON.stringify(saved));
          this.savedInvoices = saved;
        }
        this.appserv.presentToast(
          `Facture enregistrée comme brouillon`,
          'primary'
        );
        this.resetchart();
      }
    } else {
      this.appserv.presentToast(`Aucune facture en cours`, 'warning');
    }
  }

  async gotosavedinvoices() {
    const modal = await this.appserv.modalCtrl.create({
      component: SavedinvoicesComponent,
      cssClass: 'modal-border-radius-20',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'deleted') {
      this.savedInvoices.length = this.savedInvoices.length - 1;
      this.appserv.presentToast(`Facture brouillon supprimée`);
    } else if (role == 'toedit') {
      this.resetchart();
      this.invoice = data;
      this.listselectedarticles = data.details;
      this.actualcustomer = data.customer;
      this.actualservant = data.servant;
      this.actualtable = data.table;
      this.vat_amount = data.vat_amount;
      this.tva_rate = data.vat_percent;
      this.reduction = data.discount;
      this.totalgeneral = data.total;
      this.vat_amount = data.vat_amount;
      this.reduction = data.discount;
      if (data.netToPay) {
        this.netToPay = data.netToPay;
      } else {
        this.totalcalculate();
      }
    } else if (role == 'all-deleted') {
      this.savedInvoices = [];
      this.appserv.presentToast(
        `Toutes les factures enregistrées ont été supprimées`
      );
    }
  }

  changingothersamounts($event, criteria: string) {
    let value = $event.target.value;
    let totalamount =
      this.invoice.totalmobilemoney +
      this.invoice.totalcreditcard +
      this.invoice.totalespeces;
    let generaltotal = this.netToPay;

    if (generaltotal < totalamount) {
      switch (criteria) {
        case 'espece':
          this.invoice.totalespeces =
            generaltotal -
            (this.invoice.totalmobilemoney + this.invoice.totalcreditcard);
          break;
        case 'card':
          this.invoice.totalcreditcard =
            generaltotal -
            (this.invoice.totalmobilemoney + this.invoice.totalespeces);
          break;
        case 'mobile':
          this.invoice.totalmobilemoney =
            generaltotal -
            (this.invoice.totalcreditcard + this.invoice.totalespeces);
          break;
        default:
          break;
      }
      this.appserv.presentToast(
        `Montant supérieur au total de la facture`,
        'warning'
      );
    }
  }
  async otherquantity() {
    const modal = await this.appserv.modalCtrl.create({
      component: TipquantityComponent,
      componentProps: { detailsent: null },
      initialBreakpoint: 0.3,
      breakpoints: [0.25, 0.3, 0.5, 0.75, 1],
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'edited') {
      if (data >= 0) {
        if (this.actualarticle) {
          if (this.actualarticle.service.type === '1') {
            if (this.actualarticle.service.available_qte >= data) {
              this.actualarticle.service.selling_qte = data;
              this.totalcalculate();
            } else {
              this.appserv.presentToast(
                `Quantité en stock insuffisante. Veuillez approvisionner ou diminuer sur la quantité à vendre si possible`,
                'warning'
              );
            }
          } else {
            this.actualarticle.service.selling_qte = data;
            this.totalcalculate();
          }
        }
      } else {
        this.appserv.presentToast(`Nombre inférieur à 0 non permis`, 'warning');
      }
    }
  }

  changenumberarticle(number: string) {
    if (this.actualarticle && this.actualarticle.service.id) {
      const oldnumber = this.actualarticle.service.selling_qte;
      const newnumber = oldnumber + number;
      if (this.canPrintProforma) {
        this.actualarticle.service.selling_qte = newnumber;
        this.totalcalculate();
      } else {
        if (this.actualarticle.service.available_qte >= newnumber) {
          this.actualarticle.service.selling_qte = newnumber;
          this.totalcalculate();
        } else {
          this.appserv.presentToast(
            `Quantité en stock insuffisante. Veuillez approvisionner ou diminuer sur la quantité à vendre si possible`,
            'warning'
          );
        }
      }
    } else {
      this.appserv.presentToast(
        `Veuillez sélectionner au moins un article`,
        'warning'
      );
    }
  }

  syncingdata(article: Articles) {
    let subservices = [];
    const object = {
      service_name: article.service.name,
      service_id: article.service.id,
      invoice_id: 0,
      quantity: article.service.selling_qte,
      type_service: article.service.type,
      qty_article: article.service.available_qte,
      price: article.service.price,
      deposit_id: article.service.deposit_id,
      money_id: this.defaultmoney.id,
      money_abreviation: this.defaultmoney.abreviation,
      uom_name: article.service.uom_name,
      uom_symbol: article.service.uom_symbol,
      total: article.service.price * article.service.selling_qte,
      date_operation: this.invoice.date_operation,
      subservices: [],
    };

    if (article.subservices && article.subservices.length > 0) {
      article.subservices.forEach((element) => {
        const data = {
          service_id: element.service.id,
          quantity: element.quantity ? element.quantity : 0,
          price: 0,
          note: 'accompagnement',
        };
        subservices.push(data);
      });
      object.subservices = subservices;
    }

    this.details.push(object);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  }

  getsavedinvoices() {
    const records = localStorage.getItem('invoicesSaved');
    if (records !== null) {
      this.savedInvoices = JSON.parse(records);
    }
  }

  resetchart() {
    this.search = '';
    this.input.setFocus();
    if (this.listselectedarticles.length >= 1) {
      this.details = [];
      this.listselectedarticles = [];
      this.invoice = {};
      this.printedUuid = '';
      this.actualarticle = {};
      this.actualcustomer = {};
      this.actualservant = {};
      this.actualtable = {};
      this.totalgeneral = 0;
      this.total_discount = 0;
      this.vat_amount = 0;
      this.reduction = 0;
      this.netToPay = 0;
      this.showdefaultprogress = false;
      this.listarticles = [];
      this.invoice.date_operation = this.appserv.defaultdate();
    }
  }

  cliconsearchicon() {}

  async cartpreview() {
    const modal = await this.appserv.modalCtrl.create({
      component: CartpreviewComponent,
      componentProps: { articles: this.listselectedarticles },
      cssClass: 'modal-border-radius-20',
    });
    (await modal).present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'created') {
      this.listarticles.forEach((article: any) => {
        data.forEach((detail: any) => {
          if (article.id === detail.service_id) {
            article.available_qte = article.available_qte - detail.quantity;
          }
        });
      });
      this.listselectedarticles = [];
    }

    if (role == 'saved') {
      this.listselectedarticles = [];
      const records = localStorage.getItem('invoicesSaved');
      if (records !== null) {
        this.savedInvoices = JSON.parse(records);
        this.savedInvoices.unshift(data);
      } else {
        localStorage.setItem(
          'invoicesSaved',
          JSON.stringify(this.savedInvoices)
        );
      }
    }
  }

  async newproduct() {
    const modal = await this.appserv.modalCtrl.create({
      component: NewserviceComponent,
      componentProps: {
        listcategories: this.listcategories,
        listunitofmeasure: this.listunitofmeasure,
      },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'added') {
      data.selected = false;
      data.service.available_qte = 0;
      data.service.selling_qte = 0;
      this.listarticles.unshift(data);
    }
  }

  async addtocart(article: Articles, index: number = 0) {
    console.log(article);
    // article.service.price=article.prices.filter(p=>p.principal===1)[0].price;
    // console.log(article);
    article.index = index;
    const ifexists = this.listselectedarticles.indexOf(article);

    if (
      ifexists === -1 &&
      this.listselectedarticles.filter(
        (a) => a.service.id == article.service.id
      ).length == 0
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
          article.subservices = [];
          this.listselectedarticles.push(article);
          this.search = '';
        } else {
          if (this.canPrintProforma) {
            article.selected = true;
            article.service.total = article.price * article.service.selling_qte;
            article.index = index;
            article.subservices = [];
            this.listselectedarticles.push(article);
          } else {
            const alert = await this.appserv.alertctrl.create({
              header: 'Stock insuffisant',
              message: `Quantité insuffisante. Voulez-vous approvisionner l'article?`,
              mode: 'ios',
              buttons: [
                { text: 'Non', role: 'cancel' },
                {
                  text: 'Oui',
                  handler: async () => {
                    this.addstockhistory(article.service, index);
                  },
                },
              ],
            });
            if (this.appserv.permissionFilter('stock', 'entry')) {
              alert.present();
            }
          }
        }
      } else {
        article.selected = true;
        article.service.total = article.price * article.service.selling_qte;
        article.index = index;
        article.subservices = [];
        this.listselectedarticles.push(article);
      }
      this.totalcalculate();
    } else {
      this.listselectedarticles = this.listselectedarticles.filter(
        (s) => s != article
      );
      article.selected = false;
      this.totalcalculate();
      // // this.listselectedarticles=this.listselectedarticles.filter(a=>a!=article);
    }
    this.actualarticle = article;
    this.search = '';
    this.setfocustosearch();
  }

  getlistarticles() {
    const object = { user_id: this.actualuser.id };
    this.showdefaultprogress = true;
    this.articleserv.serviceslist(object).subscribe(
      (data) => {
        this.showdefaultprogress = false;
        this.listarticles = data;
        this.actualdeposit = this.listarticles[0];
        this.keptlistarticles = data;
        //save to local storage
        localStorage.setItem('depositArticles', JSON.stringify(data));
        this.ConvertingPricesInDefaultMoney();
      },
      (error) => {
        this.showdefaultprogress = false;
        this.appserv.presentToast(
          'Nous utilisons vos données hors ligne.',
          'primary'
        );
        // //taking for local storage
        const records = localStorage.getItem('depositArticles');
        if (records !== null) {
          this.listarticles = JSON.parse(records);
          this.actualdeposit = this.listarticles[0];
          this.keptlistarticles = this.listarticles;
          this.ConvertingPricesInDefaultMoney();
        }
      }
    );
  }

  getlistdeposits() {
    if (this.appserv.isMyDeviceConnected()) {
      this.showdefaultprogress = true;
      this.depositserv
        .forASpecifUser({ user_id: this.actualuser.id })
        .subscribe({
          next: (data) => {
            this.showdefaultprogress = false;
            this.listdeposits = data;
            this.actualdeposit = this.listdeposits[0];
            this.listcategories = this.actualdeposit?.categories;
          },
          error: (err) => {
            this.showdefaultprogress = false;
            this.appserv.presentToast(
              'Impossible de récupérer les dépôts',
              'warning'
            );
          },
        });
    } else {
      //taking for local storage
      this.listdeposits = this.depositserv.getOfflineData();
      this.actualdeposit = this.listdeposits[0];
    }
  }

  getlistUnitofmeausre() {
    this.uomserv.getallunitofmeasure(this.actualuser.enterprise_id).subscribe(
      (data) => {
        this.listunitofmeasure = data;
      },
      (error) => {
        //taking for local storage
        const records = localStorage.getItem('unitofmeasures');
        if (records !== null) {
          this.listunitofmeasure = JSON.parse(records);
        }
      }
    );
  }

  getlistcategoriesarticles() {
    this.cateserv
      .getallcategoriesarticles(this.actualuser.enterprise_id)
      .subscribe(
        (data) => {
          this.listcategories = data;
        },
        (error) => {
          //taking for local storage
          const records = localStorage.getItem('categoriesartiles');
          if (records !== null) {
            this.listcategories = JSON.parse(records);
          }
        }
      );
  }

  async addstockhistory(article: any, index: number) {
    const modal = await this.appserv.modalCtrl.create({
      component: TipquantityComponent,
      cssClass: 'modal-border-radius-20',
      initialBreakpoint: 0.3,
      breakpoints: [0.25, 0.3, 0.5, 0.75, 1],
      componentProps: { title: 'Quantité à approvisionner' },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'edited') {
      if (data >= 0) {
        //send stock history
        let stock: StockHistory = {};
        stock.user_id = this.appserv.getactualuser().id;
        stock.service_id = article.id;
        stock.quantity = data;
        stock.type = 'entry';
        stock.type_approvement = 'entry';
        stock.note = 'approvisionnement direct guichet';
        stock.enterprise_id = this.appserv.getactualuser().enterprise_id;

        const alert = await this.appserv.loadctrl.create({
          message: 'Approvisionnement en cours...',
          spinner: 'circles',
          mode: 'ios',
        });
        alert.present();
        this.stockserv.newstock(stock).subscribe(
          (data: any) => {
            alert.dismiss();
            article.available_qte += data.quantity;
            article.available_quantity += data.quantity;
            this.addtocart(article, index);
          },
          (error) => {
            alert.dismiss();
            this.appserv.presentToast(
              `Impossible d'approvisionner l'article. Verifiez votre connexion`,
              'warning'
            );
          }
        );
      } else {
        this.appserv.presentToast(`Nombre inférieur à 0 non permis`, 'warning');
      }
    }
  }

  /**
   * Chart Preview Methods
   */
  removefromlist(detail: Articles) {
    detail.selected = false;
    detail.selling_qte = 0;
    this.listselectedarticles = this.listselectedarticles.filter(
      (d) => d != detail
    );
    this.totalcalculate();
  }

  totalcalculate() {
    this.totalgeneral = 0;
    this.invoice.vat_amount = 0;
    this.vat_amount = 0;
    this.listselectedarticles.forEach((detail: any) => {
      const totaldetail = detail.service.price * detail.service.selling_qte;
      this.totalgeneral = this.totalgeneral + totaldetail;
      if (detail.service.has_vat) {
        this.vat_amount = this.vat_amount + (totaldetail * this.tva_rate) / 100;
      }
    });
    this.invoice.vat_amount = this.vat_amount;
    this.invoice.total = this.totalgeneral;
    this.netToPay = this.totalgeneral - this.reduction;
    this.totalgeneral = this.totalgeneral - this.invoice.vat_amount;
  }

  async servicepricespicker(article: any) {
    const modal = await this.appserv.modalCtrl.create({
      component: ServicepricespickerComponent,
      componentProps: {
        serviceidsent: article.service.id,
        prices: article.prices,
      },
      cssClass: 'modal-border-radius-20',
    });
    (await modal).present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'selected') {
      article.service.price = data.price;
      article.service.total =
        article.service.selling_qte * article.service.price;
      this.totalcalculate();
      if (data.not_from_api) {
        this.sendpricetoserver(data);
      }
    }
  }

  async sendpricetoserver(data: any) {
    const ctrl = await this.appserv.alertctrl.create({
      header: 'Ajout prix',
      message: `Vous venez d'ajouter un nouveau prix. Voulez-vous l'enregistrer?`,
      mode: 'ios',
      translucent: true,
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui',
          handler: async () => {
            const loader = await this.appserv.loadctrl.create({
              message: 'Enregistrement',
              spinner: 'circles',
              mode: 'ios',
            });
            loader.present();

            this.appserv.newpricecategory(data).subscribe(
              (data) => {
                this.appserv.presentToast(
                  `Prix enregistré avec succès`,
                  'success'
                );
                loader.dismiss();
              },
              (error) => {
                this.appserv.presentToast(
                  `Erreur d'enregistrement du prix`,
                  'danger'
                );
                loader.dismiss();
              }
            );
          },
        },
      ],
    });

    ctrl.present();
  }
  quantitychange(detail: Articles, criteria: string) {
    if (criteria == 'remove') {
      detail.service.selling_qte = detail.service.selling_qte - 1;
      detail.service.total = detail.service.selling_qte * detail.service.price;
      if (detail.service.selling_qte == 0) {
        this.removefromlist(detail);
      }
    } else {
      if (detail.type === '1') {
        if (this.canPrintProforma) {
          detail.service.selling_qte = detail.service.selling_qte + 1;
          detail.service.total =
            detail.service.selling_qte * detail.service.price;
        } else {
          if (detail.service.available_qte >= detail.service.selling_qte + 1) {
            detail.service.selling_qte = detail.service.selling_qte + 1;
            detail.service.total =
              detail.service.selling_qte * detail.service.price;
          } else {
            this.appserv.presentToast(
              'Quantité insuffisante en stock',
              'warning'
            );
          }
        }
      } else {
        detail.service.selling_qte = detail.service.selling_qte + 1;
        detail.service.total =
          detail.service.selling_qte * detail.service.price;
      }
    }
    this.totalcalculate();
  }

  async tipquantity(detail: Articles) {
    const modal = await this.appserv.modalCtrl.create({
      component: TipquantityComponent,
      componentProps: {
        detailsent: detail,
        title: 'Entrer la quantité à vendre',
      },
      initialBreakpoint: 0.3,
      breakpoints: [0.25, 0.3, 0.5, 0.75, 1],
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'edited') {
      if (data >= 0) {
        if (detail.service.type == '2') {
          detail.service.selling_qte = data;
          detail.service.total = data * detail.service.price;
          this.totalcalculate();
        } else if (detail.service.type == '1') {
          if (this.canPrintProforma) {
            detail.service.selling_qte = data;
            detail.service.total = data * detail.service.price;
            this.totalcalculate();
          } else {
            if (data <= detail.service.available_qte) {
              detail.service.selling_qte = data;
              detail.service.total = data * detail.service.price;
              this.totalcalculate();
            } else {
              detail.service.selling_qte = detail.service.selling_qte;
              this.appserv.presentToast(
                `Quantité en stock insuffisante. Veuillez approvisionner ou diminuer sur la quantité à vendre si possible`,
                'warning'
              );
            }
          }
        }
      } else {
        this.appserv.presentToast(`Nombre inférieur à 0 non permis`, 'warning');
      }
    }
  }

  async vatenter() {
    if (this.appserv.permissionFilter('Facturation', 'tva change')) {
      if (this.listselectedarticles.length > 0) {
        const modal = await this.appserv.modalCtrl.create({
          component: VatenterComponent,
          initialBreakpoint: 0.3,
          breakpoints: [0.25, 0.3, 0.5, 0.75, 1],
          cssClass: 'modal-border-radius-20',
        });
        modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (role == 'changed') {
          if (data >= 0) {
            this.tva_rate = data;
            this.vat_amount = (this.totalgeneral * data) / 100;
            this.invoice.vat_percent = data;
            this.totalcalculate();
          } else {
            this.appserv.presentToast(
              `Nombre inférieur à 0 non permis`,
              'warning'
            );
          }
        }
      } else {
        this.msganyfacture();
      }
    } else {
      this.appserv.presentToast(
        `Vous n'avez pas l'autorisation de modifier la TVA`,
        'warning'
      );
    }
  }

  async reductionenter() {
    if (this.appserv.permissionFilter('Facturation', 'give reduction')) {
      if (this.listselectedarticles.length > 0) {
        const modal = await this.appserv.modalCtrl.create({
          component: ReductionenterComponent,
          initialBreakpoint: 0.3,
          breakpoints: [0.25, 0.3, 0.5, 0.75, 1],
          cssClass: 'modal-border-radius-20',
        });
        modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (role == 'changed') {
          if (data >= 0) {
            if (this.netToPay >= data) {
              this.reduction = data;
              this.totalcalculate();
            } else {
              this.appserv.presentToast(
                `Vous ne pouvez pas accorder une réduction supérieure au Net à payer`,
                'warning'
              );
            }
          } else {
            this.appserv.presentToast(
              `Nombre inférieur à 0 non permis`,
              'warning'
            );
          }
        }
      } else {
        this.msganyfacture();
      }
    } else {
      this.appserv.presentToast(
        `Vous n'avez pas l'autorisation d'accorder une réduction`,
        'warning'
      );
    }
  }

  msganyfacture() {
    this.appserv.presentToast(
      `Aucune facture en cours. Veuillez en creer une.`,
      'warning'
    );
  }

  async pickmember() {
    
    // 🔥 Ferme tout modal déjà ouvert
    const top = await this.appserv.modalCtrl.getTop();
    if (top) {
      await top.dismiss();
    }

    const modal = await this.appserv.modalCtrl.create({
      component:UserpickerforsaleComponent,
      cssClass: 'modal-border-radius-20',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'selected') {
      this.actualcustomer = data;
      this.invoice.customer = data;
      this.invoice.customer_id = data.id;
      this.invoice.customer_uuid = data.uuid;
      this.getMemberAccounts(this.actualcustomer.id);
    }
  }

  async getMemberAccounts(customer: number) {
    const accounts = await this.accountserv.getmemberaccounts(customer);
    if (accounts.status===200 && accounts.message==="success") {
      this.memberAccounts = accounts.data;
    }
  }

  async detailsCustomer(actualcustomer: Customers) {
    // const modal = await this.appserv.modalCtrl.create({
    //   component: InfoscustomerComponent,
    //   componentProps: { customersent: actualcustomer },
    //   cssClass: 'modal-border-radius-20',
    // });
    // (await modal).present();
  }

  async pickservant() {
    const modal = await this.appserv.modalCtrl.create({
      component: ServantpickerComponent,
      cssClass: 'modal-border-radius-20',
    });
    (await modal).present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'selected') {
      this.actualservant = data;
      this.invoice.servant_id = data.id;
    }
  }

  async tablepicker() {
    const modal = await this.appserv.modalCtrl.create({
      component: TablepickerComponent,
      cssClass: 'modal-border-radius-20',
    });
    (await modal).present();
    const { data, role } = await modal.onWillDismiss();
    if (role == 'selected') {
      this.actualtable = data;
      this.invoice.table_id = data.id;
    }
  }
}
