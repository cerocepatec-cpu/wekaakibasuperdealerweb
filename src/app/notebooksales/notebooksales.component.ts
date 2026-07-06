import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NewfenceComponent } from 'src/app/finances/fences/newfence/newfence.component';
import { SelectsubservicesComponent } from 'src/app/selectsubservices/selectsubservices.component';
import { DynamicviewerComponent } from 'src/app/reports/dynamicviewer/dynamicviewer.component';
import { UserpickerComponent } from 'src/app/agents/userpicker/userpicker.component';
import { FundService } from 'src/app/services/funds.service';
import { MembersaccountsService } from 'src/app/services/membersaccounts.service';
import { IonInput } from '@ionic/angular';
import { Users } from '../interfaces/users';
import { Articles } from '../interfaces/articles';
import { Invoice } from '../interfaces/invoices';
import { CategoriesArticle } from '../interfaces/cagoriesarticles';
import { UnitofMeasure } from '../interfaces/unitofmeasure';
import { Enterprise } from '../interfaces/enterprise';
import { Deposits } from '../interfaces/deposit';
import { PosPrintingOptions } from '../interfaces/posprintingoptions';
import { ConversionMoney } from '../interfaces/conversionmoneys';
import { DetailsInvoice } from '../interfaces/detailsinvoice';
import { Servant } from '../interfaces/servants';
import { Tables } from '../interfaces/tables';
import { Money } from '../interfaces/money';
import { ConversionMoneysService } from '../services/conversion-moneys.service';
import { InvoiceService } from '../services/invoice.service';
import { StockService } from '../services/stock.service';
import { UnitofmeasureService } from '../services/unitofmeasure.service';
import { AppservicesService } from '../services/appservices.service';
import { ArticlesService } from '../services/articles.service';
import { CategoryserviceService } from '../services/categoryservice.service';
import { DebtsService } from '../services/debts.service';
import { DepositsService } from '../services/deposits.service';
import { MenuMobileInvoiceComponent } from '../module/uzisha/home/menu-mobile-invoice/menu-mobile-invoice.component';
import { InvoicesComponent } from '../finances/invoices/invoices.component';
import { DebtsPage } from '../debts/debts.page';
import { PrintexpenditureandentryComponent } from '../finances/printexpenditureandentry/printexpenditureandentry.component';
import { NewexpenditureComponent } from '../finances/expenditures/newexpenditure/newexpenditure.component';
import { PosSettingsComponent } from '../pos-settings/pos-settings.component';
import { DepositpickerComponent } from '../articles/depositpicker/depositpicker.component';
import { InvoicePrintComponent } from '../module/uzisha/home/invoice-print/invoice-print.component';
import { PrintproformaComponent } from '../module/uzisha/home/printproforma/printproforma.component';
import { TipquantityComponent } from '../tab2/tipquantity/tipquantity.component';
import { SavedinvoicesComponent } from '../finances/invoices/savedinvoices/savedinvoices.component';
import { CartpreviewComponent } from '../tab2/cartpreview/cartpreview.component';
import { NewserviceComponent } from '../articles/newservice/newservice.component';
import { StockHistory } from '../interfaces/stockhistory';
import { ServicepricespickerComponent } from '../tab2/servicepricespicker/servicepricespicker.component';
import { VatenterComponent } from '../tab2/vatenter/vatenter.component';
import { ReductionenterComponent } from '../tab2/reductionenter/reductionenter.component';
import { Customers } from '../interfaces/customers';
import { InfoscustomerComponent } from '../customers/infoscustomer/infoscustomer.component';
import { ServantpickerComponent } from '../servants/servantpicker/servantpicker.component';
import { TablepickerComponent } from '../tables/tablepicker/tablepicker.component';
import { PicktubsComponent } from '../tubs/picktubs/picktubs.component';
import { AuthentificationService } from '../services/authentification.service';
import { UserpickerforsaleComponent } from '../agents/userpickerforsale/userpickerforsale.component';
import { Console, log } from 'console';

@Component({
  selector: 'app-notebooksales',
  templateUrl: './notebooksales.component.html',
  styleUrls: ['./notebooksales.component.scss'],
})
export class NotebooksalesComponent implements OnInit {
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
  actualService: Articles = {};
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
  defaultmoney: any = {
    abreviation: '',
  };
  memberAccounts: any[] = [];
  userFunds: any[] = [];
  selectedFund: any = null;
  selectedAccount: any = null;
  serialsList: any[] = [];
  filteredSerials: any[] = [];
  NbrServiceSerrialNumber: number = 0;
  quantity: number = 0;

  currentPage: number = 1;
  nextPageUrl: string | null = null;
  prevPageUrl: string | null = null;
  totalSerialNumberBySerice: number = 0;
  perPageSerialNumber: number = 20;
  serviceId: number;
  mobileCatalogOpen: boolean = false;
  allarticles: any[] = [];

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
    private depositserv: DepositsService,
    private authserv: AuthentificationService
  ) {}

  ngOnInit() {
    this.actualuser = this.appserv.getactualuser();
    this.getlistdeposits();

    this.invoice.totalespeces = 0;
    this.invoice.totalcreditcard = 0;
    this.invoice.totalmobilemoney = 0;
    this.invoice.back = 0;
    this.invoice.date_operation = this.appserv.defaultdate();
    this.tva_rate = this.appserv.getactualEse().vat_rate
      ? this.appserv.getactualEse().vat_rate
      : 0;

    setTimeout(() => {
      this.defaultmoney = this.appserv.getDefaultmoney();
      this.depositserv.getservicesfordeposit().subscribe(
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
    }, 200);
  }

  ngAfterViewInit() {
    this.loadDefaultSettings();
    setTimeout(() => {
      this.getlistTubs();
      this.input?.setFocus();
    }, 200);
  }

  loadDefaultSettings() {
    this.posprinterformat = this.appserv.getDefaultFormatPrinter();
    this.posprintoptions = this.appserv.getDefaultPrinterConfig();
    this.actualEse = this.appserv.getactualEse();
    this.invoice.money_id = this.defaultmoney.id;
    //this.ConvertingPricesInDefaultMoney();
  }

  getlistTubs() {
    this.appserv.myTubs(this.appserv.actualUser.id).subscribe(
      (data) => {
        this.userFunds = data;
      },
      (error) => {
        this.appserv.presentToast(
          'Erreur survenue lors de la recupération de la liste des caisses.',
          'danger'
        );
      }
    );
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
                // this.addtocart(response);
                this.appserv.presentToast(
                  'Résultat trouvé et ajouté au panier ',
                  'primary'
                );
              }

              if (response.service.type === '2' || this.canPrintProforma) {
                // this.addtocart(response);
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
        //looking for codebar
        //if isset deposit
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
                // this.addtocart(response);
                this.appserv.presentToast(
                  'Résultat trouvé et ajouté au panier ',
                  'primary'
                );
              }

              if (response.service.type === '2' || this.canPrintProforma) {
                // this.addtocart(response);
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
    this.input?.setFocus();
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
  filterItems(event: any) {
    const value = event?.target?.value || '';
    this.search = value;

    const keyword = String(value).trim().toLowerCase();

    if (!keyword) {
      this.getlistTubs();
      this.listarticles = [...this.allarticles];

      return;
    }

    this.listarticles = this.listarticles.filter((article: any) => {
      const name = String(
        article?.service?.name || article?.name || ''
      ).toLowerCase();
      const description = String(
        article?.service?.description || article?.description || ''
      ).toLowerCase();
      const id = String(article?.service?.id || '').toLowerCase();

      return (
        name.includes(keyword) ||
        description.includes(keyword) ||
        id.includes(keyword)
      );
    });
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
            this.allarticles = [...this.listarticles];
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
        this.input?.setFocus();
      } else {
      }
    }
  }
  selectNotebookArticle(article: any) {
    if (!article) {
      return;
    }
    const stock = Number(article?.service?.available_qte || 0);
    if (stock <= 0) {
      this.appserv.presentToast('Stock épuisé pour cet article', 'warning');
      return;
    }
    this.actualarticle = article;
    this.actualService = article;

    if (!this.actualarticle.serial_numbers) {
      this.actualarticle.serial_numbers = [];
    }

    if (!this.actualarticle.service) {
      this.actualarticle.service = {};
    }

    // ✅ Résoudre le prix comme dans l'ancien front
    const resolvedPrice = this.getArticleResolvedPrice(article);
    const resolvedMoney = this.getArticleDisplayMoney(article);

    this.actualarticle.service.price = Number(resolvedPrice || 0);
    this.actualarticle.service.abreviation =
      resolvedMoney || this.defaultmoney?.abreviation || 'FC';
    this.actualarticle.service.money_id =
      this.defaultmoney?.id || this.actualarticle.service.money_id;

    // ✅ Quantité courante basée sur les numéros de série déjà sélectionnés
    this.NbrServiceSerrialNumber =
      this.actualarticle.serial_numbers.length || 0;

    // ✅ Service courant pour la logique de récupération auto des serial numbers
    this.serviceId = this.actualarticle?.service?.id;
    this.totalSerialNumberBySerice = Number(
      this.actualarticle?.service?.available_qte || 0
    );

    // ✅ Conserver un aperçu local si besoin
    this.filteredSerials = Array.isArray(this.actualarticle.serial_numbers)
      ? [...this.actualarticle.serial_numbers]
      : [];

    // ✅ Ajouter ou mettre à jour dans le panier multi-items
    const existingIndex = this.listselectedarticles.findIndex(
      (x: any) => x?.service?.id === article?.service?.id
    );
    const isNewArticle = existingIndex === -1;
    if (isNewArticle) {
      this.NbrServiceSerrialNumber = 0;
      this.actualarticle.serial_numbers = [];
      this.actualarticle.service.selling_qte = 0;
    } else {
      // 🔁 si déjà existant → garder la valeur
      this.NbrServiceSerrialNumber =
        this.actualarticle.serial_numbers.length || 0;
    }
    if (existingIndex === -1) {
      this.listselectedarticles.push(this.actualarticle);
    } else {
      this.listselectedarticles[existingIndex] = this.actualarticle;
    }

    // ✅ selling_qte doit toujours refléter le nombre réel de serial numbers
    this.actualarticle.service.selling_qte =
      this.actualarticle.serial_numbers.length || 0;

    this.totalcalculate();
  }
  clearCart() {
    this.listselectedarticles = [];
    this.actualarticle = null;
    this.actualService = {};
    this.NbrServiceSerrialNumber = 0;
    this.filteredSerials = [];
    this.serviceId = null;
    this.totalSerialNumberBySerice = 0;

    if (this.details) {
      this.details = [];
    }

    if (this.netToPay) {
      this.netToPay = 0;
    }

    if (this.invoice) {
      this.invoice.total_ht = 0;
      this.invoice.total_received = 0;
      this.invoice.totalespeces = 0;
    }

    this.totalcalculate();
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
      if (!this.actualcustomer.id) {
        this.appserv.presentToast(
          'Vous devez selectionner au moins un membre à qui vendre les carnets svp!',
          'warning'
        );
        return;
      }

      if (
        this.actualuser.user_type !== 'super_dealer' &&
        this.actualuser.user_type !== 'collector'
      ) {
        const modal = await this.appserv.modalCtrl.create({
          component: PicktubsComponent,
          componentProps:{typesent:'salenotebooks'},
          cssClass: 'modal-border-radius-20',
        });
        modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (role === 'selected') {
          this.selectedFund = data;
          this.validateinvoice();
        } else {
          this.appserv.presentToast(
            'Vous devez séléctionner au moins une caisse!',
            'warning'
          );
        }
      } else {
        this.validateinvoice();
      }
      this.invoice.type_facture = 'cash';
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

    if (this.listselectedarticles.length <= 0) {
      this.appserv.presentToast(`Liste des détails vide`, 'warning');
      return;
    }

    if (
      this.actualuser.user_type !== 'super_dealer' &&
      this.actualuser.user_type !== 'collector'
    ) {
      if (!this.actualcustomer?.id || !this.selectedFund?.id) {
        this.appserv.presentToast(
          'Selectionnez un membre et une caisse pour continuer svp!',
          'warning'
        );
        return;
      }
    }

    const pin: any = await this.authserv.callPinModal();
    if (!pin || pin.length < 4) {
      this.appserv.presentToast('Aucun ou mauvais Pin fourni svp!', 'warning');
      return;
    }
    this.showdefaultprogress = true;

    this.listselectedarticles.forEach((element) => {
      this.syncingdata(element);
    });

    const load = await this.appserv.loadctrl.create({
      message: 'Facturation en cours...',
      mode: 'ios',
      spinner: 'circles',
    });

    await load.present();

    // ===============================
    // Construction objet invoice
    // ===============================

    this.invoice.details = this.details;
    this.invoice.edited_by_id = this.appserv.getactualuser().id;
    this.invoice.enterprise_id = this.appserv.getactualuser().enterprise_id;
    this.invoice.discount = this.reduction;
    this.invoice.money_id = this.defaultmoney.id;
    this.invoice.netToPay = this.netToPay;
    this.invoice.total_received = this.total_received;
    this.invoice.total_ht = this.totalgeneral;
    this.invoice.fund_id = this.selectedFund?.id ?? 0;
    this.invoice.member_account_id = this.selectedAccount?.id ?? null;
    this.invoice.customer_id = this.actualcustomer.id;
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
    console.log('Invoice before sent', this.invoice);
    this.invoiceserv.newinvoice(this.invoice).subscribe(
      async (res: any) => {
        console.log('Invoice from api', res);
        this.showdefaultprogress = false;
        await load.dismiss();

        // ===============================
        // Cas OTP requis
        // ===============================

        if (res.payment_status === 'otp_required') {
          this.invoice.id = res.data.id;

          await this.openOtpModal(this.invoice.id);
          return;
        }

        // ===============================
        // Cas validé direct
        // ===============================

        if (res.status === 200 && res.message === 'success') {
          this.appserv.presentToast(`Vente effectuée avec succès`, 'success');

          this.MayPrint2(res.data);
          return;
        }
      },
      async (error) => {
        console.log(error);
        await load.dismiss();
        this.showdefaultprogress = false;

        this.appserv.presentToast(
          'Impossible de créer la facture.' + error.error.error || '',
          'warning'
        );
      }
    );
  }

  async openOtpModal(invoiceId: number) {
    const alert = await this.appserv.alertctrl.create({
      header: 'Confirmation OTP',
      message: 'Veuillez entrer le code reçu par le membre',
      inputs: [
        {
          name: 'otp',
          type: 'number',
          placeholder: 'Entrez OTP',
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
            if (!data.otp) {
              this.appserv.presentToast('OTP requis', 'warning');
              return false;
            }

            return this.confirmOtp(invoiceId, data.otp);
          },
        },
      ],
    });

    await alert.present();
  }

  confirmOtp(invoiceId: number, otp: string) {
    this.invoiceserv.confirmInvoiceOtp(invoiceId, otp).subscribe(
      (res: any) => {
        if (res.status === 'validated') {
          this.appserv.presentToast(`Vente validée avec succès`, 'success');

          this.MayPrint2(res);
        }
      },
      (error) => {
        this.appserv.presentToast('OTP invalide ou expiré', 'danger');
      }
    );
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

    const resolvedPrice = Number(article?.service?.price || 0);
    const quantity = Array.isArray(article?.serial_numbers)
      ? article.serial_numbers.length
      : Number(article?.service?.selling_qte || 0);

    const object = {
      service_name: article.service.name,
      service_id: article.service.id,
      invoice_id: 0,
      quantity: quantity,
      type_service: article.service.type,
      qty_article: article.service.available_qte,
      price: resolvedPrice,
      deposit_id: article.service.deposit_id,
      money_id: this.defaultmoney.id,
      money_abreviation: this.defaultmoney.abreviation,
      uom_name: article.service.uom_name,
      uom_symbol: article.service.uom_symbol,
      total: resolvedPrice * quantity,
      date_operation: this.invoice.date_operation,
      subservices: [],
      serial_numbers: article.serial_numbers,
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

    if (!object.price || object.price <= 0) {
      console.log('Article sans prix valide => ', article);
      this.appserv.presentToast(
        `Le prix de ${article.service.name} est introuvable. Veuillez re-sélectionner l'article ou choisir un prix.`,
        'warning'
      );
      return;
    }

    this.details.push(object);
  }
  getArticleResolvedPrice(article: any): number {
    if (!article) return 0;

    if (article?.service?.price && Number(article.service.price) > 0) {
      return Number(article.service.price);
    }

    if (Array.isArray(article?.prices) && article.prices.length > 0) {
      const selectedPrice =
        article.prices.find(
          (p: any) =>
            p?.money_id === this.defaultmoney?.id &&
            (p?.principal === 1 || p?.principal === true)
        ) ||
        article.prices.find(
          (p: any) => p?.money_id === this.defaultmoney?.id
        ) ||
        article.prices[0];

      return Number(selectedPrice?.price || 0);
    }

    return Number(article?.price || 0);
  }

  getArticleDisplayPrice(article: any): number {
    return this.getArticleResolvedPrice(article);
  }

  getArticleDisplayMoney(article: any): string {
    if (!article) return this.defaultmoney?.abreviation || 'FC';

    if (article?.service?.abreviation) {
      return article.service.abreviation;
    }

    if (Array.isArray(article?.prices) && article.prices.length > 0) {
      const selectedPrice =
        article.prices.find(
          (p: any) =>
            p?.money_id === this.defaultmoney?.id &&
            (p?.principal === 1 || p?.principal === true)
        ) ||
        article.prices.find(
          (p: any) => p?.money_id === this.defaultmoney?.id
        ) ||
        article.prices[0];

      return (
        selectedPrice?.abreviation || this.defaultmoney?.abreviation || 'FC'
      );
    }

    return this.defaultmoney?.abreviation || 'FC';
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
    this.input?.setFocus();
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

  // async addtocart(article: Articles, index: number = 0) {
  //   if (!article || !article.prices || article.prices.length === 0) {
  //     this.appserv.presentToast(
  //       'Aucun prix défini pour cet article.',
  //       'danger'
  //     );
  //     return;
  //   }

  //   if (!this.defaultmoney?.id) {
  //     this.appserv.presentToast('Monnaie par défaut non définie.', 'danger');
  //     return;
  //   }

  //   article.index = index;

  //   const alreadyInCart = this.listselectedarticles.find(
  //     (a) => a.service.id === article.service.id
  //   );

  //   // ================= AJOUT =================
  //   if (!alreadyInCart) {
  //     // Trouver prix correspondant à la monnaie active
  //     const selectedPrice = article.prices.find(
  //       (p) => p.money_id === this.defaultmoney.id
  //     );

  //     // Fallback : prix principal
  //     const fallbackPrice = article.prices.find((p) => p.principal === 1);

  //     const finalPrice = selectedPrice || fallbackPrice;

  //     if (!finalPrice) {
  //       this.appserv.presentToast(
  //         'Aucun prix disponible pour cette monnaie.',
  //         'danger'
  //       );
  //       return;
  //     }

  //     article.service.selling_qte = 1;
  //     article.service.price = finalPrice.price;
  //     article.service.abreviation = finalPrice.abreviation;
  //     article.service.money_id = finalPrice.money_id;
  //     article.service.total =
  //       article.service.price * article.service.selling_qte;

  //     article.subservices = [];
  //     article.selected = true;

  //     // ===== Gestion stock =====
  //     if (article.service.type === '1') {
  //       if (article.service.available_qte > 0) {
  //         this.listselectedarticles.push(article);
  //       } else {
  //         if (this.canPrintProforma) {
  //           this.listselectedarticles.push(article);
  //         } else {
  //           if (this.appserv.permissionFilter('stock', 'entry')) {
  //             const alert = await this.appserv.alertctrl.create({
  //               header: 'Stock insuffisant',
  //               message: `Quantité insuffisante. Voulez-vous approvisionner l'article ?`,
  //               mode: 'ios',
  //               buttons: [
  //                 { text: 'Non', role: 'cancel' },
  //                 {
  //                   text: 'Oui',
  //                   handler: async () => {
  //                     this.addstockhistory(article.service, index);
  //                   },
  //                 },
  //               ],
  //             });

  //             await alert.present();
  //           } else {
  //             this.appserv.presentToast('Stock insuffisant.', 'danger');

  //             return;
  //           }
  //         }
  //       }
  //     } else {
  //       // Service non stocké
  //       this.listselectedarticles.push(article);
  //     }
  //   }

  //   // ================= RETRAIT =================
  //   else {
  //     this.listselectedarticles = this.listselectedarticles.filter(
  //       (a) => a.service.id !== article.service.id
  //     );

  //     article.selected = false;
  //   }

  //   // ================= FINAL =================
  //   this.depositserv.getSerialNumberByService(article.service.id).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  //   this.actualarticle = article;
  //   this.totalcalculate();
  //   this.search = '';
  //   this.setfocustosearch();
  // }

  // ================= LOAD =================
  async addtocart(article: Articles, index: number = 0) {
    console.log(this.serviceId);

    if (!article || !article.prices || article.prices.length === 0) {
      this.appserv.presentToast(
        'Aucun prix défini pour cet article.',
        'danger'
      );
      return;
    }

    if (!this.defaultmoney?.id) {
      this.appserv.presentToast('Monnaie par défaut non définie.', 'danger');
      return;
    }

    article.index = index;

    const alreadyInCart = this.listselectedarticles.find(
      (a) => a.service.id === article.service.id
    );

    // ================= AJOUT =================
    if (!alreadyInCart) {
      // Trouver prix correspondant à la monnaie active
      const selectedPrice = article.prices.find(
        (p) => p.money_id === this.defaultmoney.id
      );

      // Fallback : prix principal
      const fallbackPrice = article.prices.find((p) => p.principal === 1);

      const finalPrice = selectedPrice || fallbackPrice;

      if (!finalPrice) {
        this.appserv.presentToast(
          'Aucun prix disponible pour cette monnaie.',
          'danger'
        );
        return;
      }

      article.service.selling_qte = 1;
      article.service.price = finalPrice.price;
      article.service.abreviation = finalPrice.abreviation;
      article.service.money_id = finalPrice.money_id;
      article.service.total =
        article.service.price * article.service.selling_qte;

      article.subservices = [];
      article.selected = true;

      // ===== Gestion stock =====
      if (article.service.type === '1') {
        if (article.service.available_qte > 0) {
          this.listselectedarticles.push(article);
        } else {
        }
      }
    }

    // ================= RETRAIT =================
    else {
      this.listselectedarticles = this.listselectedarticles.filter(
        (a) => a.service.id !== article.service.id
      );

      article.selected = false;
    }

    this.depositserv
      .getSerialNumberByService(this.serviceId, this.perPageSerialNumber)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          const data = res.data;

          this.serialsList = data.data.map((s: any) => ({
            ...s,
            selected: false,
          }));

          this.filteredSerials = [...this.serialsList];

          this.currentPage = data.current_page;
          this.nextPageUrl = data.next_page_url;
          this.prevPageUrl = data.prev_page_url;
          this.totalSerialNumberBySerice = data.total;
          this.autoSelectSerials();
        },
        error: (err) => console.log(err),
      });
    this.actualService = article;
  }

  autoSelectSerials() {
    if (!this.quantity || this.quantity <= 0) return;
    if (this.serialsList.length < this.quantity && this.nextPageUrl) {
      this.nextPage();
      return;
    }

    this.serialsList.forEach((s) => (s.selected = false));

    this.serialsList
      .slice(0, this.quantity)
      .forEach((s) => (s.selected = true));
  }

  toggleSerial(serial: any) {
    serial.selected = !serial.selected;
  }

  filterSerials() {
    const val = this.search.toLowerCase();

    this.filteredSerials = this.serialsList.filter((s) =>
      s.serial_number.toLowerCase().includes(val)
    );
  }

  nextPage() {
    if (!this.nextPageUrl) return;
    this.currentPage++;
    const index = this.listarticles.findIndex(
      (a) => a.service.id === this.actualService.service.id
    );
    this.actualService.selected = true;
    this.addtocart(this.actualService, index);
  }

  prevPage() {
    if (this.currentPage === 1) return;
    this.currentPage--;
    const index = this.listarticles.findIndex(
      (a) => a.service.id === this.actualService.service.id
    );
    this.actualService.selected = true;
    this.addtocart(this.actualService, index);
  }

  validateSelection() {
    console.log(this.listselectedarticles);
  }

  // async addtocart(article: Articles, index: number = 0) {
  //   console.log(article);
  //   // article.service.price=article.prices.filter(p=>p.principal===1)[0].price;
  //   // console.log(article);
  //   article.index = index;
  //   const ifexists = this.listselectedarticles.indexOf(article);

  //   if (
  //     ifexists === -1 &&
  //     this.listselectedarticles.filter(
  //       (a) => a.service.id == article.service.id
  //     ).length == 0
  //   ) {
  //     article.service.selling_qte = 1;
  //     article.service.price = article.prices.filter(
  //       (p) => p.money_id === this.defaultmoney.id
  //     )[0].price;
  //     article.service.abreviation = article.prices.filter(
  //       (p) => p.money_id === this.defaultmoney.id
  //     )[0].abreviation;
  //     article.service.money_id = article.prices.filter(
  //       (p) => p.money_id === this.defaultmoney.id
  //     )[0].money_id;
  //     if (article.service.type == '1') {
  //       if (article.service.available_qte > 0) {
  //         article.selected = true;
  //         article.service.total = article.price * article.service.selling_qte;
  //         article.index = index;
  //         article.subservices = [];
  //         this.listselectedarticles.push(article);
  //         this.search = '';
  //       } else {
  //         if (this.canPrintProforma) {
  //           article.selected = true;
  //           article.service.total = article.price * article.service.selling_qte;
  //           article.index = index;
  //           article.subservices = [];
  //           this.listselectedarticles.push(article);
  //         } else {
  //           const alert = await this.appserv.alertctrl.create({
  //             header: 'Stock insuffisant',
  //             message: `Quantité insuffisante. Voulez-vous approvisionner l'article?`,
  //             mode: 'ios',
  //             buttons: [
  //               { text: 'Non', role: 'cancel' },
  //               {
  //                 text: 'Oui',
  //                 handler: async () => {
  //                   this.addstockhistory(article.service, index);
  //                 },
  //               },
  //             ],
  //           });
  //           if (this.appserv.permissionFilter('stock', 'entry')) {
  //             alert.present();
  //           }
  //         }
  //       }
  //     } else {
  //       article.selected = true;
  //       article.service.total = article.price * article.service.selling_qte;
  //       article.index = index;
  //       article.subservices = [];
  //       this.listselectedarticles.push(article);
  //     }
  //     this.totalcalculate();
  //   } else {
  //     this.listselectedarticles = this.listselectedarticles.filter(
  //       (s) => s != article
  //     );
  //     article.selected = false;
  //     this.totalcalculate();
  //     // // this.listselectedarticles=this.listselectedarticles.filter(a=>a!=article);
  //   }
  //   this.actualarticle = article;
  //   this.search = '';
  //   this.setfocustosearch();
  // }

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
            // this.addtocart(article, index);
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
  removefromlist(article: any) {
    if (!article) return;

    const index = this.listselectedarticles.findIndex(
      (x: any) => x?.service?.id === article?.service?.id
    );

    if (index > -1) {
      this.listselectedarticles.splice(index, 1);
    }

    if (this.actualarticle?.service?.id === article?.service?.id) {
      this.actualarticle = null;
      this.actualService = {};
      this.NbrServiceSerrialNumber = 0;
      this.filteredSerials = [];
      this.serviceId = null;
      this.totalSerialNumberBySerice = 0;
    }

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
      component: UserpickerforsaleComponent,
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
    if (accounts.status === 200 && accounts.message === 'success') {
      this.memberAccounts = accounts.data;
    }
  }

  async detailsCustomer(actualcustomer: Customers) {
    const modal = await this.appserv.modalCtrl.create({
      component: InfoscustomerComponent,
      componentProps: { customersent: actualcustomer },
      cssClass: 'modal-border-radius-20',
    });
    (await modal).present();
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

  IncreaseDecreaseSelection() {
    if (!this.actualarticle || !this.actualarticle.service?.id) {
      this.appserv.presentToast(
        'Veuillez d’abord sélectionner un article.',
        'warning'
      );
      return;
    }

    const wanted = Number(this.NbrServiceSerrialNumber || 0);
    const available = Number(this.actualarticle?.service?.available_qte || 0);

    // synchro article/service courant
    this.actualService = this.actualarticle;
    this.serviceId = this.actualarticle.service.id;
    this.totalSerialNumberBySerice = available;

    if (wanted <= 0) {
      this.actualarticle.serial_numbers = [];
      this.actualService.serial_numbers = [];
      this.actualarticle.service.selling_qte = 0;

      const currentIndex = this.listselectedarticles.findIndex(
        (x: any) => x?.service?.id === this.actualarticle?.service?.id
      );

      if (currentIndex > -1) {
        this.listselectedarticles[currentIndex] = this.actualarticle;
      }

      this.totalcalculate();
      return;
    }

    if (wanted > available) {
      this.appserv.presentToast(
        'Solde insuffisant des numéros de serie',
        'warning'
      );
      return;
    }

    this.depositserv
      .getSerialNumberByServiceLimited({
        service_id: this.serviceId,
        limit: wanted,
      })
      .subscribe({
        next: (res) => {
          if (res.status === 200 && res.message === 'success') {
            const serials = Array.isArray(res.data) ? res.data : [];

            // mettre les serials sur l’article courant
            this.actualarticle.serial_numbers = serials;
            this.actualService.serial_numbers = serials;

            // quantité métier = nombre de serials
            this.actualarticle.service.selling_qte = serials.length;

            // mettre à jour l’article dans le panier multi-items
            const existingIndex = this.listselectedarticles.findIndex(
              (x: any) => x?.service?.id === this.actualarticle?.service?.id
            );

            if (existingIndex === -1) {
              this.listselectedarticles.push(this.actualarticle);
            } else {
              this.listselectedarticles[existingIndex] = this.actualarticle;
            }

            // facultatif : garder une liste locale pour affichage rapide
            this.filteredSerials = [...serials];

            // garder le champ quantité aligné sur la vraie quantité obtenue
            this.NbrServiceSerrialNumber = serials.length;

            this.totalcalculate();
          } else {
            this.appserv.presentToast(
              'Impossible de trouver les numéros de serie appropriés.',
              'danger'
            );
          }
        },
        error: (err) => {
          this.appserv.presentToast(
            'Impossible de trouver les numéros de serie appropriés.',
            'danger'
          );
          console.log(err);
        },
      });
  }
  getCustomerDisplayName(): string {
    if (!this.actualcustomer) return '';

    return (
      this.actualcustomer.name ||
      this.actualcustomer.user_name ||
      this.actualcustomer.user_name ||
      this.actualcustomer.user_phone ||
      ''
    );
  }

  async openCollectorModal() {
    await this.pickmember();
  }

  getSelectedSerialNumbers(): any[] {
    if (!this.actualarticle || !this.actualarticle.serial_numbers) {
      return [];
    }

    return this.actualarticle.serial_numbers;
  }

  getPreviewUnitPrice(): number {
    if (!this.actualarticle || !this.actualarticle.service) {
      return 0;
    }

    return Number(this.actualarticle.service.price || 0);
  }

  getPreviewTotal(): number {
    const unitPrice = this.getPreviewUnitPrice();
    const qty = this.getSelectedSerialNumbers().length;

    return unitPrice * qty;
  }

  clearCurrentSelection() {
    if (!this.actualarticle) return;

    this.actualarticle.serial_numbers = [];
    this.actualarticle.service.selling_qte = 0;
    this.NbrServiceSerrialNumber = 0;

    const index = this.listselectedarticles.findIndex(
      (x: any) => x?.service?.id === this.actualarticle?.service?.id
    );

    if (index > -1) {
      this.listselectedarticles[index] = this.actualarticle;
    }

    this.totalcalculate();
  }

  isArticleSelected(article: any): boolean {
    if (!article || !this.listselectedarticles) return false;

    return this.listselectedarticles.find(
      (x: any) => x?.service?.id === article?.service?.id
    )
      ? true
      : false;
  }
  openMobileCatalog() {
    this.mobileCatalogOpen = true;

    setTimeout(() => {
      this.input?.setFocus();
    }, 250);
  }

  closeMobileCatalog() {
    this.mobileCatalogOpen = false;
  }
}
