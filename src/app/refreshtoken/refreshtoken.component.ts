import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppservicesService } from '../services/appservices.service';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-refreshtoken',
  templateUrl: './refreshtoken.component.html',
  styleUrls: ['./refreshtoken.component.scss'],
})
export class RefreshtokenComponent implements OnInit {
  form = this.fb.group({
    password: ['', Validators.required],
  });
  loading = false;

  constructor(
    private fb: FormBuilder,
    private appserv: AppservicesService,
    private authserv: AuthentificationService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.initParticleEffect();
  }

  @HostListener('window:keydown', ['$event'])
  async handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.validatePassword();
    }
  }

  async validatePassword() {
    if (!this.appserv.getactualuser() || !this.authserv.getRefreshToken()) {
      this.authserv.logout();
      return;
    }
    if (this.form.invalid) return;
    this.loading = true;
    this.authserv.refreshToken(this.form.value.password).subscribe({
      next: async (res) => {
        this.loading = false;
        if (res.message === 'success' && res.status === 200) {
          this.appserv.presentToast('Jeton rafraîchi avec succès !', 'success');
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('expires_in', res.data.expires_in.toString());
          localStorage.setItem('token_created_at', Date.now().toString());
          this.appserv.closemodal();
          const modal = await this.appserv.modalCtrl.getTop();
          if (modal) {
            await modal.dismiss({
              success: true,
              password: this.form.value.password,
            });
          } else {
            this.appserv.closemodal();
          }
        } else {
          this.appserv.closemodal();
          this.appserv.presentToast(
            `Échec du rafraîchissement. ${res.error}`,
            'warning'
          );
          this.authserv.logout();
        }
      },
      error: (err) => {
        console.error('Erreur lors du rafraîchissement du jeton :', err);
        this.loading = false;
        this.appserv.presentToast(
          'Échec du rafraîchissement du jeton. Veuillez réessayer.',
          'danger'
        );
      },
    });
  }

  private initParticleEffect() {
    const canvas = document.getElementById(
      'securityParticles'
    ) as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let particles: any[] = [];

    // 🎯 Adaptation automatique selon la taille de l’écran
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    const numParticles = isMobile ? 50 : width > 1600 ? 160 : 100;
    const speedMultiplier = isMobile ? 1.2 : 1.8;
    const glowIntensity = isMobile ? 0.9 : 1.3;
    const linkDistance = isMobile ? 100 : 140;

    // 📏 Ajuste la taille du canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 🌌 Création des particules
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7 * speedMultiplier,
        vy: (Math.random() - 0.5) * 0.7 * speedMultiplier,
        radius: Math.random() * 1.8 + 1.2,
      });
    }

    // 💎 Effet principal
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 3
        );
        gradient.addColorStop(0, `rgba(0, 229, 255, ${0.9 * glowIntensity})`);
        gradient.addColorStop(1, `rgba(0, 229, 255, 0)`);
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 🌐 Lignes de connexion
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDistance) {
            ctx.strokeStyle = `rgba(0, 229, 255, ${
              (1 - dist / linkDistance) * 0.5 * glowIntensity
            })`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    draw();
  }

  reconnectMe() {
    this.authserv.clearSession();
    this.appserv.closemodal();
    this.appserv.route.navigateByUrl('/login');
  }
}
