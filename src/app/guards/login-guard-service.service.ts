import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../service/security/token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardServiceService implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    if (this.tokenService.isLoggedIn()) {
      // Si ya está logueado, redirige al index
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}