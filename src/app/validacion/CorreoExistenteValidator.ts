import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../service/security/auth.service';

export class CorreoExistenteValidator {

  /*static correoExistente(authservice: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // Si el control está vacío, no validamos nada (si lo deseas, podrías hacer otras validaciones)
      if (!control.value) {
        return of(null);
      }

      // Hacemos la llamada al servicio para verificar si el correo ya existe
      return authservice.verificarCorreo(control.value).pipe(
        debounceTime(300), // Tiempo para evitar hacer demasiadas peticiones
        switchMap((existe) => {
          return existe ? of({ correoExistente: true }) : of(null);
        }),
        catchError(() => of(null)) // En caso de error, retornamos null (no se marca como inválido)
      );
    };
  }*/
}
