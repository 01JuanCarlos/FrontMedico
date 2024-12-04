import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Local } from '../../models/local';

@Injectable({
  providedIn: 'root'
})
export class LocalesService {

  apiURL = 'http://localhost:9099/api/app/';

  constructor(private http: HttpClient) { }

  // Obtener todos los locales
  obtenerLocales(): Observable<Local[]> {
    const url = `${this.apiURL}locales`;
    return this.http.get<Local[]>(url);
  }

  // Crear un nuevo local
  crearLocal(local: Local): Observable<Local> {
    const url = `${this.apiURL}locales`;
    return this.http.post<Local>(url, local);
  }

  obtenerLocalPorId(id: number): Observable<Local> {
    const url = `${this.apiURL}locales/${id}`;
    return this.http.get<Local>(url);
  }
  

}
