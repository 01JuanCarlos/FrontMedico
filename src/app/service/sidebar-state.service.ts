import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {
  
  private isSidebarMinimized = new BehaviorSubject<boolean>(false); // Estado inicial: no minimizado
  public isSidebarMinimized$ = this.isSidebarMinimized.asObservable();

  toggleSidebar(): void {
    const currentState = this.isSidebarMinimized.value; // Obtiene el estado actual
    this.isSidebarMinimized.next(!currentState); // Cambia el estado al opuesto
  }
}
