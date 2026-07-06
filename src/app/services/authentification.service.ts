import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { AppservicesService } from './appservices.service';
import { Router } from '@angular/router';
import { PinVerificationComponent } from '../pin-verification/pin-verification.component';
const TOKEN_KEY='my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
isAuthentificated : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
token='';

constructor(public appserv: AppservicesService,private route : Router) { this.loadToken();}

 verifyPin(data: any):Observable<any> {
    return this.appserv.http.post<any>(this.appserv.apiUrl + '/verify-pin',data);
}

sendResetCode(payload:any):Observable<any>{
  return this.appserv.http.post(this.appserv.apiUrl + '/password/forgot', payload);
}

verifyCode(payload:any):Observable<any>{
  return this.appserv.http.post(this.appserv.apiUrl + '/password/verify',payload);
}

resetPassword(payload:any):Observable<any>{
  return this.appserv.http.post(this.appserv.apiUrl + '/password/reset', payload);
}

/** Vérifie si un utilisateur est connecté */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

    /** Retourne les rôles stockés */
  getRoles(): string[] {
    const roles = localStorage.getItem('roles');
    try {
      return roles ? JSON.parse(roles) : [];
    } catch (e) {
      console.error('Erreur parsing roles:', e);
      return [];
    }
  }

   /** Retourne les permissions stockées */
  getPermissions(): string[] {
    const permissions = localStorage.getItem('permissions');
    try {
      return permissions ? JSON.parse(permissions) : [];
    } catch (e) {
      console.error('Erreur parsing permissions:', e);
      return [];
    }
  }

    /** Vérifie si l'utilisateur a un rôle spécifique */
  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  /** Vérifie si l'utilisateur a une permission spécifique */
  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  /** Nettoyer la session localStorage */
  clearSession() {
    const AUTH_KEYS = ['actualUser','TOKEN_KEY','access_token','refresh_token','permission','permissions','refresh_expires_at','expires_in','token_created_at','roles','actualEnterprise'];
    AUTH_KEYS.forEach(k => localStorage.removeItem(k));
  }

  /** Réinitialise si roles/permissions invalides */
  validateSessionIntegrity() {
    const roles = localStorage.getItem('roles');
    const permissions = localStorage.getItem('permissions');

    if (!roles || !permissions) {
      console.warn('⚠️ Session invalide : rôles ou permissions absents.');
      this.clearSession();
      return false;
    }

    try {
      JSON.parse(roles);
      JSON.parse(permissions);
      return true;
    } catch (e) {
      console.error('⚠️ Session corrompue : réinitialisation.');
      this.clearSession();
      return false;
    }
  }

  async loadToken(){
    const token = await localStorage.getItem('TOKEN_KEY');
    if(token && token!=null ){
      //console.log('set token',token);
      this.token=token;
      this.isAuthentificated.next(true);
    }else{
      this.isAuthentificated.next(false);
    }
  }

  login(credentials:any):Observable<any>{
      return this.appserv.http.post(this.appserv.apiUrl +'/login',credentials);
  }   
  
  refreshToken(password:any):Observable<any>{
    let refreshtoken = this.getRefreshToken();
    return this.appserv.http.post(this.appserv.apiUrl +'/refresh',{refresh_token:refreshtoken,password:password});
  } 
  
  me():Observable<any>{
    let token = this.getToken();
    return this.appserv.http.get(this.appserv.apiUrl +'/me');
  } 
  
  loginv2(credentials:any):Observable<any>{
      return this.appserv.http.post(this.appserv.apiUrl +'/v2/users/login',credentials);
  }

 logoutactualuser(token: string): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return this.appserv.http.post(
      this.appserv.apiUrl + '/logout',
      {},
      { headers }
    );
  }

  logout(): void {
    console.log('Inside logout by token');
    const token = this.getToken();
    if (token) {
        this.logoutactualuser(token).subscribe({
        next: (response) => {
          this.appserv.closemodal();
          console.log('Déconnexion réussie côté serveur',response);
          if (response.message==='success' && response.status===200) {
            this.clearSession();
            this.route.navigateByUrl('/login');
          }else{
            this.appserv.presentToast('Erreur lors de la déconnexion. '+response.error,'warning');
            this.clearSession();
            this.route.navigateByUrl('/login');
          }
        },
        error: (err) => {
          console.error('Erreur lors de la déconnexion côté serveur', err);
          this.appserv.presentToast('Déconnexion échouée. '+ JSON.stringify(err) ,'danger');
          this.appserv.closemodal();
          // Même nettoyage et redirection même en cas d'erreur
          this.clearSession();
          this.route.navigateByUrl('/uzisha');
        }});
    }else{
      console.log('Aucun token trouvé, simple redirection vers login');
      this.route.navigateByUrl('/login');
    }
  }
 
  getingEseInfos(userid:any):Observable<any>{
    return this.appserv.http.get<any>(this.appserv.apiUrl + '/enterprises/getinfos/'+userid);
  }

  getToken(){
    const token =localStorage.getItem('access_token');
    if(token && token!=null ){
      return token;
    }else{
      return null;
    }
  } 
  
  getRefreshToken(){
    const token =localStorage.getItem('refresh_token');
    if(token && token!=null ){
      return token;
    }else{
      return null;
    }
  }

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  async callPinModal(): Promise<boolean> {
    const modal = await this.appserv.modalCtrl.create({
      component: PinVerificationComponent,
      cssClass: 'modal-border-radius-20'
    });

    await modal.present();

    const res = await modal.onDidDismiss();

    if (res.role === 'success' && res.data && res.data.length === 4) {
      return res.data; // ✅ le PIN est bien renvoyé
    } else {
      return false; // ✅ sinon, on renvoie null
    }
  }

}
