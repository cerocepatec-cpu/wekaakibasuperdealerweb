import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { tsParticles } from "tsparticles-engine";
import {loadSlim} from "tsparticles-slim";

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
@Input() isModal:boolean;
  constructor(private route: Router) { }

  ngOnInit() {
  }

async ngAfterViewInit() {
  await loadSlim(tsParticles);

  tsParticles.load("particle-bg", {
    background: { color: "#0b0b0f" },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "bubble" },
        onClick: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: {
        bubble: { distance: 150, size: 10, duration: 2, opacity: 0.8, color: "#ffc107" },
        repulse: { distance: 120, duration: 0.6 },
      },
    },
    particles: {
      color: { value: ["#ffc107", "#ff9800", "#ffd740"] },
      links: { enable: false },
      move: {
        enable: true,
        speed: 0.4,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" },
        attract: { enable: true, rotateX: 600, rotateY: 1200 },
      },
      number: { value: 60, density: { enable: true, area: 900 } },
      opacity: { value: 0.5, random: { enable: true, minimumValue: 0.1 } },
      shape: { type: "circle" },
      size: { value: { min: 2, max: 7 }, random: true },
    },
    detectRetina: true,
  });
}



@HostListener('window:keydown',['$event'])
  onKewDown($event:KeyboardEvent){
    if ($event.key === 'Enter') {
      this.start();
    }
  }

  start(){
    localStorage.setItem('INTRO_KEY','true');
    this.route.navigateByUrl('/login',{replaceUrl:true});
  }
}
