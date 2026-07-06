import { Injectable } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface ParticleOptions {
  numParticles?: number;
  speedMultiplier?: number;
  glowColor?: string;
  glowIntensity?: number;
  linkDistance?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ParticleService {
  private particles: Particle[] = [];
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationId: number = 0;

  // 🌟 Valeurs par défaut inspirées du modèle
  private defaults: ParticleOptions = {
    numParticles: 100,
    speedMultiplier: 1.8,
    glowColor: '#00e5ff',
    glowIntensity: 1.3,
    linkDistance: 140,
  };

  init(canvasElement: HTMLElement, options?: ParticleOptions) {
    if (!(canvasElement instanceof HTMLCanvasElement)) return;
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.particles = [];

    // Merge options avec defaults
    const opts = { ...this.defaults, ...options };

    // 🌌 Création particules
    for (let i = 0; i < opts.numParticles!; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.7 * opts.speedMultiplier!,
        vy: (Math.random() - 0.5) * 0.7 * opts.speedMultiplier!,
        radius: Math.random() * 1.8 + 1.2,
      });
    }

    // 📏 Ajuste taille canvas
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.globalCompositeOperation = 'lighter';

      // Dessin particules
      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

        const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        gradient.addColorStop(0, `rgba(${this.hexToRgb(opts.glowColor!)}, ${0.9 * opts.glowIntensity})`);
        gradient.addColorStop(1, `rgba(${this.hexToRgb(opts.glowColor!)}, 0)`);
        this.ctx.fillStyle = gradient;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        this.ctx.fill();
      });

      // Lignes de connexion
      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < opts.linkDistance!) {
            this.ctx.strokeStyle = `rgba(${this.hexToRgb(opts.glowColor!)}, ${(1 - dist / opts.linkDistance!) * 0.5 * opts.glowIntensity!})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
          }
        }
      }

      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.particles = [];
  }

  // 🔹 Convertit hex en rgb
  private hexToRgb(hex: string): string {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  }
}
