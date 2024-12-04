import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NuevoUsuario } from '../../models/nuevo-usuario';
import { catchError, Observable, of, tap } from 'rxjs';
import { LoginUsuario } from '../../models/login-usuario';
import { JwtDTO } from '../../models/jwt-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL = 'http://localhost:9099/auth/';

  constructor(private httpClient: HttpClient) { }

   // Método para verificar si el correo ya está registrado
  /*
   verificarCorreo(email: string): Observable<boolean> {
    // Realiza la solicitud HTTP para verificar si el correo ya está registrado
    return this.httpClient.get<boolean>(`${this.authURL}/verificar-correo?email=${email}`).pipe(
      catchError(() => of(false)) // Si ocurre un error, retornamos false
    );
  }*/

    /*checkDniOrUsernameExists(value: string, userId: number): Observable<boolean> {
      // Aquí asumimos que existe una API que puede verificar si un DNI o Username existe, excluyendo al usuario actual
      return this.httpClient.get<boolean>(`check-dni-or-username`, {
        params: { value, excludeUserId: userId.toString() }
      });
    }*/

  
      
    public existsByUserName(userName: string): Observable<boolean> {
      return this.httpClient.get<boolean>(`${this.authURL}existsByUserName/${userName}`);
    }

    public existsByDNI(dni: string): Observable<boolean> {
      return this.httpClient.get<boolean>(`${this.authURL}existsByDni/${dni}`);
    }
    

  public nuevo(nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'nuevo', nuevoUsuario);
  }

  public login(loginUsuario: LoginUsuario): Observable<JwtDTO> {
    return this.httpClient.post<JwtDTO>(this.authURL + 'login', loginUsuario);
  }

  public refresh(dto: JwtDTO): Observable<JwtDTO> {
    return this.httpClient.post<JwtDTO>(this.authURL + 'refresh', dto);
  }
  
}
