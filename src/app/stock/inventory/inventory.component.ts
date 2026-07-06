import { Component, OnInit } from '@angular/core';
import { Articles } from './../../interfaces/articles';
import { AppservicesService } from '../../services/appservices.service';
import { PrintinventoryComponent } from 'src/app/module/uzisha/stock/inventory/printinventory/printinventory.component';
import { DepositsService } from 'src/app/services/deposits.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { Router } from '@angular/router';

interface SerialNumberItem {
  id: number;
  serial_number: string;
  unique_key?: string;
  service_id?: number;
  production_lot_id?: number;
  status?: string;
  current_owner_id?: number;
  current_owner_type?: string;
  invoice_id?: number | null;
  sold_at?: string | null;
  activated_at?: string | null;
  created_at?: string;
  updated_at?: string;
  purchase_price?: string | null;
  last_selling_price?: string | null;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface SerialNumbersPagination {
  current_page: number;
  data: SerialNumberItem[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string | null;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

interface SerialNumbersApiResponse {
  status: number;
  message: string;
  error: string | null;
  data: SerialNumbersPagination;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  search: string = '';
  listarticles: any[] = [];
  keptlistarticles: any[] = [];
  showprogress = false;
  inventory: Articles[] = [];
  totalArticles = 0;
pdfConfig = {
  paper: 'A4',
  orientation: 'P',
  columns: 3,
  label_height: 10,
  font_size: 8,
  margin_left: 6,
  margin_right: 6,
  margin_top: 6,
  margin_bottom: 6,
  gap_x: 3,
  gap_y: 3,
  show_group_title: true,
};
  constructor(
    public appserv: AppservicesService,
    private articleserv: ArticlesService,
    private depositserv: DepositsService,
     private router: Router
  ) {}

  ngOnInit() {
    this.getlistdeposits();
  }

  togglePdfPanel(article: any) {
  article.showPdfPanel = !article.showPdfPanel;
}

applyPdfPreset(type: 'compact' | 'standard' | 'large') {
  if (type === 'compact') {
    this.pdfConfig = {
      paper: 'A4',
      orientation: 'P',
      columns: 4,
      label_height: 9,
      font_size: 7,
      margin_left: 5,
      margin_right: 5,
      margin_top: 5,
      margin_bottom: 5,
      gap_x: 2,
      gap_y: 2,
      show_group_title: true,
    };
    return;
  }

  if (type === 'large') {
    this.pdfConfig = {
      paper: 'A4',
      orientation: 'P',
      columns: 2,
      label_height: 14,
      font_size: 10,
      margin_left: 8,
      margin_right: 8,
      margin_top: 8,
      margin_bottom: 8,
      gap_x: 4,
      gap_y: 4,
      show_group_title: true,
    };
    return;
  }

  this.pdfConfig = {
    paper: 'A4',
    orientation: 'P',
    columns: 3,
    label_height: 10,
    font_size: 8,
    margin_left: 6,
    margin_right: 6,
    margin_top: 6,
    margin_bottom: 6,
    gap_x: 3,
    gap_y: 3,
    show_group_title: true,
  };
}
  async print() {
    const modal = await this.appserv.modalCtrl.create({
      component: PrintinventoryComponent,
      componentProps: {
        listarticles: this.listarticles,
        datefiltered: this.appserv.today,
      },
      cssClass: 'modal-border-radius-20',
    });

    await modal.present();
  }
  printInventoryReport() {
  this.print(); // ton impression actuelle
}

printCarnetsFile() {
  this.router.navigate(['/uzisha/stock/print-carnets']);
}

  async exportExcel() {
    const data: any[] = [];
    const subtitle = `Inventaire en la date du ${this.appserv.frdate(
      this.appserv.today
    )}`;

    data.push([subtitle]);
    data.push(['N°', 'Produit', 'Description', 'Quantité']);

    this.listarticles.forEach((depot) => {
      data.push([depot.deposit.name]);

      let index = 0;
      depot.services.forEach((article: any) => {
        index++;

        data.push([
          index,
          article?.service?.name || '',
          article?.service?.description || '',
          article?.service?.available_qte !== null &&
          article?.service?.available_qte !== undefined
            ? `${article.service.available_qte} (${
                article?.service?.uom_symbol || ''
              })`
            : '0',
        ]);
      });
    });

    this.appserv.exportInToExcel(data, 'csv', 'stock_inventory');
  }

  getnexpagesdepositartlces = async (
    url: string,
    deposit: any
  ): Promise<any[]> => {
    const response = await fetch(url);
    const responseData = await response.json();
    const services: any[] = responseData.data || [];

    if (responseData.next_page_url) {
      return services.concat(
        await this.getnexpagesdepositartlces(
          responseData.next_page_url,
          deposit
        )
      );
    } else {
      deposit.inloading = false;
      return services;
    }
  };

  async getlistdeposits() {
    this.listarticles = [];
    this.showprogress = true;

    this.depositserv
      .forASpecifUser({ user_id: this.appserv.actualUser.id })
      .subscribe(
        async (data: any[]) => {
          if (data && data.length > 0) {
            data.forEach((deposit: any) => {
              this.listarticles.push({
                deposit,
                services: [],
                selected: false,
                inloading: false,
              });
            });

            await this.gettingDepositsDetails();
          }

          this.showprogress = false;
        },
        () => {
          this.showprogress = false;
          this.appserv.presentToast(
            'Erreur lors de la récupération de la liste des dépôts',
            'warning'
          );
        }
      );
  }

  deletefilter() {
    this.listarticles.forEach((d) => (d.selected = false));
  }

  filterbydeposits(deposit: any) {
    this.listarticles.forEach((element) => {
      element.selected = true;
    });

    deposit.selected = false;
  }

  async gettingDepositsDetails() {
    if (this.listarticles.length <= 0) {
      this.totalArticles = 0;
      return;
    }

    this.showprogress = true;

    const promises = this.listarticles.map(
      (actualDeposit) =>
        new Promise<void>((resolve) => {
          this.depositserv
            .articlesdepositpaginate(actualDeposit.deposit.id)
            .subscribe(
              async (datadeposit: any) => {
                try {
                  let services = datadeposit?.data || [];

                  if (datadeposit?.next_page_url) {
                    actualDeposit.inloading = true;

                    const moreServices = await this.getnexpagesdepositartlces(
                      datadeposit.next_page_url,
                      actualDeposit
                    );

                    services = services.concat(moreServices);
                  } else {
                    actualDeposit.inloading = false;
                  }

                  actualDeposit.services =
                    this.prepareArticlesUiState(services);
                } catch (err: any) {
                  console.error(err?.message || err);
                  actualDeposit.services = [];
                  actualDeposit.inloading = false;
                }

                resolve();
              },
              () => {
                actualDeposit.inloading = false;
                actualDeposit.services = [];
                this.appserv.presentToast(
                  'Nous avons connu un problème en voulant récupérer les produits du dépôt ' +
                    (actualDeposit.deposit?.name || ''),
                  'warning'
                );
                resolve();
              }
            );
        })
    );

    await Promise.all(promises);
    this.computeTotalArticles();
    this.showprogress = false;
  }

  prepareArticlesUiState(articles: any[]): any[] {
    return (articles || []).map((article) => ({
      ...article,
      isExpanded: false,
      loadingSerials: false,
      serialsLoaded: false,
      serialsError: null,
      serialNumbers: this.getEmptySerialPagination(),
    }));
  }

  getEmptySerialPagination(): SerialNumbersPagination {
    return {
      current_page: 1,
      data: [],
      first_page_url: null,
      from: null,
      last_page: 1,
      last_page_url: null,
      links: [],
      next_page_url: null,
      path: null,
      per_page: 20,
      prev_page_url: null,
      to: null,
      total: 0,
    };
  }

  computeTotalArticles() {
    this.totalArticles = this.listarticles.reduce((sum: number, depot: any) => {
      return sum + (depot.services?.length || 0);
    }, 0);
  }

  toggleArticle(depot: any, article: any) {
    const wasExpanded = article.isExpanded;

    this.closeAllExpandedArticles();
    article.isExpanded = !wasExpanded;

    if (article.isExpanded && !article.serialsLoaded) {
      this.loadAvailableSerials(depot, article);
    }
  }

  closeAllExpandedArticles() {
    this.listarticles.forEach((depot) => {
      (depot.services || []).forEach((article: any) => {
        article.isExpanded = false;
      });
    });
  }

  closeArticle(article: any) {
    article.isExpanded = false;
  }

  refreshArticleSerials(depot: any, article: any) {
    article.serialsLoaded = false;
    article.serialsError = null;
    article.serialNumbers = this.getEmptySerialPagination();
    this.loadAvailableSerials(depot, article);
  }

  loadAvailableSerials(depot: any, article: any) {
    article.loadingSerials = true;
    article.serialsError = null;

    this.depositserv.getSerialNumberByService(article.service.id, 20).subscribe(
      (res: SerialNumbersApiResponse | SerialNumbersPagination | any) => {
        article.loadingSerials = false;
        article.serialsLoaded = true;

        const paginated: SerialNumbersPagination = res?.data?.data
          ? res.data
          : res?.data && res?.current_page === undefined
          ? res.data
          : res;

        article.serialNumbers = {
          current_page: paginated?.current_page || 1,
          data: paginated?.data || [],
          first_page_url: paginated?.first_page_url || null,
          from: paginated?.from ?? null,
          last_page: paginated?.last_page || 1,
          last_page_url: paginated?.last_page_url || null,
          links: paginated?.links || [],
          next_page_url: paginated?.next_page_url || null,
          path: paginated?.path || null,
          per_page: Number(paginated?.per_page || 20),
          prev_page_url: paginated?.prev_page_url || null,
          to: paginated?.to ?? null,
          total: paginated?.total || 0,
        };
      },
      (error) => {
        console.log(error);
        article.loadingSerials = false;
        article.serialsLoaded = true;
        article.serialsError =
          'Impossible de récupérer les numéros de série disponibles.';
      }
    );
  }

  async goToSerialsPage(article: any, page: number) {
    if (!page || article.loadingSerials) return;

    article.loadingSerials = true;
    article.serialsError = null;

    const perPage = Number(article?.serialNumbers?.per_page || 20);

    this.depositserv
      .getSerialNumberByService(article.service.id, perPage, page)
      .subscribe(
        (res: SerialNumbersApiResponse | SerialNumbersPagination | any) => {
          const paginated: SerialNumbersPagination = res?.data?.data
            ? res.data
            : res?.data && res?.current_page === undefined
            ? res.data
            : res;

          article.serialNumbers = {
            current_page: paginated?.current_page || 1,
            data: paginated?.data || [],
            first_page_url: paginated?.first_page_url || null,
            from: paginated?.from ?? null,
            last_page: paginated?.last_page || 1,
            last_page_url: paginated?.last_page_url || null,
            links: paginated?.links || [],
            next_page_url: paginated?.next_page_url || null,
            path: paginated?.path || null,
            per_page: Number(paginated?.per_page || perPage),
            prev_page_url: paginated?.prev_page_url || null,
            to: paginated?.to ?? null,
            total: paginated?.total || 0,
          };

          article.loadingSerials = false;
        },
        () => {
          article.loadingSerials = false;
          article.serialsError =
            'Impossible de charger la page des numéros de série.';
        }
      );
  }

downloadSerialsPdf(article?: any) {
  const serviceId = article?.service?.id;

  this.depositserv
    .downloadCarnetsSerialsPdf(serviceId, this.pdfConfig)
    .subscribe({
      next: async (blob: Blob) => {
        if (blob.type && !blob.type.includes('pdf')) {
          const text = await blob.text();
          console.error('Réponse non PDF:', text);
          this.appserv.presentToast(
            "Le serveur n'a pas renvoyé un PDF valide",
            'warning'
          );
          return;
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `carnets_serials_${new Date().getTime()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: async (error) => {
        console.error(error);

        if (error?.error instanceof Blob) {
          const text = await error.error.text();
          console.error('Erreur backend:', text);
        }

        this.appserv.presentToast(
          'Erreur lors du téléchargement du PDF',
          'warning'
        );
      },
    });
}

  goToNextSerialsPage(article: any) {
    const current = article?.serialNumbers?.current_page || 1;
    const last = article?.serialNumbers?.last_page || 1;

    if (current < last) {
      this.goToSerialsPage(article, current + 1);
    }
  }

  goToPrevSerialsPage(article: any) {
    const current = article?.serialNumbers?.current_page || 1;

    if (current > 1) {
      this.goToSerialsPage(article, current - 1);
    }
  }

  goToFirstSerialsPage(article: any) {
    this.goToSerialsPage(article, 1);
  }

  goToLastSerialsPage(article: any) {
    const last = article?.serialNumbers?.last_page || 1;
    this.goToSerialsPage(article, last);
  }

  goToSerialsPageNumber(article: any, page: number) {
    this.goToSerialsPage(article, page);
  }

  getVisibleSerialPageNumbers(article: any): number[] {
    const current = article?.serialNumbers?.current_page || 1;
    const last = article?.serialNumbers?.last_page || 1;

    let start = Math.max(1, current - 2);
    let end = Math.min(last, current + 2);

    if (current <= 2) {
      end = Math.min(last, 5);
    }

    if (current >= last - 1) {
      start = Math.max(1, last - 4);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getSerialDisplayIndex(article: any, index: number): number {
    const currentPage = article?.serialNumbers?.current_page || 1;
    const perPage = Number(article?.serialNumbers?.per_page || 20);
    return (currentPage - 1) * perPage + index + 1;
  }
}
