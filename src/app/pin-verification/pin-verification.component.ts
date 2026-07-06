import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { AppservicesService } from '../services/appservices.service';
import { ParticleService } from '../services/particle.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-pin-verification',
  templateUrl: './pin-verification.component.html',
  styleUrls: ['./pin-verification.component.scss'],
})
export class PinVerificationComponent implements OnInit {
pinDigits: string[] = ['', '', '', ''];
@ViewChildren(IonInput) pinInputs!: QueryList<IonInput>;
@ViewChild('particlesCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  constructor(private authService:AuthentificationService,public appserv:AppservicesService,private particleService:ParticleService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.particleService.init(this.canvasRef.nativeElement,{
      numParticles:120,
      glowColor:'#00e5ff',
      speedMultiplier:1.5,
    });
    setTimeout(() => this.pinInputs.first.setFocus(), 300);
  }

  @HostListener('window:keydown', ['$event'])
  async handleKeyDown(event: KeyboardEvent) {
    const topModal = await this.appserv.modalCtrl.getTop();

    if (topModal && topModal.component !== this.constructor) {
      return;
    }
    if (event.key === 'Enter') {
      this.verifyPin();
    }
  }

  ngOnDestroy(){
    this.particleService.destroy();
  }

   onInput(event: any, index: number) {
    const value = event.target.value;

    // Si un chiffre est entré, passer au suivant
    if (value && index < this.pinInputs.length - 1) {
      this.pinInputs.toArray()[index + 1].setFocus();
    }

    // Si backspace et vide -> revenir en arrière
    if (!value && index > 0) {
      this.pinInputs.toArray()[index - 1].setFocus();
    }
  }

  verifyPin() {
    const pin = this.pinDigits.join('');
    if (pin.length === 4) {
      this.authService.verifyPin({pin:pin}).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            // PIN correct
            this.appserv.modalCtrl.dismiss(pin,'success');
          } else {
            // PIN incorrect ou lockout
            const msg = res.error || '❌ PIN incorrect';
            this.appserv.presentToast(msg, 'warning');
          }
        },
        error: (err) => {
          this.appserv.presentToast('Erreur serveur', 'danger');
          console.error(err);
        }
      });
    } else {
      this.appserv.presentToast('Veuillez entrer les 4 chiffres', 'danger');
    }
  }

}
