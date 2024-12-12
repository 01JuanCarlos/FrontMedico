import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../service/entities/usuario.service';
import { TokenService } from '../../../service/security/token.service';
import { EspecialistaService } from '../../../service/entities/especialista.service';
import { PacienteService } from '../../../service/entities/paciente.service';
import { ProcedimientoService } from '../../../service/entities/procedimiento.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Especialista } from '../../../models/especialista';
import { Atencion } from '../../../models/atencion';

@Component({
  selector: 'app-nueva-atencion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule],
  templateUrl: './nueva-atencion.component.html',
  styleUrl: './nueva-atencion.component.css'
})
export class NuevaAtencionComponent implements OnInit {
  atenciones: Atencion[] =[]
  locales: any[] = [];
  nombreUsuario: string | null | undefined;
  //
  //  especialistaControl = new FormControl();
  especialistas: { id: number; nombres: string }[] = [];
  filteredEspecialistas: string[] = [];
  //
  //pacienteControl = new FormControl();
  pacientes: { id: number; fullname: string; dni: string }[] = [];
  filterPacientesList: string[] = [];
  //
  //  procedimientoControl = new FormControl();
  procedimientos: { id: number; descripcion: string, precio: number }[] = []; // Inicializar el array
  filteredProcedimientosList: string[] = [];
  //
  localid: number = 0;
  //
  precioSeleccionado: number | null = null;
  //
  registros: { procedimiento: string; precio: number, especialista: Especialista, paciente: string, localid: number }[] = [];
  formularioAtenciones!: FormGroup;

  constructor(private usuarioService: UsuarioService,
    private tokenservice: TokenService,
    private especialistaService: EspecialistaService,
    private pacienteService: PacienteService,
    private procedimientoService: ProcedimientoService) {

  }

  ngOnInit(): void {
    this.nombreUsuario = this.tokenservice.getUserName();

    this.formularioAtenciones = new FormGroup({
      localid: new FormControl(0),
      especialistaControl: new FormControl('', Validators.required),
      pacienteControl: new FormControl('', Validators.required),
      procedimientoControl: new FormControl('', Validators.required),
      precio: new FormControl({ value: '', disabled: true }),
    });


    this.obtenerusuario();
  }

  onSubmit(): void {
    if (this.formularioAtenciones.valid) {
      const formValues = this.formularioAtenciones.value;
      console.log('Formulario enviado con éxito:', formValues);

      // Lógica adicional para enviar los datos al backend...
    } else {
      console.log('Formulario inválido. Revise los campos.');
    }
  }


  agregarCita() {
    if (this.formularioAtenciones.valid) {
      const nuevaAtencion: Atencion = this.formularioAtenciones.value;
      this.atenciones.push(nuevaAtencion);
      this.formularioAtenciones.reset(); // Limpia el formulario
    }
  }

  quitarRegistro(index: number): void {
    this.registros.splice(index, 1);
  }


  onLocalChange(event: Event): void {
    this.formReset();
    const inputElement = event.target as HTMLInputElement;
    this.localid = Number(inputElement.value); // Asigna el valor seleccionado como número
    console.log('Local seleccionado con ID:', this.localid);
    this.obtenerPacienets(this.localid);
    this.obtenerProcedimientos(this.localid);
    this.obtenerEspecialistasActivos(this.localid);
  }

  filterEspecialistas(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filterValue = input.value.toLowerCase(); // Accediendo correctamente a 'value'

    if (filterValue === '') {
      this.filteredEspecialistas = [];
      return;
    }

    this.filteredEspecialistas = this.especialistas
      .filter(especialista => especialista.nombres.toLowerCase().includes(filterValue))
      .map(especialista => especialista.nombres);
    console.log("filter especialistas: " + this.filteredEspecialistas);
  }




  filterPacientes(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filterValue = input.value.toLowerCase();

    if (filterValue === '') {
      this.filterPacientesList = [];
      return;
    }

    this.filterPacientesList = this.pacientes
      .filter(paciente => paciente.fullname.toLowerCase().includes(filterValue))
      .map(paciente => paciente.fullname);
  }


  seleccionarProcedimiento(descripcion: string): void {
    const procedimiento = this.procedimientos.find(
      (proc) => proc.descripcion.toLowerCase() === descripcion.toLowerCase()
    );
    this.precioSeleccionado = procedimiento ? procedimiento.precio : null;
  }



  filterProcedimientos(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filterValue = input.value.toLowerCase();

    if (filterValue === '') {
      this.filteredProcedimientosList = [];
      return;
    }

    this.filteredProcedimientosList = this.procedimientos
      .filter(procedimiento => procedimiento.descripcion.toLowerCase().includes(filterValue))
      .map(procedimiento => procedimiento.descripcion);
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

  obtenerEspecialistasActivos(localId: number): void {
    this.especialistaService.obtenerActivosPorLocal(localId).subscribe({
      next: (data: Especialista[]) => { // Ajusta si tienes un modelo 'Especialista'
        if (data && Array.isArray(data)) {
          // Mapear solo los campos 'id' y 'nombres'
          this.especialistas = data.map(especialista => ({
            id: especialista.id,
            nombres: especialista.nombres,
          }));
        }
        console.log('Especialistas:', this.especialistas);
      },
      error: (err) => {
        console.error('Error al obtener especialistas activos:', err);
      },
    });
  }

  obtenerPacienets(localId: number) {
    this.pacienteService.obtenerPacientesPorLocal(localId).subscribe({
      next: (data: any) => {
        if (data && Array.isArray(data)) {
          this.pacientes = data.map((paciente: any) => ({
            id: paciente.id,
            fullname: paciente.fullname,
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
        // Mapeamos los datos y los agregamos al array existente
        const nuevosProcedimientos = data.map((procedimiento: any) => ({
          id: procedimiento.id,
          descripcion: procedimiento.descripcion,
          precio: procedimiento.precio
        }));

        // Agregar los nuevos procedimientos al array existente
        this.procedimientos.push(...nuevosProcedimientos);

        console.log('Procedimientos:', nuevosProcedimientos);
        console.log('Array actual de procedimientos:', this.procedimientos);
      },
      (error) => {
        console.error('Error al obtener procedimientos:', error);
      }
    );
  }

  formReset() {
    this.formularioAtenciones.reset();
    this.especialistas = [];
    this.pacientes = [];
    this.procedimientos = [];
    this.filteredProcedimientosList = [];
    this.filterPacientesList = [];
    this.filteredEspecialistas = [];
    this.precioSeleccionado=0;
  }
}
