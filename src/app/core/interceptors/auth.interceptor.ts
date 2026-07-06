// import { Injectable } from '@angular/core';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpErrorResponse
// } from '@angular/common/http';
// import { Observable, throwError, BehaviorSubject } from 'rxjs';
// import { catchError, switchMap, filter, take } from 'rxjs/operators';
// import { AuthentificationService } from 'src/app/services/authentification.service';
// import { Router } from '@angular/router';
// import { AppservicesService } from 'src/app/services/appservices.service';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   private isRefreshing = false;
//   private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

//   constructor(private authService:AuthentificationService, private router: Router,private appserv:AppservicesService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = this.authService.getToken();
//     const excludedRoutes = ['/login', '/register', '/forgot-password','logout'];
//     const isExcluded = excludedRoutes.some(route => req.url.includes(route));

//     let clonedReq = req;
//     if (token && !isExcluded) {
//       clonedReq = this.addTokenHeader(req, token);
//     }

//     return next.handle(clonedReq).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401 && !isExcluded) {
//           return this.handle401Error(clonedReq, next);
//         }
//         return throwError(() => error);
//       })
//     );
//   }

//   private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
//     return request.clone({
//       setHeaders: { Authorization: `Bearer ${token}` }
//     });
//   }

//   private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     if (!this.isRefreshing) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);

//       const refreshToken = this.authService.getRefreshToken();
//       if (!refreshToken) {
//         this.appserv.presentToast('Votre session a expiré. Veuillez vous reconnecter.','warning');
//         this.authService.logout();
//         return throwError(() => new Error('No refresh token'));
//       }

//       return this.authService.refreshToken({}).pipe(
//         switchMap((res: any) => {
//           this.isRefreshing = false;
//           this.authService.saveTokens(res.access_token, res.refresh_token);
//           this.refreshTokenSubject.next(res.access_token);
//           return next.handle(this.addTokenHeader(request, res.access_token));
//         }),
//         catchError(err => {
//           this.isRefreshing = false;
//            this.appserv.presentToast('Votre session a expiré. Veuillez vous reconnecter.','warning');
//           this.authService.logout();
//           return throwError(() => err);
//         })
//       );
//     } else {
//       return this.refreshTokenSubject.pipe(
//         filter(token => token !== null),
//         take(1),
//         switchMap(token => next.handle(this.addTokenHeader(request, token!)))
//       );
//     }
//   }
// }
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { AppservicesService } from 'src/app/services/appservices.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthentificationService, private appserv: AppservicesService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const excludedRoutes = ['/login', '/register', '/forgot-password','logout'];
    const isExcluded = excludedRoutes.some(route => req.url.includes(route));

    let clonedReq = req;
    if (token && !isExcluded) {
      clonedReq = this.addTokenAndPinHeader(req, token);
    }

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !isExcluded) {
          return this.handle401Error(clonedReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenAndPinHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    const headersConfig: any = {
      Authorization: `Bearer ${token}`
    };

    // Ajoute le PIN dans le header si présent dans le body
    const body: any = request.body;
    if (body && body.pin) {
      headersConfig['X-User-Pin'] = body.pin;

      // Optionnel : supprimer le PIN du body pour plus de sécurité
      // const newBody = { ...body };
      // delete newBody.pin;
      // request = request.clone({ body: newBody });
    }

    return request.clone({ setHeaders: headersConfig });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefreshToken();
      if (!refreshToken) {
        this.appserv.presentToast('Votre session a expiré. Veuillez vous reconnecter.', 'warning');
        this.authService.logout();
        return throwError(() => new Error('No refresh token'));
      }

      return this.authService.refreshToken({}).pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          this.authService.saveTokens(res.access_token, res.refresh_token);
          this.refreshTokenSubject.next(res.access_token);
          return next.handle(this.addTokenAndPinHeader(request, res.access_token));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.appserv.presentToast('Votre session a expiré. Veuillez vous reconnecter.', 'warning');
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addTokenAndPinHeader(request, token!)))
      );
    }
  }
}
