import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../service/entities/usuario.service';
import { TokenService } from '../../../service/security/token.service';
import { EspecialistaService } from '../../../service/entities/especialista.service';
import { PacienteService } from '../../../service/entities/paciente.service';
import { ProcedimientoService } from '../../../service/entities/procedimiento.service';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-nueva-atencion',
  standalone: true,
  imports: [CommonModule,
    FormsModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule],
  templateUrl: './nueva-atencion.component.html',
  styleUrl: './nueva-atencion.component.css'
})
export class NuevaAtencionComponent implements OnInit {
  locales: any[] = [];
  nombreUsuario: string | null | undefined;
  especialistas: { id: number; nombres: string }[] = [];
  pacientes: { id: number; nombres: string; apellidos: string; dni: string }[] = [];
  procedimientos: any[] = [];
  //
  productoControl = new FormControl();
  productos: string[] = ['Zapatos', 'Sandalias', 'Botas', 'Zapatillas'];
  filteredProductos!: Observable<string[]>;


  constructor(private usuarioService: UsuarioService,
    private tokenservice: TokenService,
    private especialistaService: EspecialistaService,
    private pacienteService: PacienteService,
    private procedimientoService: ProcedimientoService) {

  }

  ngOnInit(): void {
    this.nombreUsuario = this.tokenservice.getUserName();
    this.obtenerusuario();
    this.obtenerEspecialistasActivos();
    this.obtenerPacienets();
    this.obtenerProcedimientos(1);
    //
    this.filteredProductos = this.productoControl.valueChanges.pipe(
      startWith(''), // Valor inicial
      map(value => this.filterProductos(value || ''))
    );
  }


  filterProductos(value: string): string[] {
    const filterValue = value.toLowerCase();
    
    // No mostrar resultados si el valor está vacío
    if (filterValue === '') {
      return [];
    }
  
    return this.productos.filter(producto => producto.toLowerCase().includes(filterValue));
  }
  


  obtenerusuario() {
    this.usuarioService.obtenerPorUserName(this.nombreUsuario!).subscribe(
      (data: any) => {
        if (data && data.locales) {
          this.locales = data.locales.map((local: any) => ({
            id: local.id,
            nombre: local.nombre,
          }));
        }
      },
      (error) => {
        console.error('Error al obtener los locales:', error);
      }
    );
  }



  obtenerEspecialistasActivos() {
    this.especialistaService.obtenerTodosActivos().subscribe({
      next: (data: any) => { // Ajusta el tipo de 'data' si es necesario
        // Si 'data' tiene los especialistas
        if (data && Array.isArray(data)) {
          // Mapear solo los campos 'id' y 'nombres'
          this.especialistas = data.map((especialista: any) => ({
            id: especialista.id,
            nombres: especialista.nombres,
          }));
        }
      },
      error: (err) => {
        console.error('Error al obtener especialistas activos:', err);
      },
    });
  }

  obtenerPacienets() {
    this.pacienteService.obtenerTodos().subscribe({
      next: (data: any) => {
        if (data && Array.isArray(data)) {
          this.pacientes = data.map((paciente: any) => ({
            id: paciente.id,
            nombres: paciente.nombres,
            apellidos: paciente.apellidos,
            dni: paciente.dni
          }));
          console.log('Pacientes: ', this.pacientes); // Imprimir en la consola
        }
      },
      error: (err) => {
        console.error('Error al obtener pacientes:', err);
      },
    });
  }


  obtenerProcedimientos(localid: number): void {
    this.procedimientoService.obtenerActivosPorLocal(localid).subscribe(
      (data) => {
        this.procedimientos = data;
        console.log('Procedimientos activos:', this.procedimientos);
      },
      (error) => {
        console.error('Error al obtener procedimientos:', error);
      }
    );
  }

}