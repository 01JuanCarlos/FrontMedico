import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginUsuario } from '../models/login-usuario';
import { TokenService } from '../service/security/token.service';
import { AuthService } from '../service/security/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScriptsService } from '../service/scripts.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  isLogged = false;
  isLoginFail = false;
  loginUsuario!: LoginUsuario;
  nombreUsuario!: string;
  password!: string;
  errMsj!: string;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private _scripts: ScriptsService,
    private cdr: ChangeDetectorRef
  ) {
    this.cargarScripts();
  }

  ngAfterViewInit(): void {

  }

  cargarScripts() {
    this._scripts.cargar(['app.min', 'vendor.min']);
  }
/*
  private checkSession() {
    console.log('Verificando sesión...');
    
    if (this.tokenService.isTokenExpired()) {
      console.warn('El token ha expirado. Cerrando sesión y redirigiendo...');
      this.tokenService.logOut();
      this.isLogged = false;
      
      if (this.router.url !== '/login') {
        console.log('Redirigiendo al login...');
        this.router.navigate(['/login']);
      }
      return; // Sal de la función
    }
    
    this.isLogged = true;
    this.roles = this.tokenService.getAuthorities();
    console.log('Sesión válida. Roles:', this.roles);
  }
*/
  
  ngOnInit() {
   /* console.log('Componente inicializado');
    this.checkSession();
  
    if (this.isLogged) {
      console.log('Usuario logueado. Cargando datos...');
      this.loadUserData();
    } else {
      console.log('Usuario no logueado.');
    }
  
    window.addEventListener('storage', this.handleStorageEvent);*/
  }
  
 
  
  private loadUserData() {
    // Lógica para cargar datos del usuario
    console.log('Cargando datos del usuario...');
  }
  

  //private handleStorageEvent = () => this.checkSession();

  ngOnDestroy() {
   // window.removeEventListener('storage', this.handleStorageEvent);
  }

  onLogin(): void {
    this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);
    this.authService.login(this.loginUsuario).subscribe(
      data => {
        this.tokenService.setToken(data.token);
        this.router.navigate(['/']);
      },
      err => {
        this.isLogged = false;
        this.isLoginFail = true;
        // Si el error es por correo o contraseña incorrectos, mostramos un mensaje claro
        if (err.error && err.error.mensaje) {
          this.errMsj = err.error.mensaje;
        } else {
          this.errMsj = 'Error desconocido';
        }
        console.log(this.errMsj);  // Muestra el mensaje de error
      }
    );
  }
  
}