import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [FormsModule ],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.css'
})
export class RightSidebarComponent implements OnInit {
  isDarkMode: boolean = true; // Por defecto activado

  ngOnInit(): void {
  }


}
