import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LocalesService } from '../../service/entities/locales.service';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  usuarioForm!: FormGroup;
  passwordVisible = false;
  nombresDeRoles: string[] = [];



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

    // Suscribirse al cambio de valor del campo "roles"
    this.usuarioForm.get('roles')?.valueChanges.subscribe((nuevoValor) => {
      console.log('Nuevo rol seleccionado:', nuevoValor);
    });

    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      console.log(`Control: ${key}`);
      console.log('Valor:', control?.value);
      console.log('Estado:', control?.status);
      console.log('Errores:', control?.errors);
    });
    this.ListarRoles();
    this.ListarLocales();
  }

  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      id: 0,
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), this.dniValidator(), Validators.pattern(/^\d{8}$/)], [this.dniAsyncValidator(null)]],
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      apellidoMaterno: ['', Validators.maxLength(30)],
      celular: ['', [Validators.minLength(9), Validators.maxLength(9)]],
      direccion: ['', Validators.maxLength(255)],
      notas: ['', Validators.maxLength(255)],
      userName: ['', [Validators.required, Validators.email], [this.UserNameAsyncValidator(null)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
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
          Swal.fire('Creado', 'El usuario ha sido creado.', 'success');
          this.listarUsuarios();
          this.reset();

          // Aquí puedes agregar redirección o feedback al usuario
        },
        (error) => {
          Swal.fire('Error', 'Ocurrió un error al crear el usuario.', 'error');
          console.error('Error al crear usuario', error);
        }
      );
    }
  }

  reset(): void {

    this.selectedLocal = [];
    this.usuarioForm.reset({
      userName: '',
      password: '',
      activo: true, // Valor predeterminado para 'activo'
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      dni: '',
      celular: '',
      direccion: '',
      notas: '',
      roles: '', // Reinicia el rol seleccionado
      locales: []
    });


    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      console.log(`Control: ${key}`);
      console.log('Valor:', control?.value);
      console.log('Estado:', control?.status);
      console.log('Errores:', control?.errors);
    });
  }

  dniAsyncValidator(excludeUserId: number | null): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null); // Si el campo está vacío, no valida
      }

      return this.authservice.validarDni(control.value, excludeUserId).pipe(
        map(isAvailable => (isAvailable ? null : { dniDuplicado: true })), // Si está disponible, no hay error
        catchError(() => of(null)) // En caso de error, no marca el campo como inválido
      );
    }
  }

  dniValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dni = control.value;

      // Verifica si el DNI tiene más de 8 dígitos o es inválido por patrones
      if (dni.length > 8 || /^(.)\1{7}$/.test(dni) || /^(01234567|12345678)$/.test(dni)) {
        return { invalidDni: true }; // Retorna un error si el DNI es inválido
      }

      return null; // Retorna null si el DNI es válido
    };
  }
  restrictLength(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Permitir solo hasta 8 dígitos numéricos
    input.value = input.value.replace(/\D/g, '').slice(0, 8);

    // Sincronizar el valor del formulario reactivo
    const formControl = this.usuarioForm.get('dni');
    if (formControl) {
      formControl.setValue(input.value, { emitEvent: false });
    }
  }


  UserNameAsyncValidator(excludeUserId: number | null): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null); // Si el campo está vacío, no valida
      }

      return this.authservice.validarUsuario(control.value, excludeUserId).pipe(
        map(isAvailable => (isAvailable ? null : { UsuarioDuplicado: true })), // Si está disponible, no hay error
        catchError(() => of(null)) // En caso de error, no marca el campo como inválido
      );
    }
  }

  abrirFormularioNuevoUsuario(usuario?: NuevoUsuario) {
    if (usuario) {
      this.cargarDatosUsuario(usuario);
      this.usuarioForm.get('password')?.disable();
    } else {
      this.usuarioForm.get('password')?.enable();
    }
  }

  imrpimirForm() {
    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      console.log(`Control: ${key}`);
      console.log('Valor:', control?.value);
      console.log('Estado:', control?.status);
      console.log('Errores:', control?.errors);
    });
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

  cargarDatosUsuario(usuario: NuevoUsuario): void {

    /*   // Validar y convertir locales
     const localesArray = Array.isArray(usuario.locales)
         ? usuario.locales
         : typeof usuario.locales === 'string'
           ? usuario.locales.split(',')
           : [];
   
       this.selectedLocal = localesArray.map(local => ({ nombre: local.trim() }));
    
       const usuarioEditable = {
         ...usuario,
         activo: `${usuario.activo}` === 'Activo' // Convertir a string antes de comparar
       };
   
       // Cargar los datos del usuario en el formulario
       this.usuarioForm.setValue({
         id: usuario.id,
         dni: usuario.dni,
         nombres: usuario.nombres,
         apellidoPaterno: usuario.apellidoPaterno,
         apellidoMaterno: usuario.apellidoMaterno,
         celular: usuario.celular,
         direccion: usuario.direccion,
         notas: usuario.notas,
         userName: usuario.userName,
         password: usuario.password,
         activo: usuarioEditable.activo,
         roles: usuario.roles,
         locales: usuario.locales
       });
   */
    this.usuarioservice.obtenerUsuarioPorId(usuario.id!).subscribe(
      (data) => {
        usuario = data;
        this.selectedLocal = usuario.locales.map((local: Local) => ({
          id: local.id,
          nombre: local.nombre,
        }));
        console.table(this.selectedLocal);
        
      
        if (Array.isArray(usuario.roles)) {
          this.nombresDeRoles = usuario.roles.map(role => role.rolNombre);
        } else if (typeof usuario.roles === 'string') {
          // Si 'roles' es una cadena, podemos convertirla en un arreglo (suponiendo que los valores estén separados por comas)
          // nombresDeRoles = usuario.roles.split(','); // Separar por comas si es necesario
        }


        /*  var nombreLocales: { id: number, nombre: string }[] = [];
         nombreLocales = usuario.locales.map(local => ({
           id: local.id,
           nombre: local.nombre
         }));
         */
        // Validar y convertir locales
        /*  const localesArray = Array.isArray(usuario.locales)
           ? usuario.locales
           : typeof usuario.locales === 'string'
             ? usuario.locales.split(',')
             : [];
 
         console.log(localesArray);
         // Convertir locales a objetos con la propiedad 'nombre'
         this.selectedLocal = localesArray.map(local => ({ nombre: local.trim() }));
       */

console.log("nombreoles: "+this.nombresDeRoles);
        this.usuarioForm.setValue({
          id: usuario.id,
          dni: usuario.dni,
          nombres: usuario.nombres,
          apellidoPaterno: usuario.apellidoPaterno,
          apellidoMaterno: usuario.apellidoMaterno,
          celular: usuario.celular,
          direccion: usuario.direccion,
          notas: usuario.notas,
          userName: usuario.userName,
          password: usuario.password,
          activo: usuario.activo,
          roles: this.nombresDeRoles,
          locales: usuario.locales
        });

      },
      (error) => {
        console.error('Error al obtener el usuario:', error);  // Manejo de errores
      }
    );


    // Actualizar dinámicamente el validador asíncrono del campo 'dni'
    this.usuarioForm.get('dni')?.setAsyncValidators(this.dniAsyncValidator(usuario.id!));
    this.usuarioForm.get('dni')?.updateValueAndValidity();

    this.usuarioForm.get('userName')?.setAsyncValidators(this.UserNameAsyncValidator(usuario.id!));
    this.usuarioForm.get('userName')?.updateValueAndValidity();
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

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


  editarUsuario(): void {

    if (this.usuarioForm.valid) {
      const usuario = this.usuarioForm.value;  
      const rolesArray = [usuario.roles]; 
      const usuarioActualizado = {
        ...usuario,  // Mantén el resto de los campos del usuario
        locales: this.selectedLocal.map(local => local.id),  // Extrae solo los IDs
        roles:rolesArray
      };

      this.usuarioservice.editarUsuario(usuarioActualizado).subscribe(
        (response) => {
          console.log('Usuario actualizado exitosamente:', response);
          this.listarUsuarios();
          Swal.fire('Actualizado', 'El usuario ha sido actualizado.', 'success');
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
          Swal.fire('Error', 'Ocurrió un error al actualizar el usuario.', 'error');
        }
      );


    }

    /*  // Eliminar la contraseña del objeto antes de enviarlo
      delete usuario.password;
      //console.log(usuario);

      this.usuarioservice.editarUsuario(usuario).subscribe(
        (response) => {
          console.log('Usuario actualizado exitosamente:', response);
          // Redirigir o realizar alguna acción después de la actualización, como mostrar un mensaje
          Swal.fire('Actualizado', 'El usuario ha sido actualizado.', 'success');
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
          Swal.fire('Error', 'Ocurrió un error al actualizar el usuario.', 'error');

          // Aquí puedes mostrar un mensaje de error
        }
      );
    } else {
      console.log('Formulario inválido');
    }*/
  }


  // Método para obtener los usuarios
  /*obtenerUsuarios(): void {
      this.usuarioservice.listarUsuarios().subscribe(data => {
        this.usuarios = data;
      });
    }*/
  /*
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
  
  */

}

interface Local {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  locales: Local[];
  // Otras propiedades de usuario si las hay
}
