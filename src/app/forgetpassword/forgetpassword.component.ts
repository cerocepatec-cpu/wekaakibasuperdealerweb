import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,Validators,FormGroup } from '@angular/forms';
import { IonInput, NavController } from '@ionic/angular';
import { AppservicesService } from '../services/appservices.service';
import { UsersService } from '../services/users.service';
import { HttpClient } from '@angular/common/http';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss'],
})
export class ForgetpasswordComponent implements OnInit {
@ViewChild('defaultinput',{static:false}) defaultinput!: IonInput;
@ViewChild('codeInput',{static:false}) codeInput!: IonInput;
@ViewChild('newpasswordInput',{static:false}) newpasswordInput!: IonInput;
method: 'email' | 'phone' = 'email';
value: string = '';
code: string = '';
newPassword: string = '';
confirmPassword: string = '';
step: number = 1;
resetToken: string = '';
sendCodeLoading=false;
showError = false;
verifyCodeLoading=false;
resetPasswordLoading=false;
  constructor(
    public appserv:AppservicesService,
    private authserv: AuthentificationService,
    private http: HttpClient,
  ) {}

  ionViewDidEnter() {
    this.tryFocusInput();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.step === 1) {
        this.sendResetCode();
      } else if (this.step === 2) {
        this.verifyCode();
      } else if (this.step === 3) {
        this.resetPassword();
      }
    }
  }
  // Vérifie le format email
isValidEmail(email: string): boolean {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email.trim());
}

// Vérifie le format téléphone (au moins 8 chiffres)
isValidPhone(phone: string): boolean {
  const regex = /^[+]?[\d\s-]{8,15}$/;
  return regex.test(phone.trim());
}

// Vérifie la validité selon la méthode
isValidInput(): boolean {
  if (!this.value) return false;
  return this.method === 'email'
    ? this.isValidEmail(this.value)
    : this.isValidPhone(this.value);
}

// Réagit en temps réel à la saisie
onInputChange() {
  if (!this.value) {
    this.showError = false;
  } else {
    this.showError = !this.isValidInput();
  }
}

  tryFocusInput() {
    if (this.step === 1) {
      setTimeout(() => this.setFocus(this.defaultinput), 300);
    }
  }
  ngOnInit(): void {
    // Initial setup if needed
  }

  handleMethodChange($event:any){
    this.value = '';
    this.tryFocusInput();
  }

  setFocus(input: IonInput) {
    if (input) {
      setTimeout(() => {
        input.setFocus();
      },100);
    }else{
      console.warn('Input element is not available to set focus.');
    }
  }

 sendResetCode() {
  if (this.sendCodeLoading) {
    return; // Empêche les appels multiples
  }
  this.sendCodeLoading = true;
  this.showError = !this.isValidInput();

  if (this.showError) {
    this.appserv.presentToast(
      this.method === 'email'
        ? "Adresse email invalide."
        : "Numéro de téléphone invalide.",
      "danger"
    );
    this.sendCodeLoading = false;
    return;
  }
    const payload = { type: this.method, value: this.value };
    this.authserv.sendResetCode(payload).subscribe({
      next: (res: any) => {
        this.sendCodeLoading = false;
        this.appserv.presentToast(res.message);
        this.step = 2;
        setTimeout(() => {
          this.setFocus(this.codeInput);
        }, 100);
        
      },
      error: (err) =>{
        this.sendCodeLoading = false;
        this.appserv.presentToast(err.error.message);
        },
    });
}
  
verifyCode() {
  if (this.verifyCodeLoading) {
    return; // Empêche les appels multiples
  }
  this.verifyCodeLoading = true;
  const payload = { email: this.value, code: this.code };
  this.authserv.verifyCode(payload).subscribe({
    next: (res: any) => {
      this.verifyCodeLoading = false;
      if (res.message==="success") {
        this.resetToken = res.data.token; 
        this.appserv.presentToast('Code vérifié avec succès!');
        this.step = 3;
        setTimeout(() => {
          this.setFocus(this.newpasswordInput);
        }, 100);
        
      }else{
        this.verifyCodeLoading = false;
        this.appserv.presentToast(res.error,'warning');
      }
    },
    error: (err) => this.appserv.presentToast(err.error.message,'danger'),
  });
}

resetPassword() {
  if (this.resetPasswordLoading) {
    return; // Empêche les appels multiples
  }

  if (!this.newPassword || !this.confirmPassword) {
    this.appserv.presentToast('Veuillez remplir tous les champs.', 'warning');
    return;
  }

  if (this.newPassword.length < 6) {
    this.appserv.presentToast('Le mot de passe doit contenir au moins 6 caractères.', 'warning');
    return;
  }

  if (this.newPassword !== this.confirmPassword) {
    this.appserv.presentToast('Les mots de passe ne correspondent pas.', 'warning');
    return;
  }

   this.resetPasswordLoading = true;
    const payload: any = {
      token: this.resetToken?.trim(),
      password: this.newPassword,
      password_confirmation: this.confirmPassword,
    };

    if (this.method === 'email') {
      payload.email = this.value?.trim();  // si l’utilisateur a choisi email
    } else {
      payload.user_phone = this.value?.trim();  // si l’utilisateur a choisi téléphone
    }
    this.authserv.resetPassword(payload).subscribe({
      next: (res: any) => {
        this.resetPasswordLoading = false;
        this.appserv.presentToast(res.message);
        this.step = 1;
        this.appserv.route.navigateByUrl('/login');
      },
      error: (err) => {
        this.resetPasswordLoading = false;
        this.appserv.presentToast(err.error?.message || 'Erreur lors de la réinitialisation.');
      },
    });
  }

}
