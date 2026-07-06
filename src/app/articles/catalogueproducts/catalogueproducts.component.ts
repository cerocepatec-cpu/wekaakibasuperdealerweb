import { StockhistoryComponent } from './../stockhistory/stockhistory.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Articles } from '../../interfaces/articles';
import { AppservicesService } from '../../services/appservices.service';
import { CategoriesArticle } from '../../interfaces/cagoriesarticles';
import { UnitofMeasure } from '../../interfaces/unitofmeasure';
import {
  ActionSheetController,
  IonInput,
  ModalController,
  Platform,
} from '@ionic/angular';
import { NewserviceComponent } from './../newservice/newservice.component';
import { NewcategoryComponent } from './../newcategory/newcategory.component';
import { NewunitofmeasureComponent } from './../newunitofmeasure/newunitofmeasure.component';
import { EditserviceComponent } from './../editservice/editservice.component';
import { InfosServiceComponent } from './../customerpickers/infos-service/infos-service.component';
import { Users } from '../../interfaces/users';
import { ArticlesService } from '../../services/articles.service';
import { CategoryserviceService } from '../../services/categoryservice.service';
import { UnitofmeasureService } from '../../services/unitofmeasure.service';
import { ImportComponent } from '../../import/import.component';
import { articlePaginator } from 'src/app/interfaces/articlespaginator';
import { NewreservationComponent } from 'src/app/newreservation/newreservation.component';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-catalogueproducts',
  templateUrl: './catalogueproducts.component.html',
  styleUrls: ['./catalogueproducts.component.scss'],
})
export class CatalogueproductsComponent implements OnInit {
  @ViewChild('searchinput') searchinput!: IonInput;
  search: any;
  keyword: any;
  keyreservation: any;
  actualuser: Users = {};
  listarticles: any[] = [];
  reservations: any[] = [];
  results: Articles[] = [];
  keptlistarticles: Articles[] = [];
  listselectedarticles: Articles[] = [];
  listcategories: CategoriesArticle[] = [];
  listunitofmeasure: UnitofMeasure[] = [];
  showdefaultprogress = false;
  showcheckbox = false;
  users: any[] = [];

  availableservices: any[] = [];
  unavailableservices: any[] = [];

  /**
   * pagination options
   */
  paginationOptions: articlePaginator = {};

  pageSizeOptions = [];
  hidePageSize = false;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  disabled = false;
  /**
   * end pagination options
   */

  constructor(
    private reservationserv: ReservationService,
    public appserv: AppservicesService,
    private uomserv: UnitofmeasureService,
    private articleserv: ArticlesService,
    private modalctrl: ModalController,
    private actionSheet: ActionSheetController,
    private categarticleserv: CategoryserviceService
  ) {}

  ngOnInit() {
    this.actualuser = this.appserv.getactualuser();
    this.initializePaginationOptions();
    if (this.appserv.permissionFilter('produits', 'view')) {
      this.getlistarticles();
      this.getlistUnitofmeausre();
    }
  }

  ionViewDidEnter() {
    this.searchinput.setFocus();
  }

  initializePaginationOptions() {
    this.paginationOptions.from = 0;
    this.paginationOptions.to = 0;
    this.paginationOptions.total = 0;
  }

  serviceslookup($event) {
    if ($event.keyCode === 13) {
      //searching by code bar
      if (this.appserv.isMyDeviceConnected()) {
        //go and search to the API
        this.showdefaultprogress = true;
        this.articleserv
          .searchbycodebar({
            enterprise_id: this.appserv.actualEse.id,
            word: this.keyword,
            type: 'all',
          })
          .subscribe(
            (data) => {
              this.showdefaultprogress = false;
              this.listarticles = data;
            },
            (error) => {
              this.showdefaultprogress = false;
              this.appserv.presentToast(
                'Impossible de satisfaire à votre demande',
                'danger'
              );
            }
          );
      } else {
        //Offline Searching
        this.listarticles = [];
        this.listarticles.push(
          this.articleserv.searchbycodebar(String(this.keyword))
        );
      }
    } else {
      //searching without code bar
      if (this.appserv.isMyDeviceConnected()) {
        //go and search to the API
        this.showdefaultprogress = true;
        this.articleserv
          .searchbyword({
            enterprise_id: this.appserv.actualEse.id,
            word: this.keyword,
            type: 'all',
          })
          .subscribe(
            (data) => {
              this.showdefaultprogress = false;
              this.listarticles = data;
            },
            (error) => {
              this.showdefaultprogress = false;
              this.appserv.presentToast(
                'Impossible de charger la liste des produits',
                'danger'
              );
            }
          );
      } else {
        //Offline Searching
        this.listarticles = this.articleserv.getoffarticlesbykeywords(
          String(this.keyword)
        );
      }
    }
  }

  PageEventHandled(page: string) {
    const url =
      page === 'first-page'
        ? this.paginationOptions.first_page_url
        : page === 'previous-page'
        ? this.paginationOptions.prev_page_url
        : page === 'next-page'
        ? this.paginationOptions.next_page_url
        : page === 'last-page'
        ? this.paginationOptions.last_page_url
        : '';
    this.listarticles = [];
    this.keyword = '';
    if (this.appserv.isMyDeviceConnected()) {
      if (url != null) {
        this.showdefaultprogress = true;
        this.appserv.gotoanypaginationurl(url).subscribe(
          (data) => {
            this.paginationOptions = data;
            this.showdefaultprogress = false;
            this.listarticles = data.data;
          },
          (error) => {
            this.showdefaultprogress = false;
          }
        );
      } else {
        this.appserv.presentToast('Aucune donnée à afficher', 'warning');
      }
    } else {
      this.PageEventHandledByPage(page);
    }
  }

  PageEventHandledByPage(page: string) {
    const currentPage =
      page === 'first-page'
        ? 1
        : page === 'previous-page'
        ? this.paginationOptions.current_page - 1
        : page === 'next-page'
        ? this.paginationOptions.current_page + 1
        : page === 'last-page'
        ? this.paginationOptions.last_page
        : 1;
    const data =
      this.articleserv.getofflinearticlespaginatedbypage(currentPage);

    if (typeof data !== 'undefined') {
      this.paginationOptions = data;
      this.listarticles = this.paginationOptions.data;
    } else {
      this.appserv.presentToast('Aucune donnée trouvée', 'warning');
    }
  }

  async scanbarcode() {
    const modal = this.appserv.startScan();
    (await modal).present();
  }

  async pdfdownload() {
    if (this.listarticles.length > 0) {
      let services = [['N°', 'Nom', 'Description', 'UOM', 'Catégorie', 'Type']];
      let index = 0;
      this.listarticles.forEach((el) => {
        index = index + 1;
        const obj = [
          index,
          el.service.name,
          el.service.description,
          el.service.uom_symbol,
          el.service.category_name,
          el.service.type == 1 ? 'Article' : 'Service',
        ];
        services.push(obj);
      });
      const pdfojb = this.appserv.pdftabledownload(
        services,
        'LISTE COMPLETE DES PRODUITS ET SERVICES',
        'Cette liste comprend les articles et les services.',
        'portrait',
        'A4'
      );
      this.appserv.pdfaction(pdfojb, 'listeproduits');
    } else {
      this.appserv.presentToast(`Liste des articles vide`, 'warning');
    }
  }

  excelexport() {
    if (this.listarticles.length > 0) {
      let services = [
        [
          'N°',
          'Nom',
          'Description',
          'UOM',
          'Catégorie',
          'Type',
          'prix_detail',
          'prix_gros',
          'prix_casse',
        ],
      ];
      let index = 0;
      this.listarticles.forEach((el) => {
        index = index + 1;
        const obj = [
          index,
          el.service.name,
          el.service.description,
          el.service.uom_symbol,
          el.service.category_name,
          el.service.type == 1 ? 'Article' : 'Service',
        ];

        if (el.prices.length > 0) {
          el.prices.forEach((price) => {
            obj.push(price.price);
          });
        }
        services.push(obj);
      });

      this.appserv.exportInToExcel(services, 'csv', 'produits');
    } else {
      this.appserv.presentToast(`Liste des articles vide`, 'warning');
    }
  }

  filterbyuom(uomid?: any) {
    if (uomid) {
      this.listarticles = this.listarticles.filter(
        (a) => a.service.uom_id === uomid
      );
    } else {
      this.listarticles = this.listarticles.filter(
        (a) => a.service.category_id === null
      );
    }
  }

  filterbycategory(categoryid?: any) {
    if (categoryid) {
      this.listarticles = this.listarticles.filter(
        (a) => a.service.category_id === categoryid
      );
    } else {
      this.listarticles = this.listarticles.filter(
        (a) => a.service.category_id === null
      );
    }
  }
  deletingfilter() {
    this.getlistarticles();
  }

  filterbytype(criteria: string) {
    this.listarticles = this.listarticles.filter(
      (a) => a.service.type === criteria
    );
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  }

  async stockhistory() {
    this.listselectedarticles = this.listselectedarticles.filter(
      (a) => a.service.type === '1'
    );
    const modal = await this.appserv.modalCtrl.create({
      component: StockhistoryComponent,
      componentProps: { listarticles: this.listselectedarticles },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'success') {
      this.listselectedarticles.forEach((article) => {
        data.forEach((element: any) => {
          if (element.service_id == article.service.id) {
            article.service.available_qte += element.quantity;
          }
        });
      });
    }
  }

  async multipledelete() {
    const alert = await this.appserv.alertctrl.create({
      header: 'Suppression multiple',
      mode: 'ios',
      message: `Voulez-vous supprimer ces ${this.listselectedarticles.length} articles/services? `,
      translucent: true,
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui',
          handler: async () => {
            this.listselectedarticles.forEach((article) => {
              this.showdefaultprogress = true;
              this.articleserv.deleteonearticle(article.service).subscribe(
                (data) => {
                  this.showdefaultprogress = false;
                  if (data > 0) {
                    this.listselectedarticles =
                      this.listselectedarticles.filter((a) => a != article);
                    this.listarticles = this.listarticles.filter(
                      (a) => a != article
                    );
                    if (this.listselectedarticles.length == 0) {
                      this.showcheckbox = false;
                      this.appserv.presentToast(
                        `Suppression effectuée avec succès`,
                        'success'
                      );
                    }
                  } else {
                    this.appserv.presentToast(`Opération  echouée:`, 'warning');
                  }
                },
                (error) => {
                  this.showdefaultprogress = false;
                  this.appserv.presentToast(`Suppréssion impossible`, 'danger');
                }
              );
            });
          },
        },
      ],
    });
    alert.present();
  }

  async newreservation(article: Articles) {
    const modal = await this.appserv.modalCtrl.create({
      component: NewreservationComponent,
      componentProps: { article: article },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'success') {
      console.log('new reservation', data);
      if (data.service.service.status === 'unavailable') {
        this.availableservices = this.availableservices.filter(
          (a) => a !== article
        );
        this.unavailableservices.unshift(data.service);
        this.reservations.unshift(data.data);
      }
    }
  }

  async searchreservation() {
    this.showdefaultprogress = true;
    this.reservationserv
      .searchreservation({
        enterprise_id: this.appserv.actualEse.id,
        keyword: this.keyreservation,
      })
      .subscribe(
        (response) => {
          this.showdefaultprogress = false;
          this.reservations = response;
        },
        (error) => {
          this.showdefaultprogress = false;
          this.appserv.presentToast(
            'Erreur survenue lors de la recherche des réservations',
            'danger'
          );
        }
      );
  }

  async reservationsfilter(criteria: string) {
    this.showdefaultprogress = true;
    const filter = [criteria];
    this.reservationserv
      .getfilteredlist({
        enterprise_id: this.appserv.actualEse.id,
        filters: filter,
      })
      .subscribe(
        (response) => {
          this.showdefaultprogress = false;
          this.reservations = response;
        },
        (error) => {
          this.showdefaultprogress = false;
          this.appserv.presentToast(
            'Impossible de filtrer les réservations',
            'danger'
          );
        }
      );
  }

  async changereservationstatus(reservation: any, criteria: string) {
    console.log('reservation to update', reservation);
    this.showdefaultprogress = true;
    let tosave = { id: reservation.id, status: criteria };
    this.reservationserv.changestatus(tosave).subscribe(
      (response) => {
        this.showdefaultprogress = false;
        if (response.message === 'success' && response.status === 200) {
          reservation = response.data;
        }
        console.log('reservations', response);
      },
      (error) => {
        this.showdefaultprogress = false;
        console.log(error);
        this.appserv.presentToast(
          'Erreur survenue lors de la récupération des réservations',
          'danger'
        );
      }
    );
  }

  getlistreservations() {
    this.showdefaultprogress = true;
    this.reservationserv.getlist(this.appserv.getactualEse().id).subscribe(
      (response) => {
        this.showdefaultprogress = false;
        this.reservations = response;
        console.log('reservations', response);
      },
      (error) => {
        this.showdefaultprogress = false;
        console.log(error);
        this.appserv.presentToast(
          'Erreur survenue lors de la récupération des réservations',
          'danger'
        );
      }
    );
  }

  async stockarticle(article: Articles) {}

  async editarticle(article: Articles) {
    const modal = await this.appserv.modalCtrl.create({
      component: NewserviceComponent,
      componentProps: {
        data: article,
        servicename:
          article.service.type === '1'
            ? 'article'
            : article.service.type === '2'
            ? 'service'
            : 'accomp',
        article: article,
        listcategories: this.listcategories,
        listunitofmeasure: this.listunitofmeasure,
      },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'edited') {
      article.service.name = data.service.name;
      article.service.description = data.service.description;
      article.service.category_name = data.service.category_name;
      article.service.uom_symbol = data.service.uom_symbol;
      article.service.uom_abreviation = data.service.uom_abreviation;
      article.service.available_qte = data.service.available_qte;
      article.service.type = data.service.type;
    }
  }

  async deletearticle(article: Articles) {
    const alert = await this.appserv.alertctrl.create({
      header: 'Suppression',
      subHeader: `${article.service.name}`,
      mode: 'ios',
      translucent: true,
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui',
          handler: async () => {
            this.showdefaultprogress = true;
            this.articleserv.deleteonearticle(article.service).subscribe(
              (data) => {
                this.showdefaultprogress = false;
                if (data > 0) {
                  this.appserv.presentToast(
                    `Suppression effectuée avec succès`,
                    'success'
                  );
                  this.listarticles = this.listarticles.filter(
                    (a) => a != article
                  );
                } else {
                  this.appserv.presentToast(`Opération  echouée:`, 'warning');
                }
              },
              (error) => {
                this.showdefaultprogress = false;
                this.appserv.presentToast(`Suppression impossible`, 'danger');
              }
            );
          },
        },
      ],
    });
    alert.present();
  }
  async detailarticle(article: Articles) {
    const modal = await this.modalctrl.create({
      component: InfosServiceComponent,
      componentProps: {
        servicesent: article,
        listcategories: this.listcategories,
        listunitofmeasure: this.listunitofmeasure,
      },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'edited') {
    }

    if (role === 'deleted') {
      this.listarticles = this.listarticles.filter((ar) => ar != article);
    }
  }

  async getusers() {
    this.appserv.getusers().subscribe((data) => {
      this.users = data;
    });
  }

  async articlemenu(article: Articles) {
    if (this.showcheckbox) {
      article.selected = true;
      const ifexists = this.listselectedarticles.indexOf(article);
      if (ifexists === -1) {
        this.listselectedarticles.push(article);
      } else {
        this.listselectedarticles = this.listselectedarticles.filter(
          (r) => r != article
        );
        article.selected = false;
      }
    } else {
      if (this.appserv.permissionFilter('produits', 'edit')) {
        this.editarticle(article);
      }
    }
  }

  async importcsvfile() {
    const modal = await this.modalctrl.create({
      component: ImportComponent,
      cssClass: 'modal-border-radius-20',
      componentProps: { criteria: 'articles' },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'added') {
      data.forEach((el) => {
        this.listarticles.push(el);
      });
    }
  }

  async catalogueproducts() {
    const modal = await this.modalctrl.create({
      component: CatalogueproductsComponent,
      componentProps: { list: this.listarticles },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();
  }
  async newservice() {
    const modal = await this.modalctrl.create({
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
      console.log(data);
      this.listarticles.unshift(data);
      if (
        data.service.type === '2' &&
        data.service.service_usage === 'location' &&
        data.service.status === 'available'
      ) {
        this.availableservices.unshift(data);
      }

      if (
        data.service.type === '2' &&
        data.service.service_usage === 'location' &&
        data.service.status === 'unavailable'
      ) {
        this.unavailableservices.unshift(data);
      }
    }

    if (role == 'multiple') {
      this.listarticles = this.listarticles.concat(data);
    }
  }

  async newcategory() {
    const modal = await this.modalctrl.create({
      component: NewcategoryComponent,
      componentProps: { listcategories: this.listcategories },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'added') {
      this.listcategories.unshift(data);
    }
  }

  async newunitofmeasure() {
    const modal = await this.modalctrl.create({
      component: NewunitofmeasureComponent,
      componentProps: { listunitofmeasures: this.listunitofmeasure },
      cssClass: 'modal-border-radius-20',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'added') {
      this.listunitofmeasure.unshift(data);
    }
  }

  servicesavailability() {
    if (this.appserv.isMyDeviceConnected()) {
      this.articleserv
        .servicesavailability({ enterprise_id: this.actualuser.enterprise_id })
        .subscribe(
          (response) => {
            console.log('services availability', response);
            if ((response.message = 'success')) {
              this.availableservices = response.availables;
              this.unavailableservices = response.unavailables;
            }
          },
          (error) => {
            console.log(error);
            this.showdefaultprogress = false;
            this.appserv.presentToast('Une erreur survenue.', 'warning');
          }
        );
    }
  }

  async changeservicestatus(article: any, criteria: string) {
    console.log('before update', article);
    if (this.appserv.isMyDeviceConnected()) {
      this.showdefaultprogress = true;
      let objectsent: any = article.service;
      objectsent.status = criteria;
      this.articleserv.editarticleapi(objectsent).subscribe(
        (response) => {
          this.showdefaultprogress = false;
          this.appserv.presentToast(
            'Disponibilité modifiée avec succès',
            'success'
          );
          if (criteria === 'unavailable') {
            this.availableservices = this.availableservices.filter(
              (s) => s !== article
            );
            this.unavailableservices.unshift(response);
          } else {
            this.unavailableservices = this.unavailableservices.filter(
              (s) => s !== article
            );
            this.availableservices.unshift(response);
          }
        },
        (error) => {
          console.log(error);
          this.showdefaultprogress = false;
          this.showdefaultprogress = false;
          this.appserv.presentToast(
            'Une erreur survenue lors de la modification.',
            'warning'
          );
        }
      );
    }
  }

  getlistarticles() {
    this.showdefaultprogress = true;
    if (this.appserv.isMyDeviceConnected()) {
      this.articleserv
        .enterpriseservicespaginated(this.actualuser.enterprise_id)
        .subscribe(
          (data: articlePaginator) => {
            this.paginationOptions = data;
            this.showdefaultprogress = false;
            this.listarticles = data.data;
          },
          (error) => {
            this.showdefaultprogress = false;
            this.appserv.presentToast(
              "Une erreur s'est produite lors de la récupération de la liste des vos produits.",
              'warning'
            );
          }
        );
    } else {
      this.showdefaultprogress = false;
      this.paginationOptions =
        this.articleserv.getofflinearticlespaginatedbypage();
      if (this.paginationOptions) {
        this.listarticles = this.paginationOptions.data;
      }
    }
  }

  getlistcategoriesarticles() {
    this.categarticleserv
      .getallcategoriesarticles(this.actualuser.enterprise_id)
      .subscribe(
        (data) => {
          this.listcategories = data;
          //save to local storage
          localStorage.setItem('categoriesartiles', JSON.stringify(data));
        },
        (error) => {
          // this.appserv.presentToast(`Impossible de charger les catégories`,'danger');
          //taking for local storage
          const records = localStorage.getItem('categoriesartiles');
          if (records !== null) {
            this.listcategories = JSON.parse(records);
          }
        }
      );
  }

  getlistUnitofmeausre() {
    this.uomserv.getallunitofmeasure(this.actualuser.enterprise_id).subscribe(
      (data) => {
        this.listunitofmeasure = data;
        //save to local storage
        localStorage.setItem('unitofmeasures', JSON.stringify(data));
      },
      (error) => {
        // this.appserv.presentToast('Impossible de charger les unités de mesure. ','danger');
        //taking for local storage
        const records = localStorage.getItem('unitofmeasures');
        if (records !== null) {
          this.listunitofmeasure = JSON.parse(records);
        }
      }
    );
  }

  getlistmoneys() {
    this.uomserv.getallunitofmeasure(this.actualuser.enterprise_id).subscribe(
      (data) => {
        this.listunitofmeasure = data;
        //save to local storage
        localStorage.setItem('unitofmeasures', JSON.stringify(data));
      },
      (error) => {
        // this.appserv.presentToast('Impossible de charger les unités de mesure. ','danger');
        //taking for local storage
        const records = localStorage.getItem('unitofmeasures');
        if (records !== null) {
          this.listunitofmeasure = JSON.parse(records);
        }
      }
    );
  }
}
