import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../../models/paciente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiURL = 'http://localhost:9099/api/app/pacientes/';

  constructor(private http: HttpClient) {}

  crearPaciente(paciente: Paciente, fechanacimiento: string): Observable<Paciente> {
    const url = `${this.apiURL}/${fechanacimiento}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Paciente>(url, paciente, { headers });
  }

 
  obtenerTodos(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiURL}`);
  }

  obtenerPacientesPorLocal(localId: number): Observable<Paciente[]> {
    const url = `${this.apiURL}porlocal/${localId}`;
    return this.http.get<Paciente[]>(url);
  }
}