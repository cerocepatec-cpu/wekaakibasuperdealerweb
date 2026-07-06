import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { AppservicesService } from 'src/app/services/appservices.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { UsersService } from 'src/app/services/users.service';
import { tsParticles } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';
@Component({
  selector: 'app-editagent',
  templateUrl: './editagent.component.html',
  styleUrls: ['./editagent.component.scss'],
})
export class EditagentComponent implements OnInit {
  @ViewChild('emailInput', { static: false }) emailInput!: IonInput;
  @ViewChild('phoneInput', { static: false }) phoneInput!: IonInput;
  @ViewChild('fullnameInput', { static: false }) fullnameInput!: IonInput;
  @ViewChild('oldPinInput', { static: false }) oldPinInput!: IonInput;
  @ViewChild('oldPasswordInput', { static: false }) oldPasswordInput!: IonInput;
  @ViewChild('PinpasswordInput', { static: false }) PinpasswordInput!: IonInput;
  requiredFields = ['email', 'fullname', 'phone'];

  pinforgot: boolean = false;
  selectedTab = 'email';
  form = {
    email: '',
    oldPin: '',
    newPin: '',
    confirmPin: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    phone: '',
    name: '',
    Pinpassword: '',
  };
  particlesOptions: any;
  actualuser: any = this.appserv.getactualuser();
  constructor(
    public appserv: AppservicesService,
    private userService: UsersService,
    public authserv: AuthentificationService
  ) {}

  ngOnInit(): void {
    this.form.email = this.appserv.getactualuser().email;
    this.form.phone = this.appserv.getactualuser().user_phone;
    this.form.name = this.appserv.getactualuser().name;

    this.selectedTab = this.getNextIncompleteField();
  }

  getNextIncompleteField(): string {
    const user = this.appserv.getactualuser();

    if (!user?.email) return 'email';
    if (!user?.name) return 'fullname';
    if (!user?.user_phone) return 'phone';

    return 'email';
  }

  isProfileComplete(): boolean {
    const user = this.appserv.getactualuser();
    return !!(user?.email && user?.name && user?.user_phone);
  }

  completedRequiredCount(): number {
    const user = this.appserv.getactualuser();
    let count = 0;

    if (user?.email) count++;
    if (user?.name) count++;
    if (user?.user_phone) count++;

    return count;
  }

  completionPercent(): number {
    return (this.completedRequiredCount() / this.requiredFields.length) * 100;
  }

  moveToNextMissingField(): void {
    this.actualuser = this.appserv.getactualuser();

    if (this.isProfileComplete()) {
      this.appserv.presentToast('Profil complété avec succès ✅');
      setTimeout(() => {
        this.appserv.closemodal();
      }, 400);
      return;
    }

    const nextTab = this.getNextIncompleteField();
    this.tabChange(nextTab);
  }
  setFocus(input: IonInput) {
    setTimeout(() => {
      input.setFocus();
    }, 100);
  }

  tabChange(tab: string) {
    this.selectedTab = tab;
    setTimeout(() => {
      switch (tab) {
        case 'email':
          if (this.emailInput) this.setFocus(this.emailInput);
          break;
        case 'pin':
          if (!this.pinforgot) {
            if (this.oldPinInput) this.setFocus(this.oldPinInput);
          } else {
            if (this.PinpasswordInput) this.setFocus(this.PinpasswordInput);
          }
          break;
        case 'password':
          if (this.oldPasswordInput) this.setFocus(this.oldPasswordInput);
          break;
        case 'phone':
          if (this.phoneInput) this.setFocus(this.phoneInput);
          break;
        case 'fullname':
          if (this.fullnameInput) this.setFocus(this.fullnameInput);
          break;
      }
    }, 50);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const actualUser = this.appserv.getactualuser();
      switch (this.selectedTab) {
        case 'email':
          if (this.isDifferent('email', actualUser.email)) {
            this.updateEmail();
          } else {
            this.appserv.presentToast(
              'Aucune modification détectée sur l’adresse email.'
            );
          }
          break;

        case 'pin':
          if (this.form.newPin && this.form.newPin !== actualUser.pin) {
            this.updatePin();
          } else {
            this.appserv.presentToast(
              'Le nouveau code PIN doit être différent de l’ancien.'
            );
          }
          break;

        case 'password':
          if (
            this.form.newPassword &&
            this.form.newPassword !== this.form.oldPassword
          ) {
            this.updatePassword();
          } else {
            this.appserv.presentToast(
              'Le nouveau mot de passe doit être différent de l’ancien.'
            );
          }
          break;

        case 'phone':
          if (this.isDifferent('phone', actualUser.user_phone)) {
            this.updatePhone();
          } else {
            this.appserv.presentToast(
              'Aucune modification détectée sur le numéro de téléphone.'
            );
          }
          break;

        case 'fullname':
          if (this.isDifferent('name', actualUser.name)) {
            this.updateFullname();
          } else {
            this.appserv.presentToast(
              'Aucune modification détectée sur le nom complet.'
            );
          }
          break;

        default:
          this.appserv.presentToast('Aucun champ sélectionné.');
          break;
      }
    }
  }

  /**
   * 🔍 Vérifie si la valeur du formulaire est différente de celle de l’utilisateur actuel
   * @param field Nom du champ dans le formulaire
   * @param currentValue Valeur actuelle provenant de l’utilisateur
   */
  private isDifferent(
    field: keyof typeof this.form,
    currentValue: any
  ): boolean {
    const newValue = this.form[field]?.trim?.() || this.form[field];
    return newValue !== (currentValue?.trim?.() || currentValue);
  }
  async ngAfterViewInit() {
    // Initialiser tsParticles
    await loadSlim(tsParticles);

    tsParticles.load('particle-bg', {
      background: { color: 'transparent' },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'repulse' },
          onClick: { enable: true, mode: 'push' },
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
          push: { quantity: 4 },
        },
      },
      particles: {
        color: { value: '#00e5ff' }, // Néon bleu pour style futuriste
        links: {
          color: '#00e5ff',
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: { enable: true, speed: 1.5, outModes: { default: 'bounce' } },
        number: { value: 70 },
        opacity: { value: 0.3 },
        shape: { type: 'circle' },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    });
  }

  async showAlert(msg: string) {
    const alert = await this.appserv.alertctrl.create({
      header: '🔒 Sécurité',
      message: msg,
      cssClass: 'secure-alert',
      buttons: ['OK'],
    });
    await alert.present();
  }

  syncingofflinedata(data: any) {
    this.appserv.setactualuser(data);
    this.actualuser = this.appserv.getactualuser();
    this.moveToNextMissingField();
  }

  updateFullname(): void {
    if (!this.form.name) {
      this.appserv.presentToast('Veuillez saisir votre nom complet svp!');
      return;
    }

    this.userService.updateUser({ name: this.form.name }).subscribe({
      next: (res) => {
        if (res.message === 'success' && res.status === 200) {
          this.appserv.presentToast(
            'Le nom complet a été mis à jour avec succès ✅'
          );
          this.syncingofflinedata(res.data);
        } else {
          this.appserv.presentToast(res.error, 'warning');
        }
      },
      error: (err) =>
        this.appserv.presentToast(
          err.error.error || 'Erreur lors de la mise à jour'
        ),
    });
  }

  updateEmail(): void {
    if (!this.form.email) {
      this.appserv.presentToast('Veuillez saisir un email');
      return;
    }

    this.userService.updateUser({ email: this.form.email }).subscribe({
      next: (res) => {
        if (res.message === 'success' && res.status === 200) {
          this.appserv.presentToast(
            'Adresse e-mail mise à jour avec succès ✅'
          );
          this.syncingofflinedata(res.data);
        } else {
          this.appserv.presentToast(res.error, 'warning');
        }
      },
      error: (err) => {
        console.log('Erreur update email', err);
        this.appserv.presentToast(
          err.error.error || 'Erreur lors de la mise à jour'
        );
      },
    });
  }

  resetpin() {
    this.pinforgot = !this.pinforgot;
    if (this.pinforgot) {
      setTimeout(() => {
        this.setFocus(this.PinpasswordInput);
      }, 50);
    } else {
      setTimeout(() => {
        this.setFocus(this.oldPinInput);
      }, 50);
    }
  }

  validateresetpin() {
    if (!this.form.Pinpassword) {
      this.appserv.presentToast('Veuillez saisir votre mot de passe');
      return;
    }

    if (this.form.newPin !== this.form.confirmPin) {
      this.appserv.presentToast('Les deux PIN ne correspond pas!');
      return;
    }

    this.userService
      .resetpin({
        current_password: this.form.Pinpassword,
        new_pin: this.form.newPin,
      })
      .subscribe({
        next: (res) => {
          //console.log('On reset PIN',res);
          if (res.message === 'success' && res.status === 200) {
            this.appserv.presentToast(
              'Votre PIN a été réinitialisé avec succès ✅'
            );
            this.syncingofflinedata(res.data);
            this.pinforgot = false;
          } else {
            this.appserv.presentToast(res.error, 'warning');
          }
        },
        error: (err) => {
          // console.log('',err);
          this.appserv.presentToast(
            err.error || 'Erreur lors de la réinitialisation'
          );
        },
      });
  }

  updatePin(): void {
    if (!this.pinforgot) {
      if (this.form.newPin !== this.form.confirmPin) {
        this.appserv.presentToast('PIN ne correspond pas');
        return;
      }

      this.userService
        .updateUser({
          new_pin: this.form.newPin,
          old_pin: this.form.oldPin,
          confirm_pin: this.form.confirmPin,
        })
        .subscribe({
          next: (res) => {
            //console.log('On reset PIN',res);
            if (res.message === 'success' && res.status === 200) {
              this.appserv.presentToast(
                'Votre PIN a été mis à jour avec succès ✅'
              );
              this.syncingofflinedata(res.data);
            } else {
              this.appserv.presentToast(res.error, 'warning');
            }
          },
          error: (err) => {
            // console.log('Erreur update PIN',err);
            this.appserv.presentToast(
              err.error || 'Erreur lors de la mise à jour'
            );
          },
        });
    } else {
      this.validateresetpin();
    }
  }

  updatePassword(): void {
    if (this.form.newPassword !== this.form.confirmPassword) {
      this.appserv.presentToast('Les mots de passe ne correspondent pas');
      return;
    }

    this.userService.updateUser({ password: this.form.newPassword }).subscribe({
      next: (res) => {
        if (res.message === 'success' && res.status === 200) {
          this.appserv.presentToast(
            'Votre mot de passe a été mis à jour avec succès ✅'
          );
          this.appserv.closemodal();
          this.authserv.logout();
        } else {
          this.appserv.presentToast(res.error, 'warning');
        }
      },
      error: (err) =>
        this.appserv.presentToast(
          err.error.error || 'Erreur lors de la mise à jour'
        ),
    });
  }

  updatePhone(): void {
    if (!this.form.phone) {
      this.appserv.presentToast('Veuillez saisir un numéro de téléphone');
      return;
    }

    this.userService.updateUser({ user_phone: this.form.phone }).subscribe({
      next: (res) => {
        if (res.message === 'success' && res.status === 200) {
          this.appserv.presentToast(
            'Votre numéro de téléphone a été mis à jour avec succès ✅'
          );
          this.syncingofflinedata(res.data);
        } else {
          this.appserv.presentToast(res.error, 'warning');
        }
      },
      error: (err) =>
        this.appserv.presentToast(
          err.error.error || 'Erreur lors de la mise à jour'
        ),
    });
  }
}
