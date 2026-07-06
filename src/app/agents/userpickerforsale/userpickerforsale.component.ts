import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { Users } from 'src/app/interfaces/users';
import { AppservicesService } from 'src/app/services/appservices.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-userpickerforsale',
  templateUrl: './userpickerforsale.component.html',
  styleUrls: ['./userpickerforsale.component.scss'],
})
export class UserpickerforsaleComponent implements OnInit {
  @ViewChild('defaultinput') defaultinput: IonInput;
  @Input() multiselect: any;
  listusers: Users[] = [];
  selectedusers: Users[] = [];
  search: any;
  showprogress = false;

  constructor(
    private Userserv: UsersService,
    public appserv: AppservicesService,
    private userserv: UsersService
  ) {}

  ngOnInit() {}
  ionViewDidEnter() {
    this.defaultinput.setFocus();
  }

  handlesearchchange($event) {
    if (this.search.length > 0) {
      this.showprogress = true;
      this.Userserv.memberslookupfornotebooksale({
        enterprise_id: this.appserv.actualEse.id,
        keyword: this.search,
      }).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status !== 200) {
            this.appserv.presentToast(res.error, 'danger');
          } else {
            this.showprogress = false;
            this.listusers = res.data.map((user: any) => {
              const isAlreadySelected = this.selectedusers.some(
                (selected) => selected.id === user.id
              );
              return {
                ...user,
                selected: isAlreadySelected,
              };
            });
          }
        },
        error: (err) => {
          this.showprogress = false;
          this.appserv.presentToast(err.error,'danger');
          console.log('error members lookup', err);
        },
      });
    } else {
      this.listusers = [];
    }
  }

  sendList() {
    this.sendselecteduser();
  }

  selected(user: Users) {
    if (this.multiselect > 0) {
      const ifexists = this.selectedusers.find((u) => u.id === user.id);
      if (!ifexists) {
        this.selectedusers.push(user);
        user.selected = true;
      } else {
        this.selectedusers = this.selectedusers.filter((u) => u != user);
        user.selected = false;
      }
    } else {
      this.appserv.modalCtrl.dismiss(user, 'selected');
    }
  }

  sendselecteduser() {
    this.appserv.modalCtrl.dismiss(this.selectedusers, 'selected');
  }
}
