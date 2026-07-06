import { DepositpickerComponent } from './../articles/depositpicker/depositpicker.component';
import { Injectable } from '@angular/core';
import { AppservicesService } from './appservices.service';
import { Deposits } from '../interfaces/deposit';
import { Observable } from 'rxjs';
import { StockHistory } from '../interfaces/stockhistory';
import { Articles } from '../interfaces/articles';
import { Users } from '../interfaces/users';
import { UserDeposit } from '../interfaces/userDeposit';
import { OrbitEncoder } from 'orbit-encoder/lib/OrbitEncoder';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DepositsService {
  listdeposits: Deposits[] = [];
  constructor(private appserv: AppservicesService) {}

  getparticipants(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/deposits/participants',
      data
    );
  }

  addparticipants(data: any): Observable<Users> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/depositsusers',
      data
    );
  }

  updateaffectation(data: any): Observable<UserDeposit> {
    return this.appserv.http.put<UserDeposit>(
      this.appserv.apiUrl + '/depositsusers/update/' + data.id,
      data
    );
  }
  generateCarnetsImages(data: any) {
    return this.appserv.http.post(
      this.appserv.apiUrl + '/carnets/pdf-to-images',

      data,

      {
        responseType: 'blob',
      }
    );
  }

  deleteparticipant(data: any): Observable<any> {
    return this.appserv.http.delete<any>(
      this.appserv.apiUrl + '/depositsusers/delete/' + data.id,
      data
    );
  }
  update(data: any): Observable<any> {
    return this.appserv.http.put<Deposits>(
      this.appserv.apiUrl + '/deposits/update/' + data.id,
      data
    );
  }

  new(data: any): Observable<any> {
    return this.appserv.http.post<Deposits>(
      this.appserv.apiUrl + '/deposits',
      data
    );
  }

  deleteone(deposit: Deposits): Observable<any> {
    return this.appserv.http.delete<any>(
      this.appserv.apiUrl + '/deposits/delete/' + deposit.id
    );
  }

  getstockstory(data: any): Observable<any> {
    return this.appserv.http.post<StockHistory[]>(
      this.appserv.apiUrl + '/stockhistory/fordeposit',
      data
    );
  }

  getalldepositslist(enterpriseid: any): Observable<Deposits[]> {
    return this.appserv.http.get<Deposits[]>(
      this.appserv.apiUrl + '/deposits/enterprise/' + enterpriseid
    );
  }

  forASpecifUser(user: any): Observable<Deposits[]> {
    return this.appserv.http.post<Deposits[]>(
      this.appserv.apiUrl + '/deposit/users',
      user
    );
  }

  addservicestodeposit(data: any): Observable<Articles[]> {
    return this.appserv.http.post<Articles[]>(
      this.appserv.apiUrl + '/deposit/addservices',
      data
    );
  }

  withdrawServicestodeposit(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/deposit/services/delete',
      data
    );
  }
  previewCarnets(data: any) {
    return this.appserv.http.post(
      this.appserv.apiUrl + '/services/carnets/preview',
      data
    );
  }

  generateCarnetsPdf(data: any) {
    return this.appserv.http.post(
      this.appserv.apiUrl + '/services/carnets/generate',
      data,
      {
        responseType: 'blob',
      }
    );
  }

  searchingservicesfordeposit(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/deposit/services/searchbywords',
      data
    );
  }
  getservicesfordeposit(): Observable<any> {
    return this.appserv.http.get<any>(
      this.appserv.apiUrl + '/deposit/services'
    );
  }

  downloadCarnetsSerialsPdf(
    serviceId?: number,
    config?: {
      paper?: string;
      orientation?: string;
      columns?: number;
      label_height?: number;
      font_size?: number;
      margin_left?: number;
      margin_right?: number;
      margin_top?: number;
      margin_bottom?: number;
      gap_x?: number;
      gap_y?: number;
      show_group_title?: boolean | number;
    }
  ) {
    const params: any = {
      paper: config?.paper ?? 'A4',
      orientation: config?.orientation ?? 'P',
      columns: config?.columns ?? 3,
      label_height: config?.label_height ?? 10,
      font_size: config?.font_size ?? 8,
      margin_left: config?.margin_left ?? 6,
      margin_right: config?.margin_right ?? 6,
      margin_top: config?.margin_top ?? 6,
      margin_bottom: config?.margin_bottom ?? 6,
      gap_x: config?.gap_x ?? 3,
      gap_y: config?.gap_y ?? 3,
      show_group_title:
        config?.show_group_title === true || config?.show_group_title === 1
          ? 1
          : 0,
    };

    if (serviceId) {
      params.service_id = serviceId;
    }

    return this.appserv.http.get(
      `${this.appserv.apiUrl}/services/carnets/serialnumber/export/pdf`,
      {
        params,
        responseType: 'blob',
      }
    );
  }

  getSerialNumberByService(
    serviceId: number,
    perPage: number = 20,
    page: number = 1
  ) {
    return this.appserv.http.get(
      `${this.appserv.apiUrl}/services/carnets/serialnumber`,
      {
        params: {
          service_id: serviceId,
          per_page: perPage,
          page: page,
        },
      }
    );
  }

  getSerialNumberByServiceLimited(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/services/carnets/serialnumber/limited',
      data
    );
  }
 getCarnetForPriting(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/services/carnets/serialnumber/printing',
      data
    );
  }
  searchbycategorieandeposit(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/deposit/services/searchbycategorieandeposit',
      data
    );
  }

  searchbybarcode(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/deposit/services/searchbybarcode',
      data
    );
  }

  articlesdepositpaginate(data: any): Observable<any> {
    return this.appserv.http.get<any>(
      this.appserv.apiUrl + '/deposit/articlesdepositpaginated/' + data
    );
  }

  resetDeposit(data: any): Observable<any> {
    return this.appserv.http.post<any>(
      this.appserv.apiUrl + '/deposit/reset',
      data
    );
  }

  getallservicesfordeposits(data: any): Observable<any> {
    return this.appserv.http.get<any>(
      this.appserv.apiUrl + '/deposit/all-articles-paginated/' + data
    );
  }

  async depositpicker() {
    const modal = this.appserv.modalCtrl.create({
      component: DepositpickerComponent,
      initialBreakpoint: 0.3,
      breakpoints: [0, 0.25, 0.3, 0.5, 0.75, 1],
    });
    (await modal).present();
  }

  /**
   * Offline Methods
   */
  addToSyncingOffline(data: any) {
    let datas: any[] = [];
    const records = localStorage.getItem('syncingDeposits');
    if (records !== null) {
      let datagotten = JSON.parse(records);
      datagotten.unshift(data);
      localStorage.setItem('syncingDeposits', JSON.stringify(datagotten));
    } else {
      //save to local storage
      datas.push(data);
      localStorage.setItem('syncingDeposits', JSON.stringify(datas));
    }
  }

  addToOffline(data: any) {
    let datas: any[] = [];
    const records = localStorage.getItem('deposits');
    if (records !== null) {
      let datagotten = JSON.parse(records);
      datagotten.unshift(data);
      localStorage.setItem('deposits', JSON.stringify(datagotten));
    } else {
      //save to local storage
      datas.push(data);
      localStorage.setItem('deposits', JSON.stringify(datas));
    }
  }

  setOfflineData(data: any) {
    localStorage.setItem('deposits', JSON.stringify(data));
  }

  getOfflineData() {
    let data: any[] = [];
    const records = localStorage.getItem('deposits');
    if (records !== null) {
      data = JSON.parse(records);
    }

    return data;
  }

  getOfflineDeposits() {
    let data: any[] = [];
    let records = localStorage.getItem('MyDeposits');
    if (records !== null) {
      data = JSON.parse(records);
    } else {
      records = localStorage.getItem('depositArticles');
      if (records !== null) {
        let funded = JSON.parse(records);
        funded.forEach((item: any) => {
          data.push(item.deposit);
        });
      }
    }

    return data;
  }

  /**
   *
   * Deposits articles bloc
   *
   */
  setOffLineDepositsArticles(data: any) {
    try {
      localStorage.setItem('newdepositArticles', OrbitEncoder.encode(data));
      localStorage.removeItem('depositArticles');
      return true;
    } catch (error) {
      this.appserv.presentToast(
        'Impossible de sauvegarder les articles du dépôt',
        'warning'
      );
      return false;
    }
  }

  getOfflineDepositsArticles() {
    let listdeposits: any[] = [];
    const records = localStorage.getItem('newdepositArticles');
    if (typeof records !== 'undefined' && records !== null) {
      listdeposits = OrbitEncoder.decode(records);
    }
    return listdeposits;
  }

  //articles deposit grouped
  setOffLinegroupDepositsArticles(data: any) {
    try {
      localStorage.setItem(
        this.appserv.setbytesToBase64('depositArticlesgrouped'),
        OrbitEncoder.encode(data)
      );
      return true;
    } catch (error) {
      this.appserv.presentToast(
        'Impossible de sauvegarder les articles du dépôt groupes',
        'warning'
      );
      return false;
    }
  }

  /**
   *
   * End deposits articles
   */

  addToOfflineDepositsArticles(data: any) {
    let list = this.getOfflineDepositsArticles();
    list = list.concat(data);
    this.setOffLineDepositsArticles(list);
    return list;
  }

  getoffarticlesbydepositkeywords(depositid: number, keyword: string) {
    let response: Articles[] = [];
    // console.log("local data",this.getOfflineDepositsArticles());
    response = this.getOfflineDepositsArticles()
      .filter(
        (service) =>
          service.deposit_id == depositid &&
          service.service.name
            .toLocaleLowerCase()
            .includes(keyword.toLocaleLowerCase())
      )
      .slice(0, 5);
    return response;
  }

  getoffarticlesbydepositcodebar(depositid: number, codebar: string) {
    let response: Articles = {};
    response = this.getOfflineDepositsArticles().find(
      (service) =>
        service.deposit_id == depositid &&
        service.service.codebar.toLocaleLowerCase() ==
          codebar.toLocaleLowerCase()
    );
    return response;
  }

  getaspecificofflinedeposit(depositId: number) {
    return this.getOfflineData().find((d) => d.id === depositId);
  }

  //Others lookup
  depositlinebydepositandservice(service: any, depositid: number) {
    let listarticles = this.getOfflineDepositsArticles();
    let response: Articles = {};

    const index = listarticles.findIndex(
      (s) =>
        s.deposit_id === depositid &&
        s.service.id === service.original.service.id
    );
    if (index === -1) {
      service.original.service.available_qte = service.quantity;
      service.original.service.deposit_id = depositid;
      const newline = {
        deposit_id: depositid,
        quantity: service.quantity,
        prices: service.original.prices,
        service: service.original.service,
      };
      listarticles.push(newline);
      this.setOffLineDepositsArticles(listarticles);
      response = newline;
    } else {
      if (service.type === 'entry') {
        listarticles[index].quantity =
          listarticles[index].quantity + service.quantity;
        listarticles[index].service.available_qte =
          listarticles[index].service.available_qte + service.quantity;
      }

      if (service.type === 'withdraw') {
        listarticles[index].quantity =
          listarticles[index].quantity - service.quantity;
        listarticles[index].service.available_qte =
          listarticles[index].service.available_qte - service.quantity;
      }

      this.setOffLineDepositsArticles(listarticles);
      response = listarticles[index];
    }

    return response;
  }

  /**
   * oFFLINE REMOVING OLD ATA
   */
  removedepositarticles() {
    localStorage.removeItem('newdepositArticles');
  }
}
