import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  roles: Array<string> = [];

  constructor(private router: Router) {}

  private setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  private getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  public setToken(token: string): void {
    if (!this.decodeToken(token)) {
      console.error('Intento de almacenar un token inválido.');
      return;
    }
    this.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null  {
    return this.getItem(TOKEN_KEY);
  }

  public getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    return decoded?.sub || null;
  }

  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token){
      return true;
    }
    
    const decoded = this.decodeToken(token);
    if (!decoded || typeof decoded.exp !== 'number'){
      return true;
    }
      

    return decoded.exp < Math.floor(Date.now() / 1000);
  }

  public decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('El token no tiene el formato correcto de JWT.');
        return null;
      }
  
      const payload = parts[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
  
  public getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) {
      console.warn('No hay token disponible.');
      return [];
    }
  
    const decoded = this.decodeToken(token);
    if (decoded && decoded.roles) { // Verifica si la clave "roles" está presente
      return decoded.roles;
    }
  
    console.warn('No se encontraron roles en el token.');
    return [];
  }
  

  
  public logOut(): void {
    console.log('Cerrando sesión...');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(AUTHORITIES_KEY);
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }
}
