import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rol } from '../../models/rol';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  apiURL = 'http://localhost:9099/api/app/';

  constructor(private httpClient: HttpClient) { }

  obtenerRoles(): Observable<Rol[]> {
    const url = `${this.apiURL}roles`;
    return this.httpClient.get<Rol[]>(url);
  }
  
}
