import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NuevoUsuario } from '../../models/nuevo-usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  
  
  authURL = 'http://localhost:9099/usuario/';

  constructor(private httpClient: HttpClient) { }


  listarUsuarios(): Observable<any> {
    return this.httpClient.get(`${this.authURL}listar`);
  }


  

  // Método para editar un usuario
  editarUsuario(usuario: any): Observable<any> {
    return this.httpClient.put(`${this.authURL}editar/${usuario.id}`, usuario); // Incluye el ID en la URL
  }
  
  // Método para obtener un usuario por su ID
  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.httpClient.get(`${this.authURL}${id}`);
  }


  eliminarUsuario(id: number): Observable<any> {
    return this.httpClient.delete(`${this.authURL}eliminar/${id}`);
  }

  // Editar usuario parcialmente (PATCH)
  editarUsuarioParcial(id: number, usuarioActualizado: Partial<NuevoUsuario>): Observable<any> {
    return this.httpClient.patch<any>(`${this.authURL}editar/${id}`, usuarioActualizado);
  }


}
