import { Component, OnInit } from '@angular/core';
import { LocalesService } from '../../service/entities/locales.service';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../service/entities/usuario.service';
import Swal from 'sweetalert2';
import { RolService } from '../../service/entities/rol.service';
import { AuthService } from '../../service/security/auth.service';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { NuevoUsuario } from '../../models/nuevo-usuario';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = []; // Aquí se almacenará la lista de usuarios
  errorMessage: string = '';
  locales: any[] = []; // Lista de locales
  selectedLocal: any[] = [];// Local seleccionado
  roles: any[] = [];
  selectedRol: any = '';
  usuarioForm!: FormGroup;

  constructor(private localService: LocalesService,
    private usuarioservice: UsuarioService,
    private authservice: AuthService,
    private rolservice: RolService,
    private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.listarUsuarios();
    this.inicializarFormulario();

    this.usuarioForm.get('userName')?.valueChanges.subscribe(() => {
      this.usuarioForm.get('userName')?.updateValueAndValidity({ emitEvent: false });
    });

    this.usuarioForm.get('dni')?.valueChanges.subscribe(() => {
      this.usuarioForm.get('dni')?.updateValueAndValidity({ emitEvent: false });
    });

/*
    // Actualiza las validaciones asíncronas en tiempo real
    this.usuarioForm.get('userName')?.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.usuarioForm.get('userName')?.updateValueAndValidity();
    });

    this.usuarioForm.get('dni')?.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.usuarioForm.get('dni')?.updateValueAndValidity();
    });
*/
  }




  // Inicializar el formulario
  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)],[this.DniValidator()]],
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      apellidoMaterno: ['', Validators.maxLength(30)],
      celular: ['', Validators.maxLength(30)],
      direccion: ['', Validators.maxLength(255)],
      notas: ['', Validators.maxLength(255)],
      userName: ['', [Validators.required, Validators.email],[this.userNameValidator()]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
      activo: ['', Validators.required],
      roles: ['', Validators.required],
      locales: ['', Validators.required]
    });
  }



  crearUsuario(): void {

    if (this.usuarioForm.valid) {
      // Asegúrate de convertir los locales seleccionados a un array de IDs
      const localesSeleccionados = this.selectedLocal.map(local => local.id);  // Extrae solo los IDs

      // Construir el objeto a enviar según el formato deseado
      const nuevoUsuario = {
        userName: this.usuarioForm.value.userName,  // Tomar el valor del campo username
        password: this.usuarioForm.value.password,  // Tomar el valor del campo password
        activo: this.usuarioForm.value.activo,      // Tomar el valor del campo activo
        nombres: this.usuarioForm.value.nombres,   // Tomar el valor del campo nombres
        apellidoPaterno: this.usuarioForm.value.apellidoPaterno,  // Tomar el valor del campo apellidoPaterno
        apellidoMaterno: this.usuarioForm.value.apellidoMaterno,  // Tomar el valor del campo apellidoMaterno
        dni: this.usuarioForm.value.dni,  // Tomar el valor del campo dni
        celular: this.usuarioForm.value.celular,  // Tomar el valor del campo celular
        direccion: this.usuarioForm.value.direccion,  // Tomar el valor del campo direccion
        notas: this.usuarioForm.value.notas,  // Tomar el valor del campo notas
        roles: [this.usuarioForm.value.roles],   // Enviar roles como un array, ya que se envía como una lista
        fechaReg: new Date(),
        locales: localesSeleccionados  // Asegúrate de enviar solo los IDs de los locales
      };
      console.log(nuevoUsuario);
      // Llamar al servicio para crear el usuario
      this.authservice.nuevo(nuevoUsuario).subscribe(
        (response) => {
          console.log('Usuario creado con éxito', response);
          this.listarUsuarios();
          this.reset();

          // Aquí puedes agregar redirección o feedback al usuario
        },
        (error) => {
          console.error('Error al crear usuario', error);
        }
      );
    }
  }

  // Limpiar el formulario
  reset(): void {
    this.usuarioForm.reset({
      userName: '',
      password: '',
      activo: true,  // Establece el valor predeterminado para 'activo'
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      dni: '',
      celular: '',
      direccion: '',
      notas: '',
      roles: [''],
      locales: []
    });
    this.selectedRol = '';
    this.selectedLocal = [];

  }
  
 /*   // Validación asíncrona para userName
    userNameValidator(): AsyncValidatorFn {
      return (control: AbstractControl) => {
        if (!control.value) {
          return of(null); // Si no hay valor, no validamos
        }
  
        return this.authservice.existsByUserName(control.value).pipe(
          debounceTime(500), // Retrasa la ejecución para evitar llamadas excesivas
          switchMap((exists) => exists ? of({ userNameExists: true }) : of(null)),
          catchError(() => of(null)) // Si hay un error en la llamada, se trata como válido
        );
      };
    }
  */

    userNameValidator(): AsyncValidatorFn {
      return (control: AbstractControl) => {
        if (!control.value) {
          return of(null); // Si no hay valor, no validamos
        }
    
        return this.authservice.existsByUserName(control.value).pipe(
          debounceTime(500), // Retrasa la ejecución para evitar llamadas excesivas
          switchMap((exists) => exists ? of({ userNameExists: true }) : of(null)),
          catchError(() => of(null)) // Si hay un error en la llamada, se trata como válido
        );
      };
    }
    
    // Validación asíncrona para DNI
    DniValidator(): AsyncValidatorFn {
      return (control: AbstractControl) => {
        if (!control.value) {
          return of(null); // Si no hay valor, no validamos
        }
    
        return this.authservice.existsByDNI(control.value).pipe(
          debounceTime(500), // Retrasa la ejecución para evitar llamadas excesivas
          switchMap((exists) => exists ? of({ DniExists: true }) : of(null)),
          catchError(() => of(null)) // Si hay un error en la llamada, se trata como válido
        );
      };
    }


/*
  userNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null); // Si el campo está vacío, se considera válido
      }

      return this.authservice.existsByUserName(control.value).pipe(
        debounceTime(500), // Opcional: Añade un retraso para optimizar la llamada
        switchMap((exists: boolean) => exists ? of({ userNameExists: true }) : of(null)), // Emite un error si existe
        catchError(() => of(null)) // Ignora errores y considera el campo válido
      );
    };
  }
*/
 /* DniValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null); // Si el campo está vacío, se considera válido
      }

      return this.authservice.existsByDNI(control.value).pipe(
        debounceTime(500),
        switchMap((exists: boolean) => exists ? of({ DniExists: true }) : of(null)), // Emite un error si existe
        catchError(() => of(null))
      );
    };
  }*/



  abrirFormularioNuevoUsuario(usuario?: NuevoUsuario){
    console.log("formulario abierto");
    if (usuario) {
      this.cargarDatosUsuario(usuario);
      console.log("edicion");
    } else {
      this.ListarRoles();
      this.ListarLocales();
      console.log(" abrirFormularioNuevoUsuario");
    }

  }

  listarUsuarios(): void {
    this.usuarioservice.listarUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data.map((usuario: any) => ({
          id: usuario.id,
          nombres: usuario.nombres,
          apellidoPaterno: usuario.apellidoPaterno,
          apellidoMaterno: usuario.apellidoMaterno,
          userName: usuario.userName,
          dni: usuario.dni,
          celular: usuario.celular,
          direccion: usuario.direccion,
          notas: usuario.notas,
          password: usuario.password,

          roles: usuario.roles.map((rol: any) => rol.rolNombre).join(', '), // Combinar roles
          locales: usuario.locales.map((local: any) => local.nombre).join(', '), // Combinar sucursales
          activo: usuario.activo ? 'Activo' : 'Inactivo'
        }));
      },
      error: (err) => console.error(err)
    });
  }

  ListarLocales() {
    this.localService.obtenerLocales().subscribe(
      (data) => {
        this.locales = data; // Asigna los datos obtenidos del servicio
      },
      (error) => {
        console.error('Error al obtener los locales:', error);
      }
    );
  }

  ListarRoles() {
    this.rolservice.obtenerRoles().subscribe(
      (data) => {
        this.roles = data; // Asigna los datos obtenidos del servicio
      },
      (error) => {
        console.error('Error al obtener los roles:', error);
      }
    );
  }

  // Método para obtener los usuarios
  obtenerUsuarios(): void {
    this.usuarioservice.listarUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  cargarDatosUsuario(usuario: NuevoUsuario): void {
    console.log(usuario);
    // Validar y convertir roles
    const rolesArray = Array.isArray(usuario.roles)
      ? usuario.roles.map((rol: string) => rol.trim()) // Aplicar trim a cada elemento
      : typeof usuario.roles === 'string'
        ? usuario.roles.split(',').map((rol: string) => rol.trim()) // Si es string, lo dividimos y aplicamos trim
        : []; // Valor por defecto si no es cadena ni array

    // Validar y convertir locales
    const localesArray = Array.isArray(usuario.locales)
      ? usuario.locales
      : typeof usuario.locales === 'string'
        ? usuario.locales.split(',')
        : [];

    // Convertir locales a objetos con la propiedad 'nombre'
    this.selectedLocal = localesArray.map(local => ({ nombre: local.trim() }));

    const usuarioEditable = {
      ...usuario,
      activo: `${usuario.activo}` === 'Activo' // Convertir a string antes de comparar
    };
    this.selectedRol = usuario.roles;
    console.log("ROL: " + this.selectedRol);

    // Actualizar el formulario
    this.usuarioForm.patchValue({
      dni: usuario.dni,
      nombres: usuario.nombres,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
      celular: usuario.celular,
      direccion: usuario.direccion,
      notas: usuario.notas,
      userName: usuario.userName,
      password: usuario.password,
      activo: usuarioEditable.activo, // Esto debería funcionar si 'activo' es un valor booleano
      roles: this.selectedRol, // Aquí pasamos el valor directamente, no el objeto
      locales: this.selectedLocal
    });

  }




  // Método para editar usuario (se puede utilizar el submit del formulario)
  /* editarUsuario(): void {
     if (this.usuarioForm.valid) {
       // Aquí puedes enviar los datos al backend
       const usuario = this.usuarioForm.value;
       console.log('Usuario a editar', usuario);
       // this.usuarioService.editarUsuario(usuario);
     }
   }*/

  eliminarUsuario(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás recuperar este usuario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioservice.eliminarUsuario(id).subscribe(
          response => {
            // Elimina el usuario de la lista en el frontend
            this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
            Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
          },
          error => {
            Swal.fire('Error', 'Ocurrió un error al eliminar el usuario.', 'error');
          }
        );
      }
    });
  }


  // Método para eliminar un local de la lista de localesSeleccionados
  eliminarLocal(index: number): void {
    this.selectedLocal.splice(index, 1);
  }


  agregarLocal(): void {
    /* const localSeleccionado = this.locales.find(local => local.id === Number(this.usuarioForm.get('locales')?.value));
     console.log('Resultado de find:', localSeleccionado);
     
 
     if (localSeleccionado && !this.selectedLocal.some(local => local.id === localSeleccionado.id)) {
       this.selectedLocal.push(localSeleccionado);
       console.log('Local agregado:', localSeleccionado);
     } else {
       console.error('Este local ya está seleccionado o no existe.');
     }*/

    const localSeleccionado = this.locales.find(local => local.id === Number(this.usuarioForm.get('locales')?.value));
    if (localSeleccionado && !this.selectedLocal.some(local => local.id === localSeleccionado.id)) {
      this.selectedLocal.push(localSeleccionado);
      console.log('Local agregado:', localSeleccionado);
    } else {
      console.error('Este local ya está seleccionado o no existe.');
    }


  }


}