import { Injectable } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ModalController,
  ToastController,
  ActionSheetController,
  AlertController,
  LoadingController,
  Platform,
  NavController,
} from '@ionic/angular';
import { Users } from '../interfaces/users';
import { PricesCategories } from '../interfaces/pricescategories';
import { Share } from '@capacitor/share';
import { FormBuilder } from '@angular/forms';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { ReportsalesComponent } from '../articles/reportsales/reportsales.component';
import { Enterprise } from '../interfaces/enterprise';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { FileSharer } from '@byteowls/capacitor-filesharer';
import { DatepickerComponent } from '../reports/datepicker/datepicker.component';
import { ScanbarcodeComponent } from '../articles/scanbarcode/scanbarcode.component';
import { Invoice } from '../interfaces/invoices';
import { PosPrintingOptions } from '../interfaces/posprintingoptions';
import { Money } from '../interfaces/money';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';
import { Tubs } from '../interfaces/tubs';
import { Mouvement } from '../interfaces/mouvement';
import { TransfertFound } from '../interfaces/transfert';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { PermissionsStorageService } from './permissions-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppservicesService {
  @ViewChild('invoice') invoiceElement!: ElementRef;
  private dataSubject = new BehaviorSubject<any>({});
  data$ = this.dataSubject.asObservable();
  printersetup: PosPrintingOptions = {};
  posprinterformat: any;
  isModalSecurityChanged = false;
  public connectedDevices: ScanResult[] = [];

  public apiUrl = environment.laravelServerApiUrl;
  public srcImgUrl = environment.laravelSrcImgUrl;
  public imgUrl: string = environment.laravelImgUrl;
  public urlimgupload = environment.laravelUrlImgUpload;
  public memberApiUrl = environment.memberApiUrl;

  public actualUser: Users = {};
  public actualEse: any;
  public today = new Date();
  public year = this.today.getFullYear();
  public month = this.today.getMonth();
  public firstdayofmonth: string = new Date(this.year, this.month, 1)
    .toISOString()
    .split('T')[0];
  public lastdayofmonth: string = new Date(this.year, this.month + 1, 0)
    .toISOString()
    .split('T')[0];
  localApiUrl = '';
  isConnected: boolean = false;
  showLoader = true;
  pdfojb = null;
  defaultmoney: Money = {};
  shouldrefreshlist = false;
  public internet: any;
  public localpassword = 'Cero-Admin@127.0.0.1=>8000=>password';
  public counter = 0;
  public version = 'Weka Akiba V.0.1';
  showtext = true;
  showsearchwelcome = false;
  homeCards = [
    {
      category: '💳 Fintech & Transactions',
      items: [
        {
          name: 'Vente carnets',
          router: '/uzisha/notebook-sales',
          icon: 'cart',
          bgClass: 'bg-fintech',
          permission: { module: 'facturation', action: 'view' },
        },
         {
          name: 'Transactions',
          router: '/uzisha/transactions',
          icon: 'send-outline',
          bgClass: 'bg-bank',
          permission: { module: 'transactions', action: 'view' },
        },
        {
          name: 'Vente virtuel',
          router: '/uzisha/virtualsales',
          icon: 'send-outline',
          bgClass: 'bg-bank',
          permission: { module: 'transactions', action: 'salevirtual' },
        },
        {
          name: 'Transfert',
          router: '/uzisha/wekatransfertfound',
          icon: 'send-outline',
          bgClass: 'bg-bank',
          // permission: { module: 'transactions', action: 'transfert' },
        },
        {
          name: 'Historique transactions',
          router: '/uzisha/generalreport',
          icon: 'thumbs-up-outline',
          bgClass: 'bg-bank',
          permission: { module: 'transactions', action: 'view' },
        },
        {
          name: 'Limites transactions',
          router: '/uzisha/transactions-limit',
          icon: 'wallet',
          bgClass: 'bg-fintech',
          permission: { module: 'transactions', action: 'limits' },
        },
        {
          name: 'Villes',
          router: '/uzisha/cities',
          icon: 'swap-horizontal-outline',
          bgClass: 'bg-fintech',
          permission: { module: 'cities', action: 'view' },
        },
      ],
    },

    {
      category: '👥 Gestion du personnel',
      items: [
        {
          name: 'Membres',
          router: '/uzisha/agents',
          icon: 'people',
          bgClass: 'bg-cyber',
          permission: { module: 'agents', action: 'view' },
        },
        {
          name: 'Avances',
          router: '/uzisha/salariesadvancesview',
          icon: 'accessibility-outline',
          bgClass: 'bg-cyber',
          permission: { module: 'agents', action: 'advancesalaries' },
        },
        {
          name: 'Groupes',
          router: '/uzisha/groups',
          icon: 'people-circle-outline',
          bgClass: 'bg-cyber',
          permission: { module: 'agents', action: 'groups_view' },
        },
        {
          name: 'Départements',
          router: '/uzisha/departements',
          icon: 'briefcase-outline',
          bgClass: 'bg-cyber',
          permission: { module: 'departements', action: 'view' },
        },
      ],
    },

    {
      category: '🏦 Comptabilité & Finances',
      items: [
        {
          name: 'Caisses',
          router: '/uzisha/tubs',
          icon: 'book-outline',
          bgClass: 'bg-bank',
          permission: { module: 'caisses', action: 'view' },
        },
        {
          name: 'Finances',
          router: '/uzisha/wekaadmindashboard',
          icon: 'stats-chart-outline',
          bgClass: 'bg-bank',
          permission: { module: 'rapports', action: 'finance-dashboard' },
        },
        {
          name: 'Dépenses',
          router: '/uzisha/expenditures',
          icon: 'cash-outline',
          bgClass: 'bg-bank',
          permission: { module: 'depenses', action: 'view' },
        },
        {
          name: 'Clôtures',
          router: '/uzisha/finances/fences',
          icon: 'stats-chart-outline',
          bgClass: 'bg-bank',
          permission: { module: 'clotures', action: 'view' },
        },
        {
          name: 'Credits',
          router: '/uzisha/credits',
          icon: 'stats-chart-outline',
          bgClass: 'bg-bank',
          permission: { module: 'credits', action: 'view' },
        },
        {
          name: 'Clôtures Mensuelles',
          router: '/uzisha/snapshots',
          icon: 'briefcase-outline',
          bgClass: 'bg-cyber',
          permission: { module: 'snapshots', action: 'view' },
        },
        {
          name: 'Politique de Répartition des Revenus',
          router: '/uzisha/rules',
          icon: 'briefcase-outline',
          bgClass: 'bg-cyber',
          permission: { module: 'snapshots', action: 'view' },
        },
      ],
    },

    {
      category: '🚀 Outils & Sponsoring',
      items: [
        // {
        //   name: 'Sponsoring',
        //   router: '/uzisha/sponsoring',
        //   icon: 'paw-outline',
        //   bgClass: 'bg-nasa',
        //   permission: { module: 'sponsoring', action: 'view' },
        // },
        {
          name: 'Rapports',
          router: '/uzisha/reports',
          icon: 'bar-chart-outline',
          bgClass: 'bg-nasa',
          permission: { module: 'rapports', action: 'view' },
        },
        {
          name: 'Paiement collecteurs',
          router: '/uzisha/agents-bonuses',
          icon: 'bar-chart-outline',
          bgClass: 'bg-nasa',
          // permission: { module: 'bonuses', action: 'view' },
        },
      ],
    },

    {
      category: '🛡️ Administration & Sécurité',
      items: [
        {
          name: 'Permissions',
          router: '/uzisha/permissions',
          icon: 'key',
          bgClass: 'bg-cyber',
          permission: { module: 'permissions', action: 'view' },
        },
        {
          name: 'Taux de change',
          router: '/uzisha/exchanges',
          icon: 'key',
          bgClass: 'bg-cyber',
          permission: { module: 'exchanges', action: 'view' },
        },
        {
          name: 'apkcdnupload',
          router: '/uzisha/apkcdnupload',
          icon: 'key',
          bgClass: 'bg-cyber',
          permission:{ module: 'apkcdnupload', action: 'view' },
        },
      ],
    },
    {
      category: '📦 Gestion & Exploitation',
      items: [
        {
          name: 'Carnets',
          router: '/uzisha/articles/catalogue',
          icon: 'document-outline',
          bgClass: 'bg-stock',
          permission: { module: 'produits', action: 'view' },
        },
        {
          name: 'Stock',
          router: '/uzisha/stock',
          icon: 'layers-outline',
          bgClass: 'bg-stock',
          permission: { module: 'stock', action: 'view' },
        },
        {
          name: 'Dépôts',
          router: '/uzisha/deposits',
          icon: 'layers-outline',
          bgClass: 'bg-stock',
          permission: { module: 'depots', action: 'view' },
        }
      ],
    },
    {
      category: '🛡️ Administration & Système',
      items: [
        {
          name: 'Entreprise',
          router: '/uzisha/enterprises',
          icon: 'business-outline',
          bgClass: 'bg-corporate',
          permission: { module: 'entreprise', action: 'view' },
        },
        {
          name: 'Marges dépenses',
          router: '/uzisha/settingmargins',
          icon: 'reader-outline',
          bgClass: 'bg-admin',
          permission: { module: 'settingmargins', action: 'view' },
        },
        {
          name: 'Frais de transactions',
          router: '/uzisha/transaction-fees',
          icon: 'reader-outline',
          bgClass: 'bg-admin',
          permission: { module: 'transaction_fees', action: 'view' },
        },
        {
          name: 'Premiere mise',
          router: '/uzisha/firstentries',
          icon: 'reader-outline',
          bgClass: 'bg-admin',
          // permission: { module: 'accounts', action: 'first_entries' },
        }
      ],
    },
  ];

  constructor(
    public route: Router,
    public formbuild: FormBuilder,
    private toastCtrl: ToastController,
    public http: HttpClient,
    public modalCtrl: ModalController,
    public actionsheetctrl: ActionSheetController,
    public alertctrl: AlertController,
    public loadctrl: LoadingController,
    public plateform: Platform,
    public navCtrl: NavController,
    public permissionStorageServ: PermissionsStorageService
  ) {
    // this.getapiurl();
  }

  async smartBack(fallbackUrl: string = '/uzisha') {
    const topModal = await this.modalCtrl.getTop();

    if (topModal) {
      await this.modalCtrl.dismiss();
    } else if (window.history.length > 1) {
      this.navCtrl.back();
    } else {
      this.navCtrl.navigateRoot(fallbackUrl);
    }
  }
  mergeWithPreservedOrigin<T>(origin: T, given: Partial<T>): T {
    const result: any = {};

    for (const key in given) {
      result[key] = given[key];
    }

    for (const key in origin) {
      if (!(key in given)) {
        result[key] = origin[key];
      }
    }

    origin = result;

    return result;
  }

  updateData(newData: any) {
    const currentData = this.dataSubject.getValue();
    const merged = this.mergeWithPreservedOrigin(currentData, newData);
    this.dataSubject.next(merged);
  }

  async loadpermissionsfromAPI() {
    this.ungroupedPermissionsForUser(this.getactualuser()?.id).subscribe({
      next: async (response) => {
        if (response.status === 200 && response.message === 'success') {
          await this.permissionStorageServ.updatePermissions(response.data);
        } else {
          console.log('error on loading permissions');
        }
      },
      error: (err) => {
        console.log('error on loading permissions=>', err);
      },
    });
  }

  ungroupedPermissionsForUser(user: number): Observable<any> {
    return this.http.get<any>(
      this.apiUrl + '/permissons/ungrouped/foruser/' + user
    );
  }
  /**
   *
   * Data Encryptions methods
   */
  base64ToBytes(base64): any {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
  }

  bytesToBase64(bytes): string {
    const binString = Array.from(bytes, (byte: any) =>
      String.fromCodePoint(byte)
    ).join('');
    return btoa(binString);
  }

  setbytesToBase64(text: string) {
    const response = this.bytesToBase64(new TextEncoder().encode(text));
    // console.log('text to base64 :'+text,response);
    return response;
  }

  getbase64ToBytes(base64content: any) {
    const response = new TextDecoder().decode(
      this.base64ToBytes(base64content)
    );
    return response;
  }

  /**
   *
   * End data encryptions methods
   */
  defaultdate() {
    return new Date().toISOString().substring(0, 10);
  }

  isMyDeviceConnected() {
    let value: boolean;
    const records = localStorage.getItem('online');
    if (records !== null) {
      value = JSON.parse(records);
    }
    return true;
  }

  ChangeConnectivity(data: boolean) {
    localStorage.setItem('online', JSON.stringify(data));
  }

  getlocalserversetup() {}

  enterpriseslist() {
    return this.http.get<any>(this.apiUrl + '/enterprises');
  }

  myTubs(
    user: any,
    filters?: { type?: string; status?: string }
  ): Observable<Tubs[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.type) {
        params = params.set('type', filters.type);
      }

      if (filters.status) {
        params = params.set('status', filters.status);
      }
    }

    return this.http.get<Tubs[]>(this.apiUrl + '/funds/mines/' + user, {
      params,
    });
  }

  myfunds(user: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/users/${user}/funds`);
  }

  newtubapi(tub: Tubs): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/funds', tub);
  }

  editTubapi(tub: Tubs): Observable<Tubs> {
    return this.http.patch<Tubs>(this.apiUrl + '/funds/update/' + tub.id, tub);
  }
  resetTub(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/funds/reset', data);
  }
  deleteTubapi(tubid) {
    return this.http.delete(this.apiUrl + '/funds/delete/' + tubid);
  }
  deleterequesthistory(data: any): Observable<any> {
    return this.http.delete<any>(
      this.apiUrl + '/request_history/delete/' + data.id,
      data
    );
  }
  getlistmouvementsbyfund(id: number): Observable<Mouvement[]> {
    return this.http.get<Mouvement[]>(
      this.apiUrl + '/request_history/byfund/' + id
    );
  }
  //Transfert Founds
  newtransfert(data: any): Observable<TransfertFound> {
    return this.http.post<TransfertFound>(
      this.apiUrl + '/transfertfound',
      data
    );
  }

  goBack() {
    this.navCtrl.back();
  }
  newoperation(mouv: Mouvement): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/request_history/new', mouv);
  }

  getTransfertForaTub(data: any): Observable<TransfertFound[]> {
    return this.http.post<TransfertFound[]>(
      this.apiUrl + '/transfertfound/tubsender',
      data
    );
  }

  getalltransfert(data: any): Observable<TransfertFound[]> {
    return this.http.get<TransfertFound[]>(
      this.apiUrl + '/transfertfound/enterprise/' + data
    );
  }

  deletetransfer(data: any): Observable<any> {
    return this.http.delete<any>(
      this.apiUrl + '/transfertfound/delete/' + data.id,
      data
    );
  }

  numberToLetters(nombre) {
    const unite = [
      '',
      'un',
      'deux',
      'trois',
      'quatre',
      'cinq',
      'six',
      'sept',
      'huit',
      'neuf',
    ];
    const dizaine = [
      '',
      'dix',
      'vingt',
      'trente',
      'quarante',
      'cinquante',
      'soixante',
      'soixante-dix',
      'quatre-vingt',
      'quatre-vingt-dix',
    ];
    const millieme = [
      '',
      'mille',
      'deux milles',
      'trois milles',
      'quatre milles',
      'cinq milles',
      'six milles',
      'sept milles',
      'huit milles',
      'neuf milles',
      'dix milles',
    ];

    if (nombre === 0) {
      return 'zéro';
    }

    if (nombre < 0 || nombre > 999) {
      return '';
    }

    let resultat = '';

    // Traitement des centaines
    const centaines = Math.floor(nombre / 100);
    if (centaines > 0) {
      resultat += unite[centaines] + ' cent ';
      nombre %= 100;
    }

    // Traitement des dizaines
    const dizaines = Math.floor(nombre / 10);
    const unitesRestantes = nombre % 10;

    if (dizaines > 1) {
      resultat += dizaine[dizaines];
      if (unitesRestantes > 0) {
        resultat += '-' + unite[unitesRestantes];
      }
    } else if (dizaines === 1) {
      resultat += dizaine[10 + unitesRestantes];
    } else if (unitesRestantes > 0) {
      resultat += unite[unitesRestantes];
    }

    return resultat.trim();
  }

  numberToLetters2(num) {
    const a = [
      '',
      'un',
      'deux',
      'trois',
      'quatre',
      'cinq',
      'six',
      'sept',
      'huit',
      'neuf',
      'dix',
      'onze',
      'douze',
      'treize',
      'quatorze',
      'quinze',
      'seize',
      'dix-sept',
      'dix-huit',
      'dix neuf',
    ];
    const b = [
      '',
      '',
      'vingt',
      'trente',
      'quarante',
      'cinquante',
      'soixante',
      'septante',
      'quatre-vingt',
      'nonante',
    ];

    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num)
      .substring(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    console.log(n);
    if (!n) return null;

    let str = '';
    str +=
      n[1] != '0'
        ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore'
        : '';
    str +=
      n[2] != '0'
        ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh'
        : '';
    str +=
      n[3] != '0'
        ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'mille'
        : '';
    str +=
      n[4] != '0'
        ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'cent'
        : '';
    str +=
      n[5] != '0'
        ? (str != '' ? 'et' : '') +
          (a[Number(n[5])] || b[n[5][0]] + a[n[5][1]]) +
          'only'
        : 'only';

    return str == 'only' ? '' : str.toUpperCase();
  }

  setfocus(el: string) {
    document.getElementById(`${el}`).focus();
  }

  getDateTime() {
    let data =
      this.today.getFullYear() +
      '-' +
      this.today.getMonth() +
      '-' +
      this.today.getDay() +
      ':' +
      this.today.getHours() +
      ':' +
      this.today.getMinutes() +
      ':' +
      this.today.getSeconds();
    return data;
  }
  getUUID(criteria: string) {
    let min = 1,
      max = 10;
    let min2 = 10,
      max2 = 20;
    let data =
      criteria +
      this.today.getFullYear() +
      this.today.getUTCMonth() +
      this.today.getUTCDay() +
      '.' +
      this.today.getMinutes() +
      this.today.getSeconds() +
      '.' +
      'C' +
      (Math.floor(Math.random() * (max - min + 1)) + min) +
      (Math.floor(Math.random() * (max2 - min2 + 1)) + min2);
    return data;
  }

  isEseActivated() {
    return this.actualEse.status === 'enabled' ? true : false;
  }

  setDefaultMoney(money: any) {
    const data: any[] = [money];
    localStorage.setItem('newmoneys', OrbitEncoder.encode(data));
  }

  getDefaultmoney() {
    let data: any[] = [];
    const records = localStorage.getItem('newmoneys');
    if (records !== null) {
      data = OrbitEncoder.decode(records);
    }
    const response = data.find((m) => m.principal == 1);
    if (response) {
      this.defaultmoney = response;
    }
    return this.defaultmoney;
  }

  /**
   * general methods
   */
  async getDatesForm() {
    let dateFrom = '';
    let dateTo = '';
    const modal = await this.periodicfilter();
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'selected') {
      dateFrom = data.from;
      dateTo = data.to;
    }
    return { from: dateFrom, to: dateTo };
  }
  async SetDefaultPrinterConfig() {
    //setup printer
    this.printersetup.adresse = true;
    this.printersetup.autorisation_fct = true;
    this.printersetup.category = true;
    this.printersetup.description = true;
    this.printersetup.logo = true;
    this.printersetup.mail = true;
    this.printersetup.name = true;
    this.printersetup.national_identification = true;
    this.printersetup.num_impot = true;
    this.printersetup.phone = true;
    this.printersetup.rccm = true;
    this.printersetup.uuid = true;
    this.printersetup.vat_rate = true;
    this.printersetup.website = false;
    this.printersetup.customerName = true;
    this.printersetup.netToPay = true;
    this.printersetup.totalht = true;
    this.printersetup.back = false;
    this.printersetup.reduction = false;
    this.printersetup.invoicefooter = true;
    this.printersetup.totalPoints = true;
    this.printersetup.tva = true;

    localStorage.setItem('printersetup', JSON.stringify(this.printersetup));

    //format printer
    localStorage.setItem('posprinterformat', 'pos');
  }

  getDefaultPrinterConfig() {
    //setup printer
    const records = localStorage.getItem('printersetup');
    if (records !== null) {
      this.printersetup = JSON.parse(records);
    } else {
      this.SetDefaultPrinterConfig();
    }
    return this.printersetup;
  }

  getDefaultFormatPrinter() {
    //format printer
    const records = localStorage.getItem('posprinterformat');
    if (records !== null) {
      this.posprinterformat = records;
    } else {
      this.SetDefaultPrinterConfig();
    }
    return this.posprinterformat;
  }

  restOfflineData() {
    localStorage.removeItem('syncingInvoices');
    localStorage.removeItem('syncingStockHistories');
    localStorage.removeItem('syncingPayments');
    localStorage.removeItem('syncingDebts');
    localStorage.removeItem('syncingCustomers');
    localStorage.removeItem('syncingExpenditures');
    localStorage.removeItem('syncingEntries');
  }
  /**
   * BarcodeScanner
   */
  async startScan() {
    const modal = await this.modalCtrl.create({
      component: ScanbarcodeComponent,
    });
    return modal;
  }

  printA4invoice(invoice: Invoice, services) {
    const docdef = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [20, 10, 40, 60],
      content: [
        {
          fontSize: 12,
          alignement: 'justify',
          columns: [
            { text: `${this.getactualEse().name} \n \n`, style: 'header' },
            { qr: 'her will be the id of the invoice', alignment: 'right' },
          ],
        },
        {
          text: `FACTURE DE VENTE`,
          style: 'header underline',
          fontSize: 20,
        },
        {
          text: '------',
          style: 'line',
        },
        {
          columns: [
            {
              text: `${this.getactualEse().adresse},${
                this.getactualEse().description
              },${this.getactualEse().rccm},${
                this.getactualEse().national_identification
              },${this.getactualEse().phone}`,
              style: 'lowercase',
              alignment: 'left',
            },
            {
              text: `NUMERO FACTURE ${invoice.id} \n ORDRE ${
                invoice.id
              } \n Imprimée le ${this.today.toLocaleDateString(
                'fr'
              )} à ${this.today.getHours()}h ${this.today.getMinutes()}min ${this.today.getSeconds()}s \n \n`,
              bold: true,
              alignment: 'right',
            },
          ],
        },
        {
          alignement: 'left',
          columns: [
            [
              { text: 'INFORMATIONS CLIENT \n \n', style: 'defaultbackground' },
              {
                columns: [
                  [
                    { text: 'NOM CLIENT', fillColor: '#eeeee' },
                    { text: `${invoice.customer.customerName}` },
                  ],
                  [
                    { text: 'ADRESSE' },
                    { text: `${invoice.customer.adress}` },
                    { text: `Tél.${invoice.customer.phone} \n \n` },
                  ],
                ],
              },
            ],
            [
              { text: 'PAIEMENT & LIVRAISON \n \n', alignment: 'right' },
              {
                text: 'Mode de paiement \n \n',
                alignment: 'right',
              },
              { text: 'Mode de livraison \n \n', alignment: 'right' },
            ],
          ],
        },
        {
          table: {
            widths: [20, 300, '*', '*', '*'],
            headerRows: 1,
            body: [
              [
                {
                  bold: true,
                  style: 'defaultbackground',
                  border: [false, false, false, false],
                  text: 'N°',
                },
                {
                  bold: true,
                  style: 'defaultbackground',
                  border: [false, false, false, false],
                  text: 'Désignation',
                },
                {
                  bold: true,
                  style: 'defaultbackground',
                  border: [false, false, false, false],
                  text: 'Qté',
                },
                {
                  bold: true,
                  style: 'defaultbackground',
                  border: [false, false, false, false],
                  text: 'P.U',
                },
                {
                  bold: true,
                  style: 'defaultbackground',
                  border: [false, false, false, false],
                  text: 'Total',
                },
              ],

              // [services],
              [
                {
                  border: [false, false, false, false],
                  text: 'SOUS TOTAL',
                  colSpan: 4,
                  alignment: 'right',
                },
                {},
                {},
                {},
                { border: [false, false, false, false], text: '250000' },
              ],
              [
                {
                  border: [false, false, false, false],
                  text: 'TVA',
                  colSpan: 4,
                  alignment: 'right',
                },
                {},
                {},
                {},
                { border: [false, false, false, false], text: '250000' },
              ],
              [
                {
                  border: [false, false, false, false],
                  text: 'REDUCTION',
                  colSpan: 4,
                  alignment: 'right',
                },
                {},
                {},
                {},
                { border: [false, false, false, false], text: '250000' },
              ],
              [
                {
                  border: [false, false, false, false],
                  text: 'TOTAL HT',
                  colSpan: 4,
                  alignment: 'right',
                },
                {},
                {},
                {},
                { border: [false, false, false, false], text: '250000' },
              ],
              [
                {
                  border: [false, false, false, false],
                  text: 'NET A PAYER',
                  colSpan: 4,
                  alignment: 'right',
                  bold: true,
                  fontSize: 14,
                },
                {},
                {},
                {},
                {
                  border: [false, false, false, false],
                  fillColor: '#0xF3A082',
                  text: '250000',
                },
              ],
            ],
          },
        },
        {
          text: '\n \n',
        },
        {
          text: `${this.getactualEse().invoicefooter}`,
          style: 'footer',
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'left',
        },
        underline: {
          decoration: 'underline',
          lineHeight: 2,
        },
        subheader: {
          fontSize: 14,
        },
        footerdate: {
          alignment: 'center',
        },
        footer: {
          alignment: 'center',
          fontSize: 9,
          bold: true,
          padding: 10,
          widths: 100,
          fillColor: '#0xF3A082',
        },
        lowercase: {},
        line: {
          color: '#0xF3A082',
          bold: true,
          fontSize: 30,
          widths: 300,
        },
        defaultbackground: {
          fillColor: '#0xF3A082',
        },
      },
    };
    this.pdfojb = pdfMake.createPdf(docdef);
    return this.pdfojb;
  }
  async printinvoice(pdfojb: any, filenamesent: string) {
    // window.open();

    const EseName = this.getactualEse().name.replace(' ', '');
    const filename = `${filenamesent}_${EseName}_${this.today.toLocaleDateString()}.${this.today.getMilliseconds()}.pdf`;

    const actionsheet = await this.actionsheetctrl.create({
      header: 'Voulez-vous?',
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Partager',
          handler: async () => {
            //getting base64 format and share
            pdfojb.getBase64((base64) => {
              FileSharer.share({
                filename: `${filename}`,
                base64Data: base64,
                contentType: 'application/pdf',
              });
            });
          },
        },
        {
          text: 'Télecharger',
          handler: () => {
            if (this.plateform.is('hybrid')) {
              //getting base64 format and share
              pdfojb.getBase64((base64) => {
                FileSharer.share({
                  filename: `${filename}`,
                  base64Data: base64,
                  contentType: 'application/pdf',
                });
              });
            } else {
              pdfojb.download(`${filename}`);
              this.presentToast(`Fichier télechargé avec succès`, 'success');
            }
          },
        },
        {
          text: 'Ouvrir',
          handler: () => {
            if (this.plateform.is('hybrid')) {
            } else {
              pdfojb.open();
            }
          },
        },
        {
          text: 'Imprimer',
          handler: () => {
            pdfojb.print();
          },
        },
        {
          text: 'Annuler',
          role: 'cancel',
        },
      ],
    });
    actionsheet.present();
  }

  /**
   * action sheet on pdf file
   */
  async pdfaction(pdfojb: any, filenamesent: string) {
    const EseName = this.getactualEse().name.replace(' ', '');
    const filename = `${filenamesent}_${EseName}_${this.today.toLocaleDateString()}.${this.today.getMilliseconds()}.pdf`;

    const actionsheet = await this.actionsheetctrl.create({
      header: 'Voulez-vous?',
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Partager',
          handler: async () => {
            //getting base64 format and share
            pdfojb.getBase64((base64) => {
              FileSharer.share({
                filename: `${filename}`,
                base64Data: base64,
                contentType: 'application/pdf',
              });
            });
          },
        },
        {
          text: 'Télecharger',
          handler: () => {
            if (this.plateform.is('hybrid')) {
              //getting base64 format and share
              pdfojb.getBase64((base64) => {
                FileSharer.share({
                  filename: `${filename}`,
                  base64Data: base64,
                  contentType: 'application/pdf',
                });
              });
            } else {
              pdfojb.download(`${filename}`);
              this.presentToast(`Fichier télechargé avec succès`, 'success');
            }
          },
        },
        {
          text: 'Ouvrir',
          handler: () => {
            if (this.plateform.is('hybrid')) {
            } else {
              pdfojb.open();
            }
          },
        },
        {
          text: 'Imprimer',
          handler: () => {
            pdfojb.print();
          },
        },
        {
          text: 'Annuler',
          role: 'cancel',
        },
      ],
    });
    actionsheet.present();
  }

  /**
   * convert english date in fr
   */
  frdate(englishdate: any) {
    // Parse the date string into a Date object
    var date = new Date(englishdate);
    date.setDate(date.getDate());

    // Convert the date to French format
    var frenchDate = date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });

    return frenchDate;
  }

  /**
   * Periodic filter dates modal
   */
  async periodicfilter() {
    const modal = await this.modalCtrl.create({
      component: DatepickerComponent,
      cssClass: 'modal-border-radius-20',
    });
    return modal;
  }
  /**
   * Excel export method
   */
  exportInToExcel(sheetdata: any, booktype: any, name: string) {
    let EseName = this.getactualEse().name.replace(' ', '');
    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.aoa_to_sheet(sheetdata);
    XLSX.utils.book_append_sheet(workbook, worksheet);
    //sharing file
    let filebase64 = XLSX.write(workbook, {
      type: 'base64',
      bookType: booktype,
    });
    FileSharer.share({
      filename: `${name}_${EseName}.${booktype}`,
      base64Data: filebase64,
      contentType: 'application/vnd.ms-excel',
    });
  }

  /**
   * Pdf maker method
   */
  pdftabledownload(
    tbBody: any,
    title: string,
    subtitle: string,
    pageorientation: string,
    pagesize: string
  ) {
    const docdef = {
      pageSize: pagesize,
      pageOrientation: pageorientation,
      pageMargins: [20, 10, 40, 60],
      content: [
        {
          text: `${this.getactualEse().name}`,
          style: 'header',
        },
        {
          text: `${this.getactualEse().phone}`,
          style: 'header',
        },
        {
          text: `${this.getactualEse().adresse}`,
          style: 'header',
        },
        { text: title, style: 'header', margin: [0, 15] },
        { text: subtitle, margin: [0, 10] },
        {
          text: `Imprimée le ${this.today.toLocaleDateString(
            'fr'
          )} à ${this.today.getHours()}h ${this.today.getMinutes()}min ${this.today.getSeconds()}s`,
          alignment: 'right',
          italics: true,
          fontSize: 9,
          bold: true,
        },
        {
          text: `par ${this.getactualuser().user_name}`,
          alignment: 'right',
          italics: true,
          fontSize: 9,
          bold: true,
          margin: [0, 5],
        },
        {
          table: {
            body: tbBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'left',
        },
        subheader: {
          fontSize: 14,
        },
        footerdate: {
          alignment: 'center',
        },
      },
    };
    this.pdfojb = pdfMake.createPdf(docdef);
    return this.pdfojb;
  }

  exportlinearpdf(
    tbBody: any,
    title: string,
    subtitle: string,
    pageorientation: string,
    pagesize: string
  ) {
    const docdef = {
      pageSize: pagesize,
      pageOrientation: pageorientation,
      pageMargins: [20, 10, 40, 60],
      content: [
        {
          text: `${this.getactualEse().name}`,
          style: 'header',
        },
        {
          text: `${this.getactualEse().phone}`,
          style: 'header',
        },
        {
          text: `${this.getactualEse().adresse}`,
          style: 'header',
        },
        { text: title, style: 'header', margin: [0, 15] },
        { text: subtitle, margin: [0, 10] },
        {
          text: `Imprimée le ${this.today.toLocaleDateString(
            'fr'
          )} à ${this.today.getHours()}h ${this.today.getMinutes()}min ${this.today.getSeconds()}s`,
          alignment: 'right',
          italics: true,
          fontSize: 9,
          bold: true,
        },
        {
          text: `par ${this.getactualuser().user_name}`,
          alignment: 'right',
          italics: true,
          fontSize: 9,
          bold: true,
          margin: [0, 5],
        },
        {
          table: {
            body: tbBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'left',
        },
        subheader: {
          fontSize: 14,
        },
        footerdate: {
          alignment: 'center',
        },
      },
    };
    this.pdfojb = pdfMake.createPdf(docdef);
    return this.pdfojb;
  }

  /**
   * IndexedDb
   */
  getindexdb() {
    let response = { db: '', message: '' };
    const indexedb = window.indexedDB;

    const request = indexedb.open('ceroUzisha', 1);

    request.onerror = (event: any) => {
      console.error(
        `Erreur de création de base de données: ${event.target.errorCode}`
      );
      response.message = 'error';
    };

    request.onsuccess = (event: any) => {
      response.db = event.target.result;
      response.message = 'success';
    };

    return response;
  }

  /**
   * GENERAL METHODS
   */
  async closemodal() {
    this.modalCtrl.dismiss();
  }

  async generalsearch(
    event: any,
    arraylookup: any[],
    key1: any,
    key2?: any,
    key3?: any,
    key4?: any
  ): Promise<any[]> {
    let results: any[] = [];
    const k1 = key1;
    results = arraylookup.filter((k1) => k1.toLowerCase().indexOf(event) > -1);
    return results;
  }

  getconnectdevices() {
    const records = localStorage.getItem('connectedDevices');
    if (records !== null) {
      this.connectedDevices = JSON.parse(records);
    }

    return this.connectedDevices;
  }

  async sharedata(title: any, msg: any, url: any) {
    await Share.share({
      title: title,
      text: msg,
      url: url,
    });
  }

  getactualuser() {
    const records = localStorage.getItem('actualUser');
    if (records !== null) {
      this.actualUser = OrbitEncoder.decode(records);
    }
    return this.actualUser;
  }

  getactualEse() {
    const records = localStorage.getItem('actualEnterprise');
    if (records !== null) {
      this.actualEse = OrbitEncoder.decode(records);
    }

    return this.actualEse;
  }

  getapiurl() {
    const records = localStorage.getItem('apiUrl');
    if (records !== null) {
      this.apiUrl = JSON.parse(records) + '/api';
      this.imgUrl = JSON.parse(records) + '/app/uploads/';
      this.urlimgupload = JSON.parse(records) + '/app/upload.php';
    }

    return this.apiUrl;
  }

  async presentToast(
    msg: string,
    colorsent: string = '',
    positionned: 'top' | 'middle' | 'bottom' = 'bottom'
  ) {
    const toast = await this.toastCtrl.create({
      mode: 'ios',
      position: positionned,
      color: `${colorsent}`,
      buttons: [{ text: 'Annuler' }],
      message: msg,
      duration: 6000,
    });
    toast.present();
  }

  /**
   *
   * USERS
   */
  login(credentials: any): Observable<any> {
    // return this.http.post(`https://reqres.in/api/login`,credentials);
    return this.http.post(`https://reqres.in/api/login`, credentials);
  }

  gotoanypaginationurl(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getusers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/users');
  }
  /**
   * SERVICES / ARTICLES METHODS
   */

  //prices category
  newpricecategory(pricing: any): Observable<PricesCategories> {
    return this.http.post<PricesCategories>(
      this.apiUrl + '/pricescategories',
      pricing
    );
  }

  removepricingfromapi(price: any): Observable<any> {
    return this.http.delete<any>(
      this.apiUrl + '/pricescategories/delete/' + price
    );
  }

  //DOCUMENTS TYPES FOR STOCK HISTORY
  getalllistdocuments(enterpriseid: any): Observable<DocumentType[]> {
    return this.http.get<DocumentType[]>(
      this.apiUrl + '/typesdocuments/enterprise/' + enterpriseid
    );
  }

  addnewdocument(data: any): Observable<DocumentType> {
    return this.http.post<DocumentType>(this.apiUrl + '/typesdocuments', data);
  }

  async getdatesfilter() {
    const modal = this.modalCtrl.create({
      component: ReportsalesComponent,
    });
    (await modal).present();
  }

  setactualenterprise(data: any) {
    try {
      localStorage.setItem('actualEnterprise', OrbitEncoder.encode(data));
    } catch (error) {
      this.presentToast(
        "Impossible de sauvegarder les informations de l'entreprise. Error:" +
          error,
        'warning'
      );
    }
  }

  setactualuser(data: any) {
    try {
      localStorage.setItem('actualUser', OrbitEncoder.encode(data));
    } catch (error) {
      this.presentToast(
        "Impossible de sauvegarder les informations de l'utilisateur. Error:" +
          error,
        'warning'
      );
    }
  }

  setpermission(data: any) {
    const permission = data ?? [];
    localStorage.setItem('permission', JSON.stringify(permission));
  }

  getpermission() {
    let permissions: any[] = [];
    const records = localStorage.getItem('permission');
    if (typeof records !== 'undefined' && records !== null) {
      permissions = JSON.parse(records);
    }
    return permissions;
  }

  permissionFilter(module: string, action: string): boolean {
    const records = this.permissionStorageServ.hasPermission(module, action);
    return records;
  }

  actionVerificationByPermission(actionList, permission, action) {
    if (permission) {
      actionList.push(action);
    }
    return actionList;
  }
}
