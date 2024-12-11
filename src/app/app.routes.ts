import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { LoginGuardServiceService } from './guards/login-guard-service.service';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { IndexComponent } from './index/index.component';
import { AgendaCitasComponent } from './components/agenda-citas/agenda-citas.component';
import { NuevaAtencionComponent } from './components/atenciones/nueva-atencion/nueva-atencion.component';
import { AtencionesComponent } from './components/atenciones/atenciones/atenciones.component';

export const routes: Routes = [
  { path: '', component: IndexComponent ,canActivate: [AuthGuardService],
     children: [
    { path: '', component: AgendaCitasComponent, data: { title: 'Gestion de Citas' } } ,
    { path: 'citas', component: AgendaCitasComponent, data: { title: 'Agenda de Citas' } } ,
    { path: 'usuarios', component: UsuariosComponent, data: { title: 'Gestion de Usuararios' } },
    { path: 'nueva-atencion', component: NuevaAtencionComponent, data: { title: 'Nueva Atención' } },
    { path: 'atenciones', component: AtencionesComponent, data: { title: 'Gestion de Atenciones' } } 
  ]},
  { path: 'login', component: LoginComponent, canActivate: [LoginGuardServiceService]},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
