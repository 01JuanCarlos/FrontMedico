import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LoginComponent } from "../auth/login.component";
import { NavbarComponent } from "../components/menu/navbar/navbar.component";
import { TokenService } from '../service/security/token.service';
import { ScriptsService } from '../service/scripts.service';
import { LeftSidebarComponent } from '../components/menu/left-sidebar/left-sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ NavbarComponent,LeftSidebarComponent,RouterOutlet],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})

export class IndexComponent  implements OnInit,AfterViewInit {

  
  nombreUsuario: string | null | undefined;

  constructor(
    private tokenService: TokenService, 
    private _scripts: ScriptsService
  ) 
  {  
 
   }
   ngOnInit() {
    this.nombreUsuario = this.tokenService.getUserName();
  }

  ngAfterViewInit(): void {
    this.cargarScripts();
  }

  
  cargarScripts() {
    this._scripts.cargar([
      'app.min',
      'vendor.min',
      'extra/xlsx.full.min',
      'vendor/handlebars.min',
      'vendor/typeahead.bundle.min',
      'extra/moment',
      'extra/moment-with-locales.min',
      'extra/toast.marly',
      'sidebar'
    ]);
  }


 
}