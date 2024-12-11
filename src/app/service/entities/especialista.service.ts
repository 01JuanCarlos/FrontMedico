import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Especialista } from '../../models/especialista';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {
  private apiURL = 'http://localhost:9099/api/app/especialistas';

  constructor(private http: HttpClient) {}

  // Crear un nuevo especialista
  crearEspecialista(especialista: Especialista): Observable<Especialista> {
    return this.http.post<Especialista>(`${this.apiURL}`, especialista);
  }

  // Obtener todos los especialistas
  obtenerTodos(): Observable<Especialista[]> {
    return this.http.get<Especialista[]>(`${this.apiURL}`);
  }

  // Obtener todos los especialistas activos
  obtenerTodosActivos(): Observable<Especialista[]> {
    return this.http.get<Especialista[]>(`${this.apiURL}/activos`);
  }

  // Obtener especialistas por estado
  obtenerPorEstado(estatus: string): Observable<Especialista[]> {
    return this.http.get<Especialista[]>(`${this.apiURL}/por_estatus/${estatus}`);
  }

  // Obtener especialistas activos por local
  obtenerActivosPorLocal(localId: number): Observable<Especialista[]> {
    return this.http.get<Especialista[]>(`${this.apiURL}/activos_por_local/${localId}`);
  }

  // Obtener especialistas activos por local y especialidad
  obtenerActivosPorLocalYEspecialidad(
    localId: number,
    especialidad: string
  ): Observable<Especialista[]> {
    return this.http.get<Especialista[]>(
      `${this.apiURL}/activos_por_local_y_especialidad/${localId}/${especialidad}`
    );
  }

  // Obtener especialista por nombre
  obtenerPorNombre(nombre: string): Observable<Especialista> {
    return this.http.get<Especialista>(`${this.apiURL}/nombres/${nombre}`);
  }
}
