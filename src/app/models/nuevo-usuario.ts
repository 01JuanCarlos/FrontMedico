export class NuevoUsuario {
  id?: number;
  userName: string;
  password: string;
  activo: boolean;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  dni: string;
  celular?: string;
  direccion?: string;
  notas?: string;
  fechaReg: Date;
  usuarioAct?: number;
  fechaAct?: Date;
  roles:  string | string[] = [];;
  locales: string | string[] = [];

  constructor(
    userName: string,
    password: string,
    activo: boolean,
    nombres: string,
    apellidoPaterno: string,
    dni: string,
    roles: string | string[] = [],// Obligatorio
    locales: string | string[] = [],
    fechaReg: Date, // Obligatorio
    apellidoMaterno?: string, // Opcional
    celular?: string, // Opcional
    direccion?: string, // Opcional
    notas?: string, // Opcional
    usuarioAct?: number, // Opcional
    fechaAct?: Date, // Opcional
    id?: number // Opcional
  ) {
    this.id = id;
    this.userName = userName;
    this.password = password;
    this.activo = activo;
    this.nombres = nombres;
    this.apellidoPaterno = apellidoPaterno;
    this.apellidoMaterno = apellidoMaterno;
    this.dni = dni;
    this.celular = celular;
    this.direccion = direccion;
    this.notas = notas;
    this.fechaReg = fechaReg;
    this.usuarioAct = usuarioAct;
    this.fechaAct = fechaAct;
    this.roles = roles;
    this.locales = locales;
  }
}
