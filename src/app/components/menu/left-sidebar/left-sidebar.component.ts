import { Component } from '@angular/core';
import { SidebarStateService } from '../../../service/sidebar-state.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css'
})
export class LeftSidebarComponent {
  isMinimized = false; // Define la propiedad con su tipo explícito

  constructor(private sidebarStateService: SidebarStateService,

  ) { }

  ngOnInit() {
    // Escucha los cambios en el estado del sidebar
    this.sidebarStateService.isSidebarMinimized$.subscribe((state) => {
      this.isMinimized = state;
      console.log(this.isMinimized = state);
    });


  }

  toggleSidebar() {
    this.sidebarStateService.toggleSidebar();
  }

}
