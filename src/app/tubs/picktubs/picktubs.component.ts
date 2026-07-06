import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppservicesService } from 'src/app/services/appservices.service';
import { Tubs } from '../../interfaces/tubs';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-picktubs',
  templateUrl: './picktubs.component.html',
  styleUrls: ['./picktubs.component.scss'],
})
export class PicktubsComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput!: IonInput;
  @Input() multiple: boolean=false;
  @Input() typesent: any;
  listtubs: Tubs[] = [];
  listtubselected: Tubs[] = [];
  search: any;
  constructor(public appserv: AppservicesService) {}

  ngOnInit() {
    this.getlistTubs();
  }

  ionViewDidEnter() {
    this.defaultinput.setFocus();
  }

  getlistTubs() {
    this.appserv
      .myTubs(this.appserv.actualUser.id, {
        ...(this.typesent ? { type: this.typesent } : {}),
      })
      .subscribe({
        next: (data) => {
          this.listtubs = data;
        },
        error: () => {
          this.appserv.presentToast(
            'Erreur survenue lors de la recupération de la liste des caisses.',
            'danger'
          );
        },
      });
  }

  sendselected() {
    this.appserv.modalCtrl.dismiss(this.listtubselected, 'selected');
  }

  selectitem(tub: any) {
    if (this.multiple) {
      const ifexists = this.listtubselected.indexOf(tub);
      if (ifexists == -1) {
        tub.selected = true;
        this.listtubselected.push(tub);
      } else {
        tub.selected = false;
        this.listtubselected = this.listtubselected.filter((t) => t !== tub);
      }
    } else {
      this.appserv.modalCtrl.dismiss(tub, 'selected');
    }
  }
}
