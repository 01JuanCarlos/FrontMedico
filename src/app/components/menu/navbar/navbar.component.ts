import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../service/security/token.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SidebarStateService } from '../../../service/sidebar-state.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  title: string = 'Default Title'; // Título inicial

  rol:string[] | undefined
  nombreCompleto: string | null | undefined;
  nombreUsuario: string | null | undefined;
  isLogged: boolean = false;  // Declarar la propiedad

  constructor
  ( public tokenservice: TokenService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.nombreUsuario = this.tokenservice.getUserName();
    this.rol = this.tokenservice.getUserRoles(); 
    console.log('Roles del usuario:', this.rol);
    this.checkSession();


   // Actualizar título al cargar el componente
   this.setTitleFromRoute();

     // Escuchar eventos de navegación y actualizar el título
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.getTitleFromRoute())
      )
      .subscribe((title: string | undefined) => {
        this.title = title || 'Default Title';
      });

  }

 // Método para establecer el título al cargar
 private setTitleFromRoute(): void {
  const title = this.getTitleFromRoute();
  this.title = title || 'Default Title';
}

// Método para obtener el título de la ruta activa
private getTitleFromRoute(): string | undefined {
  let route = this.activatedRoute.firstChild;
  while (route?.firstChild) {
    route = route.firstChild;
  }
  return route?.snapshot.data['title'];
}

  checkSession() {
    // Verifica si el usuario está autenticado
    /*if (this.tokenservice.getToken() && !this.tokenservice.isTokenExpired()) {
      this.isLogged = true;
      this.roles = this.tokenservice.getAuthorities();
    } else {
      this.isLogged = false;
    }*/
  }
  // Método para cerrar sesión
  onLogout(): void {
    this.tokenservice.logOut(); // Llama al servicio AuthService para cerrar sesión
    this.router.navigate(['/login']);
  }
}
