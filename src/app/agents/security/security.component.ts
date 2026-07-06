import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Users } from 'src/app/interfaces/users';
import { AppservicesService } from 'src/app/services/appservices.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  @Input() usersent: Users = {};
  oldpassword: string = '';
  password1: string = '';
  password2: string = '';
  showsaving = false;
  showsecondpasswords = false;
  showprogress = false;

  constructor(
    private authserv: AuthentificationService,
    public appserv: AppservicesService,
    private formbuild: FormBuilder,
    private agentserv: UsersService
  ) {}

  ngOnInit() {}

  async checkoldpassword() {
    if (this.oldpassword === this.usersent.user_password) {
      this.showsecondpasswords = true;
    } else {
      this.showsecondpasswords = false;
    }
  }

  async syncingdata() {
    if (this.password1 && this.password2) {
    } else {
      this.appserv.presentToast(
        `Veuillez entrer le nouveau mot de passe svp.`,
        'warning'
      );
    }
  }

  async checknewpasswords() {
    if (
      this.password1 === this.password2 &&
      this.password1 &&
      this.password2 &&
      this.password1.length > 0 &&
      this.password2.length > 0
    ) {
      if (this.oldpassword === this.password1) {
        this.appserv.presentToast(`Aucune modification éffectuée`, 'warning');
      } else {
        this.showsaving = true;
      }
    } else {
      this.showsaving = false;
    }
  }

  async resetPassword() {
    const alert = await this.appserv.alertctrl.create({
      header: 'Réinitialisation mot de passe',
      subHeader: this.usersent.user_name,
      message: 'Confirmez-vous cette action?',
      mode: 'ios',
      translucent: true,
      buttons: [
        { text: 'Non', role: 'cancel' },
        {
          text: 'Oui',
          handler: async () => {
            const pin: any = await this.authserv.callPinModal();
            if (!pin || pin.length < 4) {
              this.appserv.presentToast(
                'Aucun ou mauvais Pin fourni svp!',
                'warning'
              );
              return;
            }
            this.showprogress = true;
            this.agentserv
              .resetpassword({
                user_id: this.usersent.id,
                user_password: 'weka1234',
              })
              .subscribe({
                next: (response) => {
                  this.showprogress = false;
                  if (
                    response.status === 200 &&
                    response.message === 'success'
                  ) {
                    this.appserv.presentToast(
                      `Le mot de passe a été réinialisé et envoyé via ${response.data.notification_channel}. Prière demander à l'utilisateur de se reconnecter et si c'est votre compte, réconnectez-vous svp!.`,
                      'success'
                    );
                  } else {
                    this.appserv.presentToast(
                      `Erreur survenue lors de la reinitialisation du mot de passe.`,
                      'warning'
                    );
                  }
                },
                error: (err) => {
                  this.showprogress = false;
                  this.appserv.presentToast(
                    `Réinitialisation échouée. Veuillez vérifier votre connexion`,
                    'danger'
                  );
                },
              });
          },
        },
      ],
    });
    alert.present();
  }

  async edituser() {
    this.showprogress = true;
    this.agentserv
      .edithagentpassword({
        user_id: this.usersent.id,
        user_password: this.password1,
      })
      .subscribe(
        (data) => {
          this.showprogress = false;
          this.usersent.user_password = data.user_password;
          this.appserv.presentToast(
            `Votre mot de passe est modifié avec succès`,
            'success'
          );
          this.appserv.modalCtrl.dismiss(data, 'edited');
        },
        (error) => {
          this.showprogress = false;
          this.appserv.presentToast(
            `Modification impossible. Veuillez vérifier votre connexion`,
            'danger'
          );
        }
      );
  }
}
