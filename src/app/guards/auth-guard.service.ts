import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../service/security/token.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    const token = this.tokenService.getToken();
  
    if (token && !this.tokenService.isTokenExpired()) {
      return true; // Sesión válida
    } else {
      this.router.navigate(['/login']); // Redirige al login si no hay sesión
      return false;
    }
  }
  
  }
