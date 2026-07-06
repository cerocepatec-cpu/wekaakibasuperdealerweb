import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AppservicesService } from '../services/appservices.service';


@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(
    private appserv: AppservicesService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const permission = route.data['permission'];

    // 🔓 route publique
    if (!permission) {
      return true;
    }

    const { module, action } = permission;

    const allowed = this.appserv.permissionFilter(module, action);

    if (!allowed) {
      // ❌ accès refusé
      this.router.navigate(['/uzisha/forbidden']); // ou /forbidden
      return false;
    }

    return true;
  }
}
