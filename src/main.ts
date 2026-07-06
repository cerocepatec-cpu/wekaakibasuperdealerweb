import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// ✅ Capture minimale des erreurs critiques avant qu’Angular démarre
window.addEventListener('error', (event) => {
  console.error('💥 Erreur JavaScript globale :', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('⚠️ Promesse non gérée détectée :', event.reason);
});

// ✅ Lancer Angular normalement
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error('Erreur critique lors du bootstrap Angular :', err));
