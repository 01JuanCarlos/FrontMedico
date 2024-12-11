import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcedimientoService {
  private apiUrl = 'http://localhost:9099/api/app/'; // URL base de tu API

  constructor(private http: HttpClient) { }

  // Método para obtener procedimientos activos por local
  obtenerActivosPorLocal(localid: number): Observable<any> {
    const url = `${this.apiUrl}procedimientos/activos_por_local/${localid}`;
    return this.http.get(url)
  }


}
