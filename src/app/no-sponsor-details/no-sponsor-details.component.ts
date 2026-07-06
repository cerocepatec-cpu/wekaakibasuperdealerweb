import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { AppservicesService } from '../services/appservices.service';

@Component({
  selector: 'app-no-sponsor-details',
  templateUrl: './no-sponsor-details.component.html',
  styleUrls: ['./no-sponsor-details.component.scss'],
})
export class NoSponsorDetailsComponent {

  @Input() line: any;

  sponsorId: any = null;
  collectorSearch = '';
collectorsList: any[] = [];

  constructor(
    private modalCtrl: ModalController,
     private usersServ: UsersService,
  private appserv: AppservicesService
  ) {}

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  ionViewDidEnter() {
  this.searchCollectors();
}

searchCollectors() {

  this.usersServ.memberslookup({
    enterprise_id: this.appserv.getactualEse().id,
    keyword: this.collectorSearch || '',
    role: 'collector'
  }).subscribe({
    next: (res: any) => {

      this.collectorsList = (res || []).filter((x: any) => {
        return (
          x.role === 'collector' ||
          x.user_type === 'collector' ||
          x.account_type === 'collector'
        );
      });

    },
    error: () => {
      this.collectorsList = [];
    }
  });
}

selectCollector(collector: any) {
  this.sponsorId = collector.id;
}

  confirm() {
    if (!this.sponsorId) {
      return;
    }

    this.modalCtrl.dismiss(
      {
        sponsor_id: Number(this.sponsorId),
      },
      'assign'
    );
  }
}