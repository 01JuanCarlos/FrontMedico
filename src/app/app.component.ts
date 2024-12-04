import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftSidebarComponent } from "./components/menu/left-sidebar/left-sidebar.component";
import { NavbarComponent } from "./components/menu/navbar/navbar.component";
import { LoginComponent } from './auth/login.component';
import { RightSidebarComponent } from './components/menu/right-sidebar/right-sidebar.component';
import { TokenService } from './service/security/token.service';
import { ScriptsService } from './service/scripts.service';
import { IndexComponent } from "./index/index.component";
import { JwtDTO } from './models/jwt-dto';
import { AuthService } from './service/security/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  
}