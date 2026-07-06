import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const roles = localStorage.getItem('roles');
    const permissions = localStorage.getItem('permissions');

    if (!roles || !permissions) {
      console.warn('🚫 Aucun rôle/permission trouvé');
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
