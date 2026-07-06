import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize } from 'rxjs';

import { DepositsService } from 'src/app/services/deposits.service';
import { AppservicesService } from 'src/app/services/appservices.service';

type CarnetPageType = 'page_22_7' | 'page_8_21' | 'identification';
type CarnetPreviewType = 'covers' | CarnetPageType;
type CoverGroup = {
  page?: number;
  label: string;
  html?: string;
  covers: any[];
};

@Component({
  selector: 'app-print-carnets',
  templateUrl: './print-carnets.component.html',
  styleUrls: ['./print-carnets.component.scss'],
})
export class PrintCarnetsComponent implements OnInit {
  deposits: any[] = [];
  previewType = 'covers';

  previewPage = 'all';

  previewData: any = {
    covers: [],
    page_22_7: '',
    page_8_21: '',
    identification: '',
  };
  pageFilter = 'all';

  selectedPreviewType: CarnetPreviewType = 'covers';

  selectedCover: any = null;

  coverSearch = '';

  filteredCovers: any[] = [];
  coverGroups: CoverGroup[] = [];
  services: any[] = [];

  selectedService: any = null;

  selectedDeposits: number[] = [];

  serials: any[] = [];

  filteredSerials: any[] = [];
  serialPage = 1;
  serialPageSize = 20;

  search = '';
  loadingDeposits = false;

  loadingServices = false;
  

  loadingSerials = false;
  previewHtml: any = '';

  loading = false;
  isGeneratingPdf = false;
  previewLoading = false;
  downloadingPages: Partial<Record<CarnetPageType, boolean>> = {};
  coverGroupPageIndex = 0;
  coverFromPage = 1;
  coverToPage = 1;
  downloadingCoverPage = false;
  downloadingCoverRange = false;
  downloadingAllCovers = false;
  previewZoom = 100;
  previewRotation = 0;
  previewFitMode: 'page' | 'width' = 'page';
  selectedCoverGroupPage: number | null = null;

  private previewTimeout: any;

  stats = {
    total: 0,
    selected: 0,
    excluded: 0,
  };

  constructor(
    private depositserv: DepositsService,
    public appserv: AppservicesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadDeposits();

    this.loadCarnetServices();
  }

  // =====================================================
  // RESET
  // =====================================================

  resetBuilder(): void {
    this.previewHtml = '';

    this.previewLoading = false;

    this.search = '';

    this.serials = [];

    this.filteredSerials = [];
    this.serialPage = 1;

    this.stats = {
      total: 0,
      selected: 0,
      excluded: 0,
    };
    this.previewData = {
      covers: [],
      page_22_7: '',
      page_8_21: '',
      identification: '',
    };

    this.filteredCovers = [];
    this.coverGroups = [];
    this.coverGroupPageIndex = 0;
    this.coverFromPage = 1;
    this.coverToPage = 1;

    this.selectedCover = null;
    this.selectedCoverGroupPage = null;

    this.pageFilter = 'all';

    this.selectedPreviewType = 'covers';
    this.resetPreviewView();
  }

  // =====================================================
  // DEPOTS
  // =====================================================

  loadDeposits(): void {
    this.loadingDeposits = true;

    this.depositserv
      .forASpecifUser({
        user_id: this.appserv.actualUser.id,
      })
      .subscribe({
        next: (data: any) => {
          this.deposits = data || [];

          this.loadingDeposits = false;
        },

        error: () => {
          this.loadingDeposits = false;

          this.deposits = [];
        },
      });
  }

  onDepositChange(): void {
    this.resetBuilder();
  }

  // =====================================================
  // SERVICES
  // =====================================================

  loadCarnetServices(): void {
    this.loadingServices = true;

    this.depositserv.getservicesfordeposit().subscribe({
      next: (data: any) => {
        const services = (data || [])
          .filter((x: any) => x.service && x.service.nature)
          .map((x: any) => x.service);

        this.services = services.filter(
          (service: any, index: number, self: any[]) =>
            index === self.findIndex((s: any) => s.id === service.id)
        );

        this.loadingServices = false;
      },

      error: () => {
        this.loadingServices = false;

        this.services = [];
      },
    });
  }

  selectService(service: any): void {
    this.selectedService = service;

    this.selectedDeposits = [];

    this.resetBuilder();
  }

  clearSelectedService(): void {
    this.selectedService = null;

    this.selectedDeposits = [];

    this.loading = false;

    this.previewLoading = false;

    this.resetBuilder();
  }
  downloadSinglePage(type: CarnetPageType): void {
    if (!this.selectedService) {
      return;
    }

    this.downloadingPages[type] = true;

    const excluded = this.serials
      .filter((x: any) => !x.selected)
      .map((x: any) => x.serial_number);

    this.depositserv
      .generateCarnetsPdf({
        service_id: this.selectedService.id,

        deposit_ids: this.selectedDeposits,

        excluded_serials: excluded,

        page_type: type,
      })
      .pipe(
        finalize(() => {
          this.downloadingPages[type] = false;
        })
      )
      .subscribe({
        next: (blob: any) => {
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');

          a.href = url;

          a.download = type + '.pdf';

          a.click();

          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  isPageDownloading(type: CarnetPageType): boolean {
    return !!this.downloadingPages[type];
  }

  downloadCoverPage(): void {
    const group = this.currentCoverGroup;

    if (!group || !this.selectedService) {
      return;
    }

    this.downloadingCoverPage = true;

    this.downloadCarnetsPdf(
      {
        page_type: 'covers_page',
        cover_page: group.page || this.coverGroupPageIndex + 1,
      },
      `couvertures-${group.label.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      () => {
        this.downloadingCoverPage = false;
      }
    );
  }

  downloadCoverRange(): void {
    if (!this.selectedService) {
      return;
    }

    const fromPage = Math.min(this.coverFromPage, this.coverToPage);
    const toPage = Math.max(this.coverFromPage, this.coverToPage);

    this.downloadingCoverRange = true;

    this.downloadCarnetsPdf(
      {
        page_type: 'covers_range',
        cover_from_page: fromPage,
        cover_to_page: toPage,
      },
      `couvertures-pages-${fromPage}-${toPage}.pdf`,
      () => {
        this.downloadingCoverRange = false;
      }
    );
  }

  downloadAllCovers(): void {
    if (!this.selectedService) {
      return;
    }

    this.downloadingAllCovers = true;

    this.downloadCarnetsPdf(
      {
        page_type: 'covers_all',
      },
      'couvertures.pdf',
      () => {
        this.downloadingAllCovers = false;
      }
    );
  }

  private downloadCarnetsPdf(
    extraPayload: any,
    filename: string,
    done: () => void
  ): void {
    const excluded = this.serials
      .filter((x: any) => !x.selected)
      .map((x: any) => x.serial_number);

    this.depositserv
      .generateCarnetsPdf({
        service_id: this.selectedService.id,
        deposit_ids: this.selectedDeposits,
        excluded_serials: excluded,
        ...extraPayload,
      })
      .pipe(finalize(done))
      .subscribe({
        next: (blob: any) => {
          this.downloadBlob(blob, filename);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  private downloadBlob(blob: any, filename: string): void {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;

    a.download = filename;

    a.click();

    window.URL.revokeObjectURL(url);
  }

  // =====================================================
  // SERIALS
  // =====================================================

  loadSerials(): void {
    if (!this.selectedService) {
      return;
    }

    if (!this.selectedDeposits.length) {
      return;
    }

    this.loadingSerials = true;

    this.resetBuilder();

    this.depositserv
      .getCarnetForPriting({
        service_id: this.selectedService.id,
        deposit_ids: this.selectedDeposits,
      })
      .subscribe({
        next: (res: any) => {
          this.serials = (res.data || []).map((x: any) => ({
            ...x,
            selected: true,
          }));

          this.filteredSerials = [...this.serials];
          this.serialPage = 1;
          this.filteredCovers = [...this.serials];
          this.updateCoverGroups();

          this.calculateStats();

          this.loadingSerials = false;

          this.refreshPreview();
        },

        error: () => {
          this.loadingSerials = false;

          this.serials = [];

          this.filteredSerials = [];
          this.serialPage = 1;
          this.filteredCovers = [];
          this.updateCoverGroups();
        },
      });
  }

  // =====================================================
  // RECHERCHE
  // =====================================================

  filterSerials(): void {
    const q = (this.search || '').toLowerCase().trim();

    if (!q) {
      this.filteredSerials = [...this.serials];
      this.serialPage = 1;

      return;
    }

    this.filteredSerials = this.serials.filter((item: any) =>
      (item.serial_number || '').toLowerCase().includes(q)
    );
    this.serialPage = 1;
  }

  get paginatedSerials(): any[] {
    const start = (this.serialPage - 1) * this.serialPageSize;

    return this.filteredSerials.slice(start, start + this.serialPageSize);
  }

  get serialTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredSerials.length / this.serialPageSize));
  }

  get serialPageStart(): number {
    if (!this.filteredSerials.length) {
      return 0;
    }

    return (this.serialPage - 1) * this.serialPageSize + 1;
  }

  get serialPageEnd(): number {
    return Math.min(this.serialPage * this.serialPageSize, this.filteredSerials.length);
  }

  nextSerialPage(): void {
    if (this.serialPage < this.serialTotalPages) {
      this.serialPage++;
    }
  }

  previousSerialPage(): void {
    if (this.serialPage > 1) {
      this.serialPage--;
    }
  }

  selectAllSerials(selected: boolean): void {
    this.serials.forEach((item: any) => {
      item.selected = selected;
    });

    this.calculateStats();
    this.queuePreviewRefresh();
  }

  selectVisibleSerials(selected: boolean): void {
    this.paginatedSerials.forEach((item: any) => {
      item.selected = selected;
    });

    this.calculateStats();
    this.queuePreviewRefresh();
  }

  // =====================================================
  // STATS
  // =====================================================

  calculateStats() {
    console.log('TOTAL', this.serials.length);

    console.log(
      'SELECTED',
      this.serials.filter((x: any) => x.selected)
    );

    this.stats.total = this.serials.length;

    this.stats.selected = this.serials.filter((x: any) => x.selected).length;

    this.stats.excluded = this.stats.total - this.stats.selected;

    console.log(this.stats);
  }

  // =====================================================
  // PREVIEW
  // =====================================================

  queuePreviewRefresh(): void {
    clearTimeout(this.previewTimeout);

    this.previewTimeout = setTimeout(() => {
      this.refreshPreview();
    }, 300);
  }

  // openCover(cover: any): void {

  //   this.selectedPreviewType =
  //     'cover';

  //   this.selectedCover =
  //     cover;

  //   this.previewHtml =
  //     this.sanitizer
  //       .bypassSecurityTrustHtml(
  //         cover.html
  //       );
  // }
  openCover(cover: any): void {
    this.selectedCover = cover;
    this.selectedCoverGroupPage = null;

    this.selectedPreviewType = 'covers';
    this.resetPreviewView();

    if (cover.cover_html || cover.html) {
      this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(
        cover.cover_html || cover.html
      );

      return;
    }

    this.loadSelectedPreview();
  }
  // openInternalPage(
  //   type:string
  // ): void {

  //   this.selectedPreviewType =
  //     type;

  //   this.loadSelectedPreview();
  // }
  openInternalPage(type: CarnetPageType): void {
    this.selectedPreviewType = type;
    this.selectedCover = null;
    this.selectedCoverGroupPage = null;
    this.resetPreviewView();

    this.loadSelectedPreview();
  }
  filterCoverList(): void {
    const search = (this.coverSearch || '').toLowerCase().trim();
    const covers = this.getPreviewCovers();

    if (!search) {
      this.filteredCovers = covers;

      this.updateCoverGroups();

      return;
    }

    this.filteredCovers = covers.filter((x: any) =>
      (x.serial_number || '').toLowerCase().includes(search)
    );

    this.updateCoverGroups();
  }
  // filterCoverList(): void {

  //   const q =
  //     this.coverSearch
  //       .toLowerCase()
  //       .trim();

  //   if (!q) {

  //     this.filteredCovers =
  //       this.previewData.covers || [];

  //     return;
  //   }

  //   this.filteredCovers =
  //     (this.previewData.covers || [])
  //       .filter(
  //         (x: any) =>
  //           x.serial_number
  //             ?.toLowerCase()
  //             .includes(q)
  //       );
  // }
  changePreviewType(type: string): void {
    this.pageFilter = type;
  }
  refreshPreview(): void {
    if (!this.selectedService || !this.selectedDeposits.length) {
      return;
    }

    this.previewLoading = true;

    const excluded = this.serials
      .filter((x: any) => !x.selected)
      .map((x: any) => x.serial_number);

    this.depositserv
      .previewCarnets({
        service_id: this.selectedService.id,

        deposit_ids: this.selectedDeposits,

        excluded_serials: excluded,
      })
      .subscribe({
        next: (res: any) => {
          this.previewData = res.preview;

          this.filteredCovers = this.getPreviewCovers();
          this.updateCoverGroups();
          this.coverGroupPageIndex = 0;
          this.syncCoverRangeInputs();

          if (this.filteredCovers.length) {
            this.selectedCover = this.filteredCovers[0];

            this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(
              this.selectedCover.cover_html || this.selectedCover.html
            );
          }

          this.previewLoading = false;
        },
        error: () => {
          this.previewLoading = false;
        },
      });
  }
  loadSelectedPreview(): void {
    let html = '';

    switch (this.selectedPreviewType) {
      case 'covers':
        html = this.previewData?.covers || '';

        break;

      case 'page_22_7':
        html = this.previewData?.page_22_7 || '';

        break;

      case 'page_8_21':
        html = this.previewData?.page_8_21 || '';

        break;

      case 'identification':
        html = this.previewData?.identification || '';

        break;
    }

    this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private updateCoverGroups(): void {
    this.coverGroups = this.buildCoverGroups(this.filteredCovers);

    if (this.coverGroupPageIndex >= this.coverGroups.length) {
      this.coverGroupPageIndex = Math.max(0, this.coverGroups.length - 1);
    }

    this.syncCoverRangeInputs();
  }

  get currentCoverGroup(): CoverGroup | null {
    return this.coverGroups[this.coverGroupPageIndex] || null;
  }

  get coverGroupPageLabel(): string {
    if (!this.coverGroups.length) {
      return '0 / 0';
    }

    return `${this.coverGroupPageIndex + 1} / ${this.coverGroups.length}`;
  }

  nextCoverGroup(): void {
    if (this.coverGroupPageIndex < this.coverGroups.length - 1) {
      this.coverGroupPageIndex++;
    }
  }

  previousCoverGroup(): void {
    if (this.coverGroupPageIndex > 0) {
      this.coverGroupPageIndex--;
    }
  }

  openCurrentCoverGroup(): void {
    const group = this.currentCoverGroup;

    if (!group) {
      return;
    }

    this.selectedCover = null;
    this.selectedCoverGroupPage = group.page || this.coverGroupPageIndex + 1;
    this.selectedPreviewType = 'covers';
    this.resetPreviewView();
    this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(
      group.html || this.buildCoverPageHtml(group.covers)
    );
  }

  isCoverGroupSelected(group: CoverGroup | null): boolean {
    if (!group || this.selectedCoverGroupPage === null) {
      return false;
    }

    return this.selectedCoverGroupPage === (group.page || this.coverGroupPageIndex + 1);
  }

  get selectedCoverGroupLabel(): string {
    if (this.selectedCoverGroupPage === null) {
      return '';
    }

    const group = this.coverGroups.find(
      (item: CoverGroup, index: number) =>
        (item.page || index + 1) === this.selectedCoverGroupPage
    );

    return group?.label || `Page ${this.selectedCoverGroupPage}`;
  }

  zoomPreviewIn(): void {
    this.previewFitMode = 'page';
    this.previewZoom = Math.min(200, this.previewZoom + 10);
  }

  zoomPreviewOut(): void {
    this.previewFitMode = 'page';
    this.previewZoom = Math.max(50, this.previewZoom - 10);
  }

  rotatePreview(): void {
    this.previewRotation = (this.previewRotation + 90) % 360;
  }

  fitPreviewToWidth(): void {
    this.previewFitMode = 'width';
    this.previewZoom = 118;
  }

  fitPreviewToPage(): void {
    this.previewFitMode = 'page';
    this.previewZoom = 100;
  }

  resetPreviewView(): void {
    this.previewZoom = 100;
    this.previewRotation = 0;
    this.previewFitMode = 'page';
  }

  get previewTransform(): string {
    return `scale(${this.previewZoom / 100}) rotate(${this.previewRotation}deg)`;
  }

  openPreviousCover(): void {
    const index = this.selectedCoverIndex;

    if (index > 0) {
      this.openCover(this.filteredCovers[index - 1]);
    }
  }

  openNextCover(): void {
    const index = this.selectedCoverIndex;

    if (index >= 0 && index < this.filteredCovers.length - 1) {
      this.openCover(this.filteredCovers[index + 1]);
    }
  }

  get selectedCoverIndex(): number {
    if (!this.selectedCover) {
      return -1;
    }

    return this.filteredCovers.findIndex(
      (cover: any) => cover.serial_number === this.selectedCover.serial_number
    );
  }

  private getPreviewCovers(): any[] {
    if (Array.isArray(this.previewData?.covers) && this.previewData.covers.length) {
      return this.previewData.covers;
    }

    const previewGroups =
      this.previewData?.cover_pages ||
      this.previewData?.covers_pages ||
      this.previewData?.covers_by_page;

    if (!Array.isArray(previewGroups)) {
      return [];
    }

    return previewGroups.reduce((allCovers: any[], page: any) => {
      const pageCovers = page.covers || page.items || page.data || [];

      return allCovers.concat(pageCovers);
    }, []);
  }

  private buildCoverGroups(covers: any[]): CoverGroup[] {
    const previewGroups =
      this.previewData?.cover_pages ||
      this.previewData?.covers_pages ||
      this.previewData?.covers_by_page;

    if (Array.isArray(previewGroups) && previewGroups.length) {
      return previewGroups
        .map((page: any, index: number) => {
          const pageCovers = page.covers || page.items || page.data || [];
          const filteredSerials = new Set(
            (covers || []).map((cover: any) => cover.serial_number)
          );

          return {
            page: page.page || page.page_number || index + 1,
            label: page.label || `Page ${page.page || page.page_number || index + 1}`,
            html: page.html || page.cover_html || page.page_html || '',
            covers: pageCovers.filter((cover: any) =>
              filteredSerials.has(cover.serial_number)
            ),
          };
        })
        .filter((page: CoverGroup) => page.covers.length);
    }

    const groups = new Map<string, any[]>();

    (covers || []).forEach((cover: any) => {
      const pageNumber =
        cover.page ||
        cover.page_number ||
        cover.page_index ||
        cover.cover_page ||
        null;
      const label = pageNumber ? `Page ${pageNumber}` : 'Page non définie';

      if (!groups.has(label)) {
        groups.set(label, []);
      }

      groups.get(label)?.push(cover);
    });

    return Array.from(groups.entries()).map(([label, groupCovers], index) => ({
      page: index + 1,
      label,
      html: this.buildCoverPageHtml(groupCovers),
      covers: groupCovers,
    }));
  }

  private buildCoverPageHtml(covers: any[]): string {
    return (covers || [])
      .map((cover: any) => cover.cover_html || cover.html || '')
      .filter((html: string) => !!html)
      .join('');
  }

  private syncCoverRangeInputs(): void {
    const firstPage = this.coverGroups[0]?.page || 1;
    const lastPage =
      this.coverGroups[this.coverGroups.length - 1]?.page ||
      this.coverGroups.length ||
      1;

    this.coverFromPage = firstPage;
    this.coverToPage = lastPage;
  }
  generateImages() {
    if (!this.selectedService) {
      return;
    }

    const excluded = this.serials
      .filter((x: any) => !x.selected)
      .map((x: any) => x.serial_number);

    this.depositserv
      .generateCarnetsImages({
        service_id: this.selectedService.id,
        deposit_ids: this.selectedDeposits,
        excluded_serials: excluded,
      })
      .subscribe((blob: any) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.href = url;

        a.download = 'carnets-images.zip';

        a.click();

        window.URL.revokeObjectURL(url);
      });
  }
  // =====================================================
  // PDF
  // =====================================================

  generatePdf(): void {
    if (!this.selectedService) {
      return;
    }

    this.isGeneratingPdf = true;

    const excluded = this.serials
      .filter((x: any) => !x.selected)
      .map((x: any) => x.serial_number);

    this.depositserv
      .generateCarnetsPdf({
        service_id: this.selectedService.id,
        deposit_ids: this.selectedDeposits,
        excluded_serials: excluded,
      })
      .subscribe({
        next: (blob: any) => {
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');

          a.href = url;

          a.download = 'carnets.pdf';

          a.click();

          window.URL.revokeObjectURL(url);

          this.isGeneratingPdf = false;
        },

        error: (err) => {
          console.error(err);

          this.isGeneratingPdf = false;
        },
      });
  }
}
